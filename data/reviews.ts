// Guest reviews shown on the home page.
//
// TODO: add REAL Google review quotes once the client supplies them (with the reviewer's
// first name and the hotel). Never invent reviews. While this array is empty the
// "Guest reviews" section is hidden automatically.

export type Review = {
  quote: string;
  author: string; // first name + initial, e.g. "Priya S."
  hotelSlug: string; // must match a slug in data/hotels.ts
  source: 'Google' | 'TripAdvisor' | 'Booking.com' | 'Direct';
  rating?: 1 | 2 | 3 | 4 | 5;
  date?: string; // e.g. "2026-08"
};

export const reviews: Review[] = [];
