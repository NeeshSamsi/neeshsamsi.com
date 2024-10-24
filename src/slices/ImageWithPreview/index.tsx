import { Content } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"

/**
 * Props for `ImageWithPreview`.
 */
export type ImageWithPreviewProps =
  SliceComponentProps<Content.ImageWithPreviewSlice>

/**
 * Component for "ImageWithPreview" Slices.
 */
const ImageWithPreview = ({ slice }: ImageWithPreviewProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for image_with_preview (variation: {slice.variation}
      ) Slices
    </section>
  )
}

export default ImageWithPreview
