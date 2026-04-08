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

## Key files

- `src/prismicio.ts` - Prismic client configuration
- `src/slices/` - Prismic slice components (About, Hero, Notes, Play, Reviews, RichText, Work, CodeBlock, PageHeading)
- `src/lib/prismic.ts` - Prismic helper utilities
- `src/app/api/revalidate/route.ts` - On-demand ISR revalidation endpoint

## Development notes

- Slice Machine runs at `http://localhost:3000/slice-simulator` when `pnpm dev` is running
- Content edits happen in Prismic dashboard, not locally
- No test suite exists in this project
