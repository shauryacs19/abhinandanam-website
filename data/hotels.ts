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
  occupancy?: string; // e.g. "Up to 3 guests" (MakeMyTrip listing)
  sizeSqft?: number; // from the MakeMyTrip listing or the client, never estimated
  bed?: string; // e.g. "1 king bed"
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
    /** Leave out when the client hasn't confirmed it */
    capacity?: number;
    capacityLabel: string;
    description: string;
    useCases: string[];
    images: string[];
  };
  dining?: { title: string; description: string; images: string[] }[];
  cover: string;
  logo?: string;
  gallery: GalleryImage[];
  checkIn?: string;
  checkOut?: string;
  policies?: { idProof?: string; pets?: string; extraBed?: string; children?: string; cancellation?: string };
  /** House rules, shown as a checklist under the policies */
  rules?: string[];
};

const GROUP_PHONES = ['+918225822585', '+919009929213'];
// WhatsApp button on the official Linktree (linktr.ee/abhinandanam) points to 82258 22569
const GROUP_WHATSAPP = '918225822569';

// Same for every hotel (client, 2026-10-25; matches both MakeMyTrip listings)
const CHECK_IN = '12:00 PM';
const CHECK_OUT = '10:00 AM';

const img = (slug: string, name: string) => `/images/hotels/${slug}/${slug}-${name}.webp`;
const embed = (q: string, zoom = 16) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`;

// Listed in every operating room (brief: in-room amenities for all operating hotels)
const IN_ROOM = [
  'High-speed Wi‑Fi',
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
  'Iron / ironing board',
  'Premium toiletries',
];
const ROOM_CARD_AMENITIES = ['High-speed Wi‑Fi', 'Air conditioning', 'Satellite TV', 'Tea / coffee maker'];

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
    // Amenities, room facts and rules below: hotel profile PDF + MakeMyTrip listing (checked 2026-10-25)
    amenities: {
      room: [...IN_ROOM, 'Hairdryer', 'Mini fridge', 'Jacuzzi (select suites)'],
      property: [
        'Rooftop swimming pool',
        'Fitness centre',
        'Parking',
        'Laundry service',
        'Suites with jacuzzi',
        'High-speed Wi‑Fi',
        '24-hour reception',
        'Lift',
        'Power backup',
        'Doctor on call',
        'CCTV & security',
        'Wheelchair accessible',
        'Airport transfers (paid)',
      ],
      business: ['Conference & meeting rooms', '2 banquet halls (up to 100 guests)', 'Business centre', 'Printing & photocopying', 'High-speed Wi‑Fi'],
      dining: ['Rooftop restaurant', 'Multi-cuisine dining', 'In-room dining (24 hours)', 'Breakfast: Indian veg & Jain', "Kids' menu"],
    },
    rooms: [
      { name: 'Standard Room', description: 'A comfortable and value-for-money stay with modern amenities.', occupancy: 'Up to 2 guests', sizeSqft: 110, bed: '1 king bed', images: [img(A, 'rooms-standard-1'), img(A, 'rooms-standard-2')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Executive Room', description: 'Perfect for business and leisure travellers seeking extra comfort.', occupancy: 'Up to 3 guests', sizeSqft: 200, bed: 'King or twin beds', images: [img(A, 'rooms-executive-1'), img(A, 'rooms-executive-2'), img(A, 'rooms-executive-3')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Corporate Executive', description: 'Ideal for business travellers, with enhanced space and modern facilities.', occupancy: 'Up to 3 guests', sizeSqft: 230, bed: '1 king bed', images: [img(A, 'rooms-corporate-1'), img(A, 'rooms-corporate-2'), img(A, 'rooms-corporate-3')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Family Room', description: 'A spacious and comfortable stay for families.', occupancy: 'Up to 4 guests', sizeSqft: 300, bed: '2 double beds', images: [img(A, 'rooms-family-1'), img(A, 'rooms-family-2'), img(A, 'rooms-family-3')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Suite', description: 'A luxurious stay with a separate seating area and exclusive amenities.', occupancy: 'Up to 3 guests', sizeSqft: 300, bed: '1 king bed', images: [img(A, 'rooms-suite-1'), img(A, 'rooms-suite-2'), img(A, 'rooms-suite-3')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Executive Suite', description: 'Our most spacious category: a lounge, city views and a jacuzzi bath in select suites.', occupancy: 'Up to 3 guests', sizeSqft: 345, bed: '1 queen bed', images: [img(A, 'rooms-exec-suite-1'), img(A, 'rooms-exec-suite-2'), img(A, 'rooms-exec-suite-3'), img(A, 'rooms-exec-suite-4'), img(A, 'rooms-exec-suite-5')], amenities: ROOM_CARD_AMENITIES },
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
          'Take a refreshing break and unwind by the pool. Designed for relaxation, our rooftop pool offers a serene setting to cool off, recharge and enjoy your stay. Open 10 AM to 5 PM, closed on Saturdays.',
        images: [img(A, 'pool-new-1'), img(A, 'pool-new-2')],
      },
    ],
    cover: img(A, 'exterior-1'),
    gallery: [
      { src: img(A, 'exterior-night-3'), alt: 'Hotel Abhinandanam entrance and sign lit up at night', category: 'exterior' },
      { src: img(A, 'exterior-1'), alt: 'Hotel Abhinandanam facade lit up at dusk', category: 'exterior' },
      { src: img(A, 'exterior-2'), alt: 'Hotel Abhinandanam entrance and facade by day', category: 'exterior' },
      { src: img(A, 'exterior-3'), alt: 'Covered entrance steps at Hotel Abhinandanam', category: 'exterior' },
      { src: img(A, 'exterior-4'), alt: 'Landscaped entrance to Hotel Abhinandanam at night', category: 'exterior' },
      { src: img(A, 'exterior-night-1'), alt: 'Hotel Abhinandanam sign and facade lit at night', category: 'exterior' },
      { src: img(A, 'exterior-night-2'), alt: 'Entrance steps under the glass canopy', category: 'exterior' },
      { src: img(A, 'lobby-new-4'), alt: 'Glass entrance doors under a crystal chandelier', category: 'lobby' },
      { src: img(A, 'lobby-new-5'), alt: 'Reception beneath twin crystal chandeliers', category: 'lobby' },
      { src: img(A, 'lobby-new-8'), alt: 'Crystal chandelier in a mirrored, wood-lined ceiling', category: 'lobby' },
      { src: img(A, 'lobby-new-6'), alt: 'Lobby lounge with sofas under a chandelier', category: 'lobby' },
      { src: img(A, 'lobby-new-7'), alt: 'Reception desk with marble floor and glass doors', category: 'lobby' },
      { src: img(A, 'lobby-new-9'), alt: 'Lounge seating beside the lobby windows', category: 'lobby' },
      { src: img(A, 'lobby-1'), alt: 'Lobby with chandelier, marble floor and reception desk', category: 'lobby' },
      { src: img(A, 'lobby-new-1'), alt: 'Reception desk with marble and backlit panels', category: 'lobby' },
      { src: img(A, 'lobby-new-2'), alt: 'Lobby lounge with armchairs and sofas', category: 'lobby' },
      { src: img(A, 'lobby-2'), alt: 'Crystal chandelier above the lobby', category: 'lobby' },
      { src: img(A, 'lobby-3'), alt: 'Lounge seating area', category: 'lobby' },
      { src: img(A, 'lobby-new-3'), alt: 'Guest corridor under a crystal chandelier', category: 'lobby' },
      { src: img(A, 'lobby-4'), alt: 'Guest corridor', category: 'lobby' },
      { src: img(A, 'rooms-exec-suite-1'), alt: 'Executive Suite bedroom with arched headboard', category: 'rooms' },
      { src: img(A, 'rooms-exec-suite-2'), alt: 'Executive Suite lounge with curved sofa', category: 'rooms' },
      { src: img(A, 'rooms-exec-suite-3'), alt: 'Executive Suite bed facing a city-view window', category: 'rooms' },
      { src: img(A, 'rooms-exec-suite-4'), alt: 'Executive Suite living area with kitchenette', category: 'rooms' },
      { src: img(A, 'rooms-exec-suite-5'), alt: 'Jacuzzi bath in an Executive Suite', category: 'rooms' },
      { src: img(A, 'rooms-suite-1'), alt: 'Suite bedroom', category: 'rooms' },
      { src: img(A, 'rooms-suite-2'), alt: 'Suite seating area with a large window', category: 'rooms' },
      { src: img(A, 'rooms-suite-3'), alt: 'Tea and coffee tray in the Suite', category: 'rooms' },
      { src: img(A, 'rooms-corporate-1'), alt: 'Corporate Executive room with king bed and sofa', category: 'rooms' },
      { src: img(A, 'rooms-corporate-2'), alt: 'Corporate Executive room with desk and TV', category: 'rooms' },
      { src: img(A, 'rooms-corporate-3'), alt: 'Corporate Executive bathroom vanity', category: 'rooms' },
      { src: img(A, 'rooms-executive-1'), alt: 'Executive Room with twin beds', category: 'rooms' },
      { src: img(A, 'rooms-executive-2'), alt: 'Executive Room with king bed', category: 'rooms' },
      { src: img(A, 'rooms-executive-3'), alt: 'Executive Room bathroom with lit mirror', category: 'rooms' },
      { src: img(A, 'rooms-family-1'), alt: 'Family Room with two double beds', category: 'rooms' },
      { src: img(A, 'rooms-family-2'), alt: 'Family Room with desk and TV', category: 'rooms' },
      { src: img(A, 'rooms-family-3'), alt: 'Family Room glass shower', category: 'rooms' },
      { src: img(A, 'rooms-standard-1'), alt: 'Standard Room with king bed', category: 'rooms' },
      { src: img(A, 'rooms-standard-2'), alt: 'Standard Room bathroom with lit mirror', category: 'rooms' },
      { src: img(A, 'pool-new-1'), alt: 'Rooftop pool with waterfall wall', category: 'pool' },
      { src: img(A, 'pool-new-2'), alt: 'Rooftop pool beside the restaurant tables', category: 'pool' },
      { src: img(A, 'pool-1'), alt: 'Rooftop pool with waterfall wall at night', category: 'pool' },
      { src: img(A, 'pool-2'), alt: 'Rooftop pool beside the restaurant', category: 'pool' },
      { src: img(A, 'dining-2'), alt: 'Rooftop restaurant set for dinner', category: 'dining' },
      { src: img(A, 'dining-1'), alt: 'Rooftop restaurant tables beside the pool', category: 'dining' },
      { src: img(A, 'dining-3'), alt: 'Rooftop dining area at night', category: 'dining' },
      { src: img(A, 'dining-new-1'), alt: 'Restaurant with upholstered chairs and city windows', category: 'dining' },
      { src: img(A, 'dining-new-2'), alt: 'Restaurant tables laid out for breakfast', category: 'dining' },
      { src: img(A, 'events-1'), alt: 'Banquet hall set up for a meeting', category: 'events' },
      { src: img(A, 'events-2'), alt: 'Banquet hall in theatre-style seating', category: 'events' },
      { src: img(A, 'events-3'), alt: 'Banquet hall with decorated round tables', category: 'events' },
      { src: img(A, 'events-4'), alt: 'Banquet hall set for dining', category: 'events' },
      { src: img(A, 'events-5'), alt: 'Conference set-up with pendant lights', category: 'events' },
    ],
    checkIn: CHECK_IN,
    checkOut: CHECK_OUT,
    policies: {
      idProof: 'Passport, Aadhaar or driving licence. Local IDs accepted.',
      pets: 'Pets are not allowed',
      extraBed: 'Extra mattress for an additional adult: ₹1,000, paid at the hotel. No extra beds for children.',
      children: '1 infant (0–2 yrs) per room stays free, with complimentary infant meals',
      // TODO: cancellation policy for direct bookings (MakeMyTrip rates vary)
    },
    rules: [
      'Primary guest must be at least 18 years old',
      'Unmarried couples are welcome (not in hourly-stay rooms)',
      'Groups of male guests are welcome',
      'No smoking anywhere on the premises',
      'Outside food is not allowed',
      'Outside visitors are not allowed in guest rooms',
      'Wheelchair accessible (please bring your own wheelchair)',
      'Rooftop pool: 10 AM to 5 PM, closed on Saturdays',
      'Early check-in and late check-out subject to availability',
    ],
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
    highlights: ['Rooftop dining', 'Banquet & meeting rooms', 'Suites with jacuzzi', 'Free parking', 'Prime location', 'Business friendly'],
    // Amenities, room facts and rules below: MakeMyTrip listing (checked 2026-10-25) + the hotel's photo folders
    amenities: {
      room: [...IN_ROOM, 'Hairdryer (select rooms)', 'Jacuzzi (suites)'],
      property: [
        'Prime Vijay Nagar location',
        'High-speed Wi‑Fi',
        'Free parking',
        '24-hour reception',
        'Rooftop lounge',
        'Garden',
        'Lift',
        'Power backup',
        'CCTV & security',
        'Laundry service (paid)',
        'Wheelchair accessible',
        'Airport & railway transfers (paid)',
      ],
      business: ['Banquet hall', 'Meeting room', 'Business centre', 'Printing & photocopying'],
      dining: ['Rooftop restaurant', 'In-room dining', 'Breakfast: Indian veg & Jain', "Kids' menu"],
    },
    rooms: [
      // Names and sizes from MakeMyTrip; the hotel's photo folder calls the Standard Room "Small Deluxe".
      // One-liners are neutral copy. TODO: client-approved descriptions.
      { name: 'Standard Room', description: 'A smart, compact room with modern amenities, ideal for solo and business travellers.', sizeSqft: 120, images: [img(G, 'rooms-standard-1'), img(G, 'rooms-standard-2')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Deluxe Room', description: 'Thoughtfully designed, with modern amenities for a comfortable stay.', occupancy: 'Up to 3 guests', sizeSqft: 180, bed: '1 queen bed', images: [img(G, 'rooms-deluxe-1'), img(G, 'rooms-deluxe-2'), img(G, 'rooms-deluxe-3')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Premium Room', description: 'An upgraded stay with floor-to-ceiling windows and a lounge corner.', occupancy: 'Up to 3 guests', sizeSqft: 260, bed: '1 king bed', images: [img(G, 'rooms-premium-1'), img(G, 'rooms-premium-2'), img(G, 'rooms-premium-3')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Executive Room', description: 'Perfect for business and leisure travellers seeking extra comfort.', occupancy: 'Up to 3 guests', sizeSqft: 270, bed: '1 queen bed', images: [img(G, 'rooms-executive-1'), img(G, 'rooms-executive-2'), img(G, 'rooms-executive-3')], amenities: ROOM_CARD_AMENITIES },
      { name: 'Suite', description: 'Our largest room: a separate lounge, city views and a jacuzzi bath.', occupancy: 'Up to 4 guests', sizeSqft: 650, images: [img(G, 'rooms-suite-5'), img(G, 'rooms-suite-1'), img(G, 'rooms-suite-2'), img(G, 'rooms-suite-3'), img(G, 'rooms-suite-4'), img(G, 'rooms-suite-6')], amenities: ROOM_CARD_AMENITIES },
    ],
    banquet: {
      halls: 1,
      // capacity: TODO from the client
      capacityLabel: 'Ask for capacity',
      description:
        'A banquet hall that sets up for round-table celebrations, U-shaped meetings or a conference with projector, plus a smaller meeting room for board meetings and interviews.',
      useCases: ['Birthdays & celebrations', 'Corporate meetings', 'Conferences', 'Private parties'],
      images: [img(G, 'events-hall-3'), img(G, 'events-hall-1'), img(G, 'events-hall-2'), img(G, 'events-conference-1'), img(G, 'events-meeting-1')],
    },
    dining: [
      {
        title: 'Rooftop Dining',
        description:
          'A covered rooftop with booth seating and open views over Vijay Nagar. Come up for a relaxed meal, or book it for a small get-together or private party.',
        images: [img(G, 'rooftop-1'), img(G, 'rooftop-2'), img(G, 'rooftop-3')],
      },
    ],
    cover: img(G, 'exterior-front-1'),
    logo: '/images/brand/the-grey-circle-logo.webp',
    gallery: [
      { src: img(G, 'exterior-front-1'), alt: 'Glass facade of Hotel The Grey Circle with its sign', category: 'exterior' },
      { src: img(G, 'exterior-front-2'), alt: 'Hotel The Grey Circle front elevation', category: 'exterior' },
      { src: img(G, 'exterior-front-3'), alt: 'Hotel The Grey Circle building and driveway', category: 'exterior' },
      { src: img(G, 'lobby-hall-1'), alt: 'Lounge with sofas, backlit panels and artwork', category: 'lobby' },
      { src: img(G, 'lobby-hall-2'), alt: 'Glass reception desk', category: 'lobby' },
      { src: img(G, 'lobby-hall-3'), alt: 'Corridor with a backlit feature wall', category: 'lobby' },
      { src: img(G, 'rooftop-1'), alt: 'Rooftop dining with booth seating and city views', category: 'dining' },
      { src: img(G, 'rooftop-2'), alt: 'Booth tables along the rooftop railing', category: 'dining' },
      { src: img(G, 'rooftop-3'), alt: 'Curved sofa lounge on the rooftop', category: 'dining' },
      { src: img(G, 'rooftop-4'), alt: 'Covered rooftop seating', category: 'dining' },
      { src: img(G, 'rooms-suite-5'), alt: 'Suite with warm cove lighting and a backlit feature wall', category: 'rooms' },
      { src: img(G, 'rooms-suite-1'), alt: 'Suite bedroom', category: 'rooms' },
      { src: img(G, 'rooms-suite-2'), alt: 'Suite bedroom with a city-view window', category: 'rooms' },
      { src: img(G, 'rooms-suite-3'), alt: 'Suite lounge', category: 'rooms' },
      { src: img(G, 'rooms-suite-4'), alt: 'Jacuzzi bath in the Suite', category: 'rooms' },
      { src: img(G, 'rooms-suite-6'), alt: 'Jacuzzi tub in a dark marble bathroom', category: 'rooms' },
      { src: img(G, 'rooms-executive-1'), alt: 'Executive Room with queen bed', category: 'rooms' },
      { src: img(G, 'rooms-executive-2'), alt: 'Executive Room with armchair', category: 'rooms' },
      { src: img(G, 'rooms-executive-3'), alt: 'Executive Room marble bathroom', category: 'rooms' },
      { src: img(G, 'rooms-premium-1'), alt: 'Premium Room with floor-to-ceiling windows', category: 'rooms' },
      { src: img(G, 'rooms-premium-2'), alt: 'Premium Room with king bed', category: 'rooms' },
      { src: img(G, 'rooms-premium-3'), alt: 'Lounge chairs in the Premium Room', category: 'rooms' },
      { src: img(G, 'rooms-deluxe-1'), alt: 'Deluxe Room with queen bed', category: 'rooms' },
      { src: img(G, 'rooms-deluxe-2'), alt: 'Deluxe Room desk and TV', category: 'rooms' },
      { src: img(G, 'rooms-deluxe-3'), alt: 'Tea and coffee tray', category: 'rooms' },
      { src: img(G, 'rooms-standard-1'), alt: 'Standard Room', category: 'rooms' },
      { src: img(G, 'rooms-standard-2'), alt: 'Standard Room bathroom', category: 'rooms' },
      { src: img(G, 'events-hall-3'), alt: 'Banquet hall with round tables and a backlit stone wall', category: 'events' },
      { src: img(G, 'events-hall-1'), alt: 'Banquet hall with round tables', category: 'events' },
      { src: img(G, 'events-hall-2'), alt: 'Banquet hall in a U-shaped meeting set-up', category: 'events' },
      { src: img(G, 'events-conference-1'), alt: 'Banquet hall set up for a conference with projector', category: 'events' },
      { src: img(G, 'events-meeting-1'), alt: 'Meeting room with round tables', category: 'events' },
    ],
    checkIn: CHECK_IN,
    checkOut: CHECK_OUT,
    policies: {
      idProof: 'Passport, Aadhaar, driving licence or any government ID. Local IDs accepted.',
      pets: 'Pets are not allowed',
      extraBed: 'Extra mattress: ₹1,000 per adult, ₹500 per child (subject to availability), paid at the hotel',
      children: 'Infants (0–2 yrs) count towards room capacity',
      // TODO: cancellation policy for direct bookings
    },
    rules: [
      'Primary guest must be at least 18 years old',
      'Unmarried couples are welcome',
      'Groups of male guests are welcome',
      'Alcohol is not allowed on the premises',
      'Smoking is allowed on the premises',
      'Outside food is not allowed; in-room dining is available',
      'Outside visitors are not allowed in guest rooms',
      'Private parties and events can be arranged',
      'Wheelchair accessible (please bring your own wheelchair)',
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
    // Exact address isn't public yet: show Indore until then. TODO: geo + a pinned map once announced
    mapEmbedUrl: embed('Indore, Madhya Pradesh', 12),
    phones: [GROUP_PHONES[0]],
    whatsapp: GROUP_WHATSAPP,
    email: 'sales@abhinandanam.in',
    connectivity: { airport: 25, railway: 20, metro: 2 },
    highlights: ['Infinity pool', 'Banquet for 400+ guests', 'Rooms with jacuzzi', 'Cafeteria', 'Gym'],
    amenities: {
      room: ['Jacuzzi (premium rooms)'],
      property: ['Infinity pool', 'Gym', 'Cafeteria'],
      business: ['Banquet hall for 400+ guests', 'Conferences & corporate events'],
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
      capacity: 400,
      capacityLabel: '400+ guests',
      description:
        'Where grand celebrations come to life. Spaciously designed to host 400+ guests, Pradesha offers the perfect setting for weddings, corporate events, conferences and unforgettable celebrations.',
      useCases: ['Weddings', 'Corporate events', 'Conferences', 'Celebrations'],
      images: [img(P, 'events-1')],
    },
    cover: img(P, 'exterior-1'),
    logo: '/images/brand/pradesha-logo.webp',
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
    checkIn: CHECK_IN,
    checkOut: CHECK_OUT,
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
      description: `Photos, room categories and full details for ${name} are on their way. Call our reservations team for availability and rates.`,
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
      checkIn: CHECK_IN,
      checkOut: CHECK_OUT,
    }),
  ),
];
