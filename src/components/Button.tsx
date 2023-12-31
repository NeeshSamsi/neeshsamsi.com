import { type ReactNode } from "react"
import Link from "next/link"

import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonStyles = cva(
  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
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

  switch (element) {
    case "button":
      return <button {...{ className: classes }}>{children}</button>

    case "link":
      if (!href)
        throw new Error("`href` is a required prop when element is Link")

      if (href.startsWith("http")) {
        return (
          <a {...{ href, className: classes }} target="_blank">
            {children}
          </a>
        )
      } else {
        return <Link {...{ href, className: classes }}>{children}</Link>
      }
  }
}
