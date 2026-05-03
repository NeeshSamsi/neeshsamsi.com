"use client"

import { type ImageField } from "@prismicio/client"

import { useEffect, useState } from "react"
import { PrismicNextImage } from "@prismicio/next"

import { Dialog } from "@headlessui/react"
import { XCircleIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"
import { getLenis } from "@/lib/lenis"

type Props = {
  field: ImageField
  className?: string
  wrapperClassName?: string
  sizes?: string
}

export default function ImageWithPreview({
  field,
  className,
  wrapperClassName,
  sizes,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // While the modal is open, pause Lenis so the underlying page doesn't
  // scroll when the user wheels over the dialog. Restore on close (and
  // on unmount, just in case).
  useEffect(() => {
    const lenis = getLenis()
    if (!lenis) return

    if (isOpen) {
      lenis.stop()
    } else {
      lenis.start()
    }

    return () => {
      lenis.start()
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          // Same stroke style as ProjectGrid + FeaturedProject, but
          // transparent by default and faded in on hover to signal
          // that the image is interactive (opens a preview).
          "pointer-events-none block overflow-hidden rounded-lg border border-transparent transition-colors duration-300 hover:border-lighter/50 lg:pointer-events-auto lg:cursor-zoom-in",
          wrapperClassName,
        )}
      >
        <PrismicNextImage
          field={field}
          sizes={sizes}
          fallbackAlt=""
          className={className}
        />
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <Dialog.Panel
          // data-lenis-prevent tells Lenis to leave wheel events inside
          // the panel alone so it can scroll natively. z-50 sits the
          // panel above the navbar (z-40) and contact widget (z-40);
          // putting z-50 on the Dialog wrapper has no effect because
          // that wrapper isn't a positioned element.
          data-lenis-prevent
          className="fixed inset-0 z-50 w-screen overflow-y-auto overscroll-y-none bg-dark/70 px-14 py-14 backdrop-blur-sm"
        >
          <XCircleIcon
            className="fixed top-4 right-4 z-50 aspect-square w-10 cursor-pointer"
            strokeWidth={1.5}
            onClick={() => setIsOpen(false)}
          />
          <PrismicNextImage
            field={field}
            sizes="100vw"
            fallbackAlt=""
            className="w-full rounded-xl"
          />
        </Dialog.Panel>
      </Dialog>
    </>
  )
}
