# context.md: Abhinandanam Hospitality website

> Single source of truth for this build. Read this instead of re-scanning the repo.
> Updated after every task (see the **Task log** at the bottom).

## 1. What we're building
A static marketing site for **Abhinandanam Hospitality Pvt. Ltd.** (Indore, MP). Its one job is to get a visitor to **call or WhatsApp**. There's no booking engine, no prices and no date pickers.

## 2. Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS, `output: 'export'` (static HTML into `out/`)
- Images: pre-generated WebP (`<name>.webp` max 2000w q80, never upscaled, plus `-400.webp` / `-800.webp` q72 from `npm run images`), plain `<img srcset>` with intrinsic width/height from `data/image-meta.json`; lazy below the fold, hero preloaded with `fetchpriority=high`
- Motion: fade-up on scroll only (IntersectionObserver + CSS, 500ms, 12px), off under `prefers-reduced-motion`
- Icons: `lucide-react` 1.50 (brand icons were removed in 1.x, so Instagram/Facebook/LinkedIn are hand-drawn SVGs in `SocialIcons.tsx`). Fonts: Cormorant Garamond **600 only** (headings, lining numerals forced) + Inter (body) via `next/font/google`, self-hosted at build
- No UI kit, animation lib, carousel lib or jQuery

## 3. Folder structure
```
abhinandanam-site/
  app/                     routes (/, /hotels, /hotels/[slug], /banquets-events, /gallery, /about, /contact)
  components/              hand-built UI: Header (dropdown + mobile menu), MobileBar (Call|WhatsApp|Directions, adapts per hotel),
                           Lightbox (portal, focus trap, keys, swipe, tabs), PhotoHeader (1+4), SubNav (scroll-spy), RoomCard (manual carousel),
                           BookingCard, HotelArchCard, HotelsBrowser (listing filters), GalleryBrowser (masonry filters), Mosaic, ThumbGrid,
                           CallBand, ConnectivityTable, MapEmbed (lazy iframe), EnquiryComposer (mailto/WhatsApp, no backend),
                           ClickTracker (one document listener -> track()), RevealObserver (fade-in), CountUp, Breadcrumbs (+JSON-LD), JsonLd
  data/hotels.ts           ALL hotel content. Add a hotel = add one entry + one image folder
  data/reviews.ts          empty until the client supplies real Google reviews (section auto-hidden)
  data/site.ts             brand, phones, emails, socials, stats, home mosaic picks
  data/image-meta.json     generated: [width, height, ...variantWidths] per image
  lib/hotels.ts            derived data: sortedHotels, featured, counts, cities, gallery helpers, varietyOrder()
  lib/contact.ts           tel / wa.me / mailto / directions builders + context-aware WhatsApp texts
  lib/track.ts             track(event) shim (no-op until gtag/fbq present)
  lib/images.ts            srcset + intrinsic size lookup;  lib/seo.ts  pageMeta() + hotelJsonLd()
  lib/amenity-icons.ts     amenity label -> lucide icon (regex rules, fallback Check)
  public/images/hotels/<slug>/   site photos (<slug>-<category>-<n>.webp + -400/-800 variants)
  public/images/brand/     logos (transparent WebP)
  public/images/og/        1200x630 social share JPGs
  assets/source/           the two brochure PDFs + extracted text (brochure-1.txt, brochure-2.txt)
  assets/raw/              146 raw PDF image extracts (kept OUT of public/: 79 MB would ship with the site)
  scripts/                 build_brochure_images.py + brochure-images.json (one-off: PDF -> WebP), optimize-images.mjs (`npm run images`)
```
**Deviation from brief:** raw extracts live in `assets/raw/`, not `public/images/raw/`, because anything in `public/` is deployed.

## 4. Design tokens
**Current (2026-10-30, user: "use this green and white combination everywhere"): "Forest & white".** Every section is dark green (or a photo); white text, all-white logos and white CTAs; pale jade accents. `DESIGN.md` is the up-to-date spec; the "Emerald & gold" notes below are history. Token names were kept (cream = page green, ink = white text, gold = white, brass = pale jade, new `deep`).

**Current (2026-10-25, user: "more luxury look instead of this white and green pastel"): "Emerald & gold".** The logo's jade greens deepened to emerald (like the Pradesha logo), plus the brass/champagne of the hotels' lighting and marble, on ivory. Dark emerald carries the header (all pages), footer, stats, call band, "Why stay with us" and the banquet card; gold is the call-to-action colour. (Same day it was briefly "espresso, brass & marble"; before that the brochure's orange copper.) Tokens were renamed: `copper`/`copper-dark` -> `brass`, `copper-deep` -> `brass-deep`.
```css
--cream: #F6F1E7 (ivory);  --sand: #EAE1CF (champagne);  --ink: #10231F (emerald-black: text + dark sections);
--brass: #7E5B2A (eyebrows, icons, links);  --brass-deep: #5C411D;  --gold-line: #C8A46C (rules, CTA buttons, text on ink);
--teal: #2F8A7A;  --teal-dark: #23695D (WhatsApp, badges);  --muted: #57625C
```
**Contrast check (WCAG 2.1), computed:**
| Pair | Ratio | Verdict |
|---|---|---|
| ink on cream / sand | 14.6 / 12.6 : 1 | Pass |
| brass #7E5B2A on cream / sand | 5.5 / 4.7 : 1 | Pass: small accent text; white on brass 6.2 : 1 |
| ink on gold (primary buttons) | 7.0 : 1 (hover #B8925A: 5.7 : 1) | Pass |
| gold on ink / cream on ink | 7.0 / 14.6 : 1 | Pass |
| logo jade #669A8E on ink (header, footer) | 5.1 : 1 | Pass |
| teal-dark on cream; white on teal-dark | 5.7 / 6.5 : 1 | Pass |
| muted #57625C on cream | 5.6 : 1 | Pass |
| gold on cream | 2.1 : 1 | Decorative only (rules, never text) |

Rules: headings (`.h-section`, `.h-display`) in ink; `.eyebrow` brass with 0.28em tracking; `.btn-primary` = gold with ink text (works on ivory, emerald and photos); outline buttons and links brass; gold is text only on ink; teal-dark for WhatsApp. Corners are tighter than before (buttons `rounded-md`, cards/photos `rounded-lg`/`rounded-xl`). `SectionHeading tone="dark"` for emerald sections.
Motif: thin gold line dividers drawn as our own inline SVG. The arched "temple-window" hotel cards were retired on 2026-10-25 (user: "looking bad"); only the About page's single arched photo still uses `.arch`. 8px grid, 1200px max width.

## 5. Data model
As specified in the brief (`Hotel`, `RoomCategory`), with these deliberate changes:
- `geo`, `mapEmbedUrl`, `connectivity`, `stars` are **optional**: Pradesha and the 6 placeholder hotels have no verified values, and we don't invent them
- `content?: 'complete' | 'placeholder'`: placeholder hotels render a slim page (overview, location, policies, booking card)
- `featured?: boolean`: drives the 3 arched cards on Home and the top of menus
- `gallery[].isRender?: boolean`: Pradesha images are 3D renders, labelled "Artist's impression"
- `banquet` gains `capacityLabel` ("Up to 100 guests" / "400+ guests" / "Ask for capacity") and `useCases`; `capacity` is optional (Grey Circle unknown)
- `policies?: { idProof, pets, extraBed, children, cancellation }` + `rules?: string[]` (house-rules checklist), from MakeMyTrip; cancellation still TODO
- `rooms[].bed` (e.g. "1 king bed"); `logo` (used by the home "Ways to stay" wall)
- `CHECK_IN` / `CHECK_OUT` constants (12:00 PM / 10:00 AM) apply to every hotel
- Directions links are built from `geo` (`lib/contact.ts → directionsHref`), so no separate `mapsUrl`

## 6. Content facts (from the brochures; verified)
- **Hotel Abhinandanam**: Plot No. 2, Ratanlok Colony, Scheme No. 53, Vijay Nagar, Indore 452010. Google Maps pin 22.7496662, 75.8997584 (place "Hotel Abhinandanam", /g/11w8r8krd_). Rooms: Standard, Executive, Corporate Executive, Family, Suite, Executive Suite (each has a brochure photo + one-line description). 2 banquet halls up to 100 guests. Rooftop restaurant + pool. Airport 20 / Railway 15 / Metro 5 min.
- **The Grey Circle**: 192, Scheme No. 78, Part II, Vijay Nagar, Indore 452010. Google Maps pin 22.7653677, 75.8861222 (/g/11ldqrk2f6). 3-star. Rooms: Deluxe, Premium, Executive, Suite (photos for Deluxe, Executive, Suite only). Airport 25 / Railway 20 / Metro 10 min.
- **Pradesha by Abhinandanam**: coming soon, 4-star, address TBA (not on Google Maps; map shows Indore). Rooms: Deluxe, Executive, Twin/Corporate, Family, Suite, Executive Suite (render for each). Banquet **400+** (client update 2026-10-25; brochure said 250+), infinity pool, cafeteria, gym, jacuzzi rooms. Airport 25 / Railway 20 / Metro 2 min.
- **MakeMyTrip (checked 2026-10-25)**: both hotels list check-in 12 PM / check-out 10 AM. Abhinandanam rooms (max guests / sq ft / bed): Standard 2/110/king, Executive 3/200/king, Corporate Executive 3/230/king, Family 4/300/2 doubles, Suite 3/300/king, Executive Suite 3/345/queen; MMT rating 4.3 (317). Grey Circle (`hotel_the_grey_circle_vijay_nagar`): Standard 120, Deluxe 3/180/queen, Premium 3/260/king, Executive 3/270/queen, Suite 4/650; restaurant, banquet, conference room listed; MMT 3.2 (13). Rules and extra-bed charges are in `data/hotels.ts`.
- **Linktree** (linktr.ee/abhinandanam): WhatsApp 82258 22569 (site now uses it), Google review link `g.page/r/CWbGaGaB-lHKEBI/review`, menu on fliphtml5.
- Room one-liners (brochure 2): Standard "A comfortable and value-for-money stay with modern amenities." · Executive "Perfect for business and leisure seeking extra comfort." · Corporate Executive "Ideal for business travelers with enhanced space and modern facilities." · Family "Spacious and comfortable stay for families." · Suite "A luxurious stay with exclusive amenities." · Executive Suite "An expanded space with premium comfort and elegance." Pradesha variants: Deluxe "A perfect blend of style and convenience." · Executive "Modern rooms designed for a relaxed and premium stay." · Corporate "Ideal for business travelers with modern facilities."
- Socials: `/abhinandanamhospitality` on Instagram, Facebook **and LinkedIn** (LinkedIn icon on the brochure contact page).

## 7. Brochure discrepancies (need the client's call)
1. **Abhinandanam star rating.** The brochure says "two operating **3 & 4 star** properties The Grey Circle, Abhinandanam". Grey Circle is 3-star, which implies **Abhinandanam is 4-star**. The brief doesn't say.
2. **Grey Circle email.** Brochure 2 prints `hotelthegreycricle@gmail.com` ("cricle"); the brief says `hotelthegreycircle@gmail.com`. One is a typo.
3. **Domain.** Brochure 2 footer says `www.abhinandanam.com`; brochure 1 and the live site use `.in`.
4. **QR codes.** Both "Scan for Location" QR codes are the *same image* and resolve to **Hotel The Grey Circle** on Google. The Abhinandanam QR in the printed brochure is wrong.
5. **Guest-rating badges.** Brochure shows "5.0 Guest Rating" (Abhinandanam) and "4.5" (Grey Circle), source not stated. **Not used** until the client confirms the source (Google?).
6. Grey Circle has 4 categories in brochure 1 but 3 in brochure 2 (no "Premium" photo).
7. Pradesha's "Twin/Corporate" (brochure 1) is "Corporate Executive" in brochure 2.
8. Two Abhinandanam rooftop pool photos carry a small photographer watermark (bottom-right). Confirm usage rights.

## 8. Image inventory
**2026-10-25:** 57 professional photos from the client's Google Drive ("Abhinandanam profile and pictures", "Hotel The Grey Circle") replaced every brochure room photo and all Grey Circle photos, and added Abhinandanam night facade, lobby, restaurant and pool shots. Downloaded via Drive's resized-image endpoint at 2400w (RAW .CR3 files skipped), picked from contact sheets, named `<slug>-rooms-<category>-<n>` etc. Several outdoor/pool shots carry the photographer's small credit, like the brochure ones. The table below is the original brochure set (Abhinandanam exterior/lobby/pool/dining/events and Pradesha are still from it). The hotels folder is now ~12.7 MB of WebP.

| Hotel | exterior | lobby | rooms | dining | pool | events |
|---|---|---|---|---|---|---|
| abhinandanam | 4 | 4 | 9 (all 6 categories + jacuzzi) | 3 | 2 | 5 |
| the-grey-circle | 3 | 2 | 3 (Deluxe, Executive, Suite) | 1 | 0 | 0 |
| pradesha (renders) | 2 | 3 | 7 (all 6 categories) | 0 | 0 | 1 |

Facade at dusk `abhinandanam-exterior-1` (968x776, cropped out of a shaped Canva frame) is the flagship cover and OG image; the home hero no longer uses a photo. The largest brochure photo is ~1400px wide, so nothing reaches 2000px. Real photography is needed for a crisp full-bleed hero on large screens.
Missing: Grey Circle Premium room, Grey Circle dining/banquet, Pradesha infinity pool/gym/cafeteria, Abhinandanam gym/parking/conference. Dropped: logos, gold wave line art, backgrounds, rating badges, train icon, QR, 3 stock-style shots (hand + key card, traveller with suitcase).

## 9. Competitor review (measured 2026-10-18 in the in-app browser, ~800px wide viewport)
| Site | Phone reachable? | Weight / requests | Does well | Does badly |
|---|---|---|---|---|
| **Taj** (Taj Mahal Palace) | first `tel:` link ~2,770px down (~4.5 screens) | 1.5 MB / 250 req, DOMContentLoaded ~4s | Sticky sub-nav (Overview, Rooms, Dining, Venues...), editorial storytelling, heritage photography | Hero blank (sky) while loading; phone buried; 257 images on one page; booking-first CTAs only |
| **ITC** (ITC Maratha) | `tel:` only in hidden menu/footer | **8.3 MB** / 232 req, 9,500px tall page | Booking bar in hero, clear section headings (Accommodation, Dine, Weddings) | Promo overlay covers the hero; cookie banner covers bottom; very long page |
| **The Leela** (Palace New Delhi) | first visible `tel:` ~3,650px (footer) | 1.4 MB, **3 autoplay videos** | Strong luxury tone; enquiry forms for events | Hero is a mood close-up of a face, not the hotel; autoplay carousel; phone in footer only |
| **Lemon Tree** (Indore) | **no `tel:` link at all** | 5.9 MB / 128 req | **1 large + 4 grid photo header**, sticky sub-nav, breadcrumbs, Google + TripAdvisor scores next to name | Can't tap to call; heavy; 12+ sections incl. offers and loyalty upsell |
| **Treebo** (Indore listing) | no `tel:`; 1 WhatsApp link | 0.3 MB (fast) | Filter sidebar, price-sorted cards, clear ratings | **Sign-in modal blocks the page on load**; OTA clutter |
| **OYO** (Indore listing) | no `tel:` | 1.2 MB, **13,500px** tall | Card grid with thumbnail strip, amenity icons, rating chips | Urgency nags ("8 people booked..."), discount noise, generic photos |
| **Booking.com** (Lemon Tree Indore) | no `tel:` | 4.9 MB / **393 req**, 171 visible links/buttons | Photo grid, "Most popular facilities" icons, nearby places + transit times, house rules | Cluttered: members-only upsells, ads, availability table above the fold |
| **Airbnb** (Indore listing) | n/a | 1.7 MB | **1+4 photo grid + "Show all photos"**, sticky booking card, highlights with icons, "Where you'll sleep" | Requires dates to show prices; no phone by design |
| **abhinandanam.in** (current Wix site) | **zero `tel:` links** | 1.0 MB / 140 req | Lists the hotels in nav | 9 "Check Property" cards with no text; extra-hotel pages are just a contact form; footer email is literally `mailto:info@wix.com` |

**Where we beat them:**
- (a) **Phone in under 1 second**: "Call to Book" in the header on every page, a sticky mobile bottom bar (Call | WhatsApp | Directions), and the booking card on every hotel page. Nobody above has a visible tap-to-call above the fold.
- (b) **Photo-first hotel pages**: Airbnb/Lemon Tree 1+4 grid plus a full lightbox with category tabs.
- (c) **Room clarity**: each category gets a real photo, a one-liner and a "Call about this room" button with prefilled WhatsApp text. OTAs bury this in tables.
- (d) **Mobile**: no modals, no cookie walls (no tracking cookies by default), no autoplay, about 1 screen to the phone number. Target page weight under 1 MB.

### 9b. Brand-site review (2026-10-25, the client's picks: Aman, Four Seasons Private Jet, Hilton, Oberoi, Sayaji)
Homepages only; 1440px headless screenshots + in-app browser (~1024px). Weights are browser `transferSize` totals, so roughly a lower bound.
| Site | Phone on homepage | Weight / requests | Hero | How you book |
|---|---|---|---|---|
| **Aman** | none (WhatsApp in footer) | 1.4 MB / 61 | full-bleed film with pause control, tiny serif caption | "Reserve" button, top right |
| **Four Seasons Private Jet** | `tel:` ~5,400px down, in a contact card | 6.2 MB / 250 | "THE WORLD AWAITS" + search, then full-bleed image | journey finder + "Your journey begins here" card (phone/email) |
| **Hilton** | footer only | 6.1 MB / 430 | offer headline on dark | booking bar under the nav, **sticky** on scroll |
| **Oberoi** | none | 2.3 MB / 158 | video | booking bar docked on the hero's bottom edge |
| **Sayaji** (Indore rival) | none, no WhatsApp | 1.2 MB / 82 | full-screen lobby slideshow | floating glass "pill" (dates, hotel, guests, Reserve) |

**What they do well:** Aman: restraint (whitespace, one card style: image, eyebrow, serif title, one line, link; "Now open" labels; experiences before rooms). FS Jet: shows the *people* (round staff portraits), one big guest quote, 6 icon value props, category tiles. Hilton: "stays by type" tiles, "Book with confidence" (reasons to book direct), the "Ways to stay" logo wall (built). Oberoi: themed horizontal shelves across all hotels (Dining, Wellness, Experiences, Offers, Events with capacity in the card), brand-story intro, awards row. Sayaji: named wedding offer ("Shubh Vivah"), fast-ish page, but thin homepage (no hotel list, no rooms, no phone).

**Don't copy:** hidden phone numbers, hamburger-only nav on desktop (Aman, Sayaji), 6 MB pages, cookie/sign-in pop-ups, offer-led heroes (we have no offers), autoplay without a pause button.

**Recommended for us (priority order):** 1) an availability "pill" (hotel, dates, guests) that opens WhatsApp/call with the details pre-filled, later the real booking bar; 2) cinematic photography now that pro photos exist: a full-bleed photo band or slow slideshow (optionally one of the Drive .mp4s as a muted loop with pause); revisits the 2026-10-18 "no hero photo" call, so the user decides; 3) "Find your stay" occasion tiles (business, family, celebrations, rooftop evenings, meetings) deep-linking into hotel sections; 4) Oberoi-style Venues and Dining shelves across hotels, capacity on each card; 5) social proof band (Google 4.9 from 1,111 reviews for Hotel Abhinandanam, MakeMyTrip 4.3 from 317) + 3 real quotes, client OK needed; 6) "Why book direct" strip with client-confirmed reasons; 7) editorial polish: one card system, fewer chips/borders, bigger images; 8) "Meet the team" portraits (needs photos).

## 10. Open questions
**Answered by the user (2026-10-18):** add the 6 extra hotels as full placeholder pages · Abhinandanam = 4-star · Grey Circle email = `hotelthegreycircle@gmail.com` · leave the brochure guest-rating badges out.

Still open with the client (full list in `TODO-content.md`):
1. **The 6 extra hotels on abhinandanam.in** (Grand Euro / The Grand Euro, Hotel Awadhvue, Grand Ten Eleven, Hotel Blue Marine, Hotel Arshvue, Hotel The Bellevue): are they in the portfolio? Note: Treebo lists "Treebo Ten Eleven Grand, Scheme 78" and "Treebo Awadhvue, Vijay Nagar", so they may be franchise/managed properties. The live site has no info on any of them.
2. Abhinandanam star rating (see section 7, item 1).
3. Grey Circle email spelling (section 7, item 2).
4. Can we show the 5.0 / 4.5 guest-rating badges? Source?

## 11. TODO placeholders
The full owner-facing list is in **`TODO-content.md`**. In code, every gap is marked `TODO` (run `grep -rn TODO app components lib data`):
- `data/site.ts`: WhatsApp Business number (assumed = +91 82258 22585), exact LinkedIn URL
- `data/hotels.ts`: check-in/out + policies (Abhinandanam, Grey Circle), room `occupancy` / `sizeSqft` (all 16 categories), Grey Circle room copy + Premium photo, Pradesha locality/address/geo/map, the 6 placeholder hotels (city/area/address/everything)
- `data/reviews.ts`: real Google review quotes (section hidden while empty)
- `app/hotels/[slug]/page.tsx`: Pradesha infinity-pool render (placeholder image), policy text
- `components/RoomCard.tsx`, `components/BookingCard.tsx`: show "On request" / "Ask the front desk" until data arrives
- Photos: 2000px+ originals; watermark rights on `abhinandanam-pool-2` and `abhinandanam-dining-1`

## 12. Decisions made during the build
- **Home hero = full-screen photo slideshow (user request, 2026-10-25; replaces the 2026-10-18 logo-led, photo-free hero).** `components/HeroSlideshow.tsx`: height = screen minus header (620–960px), 6 pro photos (`HERO_SLIDES` in `app/page.tsx`, the first is the LCP image, preloaded with `fetchpriority=high`), crossfade + slow zoom, 6.5 s each, Pause button + progress bars, caption + "View" link, still for reduced motion, loads one photo ahead. Over it: the logo in a cream disc (`#hero-logo`, so the opening intro still lands there), "HOSPITALITY / Beyond Stays" in white + gold (`.hero-title-*`), the sub-line, Call to Book + Explore Hotels. The values line and trust row left the hero (the stats band still has them).
- **Header logo**: removed then **restored** at the user's request. It's a small copy of the hero/intro mark (`brand/abhinandanam-mark-sm.webp`, 113x112, ~8 kB, made by `npm run images`) next to the "Abhinandanam / Hospitality" name.
- **Hero headline** (user asked for a better font): brochure-cover lockup with "HOSPITALITY" in spaced copper capitals (copper→copper-dark gradient) over "Beyond Stays" in Cormorant 600 *italic* (`.hero-title-main` / `.hero-title-sub` in `globals.css`). Adds one italic font file.
- ~~Hero side photos~~ (arched photos beside the logo hero) were removed with the logo hero on 2026-10-25.
- **No mixed-hotel photo walls** (user request): the Gallery page is one section per hotel (own photos, own lightbox, jump links), and the home "Take a look inside" block has one section per featured hotel (`components/HotelPhotoSection.tsx`). The old mixed mosaic and gallery filters were removed.
- **Photo "trains"** (user request: same as the Appstle v2 site, `appstle-site/v2` → `buildMarquee`): each hotel's photos run as an infinite horizontal marquee (`components/PhotoTrain.tsx`, `.train*` in `globals.css`). Constant ~40 px/s, rows alternate direction, edges fade, hover/focus pauses, a **Pause/Play** button per row (WCAG 2.2.2), tap opens that hotel's lightbox; reduced motion gets a still, swipeable row. Home shows up to 10 photos per hotel; Gallery shows all.
- **Lazy-loading gotcha (fixed):** clone tiles created by JS after hydration bypassed `loading="lazy"` and downloaded every photo at once (home mobile Perf fell to 75). Now the clone count is computed from known image sizes at render time, so clones are in the server HTML and stay lazy (home loads 4–5 images up front instead of 35).
- **Opening intro (user request; overrides the brief's "fade-in only" motion rule).** Brand + logo colours (copper, gold, sage #69A67D, aqua #16E8C1, teal) swirl together, fill the logo's shape, become the real logo, then the logo flies into `#hero-logo` while the overlay fades. ~2.7 s total. Guardrails: only when a visit starts on `/` (deep links from Google skip it); once per session (`sessionStorage`); off for `prefers-reduced-motion`; any click/tap/key skips; pure-CSS timeline with a 3.2 s self-ending fallback so the site is never stuck behind it; the page loads underneath. Files: `components/IntroSplash.tsx`, `.intro*` in `app/globals.css`, `INIT_SCRIPT` in `app/layout.tsx`, image `public/images/brand/abhinandanam-mark-lg.webp` (35 kB, only fetched when the intro or hero shows).
- **Hero sub-line** is computed: "{n} hotels · one vision · rooted in Indore, Madhya Pradesh". The brief's "3 destinations" no longer holds with 9 hotels.
- **Stats band** is computed from data: "8 + 1 hotels open + coming soon", "16 room categories" (the brief said 12+).
- **Home "Our hotels"** shows the 3 featured hotels as arched cards plus "View all 9 hotels"; the 6 placeholders appear on /hotels, in menus and in the footer.
- **Room cards** show 4 key in-room icons (Wi-Fi, AC, TV, tea/coffee); the full 13-item list lives in the Amenities section. Occupancy and size read "On request" until supplied.
- **Policies** render "Confirm when you book" until supplied. Hidden on the coming-soon page.
- **Grey Circle terrace photo** is filed under "Lobby & Spaces", not Dining: the brochure never mentions a Grey Circle restaurant.
- **Gallery order within a hotel**: round-robin by category (`varietyOrder`), so the first tiles show a bit of everything.
- **No cookie banner needed**: no tracking cookies by default; the Google Maps iframes are lazy (load only when scrolled near).
- **Contrast**: buttons use copper-dark (white text 6.8:1) and teal-dark (6.5:1); brand copper/teal only for large text or decoration.
- **Tokens** are stored as RGB channels in CSS (`--copper: 181 101 46`) so Tailwind opacity modifiers (`border-gold/50`) work.
- **Next 14 dev quirk**: `export const dynamicParams = false` on `/hotels/[slug]` makes `next dev` throw "missing generateStaticParams". Removed; static export already limits params to `generateStaticParams`.
- **Windows**: `npm run build` fails with EPERM/ENOTEMPTY if `next dev` or `serve out` is running. Stop them first.
- **`npm run images` on Windows** needed `sharp.cache(false)`: sharp kept the source .jpg open, so deleting it failed with EPERM.
- **"Ways to stay with Abhinandanam" (user request, Hilton pattern)**: home section after "Our hotels" (replaces the "View all hotels" button). Heading, hairline with a centred "Explore our hotels" pill, then a logo wall of all 9 hotels (5 per row on desktop), each linking to its page. Real logos for Grey Circle and Pradesha; Hotel Abhinandanam = mark + typeset name; the 6 others are typeset names until logos arrive. `components/WaysToStay.tsx`.
- **Availability pill (review rec. 1)**: hotel / check-in / check-out / guests / rooms; submit opens WhatsApp with the request typed out (`waText.availability`, nights computed; empty dates = "Dates: flexible"; Pradesha = pre-book), tracked as `whatsapp_click` with label `availability:<page>`. Home: overlaps the bottom edge of the photo hero. Hotel pages (open hotels): under the photo header with the hotel fixed; it replaces the phone-only Call/WhatsApp pair there (the sticky MobileBar still has both). `components/AvailabilityBar.tsx`. Intended to become the front end of the real booking system.
- **Cinematic photography (rec. 2)**: first built as a band under the logo hero, then (same day, user request) promoted to the hero itself; see the hero entry above.
- **"Find your stay" (rec. 3)**: 6 occasion tiles (business, family, weddings, meetings, rooftop evenings, suites) replace the old Stay / Dine / Celebrate / Explore grid; swipeable row on phones, 3x2 grid on desktop. Tiles deep-link to room cards, which now have ids (`roomAnchor()` in `lib/anchors.ts`, e.g. `#room-family-room`). `components/FindYourStay.tsx`.
- **Transparent header on home (user request, 2026-10-25)**: the hero slides up under the sticky header (`-mt-[var(--header-h)]`, height = full screen), and `Header` is transparent with white text on `/` until `scrollY > 24` or the mobile menu opens, then turns solid ivory. Other pages always have the solid header. Hero overlay is darker at the top for the nav.
- **Hero slide order**: the night facade is out of the hero (its lit sign sat behind the headline); the rooftop pool opens (LCP), then Executive Suite, Grey Circle rooftop, lobby, Grey Circle Premium Room, entrance.
- **"Our hotels" showcase (user: arched cards "looking bad")**: `components/HotelShowcase.tsx`, one editorial row per featured hotel, alternating sides (Aman / Oberoi): large photo + smaller inset photo on the inner corner (desktop; insets in `SHOWCASE_INSETS` in `app/page.tsx`, chosen not to repeat hero slides), star/area line, name, italic tagline, top 3 highlights, 3 facts from data (room types, minutes to airport, banquet guests or rooftop dining), "Explore the hotel" + Call. `HotelArchCard` was replaced by `components/HotelCard.tsx` (rectangular photo card) on hotel pages ("Other hotels") and About.
- **Logos (client artwork, 2026-10-25)**: horizontal logo in the header (`site.logoHorizontal`), stacked logo in the page body (hero, footer, JSON-LD: `site.logo`). Both get a raised ® after "LTD." (top aligned with the capitals, ~55% of their height, same green; superscript top-right is the usual convention, no legal size rule). Built by `scripts/build_logos.py` from `assets/source/logos/` (stacked: white removed with a matte that keeps the greens fully opaque on dark backgrounds). The old brochure logo file only remains as the favicon source for `npm run images`.
- **Header**: emerald-black on every page (ivory text, gold hover/active, gold Call button), transparent over the home hero until scroll. Browser `themeColor` #10231F.
- **Hero logo + intro**: the stacked logo replaces the logo disc and eyebrow. The intro's flying symbol lands on an invisible `#hero-logo` box placed over the symbol inside the stacked logo (left 16.4%, top 1.6%, width 67%, measured from the artwork); the logo image itself has `.hero-logo` so it stays hidden until the intro ends. A radial dark glow behind the centre keeps the jade logo legible on bright photos.
- **Pradesha map**: the address isn't public, so the Location section embeds a city-level Indore map with an "Exact location to be announced" overlay. Setting `geo` + a pinned `mapEmbedUrl` removes the overlay.
- **The Grey Circle** gained a banquet section ("Ask for capacity"), a Rooftop Dining section and a Standard Room (MakeMyTrip name; Drive calls it "Small Deluxe").

## 13. Task log
- **2026-10-18** Step 0 done. Copied brochures to `assets/source/`; extracted text (`brochure-1.txt`, `brochure-2.txt`) and 146 raw images (`assets/raw/`); mapped room photos to categories using their positions on the brochure pages; cropped Canva-masked photos to their largest clean rectangle; produced 49 WebP photos (+800 variants), 3 transparent logos and 4 OG JPGs (`scripts/build_brochure_images.py`). Decoded the brochure QR (both point to Grey Circle). Looked up Google Maps pins for the 2 operating hotels. Reviewed 8 competitor sites + the current Wix site. **Next:** client answers on open questions, then scaffold.
- **2026-10-18** Scaffolded Next 14 + TS + Tailwind (static export, trailing slashes). Built tokens/layout (Header with Hotels dropdown + mobile menu, Footer, MobileBar, ClickTracker, RevealObserver), `data/` (site, 9 hotels, empty reviews), Home, hotel detail template (photo header + lightbox, scroll-spy sub-nav, sticky booking card, rooms, amenities, dining/pool, banquets, location, policies, gallery, cross-sell), listing with filters, gallery with filters + lightbox, Banquets, About, Contact (mailto/WhatsApp composer), 404, sitemap, robots, Organization/Hotel/Breadcrumb JSON-LD, per-page canonical + OG images.
- **2026-10-18** Verification: `npm run build` clean (22 static pages, ~102–107 kB first-load JS); type-check + lint clean; 33/33 headless interaction checks (lightbox keys/swipe/focus trap/focus return/tabs, room carousel, scroll-spy, dropdown, mobile menu, mobile bar per-hotel links, listing + gallery filters, track() events, coming-soon + placeholder states); no horizontal overflow at 360/1280.
- **2026-10-18** Perf/a11y pass: 400/800 WebP variants for every photo (hero 93→66 KB), favicon 78→3 KB, single Cormorant weight, hero no longer `decoding=sync`, valid `<dl>` markup, logo link + gallery button names, chip badge contrast. Lighthouse results in section 14.

- **2026-10-30** `/impeccable init`: wrote `PRODUCT.md` (product truth for design work). User confirmed: primary guests = families & leisure + weddings & events (business travel secondary); an **own booking system is coming**, alongside the OTAs (not replacing them); no "book direct" benefit is confirmed, so no such claim on the site. Same day `/impeccable document`: wrote `DESIGN.md` (+ `.impeccable/design.json`) recording the current "emerald & gold" system; update it when tokens change.
- **2026-10-30** `/impeccable polish` (home + Hotel Abhinandanam, desktop): stats numbers now lining and top-aligned (CountUp's `tabular-nums` had turned lining off); banquet box reads "Up to / 100 / Guests"; "Wi‑Fi" uses a non-breaking hyphen in data (amenity regex updated); amenity icons align to the first text line; "Ways to stay" names share one baseline. Also removed every "best rate" claim (not confirmed) and fixed `.h-section` line-height. Production build verified at 1440px.
- **2026-10-30** Re-themed to forest green + white (user request): tokens in `globals.css`, new `deep` band colour, `bg-ink`→`bg-deep`, `text-cream`→`text-ink`, white cards→raised green, softer white hairlines; all-white logo copies (`scripts/build_white_logos.py`, `*-white.webp`) in header, hero, footer, intro and the logo wall (partner logos via `brightness-0 invert`); header border removed (it left a 1px light sliver above the hero). Build and lint clean; home + hotel page checked at 1440px.

## 14. Lighthouse (2026-10-18, local static build via `serve out`, Lighthouse 12.8)
| Page | Mobile Perf | A11y | Best Practices | SEO | Mobile LCP (simulated) | Desktop Perf / A11y / BP / SEO |
|---|---|---|---|---|---|---|
| Home | 95 (median of 3) | 100 | 100 | 100 | 2.86 s | 100 / 100 / 100 / 100 |
| Hotel Abhinandanam | 94 (median of 3) | 100 | 100 | 100 | 3.07 s | 100 / 100 / 100 / 100 |
| Gallery | 95 (median of 3) | 100 | 100 | 100 | 2.81 s | 99 / 96* / 100 / 100 |
| Hotels listing | 91 | 100 | 100 | 100 | 3.4 s | 100 / 100 / 100 / 100 |
| Pradesha | 92 | 100 | 100 | 100 | 3.2 s | 100 / 100 / 100 / 100 |
| Contact | 94 | 100 | 100 | 100 | 2.6 s | 100 / 100 / 100 / 100 |

\* Gallery desktop a11y was measured before the chip-badge contrast + button-name fix; the mobile re-runs after the fix score 100.

**After the design changes (logo hero + intro + side photos + photo trains), latest runs:** Home mobile 92 / 100 / 100 / 100 (LCP 3.1 s), desktop 100 / 100 / 100 / 100 · Gallery mobile 93–96 / 100 / 100 / 100 (LCP 2.7–3.1 s), desktop 100 / 100 / 100 / 100.

**Targets:** Perf >= 90, A11y >= 95, SEO 100, BP >= 95 are met on every page. **Mobile LCP < 2.5 s is not met in Lighthouse's simulation** (2.6–3.4 s). Measured directly, LCP on an unthrottled load is ~0.2–0.25 s and CLS is 0. Why: Lighthouse simulates a slow 4G link where the ~108 kB of Next.js/React runtime JS downloads alongside the 66 kB hero, all before LCP. What's left to try: a CDN with HTTP/2 + Brotli (real hosts, then re-measure with PageSpeed Insights), a lower-quality mobile hero (~-15 kB, ~-0.15 s), or dropping Inter for a system font (-48 kB; the brief asks for Inter).
- **2026-10-18** User changes: opening colour-to-logo intro that flies into the hero; home hero photo removed (logo-led hero); arched side photos in the hero; header logo removed then restored; brochure-style hero headline (copper caps + italic); galleries split per hotel (Gallery page + home strips). Interaction checks now 34/34 (gallery per-hotel sections + home strips replace the old filter tests).
- **2026-10-18** Photo trains (Appstle v2 marquee port) on Gallery + home, one per hotel, alternating direction, pause button, reduced-motion fallback. Fixed clone tiles defeating lazy loading. 38/38 interaction checks.
- **2026-10-25** Client changes: Pradesha banquet 250+ → 400+; check-in 12 PM / check-out 10 AM for all hotels; rules, amenities, room sizes/occupancy/beds pulled from MakeMyTrip for Abhinandanam + Grey Circle (policies grid + House rules list, bed on room cards); 57 Drive photos (section 8); Grey Circle banquet + rooftop dining; Pradesha city map; home "Ways to stay" logo wall; WhatsApp switched to the Linktree number. Build, type-check and lint clean. **Not done (needs decisions/inputs):** own booking system (needs a backend; the site is static), 360° tours (no 360 photos yet), competitor-inspired redesign (Aman, Four Seasons, Hilton, Oberoi, Sayaji).
- **2026-10-25** Built review recommendations 1–3: availability pill (home + open hotel pages, WhatsApp hand-off), cinematic photo band under the hero, "Find your stay" occasion tiles with room-card deep links. Checked in the browser (message text, empty-date and pre-book cases, slideshow timing/pause, anchors) and at 1440px; build, type-check and lint clean. Still uncommitted.
- **2026-10-25** Home hero replaced by the full-screen photo slideshow (logo disc + headline + buttons over the photos, availability pill on its bottom edge); old logo hero, side photos and `.hero-glow` removed. Desktop screenshot checked at 1440px; build clean. Still uncommitted.
- **2026-10-25** "Our hotels" showcase replaces the arched cards (new `HotelCard` elsewhere); site re-themed to espresso / brass / marble sampled from the hotel photos; hero now runs under a transparent home header. Checked at 1440px (home + hotel page; forced-render headless, since the hidden in-app pane doesn't fire IntersectionObserver); build and lint clean. Still uncommitted.
- **2026-10-25** Client logos with ® (header: horizontal, body: stacked); luxury "emerald & gold" theme (dark emerald header/footer/feature bands, gold CTAs, ink headings, tighter corners, tokens renamed to brass); "Why stay with us" is now a dark band. Verified on the production build at 1440px (dev-mode headless shots are unreliable); build and lint clean. Still uncommitted.
- **2026-10-30** Client round: "Hospitality / Beyond Stays" hero lockup removed (sr-only h1 kept); **no phone numbers shown anywhere** (buttons say "Call to book" etc., `tel:` links kept, meta descriptions scrubbed too); WhatsApp note under the availability pill removed. Theme is now **white pages + forest-green bands** (header, intro, hero, Why stay, stats, call band, footer): `:root` is the light token set, `.theme-dark` / `bg-deep` flip back to green. Home "Our hotels" is a full-bleed photo accordion (`HotelPanels`, CSS-only): hovered panel grows to 60% width and shows details; best photo per hotel = Abhinandanam `pool-new-2`, Grey Circle `exterior-front-2`, Pradesha `exterior-1`. `HotelShowcase` deleted. "Ways to stay" lists only the 6 non-featured hotels, no button. Checked at 1440px in dev; type-check + lint clean. Still uncommitted.
- **2026-10-30** Second pass (user: "too bright", wants darker luxury): **champagne & forest** palette. Page `#DDCDB4` champagne tan (pastel of the photos' caramel woods), cards/bands `#D2C0A2`, text forest `#1C3229`, accent deep bronze `#6B4A22`; green bands use champagne-gold `#D9BF8C` accents and a champagne button. Basis: luxury-palette guides (forest anchor + champagne/taupe neutrals + one metallic). Hotel panels trimmed to tagline + one line of 2 highlights + link (facts grid removed). "Ways to stay" compacted: one framed row of 6, smaller heading, less padding. Verified on a production build of a temp copy (the other session's `next dev` shares `.next`, so a second dev server hangs). Still uncommitted.
- **2026-10-30** Third pass (user: darker background that blends with the photos, screen as dim as the images): **charcoal, gold & forest**. Page `#181512` warm charcoal (darkest photo tones), cards `#24201B`, ivory text `#F0E8DA`, champagne-gold `#D6BA88` accents + primary buttons; forest-green header/footer/feature bands unchanged. Collapsed hotel-panel names scale 24-32px so long names fit on small laptops. Checked in `next dev` on :3000. Still uncommitted.
- **2026-10-30** Fourth pass (user: Drive had better photos; no repeats on the landing page; tint the photos). Crawled both Drive folders recursively: **436 JPGs in 18 subfolders** (plus 82 .CR3 raws, 2 .mp4), 348 not on the site (many bracketed near-duplicates). Added 10 new ones: Abhinandanam `exterior-night-3` (lit entrance), `lobby-new-4..9` (chandelier entrance, reception, mirrored-ceiling chandelier, lounges); Grey Circle `rooms-suite-5` (warm suite), `rooms-suite-6` (dark marble jacuzzi), `events-hall-3`. Hero slides now warm, low-light shots (lobby-new-4 first); Grey Circle panel = `rooms-suite-5`. Home page: `SHOWN_ABOVE` (hero + panels + same-view pool shots) is excluded from the photo strips and swaps occasion tiles to a backup photo; the tiles' photos are also kept out of the strips, so no photo appears twice (41 unique). Global photo tint in globals.css: `img[src*="/images/hotels/"]` gets brightness .8 / slight warm; hero slides and lightbox excluded. More Drive photos are still unused (room folders mostly duplicate what's on the site). Still uncommitted.
- **2026-10-30** Fifth pass: Abhinandanam panel photo = `exterior-night-3` (lit entrance; pool tent was too bright), removed from the hero. Panels: top 40% fades out of the page charcoal; closed panels dimmed to brightness .5, open one .8. Home "Take a look inside" photo strips removed (gallery page keeps them). Stats moved from their own green band into "Our hotels" under the heading (order now: heading, stats, 3 panels, 6 other hotels). Still uncommitted.
- **2026-10-30** Header is translucent smoked glass once scrolled (`rgb(18 16 14 / .42)` + backdrop blur/saturate; .88 opaque fallback without backdrop-filter); still transparent over the home hero. Map embeds (`MapEmbed`, all pages) get `.map-dark`: CSS invert + hue-rotate makes Google's map dark without an API key. Still uncommitted.
- **2026-10-30** Hotel panels are full screen (100svh, like the hero; phones: each stacked panel 100svh). `html { scroll-snap-type: y proximity }` + `.hx { scroll-snap-align: start }` (phones: each `.hx-panel`), so scrolling down from the "Our hotels" heading lands the panels exactly full screen; proximity means no trapping elsewhere (tested: wheel from 400px above snaps to the panels, wheel past them scrolls on). Still uncommitted.
- **2026-10-30** `components/PanelSnap.tsx` (client): once the stats row (`[data-snap-from]`) is fully on screen, the next downward wheel/trackpad/keyboard/swipe glides straight to `.hx` (panels full screen); trackpad flicks swallowed for 900ms while gliding; reduced motion jumps instantly; scrolling up untouched. Tested: one wheel tick from "stats just visible" lands panels at top 0; onward and back up scroll normally. CSS proximity snap kept for scrolling back into the panels. Still uncommitted.
- **2026-10-30** Home redesign below the panels. Order: hero, Our hotels (heading, stats, panels), **Find your stay** (minimal: 3x2 grid of tall photos, 2-3 word gold tag + title, no descriptions; Weddings tile now Grey Circle `events-hall-3`), **StayWithUs** (new `components/StayWithUs.tsx`, replaces `WaysToStay.tsx` + the 4-card "Why stay" band: one forest band, Drive photos `lobby-new-6` + inset Grey Circle `rooms-suite-6` on the left; 4 one-line reasons + the 6 other hotels as a 3x2 grid on the right), Location, Ready to stay. PanelSnap now also glides **up**: once the top of the section below the panels (`[data-snap-back]` on Find your stay) is on screen, the next upward scroll lands the panels full screen (phones: the last stacked panel). Removed the page-wide CSS `scroll-snap-type` (Find your stay's swipe-row tiles use `snap-start`, which the vertical snap caught and dragged the page down to). Tested both glides with real wheel input; no photo repeats on the home page (13 unique). Still uncommitted.
- **2026-10-30** (1) PanelSnap: one upward scroll from the panels (their top within half a screen of the top) glides straight to the hero (top 0). (2) Find your stay tiles landscape (`aspect-[3/2]`). (3) **Responsive = scale, not re-flow** (client): `tailwind.config.ts` screens `lg: 768px` (= md), so the desktop arrangement holds from tablet width up, sitewide; `html` font-size `clamp(12.8px, 100vw/90, 16px)` from 768px so rem text/spacing shrink to 80% by 1152px; header logo/links/padding use `clamp()`; hotel-page sidebar `minmax(220px,28%)` below xl (340px at xl); room-card buttons may wrap. Phones (< 768px) keep the stacked layout. Checked 800, 1024, 1440: no horizontal overflow, full nav visible, panels in a row. Still uncommitted.
- **2026-10-30** Background line art ("doodles", client asked for research-backed, still luxury). Research: luxury hotel/fine-dining sites use bespoke fine gold line art sparingly on dark grounds, tied to place, never competing with photos. New `components/Doodle.tsx`: hand-built inline SVG motifs (Rajwada-style jharokha `arch`, `lotus`, `paisley`, `rosette`, `chandelier`), champagne-gold at 13% alpha, hairline (`vector-effect: non-scaling-stroke`), aria-hidden, fade up via `.reveal`. Placed cropped at section edges: Our hotels heading (arch + rosette), Find your stay (lotus + paisley), StayWithUs (chandelier), Location (paisley), CallBand (pair of arches framing the CTA; CallBand appears on most pages). Never over photos. Still uncommitted.
