import { type JSX } from "react"
import { type SliceComponentProps } from "@prismicio/react"
import { type Content, asText } from "@prismicio/client"

import SectionHeading from "@/components/SectionHeading"
import Review from "@/components/Review"

/**
 * Props for `Reviews`.
 */
export type ReviewsProps = SliceComponentProps<Content.ReviewsSlice>

/**
 * Component for "Reviews" Slices.
 */
const Reviews = ({ slice }: ReviewsProps): JSX.Element => {
  const {
    primary: { heading, reviews },
  } = slice

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="reviews-and-feedback"
      className="wrapper mt-24"
    >
      <section>
        <SectionHeading text={asText(heading)} />

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-12 lg:gap-y-16 xl:grid-cols-3">
            {reviews.map((review, i) => (
              <Review key={`review-${i}`} {...review} />
            ))}
          </div>
        ) : (
          <p className="text-sm md:text-base lg:text-lg xl:text-xl">
            No reviews or feedback.
          </p>
        )}
      </section>
    </section>
  )
}

export default Reviews
