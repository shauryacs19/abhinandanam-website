import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Img from './Img';
import { roomAnchor } from '@/lib/anchors';
import Doodle from './Doodle';

const A = '/images/hotels/abhinandanam/abhinandanam';
const G = '/images/hotels/the-grey-circle/the-grey-circle';

// Occasion tiles (Hilton "stays by type", Four Seasons journey categories). Each deep-links to the
// section or room card that answers it. Minimal, image-led (client, 2026-10-30): a title and a 2-3 word
// tag only; the facts behind the tags are on the hotel pages.
const occasions = [
  {
    title: 'Business trips',
    tag: 'Work-ready rooms',
    href: `/hotels/abhinandanam/#${roomAnchor('Corporate Executive')}`,
    img: `${A}-rooms-corporate-1.webp`,
    alt: 'Corporate Executive room with king bed and sofa',
    backup: { img: `${A}-rooms-corporate-2.webp`, alt: 'Corporate Executive room with desk and TV' },
  },
  {
    title: 'Family holidays',
    tag: 'Rooms for four',
    href: `/hotels/abhinandanam/#${roomAnchor('Family Room')}`,
    img: `${A}-rooms-family-1.webp`,
    alt: 'Family Room with two double beds',
  },
  {
    title: 'Weddings & celebrations',
    tag: 'Halls for 400+',
    href: '/banquets-events/',
    img: `${G}-events-hall-3.webp`,
    alt: 'Banquet hall with round tables and a backlit stone wall',
  },
  {
    title: 'Meetings & conferences',
    tag: 'Halls & projectors',
    href: '/hotels/the-grey-circle/#banquets',
    img: `${G}-events-conference-1.webp`,
    alt: 'Banquet hall set up for a conference with projector',
  },
  {
    title: 'Rooftop evenings',
    tag: 'Dinner by the pool',
    href: '/hotels/abhinandanam/#dining',
    img: `${A}-pool-new-2.webp`,
    alt: 'Rooftop pool beside the restaurant tables',
    backup: { img: `${G}-rooftop-1.webp`, alt: 'Rooftop booth seating over Vijay Nagar at The Grey Circle' },
  },
  {
    title: 'Suites & special stays',
    tag: 'Lounge & jacuzzi',
    href: `/hotels/abhinandanam/#${roomAnchor('Executive Suite')}`,
    img: `${A}-rooms-exec-suite-2.webp`,
    alt: 'Executive Suite lounge with curved sofa',
    backup: { img: `${A}-rooms-exec-suite-3.webp`, alt: 'Executive Suite bed facing a city-view window' },
  },
];

/** Each tile's photo: its own, or its backup when the own one is already shown higher up the page. */
function pick(exclude: string[]) {
  return occasions.map((o) => (o.backup && exclude.includes(o.img) ? { ...o, ...o.backup } : o));
}

/** `exclude`: photos already shown higher up the page; a tile whose photo is in it uses its backup photo. */
export default function FindYourStay({ exclude = [] }: { exclude?: string[] }) {
  return (
    // data-snap-back: scrolling up from here glides back to the hotel panels (PanelSnap)
    <section data-snap-back className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="find-your-stay">
      <Doodle name="lotus" className="absolute -right-10 top-4 w-56 sm:w-80 lg:right-[2%]" />
      <Doodle name="paisley" className="absolute -left-14 top-10 w-32 rotate-[200deg] sm:w-44" />
      <div className="container-page relative">
        <div className="reveal text-center">
          <p className="eyebrow">Find your stay</p>
          <h2 id="find-your-stay" className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
            What brings you to Indore?
          </h2>
        </div>
        {/* Phones: a swipeable row that peeks the next tile. sm+: a 3 x 2 grid of tall photos. */}
        <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {pick(exclude).map((o) => (
            <li key={o.title} className="reveal w-[78%] shrink-0 snap-start sm:w-auto">
              <Link href={o.href} className="group relative block overflow-hidden rounded-md bg-sand">
                <Img
                  src={o.img}
                  alt={o.alt}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 78vw"
                  className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-brass">{o.tag}</span>
                    <span className="mt-1 block font-serif text-2xl font-semibold leading-tight">{o.title}</span>
                  </span>
                  <ArrowRight className="mb-1 h-4 w-4 shrink-0 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
