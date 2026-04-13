import {
  SliceSimulator,
  SliceSimulatorParams,
  getSlices,
} from "@slicemachine/adapter-next/simulator"
import { SliceZone } from "@prismicio/react"

import { components } from "../../slices"

export default async function SliceSimulatorPage(props: SliceSimulatorParams) {
  const searchParams = await props.searchParams
  const slices = getSlices(searchParams.state)

  return (
    <SliceSimulator>
      <div className="bg-dark">
        <div className="grid grid-cols-12 gap-x-8 mx-auto max-w-7xl px-8 py-24">
          <SliceZone slices={slices} components={components} />
        </div>
      </div>
    </SliceSimulator>
  )
}
