import { asText, type Content } from "@prismicio/client"
import Link from "next/link"
import Button from "@/components/Button"
import { ArrowLongRightIcon } from "@heroicons/react/24/outline"

type Props = Omit<
  Content.NotesDocumentData,
  "meta_image" | "meta_title" | "meta_description" | "pubDate" | "slices"
> & {
  slug: string
}

export default function Note({ slug, title, description, tags }: Props) {
  return (
    <div className="flex flex-col justify-between space-y-4 text-sm text-lighter sm:text-base lg:space-y-6 lg:text-lg xl:text-xl">
      <div className="space-y-3 lg:space-y-4">
        <p>{tags}</p>
        <Link
          href={`/work/${slug}`}
          className="font-serif text-xl leading-tight text-light sm:text-[28px] xl:text-[32px]"
        >
          <h3>{asText(title)}</h3>
        </Link>
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
          <span>Read note</span>
          <ArrowLongRightIcon
            className="aspect-square w-6 transition-all group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </Button>
      </div>
    </div>
  )
}
