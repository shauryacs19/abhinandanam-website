'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { MessageCircle } from 'lucide-react';
import { waText, whatsappHref } from '@/lib/contact';
import { track } from '@/lib/track';

export type AvailabilityHotel = { slug: string; name: string; soon: boolean; phone: string; whatsapp: string };

type Props = {
  hotels: AvailabilityHotel[];
  /** Hotel pages: the hotel is fixed, so the picker is hidden */
  fixedSlug?: string;
  trackLabel: string;
  className?: string;
};

/** "YYYY-MM-DD" for a local date, shifted by n days */
function isoDay(base: Date, n = 0): string {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const field = 'flex min-w-0 flex-col rounded-lg px-4 py-2 transition-colors hover:bg-sand/70 focus-within:bg-sand/70 focus-within:ring-2 focus-within:ring-brass';
const label = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-muted';
const input = 'w-full min-w-0 bg-transparent py-0.5 text-[15px] font-medium text-ink outline-none';

/**
 * Hotel / dates / guests "pill" (Sayaji, Oberoi, Hilton pattern). No booking engine yet:
 * submitting opens WhatsApp with the request typed out, so the front desk replies with rates.
 * Later this becomes the front end of the real booking system.
 */
export default function AvailabilityBar({ hotels, fixedSlug, trackLabel, className = '' }: Props) {
  const id = useId();
  const [slug, setSlug] = useState(fixedSlug ?? hotels[0]?.slug ?? '');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  // Set after mount: the static HTML is built once, so "today" can't be baked into it
  const [today, setToday] = useState<string>();
  useEffect(() => setToday(isoDay(new Date())), []);

  const hotel = hotels.find((h) => h.slug === slug) ?? hotels[0];
  if (!hotel) return null;

  const onCheckIn = (v: string) => {
    setCheckIn(v);
    if (v && (!checkOut || checkOut <= v)) setCheckOut(isoDay(new Date(`${v}T00:00:00`), 1));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = waText.availability({ hotel: hotel.name, checkIn, checkOut, guests, rooms, soon: hotel.soon });
    window.open(whatsappHref(text, hotel.whatsapp), '_blank', 'noopener,noreferrer');
    track('whatsapp_click', { label: `availability:${trackLabel}`, hotel: hotel.slug, page: location.pathname });
  };

  return (
    <div className={className}>
      <form
        onSubmit={submit}
        aria-label={fixedSlug ? `Check availability at ${hotel.name}` : 'Check availability'}
        className={`grid grid-cols-2 gap-1 rounded-xl border border-gold/15 bg-sand/95 p-2 shadow-lift backdrop-blur ${
          fixedSlug ? 'md:grid-cols-[1fr_1fr_0.7fr_0.7fr_auto]' : 'lg:grid-cols-[1.5fr_1fr_1fr_0.6fr_0.6fr_auto]'
        }`}
      >
        {!fixedSlug && (
          <label className={`${field} col-span-2 lg:col-span-1`} htmlFor={`${id}-hotel`}>
            <span className={label}>Hotel</span>
            <select id={`${id}-hotel`} value={slug} onChange={(e) => setSlug(e.target.value)} className={`${input} cursor-pointer`}>
              {hotels.map((h) => (
                <option key={h.slug} value={h.slug}>
                  {h.name}
                  {h.soon ? ' (pre-book)' : ''}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className={field} htmlFor={`${id}-in`}>
          <span className={label}>Check-in</span>
          <input id={`${id}-in`} type="date" value={checkIn} min={today} onChange={(e) => onCheckIn(e.target.value)} className={input} />
        </label>
        <label className={field} htmlFor={`${id}-out`}>
          <span className={label}>Check-out</span>
          <input
            id={`${id}-out`}
            type="date"
            value={checkOut}
            min={checkIn ? isoDay(new Date(`${checkIn}T00:00:00`), 1) : today}
            onChange={(e) => setCheckOut(e.target.value)}
            className={input}
          />
        </label>
        <label className={field} htmlFor={`${id}-guests`}>
          <span className={label}>Guests</span>
          <select id={`${id}-guests`} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={`${input} cursor-pointer`}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className={field} htmlFor={`${id}-rooms`}>
          <span className={label}>Rooms</span>
          <select id={`${id}-rooms`} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className={`${input} cursor-pointer`}>
            {Array.from({ length: 6 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={`btn-whatsapp col-span-2 !min-h-[52px] ${fixedSlug ? 'md:col-span-1' : 'lg:col-span-1'}`}>
          <MessageCircle className="h-5 w-5" aria-hidden="true" /> {hotel.soon ? 'Pre-book on WhatsApp' : 'Check availability'}
        </button>
      </form>
    </div>
  );
}
