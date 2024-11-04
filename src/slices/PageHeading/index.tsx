import { type JSX } from "react"
import { asText, type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"
import SectionHeading from "@/components/SectionHeading"

/**
 * Props for `PageHeading`.
 */
export type PageHeadingProps = SliceComponentProps<Content.PageHeadingSlice>

/**
 * Component for "PageHeading" Slices.
 */
const PageHeading = ({ slice }: PageHeadingProps): JSX.Element => {
  const {
    primary: { heading },
  } = slice

  return (
    <div className="wrapper">
      <SectionHeading
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        element="h1"
        text={asText(heading)}
        className="mt-8 sm:mt-12"
      />
    </div>
  )
}

export default PageHeading
