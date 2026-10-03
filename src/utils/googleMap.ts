// googleMapUrl is filled in by admins and usually holds the full Google Maps
// "<iframe ...>" snippet (sometimes just the embed URL). Never inject that HTML —
// pull out the src and only accept genuine Google Maps embed URLs.

const EMBED_PATTERN = /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed\?/i;

export const getMapEmbedUrl = (raw?: string | null): string | null => {
  if (!raw) return null;
  const value = raw.trim();
  const src = value.startsWith('<') ? value.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] : value;
  if (!src) return null;
  const url = src.replace(/&amp;/g, '&');
  return EMBED_PATTERN.test(url) ? url : null;
};

// Embed "pb" URLs carry the coordinates as !2d<lng>!3d<lat> — use them for an "Open in Maps" link.
export const getMapOpenUrl = (embedUrl: string | null, fallbackQuery?: string): string | null => {
  const lng = embedUrl?.match(/!2d(-?\d+(?:\.\d+)?)/)?.[1];
  const lat = embedUrl?.match(/!3d(-?\d+(?:\.\d+)?)/)?.[1];
  if (lat && lng) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  if (fallbackQuery?.trim()) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery.trim())}`;
  return null;
};
