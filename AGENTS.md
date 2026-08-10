# AGENTS.md

## Commands

- `pnpm dev` - Runs Next.js + Slice Machine concurrently (both required for CMS development)
- `pnpm build` - Production build
- `pnpm lint` - ESLint check
- `pnpm slicemachine` - Run Slice Machine only

## Architecture

- **Framework**: Next.js 15 (App Router) with Prismic CMS
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Package manager**: pnpm (not npm/yarn)

## Styling rules

- **Always use Tailwind CSS utility classes inline** on elements within components (e.g. `className="flex items-center gap-4"`). This is the default and expected approach for all styling in this project.
- **Do NOT add styles to `globals.css`** or create new CSS files unless the user explicitly requests it.
- **Do NOT use `@apply`** unless the user explicitly requests it.
- If you believe a global style or `@apply` is genuinely necessary, **ask for permission first** and explain why — do not add it silently.
- Existing classes in `globals.css` (e.g. `.wrapper`, `.underline-animation`, `.inline-code`) are intentional and should not be removed or refactored without permission.

## TypeScript rules

- **NEVER use the `any` type** in TypeScript files unless explicitly requested and permitted by the user.

## Key files

- `src/prismicio.ts` - Prismic client configuration
- `src/slices/` - Prismic slice components (About, Hero, Notes, Play, Reviews, RichText, Work, CodeBlock, PageHeading)
- `src/lib/prismic.ts` - Prismic helper utilities
- `src/app/api/revalidate/route.ts` - On-demand ISR revalidation endpoint

## Development notes

- Slice Machine runs at `http://localhost:3000/slice-simulator` when `pnpm dev` is running
- Content edits happen in Prismic dashboard, not locally
- No test suite exists in this project

## Video optimization for Prismic

Videos are uploaded to Prismic's media library and referenced via a "Link to Media" field (see `src/slices/MediaContent/model.json`, rendered by `src/components/PrismicVideo.tsx`). Prismic serves the uploaded file as-is from its CDN with HTTP range-request support — it does **not** transcode or generate adaptive-bitrate streams. So all optimization has to happen locally, before upload, with these goals:

- **Fast start** — `-movflags +faststart` moves the MP4 `moov` atom to the front so playback can begin before the whole file downloads. Without this, progressive streaming/seeking from the Prismic CDN is effectively broken.
- **Broad compatibility** — H.264 (`libx264`) in `yuv420p` pixel format plays everywhere without extra config.
- **Small file size** — Prismic enforces a per-asset upload cap on the media library (varies by plan — check the repository dashboard if an upload is rejected). Favor CRF-based encoding over fixed bitrate to keep quality/size balanced, and cap resolution at 1920px on the long edge (this site never renders video wider than the viewport).
- **Strip audio when unused** — `PrismicVideo` defaults every clip to autoplay/muted/loop ("GIF-style" ambient background). If the clip has no audible content, drop the audio track entirely to save size.

### Commands

Run from wherever the source file lives; swap `input.mov` / `output.mp4` as needed.

**Ambient/background clip (autoplay, muted, loop — the default `PrismicVideo` use case, no audio needed):**

```bash
ffmpeg -i input.mov \
  -vf "scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -preset slow -crf 26 \
  -movflags +faststart \
  -an \
  output.mp4
```

**Standard clip with audio (viewer may unmute via the controls in `PrismicVideo`):**

```bash
ffmpeg -i input.mov \
  -vf "scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -preset slow -crf 23 \
  -movflags +faststart \
  -c:a aac -b:a 128k -ac 2 \
  output.mp4
```

**Poster frame (optional — extracts a still to use as the `Image` field, shown before playback starts):**

```bash
ffmpeg -i output.mp4 -ss 00:00:01 -vframes 1 -q:v 2 poster.jpg
```

### Notes

- Lower CRF = higher quality/larger file. 23 is a good default for clips with audible/foreground content; 26 is fine for background loops where fine detail matters less. Go as high as 28–30 if a clip still exceeds the upload cap.
- `scale=...force_divisible_by=2` avoids odd dimensions, which `libx264`/`yuv420p` reject.
- Check the result before uploading: `ffprobe -v error -show_entries format=size,duration -of default=noprint_wrappers=1 output.mp4`.
- `-preset slow` trades encode time for compression efficiency; drop to `medium` if iterating quickly on settings.
