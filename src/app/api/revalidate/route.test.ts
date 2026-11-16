import { beforeEach, describe, expect, it, vi } from "vitest"

const env = vi.hoisted(() => ({
  PRISMIC_WEBHOOK_SECRET: undefined as string | undefined,
}))
const revalidateTag = vi.hoisted(() => vi.fn())

vi.mock("@/lib/env", () => ({ env }))
vi.mock("next/cache", () => ({ revalidateTag }))

import { POST } from "./route"

function webhook(body?: unknown) {
  return new Request("https://www.example.com/api/revalidate", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  })
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateTag.mockReset()
    env.PRISMIC_WEBHOOK_SECRET = undefined
  })

  it("revalidates Prismic content when no secret is configured", async () => {
    const res = await POST(webhook({ type: "api-update" }))

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ revalidated: true })
    expect(revalidateTag).toHaveBeenCalledWith("prismic", { expire: 0 })
  })

  describe("with a secret configured", () => {
    beforeEach(() => {
      env.PRISMIC_WEBHOOK_SECRET = "s3cret-value"
    })

    it("accepts a webhook carrying the secret", async () => {
      const res = await POST(
        webhook({ type: "api-update", secret: "s3cret-value" }),
      )

      expect(res.status).toBe(200)
      expect(revalidateTag).toHaveBeenCalledTimes(1)
    })

    it.each([
      ["no secret", { type: "api-update" }],
      ["the wrong secret", { secret: "s3cret-valuX" }],
      ["a secret of another length", { secret: "s3cret" }],
      ["a non-string secret", { secret: 12345 }],
      ["a null body", null],
      ["a body that is not JSON", "not json"],
    ])("refuses %s", async (_label, body) => {
      const res = await POST(webhook(body))

      expect(res.status).toBe(401)
      expect(await res.json()).toEqual({ revalidated: false })
      expect(revalidateTag).not.toHaveBeenCalled()
    })
  })
})
