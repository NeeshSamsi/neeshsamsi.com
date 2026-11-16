import { timingSafeEqual } from "node:crypto"

import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { revalidatePrismicPages } from "@prismicio/next"

import { env } from "@/lib/env"
import { PRISMIC_LISTS_TAG } from "@/lib/prismic"

function secretsMatch(received: unknown, expected: string) {
  if (typeof received !== "string") return false
  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  const expected = env.PRISMIC_WEBHOOK_SECRET
  const body: unknown = await request.json().catch(() => null)

  // Prismic sends the webhook's configured secret in the JSON body. Once a
  // secret is set here, anything without it is refused, so the cache can't be
  // purged on demand by an arbitrary caller.
  if (expected) {
    const received =
      typeof body === "object" && body !== null && "secret" in body
        ? body.secret
        : undefined

    if (!secretsMatch(received, expected)) {
      return NextResponse.json({ revalidated: false }, { status: 401 })
    }
  }

  // Clears the cache entries tagged with each changed document's ID, plus every
  // list, so a newly published document also shows up in them.
  if (isAPIUpdate(body)) {
    revalidatePrismicPages(body.documents)
    revalidateTag(PRISMIC_LISTS_TAG, { expire: 0 })
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}

function isAPIUpdate(
  body: unknown,
): body is { type: "api-update"; documents: string[] } {
  return (
    typeof body === "object" &&
    body !== null &&
    "type" in body &&
    body.type === "api-update" &&
    "documents" in body &&
    Array.isArray(body.documents)
  )
}
