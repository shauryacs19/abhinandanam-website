// Brand-level facts. Source: the two hotel brochures (assets/source/*.pdf).

export const site = {
  name: 'Abhinandanam Hospitality',
  legalName: 'Abhinandanam Hospitality Pvt. Ltd.',
  url: 'https://www.abhinandanam.in',
  tagline: 'Hospitality Beyond Stays',
  values: ['Comfort', 'Elegance', 'Experience'],
  motto: 'Travel Comfortably',
  oneVision: 'Distinct experiences, one vision.',
  description:
    'Abhinandanam Hospitality is a growing hospitality group from Indore with a vision to create welcoming, memorable and contemporary stays across Madhya Pradesh and beyond.',
  // E.164 numbers. The first is the main reservations line.
  phones: ['+918225822585', '+919009929213'],
  // WhatsApp button on the official Linktree (linktr.ee/abhinandanam)
  whatsapp: '918225822569',
  emails: { info: 'info@abhinandanam.in', sales: 'sales@abhinandanam.in' },
  socials: {
    instagram: 'https://www.instagram.com/abhinandanamhospitality',
    facebook: 'https://www.facebook.com/abhinandanamhospitality',
    linkedin: 'https://www.linkedin.com/company/abhinandanamhospitality', // TODO: confirm exact LinkedIn URL
  },
  headOffice: {
    address: 'Plot No. 2, Ratanlok Colony, Scheme No. 53, Vijay Nagar, Indore, Madhya Pradesh 452010',
    locality: 'Indore',
    region: 'Madhya Pradesh',
    postalCode: '452010',
  },
  stats: {
    loyaltyClients: 1500, // "1500+ Registered Loyalty Clients" (brochure 2)
    satisfaction: 98, // "98% Customer Satisfaction" (brochure 1)
  },
  // Client logos with (R) added (scripts/build_logos.py). The old brochure logo file stays only as the favicon source.
  logo: '/images/brand/abhinandanam-logo-stacked.webp', // page body: hero, footer, JSON-LD
  logoHorizontal: '/images/brand/abhinandanam-logo-horizontal.webp', // header
  mark: '/images/brand/abhinandanam-mark-lg.webp', // opening intro (lands on the stacked logo's symbol)
  markSmall: '/images/brand/abhinandanam-mark-sm.webp', // "Ways to stay" tile for Hotel Abhinandanam
  // All-white copies for the dark green theme (scripts/build_white_logos.py); the coloured files stay for JSON-LD
  logoWhite: '/images/brand/abhinandanam-logo-stacked-white.webp',
  logoHorizontalWhite: '/images/brand/abhinandanam-logo-horizontal-white.webp',
  markSmallWhite: '/images/brand/abhinandanam-mark-sm-white.webp',
} as const;
