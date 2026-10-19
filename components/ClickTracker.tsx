'use client';

import { useEffect } from 'react';
import { eventForHref, track } from '@/lib/track';

/** One document-level listener reports every call / WhatsApp / email / directions click. */
export default function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      const event = eventForHref(href);
      if (event) track(event, { label: a.dataset.track ?? 'link', page: location.pathname });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
