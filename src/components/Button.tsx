import { type ReactNode } from "react"
import Link from "next/link"

import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonStyles = cva(
  "group flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
  {
    variants: {
      type: {
        solid: "font-medium",
        outline: "font-normal",
        text: "font-normal",
      },
      theme: {
        brand: "",
        dark: "",
        light: "",
      },
    },
    compoundVariants: [
      {
        type: "solid",
        theme: "brand",
        class: "text-dark bg-brand hover:bg-light hover:text-dark",
      },
      {
        type: "solid",
        theme: "light",
        class: "text-dark bg-light hover:bg-lighter hover:text-dark",
      },
      {
        type: "outline",
        theme: "light",
        class: "text-light border border-light hover:bg-light hover:text-dark",
      },
      {
        type: "text",
        theme: "light",
        class: "text-light hover:text-lighter",
      },
    ],
    defaultVariants: {
      type: "solid",
      theme: "brand",
    },
  },
)

interface Props extends VariantProps<typeof buttonStyles> {
  element: "link" | "button"
  children: ReactNode
  href?: string
  className?: string
}

function AnimatedLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block overflow-hidden">
      <span className="block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute inset-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        {children}
      </span>
    </span>
  )
}

export default function Button({
  element,
  type,
  theme,
  children,
  href,
  className,
}: Props) {
  const styles = buttonStyles({ type, theme })

  const classes = cn(styles, className)

  const content = <AnimatedLabel>{children}</AnimatedLabel>

  switch (element) {
    case "button":
      return <button {...{ className: classes }}>{content}</button>

    case "link":
      if (!href)
        throw new Error("`href` is a required prop when element is Link")

      if (href.startsWith("http")) {
        return (
          <a {...{ href, className: classes }} target="_blank">
            {content}
          </a>
        )
      } else {
        return <Link {...{ href, className: classes }}>{content}</Link>
      }
  }
}
