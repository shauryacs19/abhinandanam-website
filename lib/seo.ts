import type { Metadata } from 'next';
import type { Hotel } from '@/data/hotels';
import { site } from '@/data/site';

export const abs = (path: string) => (path.startsWith('http') ? path : site.url + path);

/** Per-page metadata with canonical + OpenGraph image */
export function pageMeta({ title, description, path, image = '/images/og/home.jpg' }: { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { title, description, images: [image] },
  };
}

export function hotelOgImage(h: Hotel): string {
  return ['abhinandanam', 'the-grey-circle', 'pradesha'].includes(h.slug) ? `/images/og/${h.slug}.jpg` : '/images/og/home.jpg';
}

/** schema.org Hotel for rich results */
export function hotelJsonLd(h: Hotel) {
  const postal = h.address.match(/\b(\d{6})\b/)?.[1];
  const street = h.address.split(/,\s*(?:Indore)/)[0];
  const amenities = Array.from(new Set([...h.amenities.property, ...h.amenities.business, ...h.amenities.dining, ...h.amenities.room]));
  const images = (h.gallery.length ? h.gallery.slice(0, 8).map((g) => g.src) : [h.cover]).map(abs);
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    '@id': `${site.url}/hotels/${h.slug}/#hotel`,
    name: h.name,
    description: h.description,
    url: `${site.url}/hotels/${h.slug}/`,
    image: images,
    telephone: h.phones[0],
    email: h.email,
    address: {
      '@type': 'PostalAddress',
      ...(postal ? { streetAddress: street, postalCode: postal } : {}),
      addressLocality: h.city,
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
    ...(h.geo ? { geo: { '@type': 'GeoCoordinates', latitude: h.geo.lat, longitude: h.geo.lng } } : {}),
    ...(h.stars ? { starRating: { '@type': 'Rating', ratingValue: String(h.stars) } } : {}),
    ...(amenities.length
      ? { amenityFeature: amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })) }
      : {}),
    ...(h.checkIn ? { checkinTime: h.checkIn } : {}),
    ...(h.checkOut ? { checkoutTime: h.checkOut } : {}),
    parentOrganization: { '@type': 'Organization', name: site.legalName, url: site.url },
  };
}
