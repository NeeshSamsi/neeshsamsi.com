import { client } from "@/lib/prismic"
import Link from "next/link"
import NavLink from "@/components/NavLink"
import NavbarContainer from "@/components/NavbarContainer"
import { getSocialLinks } from "@/lib/utils"

export default async function Navbar() {
  const { data } = await client.getSingle("settings")

  const socialLinks = getSocialLinks(data)

  return (
    <NavbarContainer>
      <Link
        href="/"
        className="font-serif text-base font-medium transition-colors hover:text-lighter sm:text-lg md:text-xl"
      >
        Neesh Samsi
      </Link>

      <ul className="flex items-start justify-between gap-4 font-light sm:items-center">
        {socialLinks.map(({ id, label, field }) => (
          <li key={`nav-link-${id}`}>
            <NavLink field={field}>{label}</NavLink>
          </li>
        ))}
      </ul>
    </NavbarContainer>
  )
}
