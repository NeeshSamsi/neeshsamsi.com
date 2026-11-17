import { existsSync } from "node:fs"
import { defineConfig } from "@playwright/test"

// Local secrets, for the Vercel bypass below. Variables already set in the
// shell take precedence.
if (existsSync(".env.local")) process.loadEnvFile(".env.local")

// Vercel previews sit behind Vercel Authentication. When E2E_BASE_URL points
// at one and VERCEL_AUTOMATION_BYPASS_SECRET holds the project's "Protection
// Bypass for Automation" secret, the global setup trades the secret for
// Vercel's bypass cookie and every test starts with that cookie. Sending the
// secret as a header from the browser would also send it to Mux and Prismic.
const vercelBypass =
  !!process.env.E2E_BASE_URL && !!process.env.VERCEL_AUTOMATION_BYPASS_SECRET

// By default the suite runs against the dev server that is already up (Solo
// runs it on port 3000). It never starts one: there is deliberately no
// `webServer`.
export default defineConfig({
  testDir: "./e2e",
  // First hits compile routes on demand in dev, so be generous.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  // One page at a time: the dev server compiles and serves chunks on demand,
  // and parallel cold hits make it drop chunk responses.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  globalSetup: vercelBypass ? "./e2e/global-setup.ts" : undefined,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    storageState: vercelBypass
      ? "playwright/.auth/vercel-bypass.json"
      : undefined,
    // Installed Google Chrome: Playwright's bundled Chromium has no H.264
    // decoder, so the Mux video streams would never play in it.
    channel: "chrome",
    viewport: { width: 1280, height: 900 },
    trace: "retain-on-failure",
  },
})
