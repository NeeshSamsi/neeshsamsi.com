import "./globals.css"

import type { Metadata, Viewport } from "next"
import { url } from "@/lib/config"

import Script from "next/script"
import { Poppins } from "next/font/google"
import localFont from "next/font/local"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import GridWrapper from "@/components/GridWrapper"
import ContactWidget from "@/components/ContactWidget"
import { client } from "@/lib/prismic"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
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

export async function generateViewport() {
  const {
    data: { themeColor },
  } = await client.getSingle("settings")
  if (!themeColor) {
    throw new Error("Invalid Site Settings")
  }

  return {
    themeColor,
  } satisfies Viewport
}

export async function generateMetadata() {
  const {
    data: { title, description, ogImage, siteName, twitter, themeColor },
  } = await client.getSingle("settings")

  if (
    !title ||
    !description ||
    !ogImage.url ||
    !siteName ||
    !twitter ||
    !themeColor
  ) {
    throw new Error("Invalid Site Settings")
  }

  return {
    metadataBase: new URL(url),
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      title,
      description,
      images: [ogImage.url],
      url,
      siteName,
      type: "website",
    },
    twitter: {
      title: siteName,
      description,
      images: [ogImage.url],
      creator: twitter,
      card: "summary",
    },
    alternates: {
      canonical: "/",
    },
  } satisfies Metadata
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await client.getSingle("settings")

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${sunset.variable} scroll-p-6 scroll-smooth bg-dark font-sans text-light selection:bg-brand/80 selection:text-dark`}
    >
      {process.env.NODE_ENV === "production" && (
        <Script
          strategy="lazyOnload"
          src="https://umami.neeshsamsi.com/script.js"
          data-website-id="c98851cd-fce3-401d-aae0-6249488c14e1"
        />
      )}
      <body>
        <Navbar />
        <GridWrapper as="main">{children}</GridWrapper>
        <Footer />
        <GridWrapper className="pointer-events-none fixed inset-x-0 bottom-8 z-40">
          {settings.data.contact[0]?.ctaText && (
            <ContactWidget
              image={settings.data.contact[0].image}
              ctaText={settings.data.contact[0].ctaText}
            />
          )}
        </GridWrapper>
      </body>
    </html>
  )
}
