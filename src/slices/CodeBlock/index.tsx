import { type JSX } from "react"
import { asHTML, asText, type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"

import highlighter, { getHighlighter, languages } from "@/lib/shiki"

/**
 * Props for `CodeBlock`.
 */
export type CodeBlockProps = SliceComponentProps<Content.CodeBlockSlice>

/**
 * Component for "CodeBlock" Slices.
 */
const CodeBlock = async ({ slice }: CodeBlockProps): Promise<JSX.Element> => {
  const {
    primary: { lang, code },
  } = slice

  const shiki = await highlighter

  const html = shiki.codeToHtml(asText(code, "\n"), {
    lang: languages[lang],
    theme: "aurora-x",
  })

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  )
}

export default CodeBlock
