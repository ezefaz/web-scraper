---
name: backend-cost-efficiency
description: Standardize Savemelin backend functions for minimum cost and high efficiency with deterministic cache keys, request deduplication, rate limiting, and bounded third-party API usage. Use when creating or refactoring server actions, API routes, or cron jobs under app/actions, app/api, and lib/scraper integrations.
---

# Backend Cost Efficiency

## Overview

Apply one backend contract across actions/routes/cron to reduce API spend, avoid duplicate work, and protect DB/runtime limits.

## Source Patterns

- `lib/search/query-cache.ts`
- `app/actions/create-product.ts`
- `app/api/cron/dolar-weekly/route.ts`

## Backend Contract (required order)

1. Validate input early and normalize keys/URLs.
2. Connect DB once (`connectToDb`) before reads/writes.
3. Resolve requester (`user` first, then `ip`) for control decisions.
4. Apply rate limit before expensive calls.
5. Check cache/dedup lock before external scrapes.
6. Call external provider with bounded retries/timeouts.
7. Persist only needed fields (projection + minimal writes).
8. Return typed payload with `ok`, `error`, and optional `retryAfterMs`.
9. Emit structured log tag (`[MODULE_ACTION]`) on failure paths.

## Rate Limiting Rules

- Use scope-specific limit windows, never global-only.
- Recommended defaults:
  - Search endpoints: `20 req / 60s` per requester.
  - Save/follow actions: `10 req / 60s`.
  - Cron routes: secret auth + schedule, no public execution path.
- On block, throw/return with `retryAfterMs`.

## Caching and Deduplication Rules

- Build deterministic keys from namespace + stable params.
- Use short TTL for empty results (`emptyTtlMs`) and longer TTL for successful payloads.
- Use lock window to prevent cache stampede (`lockMs`).
- Prefer stale-safe responses over duplicate expensive calls.
- For repeated URL/product scrapes, upsert once and reuse DB result.

## External API Cost Controls

- Add a per-provider budget guard:
  - max calls per request
  - max pages per search
  - max concurrent calls
- Store provider name and response timestamp with records for audit.
- If provider cost is high, cache first and degrade gracefully (partial results).
- Never paginate by default; require explicit business reason.

## DB Efficiency Rules

- Always use projection (`find({}, {needed:1})`) on large collections.
- Always use `.limit(...)` and deterministic sort for listing APIs.
- Use bulk updates for cron workloads.
- Avoid N+1 loops over documents when one query can aggregate.

## Cron Rules

- Keep weekly/daily frequency unless strong need for higher cadence.
- Protect with `CRON_SECRET` in production.
- Keep `maxDuration <= 60` on Hobby.
- Write idempotent logic (safe to re-run).

## Apply This Skill When

- Adding a new endpoint that calls scrapers or third-party APIs.
- Refactoring server actions that currently duplicate DB/API work.
- Implementing premium-only providers with strict budget control.
- Creating cron jobs that update product or currency data.

## Templates

Read [references/code-templates.md](references/code-templates.md) for minimal templates:
- API route template (rate limit + cache + cost guard)
- Server action template (auth + upsert + dedup)
- Cron template (secret auth + idempotent update)

## Review Checklist

- [ ] Input is normalized and validated before DB/API calls.
- [ ] Requester-based rate limit applied.
- [ ] Cache key deterministic and namespace-scoped.
- [ ] External calls bounded (retry/timeout/page cap).
- [ ] DB query has projection, limit, and sort.
- [ ] Error payload is structured and observable.
