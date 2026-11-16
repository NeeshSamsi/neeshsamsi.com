#!/usr/bin/env node
// Uploads one clip to Mux and prints the playback ID to paste into Prismic.
//
//   node --env-file=.env.local scripts/mux-upload.mjs <file-or-url> [--title "Name"] [--dry-run]
//
// A local file goes through a Mux Direct Upload; a URL is ingested by Mux
// itself. Every asset gets the site's settings: Plus quality, capped at
// 1080p, public playback. Mux scales larger sources down, so there is no
// need to re-export or compress a clip first.
//
// Needs MUX_TOKEN_ID and MUX_TOKEN_SECRET (a Mux access token with Mux Video
// read and write). `--dry-run` prints the request and contacts nothing.
//
// Mux docs: https://www.mux.com/docs/guides/upload-files-directly
//           https://www.mux.com/docs/core/stream-video-files

import { createReadStream, existsSync, statSync } from "node:fs"
import path from "node:path"
import { Readable } from "node:stream"
import { parseArgs } from "node:util"

const API = "https://api.mux.com/video/v1"
// Mux asks for no more than one status request a second.
const POLL_MS = 2000
const TIMEOUT_MS = 15 * 60 * 1000

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    title: { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
})

const source = positionals[0]
if (!source || positionals.length > 1) {
  console.error(
    'Usage: node --env-file=.env.local scripts/mux-upload.mjs <file-or-url> [--title "Name"] [--dry-run]',
  )
  process.exit(1)
}

const isUrl = /^https?:\/\//i.test(source)
if (!isUrl && !existsSync(source)) {
  console.error(`No such file: ${source}`)
  process.exit(1)
}

const title =
  values.title ??
  path
    .basename(isUrl ? new URL(source).pathname : source)
    .replace(/\.[^.]+$/, "")

// The settings every clip on the site uses.
const assetSettings = {
  playback_policies: ["public"],
  video_quality: "plus",
  max_resolution_tier: "1080p",
  // Shown in the Mux dashboard. Mux may expose it through players, so it
  // must never hold anything private.
  meta: { title },
}

const request = isUrl
  ? {
      path: "/assets",
      body: { inputs: [{ url: source }], ...assetSettings },
    }
  : {
      path: "/uploads",
      body: { cors_origin: "*", new_asset_settings: assetSettings },
    }

if (values["dry-run"]) {
  console.log(`POST ${API}${request.path}`)
  console.log(JSON.stringify(request.body, null, 2))
  process.exit(0)
}

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env
if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  console.error(
    "MUX_TOKEN_ID and MUX_TOKEN_SECRET are not set. Run with --env-file=.env.local.",
  )
  process.exit(1)
}
const authorization =
  "Basic " +
  Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString("base64")

async function mux(method, apiPath, body) {
  const response = await fetch(API + apiPath, {
    method,
    headers: {
      Authorization: authorization,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(
      `Mux ${method} ${apiPath} failed (${response.status}): ${text}`,
    )
  }
  return JSON.parse(text).data
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** Polls `read` until `done` says the result is final, or time runs out. */
async function waitFor(what, read, done) {
  const deadline = Date.now() + TIMEOUT_MS
  for (;;) {
    const value = await read()
    if (done(value)) return value
    if (Date.now() > deadline) throw new Error(`Timed out waiting for ${what}.`)
    await sleep(POLL_MS)
  }
}

async function createAsset() {
  if (isUrl) {
    console.log(`Asking Mux to fetch ${source}`)
    return (await mux("POST", request.path, request.body)).id
  }

  const upload = await mux("POST", request.path, request.body)
  const size = statSync(source).size
  console.log(`Uploading ${source} (${(size / 1e6).toFixed(1)} MB)`)
  const put = await fetch(upload.url, {
    method: "PUT",
    headers: { "Content-Length": String(size) },
    body: Readable.toWeb(createReadStream(source)),
    duplex: "half",
  })
  if (!put.ok) {
    throw new Error(`Upload failed (${put.status}): ${await put.text()}`)
  }

  const finished = await waitFor(
    "Mux to create the asset",
    () => mux("GET", `/uploads/${upload.id}`),
    (u) => u.status !== "waiting",
  )
  if (finished.status !== "asset_created") {
    throw new Error(`Upload ended as "${finished.status}".`)
  }
  return finished.asset_id
}

const assetId = await createAsset()
console.log(`Asset ${assetId} created. Waiting for Mux to process it...`)

const asset = await waitFor(
  "the asset to be ready",
  () => mux("GET", `/assets/${assetId}`),
  (a) => a.status !== "preparing",
)
if (asset.status !== "ready") {
  throw new Error(
    `Asset ${assetId} ended as "${asset.status}": ${JSON.stringify(asset.errors ?? {})}`,
  )
}

const playbackId = asset.playback_ids?.find((id) => id.policy === "public")?.id
if (!playbackId) throw new Error(`Asset ${assetId} has no public playback ID.`)

console.log(`
Ready: ${title}
  duration      ${asset.duration?.toFixed(2)} s
  aspect ratio  ${asset.aspect_ratio}
  resolution    ${asset.resolution_tier}
  preview       https://player.mux.com/${playbackId}

Paste this into the "Mux playback ID" field of the MediaContent slice:

  ${playbackId}
`)
