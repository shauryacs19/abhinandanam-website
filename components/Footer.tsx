import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { sortedHotels } from '@/lib/hotels';
import { formatPhone, mailHref } from '@/lib/contact';
import SocialIcons from './SocialIcons';

export default function Footer() {
  return (
    <footer className="bg-deep text-ink">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <img src={site.logoWhite} width={900} height={882} alt="Abhinandanam Hospitality Pvt. Ltd." loading="lazy" className="h-auto w-40" />
          <p className="mt-4 max-w-xs text-sm text-ink/80">{site.description}</p>
          <SocialIcons className="mt-6" />
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brass">Hotels</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {sortedHotels.map((h) => (
              <li key={h.slug}>
                <Link href={`/hotels/${h.slug}/`} className="text-ink/85 hover:text-white hover:underline">
                  {h.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brass">Explore</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ['/hotels/', 'All hotels'],
              ['/banquets-events/', 'Banquets & events'],
              ['/gallery/', 'Gallery'],
              ['/about/', 'About us'],
              ['/contact/', 'Contact'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-ink/85 hover:text-white hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-brass">Reservations</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={`tel:${site.phones[0]}`} data-track="footer" className="flex items-center gap-2 text-lg font-semibold text-white hover:underline">
                <Phone className="h-4 w-4 text-brass" aria-hidden="true" /> Call to book
              </a>
            </li>
            {[site.emails.info, site.emails.sales].map((e) => (
              <li key={e}>
                <a href={mailHref(e)} data-track="footer" className="flex items-center gap-2 text-ink/85 hover:text-white hover:underline">
                  <Mail className="h-4 w-4 text-brass" aria-hidden="true" /> {e}
                </a>
              </li>
            ))}
            <li className="flex gap-2 text-ink/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
              <span>{site.headOffice.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ink/70 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName} All rights reserved.
          </p>
          <p>Book direct with the hotel, by phone or WhatsApp.</p>
        </div>
      </div>
    </footer>
  );
}
