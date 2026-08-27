import { UtmConfig } from '@/types/message';

export function applyUtmTracking(url: string, utm?: UtmConfig, contentOverride?: string): string {
  if (!url || !utm || !utm.enabled) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (utm.source) parsed.searchParams.set('utm_source', utm.source);
    if (utm.medium) parsed.searchParams.set('utm_medium', utm.medium);
    if (utm.campaign) parsed.searchParams.set('utm_campaign', utm.campaign);
    
    const content = contentOverride || utm.content;
    if (content) parsed.searchParams.set('utm_content', content);

    return parsed.toString();
  } catch {
    // If URL parsing fails (e.g. invalid format during draft typing), return raw string
    return url;
  }
}
