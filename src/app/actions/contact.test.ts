import { beforeEach, describe, expect, it, vi } from "vitest"

const WEBHOOK = "https://discord.com/api/webhooks/123/token"

const requestHeaders = vi.hoisted(() => ({ current: new Headers() }))

vi.mock("next/headers", () => ({ headers: async () => requestHeaders.current }))
vi.mock("@/lib/env", () => ({
  env: { DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/123/token" },
}))

import type { ContactFormState } from "./contact"

const idle: ContactFormState = { status: "idle" }

// Mirrors the real form, which always submits the (empty) honeypot input.
function form(fields: Record<string, string>) {
  const data = new FormData()
  data.set("website", "")
  for (const [name, value] of Object.entries(fields)) data.set(name, value)
  return data
}

const valid = { email: "someone@example.com", message: "Hello there, Neesh." }

/** The JSON body of the single Discord call. */
function discordPayload(fetchMock: ReturnType<typeof vi.fn>) {
  expect(fetchMock).toHaveBeenCalledTimes(1)
  const [url, init] = fetchMock.mock.calls[0]
  expect(url).toBe(WEBHOOK)
  expect(init.method).toBe("POST")
  return JSON.parse(init.body)
}

describe("submitContact", () => {
  let submitContact: typeof import("./contact").submitContact
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(async () => {
    // Fresh module graph per test: the rate limiter keeps per-process state.
    vi.resetModules()
    ;({ submitContact } = await import("./contact"))

    fetchMock = vi.fn(async () => new Response(null, { status: 204 }))
    vi.stubGlobal("fetch", fetchMock)
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.spyOn(console, "log").mockImplementation(() => {})

    requestHeaders.current = new Headers({
      "x-forwarded-for": "203.0.113.7, 10.0.0.1",
      referer: "https://www.neeshsamsi.com/work",
    })
  })

  it("sends the message to Discord and reports success", async () => {
    const result = await submitContact(idle, form(valid))

    expect(result).toEqual({ status: "success" })

    const [embed] = discordPayload(fetchMock).embeds
    expect(embed.description).toBe(valid.message)
    expect(embed.fields).toEqual([
      { name: "Email", value: valid.email, inline: false },
      { name: "Page", value: "https://www.neeshsamsi.com/work", inline: false },
    ])
  })

  it("delivers the longest message the form accepts within Discord's limits", async () => {
    const message = "a".repeat(2000)

    const result = await submitContact(idle, form({ ...valid, message }))

    expect(result).toEqual({ status: "success" })
    const [embed] = discordPayload(fetchMock).embeds
    // Discord rejects the whole webhook when a field value passes 1024
    // characters or the description passes 4096.
    expect(embed.description).toHaveLength(2000)
    for (const field of embed.fields) {
      expect(field.value.length).toBeGreaterThan(0)
      expect(field.value.length).toBeLessThanOrEqual(1024)
    }
  })

  it("gives the Discord request a timeout", async () => {
    await submitContact(idle, form(valid))

    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal)
  })

  it("fills in the page when the request has no referer", async () => {
    requestHeaders.current = new Headers({ "x-forwarded-for": "203.0.113.7" })

    await submitContact(idle, form(valid))

    const [embed] = discordPayload(fetchMock).embeds
    expect(embed.fields[1]).toMatchObject({ name: "Page", value: "unknown" })
  })

  it("pretends to succeed for a filled honeypot without sending anything", async () => {
    const result = await submitContact(
      idle,
      form({ ...valid, website: "https://spam.example" }),
    )

    expect(result).toEqual({ status: "success" })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("returns one error per invalid field and echoes the input back", async () => {
    const result = await submitContact(
      idle,
      form({ email: "nope", message: "hi" }),
    )

    expect(result).toEqual({
      status: "error",
      code: "validation",
      fieldErrors: {
        email: "Please enter a valid email address.",
        message: "Message must be at least 5 characters.",
      },
      values: { email: "nope", message: "hi" },
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("treats a request without the honeypot field as an empty honeypot", async () => {
    const data = new FormData()
    data.set("email", valid.email)
    data.set("message", valid.message)

    expect(await submitContact(idle, data)).toEqual({ status: "success" })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it("handles a submission with the fields missing entirely", async () => {
    const result = await submitContact(idle, new FormData())

    expect(result).toMatchObject({
      status: "error",
      values: { email: "", message: "" },
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("reports a generic error and keeps the input when Discord refuses", async () => {
    fetchMock.mockResolvedValue(new Response("bad embed", { status: 400 }))

    const result = await submitContact(idle, form(valid))

    expect(result).toEqual({
      status: "error",
      code: "send_failed",
      formError: "Something went wrong sending your message. Please try again.",
      values: valid,
    })
  })

  it("reports the same error when the request fails or times out", async () => {
    fetchMock.mockRejectedValue(new DOMException("timed out", "TimeoutError"))

    const result = await submitContact(idle, form(valid))

    expect(result).toMatchObject({
      status: "error",
      code: "send_failed",
      values: valid,
    })
    expect(result).toHaveProperty("formError")
  })

  it("stops a sixth submission from the same address", async () => {
    for (let i = 0; i < 5; i++) {
      expect(await submitContact(idle, form(valid))).toEqual({
        status: "success",
      })
    }

    const blocked = await submitContact(idle, form(valid))

    expect(blocked).toMatchObject({
      status: "error",
      code: "rate_limit",
      values: valid,
    })
    expect(blocked).toHaveProperty(
      "formError",
      "Too many submissions. Please try again in 10 minutes.",
    )
    expect(fetchMock).toHaveBeenCalledTimes(5)
  })

  it("rate limits by the first forwarded address, per visitor", async () => {
    for (let i = 0; i < 5; i++) await submitContact(idle, form(valid))

    // Same proxy hop, different client.
    requestHeaders.current = new Headers({
      "x-forwarded-for": "198.51.100.9, 10.0.0.1",
    })

    expect(await submitContact(idle, form(valid))).toEqual({
      status: "success",
    })
  })

  it("does not spend the allowance on invalid submissions", async () => {
    for (let i = 0; i < 8; i++)
      await submitContact(idle, form({ email: "", message: "" }))

    expect(await submitContact(idle, form(valid))).toEqual({
      status: "success",
    })
  })
})
