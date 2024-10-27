import { asText, type Content } from "@prismicio/client"
import Image from "next/image"
import Link from "next/link"
import Button from "@/components/Button"
import {
  ArrowLongRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline"
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next"

type Props = Omit<
  Content.WorkDocumentData,
  "meta_image" | "meta_title" | "meta_description" | "pubDate" | "slices"
> & {
  slug: string
  priority?: boolean
}

export default function Project({
  slug,
  image,
  title,
  description,
  tags,
  cta,
  priority,
}: Props) {
  return (
    <div className="flex flex-col justify-between space-y-4 text-sm text-lighter sm:text-base lg:space-y-6 lg:text-lg xl:text-xl">
      <div className="space-y-3 lg:space-y-4">
        <Link
          href={`/work/${slug}`}
          className="relative block aspect-video w-full overflow-hidden rounded-xl"
        >
          <PrismicNextImage
            field={image}
            fill
            priority={priority}
            sizes="(min-width: 1360px) 584px, (min-width: 780px) 43.21vw, (min-width: 620px) 512px, calc(92vw - 40px)"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
        <p>{tags}</p>
        <h3 className="font-serif text-xl leading-tight text-light sm:text-[28px] xl:text-[32px]">
          {asText(title)}
        </h3>
        <p>{description}</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          element="link"
          href={`/work/${slug}`}
          type="solid"
          theme="light"
          className="group"
        >
          <span>Full project</span>
          <ArrowLongRightIcon
            className="aspect-square w-6 transition-all group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </Button>
        {cta.text && (
          <PrismicNextLink field={cta}>
            <Button
              element="button"
              type="text"
              theme="light"
              className="group"
            >
              <span>{cta.text}</span>
              <ArrowTopRightOnSquareIcon className="aspect-square w-6 transition-all group-hover:-translate-y-[0.1rem] group-hover:translate-x-[0.1rem]" />
            </Button>
          </PrismicNextLink>
        )}
      </div>
    </div>
  )
}
