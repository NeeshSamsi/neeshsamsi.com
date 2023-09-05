import { cn } from "@/lib/utils"
import Underline from "@/components/Graphics/Underline"

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
        "relative mb-10 w-fit font-serif text-3xl sm:text-4xl xl:text-[2.75rem]",
        className,
      )}
    >
      <span>{text}</span>
      <Underline className="absolute -bottom-1 left-0 -z-10 h-fit w-full xl:-bottom-3" />
    </h2>
  )
}
