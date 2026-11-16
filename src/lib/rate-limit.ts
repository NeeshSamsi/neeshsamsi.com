/**
 * Fixed-window in-memory rate limiter.
 *
 * Caveats:
 * - State lives in the Node.js process, so it resets on redeploy and is
 *   per-instance on a multi-instance deployment. That's fine for blocking
 *   casual abuse of a low-traffic contact form; if this ever needs to be
 *   rigorous, swap in Upstash Redis + @upstash/ratelimit.
 */

type Bucket = { count: number; windowStart: number }

const buckets = new Map<string, Bucket>()

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS = 5

// Keys come from a request header, so the map would otherwise grow by one
// entry per distinct value for the life of the process. Past this size,
// expired buckets are dropped whenever a new one is added.
const SWEEP_THRESHOLD = 500

function sweepExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS) buckets.delete(key)
  }
}

export function rateLimit(key: string): { ok: boolean; retryAfterMs: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    if (buckets.size >= SWEEP_THRESHOLD) sweepExpired(now)
    buckets.set(key, { count: 1, windowStart: now })
    return { ok: true, retryAfterMs: 0 }
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { ok: false, retryAfterMs: WINDOW_MS - (now - bucket.windowStart) }
  }

  bucket.count += 1
  return { ok: true, retryAfterMs: 0 }
}

/** Number of tracked keys. Exposed for tests. */
export function rateLimitSize() {
  return buckets.size
}
