import { ReviewEntry } from "@/lib/keystatic"
import { Content } from "@prismicio/client"
import { PrismicNextImage } from "@prismicio/next"

export default async function Review({
  avatar,
  name,
  designation,
  review,
}: NonNullable<Content.ReviewsSliceDefaultPrimary["reviews"][0]>) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <PrismicNextImage
          field={avatar}
          width={128}
          height={128}
          sizes="100vw"
          className="h-14 w-14 rounded-md lg:h-18 lg:w-18"
        />
        <div className="space-y-1">
          <p className="font-serif text-xl md:text-2xl ">{name}</p>
          <p className="text-xs md:text-sm lg:text-base xl:text-lg">
            {designation}
          </p>
        </div>
      </div>
      <p className="text-sm md:text-base lg:text-lg xl:text-xl">{review}</p>
    </div>
  )
}
