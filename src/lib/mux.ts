import { type ImageField, type KeyTextField, isFilled } from "@prismicio/client"

/**
 * The playback ID an editor entered in a "Mux playback ID" field, or `null`
 * when the field is empty. A slot is a video exactly when this returns an ID.
 * IDs are pasted from the Mux dashboard, so stray whitespace is dropped.
 */
export function muxPlaybackId(field: KeyTextField | undefined): string | null {
  if (!isFilled.keyText(field)) return null
  const id = field.trim()
  return id === "" ? null : id
}

/**
 * A still frame of a Mux video, served by Mux from the playback ID.
 * https://www.mux.com/docs/guides/get-images-from-a-video
 */
export function muxThumbnailUrl(playbackId: string): string {
  return `https://image.mux.com/${encodeURIComponent(playbackId)}/thumbnail.webp`
}

/**
 * The poster for a Mux video: the Prismic image when one is set, otherwise
 * the frame Mux generates for the playback ID.
 */
export function videoPosterUrl(
  playbackId: string,
  image: ImageField | undefined,
): string {
  return image && isFilled.image(image)
    ? image.url
    : muxThumbnailUrl(playbackId)
}
