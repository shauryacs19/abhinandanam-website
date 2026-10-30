import { site } from '@/data/site';
import type { Hotel } from '@/data/hotels';

/** "+918225822585" -> "+91 82258 22585" */
export function formatPhone(e164: string): string {
  const m = e164.match(/^\+91(\d{5})(\d{5})$/);
  return m ? `+91 ${m[1]} ${m[2]}` : e164;
}

export const telHref = (e164: string) => `tel:${e164}`;

export function whatsappHref(text: string, number: string = site.whatsapp): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function mailHref(email: string, subject?: string, body?: string): string {
  const q = new URLSearchParams();
  if (subject) q.set('subject', subject);
  if (body) q.set('body', body);
  const qs = q.toString().replace(/\+/g, '%20');
  return `mailto:${email}${qs ? `?${qs}` : ''}`;
}

export function directionsHref(h: Hotel): string | undefined {
  if (h.geo) return `https://www.google.com/maps/dir/?api=1&destination=${h.geo.lat},${h.geo.lng}`;
  return undefined;
}

// Context-aware WhatsApp messages
export const waText = {
  general: 'Hi, I would like to enquire about a stay with Abhinandanam Hospitality.',
  hotel: (h: Hotel) =>
    h.status === 'coming-soon'
      ? `Hi, I would like to pre-book / get notified about ${h.name}.`
      : `Hi, I would like to enquire about a stay at ${h.name}.`,
  room: (room: string, h: Hotel) => `Hi, I'd like to enquire about the ${room} at ${h.name}.`,
  banquet: (h?: Hotel) => `Hi, I would like to enquire about a banquet / event${h ? ` at ${h.name}` : ''}.`,
  availability: ({ hotel, checkIn, checkOut, guests, rooms, soon }: AvailabilityRequest) => {
    const lines = [soon ? `Hi, I'd like to pre-book a stay at ${hotel}.` : `Hi, I'd like to check availability at ${hotel}.`];
    if (checkIn && checkOut) {
      const nights = Math.round((localDate(checkOut).getTime() - localDate(checkIn).getTime()) / 86_400_000);
      lines.push(`Check-in: ${formatDay(checkIn)}`, `Check-out: ${formatDay(checkOut)} (${nights} night${nights === 1 ? '' : 's'})`);
    } else if (checkIn) {
      lines.push(`Check-in: ${formatDay(checkIn)}`);
    } else {
      lines.push('Dates: flexible');
    }
    lines.push(`Guests: ${guests} · Rooms: ${rooms}`);
    return lines.join('\n');
  },
};

export type AvailabilityRequest = { hotel: string; checkIn?: string; checkOut?: string; guests: number; rooms: number; soon?: boolean };

/** "2026-11-14" (from <input type="date">) as a local date, not UTC midnight */
const localDate = (iso: string) => new Date(`${iso}T00:00:00`);
/** "2026-11-14" -> "Sat, 14 Nov 2026" */
function formatDay(iso: string): string {
  const d = localDate(iso);
  const part = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-GB', o);
  return `${part({ weekday: 'short' })}, ${part({ day: 'numeric', month: 'short', year: 'numeric' })}`;
}
