/**
 * Transforms a Cloudinary image URL to include optimization parameters.
 * Applies: auto format, auto quality, width scaling.
 * Returns the original URL unchanged if it's not a Cloudinary URL.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width = 800
): string | undefined {
  if (!url) return undefined

  // Only transform Cloudinary image upload URLs
  if (!url.includes("cloudinary.com")) return url

  // Insert f_auto,q_auto,w_<width> before /image/upload/ in the Cloudinary URL
  // Example: https://res.cloudinary.com/<cloud>/image/upload/v123/name.jpg
  //      →  https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_800/v123/name.jpg
  return url.replace(
    /\/image\/upload\//,
    `/image/upload/f_auto,q_auto,w_${width}/`
  )
}

/**
 * Gets the best image URL for the given display size.
 * Thumbnail cards: width=400, detail pages: width=800.
 * Always applies Cloudinary optimization when applicable.
 */
export function getProductImageUrl(
  imageUrl: string | null | undefined,
  size: "thumbnail" | "detail" | "preview" = "detail"
): string | undefined {
  const widthMap = { thumbnail: 400, preview: 600, detail: 800 }
  return getOptimizedImageUrl(imageUrl, widthMap[size])
}
