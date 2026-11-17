"use server"

import { headers } from "next/headers"

import { env } from "@/lib/env"
import { rateLimit } from "@/lib/rate-limit"
import { contactFormSchema } from "@/lib/schemas"

/**
 * State returned by `submitContact` and consumed by React 19's
 * `useActionState` hook on the client. `status` is the discriminant: only the
 * error state carries detail.
 *
 * `values` is echoed back on error so the form re-renders with the user's
 * input preserved (since the inputs are uncontrolled with `defaultValue`).
 */
export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error"
      // What went wrong, as a fixed short code. It is what analytics records
      // (`contact_error`); the messages below are for the visitor only.
      code: ContactErrorCode
      fieldErrors?: Partial<Record<"email" | "message", string>>
      formError?: string
      values: { email: string; message: string }
    }

export type ContactErrorCode = "validation" | "rate_limit" | "send_failed"

// NOTE: This file has `"use server"`, so only async functions can be exported
// from it at runtime. The matching `initialContactState` value lives at the
// consumer site (see ContactWidget.tsx). Types are erased at compile time and
// are safe to export.

// Brand orange — must be an integer, not a hex string, per Discord's API.
const DISCORD_EMBED_COLOR = 0xf39e21

// Discord can hang; don't leave the visitor on "Sending…" indefinitely.
const DISCORD_TIMEOUT_MS = 10_000

const SEND_FAILED =
  "Something went wrong sending your message. Please try again."

function failure(
  code: ContactErrorCode,
  formError: string,
  values: { email: string; message: string },
): ContactFormState {
  return { status: "error", code, formError, values }
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    email: formData.get("email"),
    message: formData.get("message"),
    // Honeypot. A request without the field at all counts as an empty one, so
    // it is validated like any other submission.
    website: formData.get("website") ?? "",
  }

  // 1. Honeypot — silently return success so bots can't tell validation ran.
  if (typeof raw.website === "string" && raw.website.length > 0) {
    console.log("Honeypot triggered")
    return { status: "success" }
  }

  // 2. Validate with Zod.
  const parsed = contactFormSchema.safeParse(raw)
  if (!parsed.success) {
    // Collect the first issue per field (keeps error UI simple).
    const fieldErrors: Partial<Record<"email" | "message", string>> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (
        (key === "email" || key === "message") &&
        fieldErrors[key] === undefined
      ) {
        fieldErrors[key] = issue.message
      }
    }
    return {
      status: "error",
      code: "validation",
      fieldErrors,
      values: {
        email: typeof raw.email === "string" ? raw.email : "",
        message: typeof raw.message === "string" ? raw.message : "",
      },
    }
  }

  const values = { email: parsed.data.email, message: parsed.data.message }

  // 3. Rate limit by client IP (first hop in x-forwarded-for).
  const h = await headers()
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"

  const rl = rateLimit(ip)
  if (!rl.ok) {
    const minutes = Math.max(1, Math.ceil(rl.retryAfterMs / 60000))
    return failure(
      "rate_limit",
      `Too many submissions. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      values,
    )
  }

  // 4. Figure out which page the form was submitted from, for the embed.
  const pageUrl = h.get("referer") || "unknown"

  // 5. POST the rich embed to Discord. The message goes in the embed
  // description (4096-char limit); an embed field value is capped at 1024
  // characters, which is shorter than the 2000 the form accepts.
  try {
    const res = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(DISCORD_TIMEOUT_MS),
      body: JSON.stringify({
        content: "🔔 **New message received** \n",
        embeds: [
          {
            color: DISCORD_EMBED_COLOR,
            description: values.message,
            fields: [
              { name: "Email", value: values.email, inline: false },
              { name: "Page", value: pageUrl.slice(0, 1024), inline: false },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    })

    if (!res.ok) {
      // Log server-side with detail; return a generic message to the client.
      const body = await res.text().catch(() => "<no body>")
      console.error("Discord webhook failed", res.status, body)
      return failure("send_failed", SEND_FAILED, values)
    }
  } catch (err) {
    console.error("Discord webhook threw", err)
    return failure("send_failed", SEND_FAILED, values)
  }

  return { status: "success" }
}
