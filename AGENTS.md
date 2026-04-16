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
