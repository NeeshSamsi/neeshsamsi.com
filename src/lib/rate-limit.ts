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

export function rateLimit(key: string): { ok: boolean; retryAfterMs: number } {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now })
    return { ok: true, retryAfterMs: 0 }
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { ok: false, retryAfterMs: WINDOW_MS - (now - bucket.windowStart) }
  }

  bucket.count += 1
  return { ok: true, retryAfterMs: 0 }
}
