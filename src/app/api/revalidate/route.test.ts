import { beforeEach, describe, expect, it, vi } from "vitest"

const env = vi.hoisted(() => ({
  PRISMIC_WEBHOOK_SECRET: undefined as string | undefined,
}))
const revalidatePrismicPages = vi.hoisted(() => vi.fn())
const revalidateTag = vi.hoisted(() => vi.fn())

vi.mock("@/lib/env", () => ({ env }))
vi.mock("@prismicio/next", () => ({ revalidatePrismicPages }))
vi.mock("next/cache", () => ({ revalidateTag }))

import { PRISMIC_LISTS_TAG } from "@/lib/prismic"
import { POST } from "./route"

function webhook(body?: unknown) {
  return new Request("https://www.example.com/api/revalidate", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
  })
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidatePrismicPages.mockReset()
    revalidateTag.mockReset()
    env.PRISMIC_WEBHOOK_SECRET = undefined
  })

  it("revalidates the changed documents when no secret is configured", async () => {
    const res = await POST(
      webhook({ type: "api-update", documents: ["doc-1", "doc-2"] }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ revalidated: true })
    expect(revalidatePrismicPages).toHaveBeenCalledWith(["doc-1", "doc-2"])
  })

  it("refreshes every list, so a newly published document shows up", async () => {
    await POST(webhook({ type: "api-update", documents: ["new-doc"] }))

    expect(revalidateTag).toHaveBeenCalledWith(PRISMIC_LISTS_TAG, {
      expire: 0,
    })
  })

  it.each([
    ["another webhook type", { type: "test-trigger", documents: ["doc-1"] }],
    ["an update without a document list", { type: "api-update" }],
    ["a body that is not JSON", "not json"],
  ])("clears nothing for %s", async (_label, body) => {
    const res = await POST(webhook(body))

    expect(res.status).toBe(200)
    expect(revalidatePrismicPages).not.toHaveBeenCalled()
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  describe("with a secret configured", () => {
    beforeEach(() => {
      env.PRISMIC_WEBHOOK_SECRET = "s3cret-value"
    })

    it("accepts a webhook carrying the secret", async () => {
      const res = await POST(
        webhook({
          type: "api-update",
          secret: "s3cret-value",
          documents: ["doc-1"],
        }),
      )

      expect(res.status).toBe(200)
      expect(revalidatePrismicPages).toHaveBeenCalledWith(["doc-1"])
    })

    it.each([
      ["no secret", { type: "api-update", documents: ["doc-1"] }],
      ["the wrong secret", { secret: "s3cret-valuX" }],
      ["a secret of another length", { secret: "s3cret" }],
      ["a non-string secret", { secret: 12345 }],
      ["a null body", null],
      ["a body that is not JSON", "not json"],
    ])("refuses %s", async (_label, body) => {
      const res = await POST(webhook(body))

      expect(res.status).toBe(401)
      expect(await res.json()).toEqual({ revalidated: false })
      expect(revalidatePrismicPages).not.toHaveBeenCalled()
      expect(revalidateTag).not.toHaveBeenCalled()
    })
  })
})
