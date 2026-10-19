import Link from 'next/link';
import { ArrowRight, Building2, Mail, MessageCircle, Phone } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import Img from '@/components/Img';
import CallBand from '@/components/CallBand';
import Divider from '@/components/Divider';
import { sortedHotels } from '@/lib/hotels';
import { formatPhone, mailHref, waText, whatsappHref } from '@/lib/contact';
import { pageMeta } from '@/lib/seo';
import { site } from '@/data/site';

export const metadata = pageMeta({
  title: 'Banquets, weddings & conferences',
  description: 'Banquet halls in Vijay Nagar, Indore for celebrations, meetings and corporate events, plus a 250+ guest hall coming at Pradesha. Enquire by phone or WhatsApp.',
  path: '/banquets-events/',
  image: '/images/og/abhinandanam.jpg',
});

export default function BanquetsPage() {
  const venues = sortedHotels.filter((h) => h.banquet);
  const occasions = Array.from(new Set(venues.flatMap((h) => h.banquet!.useCases)));

  return (
    <>
      <section className="container-page pt-6">
        <Breadcrumbs items={[{ name: 'Banquets & events', href: '/banquets-events/' }]} />
        <div className="mt-6 max-w-3xl">
          <p className="eyebrow">Banquets & events</p>
          <h1 className="h-display mt-3">Celebrations, meetings and grand occasions</h1>
          <Divider className="mt-4" />
          <p className="mt-5 text-[17px] text-muted">
            From intimate celebrations and corporate gatherings to weddings for 250+ guests at the upcoming Pradesha. Tell us your date, guest count and occasion, and our sales team will call you back with options.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Occasions we host">
            {occasions.map((o) => (
              <li key={o} className="chip">
                {o}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappHref(waText.banquet())} data-track="banquets-hero" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
              <MessageCircle className="h-5 w-5" aria-hidden="true" /> Enquire on WhatsApp
            </a>
            <a href={`tel:${site.phones[0]}`} data-track="banquets-hero" className="btn-primary">
              <Phone className="h-5 w-5" aria-hidden="true" /> Call {formatPhone(site.phones[0])}
            </a>
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 py-16 sm:py-24">
        {venues.map((h, i) => {
          const b = h.banquet!;
          const soon = h.status === 'coming-soon';
          return (
            <article key={h.slug} className="reveal grid items-center gap-8 lg:grid-cols-2" aria-labelledby={`venue-${h.slug}`}>
              <div className={`grid grid-cols-2 gap-2 ${i % 2 ? 'lg:order-2' : ''}`}>
                {b.images.slice(0, 3).map((src, k) => (
                  <Img
                    key={src}
                    src={src}
                    alt={`Banquet hall at ${h.name}${soon ? " (artist's impression)" : ''}`}
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className={`w-full rounded-2xl object-cover ${k === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}
                  />
                ))}
              </div>
              <div>
                <p className="eyebrow">{soon ? 'Coming soon' : h.area}</p>
                <h2 id={`venue-${h.slug}`} className="h-section mt-2">
                  {h.name}
                </h2>
                <dl className="mt-6 flex gap-8">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.16em] text-muted">Capacity</dt>
                    <dd className="font-serif text-4xl font-semibold text-copper-dark">{b.capacityLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.16em] text-muted">Halls</dt>
                    <dd className="flex items-center gap-2 font-serif text-4xl font-semibold text-copper-dark">
                      <Building2 className="h-6 w-6" aria-hidden="true" /> {b.halls}
                    </dd>
                  </div>
                </dl>
                <p className="mt-6 text-[17px]">{b.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {b.useCases.map((u) => (
                    <li key={u} className="chip">
                      {u}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <a href={whatsappHref(waText.banquet(h), h.whatsapp)} data-track={`banquets:${h.slug}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> {soon ? 'Pre-book a date' : 'Enquire on WhatsApp'}
                  </a>
                  <a href={mailHref(site.emails.sales, `Banquet enquiry: ${h.name}`, 'Date:\nGuests:\nOccasion:\nName and phone:')} data-track={`banquets:${h.slug}`} className="btn-outline">
                    <Mail className="h-4 w-4" aria-hidden="true" /> Email sales
                  </a>
                  <Link href={`/hotels/${h.slug}/#banquets`} className="btn inline-flex text-copper-dark hover:underline">
                    Hotel details <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <CallBand title="Planning an event?" text="Share your date, guest count and occasion. Our sales team will help with halls, menus and rooms for your guests." whatsappText={waText.banquet()} />
    </>
  );
}
