import { Content } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"
import InteractiveContent from "./InteractiveContent"

/**
 * Props for `ImageWithPreview`.
 */
export type ImageWithPreviewProps =
  SliceComponentProps<Content.ImageWithPreviewSlice>

/**
 * Component for "ImageWithPreview" Slices.
 */
const ImageWithPreview = ({ slice }: ImageWithPreviewProps): JSX.Element => {
  const {
    primary: { image },
  } = slice

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <InteractiveContent image={image} />
    </div>
  )
}

export default ImageWithPreview
