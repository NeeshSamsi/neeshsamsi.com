import { NotFoundError } from "@prismicio/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

const getByUID = vi.hoisted(() => vi.fn())

vi.mock("@/prismicio", () => ({ createClient: () => ({ getByUID }) }))
// The real notFound() throws a control-flow error Next catches; a sentinel
// stands in for it here.
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND")
  },
}))

import { getByUIDOrNotFound } from "./prismic"

describe("getByUIDOrNotFound", () => {
  beforeEach(() => {
    getByUID.mockReset()
  })

  it("returns the document", async () => {
    const doc = { uid: "work", data: {} }
    getByUID.mockResolvedValue(doc)

    await expect(getByUIDOrNotFound("page", "work")).resolves.toBe(doc)
    expect(getByUID).toHaveBeenCalledWith("page", "work")
  })

  it("renders the 404 page when Prismic has no such document", async () => {
    getByUID.mockRejectedValue(
      new NotFoundError(
        "No documents were returned",
        "https://api.example",
        undefined,
      ),
    )

    await expect(getByUIDOrNotFound("page", "nope")).rejects.toThrow(
      "NEXT_NOT_FOUND",
    )
  })

  it("rethrows every other failure instead of turning it into a 404", async () => {
    const outage = new Error("fetch failed")
    getByUID.mockRejectedValue(outage)

    await expect(getByUIDOrNotFound("project", "real-project")).rejects.toBe(
      outage,
    )
  })
})
