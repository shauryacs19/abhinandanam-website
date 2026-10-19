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
};
