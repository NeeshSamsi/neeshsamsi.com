"use client"

import { type ImageField } from "@prismicio/client"
import {
  Container,
  createPlayer,
  Gesture,
  MuteButton,
  PlayButton,
  Slider,
  TimeSlider,
} from "@videojs/react"
import { MuxVideo } from "@videojs/react/media/mux-video"
import { videoFeatures } from "@videojs/react/video"
import {
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { Pause, Play } from "lucide-react"

import { videoPosterUrl } from "@/lib/mux"
import { cn } from "@/lib/utils"
import { detectHasAudio } from "@/lib/video-audio"

import {
  type PrismicVideoProps,
  videoClassName,
  videoWrapperProps,
} from "./PrismicVideo"

// The player is Video.js v10 with Mux's media component, which is how Mux
// documents web playback (https://www.mux.com/docs/guides/playback-videojs-with-mux).
// Video.js supplies the behaviour of each control (play/pause, mute, the time
// slider and its storyboard thumbnail); the look is ours, in Tailwind.
const { Player, usePlayer } = createPlayer({ features: videoFeatures })

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

/**
 * The seek bar and mute button. Revealed on hover/focus, and kept visible
 * while paused so a stopped (or reduced-motion) video stays obviously playable.
 */
function ControlBar({ children }: { children: ReactNode }) {
  const paused = usePlayer((state) => state.paused)
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-4 flex translate-y-2 flex-col items-end gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100",
        paused && "translate-y-0 opacity-100",
      )}
    >
      {children}
    </div>
  )
}

function MuteControl() {
  return (
    <MuteButton
      className="pointer-events-auto mr-4 shrink-0 rounded-md border-[0.5px] border-dark bg-light/40 px-4 py-2 text-sm font-light text-dark backdrop-blur-md transition-[width] duration-300 ease-in-out [interpolate-size:allow-keywords] md:text-lg"
      render={(props, state) => (
        <button
          {...props}
          type="button"
          onPointerUp={(e) => e.currentTarget.blur()}
        >
          {state.muted ? "Unmute" : "Mute"}
        </button>
      )}
    />
  )
}

/**
 * The player itself. Loaded in the browser only, by `PrismicVideo`, which
 * shows the poster in the same box until this is ready.
 */
export default function PrismicVideoPlayer(props: PrismicVideoProps) {
  const { playbackId, poster, autoPlay, loop, muted } = props

  // Videos default to an ambient GIF-style clip: autoplay, muted, looped.
  // Controls are always available (revealed on hover) so a viewer can pause,
  // scrub, or unmute at any time.
  const wantsAutoPlay = autoPlay ?? true
  const wantsLoop = loop ?? true
  const wantsMuted = muted ?? true

  // Respect reduced-motion by not autoplaying. The video still renders with its
  // poster as the resting frame; since it starts paused, the controls stay
  // visible so it remains playable on demand.
  const prefersReducedMotion = usePrefersReducedMotion()
  const allowAutoPlay = wantsAutoPlay && !prefersReducedMotion

  // The player only renders in the browser, so the preference is known from
  // the first render and a reduced-motion clip never starts. This covers the
  // preference being switched on while a clip is already playing.
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (!allowAutoPlay) videoRef.current?.pause()
  }, [allowAutoPlay])

  // The mute button is only offered for clips that have sound. Detection
  // can't be trusted until decoding has started, so it is re-checked as the
  // clip loads and plays until it turns true.
  const [hasAudio, setHasAudio] = useState(false)
  const checkHasAudio = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (!hasAudio && detectHasAudio(event.currentTarget)) setHasAudio(true)
  }

  return (
    <Player>
      <Container {...videoWrapperProps(props)}>
        {/* `crossOrigin` lets the storyboard track Mux adds for the slider
            thumbnail load from image.mux.com. */}
        <MuxVideo
          ref={videoRef}
          source={{ playbackId, storyboard: { format: "webp" } }}
          poster={videoPosterUrl(playbackId, poster)}
          crossOrigin="anonymous"
          playsInline
          autoPlay={allowAutoPlay}
          loop={wantsLoop}
          muted={wantsMuted}
          onLoadedMetadata={checkHasAudio}
          onTimeUpdate={checkHasAudio}
          className={videoClassName(props)}
        />

        {/* Clicking or tapping the picture toggles playback. */}
        <Gesture type="tap" action="togglePaused" />

        <PlayButton
          className="pointer-events-auto absolute top-1/2 left-1/2 flex -translate-x-1/2 translate-y-[calc(-50%+8px)] scale-95 items-center justify-center rounded-full border-[0.5px] border-dark bg-light/40 p-5 text-dark opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-[-50%] group-hover:scale-100 group-hover:opacity-100 focus-visible:translate-y-[-50%] focus-visible:scale-100 focus-visible:opacity-100"
          render={(props, state) => (
            <button {...props} type="button">
              <span className="relative block size-7">
                <Play
                  aria-hidden="true"
                  strokeWidth={2}
                  className={cn(
                    "absolute inset-0 size-7 transition-all duration-300 ease-in-out",
                    state.paused
                      ? "rotate-0 opacity-100"
                      : "rotate-90 opacity-0",
                  )}
                />
                <Pause
                  aria-hidden="true"
                  strokeWidth={2}
                  className={cn(
                    "absolute inset-0 size-7 transition-all duration-300 ease-in-out",
                    state.paused
                      ? "-rotate-90 opacity-0"
                      : "rotate-0 opacity-100",
                  )}
                />
              </span>
            </button>
          )}
        />

        <ControlBar>
          {/* The track shares the buttons' light glass + dark hairline so it
              reads over both dark and light footage. `pauseOnDrag` holds
              the clip still while scrubbing and resumes it on release if it
              was playing. */}
          <TimeSlider.Root
            pauseOnDrag
            className="group/slider pointer-events-auto relative mx-4 h-1 cursor-pointer self-stretch"
          >
            <TimeSlider.Track className="block h-full w-full overflow-hidden rounded-full border-[0.5px] border-dark bg-light/40 backdrop-blur-md">
              <TimeSlider.Fill className="block h-full w-(--media-slider-fill) rounded-full bg-dark" />
            </TimeSlider.Track>
            {/* The slider itself for keyboards and assistive tech. Invisible:
                the fill above is the only mark the design draws. */}
            <TimeSlider.Thumb
              className="absolute inset-0 block opacity-0"
              onPointerUp={(e) => e.currentTarget.blur()}
            />

            {/* A frame from Mux's storyboard, above the pointer while it is
                over the bar. Kept inside the player's edges at both ends. */}
            <Slider.Thumbnail.Root className="pointer-events-none absolute bottom-full left-[clamp(4.5rem,var(--media-slider-pointer),calc(100%-4.5rem))] mb-3 max-h-28 max-w-40 -translate-x-1/2 overflow-hidden rounded-md border-[0.5px] border-dark opacity-0 transition-opacity duration-150 group-data-pointing/slider:opacity-100 data-hidden:hidden">
              <Slider.Thumbnail.Image className="block" />
            </Slider.Thumbnail.Root>
          </TimeSlider.Root>

          {hasAudio && <MuteControl />}
        </ControlBar>
      </Container>
    </Player>
  )
}
