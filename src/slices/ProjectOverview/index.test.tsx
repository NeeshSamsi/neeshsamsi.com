// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import type { Content, RichTextField } from "@prismicio/client"
import { afterEach, describe, expect, it } from "vitest"

import ProjectOverview from "./index"

afterEach(cleanup)

const heading = (text: string) =>
  [{ type: "heading2", text, spans: [], direction: "ltr" }] as RichTextField

const first = "Built with the studio for BEST."
const second = "A second paragraph."

// Two paragraphs: the first has bold, italic and a link to another site.
const description = [
  {
    type: "paragraph",
    text: first,
    direction: "ltr",
    spans: [
      { type: "strong", start: 0, end: 5 },
      { type: "em", start: 11, end: 14 },
      {
        type: "hyperlink",
        start: first.indexOf("studio"),
        end: first.indexOf("studio") + "studio".length,
        data: { link_type: "Web", url: "https://studio.example.com/" },
      },
    ],
  },
  { type: "paragraph", text: second, direction: "ltr", spans: [] },
] as RichTextField

function renderSlice() {
  const slice = {
    id: "project_overview$test",
    slice_type: "project_overview",
    slice_label: null,
    variation: "default",
    version: "initial",
    items: [],
    primary: { paragraphs: [{ title: heading("The Brief"), description }] },
  } as unknown as Content.ProjectOverviewSlice
  return render(
    <ProjectOverview slice={slice} index={0} slices={[slice]} context={{}} />,
  )
}

describe("ProjectOverview", () => {
  it("keeps each description paragraph as its own paragraph", () => {
    const { container } = renderSlice()
    const paragraphs = [...container.querySelectorAll("p")].map(
      (p) => p.textContent,
    )
    expect(paragraphs).toEqual([first, second])
  })

  it("renders bold and italic", () => {
    const { container } = renderSlice()
    expect(container.querySelector("strong")?.textContent).toBe("Built")
    expect(container.querySelector("em")?.textContent).toBe("the")
  })

  it("opens links to other sites in a new tab and tracks them like prose links", () => {
    renderSlice()
    const link = screen.getByRole("link", { name: "studio" })
    expect(link.getAttribute("href")).toBe("https://studio.example.com/")
    expect(link.getAttribute("target")).toBe("_blank")
    expect(link.getAttribute("rel")).toBe("noopener noreferrer")
    expect(link.getAttribute("data-umami-event")).toBe("outbound_click")
  })
})
