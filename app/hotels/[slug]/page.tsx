import { notFound } from 'next/navigation';
import { Baby, BedSingle, Building2, Check, Clock, IdCard, MapPin, MessageCircle, Navigation, PawPrint, Phone, Plane, TrainFront, TramFront, Users, Mail, FileText } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import PhotoHeader from '@/components/PhotoHeader';
import SubNav from '@/components/SubNav';
import BookingCard from '@/components/BookingCard';
import AvailabilityBar from '@/components/AvailabilityBar';
import RoomCard from '@/components/RoomCard';
import ThumbGrid from '@/components/ThumbGrid';
import Img from '@/components/Img';
import MapEmbed from '@/components/MapEmbed';
import CopyButton from '@/components/CopyButton';
import HotelCard from '@/components/HotelCard';
import CallBand from '@/components/CallBand';
import JsonLd from '@/components/JsonLd';
import Stars from '@/components/Stars';
import Divider from '@/components/Divider';
import { categoryLabels, galleryFor, getHotel, hotels, isPlaceholder, otherHotels, varietyOrder } from '@/lib/hotels';
import { directionsHref, formatPhone, mailHref, waText, whatsappHref } from '@/lib/contact';
import { amenityIcon } from '@/lib/amenity-icons';
import { hotelJsonLd, hotelOgImage, pageMeta } from '@/lib/seo';
import { site } from '@/data/site';
import type { AmenityGroup, Hotel } from '@/data/hotels';
import type { LightboxImage } from '@/components/Lightbox';

export function generateStaticParams() {
  return hotels.map((h) => ({ slug: h.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const h = getHotel(params.slug);
  if (!h) return {};
  const where = h.area && h.area !== h.city ? `${h.area}, ${h.city}` : h.city;
  const kind = h.stars ? `${h.stars}-star hotel` : 'Hotel';
  const title = h.status === 'coming-soon' ? `${h.name}: upcoming ${kind} in ${where}` : `${h.name}: ${kind} in ${where}`;
  const description = `${h.tagline}. ${h.status === 'coming-soon' ? 'Pre-book' : 'Book direct'} by phone or WhatsApp.`;
  return pageMeta({ title, description, path: `/hotels/${h.slug}/`, image: hotelOgImage(h) });
}

const groupLabels: Record<AmenityGroup, string> = { room: 'In your room', property: 'At the hotel', business: 'Business & events', dining: 'Dining' };

function SectionTitle({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${id}-title`} className="h-section mt-2">
        {title}
      </h2>
      <Divider className="mt-3" />
    </div>
  );
}

export default function HotelPage({ params }: { params: { slug: string } }) {
  const hotel = getHotel(params.slug);
  if (!hotel) notFound();
  const h: Hotel = hotel;
  const soon = h.status === 'coming-soon';
  const placeholder = isPlaceholder(h);
  const where = h.area && h.area !== h.city ? `${h.area}, ${h.city}` : h.city;
  const directions = directionsHref(h);

  const photos: LightboxImage[] = varietyOrder(galleryFor(h)).map((g) => ({
    src: g.src,
    alt: g.alt,
    category: g.category,
    categoryLabel: categoryLabels[g.category],
    isRender: g.isRender,
  }));
  const amenityGroups = (Object.keys(groupLabels) as AmenityGroup[]).filter((k) => h.amenities[k].length);

  const sections = [
    { id: 'overview', label: 'Overview', show: true },
    { id: 'rooms', label: 'Rooms', show: h.rooms.length > 0 },
    { id: 'amenities', label: 'Amenities', show: amenityGroups.length > 0 },
    { id: 'dining', label: soon ? 'Pool' : 'Dining', show: !!h.dining?.length || (soon && h.amenities.property.some((a) => /pool/i.test(a))) },
    { id: 'banquets', label: 'Banquets', show: !!h.banquet },
    { id: 'location', label: 'Location', show: true },
    { id: 'gallery', label: 'Gallery', show: photos.length > 0 },
  ].filter((s) => s.show);

  return (
    <>
      <JsonLd data={hotelJsonLd(h)} />

      {/* Title + photos */}
      <div className="container-page pt-6">
        <Breadcrumbs items={[{ name: 'Hotels', href: '/hotels/' }, { name: h.name, href: `/hotels/${h.slug}/` }]} />
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {h.stars && (
                <span className="inline-flex items-center gap-1.5 text-brass">
                  <Stars count={h.stars} />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">{h.stars}-star</span>
                </span>
              )}
              {soon && <span className="rounded-full bg-teal-dark px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">Coming soon</span>}
            </div>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-ink sm:text-5xl">{h.name}</h1>
            <p className="mt-2 flex items-start gap-1.5 text-muted">
              <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /> {placeholder ? where : h.address}
            </p>
          </div>
          <a href={`tel:${h.phones[0]}`} data-track={`title:${h.slug}`} className="btn-primary hidden lg:inline-flex">
            <Phone className="h-4 w-4" aria-hidden="true" /> {soon ? 'Call to pre-book' : 'Call to book'}
          </a>
        </div>
        <div className="mt-6">
          {photos.length ? (
            <PhotoHeader images={photos} hotelName={h.name} />
          ) : (
            <div className="overflow-hidden rounded-xl">
              <Img src={h.cover} alt={`${h.name}: photos coming soon (placeholder)`} priority className="h-[240px] w-full bg-sand object-contain sm:h-[360px]" />
            </div>
          )}
        </div>
        {/* Open hotels: dates + guests -> WhatsApp. Coming soon: plain Call / WhatsApp (phones only; desktop uses the sticky card) */}
        {!soon ? (
          <AvailabilityBar
            hotels={[{ slug: h.slug, name: h.name, soon, phone: h.phones[0], whatsapp: h.whatsapp }]}
            fixedSlug={h.slug}
            trackLabel={h.slug}
            className="mx-auto mt-5 max-w-[920px]"
          />
        ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
          <a href={`tel:${h.phones[0]}`} data-track={`mobile-top:${h.slug}`} className="btn-primary">
            <Phone className="h-4 w-4" aria-hidden="true" /> {soon ? 'Pre-book' : 'Call'}
          </a>
          <a href={whatsappHref(waText.hotel(h), h.whatsapp)} data-track={`mobile-top:${h.slug}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
          </a>
        </div>
        )}
      </div>

      <div className="mt-8">
        <SubNav sections={sections.map(({ id, label }) => ({ id, label }))} />
      </div>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(220px,28%)] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-20">
          {/* Overview */}
          <section id="overview" aria-labelledby="overview-title">
            <SectionTitle id="overview" eyebrow={soon ? 'Opening soon' : 'Overview'} title={h.tagline} />
            <p className="reveal mt-6 text-[17px] leading-relaxed">{h.description}</p>
            {placeholder && (
              <div className="reveal mt-6 rounded-lg border border-dashed border-gold/30 bg-sand/60 p-5 text-sm">
                <p className="font-semibold">Full details for this hotel are being added.</p>
                <p className="mt-1 text-muted">Our reservations team can tell you about rooms, amenities, availability and rates right now.</p>
              </div>
            )}
            {soon && (
              <p className="reveal mt-4 text-sm text-muted">Images of Pradesha are artist&rsquo;s impressions of the finished hotel.</p>
            )}
            {h.highlights.length > 0 && (
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {h.highlights.slice(0, 4).map((x) => {
                  const Icon = amenityIcon(x);
                  return (
                    <li key={x} className="reveal flex flex-col items-start gap-3 rounded-lg border border-gold/25 bg-sand p-4">
                      <Icon className="h-7 w-7 text-brass" strokeWidth={1.5} aria-hidden="true" />
                      <span className="text-[15px] font-medium leading-snug">{x}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Rooms */}
          {h.rooms.length > 0 && (
            <section id="rooms" aria-labelledby="rooms-title">
              <SectionTitle id="rooms" eyebrow={`${h.rooms.length} room categories`} title="Rooms & suites" />
              <div className="mt-8 space-y-6">
                {h.rooms.map((r) => (
                  <RoomCard
                    key={r.name}
                    {...r}
                    isRender={soon}
                    comingSoon={soon}
                    phone={h.phones[0]}
                    whatsappHref={whatsappHref(soon ? `Hi, I'd like to pre-book the ${r.name} at ${h.name}.` : waText.room(r.name, h), h.whatsapp)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Amenities */}
          {amenityGroups.length > 0 && (
            <section id="amenities" aria-labelledby="amenities-title">
              <SectionTitle id="amenities" eyebrow="Amenities" title={soon ? 'Signature amenities' : 'Everything you need'} />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {amenityGroups.map((g) => (
                  <div key={g} className="reveal rounded-lg border border-gold/25 bg-sand p-6">
                    <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brass">{groupLabels[g]}</h3>
                    <ul className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                      {h.amenities[g].map((a) => {
                        const Icon = amenityIcon(a);
                        return (
                          <li key={a} className="flex items-start gap-2.5 text-[15px] leading-6">
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brass" strokeWidth={1.6} aria-hidden="true" />
                            {a}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Dining / rooftop & pool (or the coming-soon infinity pool) */}
          {h.dining?.length ? (
            <section id="dining" aria-labelledby="dining-title">
              <SectionTitle
                id="dining"
                eyebrow={h.dining.some((d) => /pool/i.test(d.title)) ? 'Dining · Rooftop & pool' : 'Dining · Rooftop'}
                title={h.dining.some((d) => /pool/i.test(d.title)) ? 'Rooftop restaurant with pool' : 'Dining on the rooftop'}
              />
              <div className="mt-8 space-y-12">
                {h.dining.map((d, i) => (
                  <article key={d.title} className="reveal grid items-center gap-6 md:grid-cols-2">
                    <div className={`grid grid-cols-2 gap-2 ${i % 2 ? 'md:order-2' : ''}`}>
                      {d.images.length === 2 ? (
                        d.images.map((src) => (
                          <Img key={src} src={src} alt={`${d.title} at ${h.name}`} sizes="(min-width: 768px) 15vw, 50vw" className="aspect-[4/5] w-full rounded-lg object-cover" />
                        ))
                      ) : (
                        <>
                          <Img src={d.images[0]} alt={`${d.title} at ${h.name}`} sizes="(min-width: 768px) 30vw, 100vw" className="col-span-2 aspect-[16/10] w-full rounded-lg object-cover" />
                          {d.images.slice(1, 3).map((src) => (
                            <Img key={src} src={src} alt={`${d.title} at ${h.name}`} sizes="(min-width: 768px) 15vw, 50vw" className="aspect-square w-full rounded-lg object-cover" />
                          ))}
                        </>
                      )}
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold">{d.title}</h3>
                      <p className="mt-3 text-muted">{d.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : soon && sections.some((s) => s.id === 'dining') ? (
            <section id="dining" aria-labelledby="dining-title">
              <SectionTitle id="dining" eyebrow="Coming with Pradesha" title="Infinity pool & cafeteria" />
              <div className="reveal mt-8 grid items-center gap-6 md:grid-cols-2">
                {/* TODO: infinity pool render from the client */}
                <Img src="/images/placeholder-amenity.webp" alt="Infinity pool: render coming soon (placeholder)" sizes="(min-width: 768px) 30vw, 100vw" className="aspect-[16/10] w-full rounded-lg object-cover" />
                <p className="text-[17px] text-muted">
                  Pradesha brings an infinity pool, a cafeteria, a gym and premium rooms with jacuzzi to Indore. Call us to be the first to know when bookings open.
                </p>
              </div>
            </section>
          ) : null}

          {/* Banquets */}
          {h.banquet && (
            <section id="banquets" aria-labelledby="banquets-title">
              <SectionTitle id="banquets" eyebrow="Banquets & events" title={soon ? 'Where grand celebrations come to life' : 'Celebrate and meet in style'} />
              <div className="reveal mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <div className="rounded-xl bg-deep p-7 text-ink">
                  {h.banquet.capacity ? (
                    <>
                      {!soon && <p className="text-sm uppercase tracking-[0.16em] text-ink/75">Up to</p>}
                      <p className="font-serif text-6xl font-semibold leading-none text-brass">
                        {h.banquet.capacity}
                        {soon ? '+' : ''}
                      </p>
                      <p className="mt-2 text-sm uppercase tracking-[0.16em] text-ink/75">Guests</p>
                    </>
                  ) : (
                    <>
                      <p className="font-serif text-4xl font-semibold text-brass">{h.banquet.capacityLabel}</p>
                      <p className="mt-1 text-sm uppercase tracking-[0.16em] text-ink/75">Set-ups for your guest count</p>
                    </>
                  )}
                  <p className="mt-5 flex items-center gap-2 text-ink/90">
                    <Building2 className="h-5 w-5 text-brass" aria-hidden="true" /> {h.banquet.halls} banquet hall{h.banquet.halls > 1 ? 's' : ''}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {h.banquet.useCases.map((u) => (
                      <li key={u} className="rounded-full border border-white/25 px-3 py-1 text-[13px]">
                        {u}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 grid gap-2">
                    <a href={whatsappHref(waText.banquet(h), h.whatsapp)} data-track={`banquet:${h.slug}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                      <MessageCircle className="h-4 w-4" aria-hidden="true" /> Enquire on WhatsApp
                    </a>
                    <a href={`tel:${h.phones[0]}`} data-track={`banquet:${h.slug}`} className="btn-ghost-light">
                      <Phone className="h-4 w-4" aria-hidden="true" /> Call to enquire
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-[17px]">{h.banquet.description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {h.banquet.images.slice(0, 4).map((src, i) => (
                      <Img key={src} src={src} alt={`Banquet hall at ${h.name}${soon ? " (artist's impression)" : ''}`} sizes="(min-width: 768px) 20vw, 50vw" className={`w-full rounded-lg object-cover ${h.banquet!.images.length === 1 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'} ${i === 0 && h.banquet!.images.length === 3 ? 'col-span-2' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Location */}
          <section id="location" aria-labelledby="location-title">
            <SectionTitle id="location" eyebrow="Location" title={soon ? 'Location to be announced' : `Find us in ${where}`} />
            <div className="reveal mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              {h.mapEmbedUrl ? (
                <div className="relative">
                  <MapEmbed src={h.mapEmbedUrl} title={h.geo || !soon ? `Map showing ${h.name}` : `Map of ${h.city}, where ${h.name} is coming up`} className="h-[340px]" />
                  {soon && !h.geo && (
                    <p className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl bg-deep/85 px-4 py-2.5 text-sm text-ink">
                      <MapPin className="h-4 w-4 shrink-0 text-brass" aria-hidden="true" /> Coming up in {h.city}. Exact location to be announced.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid h-[260px] place-items-center rounded-lg border border-dashed border-gold/30 bg-sand/60 p-6 text-center text-muted">
                  <p>
                    <MapPin className="mx-auto mb-2 h-6 w-6 text-brass" aria-hidden="true" />
                    Exact address and map coming soon.
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Address</p>
                <address className="mt-2 text-[17px] not-italic">{h.address}</address>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!placeholder && !soon && <CopyButton text={`${h.name}, ${h.address}`} />}
                  {directions && (
                    <a href={directions} data-track={`directions:${h.slug}`} target="_blank" rel="noopener noreferrer" className="btn-primary !min-h-[44px] !px-4 text-sm">
                      <Navigation className="h-4 w-4" aria-hidden="true" /> Get directions
                    </a>
                  )}
                </div>
                {h.connectivity && (
                  <ul className="mt-6 grid grid-cols-3 gap-2 text-center">
                    {[
                      { icon: Plane, label: 'Airport', v: h.connectivity.airport },
                      { icon: TrainFront, label: 'Railway', v: h.connectivity.railway },
                      { icon: TramFront, label: 'Metro', v: h.connectivity.metro },
                    ].map(({ icon: Icon, label, v }) => (
                      <li key={label} className="rounded-lg border border-gold/25 bg-sand px-2 py-4">
                        <Icon className="mx-auto h-5 w-5 text-brass" aria-hidden="true" />
                        <p className="mt-2 font-serif text-3xl font-semibold">{v}</p>
                        <p className="text-xs text-muted">min to {label.toLowerCase()}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Policies (client fills these in) */}
          {!soon && (
            <section id="policies" aria-labelledby="policies-title">
              <SectionTitle id="policies" eyebrow="Good to know" title="Hotel policies" />
              <dl className="reveal mt-8 grid gap-px overflow-hidden rounded-lg border border-gold/25 bg-gold/40 sm:grid-cols-2">
                {[
                  { icon: Clock, label: 'Check-in', value: h.checkIn },
                  { icon: Clock, label: 'Check-out', value: h.checkOut },
                  { icon: IdCard, label: 'ID proof', value: h.policies?.idProof },
                  { icon: PawPrint, label: 'Pets', value: h.policies?.pets },
                  { icon: BedSingle, label: 'Extra bed', value: h.policies?.extraBed },
                  { icon: Baby, label: 'Infants', value: h.policies?.children },
                  { icon: FileText, label: 'Cancellation', value: h.policies?.cancellation },
                  { icon: Users, label: 'Group & event bookings', value: 'Call or email our sales team' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-cream p-5">
                    <dt className="flex items-center gap-2.5 font-semibold">
                      <Icon className="h-5 w-5 shrink-0 text-brass" aria-hidden="true" /> {label}
                    </dt>
                    {/* TODO: cancellation text from the client */}
                    <dd className="mt-0.5 pl-[30px] text-sm text-muted">{value ?? 'Confirm when you book'}</dd>
                  </div>
                ))}
              </dl>
              {h.rules?.length ? (
                <div className="reveal mt-6 rounded-lg border border-gold/25 bg-sand p-6">
                  <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brass">House rules</h3>
                  <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {h.rules.map((r) => (
                      <li key={r} className="flex items-start gap-2.5 text-[15px]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          )}

          {/* Gallery */}
          {photos.length > 0 && (
            <section id="gallery" aria-labelledby="gallery-title">
              <SectionTitle id="gallery" eyebrow={`${photos.length} photos`} title="Gallery" />
              <div className="reveal mt-8">
                <ThumbGrid images={photos} title={`${h.name} photos`} />
              </div>
            </section>
          )}
        </div>

        {/* Sticky booking card (desktop) */}
        <aside className="hidden lg:block" aria-label={`Book ${h.name}`}>
          <div className="sticky top-[calc(var(--header-h)+64px)]">
            <BookingCard hotel={h} />
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Groups & events:{' '}
              <a href={mailHref(site.emails.sales, `Group / event enquiry: ${h.name}`)} className="link">
                {site.emails.sales}
              </a>
            </p>
          </div>
        </aside>
      </div>

      {/* Other hotels */}
      <section className="section border-t border-gold/20 bg-sand" aria-labelledby="other-hotels">
        <div className="container-page">
          <div className="reveal text-center">
            <p className="eyebrow">Also from Abhinandanam</p>
            <h2 id="other-hotels" className="h-section mt-3">
              Other hotels you may like
            </h2>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {otherHotels(h.slug).map((o) => (
              <HotelCard key={o.slug} hotel={o} />
            ))}
          </div>
        </div>
      </section>

      <CallBand
        title={soon ? 'Be the first to stay' : `Stay at ${h.name}`}
        eyebrow={soon ? 'Pre-book / get notified' : 'Book direct with the hotel'}
        phones={h.phones}
        whatsappText={waText.hotel(h)}
      />
    </>
  );
}
