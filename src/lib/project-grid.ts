export type GridLayout = "wide-tall" | "tall-wide" | "wide-solo"

type GridSlot = {
  layout: GridLayout
  /** True for the right-hand card of a two-card row. */
  secondInRow: boolean
}

// The grid repeats every five items: two rows of two cards, then one card on
// a row of its own. Everything about an item's place in that pattern lives in
// this table, so layout and row position cannot drift apart.
const CYCLE: readonly GridSlot[] = [
  { layout: "wide-tall", secondInRow: false },
  { layout: "tall-wide", secondInRow: true },
  { layout: "tall-wide", secondInRow: false },
  { layout: "wide-tall", secondInRow: true },
  { layout: "wide-solo", secondInRow: false },
]

export function gridSlot(index: number): GridSlot {
  return CYCLE[index % CYCLE.length]
}

/**
 * Reveal delay for the item at `index`: the second card of a row waits
 * `stagger` seconds so a pair entering together reads left then right.
 * (Index parity would work for the first four items only: the solo row shifts
 * every later pair by one.)
 */
export function pairDelay(index: number, stagger: number) {
  return gridSlot(index).secondInRow ? stagger : 0
}
