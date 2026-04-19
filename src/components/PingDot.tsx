import { cn } from "@/lib/utils"

interface PingDotProps {
  /** Tailwind size classes for the dot, including responsive variants.
   *  e.g. "size-1.5 md:size-2" */
  className?: string
}

export default function PingDot({ className }: PingDotProps) {
  return (
    <span className={cn("relative flex size-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
      <span
        className={cn(
          "relative inline-flex size-2 rounded-full bg-brand",
          className,
        )}
      />
    </span>
  )
}
