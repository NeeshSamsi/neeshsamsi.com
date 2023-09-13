import Image from "next/image"
import Button from "@/components/Button"
import {
  ArrowLongRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline"

type Props = {
  slug: string
  image: {
    src: string
    alt: string
  }
  title: string
  description: string
  tags: string
  liveUrl?: string
}

export default function ProjectCard({
  slug,
  image: { src, alt },
  title,
  description,
  tags,
  liveUrl,
}: Props) {
  return (
    <div className="flex flex-col justify-between space-y-4 text-sm text-lighter sm:text-base lg:space-y-6 lg:text-lg xl:text-xl">
      <div className="space-y-3 lg:space-y-4">
        <div className="relative aspect-video w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1360px) 584px, (min-width: 780px) 43.21vw, (min-width: 620px) 512px, calc(92vw - 40px)"
            className="rounded-xl object-cover"
          />
        </div>
        <p>{tags}</p>
        <h3 className="font-serif text-xl leading-tight text-light sm:text-[28px] xl:text-[32px]">
          {title}
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
          <span>Read more</span>
          <ArrowLongRightIcon
            className="aspect-square w-6 transition-all group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </Button>
        {liveUrl && (
          <Button
            element="link"
            href={liveUrl}
            type="text"
            theme="light"
            className="group"
          >
            <span>Visit live site</span>
            <ArrowTopRightOnSquareIcon className="aspect-square w-6 transition-all group-hover:-translate-y-[0.1rem] group-hover:translate-x-[0.1rem]" />
          </Button>
        )}
      </div>
    </div>
  )
}
