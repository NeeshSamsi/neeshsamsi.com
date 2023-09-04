import { cn } from "@/lib/utils"
import Underline from "@/components/Graphics/Underline"

export default function Headline({
  className,
  text,
}: {
  className: string
  text: string
}) {
  return (
    <h2 className={cn("relative font-serif", className)}>
      <span>{text}</span>
      <Underline className="absolute bottom-0 left-0 h-fit w-full" />
    </h2>
  )
}
