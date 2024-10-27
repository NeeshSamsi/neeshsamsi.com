import { type JSX } from "react"
import { type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"

import Image from "next/image"
import Button from "@/components/Button"
import {
  ArrowLongRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline"

/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>

/**
 * Component for "Hero" Slices.
 */
const Hero = async ({ slice }: HeroProps): Promise<JSX.Element> => {
  const {
    primary: { name, description, workCta, contactCta },
  } = slice

  return (
    <main
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="wrapper"
    >
      <main className="grid items-center justify-items-center gap-10 pt-8 sm:justify-items-start sm:pt-12 md:grid-cols-[1.3fr,1fr] md:gap-6 lg:grid-cols-2 lg:gap-24 xl:pt-4">
        <div className="group/main text-base font-light text-lighter sm:text-xl xl:text-2xl">
          <p className="mb-2 flex items-center gap-2 lg:mb-3">
            <span>Hi</span>
            <Image
              src="/wave.png"
              alt="Wave emoji"
              height={48}
              width={48}
              sizes="(min-width: 1280px) 28px, 20px"
              priority
              className="aspect-square w-5 animate-wave object-cover group-hover/main:animate-wave-y xl:w-7"
            />
            <span>I&apos;m {name}!</span>
          </p>
          <h1 className="mb-2 max-w-[18ch] font-serif text-3xl leading-[1.4] text-light sm:text-4xl sm:leading-[1.5] lg:mb-4 xl:text-5xl xl:leading-[1.3]">
            I Create{" "}
            <span className="relative">
              Intuitive
              <Image
                src="/fancy-underline.png"
                alt=""
                width={494}
                height={34}
                priority
                sizes="(min-width: 1280px) 165px, (min-width: 640px) 123px, 103px"
                className="absolute -bottom-1 left-0 -z-10 w-full text-accent xl:-bottom-2"
              />
            </span>{" "}
            and{" "}
            <span className="underline decoration-accent decoration-[3px] underline-offset-[6px]">
              Delightful
            </span>{" "}
            Experiences on the Web
          </h1>
          <p className="mb-6 max-w-[40ch]">{description}</p>

          <div className="flex items-center gap-4 text-sm sm:text-base lg:gap-6 lg:text-lg xl:text-xl">
            <Button
              element="link"
              href="#work"
              type="solid"
              theme="brand"
              className="group/icon"
            >
              <span>{workCta}</span>
              <ArrowLongRightIcon
                className="aspect-square w-5 transition-all group-hover/icon:translate-x-0.5 sm:w-6"
                strokeWidth={2}
              />
            </Button>
            <Button
              element="link"
              href="#contact"
              type="outline"
              theme="light"
              className="group"
            >
              <span>{contactCta}</span>
              <ChatBubbleLeftRightIcon className="aspect-square w-5 sm:w-6" />
            </Button>
          </div>
        </div>
        <Image
          src="/hero.png"
          alt="Profile picture of Avaneesh Samsi"
          width={1100}
          height={1188}
          priority
          sizes="(min-width: 1360px) 560px, (min-width: 1040px) calc(40vw + 24px), 16.81vw"
          className="w-[30vh] object-cover lg:w-full"
        />
      </main>
    </main>
  )
}

export default Hero
