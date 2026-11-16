import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

/**
 * Typed, validated environment variables.
 *
 * Anything listed under `server` is server-only: importing this file from a
 * client component will fail at build time if these are read there, and the
 * values never reach the browser bundle.
 *
 * Build/dev fails fast if a variable is missing or malformed — catches
 * misconfiguration before it ever hits production.
 */
export const env = createEnv({
  server: {
    DISCORD_WEBHOOK_URL: z
      .string()
      .url()
      .startsWith("https://discord.com/api/webhooks/"),
    // Shared secret for the Prismic webhook that calls /api/revalidate.
    // Optional: when unset the endpoint accepts any POST, as it always has.
    PRISMIC_WEBHOOK_SECRET: z.string().min(1).optional(),
  },
  experimental__runtimeEnv: process.env,
})
