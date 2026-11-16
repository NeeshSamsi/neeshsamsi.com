import { type JSX } from "react"
import { cacheLife } from "next/cache"
import { asText, type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"

import highlighter, { resolveLanguage } from "@/lib/shiki"

/**
 * Props for `CodeBlock`.
 */
export type CodeBlockProps = SliceComponentProps<Content.CodeBlockSlice>

// Shiki reads the clock while it tokenizes, which Next refuses during a
// prerender. The output depends only on the code and language, so it is cached.
async function highlight(code: string, lang: string | null) {
  "use cache"
  cacheLife("max")

  const shiki = await highlighter

  return shiki.codeToHtml(code, {
    lang: resolveLanguage(lang),
    theme: "aurora-x",
  })
}

/**
 * Component for "CodeBlock" Slices.
 */
const CodeBlock = async ({ slice }: CodeBlockProps): Promise<JSX.Element> => {
  const {
    primary: { lang, code },
  } = slice

  const html = await highlight(asText(code, "\n"), lang)

  return (
    <div
      className="col-span-full"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  )
}

export default CodeBlock
