// Appends drafted media sections to three existing project documents and
// uploads their images. Everything lands in Prismic's Migration release, so
// nothing is published until it is reviewed and published in the editor.
//
//   node --env-file=.env.local scripts/backfill-case-studies.mjs --dry
//   node --env-file=.env.local scripts/backfill-case-studies.mjs
//
// Drafts: AI_OS/projects/neeshsamsi-com/case-studies/*.md
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import * as prismic from "@prismicio/client"

const DRY = process.argv.includes("--dry")
const REUSE = process.argv.includes("--reuse-assets")
const onlyIndex = process.argv.indexOf("--only")
const ONLY = onlyIndex > -1 ? process.argv[onlyIndex + 1] : null
const ASSETS = path.join(os.homedir(), "AI_OS/projects/neeshsamsi-com/sources/case-study-assets")

const heading = (text) => [{ type: "heading2", text, spans: [], direction: "ltr" }]
const paragraphs = (...texts) => texts.map((text) => ({ type: "paragraph", text, spans: [], direction: "ltr" }))
const noVideo = { link_type: "Media" }

let migration
// With --reuse-assets, images already in the media library (matched by
// filename, newest first) are referenced instead of uploaded again.
const library = new Map()
const asset = (uid, file, alt) => {
  if (REUSE) {
    const found = library.get(file)
    if (!found) throw new Error(`No uploaded asset named ${file} in the media library`)
    return {
      id: found.id, url: found.url, alt, copyright: null,
      dimensions: { width: found.width, height: found.height },
      edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
    }
  }
  const p = path.join(ASSETS, uid, file)
  if (!fs.existsSync(p)) throw new Error(`Missing asset: ${p}`)
  return DRY ? `[${uid}/${file}]` : migration.createAsset(fs.readFileSync(p), file, { alt })
}

const single = (uid, { title, width, file, alt, original, description }) => ({
  slice_type: "media_content", variation: "default", version: "initial", items: [],
  primary: {
    title: heading(title), width, image: asset(uid, file, alt), video: noVideo,
    originalDimensions: original, description: paragraphs(description),
  },
})

const double = (uid, { title, layout, left, right, original, description }) => ({
  slice_type: "media_content", variation: "doubleMedia", version: "initial", items: [],
  primary: {
    title: heading(title), layout,
    image: asset(uid, left.file, left.alt), video: noVideo,
    image2: asset(uid, right.file, right.alt), video2: noVideo,
    originalDimensions: original, description: paragraphs(description),
  },
})

const text = ({ title, body }) => ({
  slice_type: "text_content", variation: "default", version: "initial", items: [],
  primary: { title: heading(title), content: paragraphs(...body) },
})

const PLAN = {
  "aavartan-2023": (u) => [
    single(u, {
      title: "The Stage Backdrop", width: "Full", original: true, file: "aavartan-2023-1.jpg",
      alt: "Stage backdrop design for Aavartan 2023 with a portrait of Pandit Birju Maharaj Ji beside the Kalakulam and Aavartan wordmarks.",
      description: "The backdrop puts Pandit Birju Maharaj Ji at the centre of the stage. Garima trained under him and carries his legacy forward through Kalakulam, so the festival opens under his gaze. The only fixed constraint was making room for the sponsor logos.",
    }),
    double(u, {
      title: "On Stage", layout: "Wide Left", original: false,
      left: { file: "aavartan-2023-2.jpg", alt: "Kalakulam students in white costumes performing in front of the Aavartan backdrop." },
      right: { file: "aavartan-2023-3.jpg", alt: "Two Kathak dancers performing on stage with the Aavartan backdrop behind them." },
      description: "The backdrop behind the student and guest performances on the day.",
    }),
    double(u, {
      title: "Publicity Poster & Venue Standee", layout: "Wide Left", original: true,
      left: { file: "aavartan-2023-4.jpg", alt: "Square publicity poster for Aavartan 2023 with a collage of performance photographs." },
      right: { file: "aavartan-2023-5.jpg", alt: "Tall venue standee listing the student performances, guest artists and sponsors." },
      description: "The publicity poster went up a few days before the event, and the standee stood at the venue entrance on the day. Both carry the same layout as the backdrop so the festival reads as one identity from the first poster to the stage.",
    }),
    single(u, {
      title: "Social Media Posts", width: "Full", original: true, file: "aavartan-2023-6.jpg",
      alt: "Grid of six Instagram posts for Aavartan 2023, each announcing a different performance.",
      description: "One post per performance for Instagram, announcing each piece and its performers in the lead-up to the festival.",
    }),
  ],
  "aavartan-2024": (u) => [
    single(u, {
      title: "Illustration Explorations", width: "Full", original: true, file: "aavartan-2024-2.jpg",
      alt: "Six versions of the Aavartan 2024 announcement post, each testing a different illustration: a realistic feather, a flat feather, an abstract feather fan, a young Krishna, layered feathers and the final abstract peacock feather.",
      description: "I explored six illustration directions on the announcement post, from a realistic feather and a young Krishna to flat and abstract feathers, and settled on an abstract peacock feather, generated in Recraft AI and refined into a vector.",
    }),
    single(u, {
      title: "Announcement Posts", width: "Full", original: true, file: "aavartan-2024-3.jpg",
      alt: "Two Instagram post mockups announcing Aavartan 2024: Celebrating Krishna. The second frames the guest artist's photograph inside the eye of the peacock feather.",
      description: "The feather is used in two ways: as the primary element, with its eye framing the guest artist's photograph, and as a secondary element, sweeping in from the corners of each layout.",
    }),
    single(u, {
      title: "Line-up Posts", width: "Full", original: true, file: "aavartan-2024-4.jpg",
      alt: "Three Instagram posts introducing the accompanying artists, student performances and supporting team for Aavartan 2024, with circular portraits beside each name.",
      description: "Circular portraits introduce each artist and team member, with the feather kept to the corners.",
    }),
    double(u, {
      title: "Venue Standees", layout: "Wide Right", original: true,
      left: { file: "aavartan-2024-1.jpg", alt: "Aavartan 2024 standee at the venue entrance, framed by a marigold flower arrangement." },
      right: { file: "aavartan-2024-5.jpg", alt: "Three tall blue standees for Aavartan 2024 featuring the guest artist, accompanists and student performers." },
      description: "With the backdrop dropped this year, the standees carried the identity at the venue.",
    }),
    single(u, {
      title: "Performance Standees", width: "Full", original: true, file: "aavartan-2024-6.jpg",
      alt: "Five standees, one for each Aavartan 2024 performance, including Shiv Parvati Stuti, Teental Tarana and Guru Vandana.",
      description: "One standee per piece in the programme, each with a photograph and the names of its performers.",
    }),
  ],
  "srot-foundation": (u) => [
    text({
      title: "The Research",
      body: ["Research ran through discovery calls with the team. The primary user goal was clear: support the foundation, either by donating or by volunteering, running workshops and spending time with the students. The audience is philanthropic individuals who feel strongly about the cause, mostly donors over 35, along with institutions and educators who can volunteer and share their insight."],
    }),
    single(u, {
      title: "Telling Srot's Story", width: "Full", original: true, file: "srot-story-section.jpg",
      alt: "The Our Story section of srot.in, with a short introduction beside a photograph of students.",
      description: "Srot's story and mission mattered most to the team, so the copy is broken into short, strong sections, each paired with photographs from the field for context.",
    }),
    double(u, {
      title: "Getting Involved", layout: "Wide Right", original: false,
      left: { file: "srot-parth-teaching.jpg", alt: "Parth Phalke teaching a group of children." },
      right: { file: "srot-volunteer-cards.jpg", alt: "Information cards on srot.in explaining how to volunteer and how to run a workshop." },
      description: "Volunteering and workshops have their own page, with clear cards for each way to get involved and testimonials from past volunteers as social proof.",
    }),
    single(u, {
      title: "Simpler Donations", width: "Two Third", original: true, file: "srot-support-page.jpg",
      alt: "The Support Us page on srot.in showing impact figures and a donate button.",
      description: "Donations go through Razorpay with custom fields for details like PAN number, so everything the foundation needs for tax paperwork is collected in a single payment.",
    }),
    single(u, {
      title: "The Team", width: "Full", original: true, file: "srot-team-section.jpg",
      alt: "The Our Team section of srot.in with portraits and short bios of the directors.",
      description: "A team page puts faces to the work, which matters for donors deciding who to trust.",
    }),
    double(u, {
      title: "The Full Site", layout: "Half & Half", original: true,
      left: { file: "srot-home-full.jpg", alt: "Full-length screenshot of the srot.in home page." },
      right: { file: "srot-story-full.jpg", alt: "Full-length screenshot of the srot.in Our Story page." },
      description: "The home page and the story page in full.",
    }),
  ],
}


// SEO fields per document. Only the keys listed here change.
const SEO = {
  "aavartan-2023": (doc) => ({
    meta_description: "Stage backdrop, publicity poster, venue standee and social posts for Aavartan 2023, Kalakulam Academy's annual festival of music and dance in Delhi.",
    meta_image: { ...doc.data.meta_image, alt: "Aavartan 2023 performance on stage in front of the festival backdrop designed by Neesh Samsi." },
  }),
  "aavartan-2024": () => ({
    meta_description: "Social posts, venue and performance standees for Aavartan 2024: Celebrating Krishna, Kalakulam Academy's annual festival of music and dance in Delhi.",
    meta_image: asset("aavartan-2024", "aavartan-2024-og.jpg", "Kalakulam students on stage in colourful Kathak costumes around a dancer dressed as Krishna playing the flute, against a deep blue curtain."),
  }),
  "srot-foundation": () => ({
    meta_title: "Srot Foundation | Website Design & Development",
  }),
}

const token = process.env.PRISMIC_WRITE_TOKEN
if (!DRY && !token) throw new Error("PRISMIC_WRITE_TOKEN is not set in .env.local")

const client = prismic.createWriteClient("neeshsamsi", { writeToken: token ?? "dry-run" })

if (REUSE) {
  if (!token) throw new Error("--reuse-assets needs PRISMIC_WRITE_TOKEN to read the media library")
  let cursor = ""
  do {
    const url = new URL("https://asset-api.prismic.io/assets")
    url.searchParams.set("assetType", "image")
    url.searchParams.set("limit", "100")
    if (cursor) url.searchParams.set("cursor", cursor)
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, repository: "neeshsamsi" } })
    if (!res.ok) throw new Error(`Asset API ${res.status}: ${await res.text()}`)
    const page = await res.json()
    for (const item of page.items ?? []) {
      const prev = library.get(item.filename)
      if (!prev || (item.last_modified ?? 0) > (prev.last_modified ?? 0)) library.set(item.filename, item)
    }
    cursor = page.cursor ?? ""
  } while (cursor)
  console.log(`media library: ${library.size} images indexed`)
}
migration = prismic.createMigration()

for (const [uid, build] of Object.entries(PLAN)) {
  if (ONLY && uid !== ONLY) continue
  const doc = await client.getByUID("project", uid)
  const existing = doc.data.slices
  const known = new Set(["project_overview", "external_link_callout"])
  const unexpected = existing.filter((s) => !known.has(s.slice_type))
  if (unexpected.length) throw new Error(`${uid} already has other slices (${unexpected.map((s) => s.slice_type)}). Stopping so nothing is duplicated.`)

  const added = build(uid)
  const overview = existing.filter((s) => s.slice_type === "project_overview")
  const links = existing.filter((s) => s.slice_type === "external_link_callout")
  doc.data.slices = [...overview, ...added, ...links]

  console.log(`\n${uid}: ${existing.length} slices -> ${doc.data.slices.length}`)
  for (const s of doc.data.slices) {
    const ids = [s.primary.image?.id, s.primary.image2?.id].filter(Boolean).join(", ")
    console.log(`  - ${s.slice_type}${s.variation !== "default" ? `:${s.variation}` : ""}  ${s.primary.title?.[0]?.text ?? ""}${REUSE && ids ? `  [${ids}]` : ""}`)
  }

  const seo = SEO[uid]?.(doc) ?? {}
  for (const [key, value] of Object.entries(seo)) {
    const show = (v) => (typeof v === "string" ? v : v?.alt ? `image, alt: ${v.alt}` : String(v))
    console.log(`  * ${key}: ${show(doc.data[key]) ?? "(empty)"}\n      -> ${show(value)}`)
    doc.data[key] = value
  }

  if (!DRY) migration.updateDocument(doc, doc.data.title ?? uid)
}

if (DRY) {
  console.log("\nDry run only. Nothing was sent to Prismic.")
} else {
  await client.migrate(migration, {
    reporter: (e) => {
      if (e.type === "assets:creating") console.log(`uploading asset ${e.data.current}/${e.data.total}`)
      if (e.type === "documents:updating") console.log(`updating ${e.data.document.document?.uid ?? ""}`)
      if (e.type === "end") console.log("\nDone. Review in Prismic under the Migration release, then publish.")
    },
  })
}
