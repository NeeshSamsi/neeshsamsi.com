import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ContactWidgetProps {
  /** Link destination. Can be an internal anchor (e.g. `#contact`) or external URL (e.g. `mailto:`). */
  href?: string
  /** Image source for the profile picture. Defaults to the site hero image. */
  imageSrc?: string
  /** Alt text for the profile picture. */
  imageAlt?: string
  /** Text label shown beside the image. */
  label?: string
  /** Additional classes appended to the root element. */
  className?: string
}

export default function ContactWidget({
  href = "#contact",
  imageSrc = "/hero.png",
  imageAlt = "Profile picture of Avaneesh Samsi",
  label = "Get in touch",
  className,
}: ContactWidgetProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:")

  const content = (
    <>
      <div className="relative aspect-square h-full shrink-0 overflow-hidden bg-brand">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <span className="pr-5 pl-4 font-serif text-lg leading-none text-light sm:text-xl md:pr-6 md:pl-5 md:text-2xl">
        {label}
      </span>
    </>
  )

  const classes = cn(
    "group inline-flex h-12 items-center overflow-hidden rounded-lg border-2 border-brand bg-dark transition-colors hover:bg-dark/80 sm:h-14 md:h-16",
    className,
  )

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}
