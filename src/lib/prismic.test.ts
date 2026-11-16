import { NotFoundError } from "@prismicio/client"
import { beforeEach, describe, expect, it, vi } from "vitest"

const getByUID = vi.hoisted(() => vi.fn())
const getSingle = vi.hoisted(() => vi.fn())
const getAllByTypeMock = vi.hoisted(() => vi.fn())
const cacheLife = vi.hoisted(() => vi.fn())
const cacheTagPrismicPages = vi.hoisted(() => vi.fn())
const getPreviewRef = vi.hoisted(() => vi.fn())

vi.mock("@/prismicio", () => ({
  createClient: () => ({
    getByUID,
    getSingle,
    getAllByType: getAllByTypeMock,
  }),
}))
// "use cache" is a no-op outside Next, so the cached functions run directly.
vi.mock("next/cache", () => ({ cacheLife }))
vi.mock("@prismicio/next", () => ({ cacheTagPrismicPages, getPreviewRef }))
// The real notFound() throws a control-flow error Next catches; a sentinel
// stands in for it here.
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND")
  },
}))

import { getAllByType, getByUIDOrNotFound, getSettings } from "./prismic"

beforeEach(() => {
  vi.clearAllMocks()
  getPreviewRef.mockResolvedValue(undefined)
})

describe("getByUIDOrNotFound", () => {
  it("returns the document, cached until a webhook clears its tag", async () => {
    const doc = { id: "abc", uid: "work", data: {} }
    getByUID.mockResolvedValue(doc)

    await expect(getByUIDOrNotFound("page", "work")).resolves.toBe(doc)
    expect(getByUID).toHaveBeenCalledWith("page", "work", { ref: undefined })
    expect(cacheLife).toHaveBeenCalledWith("max")
    expect(cacheTagPrismicPages).toHaveBeenCalledWith([doc])
  })

  it("queries the preview ref during a preview session", async () => {
    getPreviewRef.mockResolvedValue("preview-ref")
    getByUID.mockResolvedValue({ id: "abc", uid: "work", data: {} })

    await getByUIDOrNotFound("page", "work")

    expect(getByUID).toHaveBeenCalledWith("page", "work", {
      ref: "preview-ref",
    })
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
    expect(cacheTagPrismicPages).not.toHaveBeenCalled()
  })

  it("rethrows every other failure instead of turning it into a 404", async () => {
    const outage = new Error("fetch failed")
    getByUID.mockRejectedValue(outage)

    await expect(getByUIDOrNotFound("project", "real-project")).rejects.toBe(
      outage,
    )
  })
})

describe("getSettings", () => {
  it("returns the settings document and tags the cache with it", async () => {
    const settings = { id: "settings-id", data: {} }
    getSingle.mockResolvedValue(settings)

    await expect(getSettings()).resolves.toBe(settings)
    expect(getSingle).toHaveBeenCalledWith("settings", { ref: undefined })
    expect(cacheLife).toHaveBeenCalledWith("max")
    expect(cacheTagPrismicPages).toHaveBeenCalledWith([settings])
  })
})

describe("getAllByType", () => {
  it("passes the query through and tags the cache with every result", async () => {
    const notes = [{ id: "n1" }, { id: "n2" }]
    getAllByTypeMock.mockResolvedValue(notes)
    getPreviewRef.mockResolvedValue("preview-ref")

    await expect(getAllByType("notes", { limit: 2 })).resolves.toBe(notes)
    expect(getAllByTypeMock).toHaveBeenCalledWith("notes", {
      limit: 2,
      ref: "preview-ref",
    })
    expect(cacheLife).toHaveBeenCalledWith("max")
    expect(cacheTagPrismicPages).toHaveBeenCalledWith(notes)
  })
})
