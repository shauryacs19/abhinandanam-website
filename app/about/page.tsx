import { BedDouble, Gem, HeartHandshake, TrendingUp } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import Img from '@/components/Img';
import HotelArchCard from '@/components/HotelArchCard';
import CallBand from '@/components/CallBand';
import CountUp from '@/components/CountUp';
import Divider from '@/components/Divider';
import SectionHeading from '@/components/SectionHeading';
import { comingSoonCount, featuredHotels, operatingCount, roomCategoryCount } from '@/lib/hotels';
import { pageMeta } from '@/lib/seo';
import { site } from '@/data/site';

export const metadata = pageMeta({
  title: 'About us',
  description: 'Abhinandanam Hospitality is a growing hospitality group rooted in Indore, Madhya Pradesh, creating welcoming, memorable and contemporary stays.',
  path: '/about/',
});

const pillars = [
  { icon: BedDouble, title: 'Premium Stays', text: 'Well-appointed rooms and spacious suites, designed around comfort and convenience.' },
  { icon: HeartHandshake, title: 'Authentic Hospitality', text: 'Warm, attentive service for leisure travellers and business professionals alike.' },
  { icon: TrendingUp, title: 'Growing Presence', text: 'A growing portfolio across Madhya Pradesh and beyond, with Pradesha opening soon.' },
  { icon: Gem, title: 'Memorable Experiences', text: 'Exceptional service and amenities that make a stay more than a room.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page pt-6">
        <Breadcrumbs items={[{ name: 'About', href: '/about/' }]} />
        <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Who we are</p>
            <h1 className="h-display mt-3">Rooted in Indore. Growing with a vision.</h1>
            <Divider className="mt-4" />
            <p className="mt-6 text-[17px]">{site.description}</p>
            <p className="mt-4 text-[17px] text-muted">
              With two operating 3- and 4-star hotels, The Grey Circle and Hotel Abhinandanam, and a new 4-star property, Pradesha by Abhinandanam, on the horizon, the group continues to expand its presence while staying committed to service, comfort and authentic hospitality.
            </p>
            <p className="mt-6 font-serif text-2xl font-semibold text-copper-dark">{site.values.join(' · ')}</p>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="arch absolute inset-0 translate-x-3 translate-y-3 border border-gold" aria-hidden="true" />
            <div className="arch relative aspect-[4/5] overflow-hidden shadow-lift">
              <Img src="/images/hotels/abhinandanam/abhinandanam-lobby-1.webp" alt="Lobby of Hotel Abhinandanam" priority sizes="(min-width: 1024px) 448px, 90vw" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="why-title">
        <div className="container-page">
          <SectionHeading id="why-title" eyebrow="Why you choose us" title="Every stay is more than a room" intro="At Abhinandanam Hospitality, we believe every stay is an experience. With a growing portfolio of hotels and a commitment to quality, comfort and warm service, we create stays that guests remember." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(({ icon: Icon, title, text }) => (
              <li key={title} className="reveal rounded-2xl border border-gold/50 bg-white/60 p-6">
                <Icon className="h-8 w-8 text-copper-dark" strokeWidth={1.5} aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-semibold">{title}</h2>
                <p className="mt-2 text-[15px] text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink py-14 text-cream" aria-label="Abhinandanam in numbers">
        <dl className="container-page grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[
            { value: site.stats.loyaltyClients, suffix: '+', label: 'Registered loyalty clients' },
            { value: site.stats.satisfaction, suffix: '%', label: 'Customer satisfaction' },
            { value: operatingCount, suffix: comingSoonCount ? ` + ${comingSoonCount}` : '', label: 'Hotels open + coming soon' },
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

      <section className="section" aria-labelledby="vision-title">
        <div className="container-page">
          <SectionHeading id="vision-title" eyebrow="Our vision" title={site.oneVision} intro="Style and hospitality for leisure travellers and business professionals, with exceptional service, thoughtful amenities and the warmth of Indore." />
          <div className="mt-14 grid gap-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {featuredHotels.map((h) => (
              <HotelArchCard key={h.slug} hotel={h} />
            ))}
          </div>
        </div>
      </section>

      <CallBand />
    </>
  );
}
