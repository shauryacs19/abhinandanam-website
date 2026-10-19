'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, BedDouble, MapPin, Phone } from 'lucide-react';
import Img from './Img';
import Stars from './Stars';
import { amenityIcon } from '@/lib/amenity-icons';
import { smallSrc } from '@/lib/images';

export type HotelSummary = {
  slug: string;
  name: string;
  status: 'operating' | 'coming-soon';
  placeholder: boolean;
  stars?: number;
  place: string;
  addressLine: string;
  cover: string;
  thumbs: { src: string; alt: string }[];
  roomCount: number;
  amenities: string[];
  hasPool: boolean;
  hasBanquet: boolean;
  phone: string;
  isRender: boolean;
};

const filters = [
  { key: 'all', label: 'All', test: () => true },
  { key: 'operating', label: 'Operating', test: (h: HotelSummary) => h.status === 'operating' },
  { key: 'coming-soon', label: 'Coming soon', test: (h: HotelSummary) => h.status === 'coming-soon' },
  { key: 'pool', label: 'Has pool', test: (h: HotelSummary) => h.hasPool },
  { key: 'banquet', label: 'Has banquet', test: (h: HotelSummary) => h.hasBanquet },
] as const;

/** OTA-style listing, minus the clutter: filter chips + one clean card per hotel. */
export default function HotelsBrowser({ hotels }: { hotels: HotelSummary[] }) {
  const [active, setActive] = useState<(typeof filters)[number]['key']>('all');
  const list = useMemo(() => hotels.filter(filters.find((f) => f.key === active)!.test), [hotels, active]);

  return (
    <>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter hotels">
        {filters.map((f) => {
          const count = hotels.filter(f.test).length;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active === f.key}
              onClick={() => setActive(f.key)}
              className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                active === f.key ? 'border-copper-dark bg-copper-dark text-white' : 'border-gold bg-white/60 text-ink hover:border-copper-dark'
              }`}
            >
              {f.label}
              <span className={`rounded-full px-1.5 text-xs ${active === f.key ? 'bg-white text-copper-dark' : 'bg-sand'}`}>{count}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        Showing {list.length} of {hotels.length} hotels
      </p>

      <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((h) => (
          <li key={h.slug}>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-gold/50 bg-white/70 shadow-card">
              <div className="relative">
                <Img src={h.cover} alt={h.placeholder ? `${h.name}: photos coming soon (placeholder)` : `${h.name}${h.isRender ? " (artist's impression)" : ''}`} sizes="(min-width: 1280px) 380px, (min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full bg-sand object-cover" />
                {h.status === 'coming-soon' && <span className="absolute left-3 top-3 rounded-full bg-teal-dark px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">Coming soon</span>}
                {h.placeholder && <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">Details coming soon</span>}
              </div>
              {h.thumbs.length > 0 && (
                <ul className="grid grid-cols-4 gap-1 p-1" aria-label={`More photos of ${h.name}`}>
                  {h.thumbs.map((t) => (
                    <li key={t.src}>
                      <img src={smallSrc(t.src)} alt={t.alt} loading="lazy" decoding="async" width={200} height={150} className="aspect-[4/3] w-full rounded-md object-cover" />
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-1 flex-col p-5">
                {h.stars ? <Stars count={h.stars} className="text-copper-dark" /> : null}
                <h2 className="mt-1 text-[28px] font-semibold leading-tight">{h.name}</h2>
                <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {h.addressLine}
                </p>
                {h.roomCount > 0 && (
                  <p className="mt-3 flex items-center gap-1.5 text-sm font-medium">
                    <BedDouble className="h-4 w-4 text-copper-dark" aria-hidden="true" /> {h.roomCount} room categories
                  </p>
                )}
                {h.amenities.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Key amenities">
                    {h.amenities.map((a) => {
                      const Icon = amenityIcon(a);
                      return (
                        <li key={a} className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-xs" title={a}>
                          <Icon className="h-3.5 w-3.5 text-copper-dark" aria-hidden="true" />
                          {a}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                  <a href={`tel:${h.phone}`} data-track={`listing:${h.slug}`} className="btn-primary !px-3">
                    <Phone className="h-4 w-4" aria-hidden="true" /> {h.status === 'coming-soon' ? 'Pre-book' : 'Call'}
                  </a>
                  <Link href={`/hotels/${h.slug}/`} className="btn-outline !px-3" aria-label={`View details of ${h.name}`}>
                    View details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
