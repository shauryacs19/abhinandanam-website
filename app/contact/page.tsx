import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import Divider from '@/components/Divider';
import MapEmbed from '@/components/MapEmbed';
import CopyButton from '@/components/CopyButton';
import EnquiryComposer from '@/components/EnquiryComposer';
import SocialIcons from '@/components/SocialIcons';
import { isPlaceholder, sortedHotels } from '@/lib/hotels';
import { directionsHref, formatPhone, mailHref, waText, whatsappHref } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';
import { site } from '@/data/site';

export const metadata = pageMeta({
  title: 'Contact & reservations',
  description: `Call, WhatsApp or email ${site.emails.info}. Addresses and maps for every Abhinandanam hotel in Indore.`,
  path: '/contact/',
});

export default function ContactPage() {
  const detailed = sortedHotels.filter((h) => !isPlaceholder(h));
  const others = sortedHotels.filter(isPlaceholder);

  return (
    <>
      <section className="container-page pt-6">
        <Breadcrumbs items={[{ name: 'Contact', href: '/contact/' }]} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <p className="eyebrow">Reservations</p>
            <h1 className="h-display mt-3">Talk to us directly</h1>
            <Divider className="mt-4" />
            <p className="mt-5 text-[17px] text-muted">The fastest way to book is a call. Our team will help with rooms, availability, events and rates.</p>

            <ul className="mt-8 space-y-3" aria-label="Phone numbers">
              {site.phones.map((p, i) => (
                <li key={p}>
                  <a href={`tel:${p}`} data-track="contact-list" className="flex items-center justify-between gap-4 rounded-lg border border-gold/15 bg-sand p-5 hover:border-brass">
                    <span className="flex items-center gap-3 font-serif text-3xl font-semibold">
                      <Phone className="h-6 w-6 text-brass" aria-hidden="true" />
                      {i === 0 ? 'Call reservations' : 'Call our sales team'}
                    </span>
                    <span className="hidden text-sm font-semibold text-brass sm:block">Tap to call</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={whatsappHref(waText.general)} data-track="contact-list" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg bg-teal-dark p-5 text-lg font-semibold text-white hover:bg-[#1b5249]">
                  <MessageCircle className="h-6 w-6" aria-hidden="true" /> Chat on WhatsApp
                </a>
              </li>
            </ul>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">General enquiries</dt>
                <dd className="mt-1">
                  <a href={mailHref(site.emails.info)} className="link inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" aria-hidden="true" /> {site.emails.info}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Sales, groups & events</dt>
                <dd className="mt-1">
                  <a href={mailHref(site.emails.sales)} className="link inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4" aria-hidden="true" /> {site.emails.sales}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-8 text-ink">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Follow us</p>
              <SocialIcons className="mt-3 [&_a]:border-gold [&_a]:text-brass [&_a:hover]:bg-sand" />
            </div>
          </div>
          <EnquiryComposer hotels={sortedHotels.map((h) => ({ slug: h.slug, name: h.name }))} whatsappNumber={site.whatsapp} email={site.emails.info} />
        </div>
      </section>

      <section className="section" aria-labelledby="hotels-contact">
        <div className="container-page">
          <h2 id="hotels-contact" className="h-section">
            Our hotels
          </h2>
          <Divider className="mt-3" />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {detailed.map((h) => (
              <article key={h.slug} className="reveal flex flex-col overflow-hidden rounded-xl border border-gold/25 bg-sand" aria-labelledby={`c-${h.slug}`}>
                {h.mapEmbedUrl ? (
                  <MapEmbed src={h.mapEmbedUrl} title={`Map showing ${h.name}`} className="h-[220px] rounded-none border-0 border-b" />
                ) : (
                  <div className="grid h-[220px] place-items-center border-b border-gold/25 bg-sand/70 text-sm text-muted">Map coming soon</div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 id={`c-${h.slug}`} className="text-3xl font-semibold">
                    <Link href={`/hotels/${h.slug}/`} className="hover:text-brass">
                      {h.name}
                    </Link>
                  </h3>
                  {h.status === 'coming-soon' && <p className="mt-1 text-sm font-semibold text-brass">Coming soon: pre-book now</p>}
                  <p className="mt-3 flex items-start gap-2 text-[15px]">
                    <MapPin className="mt-1 h-4 w-4 shrink-0 text-brass" aria-hidden="true" /> {h.address}
                  </p>
                  <ul className="mt-3 space-y-1">
                    <li>
                      <a href={`tel:${h.phones[0]}`} data-track={`contact:${h.slug}`} className="inline-flex items-center gap-2 font-semibold hover:text-brass">
                        <Phone className="h-4 w-4 text-brass" aria-hidden="true" /> Call the hotel
                      </a>
                    </li>
                    <li>
                      <a href={mailHref(h.email, `Enquiry: ${h.name}`)} className="inline-flex items-center gap-2 break-all text-[15px] hover:text-brass">
                        <Mail className="h-4 w-4 shrink-0 text-brass" aria-hidden="true" /> {h.email}
                      </a>
                    </li>
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    {directionsHref(h) && (
                      <a href={directionsHref(h)} data-track={`contact-directions:${h.slug}`} target="_blank" rel="noopener noreferrer" className="btn-primary !min-h-[44px] !px-4 text-sm">
                        <Navigation className="h-4 w-4" aria-hidden="true" /> Directions
                      </a>
                    )}
                    {h.geo && <CopyButton text={`${h.name}, ${h.address}`} />}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {others.length > 0 && (
            <div className="reveal mt-10 rounded-xl border border-dashed border-gold/30 bg-sand/50 p-6">
              <h3 className="text-2xl font-semibold">More hotels</h3>
              <p className="mt-1 text-sm text-muted">Call central reservations for any of these hotels.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {others.map((h) => (
                  <li key={h.slug}>
                    <Link href={`/hotels/${h.slug}/`} className="chip hover:border-brass">
                      {h.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
