"use server"

import { headers } from "next/headers"

import { env } from "@/lib/env"
import { rateLimit } from "@/lib/rate-limit"
import { contactFormSchema } from "@/lib/schemas"

/**
 * State shape returned by `submitContact` and consumed by React 19's
 * `useActionState` hook on the client. It's a discriminated-ish union —
 * `status` drives the UI branch; the other fields carry detail.
 *
 * `values` is echoed back on error so the form re-renders with the user's
 * input preserved (since the inputs are uncontrolled with `defaultValue`).
 */
export type ContactFormState = {
  status: "idle" | "success" | "error"
  fieldErrors?: Partial<Record<"email" | "message", string>>
  formError?: string
  values?: { email: string; message: string }
}

// NOTE: This file has `"use server"`, so only async functions can be exported
// from it at runtime. The matching `initialContactState` value lives at the
// consumer site (see ContactWidget.tsx). Types are erased at compile time and
// are safe to export.

// Brand orange — must be an integer, not a hex string, per Discord's API.
const DISCORD_EMBED_COLOR = 0xf39e21

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website"), // honeypot
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
      fieldErrors,
      values: {
        email: typeof raw.email === "string" ? raw.email : "",
        message: typeof raw.message === "string" ? raw.message : "",
      },
    }
  }

  // 3. Rate limit by client IP (first hop in x-forwarded-for).
  const h = await headers()
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"

  const rl = rateLimit(ip)
  if (!rl.ok) {
    const minutes = Math.max(1, Math.ceil(rl.retryAfterMs / 60000))
    return {
      status: "error",
      formError: `Too many submissions. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      values: { email: parsed.data.email, message: parsed.data.message },
    }
  }

  // 4. Figure out which page the form was submitted from, for the embed.
  const pageUrl = h.get("referer") ?? "unknown"

  // 5. POST the rich embed to Discord.
  try {
    const res = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "🔔 **New message received** \n",
        embeds: [
          {
            color: DISCORD_EMBED_COLOR,
            fields: [
              { name: "Email", value: parsed.data.email, inline: false },
              { name: "Message", value: parsed.data.message, inline: false },
              { name: "Page", value: pageUrl, inline: false },
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
      return {
        status: "error",
        formError:
          "Something went wrong sending your message. Please try again.",
        values: { email: parsed.data.email, message: parsed.data.message },
      }
    }
  } catch (err) {
    console.error("Discord webhook threw", err)
    return {
      status: "error",
      formError: "Something went wrong sending your message. Please try again.",
      values: { email: parsed.data.email, message: parsed.data.message },
    }
  }

  return { status: "success" }
}
