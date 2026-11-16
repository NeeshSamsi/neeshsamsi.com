"use client"

import { type ImageField } from "@prismicio/client"
import {
  type ComponentType,
  type CSSProperties,
  useEffect,
  useState,
} from "react"

import { videoPosterUrl } from "@/lib/mux"
import { cn } from "@/lib/utils"

export type PrismicVideoProps = {
  /** The Mux playback ID of the clip. */
  playbackId: string
  /** Poster frame. Without one, Mux's own frame for the playback ID is used. */
  poster?: ImageField
  /**
   * Stretch to fill the parent box (parent controls aspect). When false the
   * component sizes itself to `aspectRatio`.
   */
  fill?: boolean
  /** Explicit aspect ratio (e.g. "16 / 9"). Ignored when `fill`. */
  aspectRatio?: string
  /** Playback defaults to an ambient autoplay/muted/loop ("GIF-style") clip. */
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  className?: string
  wrapperClassName?: string
}

/** The box around the video: the hover group and the controls' anchor. */
export function videoWrapperProps({
  fill = false,
  aspectRatio,
  wrapperClassName,
}: PrismicVideoProps): { className: string; style?: CSSProperties } {
  const aspect = fill ? undefined : aspectRatio
  return {
    className: cn("group relative", fill && "h-full w-full", wrapperClassName),
    style: aspect ? { aspectRatio: aspect } : undefined,
  }
}

export function videoClassName({ className }: PrismicVideoProps): string {
  return cn("block h-full w-full cursor-pointer", className)
}

/**
 * A Mux clip with the site's controls.
 *
 * The player (Video.js and its HLS engine) is loaded in the browser only, in
 * its own chunk, so pages without video never download it. It also cannot be
 * server-rendered here: Video.js reads the clock while rendering, which a
 * prerendered page must not do (see "Build rules" in AGENTS.md). Until the
 * player arrives, the same box shows the poster, so nothing shifts.
 */
export default function PrismicVideo(props: PrismicVideoProps) {
  const [Player, setPlayer] = useState<ComponentType<PrismicVideoProps> | null>(
    null,
  )

  useEffect(() => {
    let current = true
    import("./PrismicVideoPlayer").then((module) => {
      if (current) setPlayer(() => module.default)
    })
    return () => {
      current = false
    }
  }, [])

  if (Player) return <Player {...props} />

  return (
    <div {...videoWrapperProps(props)}>
      <video
        poster={videoPosterUrl(props.playbackId, props.poster)}
        playsInline
        muted
        preload="none"
        className={videoClassName(props)}
      />
    </div>
  )
}
