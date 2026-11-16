import { describe, expect, it } from "vitest"

import { contactFormSchema } from "./schemas"

const valid = { email: "someone@example.com", message: "Hello there" }

function firstIssue(input: unknown) {
  const result = contactFormSchema.safeParse(input)
  if (result.success) throw new Error("expected the input to be rejected")
  return {
    path: result.error.issues[0].path[0],
    message: result.error.issues[0].message,
  }
}

describe("contactFormSchema", () => {
  it("accepts a valid submission and trims it", () => {
    const result = contactFormSchema.parse({
      email: "  someone@example.com ",
      message: "  Hello there  ",
    })

    expect(result).toEqual({ ...valid, website: "" })
  })

  it("requires an email", () => {
    expect(firstIssue({ ...valid, email: "   " })).toEqual({
      path: "email",
      message: "Email is required.",
    })
  })

  it("rejects a malformed email", () => {
    expect(firstIssue({ ...valid, email: "not-an-email" })).toEqual({
      path: "email",
      message: "Please enter a valid email address.",
    })
  })

  it("rejects a missing field (FormData.get returns null)", () => {
    expect(
      contactFormSchema.safeParse({ email: null, message: null }).success,
    ).toBe(false)
  })

  it("enforces the message length bounds after trimming", () => {
    expect(firstIssue({ ...valid, message: "  hey  " }).message).toBe(
      "Message must be at least 5 characters.",
    )
    expect(
      contactFormSchema.safeParse({ ...valid, message: "a".repeat(2000) })
        .success,
    ).toBe(true)
    expect(firstIssue({ ...valid, message: "a".repeat(2001) }).message).toBe(
      "Message must be 2000 characters or fewer.",
    )
  })

  it("rejects a filled honeypot", () => {
    expect(firstIssue({ ...valid, website: "https://spam.example" }).path).toBe(
      "website",
    )
  })
})
