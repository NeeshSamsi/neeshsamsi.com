import type { ResolvingMetadata } from "next"
import { describe, expect, it } from "vitest"

import { buildPageMetadata, humanizeUid } from "./metadata"

const SITE_IMAGE = { url: "https://images.example/site.png" }

// Only the fields the helper reads from the resolved parent metadata.
const parent = Promise.resolve({
  openGraph: { images: [SITE_IMAGE], siteName: "Neesh Samsi" },
  twitter: { creator: "@neesh" },
}) as unknown as ResolvingMetadata

const bareParent = Promise.resolve({
  openGraph: null,
}) as unknown as ResolvingMetadata

describe("buildPageMetadata", () => {
  it("points the canonical and og:url at the page's own path", async () => {
    const meta = await buildPageMetadata({ path: "/projects/x" }, parent)

    expect(meta.alternates).toEqual({ canonical: "/projects/x" })
    expect(meta.openGraph).toMatchObject({ url: "/projects/x" })
  })

  it("uses the page's title, description and image everywhere", async () => {
    const meta = await buildPageMetadata(
      {
        path: "/projects/x",
        title: "Project X",
        description: "About X",
        image: "https://images.example/x.png",
        type: "article",
        card: "summary_large_image",
      },
      parent,
    )
    const images = [{ url: "https://images.example/x.png" }]

    expect(meta.title).toBe("Project X")
    expect(meta.description).toBe("About X")
    expect(meta.openGraph).toMatchObject({
      title: "Project X",
      description: "About X",
      type: "article",
      siteName: "Neesh Samsi",
      images,
    })
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Project X",
      description: "About X",
      images,
    })
  })

  it.each([null, undefined, "", "   "])(
    "leaves title and description out when empty (%j) so layout defaults apply",
    async (empty) => {
      const meta = await buildPageMetadata(
        { path: "/work", title: empty, description: empty },
        parent,
      )

      // A present-but-empty key would override the layout's default with
      // nothing, which is how /work ended up with no <title>.
      expect(meta).not.toHaveProperty("title")
      expect(meta).not.toHaveProperty("description")
      expect(meta.openGraph).not.toHaveProperty("title")
      expect(meta.twitter).not.toHaveProperty("title")
    },
  )

  it("falls back to the site-wide image when the page has none", async () => {
    const meta = await buildPageMetadata({ path: "/work", image: null }, parent)

    expect(meta.openGraph).toMatchObject({ images: [SITE_IMAGE] })
    expect(meta.twitter).toMatchObject({ images: [SITE_IMAGE] })
  })

  it("defaults to a website with a small summary card", async () => {
    const meta = await buildPageMetadata({ path: "/" }, parent)

    expect(meta.openGraph).toMatchObject({ type: "website" })
    expect(meta.twitter).toMatchObject({ card: "summary" })
  })

  it("keeps the site's Twitter handle", async () => {
    const meta = await buildPageMetadata({ path: "/work" }, parent)

    expect(meta.twitter).toMatchObject({ creator: "@neesh" })
  })

  it("copes with a parent that has no Open Graph data", async () => {
    const meta = await buildPageMetadata({ path: "/work" }, bareParent)

    expect(meta.alternates).toEqual({ canonical: "/work" })
    expect(meta.openGraph?.images).toBeUndefined()
    expect(meta.twitter).not.toHaveProperty("creator")
  })
})

describe("humanizeUid", () => {
  it.each([
    ["work", "Work"],
    ["client-work", "Client work"],
    ["some_page-name", "Some page name"],
  ])("%s -> %s", (uid, expected) => {
    expect(humanizeUid(uid)).toBe(expected)
  })
})
