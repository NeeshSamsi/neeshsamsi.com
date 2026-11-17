// There's no single standard API for "does this <video> have an audio
// track": each engine exposes its own signal, so this ORs the lot to
// maximize detection across browsers. Video.js's own audio track list only
// covers tracks a viewer can choose between, and stays empty for a clip with
// one audio track, so it can't answer this.
type ProbedVideoElement = HTMLVideoElement & {
  mozHasAudio?: boolean
  webkitAudioDecodedByteCount?: number
  audioTracks?: { length: number }
}

/**
 * Whether a playing or loaded video has sound. Some signals (such as
 * `webkitAudioDecodedByteCount`) only become accurate once decoding has
 * started, so callers re-check as playback progresses until this is true.
 */
export function detectHasAudio(video: HTMLVideoElement): boolean {
  const probed = video as ProbedVideoElement
  return Boolean(
    probed.mozHasAudio ||
    (probed.webkitAudioDecodedByteCount ?? 0) > 0 ||
    (probed.audioTracks?.length ?? 0) > 0,
  )
}
