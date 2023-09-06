const { withContentlayer } = require("next-contentlayer")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  redirects: async () => [
    {
      source: "/work",
      destination: "/#work",
      permanent: true,
    },
    {
      source: "/instagram",
      destination: "https://instagram.com/neeshsamsi",
      permanent: true,
    },
    {
      source: "/github",
      destination: "https://github.com/neeshsamsi",
      permanent: true,
    },
    {
      source: "/linkedin",
      destination: "https://linkedin.com/neeshsamsi",
      permanent: true,
    },
  ],
}

module.exports = withContentlayer(nextConfig)
