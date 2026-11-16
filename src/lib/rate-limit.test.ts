import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const MINUTE = 60_000
const WINDOW = 10 * MINUTE

// The limiter keeps module-level state, so every test loads a fresh copy.
async function load() {
  vi.resetModules()
  return import("./rate-limit")
}

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"))
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("allows five requests per key, then blocks with the time left", async () => {
    const { rateLimit } = await load()

    for (let i = 0; i < 5; i++) {
      expect(rateLimit("1.1.1.1")).toEqual({ ok: true, retryAfterMs: 0 })
    }

    vi.advanceTimersByTime(4 * MINUTE)
    expect(rateLimit("1.1.1.1")).toEqual({
      ok: false,
      retryAfterMs: 6 * MINUTE,
    })
  })

  it("tracks keys independently", async () => {
    const { rateLimit } = await load()

    for (let i = 0; i < 5; i++) rateLimit("1.1.1.1")

    expect(rateLimit("1.1.1.1").ok).toBe(false)
    expect(rateLimit("2.2.2.2").ok).toBe(true)
  })

  it("starts a new window once the old one has passed", async () => {
    const { rateLimit } = await load()

    for (let i = 0; i < 6; i++) rateLimit("1.1.1.1")
    vi.advanceTimersByTime(WINDOW + 1)

    expect(rateLimit("1.1.1.1")).toEqual({ ok: true, retryAfterMs: 0 })
    // ...and that window has its own full allowance.
    for (let i = 0; i < 4; i++) expect(rateLimit("1.1.1.1").ok).toBe(true)
    expect(rateLimit("1.1.1.1").ok).toBe(false)
  })

  it("drops expired keys instead of growing forever", async () => {
    const { rateLimit, rateLimitSize } = await load()

    for (let i = 0; i < 600; i++) rateLimit(`old-${i}`)
    expect(rateLimitSize()).toBe(600)

    vi.advanceTimersByTime(WINDOW + 1)
    rateLimit("new")

    expect(rateLimitSize()).toBe(1)
  })

  it("never drops a key whose window is still open", async () => {
    const { rateLimit, rateLimitSize } = await load()

    for (let i = 0; i < 5; i++) rateLimit("blocked")
    for (let i = 0; i < 600; i++) rateLimit(`filler-${i}`)

    expect(rateLimitSize()).toBe(601)
    expect(rateLimit("blocked").ok).toBe(false)
  })
})
