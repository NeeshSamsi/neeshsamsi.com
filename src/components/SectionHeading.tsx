import { cn } from "@/lib/utils"
import Image from "next/image"

export default function SectionHeading({
  element = "h2",
  text,
  className,
}: {
  element?: "h1" | "h2"
  text: string
  className?: string
}) {
  const defaultStyles =
    "relative mb-14 w-fit font-serif text-3xl sm:text-4xl xl:text-[2.75rem]"

  switch (element) {
    case "h1":
      return (
        <h1 className={cn(defaultStyles, "xl:text-5xl", className)}>
          <Content text={text} />
        </h1>
      )
    case "h2":
      return (
        <h2 className={cn(defaultStyles, className)}>
          <Content text={text} />
        </h2>
      )
  }
}

function Content({ text }: { text: string }) {
  return (
    <>
      <span className="underline decoration-brand underline-offset-4">
        {text}
      </span>
    </>
  )
}
