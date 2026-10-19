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
```css
--cream: #FBF6EE;  --sand: #F1E6D6;  --copper: #B5652E;  --copper-dark: #8A4A1F;
--teal: #2F8A7A;   --ink: #2B2420;   --gold-line: #D9B98C;
```
**Contrast check (WCAG 2.1), computed:**
| Pair | Ratio | Verdict |
|---|---|---|
| copper #B5652E on cream | ~4.0 : 1 | Fails body text (4.5). OK only for large headings (>=24px) |
| copper on sand | ~3.5 : 1 | Large text only |
| copper-dark #8A4A1F on cream | ~6.3 : 1 | Pass: use for small accent text and links |
| teal #2F8A7A on cream, or white on teal | ~3.9 / ~4.2 : 1 | **Fail**. Add `--teal-dark` (~#23695D, ~6 : 1) for badges and text |
| ink on cream | >13 : 1 | Pass |

Rules: copper for display headings only; copper-dark for eyebrows, links and small accents; teal is decorative, teal-dark is for text and badges.
Motif: arched "temple-window" frames (`border-radius: 999px 999px 0 0`), thin gold line dividers drawn as our own inline SVG. 8px grid, 1200px max width.

## 5. Data model
As specified in the brief (`Hotel`, `RoomCategory`), with these deliberate changes:
- `geo`, `mapEmbedUrl`, `connectivity`, `stars` are **optional**: Pradesha and the 6 placeholder hotels have no verified values, and we don't invent them
- `content?: 'complete' | 'placeholder'`: placeholder hotels render a slim page (overview, location, policies, booking card)
- `featured?: boolean`: drives the 3 arched cards on Home and the top of menus
- `gallery[].isRender?: boolean`: Pradesha images are 3D renders, labelled "Artist's impression"
- `banquet` gains `capacityLabel` ("Up to 100 guests" / "250+ guests") and `useCases`
- `policies?: { idProof, pets, cancellation }` (all TODO)
- Directions links are built from `geo` (`lib/contact.ts → directionsHref`), so no separate `mapsUrl`

## 6. Content facts (from the brochures; verified)
- **Hotel Abhinandanam**: Plot No. 2, Ratanlok Colony, Scheme No. 53, Vijay Nagar, Indore 452010. Google Maps pin 22.7496662, 75.8997584 (place "Hotel Abhinandanam", /g/11w8r8krd_). Rooms: Standard, Executive, Corporate Executive, Family, Suite, Executive Suite (each has a brochure photo + one-line description). 2 banquet halls up to 100 guests. Rooftop restaurant + pool. Airport 20 / Railway 15 / Metro 5 min.
- **The Grey Circle**: 192, Scheme No. 78, Part II, Vijay Nagar, Indore 452010. Google Maps pin 22.7653677, 75.8861222 (/g/11ldqrk2f6). 3-star. Rooms: Deluxe, Premium, Executive, Suite (photos for Deluxe, Executive, Suite only). Airport 25 / Railway 20 / Metro 10 min.
- **Pradesha by Abhinandanam**: coming soon, 4-star, address TBA. Rooms: Deluxe, Executive, Twin/Corporate, Family, Suite, Executive Suite (render for each). Banquet 250+, infinity pool, cafeteria, gym, jacuzzi rooms. Airport 25 / Railway 20 / Metro 2 min.
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

## 8. Image inventory (49 photos + 3 logos, 5.7 MB total)
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
- **Home hero has no photo (user request, 2026-10-18).** It's logo-led: the Abhinandanam mark (`#hero-logo`), "Hospitality Beyond Stays", sub-line, values, Call/Explore buttons and trust row, centred on a static brand-colour glow (`.hero-glow`). The phone CTA is now above the fold on every phone.
- **Header logo**: removed then **restored** at the user's request. It's a small copy of the hero/intro mark (`brand/abhinandanam-mark-sm.webp`, 113x112, ~8 kB, made by `npm run images`) next to the "Abhinandanam / Hospitality" name.
- **Hero headline** (user asked for a better font): brochure-cover lockup with "HOSPITALITY" in spaced copper capitals (copper→copper-dark gradient) over "Beyond Stays" in Cormorant 600 *italic* (`.hero-title-main` / `.hero-title-sub` in `globals.css`). Adds one italic font file.
- **Hero side photos** (user: "fill the void"): desktop only (lg+). A tall arched photo per side (rooftop pool · The Grey Circle) with a round photo on its outer corner from xl+ (lobby · Executive Suite). Hidden + lazy on phones, so no download cost there. Configure in `HERO_PHOTOS` in `app/page.tsx`.
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

## 13. Task log
- **2026-10-18** Step 0 done. Copied brochures to `assets/source/`; extracted text (`brochure-1.txt`, `brochure-2.txt`) and 146 raw images (`assets/raw/`); mapped room photos to categories using their positions on the brochure pages; cropped Canva-masked photos to their largest clean rectangle; produced 49 WebP photos (+800 variants), 3 transparent logos and 4 OG JPGs (`scripts/build_brochure_images.py`). Decoded the brochure QR (both point to Grey Circle). Looked up Google Maps pins for the 2 operating hotels. Reviewed 8 competitor sites + the current Wix site. **Next:** client answers on open questions, then scaffold.
- **2026-10-18** Scaffolded Next 14 + TS + Tailwind (static export, trailing slashes). Built tokens/layout (Header with Hotels dropdown + mobile menu, Footer, MobileBar, ClickTracker, RevealObserver), `data/` (site, 9 hotels, empty reviews), Home, hotel detail template (photo header + lightbox, scroll-spy sub-nav, sticky booking card, rooms, amenities, dining/pool, banquets, location, policies, gallery, cross-sell), listing with filters, gallery with filters + lightbox, Banquets, About, Contact (mailto/WhatsApp composer), 404, sitemap, robots, Organization/Hotel/Breadcrumb JSON-LD, per-page canonical + OG images.
- **2026-10-18** Verification: `npm run build` clean (22 static pages, ~102–107 kB first-load JS); type-check + lint clean; 33/33 headless interaction checks (lightbox keys/swipe/focus trap/focus return/tabs, room carousel, scroll-spy, dropdown, mobile menu, mobile bar per-hotel links, listing + gallery filters, track() events, coming-soon + placeholder states); no horizontal overflow at 360/1280.
- **2026-10-18** Perf/a11y pass: 400/800 WebP variants for every photo (hero 93→66 KB), favicon 78→3 KB, single Cormorant weight, hero no longer `decoding=sync`, valid `<dl>` markup, logo link + gallery button names, chip badge contrast. Lighthouse results in section 14.

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
