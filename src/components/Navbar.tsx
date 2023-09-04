import Link from "next/link"

export default function Navbar() {
  const navLinks = [
    {
      text: "Home",
      path: "/",
    },
    {
      text: "Work",
      path: "/work",
    },
    {
      text: "About",
      path: "/about",
    },
    {
      text: "Contact",
      path: "/contact",
    },
  ]

  return (
    <nav className="flex items-center justify-between py-8 text-lg">
      <Link
        href="/"
        className="font-serif text-2xl font-medium transition-colors hover:text-lighter"
      >
        Neesh Samsi
      </Link>

      <ul className="flex items-center justify-between gap-8 font-light">
        {navLinks.map(({ text, path }) => (
          <li key={path} className="transition-colors hover:text-lighter">
            <Link href={path}>{text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
