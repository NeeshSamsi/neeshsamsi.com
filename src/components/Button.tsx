import { type ReactNode } from "react"
import Link from "next/link"

import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { eventAttributes, type UmamiEvent } from "@/lib/umami"

// The button's inner box. A tracked link to a page on this site moves it onto
// a wrapper inside the anchor (see the "link" case below).
const box = "flex items-center gap-3 px-3 py-2"

const buttonStyles = cva(`group ${box} rounded-md transition-colors`, {
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
})

interface Props extends VariantProps<typeof buttonStyles> {
  element: "link" | "button"
  children: ReactNode
  href?: string
  className?: string
  /** Umami event recorded when the button is clicked. */
  event?: UmamiEvent
}

export function AnimatedLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block overflow-hidden">
      {/* Transition-free wrapper a reveal can slide up (via [data-reveal-label])
          without fighting the hover swap's own transform transition below. */}
      <span data-reveal-label className="block">
        <span className="block transition-transform duration-300 group-hover:-translate-y-full">
          {children}
        </span>
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
  event,
}: Props) {
  const styles = buttonStyles({ type, theme })

  const classes = cn(styles, className)

  const content = <AnimatedLabel>{children}</AnimatedLabel>
  const attributes = eventAttributes(event)

  switch (element) {
    case "button":
      return (
        <button {...{ className: classes }} {...attributes}>
          {content}
        </button>
      )

    case "link":
      if (!href)
        throw new Error("`href` is a required prop when element is Link")

      if (href.startsWith("http")) {
        return (
          <a {...{ href, className: classes }} target="_blank" {...attributes}>
            {content}
          </a>
        )
      } else if (event) {
        // The attributes must stay off an anchor that navigates inside the
        // site (see "Analytics (Umami)" in AGENTS.md). The wrapper takes over
        // the padding so a click anywhere on the button is counted.
        return (
          <Link {...{ href, className: cn(classes, "p-0") }}>
            <span className={box} {...attributes}>
              {content}
            </span>
          </Link>
        )
      } else {
        return <Link {...{ href, className: classes }}>{content}</Link>
      }
  }
}
