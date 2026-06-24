import { type JSX } from "react"
import { type Content, asText, isFilled } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"

import ProseRichText from "@/components/ProseRichText"

/**
 * Props for `TextContent`.
 */
export type TextContentProps = SliceComponentProps<Content.TextContentSlice>

/**
 * Component for "TextContent" Slices.
 */
const TextContent = ({ slice }: TextContentProps): JSX.Element => {
  const { title, content } = slice.primary

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="col-span-full mb-6 grid grid-cols-subgrid gap-y-3 md:mb-8 md:gap-y-4"
    >
      {isFilled.richText(title) && (
        <h2 className="col-span-full font-serif text-2xl font-normal md:col-span-8">
          {asText(title)}
        </h2>
      )}

      {isFilled.richText(content) && (
        <ProseRichText field={content} className="col-span-full md:col-span-8" />
      )}
    </section>
  )
}

export default TextContent
