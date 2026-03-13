# Code Templates

## API route template (cost-efficient)

```ts
import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongoose";
import {
  resolveSearchRequester,
  runCachedSearch,
  SearchRateLimitError,
} from "@/lib/search/query-cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDb();
    const requester = await resolveSearchRequester(null);

    const data = await runCachedSearch({
      namespace: "module-action",
      params: { version: 1 },
      ttlMs: 10 * 60 * 1000,
      emptyTtlMs: 2 * 60 * 1000,
      rateLimit: { identifier: requester, scope: "module-action", limit: 20, windowMs: 60_000 },
      execute: async () => {
        // External call with timeout/retry/page cap.
        return [];
      },
    });

    return NextResponse.json({ ok: true, data });
  } catch (error: any) {
    if (error instanceof SearchRateLimitError) {
      return NextResponse.json(
        { ok: false, error: "Rate limited", retryAfterMs: error.retryAfterMs },
        { status: 429 },
      );
    }
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
```

## Server action template

```ts
"use server";

import { getCurrentUser } from "@/lib/actions";
import { connectToDb } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";

export async function saveSomething(input: string) {
  const normalized = input?.trim();
  if (!normalized) return { ok: false, error: "Invalid input" };

  await connectToDb();

  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Unauthorized", requiresAuth: true };

  const existing = await Product.findOne({ url: normalized }, { _id: 1 });
  if (existing) return { ok: true, id: String(existing._id), alreadyExists: true };

  const created = await Product.create({ url: normalized });
  return { ok: true, id: String(created._id) };
}
```

## Cron template

```ts
import { NextResponse } from "next/server";

export const maxDuration = 60;

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (process.env.NODE_ENV !== "production") return true;
  return Boolean(secret && auth === `Bearer ${secret}`);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Idempotent update logic only.
  return NextResponse.json({ ok: true });
}
```
