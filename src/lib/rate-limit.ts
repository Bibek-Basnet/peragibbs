import "server-only";

/**
 * Fixed-window in-memory rate limiter.
 *
 * Deliberately simple: this site runs as a single instance, and the forms it
 * guards are low volume. If you move to multiple instances or a serverless
 * platform that spins up many workers, swap the Map for Redis/Upstash - the
 * call sites do not need to change.
 */
type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

// Stop the map growing without bound on a long-lived server.
const MAX_KEYS = 10_000;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size > MAX_KEYS) {
      for (const [k, v] of buckets) {
        if (v.resetAt <= now) buckets.delete(k);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);

  if (existing.count > limit) {
    return { ok: false, remaining: 0, retryAfterSeconds };
  }

  return {
    ok: true,
    remaining: limit - existing.count,
    retryAfterSeconds,
  };
}

/** Best-effort client IP behind common proxy headers. */
export function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return (
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    "unknown"
  );
}
