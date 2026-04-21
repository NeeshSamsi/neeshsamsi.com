import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

type AllowedElement = "nav" | "main" | "section" | "footer" | "div"

interface Props extends HTMLAttributes<HTMLElement> {
  as?: AllowedElement
  className?: string
  children: ReactNode
}

export default function GridWrapper({
  as: Component = "div",
  className,
  children,
  ...props
}: Props) {
  return (
    <Component
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-12 gap-x-8 px-4 xs:px-8",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
