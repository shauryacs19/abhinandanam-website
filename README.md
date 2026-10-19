# Abhinandanam Hospitality website

Marketing website for **Abhinandanam Hospitality Pvt. Ltd.** (Indore, MP). There's no booking engine: every page is built to get the visitor to **call or WhatsApp**.

- **Stack:** Next.js 14 (App Router) + TypeScript + Tailwind CSS, exported as plain static HTML (`out/` folder)
- **Content:** everything lives in `data/` (one file per topic). No page code changes are needed to edit hotels.
- **Project notes:** see [`context.md`](context.md) (decisions, design tokens, competitor research, open questions) and [`TODO-content.md`](TODO-content.md) (what to ask the hotel owner for).

---

## 1. Run it on your computer

You need **Node.js 20 or newer** (`node -v` to check).

Install dependencies (first time only):

```bash
npm install
```

Start the development server (auto-reloads when you save a file):

```bash
npm run dev
```

Then open http://localhost:3000.

## 2. Build the production site

```bash
npm run build
```

This creates the finished website in the **`out/`** folder: plain HTML, CSS, JS and images that any static host can serve. The build also type-checks and lints; it fails if something is wrong.

Preview the built site exactly as visitors will get it:

```bash
npm start
```

Then open http://localhost:3000.

## 3. Deploy

The site is static, so pick any of these:

**Vercel (easiest).** Push the repo to GitHub, then "Add New Project" on vercel.com, choose the repo, and keep the defaults. Vercel detects Next.js and `output: 'export'`.

**Netlify.** Use build command `npm run build` and publish directory `out`.

**AWS S3 + CloudFront.**

1. Build, then upload (`--delete` removes files that no longer exist):

   ```bash
   aws s3 sync out/ s3://YOUR-BUCKET --delete
   ```

2. CloudFront: set *Default root object* to `index.html`. Pages live at `/hotels/abhinandanam/index.html`. If the bucket is a private REST origin (OAC), add this **CloudFront Function** (viewer request) so `/hotels/abhinandanam/` serves its `index.html`:

   ```js
   function handler(event) {
     var r = event.request;
     if (r.uri.endsWith('/')) r.uri += 'index.html';
     else if (!r.uri.includes('.')) r.uri += '/index.html';
     return r;
   }
   ```

3. Caching: `/_next/static/*` can be cached forever (file names change on every build); cache HTML for a few minutes.

4. Point the domain (`www.abhinandanam.in`) at the host. If the domain changes, update `url` in `data/site.ts`; canonical URLs, the sitemap and JSON-LD all use it.

---

## 4. Add a new hotel in 3 steps

1. **Photos.** Create `public/images/hotels/<slug>/` (slug = short URL name, e.g. `hotel-sunrise`). Drop JPG/PNG photos in, named `<slug>-<category>-<n>.jpg` where category is one of `exterior`, `lobby`, `rooms`, `dining`, `pool`, `events`. Then run:

   ```bash
   npm run images
   ```

   This converts them to WebP, makes 400px/800px versions, and records their sizes.

2. **Content.** In `data/hotels.ts`, copy an existing entry (e.g. The Grey Circle), change `slug`, `name`, address, rooms, amenities and so on, and point `cover`, `gallery` and room `images` at the new files. Leave anything you don't know empty or mark it `// TODO`. Never guess prices, ratings or room sizes.

3. **Build.**

   ```bash
   npm run build
   ```

   The hotel automatically gets its own page (`/hotels/<slug>/`), a menu link, a listing card, gallery photos, a sitemap entry and Hotel JSON-LD for Google. Home page counts ("N hotels in Indore", room categories) update themselves.

Set `featured: true` to show the hotel in the home page's arched cards, and `status: 'coming-soon'` for pre-launch hotels (switches buttons to "Pre-book" and labels photos as artist's impressions when `isRender: true`).

## 5. Editing other content

| What | Where |
|---|---|
| Phone numbers, WhatsApp, emails, socials, stats | `data/site.ts` |
| Home hero side photos | `HERO_PHOTOS` in `app/page.tsx` |
| Hotels, rooms, amenities, photos, banquets, policies | `data/hotels.ts` |
| Guest reviews (section stays hidden while empty; real quotes only) | `data/reviews.ts` |
| Colours and fonts | `app/globals.css` and `tailwind.config.ts` |

## 6. The opening intro

When a visit starts on the home page, brand colours swirl into the logo, and the logo then glides into its place above "Hospitality Beyond Stays". It plays once per visit (not again while browsing), never for visitors whose device asks for reduced motion, and any tap, click or key press skips it.

- **Change the timing or colours:** the `.intro…` rules at the bottom of `app/globals.css` (the comment there lists the timeline).
- **Turn it off:** delete the `<IntroSplash />` line in `app/layout.tsx`.

## 6b. Photo trains

On the Gallery page and the home page, each hotel's photos glide sideways in a loop ("train"), like the Appstle site. Hovering pauses a row, each row has a Pause button, and tapping a photo opens it full screen. Change the speed with the `speed` prop (pixels per second) in `components/PhotoTrain.tsx`; how many photos the home page shows is the `limit={10}` in `app/page.tsx`.

## 7. Analytics (call / WhatsApp tracking)

Every click on a phone, WhatsApp, email or directions link calls `track()` in `lib/track.ts`. It does nothing until an analytics script is on the page. Add the **GA4** (`gtag`) or **Meta Pixel** (`fbq`) snippet to `app/layout.tsx` and the events `call_click`, `whatsapp_click`, `email_click` and `directions_click` start arriving automatically, each labelled with where on the page it was clicked.

## 8. Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server with live reload |
| `npm run build` | Production build to `out/` (also type-checks + lints) |
| `npm start` | Serves `out/` on http://localhost:3000 |
| `npm run lint` | ESLint only |
| `npm run images` | Converts new photos, makes 400/800px variants, favicon, placeholders, `data/image-meta.json` |
| `python scripts/build_brochure_images.py` | One-off: rebuilds site photos from the brochure PDFs in `assets/source/` (needs `pip install pymupdf pillow numpy`) |

## 9. Folder map

```
app/            pages (/, /hotels, /hotels/[slug], /banquets-events, /gallery, /about, /contact) + sitemap/robots
components/     hand-built UI (Header, MobileBar, Lightbox, RoomCard, PhotoHeader, SubNav, ...)
data/           all content (site.ts, hotels.ts, reviews.ts, image-meta.json)
lib/            helpers: phone/WhatsApp links, tracking, image srcset, SEO/JSON-LD
public/images/  hotels/<slug>/ photos, brand/ logos, og/ social share images, placeholder-*.webp
assets/source/  original brochure PDFs + extracted text
scripts/        image tooling
```
