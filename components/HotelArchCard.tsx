import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import type { Hotel } from '@/data/hotels';
import Img from './Img';
import Stars from './Stars';

/** Arched "temple window" card used on Home and as the cross-sell row. */
export default function HotelArchCard({ hotel, headingLevel = 'h3' }: { hotel: Hotel; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  const soon = hotel.status === 'coming-soon';
  const place = hotel.area && hotel.area !== hotel.city ? `${hotel.area}, ${hotel.city}` : hotel.city;
  return (
    <article className="reveal group relative flex flex-col items-center text-center">
      <div className="relative w-full max-w-[360px]">
        {/* offset gold arch outline */}
        <div className="arch absolute inset-0 translate-x-2 translate-y-2 border border-gold" aria-hidden="true" />
        <div className="arch relative aspect-[4/5] overflow-hidden bg-sand shadow-card">
          <Img
            src={hotel.cover}
            alt={soon ? `${hotel.name} (artist's impression)` : hotel.name}
            sizes="(min-width: 1024px) 360px, 90vw"
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
          />
          {soon && (
            <p className="absolute inset-x-0 bottom-0 bg-teal-dark/95 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">Coming soon</p>
          )}
        </div>
      </div>
      {hotel.stars && (
        <div className="mt-6 flex items-center gap-2 text-copper-dark">
          <Stars count={hotel.stars} />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">{hotel.stars}-star</span>
        </div>
      )}
      <H className="mt-2 font-serif text-[28px] font-semibold text-ink">
        <Link href={`/hotels/${hotel.slug}/`} className="after:absolute after:inset-0 hover:text-copper-dark">
          {hotel.name}
        </Link>
      </H>
      <p className="mt-1 flex items-center gap-1 text-sm text-muted">
        <MapPin className="h-4 w-4" aria-hidden="true" />
        {place}
      </p>
      {hotel.highlights.length > 0 && (
        <ul className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Highlights">
          {hotel.highlights.slice(0, 3).map((h) => (
            <li key={h} className="chip">
              {h}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-5 inline-flex items-center gap-1 font-semibold text-copper-dark">
        {soon ? 'Preview the hotel' : 'View hotel'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </article>
  );
}
