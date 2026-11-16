# neeshsamsi.com

Neesh Samsi's portfolio: client work, self-initiated projects and short notes on web development.

## Stack

- Next.js 16 (App Router, Turbopack) with React 19 and TypeScript
- Prismic for all content (pages, projects, notes, site settings)
- Tailwind CSS v4 with `@tailwindcss/typography`
- GSAP and Lenis for motion, Shiki for code blocks
- Vitest and Playwright for tests
- pnpm 9.15.9, pinned through Corepack (`corepack enable`)

## Setup

```bash
pnpm install
cp .env.example .env.local
```

`DISCORD_WEBHOOK_URL` is required (the contact form posts there). `PRISMIC_WEBHOOK_SECRET` is optional locally. Both are validated in `src/lib/env.ts`.

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on http://localhost:3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Vitest unit and component tests (`pnpm test:watch` to watch) |
| `pnpm test:e2e` | Playwright tests against a dev server that is already running |
| `pnpm prismic:status` | Compare local Prismic models with the repository |
| `pnpm prismic:pull` / `pnpm prismic:push` | Download or upload models |
| `pnpm prismic:sync` | Watch and sync models while developing |
| `pnpm prismic:types` | Regenerate `prismicio-types.d.ts` |

## Content workflow

Content lives in the Prismic repository `neeshsamsi` and is edited in the Prismic dashboard.

- **Models.** Custom types are in `customtypes/` and slices in `src/slices/`. Change them locally, regenerate types with `pnpm prismic:types`, read `pnpm prismic:status`, then `pnpm prismic:push`. The Prismic CLI needs `prismic login` first.
- **Slice previews.** The Prismic Page Builder loads `/slice-simulator` in a frame to preview slices.
- **Bulk edits.** Scripted changes go through Prismic's Migration API. They land in the Migration release in the dashboard, where they are reviewed and published by hand.
- **Publishing.** A Prismic webhook posts to `/api/revalidate` with a shared secret (`PRISMIC_WEBHOOK_SECRET`). The route revalidates the `prismic` cache tag, which every Prismic request in production carries.
- **Previews.** `/api/preview` and `/api/exit-preview` handle Prismic draft previews.

## Testing

- Unit and component tests sit next to the code as `*.test.ts(x)` under `src/`. Prismic, `next/*` and the network are mocked.
- Browser tests are in `e2e/`. Start the dev server first; they run in the installed Google Chrome and read published Prismic content.
- The contact form posts to a real Discord webhook, so browser tests never submit it.

`AGENTS.md` has the full conventions for styling, TypeScript and tests.

## Video

Clips are currently uploaded to Prismic's media library (encoding settings are in `AGENTS.md`). Video is moving to Mux.
