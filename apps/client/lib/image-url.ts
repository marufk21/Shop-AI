/**
 * Transforms a Cloudinary image URL to include optimization parameters.
 * Applies: AVIF/WebP auto format, auto quality, no-upscale width limiting, and sharpening.
 * Returns the original URL unchanged if it's not a Cloudinary URL.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width = 800
): string | undefined {
  if (!url) return undefined

  // Only transform Cloudinary image upload URLs
  if (!url.includes("cloudinary.com")) return url

  // Insert f_auto (AVIF/WebP), q_auto, c_limit, w_<width> before /image/upload/
  // f_auto with best quality: Cloudinary serves AVIF to supporting browsers, WebP as fallback
  // Example: https://res.cloudinary.com/<cloud>/image/upload/v123/name.jpg
  //      -> https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto:best,c_limit,w_800,e_sharpen:80/v123/name.jpg
  return url.replace(
    /\/image\/upload\//,
    `/image/upload/f_auto,q_auto:best,c_limit,w_${width},e_sharpen:80/`
  )
}

const WIDTH_MAP = {
  micro: 128,
  thumb: 160,
  thumbnail: 600,
  detail: 1200,
} as const

type ImageSize = keyof typeof WIDTH_MAP

/**
 * Gets the best image URL for the given display size.
 * micro: admin tables (32px display, 128px for 2x retina)
 * thumb: cart drawer thumbnails (80px display, 160px for 2x retina)
 * thumbnail: product cards (up to ~300px, 600px for 2x retina)
 * detail: product detail pages (up to ~600px, 1200px for 2x retina)
 *
 * Always applies Cloudinary optimization when applicable.
 */
export function getProductImageUrl(
  imageUrl: string | null | undefined,
  size: ImageSize = "detail"
): string | undefined {
  return getOptimizedImageUrl(imageUrl, WIDTH_MAP[size])
}
