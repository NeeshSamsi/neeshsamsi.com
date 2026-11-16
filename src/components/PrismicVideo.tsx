"use client"

import {
  type ImageField,
  type LinkToMediaField,
  isFilled,
} from "@prismicio/client"

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

// There's no single standard API for "does this <video> have an audio
// track" — each engine exposes its own signal, so this ORs the lot to
// maximize detection across browsers.
type ProbedVideoElement = HTMLVideoElement & {
  mozHasAudio?: boolean
  webkitAudioDecodedByteCount?: number
  audioTracks?: { length: number }
}

function detectHasAudio(video: HTMLVideoElement): boolean {
  const probed = video as ProbedVideoElement
  return Boolean(
    probed.mozHasAudio ||
      (probed.webkitAudioDecodedByteCount ?? 0) > 0 ||
      (probed.audioTracks?.length ?? 0) > 0,
  )
}

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
  const rafRef = useRef<number | null>(null)

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
  const [hasAudio, setHasAudio] = useState(false)

  // Some detection signals (e.g. webkitAudioDecodedByteCount) only become
  // accurate once decoding has actually started, not at loadedmetadata —
  // so this re-checks on every timeupdate too until it flips true.
  const checkHasAudio = useCallback(() => {
    const video = videoRef.current
    if (video && detectHasAudio(video)) setHasAudio(true)
  }, [])

  // `duration` is NaN until metadata loads and Infinity for sources of
  // unknown length; neither works as the seek range's max, so both count as
  // "no duration yet".
  const syncMetadata = useCallback(
    (video: HTMLVideoElement) => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0)
      checkHasAudio()
    },
    [checkHasAudio],
  )

  // Respect reduced-motion by not autoplaying. The video still renders with its
  // poster as the resting frame; since it starts paused, the controls stay
  // visible (see below) so it remains playable on demand.
  const prefersReducedMotion = usePrefersReducedMotion()
  const allowAutoPlay = wantsAutoPlay && !prefersReducedMotion

  // The server can't read the motion preference, so it always renders
  // autoPlay, and on a warm cache the browser can start the clip before
  // hydration drops the attribute. Pause it once the real preference is known.
  useEffect(() => {
    if (!allowAutoPlay) videoRef.current?.pause()
  }, [allowAutoPlay])

  // Drives the progress bar off rAF (not just the sparse `timeupdate` event)
  // so its fill moves smoothly at playback rate instead of visibly stepping.
  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    const step = () => {
      const video = videoRef.current
      if (!video) return
      setCurrent(video.currentTime)
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current ??= requestAnimationFrame(step)
  }, [])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  // The <video> is server-rendered with autoPlay, so on a warm cache the
  // browser can load metadata and start playing before React hydrates and
  // attaches onLoadedMetadata/onPlay. Those events are then never seen:
  // duration stays 0 (empty fill, nothing to seek) and the rAF progress loop
  // never starts. Catch up from the element's own state on mount.
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        syncMetadata(video)
      }
      if (!video.paused) handlePlay()
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      // Reset so a StrictMode remount's handlePlay (`??=`) can restart it.
      rafRef.current = null
    }
  }, [syncMetadata, handlePlay])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    // play() rejects when the browser blocks or interrupts playback. The UI
    // follows the element's own play/pause events, so there is nothing to undo.
    if (video.paused) video.play().catch(() => {})
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
    const value = Number(e.target.value)
    video.currentTime = value
    setCurrent(value)
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
        onPlay={handlePlay}
        onPause={handlePause}
        onLoadedMetadata={(e) => syncMetadata(e.currentTarget)}
        onTimeUpdate={(e) => {
          setCurrent(e.currentTarget.currentTime)
          checkHasAudio()
        }}
        className={cn("block h-full w-full cursor-pointer", className)}
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="pointer-events-auto absolute top-1/2 left-1/2 flex -translate-x-1/2 translate-y-[calc(-50%+8px)] scale-95 items-center justify-center rounded-full border-[0.5px] border-dark bg-light/40 p-5 text-dark opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-[-50%] group-hover:scale-100 group-hover:opacity-100 focus-visible:translate-y-[-50%] focus-visible:scale-100 focus-visible:opacity-100"
      >
        <span className="relative block size-7">
          <Play
            aria-hidden="true"
            strokeWidth={2}
            className={cn(
              "absolute inset-0 size-7 transition-all duration-300 ease-in-out",
              isPlaying ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
            )}
          />
          <Pause
            aria-hidden="true"
            strokeWidth={2}
            className={cn(
              "absolute inset-0 size-7 transition-all duration-300 ease-in-out",
              isPlaying ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
            )}
          />
        </span>
      </button>

      {/* Always rendered; revealed on hover/focus, and kept visible while
          paused so a stopped (or reduced-motion) video stays obviously playable. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-4 flex translate-y-2 flex-col items-end gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100",
          !isPlaying && "translate-y-0 opacity-100",
        )}
      >
        <div className="relative mx-4 h-1 self-stretch">
          {/* Visual track + fill only — kept separate from the interactive
              input below so hiding the native thumb can't break the fill
              rendering (a native styled thumb turned out unreliable). The
              track shares the buttons' light glass + dark hairline so it
              reads over both dark and light footage. */}
          <div className="pointer-events-none h-full w-full overflow-hidden rounded-full border-[0.5px] border-dark bg-light/40 backdrop-blur-md">
            <div
              className="h-full rounded-full bg-dark"
              style={{ width: `${progress}%` }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.001}
            value={current}
            onChange={onSeek}
            onPointerUp={(e) => e.currentTarget.blur()}
            aria-label="Seek"
            className="pointer-events-auto absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>

        {hasAudio && (
          <button
            type="button"
            onClick={(e) => {
              toggleMute()
              e.currentTarget.blur()
            }}
            className="pointer-events-auto mr-4 shrink-0 rounded-md border-[0.5px] border-dark bg-light/40 px-4 py-2 text-sm font-light text-dark backdrop-blur-md transition-[width] duration-300 ease-in-out [interpolate-size:allow-keywords] md:text-lg"
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        )}
      </div>
    </div>
  )
}
