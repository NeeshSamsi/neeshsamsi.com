import { request, type FullConfig } from "@playwright/test"

/**
 * Runs only when the suite targets a protected Vercel preview (see
 * `playwright.config.ts`). Sends the bypass secret once, from Node, and saves
 * the cookie Vercel sets in return as the storage state every test starts
 * from. The browser then carries only that cookie, and only to the preview.
 */
export default async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use
  const context = await request.newContext({ baseURL })
  const response = await context.get("/", {
    headers: {
      "x-vercel-protection-bypass":
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? "",
      "x-vercel-set-bypass-cookie": "true",
    },
  })
  if (!response.ok()) {
    throw new Error(
      `Vercel bypass failed for ${baseURL}: HTTP ${response.status()}. Check VERCEL_AUTOMATION_BYPASS_SECRET.`,
    )
  }
  await context.storageState({ path: storageState as string })
  await context.dispose()
}
