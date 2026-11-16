import { afterEach, describe, expect, it } from "vitest"

import { formatDate } from "./utils"

describe("formatDate", () => {
  const originalTZ = process.env.TZ
  afterEach(() => {
    process.env.TZ = originalTZ
  })

  it("formats as '<Month>, <year>'", () => {
    expect(formatDate(new Date("2025-08-03"))).toBe("August, 2025")
  })

  it("keeps a Prismic date in its own month west of UTC", () => {
    // Date fields are UTC midnight. In local time this instant is still
    // 31 December in Los Angeles.
    process.env.TZ = "America/Los_Angeles"
    expect(formatDate(new Date("2025-01-01"))).toBe("January, 2025")
  })

  it("keeps a timestamp in its UTC month east of UTC", () => {
    process.env.TZ = "Asia/Kolkata"
    expect(formatDate(new Date("2024-11-30T20:00:00+0000"))).toBe(
      "November, 2024",
    )
  })
})
