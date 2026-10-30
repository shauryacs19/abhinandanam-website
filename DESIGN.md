---
name: Abhinandanam Hospitality
description: Forest green and white. A hotel group's front desk, dressed for the evening.
colors:
  forest: "#10231F"
  forest-raised: "#18302A"
  forest-deep: "#0A1815"
  soft-white: "#F7F5F0"
  white: "#FFFFFF"
  pale-jade: "#A8D5C4"
  sage-grey: "#9FB3AB"
  logo-jade: "#2F8A7A"
  whatsapp-teal: "#23695D"
  whatsapp-teal-hover: "#1B5249"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(34px, 9.2vw, 74px)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "0.07em"
  display-italic:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(30px, 6.4vw, 56px)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "2.6rem"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "0.01em"
    fontFeature: "lnum"
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.12
    fontFeature: "lnum"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  body-lead:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.28em"
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    letterSpacing: "0.02em"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  section: "64px"
  section-lg: "96px"
  content-max: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.forest}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.pale-jade}"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp-teal}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "48px"
  button-whatsapp-hover:
    backgroundColor: "{colors.whatsapp-teal-hover}"
  button-outline:
    textColor: "{colors.pale-jade}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "48px"
  button-outline-hover:
    backgroundColor: "{colors.pale-jade}"
    textColor: "{colors.forest}"
  chip:
    backgroundColor: "{colors.forest-raised}"
    textColor: "{colors.soft-white}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  card-room:
    backgroundColor: "{colors.forest-raised}"
    rounded: "{rounded.xl}"
    padding: "32px"
  availability-pill:
    backgroundColor: "{colors.forest-raised}"
    rounded: "{rounded.xl}"
    padding: "8px"
  header:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.soft-white}"
    height: "72px"
---

# Design System: Abhinandanam Hospitality

## Overview

**Creative North Star: "The Lit Lobby at Dusk"**

Since 2026-10-30 the whole site lives in the evening: every section sits on forest green, deep green or a full-bleed photograph, never on a light page. White carries the words, the logos and the one action to take; a pale jade picks out eyebrows, icons and links. The owner's brief: a "green and white combination everywhere", with the whole viewport covered by green, images or video.

The tone is quiet luxury, not glamour. Big real photographs carry the emotion and glow against the dark; the type is a classical serif at one weight beside a plain sans; ornament is limited to a white hairline divider with a small diamond. Density is generous on marketing pages and tighter on hotel pages, where facts (sizes, beds, check-in) sit in tidy two-column lists.

Rejected on purpose (owner decisions): the pastel white-and-green look, the ivory "emerald & gold" look (2026-10-25 to 10-30), the arched "temple window" cards, and photo walls that mix several hotels together.

**Key Characteristics:**
- Forest green everywhere, with deep and raised green bands for rhythm; no light sections.
- White text, white logos (all-white copies of the client artwork) and white primary buttons with green text.
- Pale jade for small accents only.
- Cormorant Garamond 600 for every heading, Inter for everything else.
- Photography first: full-bleed hero slideshow, large editorial photos, photo marquees.
- Contact is always visible: white "Call to Book" in the header, sticky mobile bar, booking card.

## Colors

A two-colour world: dark greens and white, with one pale jade accent and WhatsApp teal.

### Primary
- **White** (`white`): primary buttons (green text), divider lines, hairlines at 15–35% opacity, the logos.
- **Pale Jade** (`pale-jade`): eyebrows, stars, icons, links, outline buttons, big stat numbers. Never a large fill.

### Secondary
- **WhatsApp Teal** (`whatsapp-teal`): every WhatsApp button and the "Coming soon" badge. White text on it is 6.5:1.
- **Logo Jade** (`logo-jade`): decorative only.

### Neutral
- **Forest** (`forest`): the page itself and the header (the colour the owner chose).
- **Forest Raised** (`forest-raised`): cards, the availability pill, the "Find your stay" band, hover fills.
- **Forest Deep** (`forest-deep`): feature bands ("Why stay with us", stats, call band, footer, banquet box).
- **Soft White** (`soft-white`): headings and body text (15.6:1 on forest).
- **Sage Grey** (`sage-grey`): secondary text and captions (7.4:1).

Token names in code are historical, kept so classes didn't need renaming: `cream` = forest, `sand` = forest raised, `deep` = forest deep, `ink` = soft white, `gold` = white, `brass` = pale jade, `muted` = sage grey.

### Named Rules
**The No Light Page Rule.** Every section background is forest, raised, deep or a photo. Never ivory, white or grey.

**The White Means Go Rule.** A solid white fill is the primary action. Don't use white fills for cards, badges or backgrounds.

**The WhatsApp Is Teal Rule.** Teal belongs to WhatsApp (and the "Coming soon" badge). A call is white, a chat is teal, everywhere.

## Typography

**Display Font:** Cormorant Garamond, weight 600 only, normal + italic (with Georgia)
**Body Font:** Inter (with system-ui)

**Character:** a high-contrast classical serif for names and headings, set at one semibold weight with lining numerals so phone numbers and stats line up, beside a neutral sans that stays out of the way.

### Hierarchy
- **Display** (600, clamp 34–74px, 0.95, spaced 0.07em capitals): only the home hero word "HOSPITALITY", white over the photo.
- **Display italic** (600 italic, clamp 30–56px): the white "Beyond Stays" line under it. The only italic headline on the site besides hotel taglines.
- **Headline** (600, 30px mobile to 2.6rem desktop, 1.12): section headings, always followed by the gold divider.
- **Title** (600, 28–48px, ~1.12): hotel names in cards and showcases, room names, large phone numbers.
- **Body** (400, 16px, 1.6) and **Body lead** (17px) for section intros, kept to about 42rem wide.
- **Label** (600, 12px, 0.28em tracking, uppercase, pale jade): the eyebrow above each headline. Smaller variants (10–11px, 0.14–0.32em) label form fields and the star/area line.

### Named Rules
**The One Weight Rule.** Cormorant is loaded at 600 only. Make hierarchy with size, case and italic, never with a second serif weight.

**The Lining Numerals Rule.** Serif numbers are lining (`lining-nums`), because Cormorant's default old-style figures make phone numbers look uneven.

## Layout

Content sits in a centred 1200px column with 16 / 24 / 32px side gutters (phone / tablet / desktop). Sections breathe at 64px vertical padding on phones and 96px on desktop, and alternate forest, raised and deep green bands so the page has a rhythm of rooms at night. An 8px grid sets the smaller spacing.

The home hero fills the screen under a transparent header; the availability pill overlaps its bottom edge by 40–48px. Hotel showcases use a 12-column split (7 photo / 5 text), alternating sides, with a small inset photo overlapping the inner corner on desktop. Hotel pages open with a 1-large + 4-small photo grid and a sticky sub-navigation under the header. On phones, rows of tiles become horizontal swipe rows with scroll snap, and a fixed Call | WhatsApp | Directions bar sits at the bottom (the page reserves 56px for it).

## Elevation & Depth

Mostly flat and tonal: depth comes from the three green levels, from photos, and from thin white hairlines. Two soft, green-tinted shadows exist for things that float.

### Shadow Vocabulary
- **Card** (`box-shadow: 0 1px 2px rgb(16 35 31 / 0.06), 0 8px 24px -12px rgb(16 35 31 / 0.18)`): photo frames in hotel cards and showcases, carousel arrows.
- **Lift** (`box-shadow: 0 2px 4px rgb(16 35 31 / 0.08), 0 16px 40px -16px rgb(16 35 31 / 0.28)`): things that sit above the page: the availability pill, the booking card, the Hotels dropdown, the showcase inset photo.

### Named Rules
**The Float Only Rule.** Only an element that overlaps or follows the page (pill, sticky card, menu) gets Lift. Ordinary content cards stay flat with a gold hairline.

## Shapes

Corners are gently tight: 6px on buttons, 8px on photo cards and menus, 12px on room cards, the availability pill and the photo header. Pills and badges are fully round. Borders are 1px white at 15–35% opacity; dividers between list rows are white at 15%. The one ornament is the white divider: two hairlines, two dots and an outlined diamond (160×12px). The only arch left is the single photo on the About page.

## Components

### Buttons
Solid, compact and unmistakable.
- **Shape:** gently rounded (6px), at least 48px tall (44px in the header), 15px semibold with slight tracking, icon on the left.
- **Primary (white):** white with forest-green text, pale jade on hover. Works on every green and over photos. Used for "Call to Book", "Explore the hotel".
- **WhatsApp (teal):** teal with white text, darker teal on hover. Always has the chat icon.
- **Outline (jade):** 1px pale jade border and text, fills jade with green text on hover. Secondary actions such as Email.
- **Ghost light:** white outline and text over photos, fills white on hover ("Explore Hotels" in the hero).
- **Focus:** a 3px pale jade outline, offset 3px, on everything focusable.

### Chips
- **Style:** fully round, raised green with a 1px white hairline (20%), 13px white text, small jade icon. Used for room amenities. Badges ("Coming soon") are solid teal pills with white uppercase text; "Artist's impression" is a black 60% pill over the image.

### Cards / Containers
- **Hotel card:** photo first (4:3, 8px corners, Card shadow, slow 3% zoom on hover), then a jade star/area line, serif name, two-line tagline and a jade "View hotel →".
- **Room card:** 12px corners, white hairline, raised green; photo carousel on the left with round green arrow buttons and a "2 / 5" counter, facts in a two-column list with jade icons, amenity chips, then white Call and teal WhatsApp buttons stacked.
- **Booking card:** sticky on hotel pages, raised green, 12px corners, Lift shadow, eyebrow + serif hotel name, three buttons, the phone numbers large in serif, check-in/out below a white hairline.
- **Feature tiles on deep green:** cards with a hairline border and jade line icons.

### Inputs / Fields
- **Availability pill:** one raised-green rounded bar (12px, Lift shadow, white hairline) holding Hotel / Check-in / Check-out / Guests / Rooms as borderless fields with tiny uppercase grey labels; a field tints lighter on hover and shows a 2px jade ring on focus. The submit is the teal WhatsApp button. On phones it becomes a two-column grid with a full-width button.

### Navigation
- **Header:** forest at 90–95% with a blur and **no border** (a border made it 1px taller than the hero's pull-up and showed a light sliver), 72px tall: white horizontal logo left, Hotels dropdown and four links in 15px medium white (jade on hover and on the current page), white "Call to Book" on the right. Transparent over the home hero until the page scrolls.
- **Hotels dropdown:** a forest panel with Lift shadow; featured hotels in serif, the rest in a two-column list, "View all 9 hotels →" link.
- **Mobile:** a round white-outlined menu button opens a full-height forest panel with serif hotel names and full-width Call and WhatsApp buttons. The fixed bottom bar has Call (solid white, green text), WhatsApp (jade text) and Directions.
- **Hotel sub-nav:** sticky under the header, forest with blur, scroll-spy highlights the current section.

### Photo Train (signature)
Each hotel's photos run as a slow endless horizontal strip (~40px/s), alternating direction per row, with faded edges, a Pause button per row, and pause on hover or focus. Tapping a photo opens that hotel's lightbox. With reduced motion it becomes a still row you swipe.

### Hero Slideshow (signature)
Full-screen photos crossfading every 6.5s with a slow zoom from 108% to 100%, a dark gradient for legibility, the stacked logo, the HOSPITALITY / Beyond Stays lockup, a caption with a "View" link, thin progress bars and a Pause button.

## Do's and Don'ts

### Do:
- **Do** keep every section on forest, raised or deep green, or on a full-bleed photo or video.
- **Do** use white for text, logos and the primary button; pale jade for eyebrows, icons and links.
- **Do** use the all-white logo files (`*-white.webp`, made by `scripts/build_white_logos.py`) anywhere a logo sits on green.
- **Do** put the white divider under every section headline and a jade eyebrow above it.
- **Do** keep headings in Cormorant Garamond 600 with lining numerals, and everything else in Inter.
- **Do** give every moving thing a Pause control and a still version for reduced motion.
- **Do** label any 3D render "Artist's impression" on the image.
- **Do** keep tap targets at least 44px and check new colour pairs against WCAG AA.

### Don't:
- **Don't** bring back light sections (ivory, white or grey backgrounds), the gold accents, the pastel look or the arched hotel cards.
- **Don't** put a border on the header.
- **Don't** mix photos from different hotels in one wall or strip.
- **Don't** use white hairlines above 35% opacity; they turn into stripes on dark green.
- **Don't** add a second serif weight, a third typeface or decorative script.
- **Don't** add heavy shadows, gradients on buttons or glossy effects; depth comes from the green levels, photos and hairlines.
- **Don't** use teal for anything that isn't WhatsApp or a status badge.
