import { type JSX } from "react"
import { type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"
import { PrismicRichText } from "@prismicio/react"

/**
 * Props for `RichText`.
 */
export type RichTextProps = SliceComponentProps<Content.RichTextSlice>

/**
 * Component for "RichText" Slices.
 */
const RichText = ({ slice }: RichTextProps): JSX.Element => {
  const {
    primary: { content },
  } = slice

  return (
    <PrismicRichText
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      field={content}
      components={{}}
      fallback={<p>No content added.</p>}
    />
  )
}

export default RichText
