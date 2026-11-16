import { describe, expect, it } from "vitest"

import { gridSlot, pairDelay } from "./project-grid"

const STAGGER = 0.15

describe("gridSlot", () => {
  it("repeats the five-item layout cycle", () => {
    const layouts = Array.from({ length: 10 }, (_, i) => gridSlot(i).layout)
    const cycle = [
      "wide-tall",
      "tall-wide",
      "tall-wide",
      "wide-tall",
      "wide-solo",
    ]

    expect(layouts).toEqual([...cycle, ...cycle])
  })
})

describe("pairDelay", () => {
  it("delays only the right-hand card of each row, across two full cycles", () => {
    const delays = Array.from({ length: 10 }, (_, i) => pairDelay(i, STAGGER))

    expect(delays).toEqual([
      // cycle 1: pair, pair, solo
      0,
      STAGGER,
      0,
      STAGGER,
      0,
      // cycle 2 starts a new row with its left card (index 5, an odd index)
      0,
      STAGGER,
      0,
      STAGGER,
      0,
    ])
  })

  it("never delays a card that has a row to itself", () => {
    expect(pairDelay(4, STAGGER)).toBe(0)
    expect(pairDelay(9, STAGGER)).toBe(0)
    expect(pairDelay(14, STAGGER)).toBe(0)
  })

  it("pairs every delayed card with an undelayed one before it in the same row", () => {
    for (let i = 0; i < 20; i++) {
      if (pairDelay(i, STAGGER) > 0) {
        expect(pairDelay(i - 1, STAGGER)).toBe(0)
        // The two cards of a row share it: neither is the solo layout.
        expect(gridSlot(i).layout).not.toBe("wide-solo")
        expect(gridSlot(i - 1).layout).not.toBe("wide-solo")
      }
    }
  })
})
