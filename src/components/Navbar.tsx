import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-8 text-lg">
      <Link href="/" className="font-serif text-2xl font-medium">
        Neesh Samsi
      </Link>

      <ul className="flex items-center justify-between gap-8 font-light">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/work">Work</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
