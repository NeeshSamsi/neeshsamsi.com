import { type JSX } from "react"
import { type Content, asText } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"

import AboutCard from "@/components/AboutCard"
import SectionHeading from "@/components/SectionHeading"

/**
 * Props for `About`.
 */
export type AboutProps = SliceComponentProps<Content.AboutSlice>

/**
 * Component for "About" Slices.
 */
const About = ({ slice }: AboutProps): JSX.Element => {
  const {
    primary: { heading, cards },
  } = slice

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="about"
      className="wrapper mt-24"
    >
      <section>
        <SectionHeading text={asText(heading)} />

        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-12 lg:gap-x-12 lg:gap-y-16 xl:grid-cols-3">
          {cards.map(({ heading, content }, i) => (
            <AboutCard key={i} heading={heading!} content={content!} />
          ))}
        </div>
      </section>
    </section>
  )
}

export default About
