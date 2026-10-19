import Breadcrumbs from '@/components/Breadcrumbs';
import HotelPhotoSection from '@/components/HotelPhotoSection';
import CallBand from '@/components/CallBand';
import Divider from '@/components/Divider';
import { isPlaceholder, sortedHotels } from '@/lib/hotels';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Photo gallery',
  description: 'Photos of each Abhinandanam Hospitality hotel in Indore: rooms and suites, the rooftop pool and restaurant, banquet halls and more.',
  path: '/gallery/',
});

/** One section per hotel, each with only its own photos (no mixed wall). */
export default function GalleryPage() {
  const withPhotos = sortedHotels.filter((h) => h.gallery.length);
  const comingSoon = sortedHotels.filter((h) => !h.gallery.length && isPlaceholder(h));

  return (
    <>
      <section className="container-page pb-16 pt-6">
        <Breadcrumbs items={[{ name: 'Gallery', href: '/gallery/' }]} />
        <div className="mt-6 max-w-2xl">
          <p className="eyebrow">Gallery</p>
          <h1 className="h-display mt-3">Discover elegance in every stay</h1>
          <Divider className="mt-4" />
          <p className="mt-5 text-[17px] text-muted">Each hotel on its own. Hover to pause, tap any photo to open it full screen.</p>
        </div>

        <nav aria-label="Jump to a hotel" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {withPhotos.map((h) => (
            <a key={h.slug} href={`#${h.slug}`} className="chip shrink-0 !py-2 font-semibold hover:border-copper-dark">
              {h.name} <span className="rounded-full bg-sand px-1.5 text-xs">{h.gallery.length}</span>
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-20">
          {withPhotos.map((h, i) => (
            <HotelPhotoSection key={h.slug} hotel={h} reverse={i % 2 === 1} />
          ))}
        </div>

        {comingSoon.length > 0 && (
          <p className="mt-16 rounded-2xl border border-dashed border-gold bg-sand/50 p-5 text-sm text-muted">
            Photos coming soon for {comingSoon.map((h) => h.name).join(', ')}.
          </p>
        )}
      </section>
      <CallBand />
    </>
  );
}
