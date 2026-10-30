import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Navigation, Phone } from 'lucide-react';
import HotelPanels from '@/components/HotelPanels';
import PanelSnap from '@/components/PanelSnap';
import SectionHeading from '@/components/SectionHeading';
import StayWithUs from '@/components/StayWithUs';
import AvailabilityBar from '@/components/AvailabilityBar';
import HeroSlideshow, { type HeroSlide } from '@/components/HeroSlideshow';
import FindYourStay from '@/components/FindYourStay';
import CountUp from '@/components/CountUp';
import MapEmbed from '@/components/MapEmbed';
import ConnectivityTable from '@/components/ConnectivityTable';
import CallBand from '@/components/CallBand';
import JsonLd from '@/components/JsonLd';
import Divider from '@/components/Divider';
import { site } from '@/data/site';
import { reviews } from '@/data/reviews';
import {
  comingSoonCount,
  featuredHotels,
  findGalleryItem,
  getHotel,
  hotels,
  operatingCount,
  portfolioLine,
  roomCategoryCount,
  sortedHotels,
} from '@/lib/hotels';
import { directionsHref } from '@/lib/contact';
import Doodle from '@/components/Doodle';

export const metadata: Metadata = {
  title: { absolute: 'Abhinandanam Hospitality | Hotels in Vijay Nagar, Indore' },
  description:
    'Hotel Abhinandanam (rooftop pool, banquets), The Grey Circle and the upcoming 4-star Pradesha in Vijay Nagar, Indore. Call or WhatsApp to book direct.',
  alternates: { canonical: '/' },
  openGraph: { url: '/', images: [{ url: '/images/og/home.jpg', width: 1200, height: 630, alt: 'Hotel Abhinandanam at dusk' }] },
};

// "Our hotels" panels: the one best photo per hotel (picked from the client's Drive, 2026-10-30)
const PANEL_PHOTOS: Record<string, string> = {
  abhinandanam: '/images/hotels/abhinandanam/abhinandanam-exterior-night-3.webp', // lit entrance at night (the white pool tent was too bright)
  'the-grey-circle': '/images/hotels/the-grey-circle/the-grey-circle-rooms-suite-5.webp', // suite in warm cove light
  pradesha: '/images/hotels/pradesha/pradesha-exterior-1.webp', // lit facade (artist's impression)
};

// Hero slideshow, in order (the first is the LCP image). Paths must exist in a hotel's gallery (alt text comes from there).
// Warm, low-light shots from the client's Drive so the slideshow sits in the dark theme.
const HERO_SLIDES: Omit<HeroSlide, 'alt'>[] = [
  { src: '/images/hotels/abhinandanam/abhinandanam-lobby-new-4.webp', caption: 'Lobby · Hotel Abhinandanam', href: '/hotels/abhinandanam/' },
  { src: '/images/hotels/abhinandanam/abhinandanam-rooms-exec-suite-1.webp', caption: 'Executive Suite · Hotel Abhinandanam', href: '/hotels/abhinandanam/#room-executive-suite' },
  { src: '/images/hotels/abhinandanam/abhinandanam-lobby-new-8.webp', caption: 'Chandelier · Hotel Abhinandanam', href: '/hotels/abhinandanam/' },
  { src: '/images/hotels/the-grey-circle/the-grey-circle-rooms-premium-1.webp', caption: 'Premium Room · The Grey Circle', href: '/hotels/the-grey-circle/#room-premium-room' },
  { src: '/images/hotels/abhinandanam/abhinandanam-lobby-new-5.webp', caption: 'Reception · Hotel Abhinandanam', href: '/hotels/abhinandanam/' },
];

// Photos already on screen above (hero + panels), so the occasion tiles further down never repeat them (client, 2026-10-30)
const SHOWN_ABOVE = [
  ...HERO_SLIDES.map((s) => s.src),
  ...Object.values(PANEL_PHOTOS),
];

export default function HomePage() {
  const line = portfolioLine();
  const flagship = getHotel('abhinandanam')!;
  const bookable = sortedHotels.map((h) => ({ slug: h.slug, name: h.name, soon: h.status === 'coming-soon', phone: h.phones[0], whatsapp: h.whatsapp }));
  const heroSlides = HERO_SLIDES.map((b) => ({ ...b, alt: findGalleryItem(b.src)?.alt ?? b.caption }));


  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: site.name,
          legalName: site.legalName,
          url: site.url,
          logo: site.url + site.logo,
          description: site.description,
          email: site.emails.info,
          telephone: site.phones[0],
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Plot No. 2, Ratanlok Colony, Scheme No. 53, Vijay Nagar',
            addressLocality: site.headOffice.locality,
            addressRegion: site.headOffice.region,
            postalCode: site.headOffice.postalCode,
            addressCountry: 'IN',
          },
          contactPoint: site.phones.map((p) => ({ '@type': 'ContactPoint', telephone: p, contactType: 'reservations', areaServed: 'IN' })),
          sameAs: Object.values(site.socials),
          subOrganization: hotels.filter((h) => h.content !== 'placeholder').map((h) => ({ '@type': 'Hotel', name: h.name, url: `${site.url}/hotels/${h.slug}/` })),
        }}
      />

      {/* 1. Hero: full-screen photo slideshow with the brand lockup on top (client request, 2026-10-25).
          The opening intro's logo flies into #hero-logo (components/IntroSplash.tsx). */}
      <HeroSlideshow slides={heroSlides} labelledBy="hero-title">
        <span className="relative block w-[190px] sm:w-[260px]">
          <img src={site.logoWhite} width={900} height={882} alt="Abhinandanam Hospitality Pvt. Ltd." className="hero-logo h-auto w-full" />
          {/* the intro's flying symbol lands on this box: the symbol's place inside the stacked logo (measured from the artwork) */}
          <span id="hero-logo" className="absolute left-[16.4%] top-[1.6%] aspect-[498/492] w-[67%]" aria-hidden="true" />
        </span>
        {/* No visible headline (client asked to drop the "Hospitality / Beyond Stays" lockup, 2026-10-30): the logo carries it */}
        <h1 id="hero-title" className="sr-only">
          Abhinandanam Hospitality: hotels in Vijay Nagar, Indore
        </h1>
        <Divider className="mt-6 !text-white/80" />
        <p className="mt-4 max-w-xl text-lg text-white/90 sm:text-xl">
          {hotels.length} hotels · one vision · rooted in Indore, Madhya Pradesh
        </p>
        <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a href={`tel:${site.phones[0]}`} data-track="hero" className="btn-primary text-base">
            <Phone className="h-5 w-5" aria-hidden="true" /> Call to Book
          </a>
          <Link href="/hotels/" className="btn-ghost-light text-base">
            Explore Hotels <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </HeroSlideshow>

      {/* 1b. Availability pill on the hero's bottom edge (opens WhatsApp, no booking engine yet) */}
      <div className="relative z-10 -mt-10 px-4 sm:-mt-12 sm:px-6 lg:px-8">
        <AvailabilityBar hotels={bookable} trackLabel="home" className="mx-auto max-w-[1120px]" />
      </div>

      {/* 2. Our hotels: heading + the group in numbers, then the 3 featured hotels as an edge-to-edge
          photo accordion, then (below Find your stay) the other 6 in StayWithUs. Stats moved up here from their own band (client, 2026-10-30). */}
      <section className="relative overflow-hidden pt-16 sm:pt-24" aria-labelledby="our-hotels">
        <Doodle name="arch" className="absolute -left-10 top-6 w-40 sm:w-48 lg:left-[1.5%] lg:w-52" />
        <Doodle name="rosette" className="absolute -right-16 top-24 w-52 sm:w-72 lg:right-[3%]" />
        <div className="container-page relative">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="eyebrow">Our hotels</p>
            <h2 id="our-hotels" className="h-section mt-3">
              <span className="text-ink">{line.count}</span> {line.place}
            </h2>
          </div>
          <dl data-snap-from className="reveal mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-y-8 text-center lg:grid-cols-4 lg:divide-x lg:divide-gold/20" aria-label="Abhinandanam in numbers">
            {[
              { value: site.stats.loyaltyClients, suffix: '+', label: 'Registered loyalty clients' },
              { value: site.stats.satisfaction, suffix: '%', label: 'Customer satisfaction' },
              { value: operatingCount, suffix: comingSoonCount ? ` + ${comingSoonCount}` : '', label: comingSoonCount ? 'Hotels open + coming soon' : 'Hotels' },
              { value: roomCategoryCount, suffix: '', label: 'Room categories' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col-reverse justify-end px-4">
                <dt className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{s.label}</dt>
                <dd className="font-serif text-4xl font-semibold text-brass sm:text-5xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-12 lg:mt-16">
          <HotelPanels hotels={featuredHotels} photos={PANEL_PHOTOS} />
          <PanelSnap />
        </div>
      </section>

      {/* 3. Find your stay: image-led occasion tiles deep-linking into hotel pages */}
      <FindYourStay exclude={SHOWN_ABOVE} />

      {/* 4. Why stay with us + the other 6 hotels, one forest band with photos */}
      <StayWithUs />

      {/* 5. Location */}
      <section id="location" className="section relative overflow-hidden" aria-labelledby="location-title">
        <Doodle name="paisley" className="absolute -left-20 bottom-4 w-56 -rotate-12 sm:w-72" />
        <div className="container-page relative grid items-start gap-10 lg:grid-cols-2">
          <div className="reveal min-w-0">
            <p className="eyebrow">Location</p>
            <h2 id="location-title" className="h-section mt-3">
              In the heart of Vijay Nagar
            </h2>
            <p className="mt-4 text-[17px] text-muted">
              Our hotels sit in Vijay Nagar, Indore&rsquo;s business and shopping hub, a short drive from the airport and railway station and minutes from the metro.
            </p>
            <div className="mt-8">
              <ConnectivityTable hotels={featuredHotels} caption="Approximate travel time by road, in minutes" />
            </div>
            <ul className="mt-6 space-y-3 text-sm">
              {featuredHotels
                .filter((h) => h.geo)
                .map((h) => (
                  <li key={h.slug} className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      <strong className="font-semibold">{h.name}:</strong> <span className="text-muted">{h.address}</span>
                    </span>
                    <a href={directionsHref(h)} data-track={`home-directions:${h.slug}`} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1">
                      <Navigation className="h-4 w-4" aria-hidden="true" /> Directions
                    </a>
                  </li>
                ))}
            </ul>
          </div>
          <MapEmbed className="reveal h-[420px] lg:h-full lg:min-h-[480px]" src={flagship.mapEmbedUrl!} title="Map of Hotel Abhinandanam in Vijay Nagar, Indore" />
        </div>
      </section>

      {/* 6. Guest reviews: hidden until data/reviews.ts has REAL quotes (TODO: client) */}
      {reviews.length > 0 && (
        <section className="section bg-sand" aria-labelledby="reviews">
          <div className="container-page">
            <SectionHeading id="reviews" eyebrow="Guest reviews" title="What our guests say" />
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {reviews.map((r) => (
                <li key={r.quote} className="reveal rounded-lg border border-gold/25 bg-cream p-6">
                  <blockquote className="font-serif text-xl leading-snug">&ldquo;{r.quote}&rdquo;</blockquote>
                  <p className="mt-4 text-sm text-muted">
                    {r.author} · {getHotel(r.hotelSlug)?.name} · via {r.source}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 7. Final CTA */}
      <CallBand />
    </>
  );
}
