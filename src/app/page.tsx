import AboutCard from "@/components/AboutCard"
import Button from "@/components/Button"
import UnderlineFancy from "@/components/Graphics/UnderlineFancy"
import Headline from "@/components/Headline"
import ProjectCard from "@/components/ProjectCard"
import {
  ArrowLongRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"

export default function Home() {
  return (
    <>
      <main className="flex items-center justify-between gap-8 pt-4">
        <div className="text-2xl font-light text-lighter">
          <p className="mb-3 flex items-center gap-2">
            <span>Hi</span>
            <Image
              src="/wave.png"
              alt="Wave emoji"
              height={48}
              width={48}
              className="aspect-square w-7 object-cover"
            />
            <span>I&apos;m Neesh!</span>
          </p>
          <h1 className="mb-4 max-w-[18ch] font-serif text-5xl leading-[1.3] text-light">
            I Create{" "}
            <span className="relative">
              Captivating
              <UnderlineFancy className="absolute -bottom-2 left-0 -z-10 h-fit w-fit text-accent" />
            </span>{" "}
            and{" "}
            <span className="underline decoration-accent underline-offset-8">
              Functional
            </span>{" "}
            Experiences on the Web
          </h1>
          <p className="mb-8 max-w-[40ch]">
            I am a passionate UI/UX designer & developer. <br />I use Figma to
            conceptualise and Next.js & Typescript to bring my designs to life.
          </p>

          <div className="flex items-center gap-6">
            <Button element="link" href="#work" type="solid" theme="brand">
              <span>See my work</span>
              <ArrowLongRightIcon
                className="aspect-square w-6"
                strokeWidth={2}
              />
            </Button>
            <Button element="link" href="#contact" type="outline" theme="light">
              <span>Get in touch</span>
              <ChatBubbleLeftRightIcon className="aspect-square w-6" />
            </Button>
          </div>
        </div>
        <Image
          src="/hero.png"
          alt="Profile picture of Avaneesh Samsi"
          width={1100}
          height={1188}
          className="w-[25vw]"
        />
      </main>

      <section id="work" className="pt-12">
        <Headline text="My work" className="mb-10 w-fit text-[2.75rem]" />

        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
          {Array.from({ length: 3 }).map((_el, i) => (
            <ProjectCard
              key={i}
              image={{ src: "/footer-neesh.png", alt: "" }}
              tags="Musician, UI UX, Visual design, Web development"
              title="Website Redesign for the Yogesh Samsi"
              description="Revamping Yogesh Samsi’s online presence with consistent branding, better structure and clear goals for user when landing on the website."
            />
          ))}
        </div>
      </section>

      <section id="about" className="pt-24">
        <Headline text="About us" className="mb-10 w-fit text-[2.75rem]" />

        <div className="grid grid-cols-[repeat(3,40ch)] gap-x-8 gap-y-8">
          {Array.from({ length: 5 }).map((_el, i) => (
            <AboutCard
              key={i}
              heading="Heading"
              paragraphs={[
                "Lorem ipsum dolor sit amet consectetur. Augue duis ornare risus eget purus habitant. Faucibus eu nunc nisl quis hendrerit at. Sit tempor quis elementum ultricies eget sagittis. Morbi aliquet sagittis id auctor rutrum diam diam et. Cursus.",
              ]}
            />
          ))}
        </div>
      </section>
    </>
  )
}
