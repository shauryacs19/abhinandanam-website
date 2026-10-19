// Tiny analytics shim. No-op until GA4 (gtag) or Meta Pixel (fbq) is added to the page,
// then every call / WhatsApp / email / directions click is reported automatically.
// Clicks are captured by <ClickTracker /> (one listener for the whole site).

export type TrackEvent = 'call_click' | 'whatsapp_click' | 'email_click' | 'directions_click';

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: TrackEvent, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', event, params);
  window.fbq?.('trackCustom', event, params);
  window.dataLayer?.push({ event, ...params });
  if (process.env.NODE_ENV === 'development') console.debug('[track]', event, params);
}

/** Map a clicked link to an event (or null if it isn't a conversion link) */
export function eventForHref(href: string): TrackEvent | null {
  if (href.startsWith('tel:')) return 'call_click';
  if (href.includes('wa.me/') || href.includes('whatsapp.com')) return 'whatsapp_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (href.includes('google.com/maps/dir')) return 'directions_click';
  return null;
}
