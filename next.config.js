/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  redirects: async () => [
    {
      source: "/stats",
      destination:
        "https://umami.neeshsamsi.com/websites/6a4f158b-409d-4cdb-a2f0-3c081e73e846",
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
      destination: "https://linkedin.com/in/neeshsamsi",
      permanent: true,
    },
  ],
}
