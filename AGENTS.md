# AGENTS.md

## Commands

- `pnpm dev` - Next.js dev server (Turbopack) on port 3000
- `pnpm build` - Production build
- `pnpm lint` - ESLint check
- `pnpm typecheck` - `tsc --noEmit`
- `pnpm test` - Vitest unit and component tests (`pnpm test:watch` to watch)
- `pnpm test:e2e` - Playwright browser tests against the dev server already running on port 3000
- `pnpm prismic:status` / `prismic:pull` / `prismic:push` / `prismic:sync` / `prismic:types` - Prismic CLI: compare, download, upload or watch models, and regenerate `prismicio-types.d.ts`

## Architecture

- **Framework**: Next.js 16 (App Router) with Prismic CMS
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Package manager**: pnpm (not npm/yarn)

## Styling rules

- **Always use Tailwind CSS utility classes inline** on elements within components (e.g. `className="flex items-center gap-4"`). This is the default and expected approach for all styling in this project.
- **Do NOT add styles to `globals.css`** or create new CSS files unless the user explicitly requests it.
- **Do NOT use `@apply`** unless the user explicitly requests it.
- If you believe a global style or `@apply` is genuinely necessary, **ask for permission first** and explain why — do not add it silently.
- Existing classes in `globals.css` (`.custom-cols`, `.inline-code`) are intentional and should not be removed or refactored without permission.

## TypeScript rules

- **NEVER use the `any` type** in TypeScript files unless explicitly requested and permitted by the user.

## Key files

- `src/prismicio.ts` - Prismic client configuration
- `src/slices/` - Prismic slice components (CodeBlock, ExternalLinkCallout, FeaturedProject, MediaContent, Notes, PageHeading, ProjectOverview, ProjectShowcase, TextContent)
- `src/lib/prismic.ts` - Every Prismic read: `getByUIDOrNotFound`, `getSettings`, `getAllByType`
- `src/lib/metadata.ts` - `buildPageMetadata`, used by every page's `generateMetadata`
- `src/app/api/revalidate/route.ts` - Prismic webhook endpoint: checks the secret, then clears the cache for the changed documents

## Development notes

- The Prismic Page Builder previews slices by framing `http://localhost:3000/slice-simulator` while `pnpm dev` is running, so `next.config.js` sends no frame-blocking headers and no CSP
- Content edits happen in Prismic dashboard, not locally

## Prismic data and caching

The site follows Prismic's Cache Components setup (`cacheComponents: true`, `@prismicio/next` v3).

- **Read Prismic only through `src/lib/prismic.ts`.** Each function there is a `"use cache"` function with `cacheLife("max")` that calls `cacheTagPrismicPages(...)` on what it returns. A new kind of query gets a new function there in the same shape. `generateStaticParams` is the one exception and uses `createClient()` directly, as Prismic's template does.
- **Previews.** `getPreviewRef()` is read outside the cached function and passed in as an argument. Never read cookies, headers or `searchParams` inside a `"use cache"` function.
- **Publishing.** The Prismic webhook posts the changed document IDs to `/api/revalidate`, which calls `revalidatePrismicPages(ids)` to clear the cache entries tagged with those IDs. It also clears `PRISMIC_LISTS_TAG`, which every list query in `src/lib/prismic.ts` carries: a newly published document has an ID no list was tagged with, so without it the lists, the home page and the sitemap would not show it until a deploy. The sitemap (`src/app/sitemap.ts`) is the other exception to the rule above: it calls `connection()` and queries Prismic uncached on every request, because on Vercel a prerendered sitemap ignores every on-demand refresh.
- **Build rules.** A prerendered page fails the build if it reads uncached data, request data outside a Suspense boundary, or the current time (this is why the Shiki output in `src/slices/CodeBlock` is cached, and why `slice-simulator` has a `loading.tsx`).
- **Local dev.** Prismic content stays cached while the dev server runs. Hard-refresh the page to fetch new content.

## Testing

- **Vitest** (`pnpm test`): tests sit next to the code as `*.test.ts(x)` under `src/`. Node environment by default; a component test opts into jsdom with `// @vitest-environment jsdom` on its first line. Prismic, `next/*` and the network are mocked.
- **Playwright** (`pnpm test:e2e`): specs live in `e2e/`. They reuse the running dev server and never start one, so the server must be up first (`E2E_BASE_URL` overrides `http://localhost:3000`). They run in the installed Google Chrome (`channel: "chrome"`) because Playwright's bundled Chromium cannot decode the H.264 video in the Mux streams; do not download Playwright browsers.
- Navigate in specs with `load(page, path)` from `e2e/fixtures.ts`. The Turbopack dev server sometimes serves a framework chunk empty, which leaves the page unhydrated; `load` reloads when that happens.
- The contact form posts to a real Discord webhook. E2E tests must never submit it (`e2e/contact.spec.ts` blocks every non-GET request); cover submission in Vitest with `fetch` mocked.
- E2E tests read published Prismic content. Assert structure and behaviour and avoid asserting CMS copy.

## Video (Mux)

Clips are hosted on Mux and played with Video.js v10, which is the web player Mux documents. Prismic holds only the playback ID.

- **Content model.** The MediaContent slice (`src/slices/MediaContent/model.json`) has an optional Key Text field `muxPlaybackId` (SingleMedia), and `muxPlaybackId` + `muxPlaybackId2` (DoubleMedia, left and right). A slot is a video exactly when its playback ID is filled; otherwise it shows its image. The slot's image is the poster and gives the aspect ratio in "Original Dimensions" mode, so set it for every clip. Without an image the poster is Mux's own frame (`https://image.mux.com/{PLAYBACK_ID}/thumbnail.webp`).
- **Asset settings.** Every asset is created with `video_quality: "plus"`, `max_resolution_tier: "1080p"` and a `public` playback policy. Mux encodes the adaptive stream and scales larger sources down, so upload the original export. Do not compress or resize it first.
- **Adding a clip.** Run `node --env-file=.env.local scripts/mux-upload.mjs <file-or-url> [--title "Name"]`, then paste the playback ID it prints into the slice's "Mux playback ID" field and publish. `--dry-run` prints the request without contacting Mux. `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` (in `.env.local`) are used by this script only. The site never needs them at runtime, and they must never get a `NEXT_PUBLIC_` name.
- **Player.** `src/components/PrismicVideo.tsx` renders the poster and loads `src/components/PrismicVideoPlayer.tsx` in the browser. The player is a Video.js `Player` with Mux's `MuxVideo` media component and Video.js's own parts for the controls (`PlayButton`, `MuteButton`, `TimeSlider`, `Slider.Thumbnail`, `Gesture`), styled with Tailwind to the site's look. `MuxVideo` adds Mux's storyboard track, which the slider thumbnail reads. Clips default to ambient playback (autoplay, muted, loop) and stay paused under reduced motion.
- **Why the player is browser-only.** Video.js reads the clock while rendering, which breaks the "Build rules" above for a prerendered page, and it brings an HLS engine that pages without video should not download. Keep the dynamic `import()` in `PrismicVideo.tsx`; do not import `PrismicVideoPlayer` statically.
- **Mute button.** It is shown only for clips with sound. `src/lib/video-audio.ts` detects that from the `<video>` element, because Video.js's audio track list stays empty for a clip with a single audio track.
- **Docs.** Mux: [Video.js for Web](https://www.mux.com/docs/guides/playback-videojs-with-mux), [images and storyboards](https://www.mux.com/docs/guides/get-images-from-a-video), [direct uploads](https://www.mux.com/docs/guides/upload-files-directly). Video.js: version-matched docs ship in `node_modules/@videojs/react/docs` (start with `reference/components/mux-video.md` and `guides/thumbnails.md`).
