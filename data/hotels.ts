// ─────────────────────────────────────────────────────────────────────────────
// Every page on the site renders from this file.
//
// ADD A HOTEL:
//   1. Put its photos in public/images/hotels/<slug>/ named <slug>-<category>-<n>.jpg
//      and run `npm run images` (makes WebP + 800px versions, records sizes).
//   2. Copy one entry below, change the slug and content, point images at the new files.
//   3. `npm run build`. The hotel gets its page, nav link, listing card, gallery
//      photos, sitemap entry and JSON-LD automatically.
//
// Source of truth: the brochures in assets/source/. Anything unknown is left empty
// or marked TODO. Never invent prices, ratings, reviews or room sizes.
// ─────────────────────────────────────────────────────────────────────────────

export type GalleryCategory = 'exterior' | 'lobby' | 'rooms' | 'dining' | 'pool' | 'events';

export type GalleryImage = {
  src: string;
  alt: string;
  category: GalleryCategory;
  /** 3D render / artist's impression, not a photo of the finished building */
  isRender?: boolean;
};

export type RoomCategory = {
  name: string;
  description: string;
  occupancy?: string; // TODO per room: e.g. "2 adults + 1 child"
  sizeSqft?: number; // TODO per room: from the client, never estimated
  images: string[];
  amenities: string[];
};

export type AmenityGroup = 'room' | 'property' | 'business' | 'dining';

export type Hotel = {
  slug: string;
  name: string;
  status: 'operating' | 'coming-soon';
  /** 'placeholder' = listed on the old website but no content supplied yet */
  content?: 'complete' | 'placeholder';
  /** Shown on the home page "Our Hotels" strip and first in menus */
  featured?: boolean;
  stars?: 3 | 4 | 5;
  tagline: string;
  description: string;
  city: string;
  area: string;
  address: string;
  /** Optional: never guess coordinates */
  geo?: { lat: number; lng: number };
  mapEmbedUrl?: string;
  phones: string[]; // E.164, first = front desk
  whatsapp: string; // digits only, with country code
  email: string;
  connectivity?: { airport: number; railway: number; metro: number }; // minutes
  highlights: string[];
  amenities: Record<AmenityGroup, string[]>;
  rooms: RoomCategory[];
  banquet?: {
    halls: number;
    capacity: number;
    capacityLabel: string;
    description: string;
    useCases: string[];
    images: string[];
  };
  dining?: { title: string; description: string; images: string[] }[];
  cover: string;
  logo?: string;
  gallery: GalleryImage[];
  checkIn?: string; // TODO: e.g. "12:00 PM"
  checkOut?: string; // TODO: e.g. "11:00 AM"
  policies?: { idProof?: string; pets?: string; cancellation?: string };
};

const GROUP_PHONES = ['+918225822585', '+919009929213'];
const GROUP_WHATSAPP = '918225822585'; // TODO: confirm WhatsApp Business number

const img = (slug: string, name: string) => `/images/hotels/${slug}/${slug}-${name}.webp`;
const embed = (q: string) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;

// Listed in every operating room (brief: in-room amenities for all operating hotels)
const IN_ROOM = [
  'High-speed Wi-Fi',
  'Air conditioning',
  'Satellite TV',
  'Minibar',
  'Tea / coffee maker',
  'In-room safe',
  'Work desk',
  'Smart room key',
  'Shower',
  'Bathrobe',
  'Grooming kit',
  'Wardrobe',
  'Do Not Disturb',
];
const ROOM_CARD_AMENITIES = ['High-speed Wi-Fi', 'Air conditioning', 'Satellite TV', 'Tea / coffee maker'];

const A = 'abhinandanam';
const G = 'the-grey-circle';
const P = 'pradesha';

export const hotels: Hotel[] = [
  // ── Hotel Abhinandanam (flagship) ───────────────────────────────────────────
  {
    slug: A,
    name: 'Hotel Abhinandanam',
    status: 'operating',
    content: 'complete',
    featured: true,
    stars: 4, // brochure: "two operating 3 & 4 star properties" (Grey Circle = 3)
    tagline: 'Modern comfort with traditional hospitality',
    description:
      'Hotel Abhinandanam offers a perfect blend of modern comfort and traditional hospitality. Located in the heart of Vijay Nagar, it is a short distance from the airport and railway station, with restaurants, cafes and shopping centres nearby, making it a relaxing, memorable stay for business and leisure travellers alike.',
    city: 'Indore',
    area: 'Vijay Nagar',
    address: 'Plot No. 2, Ratanlok Colony, Scheme No. 53, Vijay Nagar, Indore, Madhya Pradesh 452010',
    geo: { lat: 22.7496662, lng: 75.8997584 }, // Google Maps place "Hotel Abhinandanam"
    mapEmbedUrl: embed('Hotel Abhinandanam, Ratanlok Colony, Vijay Nagar, Indore'),
    phones: GROUP_PHONES,
    whatsapp: GROUP_WHATSAPP,
    email: 'info@abhinandanam.in',
    connectivity: { airport: 20, railway: 15, metro: 5 },
    highlights: ['Rooftop restaurant & pool', '2 banquet halls', 'Suites with jacuzzi', 'Multi-cuisine dining', 'Conference rooms', 'Fitness centre'],
    amenities: {
      room: IN_ROOM,
      property: ['Rooftop swimming pool', 'Fitness centre', 'Parking', 'Laundry service', 'Suites with jacuzzi', 'High-speed Wi-Fi'],
      business: ['Conference & meeting rooms', '2 banquet halls (up to 100 guests)', 'High-speed Wi-Fi'],
      dining: ['Rooftop restaurant', 'Multi-cuisine dining', 'In-room dining'],
    },
    rooms: [
      { name: 'Standard Room', description: 'A comfortable and value-for-money stay with modern amenities.', images: [img(A, 'rooms-1')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Executive Room', description: 'Perfect for business and leisure travellers seeking extra comfort.', images: [img(A, 'rooms-2')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Corporate Executive', description: 'Ideal for business travellers, with enhanced space and modern facilities.', images: [img(A, 'rooms-3')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Family Room', description: 'A spacious and comfortable stay for families.', images: [img(A, 'rooms-4')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Suite', description: 'A luxurious stay with exclusive amenities.', images: [img(A, 'rooms-5'), img(A, 'rooms-7')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Executive Suite', description: 'An expanded space with premium comfort and elegance.', images: [img(A, 'rooms-6'), img(A, 'rooms-8')], amenities: ROOM_CARD_AMENITIES },
    ],
    banquet: {
      halls: 2,
      capacity: 100,
      capacityLabel: 'Up to 100 guests',
      description:
        'A thoughtfully designed space for intimate celebrations, corporate gatherings, meetings and special occasions. With a comfortable ambience and modern facilities, our banquet halls create the perfect setting for memorable moments.',
      useCases: ['Intimate celebrations', 'Corporate gatherings', 'Meetings & conferences', 'Special occasions'],
      images: [img(A, 'events-3'), img(A, 'events-2'), img(A, 'events-1'), img(A, 'events-4'), img(A, 'events-5')],
    },
    dining: [
      {
        title: 'Rooftop Dining',
        description:
          'Savour delightful cuisine with an elevated ambience at our rooftop dining space. Perfect for relaxed evenings, intimate dinners and memorable gatherings under the open sky.',
        images: [img(A, 'dining-2'), img(A, 'dining-1'), img(A, 'dining-3')],
      },
      {
        title: 'Swimming Pool',
        description:
          'Take a refreshing break and unwind by the pool. Designed for relaxation, our rooftop pool offers a serene setting to cool off, recharge and enjoy your stay.',
        images: [img(A, 'pool-1'), img(A, 'pool-2')],
      },
    ],
    cover: img(A, 'exterior-1'),
    gallery: [
      { src: img(A, 'exterior-1'), alt: 'Hotel Abhinandanam facade lit up at dusk', category: 'exterior' },
      { src: img(A, 'exterior-2'), alt: 'Hotel Abhinandanam entrance and facade by day', category: 'exterior' },
      { src: img(A, 'exterior-3'), alt: 'Covered entrance steps at Hotel Abhinandanam', category: 'exterior' },
      { src: img(A, 'exterior-4'), alt: 'Landscaped entrance to Hotel Abhinandanam at night', category: 'exterior' },
      { src: img(A, 'lobby-1'), alt: 'Lobby with chandelier, marble floor and reception desk', category: 'lobby' },
      { src: img(A, 'lobby-2'), alt: 'Crystal chandelier above the lobby', category: 'lobby' },
      { src: img(A, 'lobby-3'), alt: 'Lounge seating area', category: 'lobby' },
      { src: img(A, 'lobby-4'), alt: 'Guest corridor', category: 'lobby' },
      { src: img(A, 'rooms-6'), alt: 'Executive Suite bedroom with glass partition', category: 'rooms' },
      { src: img(A, 'rooms-5'), alt: 'Suite bedroom', category: 'rooms' },
      { src: img(A, 'rooms-3'), alt: 'Corporate Executive room with sofa seating', category: 'rooms' },
      { src: img(A, 'rooms-1'), alt: 'Standard Room with king bed', category: 'rooms' },
      { src: img(A, 'rooms-2'), alt: 'Executive Room with twin beds', category: 'rooms' },
      { src: img(A, 'rooms-4'), alt: 'Family Room with two beds', category: 'rooms' },
      { src: img(A, 'rooms-7'), alt: 'Jacuzzi in a suite bathroom', category: 'rooms' },
      { src: img(A, 'rooms-8'), alt: 'Executive Suite bed with gold runner', category: 'rooms' },
      { src: img(A, 'rooms-9'), alt: 'Room with arched headboard and towel art', category: 'rooms' },
      { src: img(A, 'pool-1'), alt: 'Rooftop pool with waterfall wall at night', category: 'pool' },
      { src: img(A, 'pool-2'), alt: 'Rooftop pool beside the restaurant', category: 'pool' },
      { src: img(A, 'dining-2'), alt: 'Rooftop restaurant set for dinner', category: 'dining' },
      { src: img(A, 'dining-1'), alt: 'Rooftop restaurant tables beside the pool', category: 'dining' },
      { src: img(A, 'dining-3'), alt: 'Rooftop dining area at night', category: 'dining' },
      { src: img(A, 'events-1'), alt: 'Banquet hall set up for a meeting', category: 'events' },
      { src: img(A, 'events-2'), alt: 'Banquet hall in theatre-style seating', category: 'events' },
      { src: img(A, 'events-3'), alt: 'Banquet hall with decorated round tables', category: 'events' },
      { src: img(A, 'events-4'), alt: 'Banquet hall set for dining', category: 'events' },
      { src: img(A, 'events-5'), alt: 'Conference set-up with pendant lights', category: 'events' },
    ],
    // TODO: check-in / check-out times and policies from the client
  },

  // ── The Grey Circle ────────────────────────────────────────────────────────
  {
    slug: G,
    name: 'The Grey Circle',
    status: 'operating',
    content: 'complete',
    featured: true,
    stars: 3,
    tagline: 'A contemporary 3-star hotel in the heart of Vijay Nagar',
    description:
      "A contemporary 3-star hotel in the heart of Vijay Nagar, Indore, The Grey Circle offers a comfortable and convenient stay for both business and leisure travellers. With thoughtfully designed rooms, modern amenities and warm hospitality, it delivers a memorable stay in one of Indore's most vibrant locations.",
    city: 'Indore',
    area: 'Vijay Nagar',
    address: '192, Scheme No. 78, Part II, Vijay Nagar, Indore, Madhya Pradesh 452010',
    geo: { lat: 22.7653677, lng: 75.8861222 }, // Google Maps place "Hotel the Grey Circle"
    mapEmbedUrl: embed('Hotel the Grey Circle, Scheme 78, Vijay Nagar, Indore'),
    phones: GROUP_PHONES,
    whatsapp: GROUP_WHATSAPP,
    email: 'hotelthegreycircle@gmail.com', // brochure 2 prints "greycricle" (typo, flagged to client)
    connectivity: { airport: 25, railway: 20, metro: 10 },
    highlights: ['Prime location', 'Business friendly', 'Warm hospitality', 'Comfortable stay'],
    amenities: {
      room: IN_ROOM,
      property: ['Prime Vijay Nagar location', 'High-speed Wi-Fi'],
      business: ['Business-friendly stay'],
      dining: [],
    },
    rooms: [
      // Brochure gives names only; one-liners are neutral copy. TODO: client-approved descriptions.
      { name: 'Deluxe Room', description: 'Thoughtfully designed, with modern amenities for a comfortable stay.', images: [img(G, 'rooms-1')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Premium Room', description: 'An upgraded stay with modern amenities.', images: [], amenities: ROOM_CARD_AMENITIES }, // TODO: photo
      { name: 'Executive Room', description: 'Perfect for business and leisure travellers seeking extra comfort.', images: [img(G, 'rooms-2')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Suite', description: 'A luxurious stay with exclusive amenities.', images: [img(G, 'rooms-3')], amenities: ROOM_CARD_AMENITIES },
    ],
    cover: img(G, 'exterior-1'),
    gallery: [
      { src: img(G, 'exterior-1'), alt: 'Glass facade of Hotel The Grey Circle', category: 'exterior' },
      { src: img(G, 'exterior-3'), alt: 'Hotel The Grey Circle building and garden', category: 'exterior' },
      { src: img(G, 'exterior-2'), alt: 'Hotel The Grey Circle entrance signage', category: 'exterior' },
      { src: img(G, 'lobby-1'), alt: 'Lounge with leather sofas and artwork', category: 'lobby' },
      { src: img(G, 'lobby-2'), alt: 'Guest corridor with geometric wall panels', category: 'lobby' },
      { src: img(G, 'lobby-3'), alt: 'Covered terrace with booth seating', category: 'lobby' },
      { src: img(G, 'rooms-1'), alt: 'Deluxe Room', category: 'rooms' },
      { src: img(G, 'rooms-2'), alt: 'Executive Room with king bed', category: 'rooms' },
      { src: img(G, 'rooms-3'), alt: 'Suite bedroom', category: 'rooms' },
    ],
  },

  // ── Pradesha by Abhinandanam (coming soon) ─────────────────────────────────
  {
    slug: P,
    name: 'Pradesha by Abhinandanam',
    status: 'coming-soon',
    content: 'complete',
    featured: true,
    stars: 4,
    tagline: 'A new era of premium, nature-inspired hospitality',
    description:
      'Coming soon, Pradesha by Abhinandanam brings a new 4-star hospitality experience to the region, with a refined blend of luxury, comfort and nature-inspired hospitality. Thoughtfully designed for modern travellers, business guests and celebrations, it is envisioned as a destination where every stay feels exceptional.',
    city: 'Indore',
    area: 'Indore', // TODO: locality once announced
    address: 'Indore, Madhya Pradesh (exact address to be announced)', // TODO
    // geo / map: TODO once the address is public
    phones: [GROUP_PHONES[0]],
    whatsapp: GROUP_WHATSAPP,
    email: 'sales@abhinandanam.in',
    connectivity: { airport: 25, railway: 20, metro: 2 },
    highlights: ['Infinity pool', 'Banquet for 250+ guests', 'Rooms with jacuzzi', 'Cafeteria', 'Gym'],
    amenities: {
      room: ['Jacuzzi (premium rooms)'],
      property: ['Infinity pool', 'Gym', 'Cafeteria'],
      business: ['Banquet hall for 250+ guests', 'Conferences & corporate events'],
      dining: ['Cafeteria', 'Multi-cuisine dining'],
    },
    rooms: [
      { name: 'Deluxe Room', description: 'A perfect blend of style and convenience.', images: [img(P, 'rooms-1')], amenities: [] },
      { name: 'Executive Room', description: 'Modern rooms designed for a relaxed and premium stay.', images: [img(P, 'rooms-2')], amenities: [] },
      { name: 'Twin / Corporate', description: 'Ideal for business travellers, with modern facilities.', images: [img(P, 'rooms-3')], amenities: [] },
      { name: 'Family Room', description: 'Spacious and comfortable stays for families.', images: [img(P, 'rooms-4')], amenities: [] },
      { name: 'Suite', description: 'A luxurious stay with exclusive amenities.', images: [img(P, 'rooms-5')], amenities: [] },
      { name: 'Executive Suite', description: 'Expanded space with added comfort and elegance.', images: [img(P, 'rooms-6')], amenities: [] },
    ],
    banquet: {
      halls: 1,
      capacity: 250,
      capacityLabel: '250+ guests',
      description:
        'Where grand celebrations come to life. Spaciously designed to host 250+ guests, Pradesha offers the perfect setting for weddings, corporate events, conferences and unforgettable celebrations.',
      useCases: ['Weddings', 'Corporate events', 'Conferences', 'Celebrations'],
      images: [img(P, 'events-1')],
    },
    cover: img(P, 'exterior-1'),
    gallery: [
      { src: img(P, 'exterior-1'), alt: 'Pradesha by Abhinandanam facade at dusk', category: 'exterior', isRender: true },
      { src: img(P, 'exterior-2'), alt: 'Pradesha by Abhinandanam entrance', category: 'exterior', isRender: true },
      { src: img(P, 'lobby-1'), alt: 'Lobby café with marble floors', category: 'lobby', isRender: true },
      { src: img(P, 'lobby-2'), alt: 'Reception with crystal chandelier', category: 'lobby', isRender: true },
      { src: img(P, 'lobby-3'), alt: 'Marble corridor with chandeliers', category: 'lobby', isRender: true },
      { src: img(P, 'events-1'), alt: 'Banquet hall with chandeliers and inlaid marble floor', category: 'events', isRender: true },
      { src: img(P, 'rooms-6'), alt: 'Executive Suite living area', category: 'rooms', isRender: true },
      { src: img(P, 'rooms-1'), alt: 'Deluxe Room', category: 'rooms', isRender: true },
      { src: img(P, 'rooms-2'), alt: 'Executive Room with lounge and dining table', category: 'rooms', isRender: true },
      { src: img(P, 'rooms-3'), alt: 'Twin / Corporate room with dining area', category: 'rooms', isRender: true },
      { src: img(P, 'rooms-4'), alt: 'Family Room', category: 'rooms', isRender: true },
      { src: img(P, 'rooms-5'), alt: 'Suite bedroom', category: 'rooms', isRender: true },
      { src: img(P, 'rooms-7'), alt: 'Room with sofa and work desk', category: 'rooms', isRender: true },
    ],
  },

  // ── Listed on the old abhinandanam.in site; no content supplied yet ────────
  // TODO (client): confirm each is in the portfolio, then send address, star rating,
  // rooms, amenities and photos. Leads from public listings are in TODO-content.md.
  ...(
    [
      ['the-grand-euro', 'The Grand Euro'],
      ['hotel-awadhvue', 'Hotel Awadhvue'],
      ['grand-ten-eleven', 'Grand Ten Eleven'],
      ['hotel-blue-marine', 'Hotel Blue Marine'],
      ['hotel-arshvue', 'Hotel Arshvue'],
      ['hotel-the-bellevue', 'Hotel The Bellevue'],
    ] as const
  ).map(
    ([slug, name]): Hotel => ({
      slug,
      name,
      status: 'operating',
      content: 'placeholder',
      tagline: 'Part of the Abhinandanam Hospitality family',
      description: `Photos, room categories and full details for ${name} are on their way. Call our reservations team for availability and the best direct rate.`,
      city: 'Indore', // TODO: confirm
      area: '', // TODO
      address: 'Indore, Madhya Pradesh', // TODO
      phones: GROUP_PHONES,
      whatsapp: GROUP_WHATSAPP,
      email: 'info@abhinandanam.in',
      highlights: [],
      amenities: { room: [], property: [], business: [], dining: [] },
      rooms: [],
      cover: '/images/placeholder-hotel.webp',
      gallery: [],
    }),
  ),
];
