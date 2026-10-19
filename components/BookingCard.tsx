import { Clock, Mail, MessageCircle, Phone } from 'lucide-react';
import type { Hotel } from '@/data/hotels';
import { formatPhone, mailHref, waText, whatsappHref } from '@/lib/contact';
import Stars from './Stars';

/** Sticky "book direct" card. No dates, no prices: every booking is a call or a WhatsApp. */
export default function BookingCard({ hotel }: { hotel: Hotel }) {
  const soon = hotel.status === 'coming-soon';
  return (
    <div className="rounded-3xl border border-gold/60 bg-white/80 p-6 shadow-lift">
      <p className="eyebrow">{soon ? 'Opening soon' : 'Best rates on a direct call'}</p>
      <p className="mt-2 font-serif text-3xl font-semibold leading-tight">{hotel.name}</p>
      {hotel.stars && <Stars count={hotel.stars} className="mt-2 text-copper-dark" />}
      <p className="mt-3 text-sm text-muted">
        {soon
          ? 'Pre-book or ask to be notified when bookings open. Our team will call you back.'
          : 'Call or WhatsApp the front desk for availability and the best direct rate.'}
      </p>

      <div className="mt-5 grid gap-2.5">
        <a href={`tel:${hotel.phones[0]}`} data-track={`booking-card:${hotel.slug}`} className="btn-primary w-full">
          <Phone className="h-4 w-4" aria-hidden="true" /> {soon ? 'Call to pre-book' : 'Call front desk'}
        </a>
        <a href={whatsappHref(waText.hotel(hotel), hotel.whatsapp)} data-track={`booking-card:${hotel.slug}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> {soon ? 'WhatsApp: notify me' : 'WhatsApp'}
        </a>
        <a href={mailHref(hotel.email, `Enquiry: ${hotel.name}`)} data-track={`booking-card:${hotel.slug}`} className="btn-outline w-full">
          <Mail className="h-4 w-4" aria-hidden="true" /> Email
        </a>
      </div>

      <ul className="mt-5 space-y-1 border-t border-gold/40 pt-4 text-center">
        {hotel.phones.map((p) => (
          <li key={p}>
            <a href={`tel:${p}`} data-track={`booking-card:${hotel.slug}`} className="font-serif text-2xl font-semibold hover:text-copper-dark">
              {formatPhone(p)}
            </a>
          </li>
        ))}
      </ul>

      {!soon && (
        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-gold/40 pt-4 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 text-muted">
              <Clock className="h-4 w-4" aria-hidden="true" /> Check-in
            </dt>
            {/* TODO: check-in time from the client */}
            <dd className="mt-0.5 font-medium">{hotel.checkIn ?? 'Ask the front desk'}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted">
              <Clock className="h-4 w-4" aria-hidden="true" /> Check-out
            </dt>
            <dd className="mt-0.5 font-medium">{hotel.checkOut ?? 'Ask the front desk'}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
