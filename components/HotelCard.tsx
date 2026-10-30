import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Hotel } from '@/data/hotels';
import Img from './Img';
import Stars from './Stars';

/** Editorial hotel card (photo, star/area line, name, tagline, link) for the cross-sell row and About. */
export default function HotelCard({ hotel, headingLevel = 'h3' }: { hotel: Hotel; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  const soon = hotel.status === 'coming-soon';
  const place = hotel.area && hotel.area !== hotel.city ? `${hotel.area}, ${hotel.city}` : hotel.city;
  return (
    <article className="reveal group relative">
      <div className="relative overflow-hidden rounded-lg bg-sand shadow-card">
        <Img
          src={hotel.cover}
          alt={soon ? `${hotel.name} (artist's impression)` : hotel.name}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {soon && (
          <span className="absolute left-3 top-3 rounded-full bg-teal-dark px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">Coming soon</span>
        )}
      </div>
      <p className="mt-5 flex flex-wrap items-center gap-x-2.5 text-brass">
        {hotel.stars && <Stars count={hotel.stars} />}
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {hotel.stars ? `${hotel.stars}-star · ` : ''}
          {place}
        </span>
      </p>
      <H className="mt-2 font-serif text-[28px] font-semibold leading-tight text-ink">
        <Link href={`/hotels/${hotel.slug}/`} className="after:absolute after:inset-0 group-hover:text-brass">
          {hotel.name}
        </Link>
      </H>
      <p className="mt-1.5 line-clamp-2 text-[15px] text-muted">{hotel.tagline}</p>
      <span className="mt-4 inline-flex items-center gap-1 font-semibold text-brass">
        {soon ? 'Preview the hotel' : 'View hotel'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </article>
  );
}
