import { Content } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"

/**
 * Props for `Notes`.
 */
export type NotesProps = SliceComponentProps<Content.NotesSlice>

/**
 * Component for "Notes" Slices.
 */
const Notes = ({ slice }: NotesProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for notes (variation: {slice.variation}) Slices
    </section>
  )
}

export default Notes
