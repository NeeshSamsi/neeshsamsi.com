import { cn } from "@/lib/utils"
import Image from "next/image"

export default function Headline({
  className,
  text,
}: {
  className?: string
  text: string
}) {
  return (
    <h2
      className={cn(
        "relative mb-14 w-fit font-serif text-3xl sm:text-4xl xl:text-[2.75rem]",
        className,
      )}
    >
      <span>{text}</span>
      <Image
        src="/underline.png"
        alt=""
        width={356}
        height={22}
        sizes="(min-width: 1280px) 174px, (min-width: 640px) 142px, 118px"
        className="absolute -bottom-1 left-0 -z-10 h-3 w-full xl:-bottom-3"
      />
    </h2>
  )
}
