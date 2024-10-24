import {
  SliceSimulator,
  SliceSimulatorParams,
  getSlices,
} from "@slicemachine/adapter-next/simulator"
import { SliceZone } from "@prismicio/react"

import { components } from "../../slices"

export default function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  const slices = getSlices(searchParams.state)

  return (
    <SliceSimulator>
      <div className="bg-dark py-24">
        <SliceZone slices={slices} components={components} />
      </div>
    </SliceSimulator>
  )
}
