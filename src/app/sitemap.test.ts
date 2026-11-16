import { describe, expect, it, vi } from "vitest"

const docs: Record<string, { uid: string; last_publication_date: string }[]> = {
  page: [
    { uid: "home", last_publication_date: "2026-06-30T07:19:35+0000" },
    { uid: "work", last_publication_date: "2026-05-04T16:14:37+0000" },
    { uid: "about", last_publication_date: "2026-01-02T00:00:00+0000" },
  ],
  project: [
    { uid: "golden-apple", last_publication_date: "2025-10-16T10:00:00+0000" },
  ],
  notes: [{ uid: "a-note", last_publication_date: "2024-11-05T15:00:07+0000" }],
}

const connection = vi.hoisted(() => vi.fn(async () => {}))

vi.mock("@/prismicio", () => ({
  createClient: () => ({
    getAllByType: vi.fn(async (type: string) => docs[type]),
  }),
}))
vi.mock("next/server", () => ({ connection }))
vi.mock("@/lib/config", () => ({ url: "https://www.example.com" }))

import sitemap from "./sitemap"

describe("sitemap", () => {
  it("lists every routed document at its public URL", async () => {
    const urls = (await sitemap()).map((entry) => entry.url)

    expect(urls).toEqual([
      "https://www.example.com/",
      "https://www.example.com/work",
      // A page added in Prismic shows up without a code change.
      "https://www.example.com/about",
      "https://www.example.com/projects/golden-apple",
      "https://www.example.com/notes/a-note",
    ])
  })

  // On Vercel a prerendered sitemap ignores every on-demand refresh, so it is
  // built per request from Prismic instead.
  it("renders on each request", async () => {
    connection.mockClear()

    await sitemap()

    expect(connection).toHaveBeenCalled()
  })

  it("reports when each document was last published", async () => {
    const entries = await sitemap()
    const work = entries.find((entry) => entry.url.endsWith("/work"))

    expect(work?.lastModified).toEqual(new Date("2026-05-04T16:14:37Z"))
  })
})
