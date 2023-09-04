import Image from "next/image"

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import Github from "@/components/Icons/Github"
import Linkedin from "@/components/Icons/Linkedin"
import Instagram from "@/components/Icons/Instagram"
import Underline from "@/components/Graphics/Underline"
import Arrow from "@/components/Graphics/Arrow"

export default function Footer() {
  return (
    <footer id="contact" className="mt-24 grid gap-16">
      <div className="flex w-full items-center justify-evenly rounded-xl bg-light py-10 text-dark">
        <div className="grid gap-4">
          <Image
            src="/footer-neesh.png"
            alt="Smiling portrait of Avaneesh Samsi"
            className="aspect-square w-60 rounded-xl object-cover"
            height={480}
            width={480}
          />
          <p className="relative font-serif text-[2rem]">
            <span>Avaneesh Samsi</span>
            <Underline className="absolute -bottom-1 left-0 h-fit w-full" />
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/neeshsamsi"
              className="text-dark transition-opacity hover:opacity-80"
            >
              <Github />
            </a>
            <a
              href="https://linkedin.com/neeshsamsi"
              className="text-dark transition-opacity hover:opacity-80"
            >
              <Linkedin />
            </a>
            <a
              href="https://instagram.com/neeshsamsi"
              className="text-dark transition-opacity hover:opacity-80"
            >
              <Instagram />
            </a>
          </div>
        </div>
        <div className="grid gap-6">
          <p className="relative flex items-center gap-6 font-serif text-5xl font-medium">
            <span>Just an email away</span>
            <Arrow className="text-brand" />
          </p>
          <a
            href="mailto:avaneeshsamsi@gmail.com"
            className="flex items-center gap-3 justify-self-start text-[1.75rem] transition-opacity hover:opacity-80"
          >
            <span className="link-underline relative transition-all ">
              avaneeshsamsi@gmail.com
            </span>
            <ArrowTopRightOnSquareIcon
              className="aspect-square w-7"
              strokeWidth={2}
            />
          </a>
        </div>
      </div>
      <p className="text-center">
        Copyright © {new Date().getFullYear()} Avaneesh Samsi. All rights
        reserved.
      </p>
    </footer>
  )
}
