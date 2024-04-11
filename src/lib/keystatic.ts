import { type Entry, createReader } from "@keystatic/core/reader"
import keystaticConfig from "../../keystatic.config"

export type ClientWork = Entry<
  (typeof keystaticConfig)["collections"]["clientwork"]
> & { slug: string }

export type ReviewEntry = Entry<
  (typeof keystaticConfig)["collections"]["reviews"]
> & { slug: string }

const reader = createReader(process.cwd(), keystaticConfig)

export default reader
