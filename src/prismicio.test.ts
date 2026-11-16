import { describe, expect, it } from "vitest"

import config from "../prismic.config.json"
import { routes } from "./prismicio"

describe("route resolver", () => {
  it("resolves every routed type the Prismic config declares", () => {
    // A type missing from the client's routes gets `url: null`, which breaks
    // links to it and sends its previews to the home page.
    for (const { type, path } of config.routes) {
      expect(routes).toContainEqual({ type, path })
    }
  })

  it("serves the home document at the root", () => {
    expect(routes).toContainEqual({ type: "page", uid: "home", path: "/" })
  })
})
