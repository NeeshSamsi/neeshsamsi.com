import "./globals.css"

import type { Metadata, Viewport } from "next"
import config from "@/lib/config"

import { Poppins } from "next/font/google"
import localFont from "next/font/local"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Script from "next/script"

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

const { url, siteName, twitter: creator, themeColor, description } = config

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor,
}

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    images: ["/og.png"],
    url,
    siteName,
    type: "website",
  },
  twitter: {
    title: siteName,
    description,
    images: ["/og.png"],
    creator,
    card: "summary",
  },
  alternates: {
    canonical: "/",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${sunset.variable} overscroll-x-none scroll-smooth bg-dark font-sans text-light selection:bg-brand/80 selection:text-dark`}
    >
      {process.env.NODE_ENV === "production" && (
        <Script
          strategy="lazyOnload"
          src="https://umami.neeshsamsi.com/script.js"
          data-website-id="c98851cd-fce3-401d-aae0-6249488c14e1"
        />
      )}
      <body className="mx-auto max-w-screen-xl px-8">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
