import { client } from "@/lib/prismic"
import Link from "next/link"
import { PrismicNextLink } from "@prismicio/next"

export default async function Navbar() {
  const { data } = await client.getSingle("settings")

  const navLinks = [
    { id: "instagram", label: "Instagram", field: data.instagram },
    { id: "youtube", label: "YouTube", field: data.youtube },
    { id: "github", label: "GitHub", field: data.github },
    { id: "linkedin", label: "LinkedIn", field: data.linkedin },
  ]

  return (
    <nav className="col-span-full grid grid-cols-subgrid items-center justify-between gap-4 py-6 text-base sm:flex-row sm:gap-0 sm:py-8 sm:text-lg">
      <Link
        href="/"
        className="font-serif text-lg font-medium transition-colors hover:text-lighter md:text-xl"
      >
        Neesh Samsi
      </Link>

      <ul className="flex items-start justify-between gap-4 font-light sm:items-center sm:gap-8">
        {navLinks.map(({ id, label, field }) => (
          <li key={`nav-link-${id}`}>
            <PrismicNextLink
              field={field}
              className="underline-animation transition-colors hover:text-lighter"
            >
              {label}
            </PrismicNextLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
