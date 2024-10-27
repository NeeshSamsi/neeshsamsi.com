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
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="prose prose-base mx-auto mt-12 text-light md:prose-lg xl:prose-xl marker:text-lighter prose-headings:font-serif prose-headings:font-normal prose-headings:text-light prose-a:font-normal prose-a:text-lighter prose-a:underline-offset-2 prose-a:transition-colors hover:prose-a:text-brand prose-img:w-full prose-img:max-w-none prose-img:rounded-xl prose-img:object-cover md:mt-16"
    >
      <PrismicRichText
        field={content}
        components={{}}
        fallback={<p>No content added.</p>}
      />
    </div>
  )
}

export default RichText
