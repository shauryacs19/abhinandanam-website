# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary (confirmed 2026-10-30):**
- **Families and leisure guests** visiting Indore: they need a room that fits everyone (Family Room sleeps 4), want to see the rooftop pool and restaurant, and decide by phone or WhatsApp before they commit.
- **Wedding and event hosts**: families and planners booking a banquet hall. They need capacity, the hall and the dates settled with a person (Hotel Abhinandanam: 2 halls, up to 100 guests; Pradesha: 400+ guests once open).

**Also served, not the priority:** business travellers (Corporate Executive rooms, meeting rooms, Vijay Nagar location).

Assumed, not measured (there is no analytics yet): most visitors arrive on a phone, often from Google or after comparing the hotels on MakeMyTrip.

## Product Purpose

The website of **Abhinandanam Hospitality Pvt. Ltd.**, a hotel group from Indore, Madhya Pradesh. It shows each hotel, room by room, and gets the guest talking to the hotel.

- **Today:** success is a call or a WhatsApp chat. There are no prices and no online payment. The availability form (hotel, dates, guests, rooms) opens WhatsApp with the request already typed.
- **Next:** the group is adding **its own booking system** (confirmed 2026-10-30). The site becomes its front end, and the availability form is meant to become the real booking bar.
- **Online travel agencies stay.** Direct booking is an extra channel next to MakeMyTrip and similar sites, not a replacement for them.

## Positioning

One Indore group, several hotels in Vijay Nagar, one reservations desk that answers in one tap. Every page puts a real person within reach (call, WhatsApp, directions). Every room category has its own real photo and a plain description. The big hotel chains and the OTAs hide the phone number or bury it; this site leads with it.

## Operating Context

- Guests reach the hotel through: the header Call button on every page, the sticky mobile bar (Call | WhatsApp | Directions), the booking card on each hotel page, the availability form, and the contact composer (email or WhatsApp, no backend).
- Reservations: +91 82258 22585 (main line), +91 90099 29213; WhatsApp +91 82258 22569 (from the official Linktree; owner still to confirm).
- Check-in 12:00 PM, check-out 10:00 AM at every hotel.
- Guests check reviews elsewhere before they decide: Google (Hotel Abhinandanam 4.9 from 1,111 reviews) and MakeMyTrip (4.3 from 317; The Grey Circle 3.2 from 13).
- The hotels' own printed brochures circulate alongside the site (the site corrects some of their errors; see `context.md` section 7).

## Capabilities and Constraints

**The hotels:**
- **Hotel Abhinandanam** (4-star, open): 6 room categories, rooftop restaurant and pool, 2 banquet halls.
- **The Grey Circle** (3-star, open): 5 room categories, rooftop dining, banquet (capacity not yet supplied).
- **Pradesha by Abhinandanam** (4-star, coming soon): 6 room categories, 400+ banquet, infinity pool. Address, opening date and real photos are not known yet.
- **Six more hotels** from the old website (The Grand Euro, Hotel Awadhvue, Grand Ten Eleven, Hotel Blue Marine, Hotel Arshvue, Hotel The Bellevue) have placeholder pages only. Whether they belong in the portfolio is **still open with the owner**.

**Technical:**
- The site is a static export (Next.js 14, `output: 'export'`). There is no server, database or login. The own booking system needs a backend that doesn't exist yet.
- All hotel content lives in `data/hotels.ts`. Adding a hotel means one data entry plus one photo folder.
- Quality floor already met and kept: Lighthouse Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100 on every page. Target page weight is under 1 MB.
- No tracking cookies by default, so there is no cookie banner. No pop-ups, sign-in walls or urgency nags.

**Undecided (do not assume):**
- How the booking system is built: own software or a third-party booking engine, online payment or pay at hotel, and how rooms stay in sync with the OTAs.
- Any reason to book direct over the OTAs (better rate, perks). **None is confirmed, so the site makes no "best rate" or "book direct and save" claim.**
- Cancellation policy for direct bookings.
- A Hindi version (the site is English-only today).

**Terminology:** use the hotels' own names exactly as written above. Room categories follow the MakeMyTrip names (e.g. The Grey Circle's smallest room is "Standard Room", not "Small Deluxe"). Pradesha imagery is always labelled "Artist's impression".

## Brand Commitments

- Name: **Abhinandanam Hospitality** (legal: Abhinandanam Hospitality Pvt. Ltd.). Tagline: **"Hospitality Beyond Stays"**. Values: Comfort, Elegance, Experience. Line: "Distinct experiences, one vision."
- Logos are the client's own artwork with ® added: horizontal in the header, stacked in the page body (`public/images/brand/`, built by `scripts/build_logos.py`). Do not redraw them.
- Each hotel keeps its own identity: no photo walls that mix hotels together (owner's request).
- Voice: warm, plain and factual. It names the real thing (room, hall, rooftop) and never pushes with discounts or scarcity.

## Evidence on Hand

- **Photos:** 57 professional photos from the client's Google Drive (both open hotels), plus brochure photos and Pradesha 3D renders, in `public/images/hotels/<slug>/`. Two pool photos carry a photographer's watermark (usage rights unconfirmed).
- **Source documents:** the two brochures and their extracted text in `assets/source/`.
- **Facts:** room sizes, beds, occupancy, rules and amenities from MakeMyTrip (2026-10-25), recorded in `data/hotels.ts`.
- **Brochure stats shown on the site:** "1500+ registered loyalty clients", "98% customer satisfaction" (owner to confirm they're current).
- **Ratings:** Google 4.9 (1,111) and MakeMyTrip 4.3 (317) exist but are **not shown** until the owner approves.

**Absent. Never fabricate these:** guest review quotes (`data/reviews.ts` is empty and the section hides itself), prices and offers, awards, the brochure's "5.0 / 4.5 Guest Rating" badges (source unknown), 360° photos, Pradesha's address and opening date, staff portraits, logos for the six placeholder hotels.

## Product Principles

1. **A person is always one tap away.** The booking system adds a path; it never hides the phone or WhatsApp.
2. **Show the real hotel.** Real photos for every room and space, renders clearly labelled, and never a stock photo standing in for one of the hotels.
3. **Say "on request" rather than guess.** Missing facts read "On request" or "Confirm when you book" until the owner supplies them.
4. **Families and celebrations come first.** Room-for-everyone, the rooftop, and banquet capacity are easy to find; business travel is served without leading.
5. **Calm and fast on a phone.** No pop-ups, walls, urgency tricks or heavy pages; motion always has a pause and respects reduced motion.

## Accessibility & Inclusion

- WCAG 2.1 AA contrast on all text (pairs are checked in `context.md` section 4).
- `prefers-reduced-motion` turns off the opening intro, slideshow motion and photo marquees; every moving element has a Pause control (WCAG 2.2.2).
- Lightbox, menus and carousels work by keyboard, with focus trapped and returned.
- English only today; Hindi is an open question.
