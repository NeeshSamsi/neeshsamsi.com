"use client"

import { type ImageField } from "@prismicio/client"
import { useState } from "react"
import { PrismicNextImage } from "@prismicio/next"
import { Dialog } from "@headlessui/react"
import { XCircleIcon } from "@heroicons/react/24/outline"

export default function InteractiveContent({ image }: { image: ImageField }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div
      onClick={() => setIsOpen(true)}
      className="pointer-events-none lg:pointer-events-auto lg:cursor-zoom-in"
    >
      <PrismicNextImage
        field={image}
        sizes="(min-width: 1280px) 816px, (min-width: 840px) 735px, (min-width: 760px) calc(136.67vw - 386px), calc(94.77vw - 48px)"
      />

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="z-50">
        <Dialog.Panel className="fixed inset-0 w-screen overflow-y-scroll bg-dark/70 px-14 py-14">
          <XCircleIcon
            className="absolute right-4 top-4 aspect-square w-10 cursor-pointer"
            strokeWidth={1.5}
            onClick={() => setIsOpen(false)}
          />
          <PrismicNextImage
            field={image}
            sizes="100vw"
            className="w-full rounded-xl"
          />
        </Dialog.Panel>
      </Dialog>
    </div>
  )
}
