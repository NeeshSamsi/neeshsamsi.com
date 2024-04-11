import { ReviewEntry } from "@/lib/keystatic"
import Image from "next/image"

export default async function Review({
  avatar,
  name,
  designation,
  content,
}: ReviewEntry) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Image
          src={avatar}
          alt={`Avatar of ${name}`}
          width={128}
          height={128}
          sizes="100vw"
          className="h-14 w-14 rounded-md lg:h-18 lg:w-18"
        />
        <div className="space-y-1">
          <p className="font-serif text-xl md:text-2xl md:text-3xl">{name}</p>
          <p className="text-xs md:text-sm lg:text-base xl:text-lg">
            {designation}
          </p>
        </div>
      </div>
      <p className="text-sm md:text-base lg:text-lg xl:text-xl">{content}</p>
    </div>
  )
}
