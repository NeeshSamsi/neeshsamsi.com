import "./globals.css"
// import type { Metadata } from 'next'
import { Poppins } from "next/font/google"
import localFont from "next/font/local"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
})

const sunset = localFont({
  src: [
    {
      path: "../assets/fonts/sunset-serial-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/sunset-serial-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/sunset-serial-medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sunset",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${sunset.variable} scroll-smooth bg-dark font-sans text-light selection:bg-brand/80 selection:text-dark`}
    >
      <body className="mx-auto max-w-screen-xl px-8">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
