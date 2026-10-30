'use client';

import { useState } from 'react';
import { Mail, MessageCircle } from 'lucide-react';

type Props = { hotels: { slug: string; name: string }[]; whatsappNumber: string; email: string };

/**
 * No backend: builds a WhatsApp or email message from the fields and opens it.
 * Nothing is stored or sent until the guest presses send in their own app.
 */
export default function EnquiryComposer({ hotels, whatsappNumber, email }: Props) {
  const [name, setName] = useState('');
  const [hotel, setHotel] = useState(hotels[0]?.name ?? '');
  const [kind, setKind] = useState('Room booking');
  const [message, setMessage] = useState('');

  const text = [`Hi, I'm ${name || '(your name)'}.`, `Enquiry: ${kind} at ${hotel}.`, message].filter(Boolean).join('\n');
  const wa = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  const mail = `mailto:${email}?subject=${encodeURIComponent(`${kind}: ${hotel}`)}&body=${encodeURIComponent(text)}`;

  const field = 'mt-1.5 w-full rounded-xl border border-gold/25 bg-cream px-4 py-3 text-[16px] outline-none focus:border-brass focus:ring-2 focus:ring-brass/30';

  return (
    <form className="rounded-xl border border-gold/15 bg-sand p-6 shadow-card sm:p-8" onSubmit={(e) => e.preventDefault()} aria-describedby="composer-note">
      <h2 className="font-serif text-3xl font-semibold">Send an enquiry</h2>
      <p id="composer-note" className="mt-1 text-sm text-muted">
        Opens WhatsApp or your email app with the message ready. You choose when to send.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Your name
          <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="text-sm font-medium">
          Hotel
          <select className={field} value={hotel} onChange={(e) => setHotel(e.target.value)}>
            {hotels.map((h) => (
              <option key={h.slug}>{h.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          I&rsquo;m asking about
          <select className={field} value={kind} onChange={(e) => setKind(e.target.value)}>
            {['Room booking', 'Banquet / event', 'Corporate stay', 'Something else'].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Message (dates, guests, questions)
          <textarea className={`${field} min-h-[110px]`} value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <a href={wa} target="_blank" rel="noopener noreferrer" data-track="composer" className="btn-whatsapp">
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> Send on WhatsApp
        </a>
        <a href={mail} data-track="composer" className="btn-outline">
          <Mail className="h-4 w-4" aria-hidden="true" /> Send by email
        </a>
      </div>
    </form>
  );
}
