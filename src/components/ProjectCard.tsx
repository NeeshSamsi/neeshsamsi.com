import Image from "next/image"
import Button from "@/components/Button"
import {
  ArrowLongRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline"

type Props = {
  image: {
    src: string
    alt: string
  }
  title: string
  description: string
  tags: string
}

export default function ProjectCard({
  image: { src, alt },
  title,
  description,
  tags,
}: Props) {
  return (
    <div className="space-y-4 text-lg text-lighter">
      <div className="relative aspect-video w-full">
        <Image src={src} alt={alt} fill className="rounded-xl object-cover" />
      </div>
      <p>{tags}</p>
      <h3 className="font-serif text-[32px] text-light">{title}</h3>
      <p>{description}</p>
      <div className="flex items-center gap-4">
        <Button element="link" href="/" type="solid" theme="light">
          <span>Read more</span>
          <ArrowLongRightIcon className="aspect-square w-6" strokeWidth={2} />
        </Button>
        <Button element="link" href="/" type="text" theme="light">
          <span>Visit live site</span>
          <ArrowTopRightOnSquareIcon className="aspect-square w-6" />
        </Button>
      </div>
    </div>
  )
}
