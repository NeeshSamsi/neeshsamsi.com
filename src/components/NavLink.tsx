import { PrismicNextLink, type PrismicNextLinkProps } from "@prismicio/next"
import { cn } from "@/lib/utils"

export default function NavLink({
  className,
  children,
  ...props
}: PrismicNextLinkProps) {
  // Fall back to the link field's text when children aren't provided
  // (PrismicNextLink does this automatically, but we need the value
  // to duplicate it inside the slide-up animation).
  const label =
    children ??
    (props.field && "text" in props.field ? props.field.text : undefined)

  return (
    <PrismicNextLink
      className={cn(
        "group relative inline-block transition-colors hover:text-lighter",
        "after:absolute after:bottom-0 after:left-0 after:h-[0.075em] after:w-full after:-translate-y-[0.2em] after:bg-current after:opacity-0 after:transition-all after:duration-150 after:ease-in-out",
        "hover:after:translate-y-[0.1em] hover:after:opacity-100",
        "focus:after:translate-y-[0.1em] focus:after:opacity-100",
        className,
      )}
      {...props}
    >
      <span className="relative inline-block overflow-hidden">
        <span className="block transition-transform duration-300 group-hover:-translate-y-full group-focus:-translate-y-full">
          {label}
        </span>
        <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0 group-focus:translate-y-0">
          {label}
        </span>
      </span>
    </PrismicNextLink>
  )
}
