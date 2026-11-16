import { timingSafeEqual } from "node:crypto"

import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"

import { env } from "@/lib/env"

function secretsMatch(received: unknown, expected: string) {
  if (typeof received !== "string") return false
  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  const expected = env.PRISMIC_WEBHOOK_SECRET

  // Prismic sends the webhook's configured secret in the JSON body. Once a
  // secret is set here, anything without it is refused, so the cache can't be
  // purged on demand by an arbitrary caller.
  if (expected) {
    const body: unknown = await request.json().catch(() => null)
    const received =
      typeof body === "object" && body !== null && "secret" in body
        ? body.secret
        : undefined

    if (!secretsMatch(received, expected)) {
      return NextResponse.json({ revalidated: false }, { status: 401 })
    }
  }

  revalidateTag("prismic", { expire: 0 })

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
