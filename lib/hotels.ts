import { hotels, type GalleryCategory, type GalleryImage, type Hotel } from '@/data/hotels';

export { hotels };

/** Featured first (in file order), then the rest */
export const sortedHotels = [...hotels].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
export const featuredHotels = hotels.filter((h) => h.featured);

export function getHotel(slug: string): Hotel | undefined {
  return hotels.find((h) => h.slug === slug);
}

export function otherHotels(slug: string, limit = 3): Hotel[] {
  return sortedHotels.filter((h) => h.slug !== slug).slice(0, limit);
}

export const isPlaceholder = (h: Hotel) => h.content === 'placeholder';
export const hasPool = (h: Hotel) => [...h.amenities.property, ...h.highlights].some((a) => /pool/i.test(a));
export const hasBanquet = (h: Hotel) => !!h.banquet;

export const cities = Array.from(new Set(hotels.map((h) => h.city)));
export const operatingCount = hotels.filter((h) => h.status === 'operating').length;
export const comingSoonCount = hotels.filter((h) => h.status === 'coming-soon').length;
export const roomCategoryCount = hotels.reduce((n, h) => n + h.rooms.length, 0);

/** "9 hotels in Indore" / "9 hotels across 3 cities" */
export function portfolioLine(): { count: string; place: string } {
  return {
    count: `${hotels.length} hotel${hotels.length === 1 ? '' : 's'}`,
    place: cities.length === 1 ? `in ${cities[0]}` : `across ${cities.length} cities`,
  };
}

export type GalleryItem = GalleryImage & { hotelSlug: string; hotelName: string };

export function galleryFor(hotel: Hotel): GalleryItem[] {
  return hotel.gallery.map((g) => ({ ...g, hotelSlug: hotel.slug, hotelName: hotel.name }));
}

export const allGallery: GalleryItem[] = sortedHotels.flatMap(galleryFor);

const varietyCategories: GalleryCategory[] = ['exterior', 'rooms', 'pool', 'lobby', 'dining', 'events'];

/** Round-robin across categories so the first few photos show a bit of everything. */
export function varietyOrder<T extends { category: GalleryCategory }>(items: T[]): T[] {
  const queues = varietyCategories.map((c) => items.filter((i) => i.category === c));
  const out: T[] = [];
  while (queues.some((q) => q.length)) queues.forEach((q) => q.length && out.push(q.shift()!));
  return out;
}

export function findGalleryItem(src: string): GalleryItem | undefined {
  return allGallery.find((g) => g.src === src);
}

export const categoryLabels: Record<GalleryCategory, string> = {
  exterior: 'Exterior',
  lobby: 'Lobby & Spaces',
  rooms: 'Rooms',
  dining: 'Dining',
  pool: 'Pool',
  events: 'Events',
};

export function starsLabel(h: Hotel): string | null {
  return h.stars ? `${h.stars}-star` : null;
}
