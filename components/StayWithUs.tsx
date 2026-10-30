import Link from 'next/link';
import { BedDouble, ChefHat, HeartHandshake, Users } from 'lucide-react';
import Img from './Img';
import { sortedHotels } from '@/lib/hotels';
import type { Hotel } from '@/data/hotels';
import Doodle from './Doodle';

const A = '/images/hotels/abhinandanam/abhinandanam';
const G = '/images/hotels/the-grey-circle/the-grey-circle';

// One line each (client, 2026-10-30: the old four cards took a whole band for very little text)
const why = [
  { icon: BedDouble, title: 'Premium stays', text: 'Well-appointed rooms to spacious suites.' },
  { icon: HeartHandshake, title: 'Authentic hospitality', text: 'Warm, personal service at every stay.' },
  { icon: ChefHat, title: 'Multi-cuisine dining', text: 'In-room dining and a rooftop restaurant.' },
  { icon: Users, title: 'Banquets & events', text: 'Halls for every occasion; 400+ guests at Pradesha.' },
];

/** Splits "Hotel Awadhvue" / "The Grand Euro" into a small eyebrow word and the main name. */
function nameParts(name: string): { pre?: string; main: string } {
  const m = name.match(/^(Hotel|The)\s+(.+)$/);
  return m ? { pre: m[1], main: m[2] } : { main: name };
}

/** A hotel's own logo when we have one; otherwise a typeset name lockup (TODO: real logos from the client). */
function Mark({ hotel }: { hotel: Hotel }) {
  if (hotel.logo) {
    return <Img src={hotel.logo} alt={hotel.name} sizes="140px" className="max-h-[56px] w-auto max-w-[130px] object-contain" />;
  }
  const { pre, main } = nameParts(hotel.name);
  return (
    <span className="flex flex-col items-center leading-none text-ink">
      {/* empty line when there is no "Hotel" / "The", so every name sits on the same baseline */}
      <span className={`font-sans text-[9px] font-semibold uppercase tracking-[0.32em] text-brass ${pre ? '' : 'invisible'}`} aria-hidden={!pre}>
        {pre ?? 'Hotel'}
      </span>
      <span className="mt-1 text-center font-serif text-xl font-semibold tracking-[0.02em]">{main}</span>
    </span>
  );
}

/**
 * Home: "Why stay with us" and the hotels not already shown in "Our hotels" (a 3 x 2 name grid,
 * Hilton "Ways to stay" pattern), together in one forest band beside two Drive photos.
 */
export default function StayWithUs() {
  const others = sortedHotels.filter((h) => !h.featured);
  return (
    <section className="relative overflow-hidden bg-deep py-16 text-ink sm:py-24" aria-labelledby="why-us">
      <Doodle name="chandelier" className="absolute -right-8 -top-6 w-56 sm:w-80 lg:right-[3%]" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Photos: a tall one with a smaller one overlapping its corner (desktop) */}
        <div className="reveal relative lg:col-span-5">
          <Img
            src={`${A}-lobby-new-6.webp`}
            alt="Lobby lounge under a crystal chandelier at Hotel Abhinandanam"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/5] w-full rounded-md object-cover sm:aspect-[4/3] lg:aspect-[4/5]"
          />
          <div className="absolute -bottom-10 -right-8 hidden w-[46%] overflow-hidden rounded-md border-[6px] border-deep shadow-lift lg:block">
            <Img src={`${G}-rooms-suite-6.webp`} alt="Jacuzzi in a dark marble suite bathroom at The Grey Circle" sizes="240px" className="aspect-square w-full object-cover" />
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <div className="reveal">
            <p className="eyebrow">Why stay with us</p>
            <h2 id="why-us" className="h-section mt-3">
              More than a room, an experience
            </h2>
          </div>
          <ul className="reveal mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {why.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brass" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3 className="font-serif text-xl font-semibold leading-tight">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          {others.length > 0 && (
            <div className="reveal mt-12 border-t border-gold/15 pt-8">
              <h3 id="ways-to-stay" className="font-serif text-2xl font-semibold">
                Ways to stay with Abhinandanam
              </h3>
              <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-gold/15 sm:grid-cols-3">
                {others.map((h) => (
                  <li key={h.slug}>
                    <Link href={`/hotels/${h.slug}/`} className="group relative flex h-24 items-center justify-center bg-deep px-3 transition-colors duration-200 hover:bg-sand">
                      <span className="transition-transform duration-200 group-hover:-translate-y-0.5">
                        <Mark hotel={h} />
                      </span>
                      {h.status === 'coming-soon' && (
                        <span className="absolute bottom-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brass">Coming soon</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
