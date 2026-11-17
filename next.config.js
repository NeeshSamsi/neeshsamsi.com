/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Prismic content is cached with "use cache" functions (see src/lib/prismic.ts).
  cacheComponents: true,
  // Next asks for an explicit value alongside cacheComponents. Off keeps link
  // prefetching as it was before the migration.
  partialPrefetching: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  headers: async () => [
    {
      // Sent with every response. There is deliberately no Content-Security-Policy
      // and no frame-blocking header (X-Frame-Options or frame-ancestors): the
      // Prismic Page Builder loads /slice-simulator in a frame, and previews
      // have to keep working. Add those only with allowances for Prismic.
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
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
    // Short links. Each one is an Umami Link, which records the click and
    // redirects to the destination set in Umami (Links in the dashboard).
    // Proxying keeps the umami.neeshsamsi.com hop out of the visitor's way.
    ...Object.entries({
      instagram: "site-instagram",
      github: "site-github",
      linkedin: "site-linkedin",
      susu: "site-susu",
    }).map(([path, slug]) => ({
      source: `/${path}`,
      destination: `https://umami.neeshsamsi.com/q/${slug}`,
    })),
  ],
  redirects: async () => [
    {
      // The homepage is served at "/"; the catch-all also resolves "/home".
      // Collapse the duplicate to a single canonical URL.
      source: "/home",
      destination: "/",
      permanent: true,
    },
    {
      // The site's Umami dashboard. Temporary, so a later change reaches
      // browsers that have used it before.
      source: "/stats",
      destination:
        "https://umami.neeshsamsi.com/websites/c98851cd-fce3-401d-aae0-6249488c14e1",
      permanent: false,
    },
  ],
}
