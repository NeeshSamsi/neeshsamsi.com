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
- Short links (`/instagram`, `/github`, `/linkedin`, `/susu`) are rewrites to Umami Links on https://umami.neeshsamsi.com, which count each click and redirect. Their destinations live in Umami (Links). To add one, create a Link there (slugs need at least 8 characters) and add the path and slug to the map in `next.config.js`

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

## Analytics (Umami)

The site reports to a self-hosted Umami at https://umami.neeshsamsi.com. It is cookieless, and visitors who send Do Not Track are left out.

- **Where it runs.** `src/components/Umami.tsx` renders the tracker and the recorder (replays and heatmaps) only on the production deployment (`isProductionDeployment` in `src/lib/deployment.ts`), and the tracker also checks the hostname (`data-domains`). Local work, previews and the e2e suite report nothing. Both scripts and every request they make go through the `/u/` rewrites in `next.config.js`, so the browser only ever talks to this site. The recorder's sample rate, masking and duration are set in the Umami dashboard (Websites, Edit, Replays & Heatmaps); attributes on its script tag are ignored.
- **Event names.** `object_action` in lower snake case (`contact_open`, `outbound_click`, `project_card_click`). One name per kind of action; the variation goes in properties (`kind`, `target`, `location`, `host`, `project`, `position`, `section`, `note`, `trigger`, `method`, `had_input`). Property names are snake case and shared across events. Values are short, lower case and from a fixed list or a slug or UID. The page is attached to every event already, so never repeat it as a property. Umami goals and funnels are built on these names: do not rename an event or property without updating them.
- **The internal-link trap.** Never put `data-umami-event` on an anchor that navigates inside the site (`next/link`, or `PrismicNextLink` with a document link). The tracker cancels a click on a tracked same-tab anchor, records the event and then sets `location.href`, so Next never sees the click and the visitor gets a full page load. The attributes are safe on links to other sites, on `mailto:` links and on buttons.
- **The wrapper pattern.** For a link to a page here, put the attributes on an element INSIDE the anchor that covers its content: wrap the children in `<Tracked event={...}>` (`src/components/Tracked.tsx`, a `display: contents` span), or pass `event` to `Button` or `NavLink`, which place the attributes correctly for internal and external links. A click on the anchor's own padding, and a link followed from the keyboard, land on the anchor and are not counted, so keep the padding inside the wrapper (as `Button` does).
- **Adding an event.** In a Server Component, spread `eventAttributes({ name, data })` from `src/lib/umami.ts` onto the element (or use `Tracked`, `Button` or `NavLink` as above). Attribute values are always stored as strings and need no client JavaScript. Call `track(name, data)` from `src/lib/umami.ts` only inside a component that is already a client component, when the event has no click to hang on or needs a boolean or number. `identify(data)` sets anonymous session properties. Both helpers do nothing when the tracker is missing, so never call `window.umami` directly. Then add the event to `e2e/analytics.spec.ts`.
- **Privacy.** Never put names, email addresses, message text, error text shown to the visitor, or anything else a visitor typed into event or session data. Record a fixed code in its place (the contact action's `code` exists for this). Never call `identify` with an ID. Outbound links record the hostname only.
- **Testing.** Vitest covers the helpers and the contact events with `track` mocked. `e2e/analytics.spec.ts` runs the real tracker: it fetches `/u/a.js` once, adds the script tag itself (the component does not render in dev), answers `**/u/api/send` locally and asserts on the recorded payloads, and it fails if any request reaches the Umami host or any write other than the stubbed one is attempted. Every tracked internal link has a test that the navigation stayed client-side.

## Video (Mux)

Clips are hosted on Mux and played with Video.js v10, which is the web player Mux documents. Prismic holds only the playback ID.

- **Content model.** The MediaContent slice (`src/slices/MediaContent/model.json`) has an optional Key Text field `muxPlaybackId` (SingleMedia), and `muxPlaybackId` + `muxPlaybackId2` (DoubleMedia, left and right). A slot is a video exactly when its playback ID is filled; otherwise it shows its image. The slot's image is the poster and gives the aspect ratio in "Original Dimensions" mode, so set it for every clip. Without an image the poster is Mux's own frame (`https://image.mux.com/{PLAYBACK_ID}/thumbnail.webp`).
- **Asset settings.** Every asset is created with `video_quality: "plus"`, `max_resolution_tier: "1080p"` and a `public` playback policy. Mux encodes the adaptive stream and scales larger sources down, so upload the original export. Do not compress or resize it first.
- **Adding a clip.** Run `node --env-file=.env.local scripts/mux-upload.mjs <file-or-url> [--title "Name"]`, then paste the playback ID it prints into the slice's "Mux playback ID" field and publish. `--dry-run` prints the request without contacting Mux. `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` (in `.env.local`) are used by this script only. The site never needs them at runtime, and they must never get a `NEXT_PUBLIC_` name.
- **Player.** `src/components/PrismicVideo.tsx` renders the poster and loads `src/components/PrismicVideoPlayer.tsx` in the browser. The player is a Video.js `Player` with Mux's `MuxVideo` media component and Video.js's own parts for the controls (`PlayButton`, `MuteButton`, `TimeSlider`, `Slider.Thumbnail`, `Gesture`), styled with Tailwind to the site's look. `MuxVideo` adds Mux's storyboard track, which the slider thumbnail reads. Clips default to ambient playback (autoplay, muted, loop) and stay paused under reduced motion.
- **Why the player is browser-only.** Video.js reads the clock while rendering, which breaks the "Build rules" above for a prerendered page, and it brings an HLS engine that pages without video should not download. Keep the dynamic `import()` in `PrismicVideo.tsx`; do not import `PrismicVideoPlayer` statically.
- **Playback analytics.** The player includes Video.js's `MuxData` extension (`@videojs/mux-data`), which reports each view's startup time, rebuffering, failures and watch time to Mux Data. Mux attributes views to the environment that owns the playback ID, so there is no environment key. It renders only on the production deployment (`isProductionDeployment` in `src/lib/deployment.ts`), so local work, previews and the e2e suite add no views, and `disableCookies` keeps the site free of cookies. A view shows the asset's title (the `--title` given to `mux-upload.mjs`) when Mux Data is set to use Mux Video metadata.
- **Mute button.** It is shown only for clips with sound. `src/lib/video-audio.ts` detects that from the `<video>` element, because Video.js's audio track list stays empty for a clip with a single audio track.
- **Docs.** Mux: [Video.js for Web](https://www.mux.com/docs/guides/playback-videojs-with-mux), [images and storyboards](https://www.mux.com/docs/guides/get-images-from-a-video), [direct uploads](https://www.mux.com/docs/guides/upload-files-directly). Video.js: version-matched docs ship in `node_modules/@videojs/react/docs` (start with `reference/components/mux-video.md` and `guides/thumbnails.md`).
