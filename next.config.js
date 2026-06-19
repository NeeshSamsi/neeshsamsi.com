/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  rewrites: async () => [
    // Umami scripts are proxied through /u/ with neutral filenames so ad
    // blockers don't match Umami's well-known names (script.js, recorder.js).
    // a.js = Umami tracker (script.js), b.js = session recorder (recorder.js).
    // Keep these in sync with the <Script src> paths in components/Umami.tsx.
    {
      source: "/u/a.js",
      destination: "https://umami.neeshsamsi.com/script.js",
    },
    {
      source: "/u/b.js",
      destination: "https://umami.neeshsamsi.com/recorder.js",
    },
    // Catch-all so the data endpoint (/u/api/send) still reaches Umami.
    {
      source: "/u/:path*",
      destination: "https://umami.neeshsamsi.com/:path*",
    },
  ],
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
    {
      source: "/susu",
      destination: "/experiments/susu",
      permanent: true,
    },
  ],
}
