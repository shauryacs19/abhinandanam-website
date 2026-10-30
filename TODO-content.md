# Content to request from the hotel owner

Everything below is either missing from the brochures or contradicts itself. The site shows a neutral placeholder ("On request", "Confirm when you book", "Photos coming soon") until each item arrives. Where it goes in the code is in brackets.

## 1. Needed before launch

- [ ] **WhatsApp Business number.** The site now uses **+91 82258 22569**, the number behind the WhatsApp button on the official Linktree (linktr.ee/abhinandanam). Confirm. (The Linktree link itself is `wa.me/8225822569` without the 91 country code, so it doesn't open a chat: fix it to `wa.me/918225822569`.) [`data/site.ts` → `whatsapp`, `data/hotels.ts` → `GROUP_WHATSAPP`]
- [x] ~~Check-in / check-out times~~: 12:00 PM / 10:00 AM for every hotel (client, 2026-10-25; matches MakeMyTrip). [`CHECK_IN`, `CHECK_OUT` in `data/hotels.ts`]
- [ ] **Cancellation policy** for direct bookings. ID proof, pets, extra beds, infants and house rules are filled in from the MakeMyTrip listings (2026-10-25); confirm they're current. [`policies`, `rules`]
- [ ] **Room sizes / occupancy still missing:** Grey Circle Standard Room occupancy; all 6 Pradesha categories. The rest come from MakeMyTrip. [`rooms[].sizeSqft`, `rooms[].occupancy`, `rooms[].bed`]
- [ ] **Google review quotes.** 3 to 6 real reviews with first name + initial, hotel and month. The home "Guest reviews" section stays hidden until these are added. [`data/reviews.ts`]
- [ ] **LinkedIn page URL.** The brochure shows the LinkedIn icon with `/abhinandanamhospitality`; the exact company URL needs confirming. [`data/site.ts` → `socials.linkedin`]
- [ ] **Photo usage rights.** Two rooftop-pool photos (`abhinandanam-pool-2`, `abhinandanam-dining-1`) carry a photographer's watermark. Confirm we may use them, or get clean originals.

## 2. Photos

- [x] ~~Room-by-room photo sets~~ for Abhinandanam and The Grey Circle came from the client's Google Drive folders (2026-10-25), plus Grey Circle facade, lobby, rooftop, banquet and meeting room. Still wanted: a clean (2000px+) Abhinandanam facade-at-dusk and banquet-hall shots.
- [ ] **360° photos** of each hotel (lobby, rooftop/pool, banquet, one room per category) for a virtual-tour viewer. Needs a 360 camera (e.g. Insta360) or the Google Street View app's photo-sphere mode.
- [ ] **The Grey Circle banquet hall capacity** (the site says "Ask for capacity"). [`banquet.capacity`]
- [ ] **Hotel Abhinandanam**: gym, parking, conference room photos.
- [ ] **Pradesha**: renders of the **infinity pool**, gym and cafeteria (currently a placeholder image on its page).

## 3. Pradesha by Abhinandanam (coming soon)

- [ ] Address / locality and a Google Maps pin. Until then the page shows a map of Indore with "Exact location to be announced" (not on Google Maps yet). [`geo`, `mapEmbedUrl`]
- [x] ~~Banquet capacity~~: 400+ guests (client, 2026-10-25).
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
- [ ] **The Grey Circle room names.** MakeMyTrip lists Standard / Deluxe / Premium / Executive / Suite; the Drive folder calls the smallest one "Small Deluxe". The site uses MakeMyTrip's "Standard Room".
- [ ] **MakeMyTrip facts now on the site:** smoking allowed / alcohol not allowed at The Grey Circle; Abhinandanam rooftop pool open 10 AM–5 PM, closed Saturdays. Confirm.
- [ ] **Logos for the 6 other hotels** (the home "Ways to stay" wall shows their names in type until then).
- [ ] **Banquet details.** Abhinandanam: confirm 2 halls / up to 100 guests per hall or in total, and catering options.
