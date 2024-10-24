import { client } from "@/lib/prismic"
import Link from "next/link"
import { PrismicNextLink } from "@prismicio/next"

export default async function Navbar() {
  const {
    data: { navLinks },
  } = await client.getSingle("settings")

  return (
    <nav className="wrapper flex flex-col items-center justify-between gap-4 py-6 text-base sm:flex-row sm:gap-0 sm:py-8 sm:text-lg">
      <Link
        href="/"
        className="font-serif text-xl font-medium transition-colors hover:text-lighter sm:text-2xl"
      >
        Neesh Samsi
      </Link>

      <ul className="flex items-start justify-between gap-4 font-light sm:items-center sm:gap-8">
        {navLinks.map(({ link }, i) => (
          <li key={`nav-link-${i}`}>
            <PrismicNextLink
              field={link}
              className=" transition-colors hover:text-lighter"
            />
          </li>
        ))}
      </ul>
    </nav>
  )
}
