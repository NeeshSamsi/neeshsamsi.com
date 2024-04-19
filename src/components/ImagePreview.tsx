"use client"

import { useState } from "react"
import NextImage, { type ImageProps } from "next/image"

import { Dialog } from "@headlessui/react"
import { XCircleIcon } from "@heroicons/react/24/outline"

export default function ImagePreview(props: ImageProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div
      onClick={() => setIsOpen(true)}
      className="pointer-events-none lg:pointer-events-auto lg:cursor-zoom-in"
    >
      <NextImage
        {...props}
        sizes="(min-width: 1280px) 816px, (min-width: 840px) 735px, (min-width: 760px) calc(136.67vw - 386px), calc(94.77vw - 48px)"
      />

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="z-50">
        <Dialog.Panel className="fixed inset-0 w-screen overflow-y-scroll bg-dark/70 px-14 py-14">
          <XCircleIcon
            className="absolute right-4 top-4 aspect-square w-10 cursor-pointer"
            strokeWidth={1.5}
            onClick={() => setIsOpen(false)}
          />
          <NextImage {...props} sizes="100vw" className="w-full rounded-xl" />
        </Dialog.Panel>
      </Dialog>
    </div>
  )
}
