import AboutCard from "@/components/AboutCard"
import Headline from "@/components/Headline"
import { asText, Content } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"

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
        <Headline text={asText(heading)} />

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
