import {
  test as base,
  expect,
  type Page,
  type Request,
  type Response,
} from "@playwright/test"

/**
 * `test` with a record of what went wrong in the browser. When a test fails,
 * the page's errors, failed requests and error responses are attached to the
 * report, which is usually what explains a failure against a dev server (a
 * chunk that didn't load means the page never hydrated).
 */
export const test = base.extend<{ browserProblems: string[] }>({
  browserProblems: [
    async ({ page }, use, testInfo) => {
      const problems: string[] = []
      page.on("pageerror", (error) =>
        problems.push(`pageerror: ${error.message}`),
      )
      page.on("console", (message) => {
        if (message.type() === "error")
          problems.push(`console: ${message.text()}`)
      })
      page.on("requestfailed", (request) =>
        problems.push(
          `failed: ${request.url()} ${request.failure()?.errorText ?? ""}`,
        ),
      )
      page.on("response", (response) => {
        if (response.status() >= 500) {
          problems.push(`http ${response.status()}: ${response.url()}`)
        } else if (
          response.headers()["content-length"] === "0" &&
          response.ok()
        ) {
          problems.push(`empty response: ${response.url()}`)
        }
      })

      await use(problems)

      if (testInfo.status !== testInfo.expectedStatus && problems.length > 0) {
        await testInfo.attach("browser-problems", {
          body: problems.join("\n"),
          contentType: "text/plain",
        })
        console.log(
          `[browser problems] ${testInfo.title}\n  ${problems.join("\n  ")}`,
        )
      }
    },
    { auto: true },
  ],
})

/**
 * Navigates to `path`, or reloads the current page when no path is given, and
 * makes sure the page's scripts actually arrived.
 *
 * The Turbopack dev server rewrites the root layout's chunk list on disk about
 * once a second and now and then serves it mid-write as an empty 200. The page
 * then never hydrates and every interaction on it fails. That is a property of
 * the dev server, so the load is repeated (a few times at most) when a
 * framework chunk fails. Hydration timing itself is left alone.
 */
export async function load(page: Page, path?: string) {
  const isChunk = (url: string) => url.includes("/_next/static/")

  for (let attempt = 1; ; attempt++) {
    const badChunks: string[] = []
    // A truncated chunk shows up either as a failed request (length mismatch)
    // or as a successful response with nothing in it.
    const onFailed = (request: Request) => {
      if (isChunk(request.url())) badChunks.push(request.url())
    }
    const onResponse = (response: Response) => {
      if (
        isChunk(response.url()) &&
        response.headers()["content-length"] === "0"
      ) {
        badChunks.push(response.url())
      }
    }
    page.on("requestfailed", onFailed)
    page.on("response", onResponse)
    const response = path ? await page.goto(path) : await page.reload()
    page.off("requestfailed", onFailed)
    page.off("response", onResponse)

    if (badChunks.length === 0 || attempt === 4) return response
  }
}

export { expect }
