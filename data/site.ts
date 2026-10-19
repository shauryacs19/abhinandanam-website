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
  // TODO: confirm the WhatsApp Business number with the client (assumed = main line).
  whatsapp: '918225822585',
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
  logo: '/images/brand/abhinandanam-hospitality-logo.webp',
  mark: '/images/brand/abhinandanam-mark-lg.webp', // hero logo + opening intro
  markSmall: '/images/brand/abhinandanam-mark-sm.webp', // header logo
} as const;
