import { type JSX } from "react"
import { type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"
import { PrismicRichText } from "@prismicio/react"
import ImageWithPreview from "@/components/ImagePreview"

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
      components={{
        heading2: ({ text }) => {
          const arr = String(text).split(" ")
          const first = arr[0]
          arr.shift()
          const rest = arr.join(" ")

          return (
            <h2 className="underline-animation">
              <span className="font-medium text-brand">{first} </span>
              <span>{rest}</span>
            </h2>
          )
        },
        image: ({ node }) => {
          return <ImageWithPreview field={node} />
        },
      }}
      fallback={<p>No content added.</p>}
    />
  )
}

export default RichText
