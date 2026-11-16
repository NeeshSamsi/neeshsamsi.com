import { defineConfig } from "@playwright/test"

// The suite runs against the dev server that is already up (Solo runs it on
// port 3000). It never starts one: there is deliberately no `webServer`.
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
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    // Installed Google Chrome: Playwright's bundled Chromium has no H.264
    // decoder, so the Prismic MP4s would never load in it.
    channel: "chrome",
    viewport: { width: 1280, height: 900 },
    trace: "retain-on-failure",
  },
})
