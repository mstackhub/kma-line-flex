/**
 * Ensures an image URL is an absolute HTTPS URL accepted by LINE Messaging API.
 * LINE API rejects data URLs (data:image/...) and relative paths (/uploads/...).
 */
export function sanitizeLineImageUrl(
  url?: string,
  fallback = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80'
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const trimmed = url.trim();

  // If already a valid HTTPS URL, use it directly
  if (trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If HTTP, upgrade to HTTPS
  if (trimmed.startsWith('http://')) {
    return trimmed.replace('http://', 'https://');
  }

  // If Vercel production domain is known or host is provided
  if (typeof process !== 'undefined' && process.env.VERCEL_URL && trimmed.startsWith('/')) {
    return `https://${process.env.VERCEL_URL}${trimmed}`;
  }

  // If local /uploads/ or data: URL on local dev machine, LINE servers cannot download from localhost,
  // so we fallback to a beautiful high-res CDN placeholder for the LINE push payload while keeping local preview intact
  return fallback;
}
