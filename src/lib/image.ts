/**
 * Returns the image src for a photo URL.
 * Amazon share links and other non-direct URLs are routed through the /api/image proxy.
 * Direct image URLs (unsplash, amazon thumbnails, etc.) are used as-is.
 */
export function getImageSrc(url: string): string {
  // Amazon share links need proxying
  if (url.includes("/photos/share/")) {
    return `/api/image?url=${encodeURIComponent(url)}`;
  }
  // Direct URLs can be used as-is
  return url;
}

/**
 * Returns true if the URL needs proxying (i.e. is not a direct image URL).
 */
export function needsProxy(url: string): boolean {
  return url.includes("/photos/share/");
}
