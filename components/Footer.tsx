import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { sortedHotels } from '@/lib/hotels';
import { formatPhone, mailHref } from '@/lib/contact';
import SocialIcons from './SocialIcons';

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <p className="font-serif text-3xl font-semibold">Abhinandanam</p>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-gold">Hospitality · {site.motto}</p>
          <p className="mt-4 max-w-xs text-sm text-cream/80">{site.description}</p>
          <SocialIcons className="mt-6" />
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">Hotels</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {sortedHotels.map((h) => (
              <li key={h.slug}>
                <Link href={`/hotels/${h.slug}/`} className="text-cream/85 hover:text-white hover:underline">
                  {h.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ['/hotels/', 'All hotels'],
              ['/banquets-events/', 'Banquets & events'],
              ['/gallery/', 'Gallery'],
              ['/about/', 'About us'],
              ['/contact/', 'Contact'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-cream/85 hover:text-white hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">Reservations</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {site.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p}`} data-track="footer" className="flex items-center gap-2 text-lg font-semibold text-white hover:underline">
                  <Phone className="h-4 w-4 text-gold" aria-hidden="true" /> {formatPhone(p)}
                </a>
              </li>
            ))}
            {[site.emails.info, site.emails.sales].map((e) => (
              <li key={e}>
                <a href={mailHref(e)} data-track="footer" className="flex items-center gap-2 text-cream/85 hover:text-white hover:underline">
                  <Mail className="h-4 w-4 text-gold" aria-hidden="true" /> {e}
                </a>
              </li>
            ))}
            <li className="flex gap-2 text-cream/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>{site.headOffice.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-cream/70 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName} All rights reserved.
          </p>
          <p>Best rates when you book direct, by phone or WhatsApp.</p>
        </div>
      </div>
    </footer>
  );
}
