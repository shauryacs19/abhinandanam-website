'use client';

import { useState } from 'react';
import { BedDouble, ChevronLeft, ChevronRight, MessageCircle, Phone, Ruler, Users } from 'lucide-react';
import Img from './Img';
import { amenityIcon } from '@/lib/amenity-icons';
import { roomAnchor } from '@/lib/anchors';

type Props = {
  name: string;
  description: string;
  occupancy?: string;
  sizeSqft?: number;
  bed?: string;
  images: string[];
  amenities: string[];
  isRender?: boolean;
  phone: string;
  whatsappHref: string;
  comingSoon?: boolean;
};

/** One room category: manual-arrow photo carousel + facts + call / WhatsApp. */
export default function RoomCard({ name, description, occupancy, sizeSqft, bed, images, amenities, isRender, phone, whatsappHref, comingSoon }: Props) {
  const photos = images.length ? images : ['/images/placeholder-room.webp'];
  const [i, setI] = useState(0);
  const go = (d: number) => setI((n) => (n + d + photos.length) % photos.length);

  return (
    <article id={roomAnchor(name)} className="reveal grid overflow-hidden rounded-xl border border-gold/25 bg-sand md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="relative aspect-[3/2] bg-sand md:aspect-auto md:min-h-[300px]" role="group" aria-roledescription="carousel" aria-label={`${name} photos`}>
        <Img
          key={photos[i]}
          src={photos[i]}
          alt={images.length ? `${name}, photo ${i + 1} of ${photos.length}` : `${name}: photo coming soon`}
          sizes="(min-width: 768px) 45vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {isRender && images.length > 0 && <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">Artist&rsquo;s impression</span>}
        {photos.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 shadow-card hover:bg-sand" aria-label={`Previous ${name} photo`}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 shadow-card hover:bg-sand" aria-label={`Next ${name} photo`}>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs tabular-nums text-white" aria-live="polite">
              {i + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col p-6 sm:p-8">
        <h3 className="text-3xl font-semibold">{name}</h3>
        <p className="mt-2 text-muted">{description}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 text-muted">
              <Users className="h-4 w-4 shrink-0 text-brass" aria-hidden="true" /> Occupancy
            </dt>
            {/* TODO: occupancy per room from the client */}
            <dd className="pl-[22px] font-medium">{occupancy ?? 'On request'}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted">
              <Ruler className="h-4 w-4 shrink-0 text-brass" aria-hidden="true" /> Room size
            </dt>
            {/* TODO: room size (sq ft) from the client; never estimated */}
            <dd className="pl-[22px] font-medium">{sizeSqft ? `${sizeSqft} sq ft` : 'On request'}</dd>
          </div>
          {bed && (
            <div>
              <dt className="flex items-center gap-1.5 text-muted">
                <BedDouble className="h-4 w-4 shrink-0 text-brass" aria-hidden="true" /> Bed
              </dt>
              <dd className="pl-[22px] font-medium">{bed}</dd>
            </div>
          )}
        </dl>
        {amenities.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${name} amenities`}>
            {amenities.map((a) => {
              const Icon = amenityIcon(a);
              return (
                <li key={a} className="chip !text-[12px]">
                  <Icon className="h-3.5 w-3.5 text-brass" aria-hidden="true" />
                  {a}
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-auto grid gap-2 pt-6">
          <a href={`tel:${phone}`} data-track={`room:${name}`} className="btn-primary !whitespace-normal text-center">
            <Phone className="h-4 w-4" aria-hidden="true" /> {comingSoon ? 'Call to pre-book' : 'Call to book this room'}
          </a>
          <a href={whatsappHref} data-track={`room:${name}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp !whitespace-normal text-center">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> {comingSoon ? 'WhatsApp to pre-book' : 'Ask on WhatsApp'}
          </a>
        </div>
      </div>
    </article>
  );
}
