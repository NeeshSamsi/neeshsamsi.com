"use client"

import {
  type ImageField,
  type LinkToMediaField,
  isFilled,
} from "@prismicio/client"

import {
  type CSSProperties,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { Pause, Play, Volume2, VolumeX } from "lucide-react"

import { cn } from "@/lib/utils"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

// Subscribe to the user's reduced-motion preference without setState-in-effect.
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION_QUERY)
      mq.addEventListener("change", onChange)
      return () => mq.removeEventListener("change", onChange)
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  )
}

type Props = {
  /** The Prismic "Link to Media" field holding the video file. */
  field: LinkToMediaField
  /** Poster frame + source of the intrinsic aspect ratio. */
  poster?: ImageField | string
  /**
   * Stretch to fill the parent box (parent controls aspect). When false the
   * component sizes itself to `aspectRatio` (or the poster's dimensions).
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

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

function posterUrl(poster?: ImageField | string) {
  if (!poster) return undefined
  if (typeof poster === "string") return poster
  return isFilled.image(poster) ? poster.url : undefined
}

export default function PrismicVideo({
  field,
  poster,
  fill = false,
  aspectRatio,
  autoPlay,
  loop,
  muted,
  className,
  wrapperClassName,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Videos default to an ambient GIF-style clip: autoplay, muted, looped.
  // Controls are always available (revealed on hover) so a viewer can pause,
  // scrub, or unmute at any time.
  const wantsAutoPlay = autoPlay ?? true
  const wantsLoop = loop ?? true
  const wantsMuted = muted ?? true

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(wantsMuted)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  // Respect reduced-motion by not autoplaying. The video still renders with its
  // poster as the resting frame; since it starts paused, the controls stay
  // visible (see below) so it remains playable on demand.
  const prefersReducedMotion = usePrefersReducedMotion()
  const allowAutoPlay = wantsAutoPlay && !prefersReducedMotion

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  const onSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Number(e.target.value)
  }, [])

  if (!isFilled.linkToMedia(field)) return null

  const url = field.url
  const aspect = fill ? undefined : aspectRatio
  const wrapperStyle: CSSProperties | undefined = aspect
    ? { aspectRatio: aspect }
    : undefined

  const progress = duration > 0 ? (current / duration) * 100 : 0

  return (
    <div
      className={cn(
        "group relative",
        fill && "h-full w-full",
        wrapperClassName,
      )}
      style={wrapperStyle}
    >
      <video
        ref={videoRef}
        src={url}
        poster={posterUrl(poster)}
        playsInline
        preload="metadata"
        autoPlay={allowAutoPlay}
        loop={wantsLoop}
        muted={wantsMuted}
        controls={false}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        className={cn("block h-full w-full cursor-pointer", className)}
      />

      {/* Always rendered; revealed on hover/focus, and kept visible while
          paused so a stopped (or reduced-motion) video stays obviously playable. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-dark/80 to-transparent px-3 pt-8 pb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100",
          !isPlaying && "opacity-100",
        )}
      >
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="pointer-events-auto shrink-0 text-light transition-colors hover:text-brand"
        >
          {isPlaying ? (
            <Pause className="size-5" fill="currentColor" />
          ) : (
            <Play className="size-5" fill="currentColor" />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={current}
          onChange={onSeek}
          aria-label="Seek"
          className="pointer-events-auto h-1 w-full cursor-pointer appearance-none rounded-full bg-light/30 accent-brand"
          style={{
            background: `linear-gradient(to right, var(--color-brand) ${progress}%, color-mix(in srgb, var(--color-light) 30%, transparent) ${progress}%)`,
          }}
        />

        <span className="pointer-events-none shrink-0 text-xs tabular-nums text-light/80">
          {formatTime(current)} / {formatTime(duration)}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          className="pointer-events-auto shrink-0 text-light transition-colors hover:text-brand"
        >
          {isMuted ? (
            <VolumeX className="size-5" />
          ) : (
            <Volume2 className="size-5" />
          )}
        </button>
      </div>
    </div>
  )
}
