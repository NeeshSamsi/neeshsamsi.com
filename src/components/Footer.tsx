import { client } from "@/lib/prismic"

import Image from "next/image"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import { YouTube, Github, Linkedin, Instagram } from "@/components/Icons"
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next"

export default async function Footer() {
  const {
    data: { footerImage, email, youtube, github, linkedin, instagram },
  } = await client.getSingle("settings")

  return (
    <footer id="contact" className="group mb-8 mt-24 grid gap-16">
      <div className="flex w-full flex-col items-center justify-evenly gap-10 rounded-xl bg-light px-6 py-6 text-dark md:flex-row md:gap-6 lg:px-12 lg:py-10">
        <div className="grid justify-items-center sm:justify-items-start">
          <PrismicNextImage
            field={footerImage}
            className="mb-4 aspect-square w-60 rounded-xl object-cover md:w-48 lg:w-60"
            sizes="(min-width: 1040px) 240px, (min-width: 780px) 192px, 240px"
          />
          <p className="relative mb-6 w-fit font-serif text-2xl sm:text-[2rem] md:text-2xl lg:text-[2rem]">
            Avaneesh Samsi
            <Image
              src="/underline.png"
              alt=""
              width={356}
              height={22}
              sizes="(min-width: 1040px) 240px, (min-width: 780px) 180px, (min-width: 640px) 240px, 180px"
              className="absolute -bottom-3 left-0 h-fit w-full"
            />
          </p>
          <div className="flex items-center justify-center gap-4 md:justify-start">
            <PrismicNextLink
              field={youtube}
              className="text-dark transition-opacity hover:opacity-80"
              aria-label="Social link - YouTube"
            >
              <YouTube />
            </PrismicNextLink>
            <PrismicNextLink
              field={github}
              className="text-dark transition-opacity hover:opacity-80"
              aria-label="Social link - GitHub"
            >
              <Github />
            </PrismicNextLink>
            <PrismicNextLink
              field={linkedin}
              className="text-dark transition-opacity hover:opacity-80"
              aria-label="Social link - LinkedIn"
            >
              <Linkedin />
            </PrismicNextLink>
            <PrismicNextLink
              field={instagram}
              className="text-dark transition-opacity hover:opacity-80"
              aria-label="Social link - Instagram"
            >
              <Instagram />
            </PrismicNextLink>
          </div>
        </div>
        <div className="grid gap-1 sm:gap-4 lg:gap-6">
          <p className="flex items-center gap-4 font-serif text-2xl font-medium sm:text-4xl lg:gap-6 lg:text-5xl">
            <span>Just an email away</span>
            <Image
              src="/arrow.png"
              alt="Doodled arrow"
              width={231}
              height={63}
              sizes="(min-width: 1040px) 112px, (min-width: 640px) 64px, 40px"
              className="w-10 transition-all duration-300 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:-rotate-3 sm:w-16 lg:w-28"
            />
          </p>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1 justify-self-start text-lg transition-opacity hover:opacity-80 sm:gap-3 sm:text-2xl lg:text-[1.75rem]"
          >
            <span className="link-underline">{email}</span>
            <ArrowTopRightOnSquareIcon
              className="aspect-square w-5 sm:w-7"
              strokeWidth={2}
            />
          </a>
        </div>
      </div>
      <p className="text-center text-sm font-light md:text-base">
        Copyright © {new Date().getFullYear()} Avaneesh Samsi. All rights
        reserved.
      </p>
    </footer>
  )
}
