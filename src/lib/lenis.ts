import type Lenis from "lenis"

// Module-scoped singleton so any client component can pause/resume the
// global Lenis instance (e.g. while a modal is open). LenisProvider
// registers/unregisters via setLenis() during mount/unmount.
let instance: Lenis | null = null

export function setLenis(lenis: Lenis | null) {
  instance = lenis
}

export function getLenis() {
  return instance
}
