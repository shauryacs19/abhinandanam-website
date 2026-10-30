import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Hotel } from '@/data/hotels';
import Img from './Img';
import Stars from './Stars';

/**
 * Home "Our hotels": the featured hotels side by side as full-height photo panels (accordion).
 * Desktop: the hovered / focused panel grows to ~60% of the width and reveals its details; with
 * nothing hovered the first one is open. Pure CSS (.hx rules in globals.css), no JS.
 * Full screen like the hero (100svh); components/PanelSnap.tsx glides the page onto it.
 * Phones: panels stack, each a full-screen photo with its details showing. Each panel links to its hotel.
 */
export default function HotelPanels({ hotels, photos = {} }: { hotels: Hotel[]; photos?: Record<string, string> }) {
  return (
    <ul className="hx flex flex-col gap-1 bg-cream lg:h-[100svh] lg:min-h-[600px] lg:flex-row">
      {hotels.map((h) => {
        const soon = h.status === 'coming-soon';
        const place = h.area && h.area !== h.city ? `${h.area}, ${h.city}` : h.city;
        const keyLine = h.highlights.slice(0, 2).join(' · ');
        return (
          <li key={h.slug} className="hx-panel relative h-[100svh] min-h-[520px] overflow-hidden lg:h-auto lg:min-h-0">
            <Link href={`/hotels/${h.slug}/`} className="group absolute inset-0 block text-white" aria-labelledby={`panel-${h.slug}`}>
              <Img src={photos[h.slug] ?? h.cover} alt="" sizes="(min-width: 1024px) 62vw, 100vw" className="hx-img absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" aria-hidden="true" />
              {/* top fades out of the page charcoal, so the section above runs into the photos without a hard bright edge */}
              <span className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-cream via-cream/50 to-transparent" aria-hidden="true" />

              {soon && (
                <span className="absolute left-5 top-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                  <span className="rounded-full bg-teal-dark px-3 py-1">Coming soon</span>
                  <span className="rounded-full bg-black/55 px-3 py-1 normal-case tracking-normal">Artist&rsquo;s impression</span>
                </span>
              )}

              <span className="absolute inset-x-0 bottom-0 block p-6 sm:p-10 lg:p-8 xl:p-10">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-brass">
                  {h.stars && <Stars count={h.stars} />}
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">{place}</span>
                </span>
                <span id={`panel-${h.slug}`} className="hx-name mt-2 block font-serif text-4xl font-semibold leading-none sm:text-5xl">
                  {h.name}
                </span>

                {/* fixed width so the text doesn't reflow while the panel grows. Kept to 2-3 lines (client, 2026-10-30) */}
                <span className="hx-detail block lg:w-[min(520px,46vw)]">
                  <span className="mt-4 block h-px w-16 bg-brass/80" aria-hidden="true" />
                  <span className="mt-4 block font-serif text-[22px] italic leading-snug text-white/95">{h.tagline}</span>
                  {keyLine && <span className="mt-2 block text-[13px] font-medium uppercase tracking-[0.16em] text-white/70">{keyLine}</span>}
                  <span className="mt-6 inline-flex items-center gap-2 border-b border-brass/80 pb-1 text-[15px] font-semibold tracking-[0.02em] text-brass group-hover:border-white group-hover:text-white">
                    {soon ? 'Preview the hotel' : 'Explore the hotel'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
