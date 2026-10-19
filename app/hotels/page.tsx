import Breadcrumbs from '@/components/Breadcrumbs';
import HotelsBrowser, { type HotelSummary } from '@/components/HotelsBrowser';
import CallBand from '@/components/CallBand';
import Divider from '@/components/Divider';
import { hasBanquet, hasPool, isPlaceholder, portfolioLine, sortedHotels, varietyOrder, galleryFor } from '@/lib/hotels';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Hotels in Vijay Nagar, Indore',
  description: 'Compare Hotel Abhinandanam, The Grey Circle, the upcoming Pradesha and more. Rooms, pools, banquets and the best direct rate by phone or WhatsApp.',
  path: '/hotels/',
});

export default function HotelsPage() {
  const line = portfolioLine();
  const summaries: HotelSummary[] = sortedHotels.map((h) => {
    const photos = varietyOrder(galleryFor(h)).filter((g) => g.src !== h.cover);
    return {
      slug: h.slug,
      name: h.name,
      status: h.status,
      placeholder: isPlaceholder(h),
      stars: h.stars,
      place: h.area && h.area !== h.city ? `${h.area}, ${h.city}` : h.city,
      addressLine: h.address,
      cover: h.cover,
      thumbs: photos.slice(0, 4).map((g) => ({ src: g.src, alt: g.alt })),
      roomCount: h.rooms.length,
      amenities: [...h.highlights].slice(0, 4),
      hasPool: hasPool(h),
      hasBanquet: hasBanquet(h),
      phone: h.phones[0],
      isRender: !!h.gallery[0]?.isRender,
    };
  });

  return (
    <>
      <section className="container-page pb-16 pt-6">
        <Breadcrumbs items={[{ name: 'Hotels', href: '/hotels/' }]} />
        <div className="mt-6 max-w-2xl">
          <p className="eyebrow">Our hotels</p>
          <h1 className="h-display mt-3">
            <span className="text-ink">{line.count}</span> {line.place}
          </h1>
          <Divider className="mt-4" />
          <p className="mt-5 text-[17px] text-muted">Every hotel is bookable with one call or WhatsApp message. Talk to the front desk for rooms, availability and the best direct rate.</p>
        </div>
        <div className="mt-10">
          <HotelsBrowser hotels={summaries} />
        </div>
      </section>
      <CallBand />
    </>
  );
}
