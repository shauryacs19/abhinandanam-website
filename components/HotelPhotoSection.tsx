import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import PhotoTrain from './PhotoTrain';
import Stars from './Stars';
import type { Hotel } from '@/data/hotels';
import { categoryLabels, galleryFor, varietyOrder } from '@/lib/hotels';

type Props = {
  hotel: Hotel;
  /** max photos in the train (default: all) */
  limit?: number;
  headingLevel?: 'h2' | 'h3';
  /** alternate rows run the other way, like the Appstle marquee rows */
  reverse?: boolean;
  size?: 'md' | 'lg';
};

/** One hotel's photos only: heading + a moving photo train that opens that hotel's own lightbox. */
export default function HotelPhotoSection({ hotel, limit, headingLevel = 'h2', reverse = false, size = 'lg' }: Props) {
  const all = varietyOrder(galleryFor(hotel));
  const photos = all.slice(0, limit ?? all.length).map((g) => ({
    src: g.src,
    alt: g.alt,
    category: g.category,
    categoryLabel: categoryLabels[g.category],
    isRender: g.isRender,
  }));
  if (!photos.length) return null;
  const H = headingLevel;
  const place = hotel.area && hotel.area !== hotel.city ? `${hotel.area}, ${hotel.city}` : hotel.city;
  const renders = photos.some((p) => p.isRender);

  return (
    <section id={hotel.slug} aria-labelledby={`${hotel.slug}-photos`} className="reveal scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-brass">
            {hotel.stars && <Stars count={hotel.stars} />}
            {hotel.status === 'coming-soon' && (
              <span className="rounded-full bg-teal-dark px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">Coming soon</span>
            )}
          </div>
          <H id={`${hotel.slug}-photos`} className="mt-1 text-3xl font-semibold text-ink sm:text-4xl">
            {hotel.name}
          </H>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" aria-hidden="true" /> {place} · {all.length} photos{renders ? ' · artist’s impressions' : ''}
          </p>
        </div>
        <Link href={`/hotels/${hotel.slug}/`} className="link inline-flex items-center gap-1 text-sm">
          View hotel <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="mt-5">
        <PhotoTrain images={photos} title={`${hotel.name} photos`} reverse={reverse} size={size} />
      </div>
    </section>
  );
}
