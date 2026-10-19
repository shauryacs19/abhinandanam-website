import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BedDouble, ChefHat, HeartHandshake, MapPin, Navigation, Phone, Star, Users } from 'lucide-react';
import Img from '@/components/Img';
import HotelArchCard from '@/components/HotelArchCard';
import SectionHeading from '@/components/SectionHeading';
import HotelPhotoSection from '@/components/HotelPhotoSection';
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
} from '@/lib/hotels';
import { directionsHref, formatPhone } from '@/lib/contact';

// Logo mark shown in the hero; the opening intro animates into it
const MARK = site.mark;

export const metadata: Metadata = {
  title: { absolute: 'Abhinandanam Hospitality | Hotels in Vijay Nagar, Indore' },
  description:
    'Hospitality Beyond Stays. Hotel Abhinandanam (rooftop pool, banquets), The Grey Circle and the upcoming 4-star Pradesha in Indore. Call +91 82258 22585 for the best direct rate.',
  alternates: { canonical: '/' },
  openGraph: { url: '/', images: [{ url: '/images/og/home.jpg', width: 1200, height: 630, alt: 'Hotel Abhinandanam at dusk' }] },
};

// Side photos in the hero (desktop). Paths must exist in a hotel's gallery.
const HERO_PHOTOS = {
  left: {
    big: { src: '/images/hotels/abhinandanam/abhinandanam-pool-1.webp', caption: 'Rooftop pool · Hotel Abhinandanam' },
    small: { src: '/images/hotels/abhinandanam/abhinandanam-lobby-1.webp' },
  },
  right: {
    big: { src: '/images/hotels/the-grey-circle/the-grey-circle-exterior-3.webp', caption: 'The Grey Circle · Vijay Nagar' },
    small: { src: '/images/hotels/abhinandanam/abhinandanam-rooms-6.webp' },
  },
};

type HeroPhoto = { src: string; caption?: string };

/** A tall arched photo with a small round one overlapping its outer corner (mirrored per side). */
function HeroPhotos({ side, big, small }: { side: 'left' | 'right'; big: HeroPhoto; small: HeroPhoto }) {
  const left = side === 'left';
  const alt = (src: string) => findGalleryItem(src)?.alt ?? '';
  return (
    <div className={`relative hidden h-[480px] lg:block ${left ? '' : 'lg:mt-24'}`}>
      <figure className={`absolute top-0 w-[min(13vw,230px)] ${left ? 'right-2 xl:right-10' : 'left-2 xl:left-10'}`}>
        <div className="relative">
          <div className="arch absolute inset-0 translate-x-2 translate-y-2 border border-gold" aria-hidden="true" />
          <div className="arch relative aspect-[3/4] overflow-hidden bg-sand shadow-lift">
            <Img src={big.src} alt={alt(big.src)} sizes="(min-width: 1024px) 230px, 1px" className="h-full w-full object-cover" />
          </div>
          {/* round photo overlaps the arch's outer bottom corner (wide screens only) */}
          <div className={`absolute -bottom-6 hidden w-[62%] xl:block ${left ? '-left-[30%]' : '-right-[30%]'}`}>
            <div className="aspect-square overflow-hidden rounded-full border-4 border-cream bg-sand shadow-lift">
              <Img src={small.src} alt={alt(small.src)} sizes="(min-width: 1280px) 145px, 1px" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        {big.caption && <figcaption className="mt-4 text-center text-xs font-medium tracking-wide text-muted xl:mt-10">{big.caption}</figcaption>}
      </figure>
    </div>
  );
}

const why = [
  { icon: BedDouble, title: 'Premium Stays', text: 'From well-appointed rooms to spacious suites, every stay is designed around your comfort.' },
  { icon: HeartHandshake, title: 'Authentic Hospitality', text: 'Warm, personal service. Every stay is more than a room; it is an experience.' },
  { icon: ChefHat, title: 'Multi-cuisine Dining', text: 'Multi-cuisine menus, in-room dining and a rooftop restaurant beside the pool.' },
  { icon: Users, title: 'Banquets & Events', text: 'Halls for celebrations and corporate gatherings, with a 250+ guest hall coming at Pradesha.' },
];

export default function HomePage() {
  const line = portfolioLine();
  const [taglineFirst, ...taglineRestWords] = site.tagline.split(' ');
  const taglineRest = taglineRestWords.join(' ');
  const flagship = getHotel('abhinandanam')!;

  const experiences = [
    {
      title: 'Stay',
      text: `${roomCategoryCount} room categories across our hotels, from value Standard rooms to Executive Suites.`,
      href: '/hotels/',
      cta: 'Find your room',
      img: '/images/hotels/abhinandanam/abhinandanam-rooms-6.webp',
      alt: 'Executive Suite at Hotel Abhinandanam',
    },
    {
      title: 'Dine',
      text: 'Rooftop dining under the open sky, multi-cuisine menus and in-room dining at Hotel Abhinandanam.',
      href: '/hotels/abhinandanam/#dining',
      cta: 'See the rooftop',
      img: '/images/hotels/abhinandanam/abhinandanam-dining-2.webp',
      alt: 'Rooftop restaurant at Hotel Abhinandanam',
    },
    {
      title: 'Celebrate',
      text: 'Banquet halls for intimate celebrations, meetings and corporate gatherings. Weddings for 250+ coming soon.',
      href: '/banquets-events/',
      cta: 'Plan an event',
      img: '/images/hotels/abhinandanam/abhinandanam-events-3.webp',
      alt: 'Banquet hall set for a celebration',
    },
    {
      title: 'Explore',
      text: "Stay in Vijay Nagar, one of Indore's most vibrant areas, with restaurants, cafes and shopping nearby.",
      href: '#location',
      cta: 'See the location',
      img: '/images/hotels/the-grey-circle/the-grey-circle-exterior-1.webp',
      alt: 'The Grey Circle in Vijay Nagar, Indore',
    },
  ];

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

      {/* 1. Hero: logo-led, no photo. The opening intro's logo flies into #hero-logo (components/IntroSplash.tsx). */}
      <section className="hero-glow relative isolate overflow-hidden border-b border-gold/50" aria-labelledby="hero-title">
        <div className="mx-auto grid max-w-[1440px] items-center px-4 sm:px-6 lg:grid-cols-[1fr_minmax(0,660px)_1fr] lg:gap-6 lg:px-8">
        {/* Photos fill the sides on desktop only: hidden + lazy on phones, so they cost nothing there */}
        <HeroPhotos side="left" big={HERO_PHOTOS.left.big} small={HERO_PHOTOS.left.small} />
        <div className="flex flex-col items-center pb-14 pt-10 text-center sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
          <img
            id="hero-logo"
            src={MARK}
            width={498}
            height={492}
            alt="Abhinandanam Hospitality logo"
            fetchPriority="high"
            className="hero-logo h-auto w-[124px] sm:w-[150px] lg:w-[170px]"
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-copper-dark">Abhinandanam Hospitality · Indore</p>
          {/* Brochure-cover lockup: spaced copper capitals + italic second line */}
          <h1 id="hero-title" className="mt-5 font-serif">
            <span className="hero-title-main block">{taglineFirst}</span>{' '}
            <span className="hero-title-sub mt-2 block">{taglineRest}</span>
          </h1>
          <Divider className="mt-5" />
          <p className="mt-5 max-w-xl text-lg text-muted sm:text-xl">
            {hotels.length} hotels · one vision · rooted in Indore, Madhya Pradesh
          </p>
          <p className="mt-2 font-serif text-xl text-copper-dark">{site.values.join(' · ')}</p>
          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <a href={`tel:${site.phones[0]}`} data-track="hero" className="btn-primary text-base">
              <Phone className="h-5 w-5" aria-hidden="true" /> Call to Book · {formatPhone(site.phones[0])}
            </a>
            <Link href="/hotels/" className="btn-outline text-base">
              Explore Hotels <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted" aria-label="Why guests choose us">
            <li className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-copper-dark text-copper-dark" aria-hidden="true" /> {site.stats.satisfaction}% customer satisfaction
            </li>
            <li>{site.stats.loyaltyClients.toLocaleString('en-IN')}+ loyalty guests</li>
            <li className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-copper-dark" aria-hidden="true" /> Vijay Nagar, Indore
            </li>
          </ul>
        </div>
        <HeroPhotos side="right" big={HERO_PHOTOS.right.big} small={HERO_PHOTOS.right.small} />
        </div>
      </section>

      {/* 2. Our hotels */}
      <section className="section" aria-labelledby="our-hotels">
        <div className="container-page">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="eyebrow">Our hotels</p>
            <h2 id="our-hotels" className="h-section mt-3">
              <span className="text-ink">{line.count}</span> {line.place}
            </h2>
            <p className="mt-4 text-[17px] text-muted">Distinct experiences, one vision. Each stay is designed around comfort, elegance and warm hospitality.</p>
          </div>
          <div className="mt-14 grid gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {featuredHotels.map((h) => (
              <HotelArchCard key={h.slug} hotel={h} />
            ))}
          </div>
          {hotels.length > featuredHotels.length && (
            <p className="mt-14 text-center">
              <Link href="/hotels/" className="btn-outline">
                View all {hotels.length} hotels <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* 3. Why stay with us */}
      <section className="section bg-sand" aria-labelledby="why-us">
        <div className="container-page">
          <SectionHeading id="why-us" eyebrow="Why stay with us" title="More than a room, an experience" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {why.map(({ icon: Icon, title, text }) => (
              <li key={title} className="reveal rounded-2xl border border-gold/50 bg-cream p-6">
                <Icon className="h-8 w-8 text-copper-dark" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-[15px] text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Photos, one strip per hotel (each opens that hotel's own lightbox) */}
      <section className="section" aria-labelledby="photos">
        <div className="container-page">
          <div className="reveal flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Take a look inside</p>
              <h2 id="photos" className="h-section mt-3">
                Discover elegance in every stay
              </h2>
            </div>
            <Link href="/gallery/" className="link shrink-0">
              Open the gallery →
            </Link>
          </div>
          <div className="mt-10 space-y-14">
            {featuredHotels.map((h, i) => (
              <HotelPhotoSection key={h.slug} hotel={h} limit={10} headingLevel="h3" reverse={i % 2 === 1} size="md" />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Experiences */}
      <section className="section bg-sand" aria-labelledby="experiences">
        <div className="container-page">
          <SectionHeading id="experiences" eyebrow="Stay · Dine · Celebrate · Explore" title="Let's create extraordinary experiences together" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {experiences.map((e) => (
              <article key={e.title} className="reveal group relative overflow-hidden rounded-3xl bg-ink">
                <Img src={e.img} alt={e.alt} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <h3 className="font-serif text-4xl font-semibold">{e.title}</h3>
                  <p className="mt-2 max-w-md text-white/90">{e.text}</p>
                  <Link href={e.href} className="mt-4 inline-flex items-center gap-1 font-semibold text-gold after:absolute after:inset-0 hover:underline">
                    {e.cta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Stats */}
      <section className="bg-ink py-14 text-cream" aria-label="Abhinandanam in numbers">
        <dl className="container-page grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[
            { value: site.stats.loyaltyClients, suffix: '+', label: 'Registered loyalty clients' },
            { value: site.stats.satisfaction, suffix: '%', label: 'Customer satisfaction' },
            { value: operatingCount, suffix: comingSoonCount ? ` + ${comingSoonCount}` : '', label: comingSoonCount ? 'Hotels open + coming soon' : 'Hotels' },
            { value: roomCategoryCount, suffix: '', label: 'Room categories' },
          ].map((s) => (
            <div key={s.label} className="reveal flex flex-col-reverse">
              <dt className="mt-2 text-sm uppercase tracking-[0.16em] text-cream/75">{s.label}</dt>
              <dd className="font-serif text-5xl font-semibold text-gold sm:text-6xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 7. Location */}
      <section id="location" className="section" aria-labelledby="location-title">
        <div className="container-page grid items-start gap-10 lg:grid-cols-2">
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

      {/* 8. Guest reviews: hidden until data/reviews.ts has REAL quotes (TODO: client) */}
      {reviews.length > 0 && (
        <section className="section bg-sand" aria-labelledby="reviews">
          <div className="container-page">
            <SectionHeading id="reviews" eyebrow="Guest reviews" title="What our guests say" />
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {reviews.map((r) => (
                <li key={r.quote} className="reveal rounded-2xl border border-gold/50 bg-cream p-6">
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

      {/* 9. Final CTA */}
      <CallBand />
    </>
  );
}
