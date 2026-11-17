// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import type { RichTextField } from "@prismicio/client"
import { PrismicRichText } from "@prismicio/react"
import { afterEach, describe, expect, it } from "vitest"

import ProseRichText, { proseComponents, proseHyperlink } from "./ProseRichText"

afterEach(cleanup)

const text = "Read the case study, the brief and the studio site."

// One paragraph with a document link, a file link and a web link.
const field = [
  {
    type: "paragraph",
    text,
    direction: "ltr",
    spans: [
      {
        type: "hyperlink",
        start: text.indexOf("case study"),
        end: text.indexOf("case study") + "case study".length,
        data: {
          link_type: "Document",
          id: "abc",
          uid: "best",
          type: "project",
          lang: "en-gb",
          tags: [],
          slug: "best",
          isBroken: false,
          url: "/projects/best",
        },
      },
      {
        type: "hyperlink",
        start: text.indexOf("brief"),
        end: text.indexOf("brief") + "brief".length,
        data: {
          link_type: "Media",
          id: "file",
          kind: "document",
          name: "brief.pdf",
          size: "1",
          url: "https://neeshsamsi.cdn.prismic.io/neeshsamsi/brief.pdf",
        },
      },
      {
        type: "hyperlink",
        start: text.indexOf("studio site"),
        end: text.indexOf("studio site") + "studio site".length,
        data: { link_type: "Web", url: "https://www.yummycolours.com" },
      },
    ],
  },
] as unknown as RichTextField

describe("ProseRichText links", () => {
  it("opens links to other sites in a new tab without leaking the opener", () => {
    render(<ProseRichText field={field} />)
    const link = screen.getByRole("link", { name: "studio site" })

    expect(link.getAttribute("href")).toBe("https://www.yummycolours.com")
    expect(link.getAttribute("target")).toBe("_blank")
    expect(link.getAttribute("rel")).toBe("noopener noreferrer")
  })

  it("opens linked files in a new tab", () => {
    render(<ProseRichText field={field} />)
    const link = screen.getByRole("link", { name: "brief" })

    expect(link.getAttribute("target")).toBe("_blank")
    expect(link.getAttribute("rel")).toBe("noopener noreferrer")
  })

  it("keeps links to pages on this site in the same tab", () => {
    render(<ProseRichText field={field} />)
    const link = screen.getByRole("link", { name: "case study" })

    expect(link.getAttribute("href")).toBe("/projects/best")
    expect(link.hasAttribute("target")).toBe(false)
  })

  it("records a click on a link to another site, by hostname only", () => {
    render(<ProseRichText field={field} />)
    const link = screen.getByRole("link", { name: "studio site" })

    expect(link.getAttribute("data-umami-event")).toBe("outbound_click")
    expect(link.getAttribute("data-umami-event-kind")).toBe("inline")
    expect(link.getAttribute("data-umami-event-host")).toBe(
      "www.yummycolours.com",
    )
  })

  // The tracker turns a click on a tracked same-tab anchor into a full page
  // load, so a link that navigates inside the site must carry no attributes.
  it("leaves links to pages on this site untracked", () => {
    render(<ProseRichText field={field} />)
    const link = screen.getByRole("link", { name: "case study" })

    expect(link.hasAttribute("data-umami-event")).toBe(false)
  })

  it("shares its link serializer for other rich text", () => {
    render(<PrismicRichText field={field} components={proseComponents} />)

    expect(
      screen
        .getByRole("link", { name: "studio site" })
        .getAttribute("data-umami-event"),
    ).toBe("outbound_click")
    expect(proseComponents.hyperlink).toBe(proseHyperlink)
  })
})
