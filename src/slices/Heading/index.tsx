import { Content } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"

/**
 * Props for `Heading`.
 */
export type HeadingProps = SliceComponentProps<Content.HeadingSlice>

/**
 * Component for "Heading" Slices.
 */
const Heading = ({ slice }: HeadingProps): JSX.Element => {
  const {
    primary: { text },
  } = slice
  if (!text) throw new Error("Invalid Heading Text")

  const [first, ...rest] = text.split(" ")

  return (
    <h2
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <span className="font-medium text-brand">{first} </span>
      <span>{rest.join(" ")}</span>
    </h2>
  )
}

export default Heading
