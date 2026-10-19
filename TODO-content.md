# Content to request from the hotel owner

Everything below is either missing from the brochures or contradicts itself. The site shows a neutral placeholder ("On request", "Confirm when you book", "Photos coming soon") until each item arrives. Where it goes in the code is in brackets.

## 1. Needed before launch

- [ ] **WhatsApp Business number.** The site assumes **+91 82258 22585**. Confirm it's on WhatsApp. [`data/site.ts` → `whatsapp`, `data/hotels.ts` → `GROUP_WHATSAPP`]
- [ ] **Check-in / check-out times** for Hotel Abhinandanam and The Grey Circle. [`checkIn`, `checkOut`]
- [ ] **Policies** per hotel: ID proof required, pets, cancellation. [`policies`]
- [ ] **Room sizes (sq ft) and occupancy** for every room category (16 categories in total). [`rooms[].sizeSqft`, `rooms[].occupancy`]
- [ ] **Google review quotes.** 3 to 6 real reviews with first name + initial, hotel and month. The home "Guest reviews" section stays hidden until these are added. [`data/reviews.ts`]
- [ ] **LinkedIn page URL.** The brochure shows the LinkedIn icon with `/abhinandanamhospitality`; the exact company URL needs confirming. [`data/site.ts` → `socials.linkedin`]
- [ ] **Photo usage rights.** Two rooftop-pool photos (`abhinandanam-pool-2`, `abhinandanam-dining-1`) carry a photographer's watermark. Confirm we may use them, or get clean originals.

## 2. Photos

- [ ] **High-resolution originals (2000px+ wide)** of the key shots. Brochure photos top out around 1,000–1,400px, so the full-width hero looks soft on big screens. Most wanted: Abhinandanam facade at dusk, rooftop pool, lobby, each room category.
- [ ] **The Grey Circle "Premium" room** has no photo (brochure 1 lists Deluxe | Premium | Executive | Suite; brochure 2 shows only 3).
- [ ] **The Grey Circle**: any dining, banquet or meeting-room photos if those facilities exist (the brochure doesn't mention them).
- [ ] **Hotel Abhinandanam**: gym, parking, conference room photos.
- [ ] **Pradesha**: renders of the **infinity pool**, gym and cafeteria (currently a placeholder image on its page).
- [ ] Room-by-room photo sets (2–4 per category) to fill the room carousels.

## 3. Pradesha by Abhinandanam (coming soon)

- [ ] Address / locality and a Google Maps pin (the map, "Get directions" and the address line are hidden until then).
- [ ] Expected opening date (could show "Opening <month year>").
- [ ] Room count, in-room amenities, and whether rooms will match the Abhinandanam list.
- [ ] Confirm the "Twin / Corporate" category name (brochure 2 calls it "Corporate Executive").

## 4. The 6 hotels from the old website

The site has placeholder pages for **The Grand Euro, Hotel Awadhvue, Grand Ten Eleven, Hotel Blue Marine, Hotel Arshvue, Hotel The Bellevue**. For each, confirm it belongs in the portfolio, then send: address, star rating, phone (if different from central reservations), room categories, amenities, photos, Google Maps link.

Leads from public listings (unverified, **not** shown on the site):

| Hotel | Public listing says |
|---|---|
| The Grand Euro | Listed as "Treebo Grand Euro, Pipliyahana Square", Indore 452016 |
| Hotel Awadhvue | Listed as "Treebo Awadhvue, Vijay Nagar" and "Fabhotel Awadhvue, EC-60 Ring Road, Scheme 94C" |
| Grand Ten Eleven | Listed as "Treebo Ten Eleven Grand, Scheme 78" |
| Hotel Blue Marine | Bombay Hospital Service Rd, Indore 452001 (Hotels.com) |
| Hotel The Bellevue | EC 39 Sector C, Scheme 94, Indore 452010 (Expedia/Hotels.com) |
| Hotel Arshvue | No public listing found |

## 5. Facts to double-check

- [ ] **Hotel Abhinandanam star rating.** The site shows **4-star**, based on the brochure line "two operating 3 & 4 star properties The Grey Circle, Abhinandanam".
- [ ] **Grey Circle email.** The site uses `hotelthegreycircle@gmail.com`; brochure 2 prints `hotelthegreycricle@gmail.com`. Fix the brochure if the site spelling is right.
- [ ] **Domain.** Brochure 2 footer says `www.abhinandanam.com`; brochure 1 and the live site use `.in`. The site uses `.in`.
- [ ] **Printed brochure QR codes.** Both "Scan for Location" QR codes are the same image and open **The Grey Circle** on Google. The Abhinandanam QR is wrong.
- [ ] **"5.0 / 4.5 Guest Rating" badges** in the brochure: what's the source? Not shown on the site until confirmed.
- [ ] **"1500+ registered loyalty clients" and "98% customer satisfaction"** are shown on the site from the brochures. Confirm they're current.
- [ ] **Google Maps pins.** The site uses the Google places "Hotel Abhinandanam" (22.7497, 75.8998) and "Hotel the Grey Circle" (22.7654, 75.8861). Confirm these are the official listings.
- [ ] **Room descriptions for The Grey Circle.** The brochure gives names only; the site uses neutral one-liners. Send approved copy.
- [ ] **Banquet details.** Abhinandanam: confirm 2 halls / up to 100 guests per hall or in total, and catering options.
