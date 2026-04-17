import { PrismicNextLink, type PrismicNextLinkProps } from "@prismicio/next"
import { cn } from "@/lib/utils"

export default function NavLink({ className, ...props }: PrismicNextLinkProps) {
  return (
    <PrismicNextLink
      className={cn(
        "relative inline-block transition-colors hover:text-lighter",
        "after:absolute after:bottom-0 after:left-0 after:h-[0.075em] after:w-full after:-translate-y-[0.2em] after:bg-current after:opacity-0 after:transition-all after:duration-150 after:ease-in-out",
        "hover:after:translate-y-[0.1em] hover:after:opacity-100",
        "focus:after:translate-y-[0.1em] focus:after:opacity-100",
        className,
      )}
      {...props}
    />
  )
}
