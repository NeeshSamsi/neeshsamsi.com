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
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for heading (variation: {slice.variation}) Slices
    </section>
  )
}

export default Heading
