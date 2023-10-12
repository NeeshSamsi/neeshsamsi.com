import Image from "next/image"

import config from "@/lib/config"
import { allWorks } from "contentlayer/generated"

import {
  ArrowLongRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline"
import Button from "@/components/Button"
import Headline from "@/components/Headline"
import Project from "@/components/Project"
import Review from "@/components/Review"
import About from "@/components/About"

export default function Home() {
  const works = allWorks
    // Remove template file
    .filter((work) => work.slug !== "template")
    // Remove drafts in prod
    .filter((work) =>
      process.env.NODE_ENV === "production" ? work.published : true,
    )
    // Srot by latest updated
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    // Parse out unnecessary data
    .map(
      ({
        _id,
        _raw,
        body,
        published,
        type,
        updatedAt,
        image,
        imageAlt,
        ...rest
      }) => {
        return {
          ...rest,
          image: { src: image, alt: imageAlt },
        }
      },
    )

  const { about, reviews } = config

  return (
    <>
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
            <span>I&apos;m Neesh!</span>
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
              Functional
            </span>{" "}
            Experiences on the Web
          </h1>
          <p className="mb-6 max-w-[40ch]">
            I am a passionate UI/UX designer & developer. I use Figma to
            conceptualise and Next.js & Typescript to bring my designs to life.
          </p>

          <div className="flex items-center gap-4 text-sm sm:text-base lg:gap-6 lg:text-lg xl:text-xl">
            <Button
              element="link"
              href="#work"
              type="solid"
              theme="brand"
              className="group/icon"
            >
              <span>See my work</span>
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
              <span>Get in touch</span>
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

      <section id="work" className="mt-24">
        <Headline text="My work" />

        {works.length > 0 ? (
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-12">
            {works.map((work, i) => (
              <Project key={i} {...work} priority={i < 2} />
            ))}
          </div>
        ) : (
          <p className="text-sm md:text-base lg:text-lg xl:text-xl">
            No work to showcase.
          </p>
        )}
      </section>

      <section id="reviews-and-feedback" className="mt-24">
        <Headline text="Reviews & feedback" />

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-12 lg:gap-y-16 xl:grid-cols-3">
            {reviews.map((review, i) => (
              <Review key={i} {...review} />
            ))}
          </div>
        ) : (
          <p className="text-sm md:text-base lg:text-lg xl:text-xl">
            No reviews or feedback.
          </p>
        )}
      </section>

      <section id="about" className="mt-24">
        <Headline text="About us" />

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-12 lg:gap-y-16 xl:grid-cols-3">
          {about.map((card, i) => (
            <About key={i} {...card} />
          ))}
        </div>
      </section>
    </>
  )
}
