import { createHash } from 'crypto';
import { headers } from 'next/headers';
import SearchCache from '@/lib/models/searchCache.model';
import SearchRateLimit from '@/lib/models/searchRateLimit.model';
import { connectToDb } from '@/lib/mongoose';

type CacheRecord<T> = {
  value: T;
  expiresAt: number;
};

type RateLimitOptions = {
  identifier: string;
  scope: string;
  limit: number;
  windowMs: number;
};

type CachedSearchOptions<T> = {
  namespace: string;
  params: Record<string, unknown>;
  ttlMs: number;
  emptyTtlMs?: number;
  lockMs?: number;
  waitForCacheMs?: number;
  waitPollMs?: number;
  rateLimit?: RateLimitOptions;
  execute: () => Promise<T>;
};

type SearchCacheDocument = {
  key: string;
  namespace: string;
  value: unknown;
  expiresAt: Date | string;
  lockedUntil?: Date | string | null;
};

type RateLimitState = {
  allowed: boolean;
  retryAfterMs: number;
};

type GlobalSearchState = typeof globalThis & {
  __searchMemoryCache?: Map<string, CacheRecord<unknown>>;
  __searchInflightCache?: Map<string, Promise<unknown>>;
};

const globalSearchState = globalThis as GlobalSearchState;
const memoryCache =
  globalSearchState.__searchMemoryCache || new Map<string, CacheRecord<unknown>>();
const inflightCache =
  globalSearchState.__searchInflightCache || new Map<string, Promise<unknown>>();

if (!globalSearchState.__searchMemoryCache) {
  globalSearchState.__searchMemoryCache = memoryCache;
}

if (!globalSearchState.__searchInflightCache) {
  globalSearchState.__searchInflightCache = inflightCache;
}

export class SearchRateLimitError extends Error {
  retryAfterMs: number;

  constructor(message: string, retryAfterMs: number) {
    super(message);
    this.name = 'SearchRateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}

const stableSerialize = (value: unknown): string => {
  if (value === null || value === undefined) return String(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableSerialize(item)}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
};

const hasMeaningfulValue = (value: unknown) => {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }
  return Boolean(value);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const pruneMemoryEntry = (key: string) => {
  const cached = memoryCache.get(key);
  if (!cached) return null;
  if (cached.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return cached;
};

const getHeaderStore = async () => {
  const maybeHeaders = headers() as unknown as Headers | Promise<Headers>;
  if (typeof (maybeHeaders as Promise<Headers>).then === 'function') {
    return (await maybeHeaders) as Headers;
  }
  return maybeHeaders as Headers;
};

const getClientIp = async () => {
  try {
    const headerStore = await getHeaderStore();
    const forwardedFor = headerStore.get('x-forwarded-for');
    if (forwardedFor) return forwardedFor.split(',')[0]?.trim() || '';
    return (
      headerStore.get('x-real-ip')
      || headerStore.get('cf-connecting-ip')
      || ''
    ).trim();
  } catch {
    return '';
  }
};

const consumeRateLimit = async ({
  identifier,
  scope,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitState> => {
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs);
  const retryAfterMs = windowStart.getTime() + windowMs - now;
  const expiresAt = new Date(windowStart.getTime() + windowMs * 2);

  try {
    const entry = await SearchRateLimit.findOneAndUpdate(
      { identifier, scope, windowStart },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt },
      },
      {
        upsert: true,
        new: true,
      },
    ).lean() as { count?: number } | null;

    const count = Number(entry?.count || 0);
    return {
      allowed: count <= limit,
      retryAfterMs,
    };
  } catch (error: any) {
    if (error?.code === 11000) {
      return consumeRateLimit({ identifier, scope, limit, windowMs });
    }
    throw error;
  }
};

const tryAcquireLock = async (
  key: string,
  namespace: string,
  lockMs: number,
) => {
  const now = new Date();
  const lockedUntil = new Date(Date.now() + lockMs);

  try {
    const doc = await SearchCache.findOneAndUpdate(
      {
        key,
        $or: [
          { lockedUntil: null },
          { lockedUntil: { $exists: false } },
          { lockedUntil: { $lte: now } },
        ],
      },
      {
        $set: { namespace, lockedUntil },
        $setOnInsert: {
          value: null,
          expiresAt: lockedUntil,
        },
      },
      {
        upsert: true,
        new: true,
      },
    ).lean() as SearchCacheDocument | null;

    return Boolean(doc);
  } catch (error: any) {
    if (error?.code === 11000) return false;
    throw error;
  }
};

const waitForDatabaseCache = async <T>(
  key: string,
  maxWaitMs: number,
  pollMs: number,
) => {
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const fresh = await SearchCache.findOne({
      key,
      expiresAt: { $gt: new Date() },
    }).lean() as SearchCacheDocument | null;

    if (fresh && fresh.value !== null && fresh.value !== undefined) {
      return fresh.value as T;
    }

    await sleep(pollMs);
  }

  return null;
};

const persistCacheValue = async <T>(
  key: string,
  namespace: string,
  value: T,
  ttlMs: number,
  clearLock = true,
) => {
  const expiresAt = new Date(Date.now() + ttlMs);

  await SearchCache.findOneAndUpdate(
    { key },
    {
      $set: {
        namespace,
        value,
        expiresAt,
        ...(clearLock ? { lockedUntil: null } : {}),
      },
    },
    { upsert: true, new: true },
  );
};

const releaseLock = async (key: string) => {
  await SearchCache.findOneAndUpdate(
    { key },
    {
      $set: {
        lockedUntil: null,
      },
    },
    { new: true },
  );
};

export const buildDeterministicSearchKey = (
  namespace: string,
  params: Record<string, unknown>,
) =>
  createHash('sha256')
    .update(`${namespace}:${stableSerialize(params)}`)
    .digest('hex');

export const resolveSearchRequester = async (userKey?: string | null) => {
  if (userKey) return `user:${userKey.trim().toLowerCase()}`;

  const ip = await getClientIp();
  if (ip) return `ip:${ip}`;

  return 'anonymous';
};

export const runCachedSearch = async <T>({
  namespace,
  params,
  ttlMs,
  emptyTtlMs = Math.min(ttlMs, 2 * 60 * 1000),
  lockMs = 15 * 1000,
  waitForCacheMs = 8 * 1000,
  waitPollMs = 250,
  rateLimit,
  execute,
}: CachedSearchOptions<T>): Promise<T> => {
  const key = buildDeterministicSearchKey(namespace, params);
  const memoryHit = pruneMemoryEntry(key);

  if (memoryHit) {
    return memoryHit.value as T;
  }

  await connectToDb();

  const dbHit = await SearchCache.findOne({
    key,
    expiresAt: { $gt: new Date() },
  }).lean() as SearchCacheDocument | null;

  if (dbHit && dbHit.value !== null && dbHit.value !== undefined) {
    memoryCache.set(key, {
      value: dbHit.value,
      expiresAt: new Date(dbHit.expiresAt).getTime(),
    });
    return dbHit.value as T;
  }

  const inflightHit = inflightCache.get(key);
  if (inflightHit) {
    return inflightHit as Promise<T>;
  }

  const workPromise = (async () => {
    if (rateLimit) {
      const rateState = await consumeRateLimit(rateLimit);
      if (!rateState.allowed) {
        throw new SearchRateLimitError(
          'Too many search requests. Please retry shortly.',
          rateState.retryAfterMs,
        );
      }
    }

    const lockAcquired = await tryAcquireLock(key, namespace, lockMs);
    const ownsLock = lockAcquired;

    if (!lockAcquired) {
      const waitedValue = await waitForDatabaseCache<T>(key, waitForCacheMs, waitPollMs);
      if (waitedValue !== null) {
        const cachedTtlMs = hasMeaningfulValue(waitedValue) ? ttlMs : emptyTtlMs;
        memoryCache.set(key, {
          value: waitedValue,
          expiresAt: Date.now() + cachedTtlMs,
        });
        return waitedValue;
      }
    }

    try {
      const value = await execute();
      const effectiveTtlMs = hasMeaningfulValue(value) ? ttlMs : emptyTtlMs;

      memoryCache.set(key, {
        value,
        expiresAt: Date.now() + effectiveTtlMs,
      });

      await persistCacheValue(key, namespace, value, effectiveTtlMs, ownsLock);

      return value;
    } catch (error) {
      if (ownsLock) {
        await releaseLock(key);
      }
      throw error;
    }
  })();

  inflightCache.set(key, workPromise);

  try {
    return await workPromise;
  } finally {
    inflightCache.delete(key);
  }
};
