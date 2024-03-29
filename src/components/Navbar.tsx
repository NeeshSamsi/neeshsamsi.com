import Link from "next/link"

export default function Navbar() {
  const navLinks: { text: string; path: string; external?: boolean }[] = [
    {
      text: "Notes",
      path: "https://inquisit.blog/authors/neesh",
      external: true,
    },
    {
      text: "Work",
      path: "/#work",
    },
    {
      text: "About",
      path: "/#about",
    },
    {
      text: "Contact",
      path: "/#contact",
    },
  ]

  return (
    <nav className="flex flex-col items-center justify-between gap-4 py-6 text-base sm:flex-row sm:gap-0 sm:py-8 sm:text-lg">
      <Link
        href="/"
        className="font-serif text-xl font-medium transition-colors hover:text-lighter sm:text-2xl"
      >
        Neesh Samsi
      </Link>

      <ul className="flex items-start justify-between gap-4 font-light sm:items-center sm:gap-8">
        {navLinks.map(({ text, path, external }) => (
          <li key={path} className="transition-colors hover:text-lighter">
            {external ? (
              <a href={path}>{text}</a>
            ) : (
              <Link href={path}>{text}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
