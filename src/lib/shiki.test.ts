import { describe, expect, it } from "vitest"

import highlighter, { languages, resolveLanguage } from "./shiki"

describe("resolveLanguage", () => {
  it("maps every option of the Language select to a loaded grammar", async () => {
    const loaded = (await highlighter).getLoadedLanguages()

    for (const label of Object.keys(languages)) {
      expect(loaded).toContain(resolveLanguage(label))
    }
  })

  it.each([null, undefined, "", "Rust"])(
    "falls back to plain text for %j",
    (label) => {
      expect(resolveLanguage(label)).toBe("text")
    },
  )

  it("renders a block with no language instead of throwing", async () => {
    const shiki = await highlighter

    const html = shiki.codeToHtml("const a = <b>", {
      lang: resolveLanguage(null),
      theme: "aurora-x",
    })

    // Still a themed, escaped code block.
    expect(html).toContain("<pre")
    expect(html).toContain("const a = &#x3C;b>")
  })
})
