import { Content } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"

/**
 * Props for `Play`.
 */
export type PlayProps = SliceComponentProps<Content.PlaySlice>

/**
 * Component for "Play" Slices.
 */
const Play = ({ slice }: PlayProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for play (variation: {slice.variation}) Slices
    </section>
  )
}

export default Play
