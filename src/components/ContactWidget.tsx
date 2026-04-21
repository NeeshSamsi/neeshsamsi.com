"use client"

import { useState } from "react"
import { PrismicNextImage } from "@prismicio/next"
import { client } from "@/lib/prismic"

export default function ContactWidget() {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  // Fetch email on mount if not yet loaded
  if (!email) {
    client
      .getSingle("settings")
      .then((doc) => {
        setEmail(doc.data.email as string)
      })
      .catch(() => {
        // Handle error
      })
  }

  const handleClick = async () => {
    if (!email) return

    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Handle error
    }
  }

  const widget = null // We'll render nothing until we have data

  if (!email) {
    return null
  }

  return (
    <div className="relative">
      {copied && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-dark">
          Email address copied
        </div>
      )}
      <button
        onClick={handleClick}
        className="group inline-flex h-12 cursor-pointer items-center overflow-hidden rounded-lg border-2 border-brand bg-dark/30 backdrop-blur-sm transition-colors duration-250 hover:bg-light md:h-14"
      >
        <div className="relative aspect-square h-full shrink-0 overflow-hidden bg-brand">
          {/* Placeholder - would need proper image URL */}
        </div>
        <span className="pr-4 pl-3 text-base leading-none font-medium text-light transition-colors group-hover:text-dark md:pr-5 md:pl-4 md:text-lg">
          Contact Me
        </span>
      </button>
    </div>
  )
}