import { type JSX } from "react"
import { asText, type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"

import { getHighlighter, languages } from "@/lib/shiki"

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

  const highlighter = await getHighlighter()

  const html = highlighter.codeToHtml(asText(code), {
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
