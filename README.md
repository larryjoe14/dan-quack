# Quack, Quack, Pippin

## What's new in this revision (May 7, 2026 — client round 2 feedback, take 2)

### Character cards (Meet the Pack) — fixed for real this time
The previous attempt tried to balance Pippin, Chip, and Sable with CSS
`transform: scale()` and `object-position` tricks. That approach broke
on both mobile (feet getting clipped at the bottom of the 1:1 frame) and
desktop (Sable floating to the top of the 4:5 frame), because each
character's source PNG had wildly different content placement and CSS
can't cleanly compensate for that across multiple aspect ratios.

The real fix: **normalize the source PNGs themselves.** Every character
now sits on a consistent 1200x1200 transparent canvas with:
- Content height = 80% of the canvas
- Content centered horizontally
- Feet ~4% from the bottom edge

This means a single set of CSS rules (`object-fit: cover` +
`object-position: center bottom`) works identically for all three
characters at every aspect ratio. No per-character scales, no
per-character positioning, no transforms. The PNGs do the work.

Result on both mobile (1:1 frame) and desktop (4:5 frame):
- All three feet sit on the same baseline
- All three characters read at comparable visual weight
- No clipped hats, no floating characters, no edge cases

### Adventures gallery & watch-preview frame — white banners removed
- **Cropped baked-in white borders out of every gallery and scene image**.
  Each PNG had ~15–16px of pure white at the bottom (and a couple had
  ~24px on the right) that was rendering as a thick white banner inside
  the rounded frame, breaking the immersion of the artwork. Affected
  images:
  - `QPP_MOUNTSIN_CLIMB.png` (1344x784 → 1344x769)
  - `QPP_JUST_WHAT_THE_DOC_ORDERED.png` (1344x784 → 1344x768)
  - `QPP_OCEAN_FRIENDS.png` (1400x784 → 1376x769)
  - `QPP_CLIMBING_TREES.png` (1344x784 → 1344x768)
  - `QPP_LADYBUG.png` (1344x784 → 1344x769)
  - `QPP_FROGGER.png` (1400x784 → 1376x768)
  - `QPP_CSAMPGROUND_NIGHT.png` (1064x1148 → 1044x1148)
  - `SCENE_fall.png` (1344x784 → 1344x768)
  Frames now fill edge-to-edge with the actual artwork.

### Cache-bust
- Bumped `?v=` query string on `styles.css` and `script.js` to
  `20260507b`. Image filenames are unchanged so Netlify's long
  `assets/*` cache stays valid; the new image bytes are picked up via
  the new deploy.

---

## Previous revision (May 1, 2026 — client round 1 feedback)

### Character cards (Meet the Pack)
- **Replaced the gray-to-white gradient backdrop** behind each character
  with a solid pale teal (`var(--teal-tint)`). The character PNGs now
  fill the whole shape against an on-brand color instead of bleeding
  into a generic gray.
- **Fixed the character PNGs themselves** — the source files had been
  re-saved as RGB (no alpha channel) at some point, which is why the
  white was showing through. The new versions in `assets/CHAR_*.png`
  have proper transparency.
- **Re-balanced Sable's sizing** so she reads at the same visual weight
  as Pippin and Chip. Each character now has a per-card `transform: scale()`
  and `object-position` tuned so all three heads sit at roughly the same
  height on both mobile and desktop.

### Copy edits
- FAQ "How long are episodes?" — changed from **7 to 11 minutes** to
  **6 to 7 minutes**.
- Watch CTA headline — changed from "Watch the Quack Pack on YouTube
  Kids." to "Watch Quack, Quack, Pippin on YouTube Kids."
- Footer copyright — added "**LLC**" to the three "MIX MASH MEDIA"
  mentions in the legal copy.

### Footer logo
- **Re-keyed `MMM_LOGO.png` to remove the baked-in black background.**
  The original PNG was saved as RGB with the black flattened into solid
  pixels, which made it sit as a black square against the cream footer.
  The new version has true transparency and renders correctly on cream.

### Cache-bust
- Bumped `?v=` query string on `styles.css` and `script.js` to
  `20260501a` so browsers pull fresh files on the next visit.

---

## Previous revision (Apr 30, 2026)

### Hero
- **New parallax sky backdrop** using `assets/HERO_sky.png`. On desktop
  (≥960px) the sky stays fixed as you scroll for a true parallax effect;
  on mobile it scrolls normally because iOS/Android don't handle
  fixed-attachment backgrounds well.
- **Removed synthetic CSS clouds** (the four `.cloud--N` divs). The new
  sky image already has clouds and tree silhouettes baked in.
- **Hero main media is now the autoplay video** (`assets/intro.mp4`),
  framed in the buttery yellow card. Plays muted on land with a single
  click on the speaker icon to enable audio.

### Typography
- All headings (h1, h2, h3, hero title, form title, character names)
  now use the **solid brand teal** (`#2bb5b5`), matching the teal
  background blocks (Meet the Pack, Watch Preview, etc).
- **Bumped all font sizes a tick** without breaking responsive layout:
  body 16→17px, kickers .74→.92rem, ledes 1.02→1.12rem, FAQ summary
  1→1.1rem, character names 1.85→2rem, etc. Mobile clamp values keep
  things from overflowing on small screens.

### Watch CTAs
- **Both "Watch on YouTube Kids" buttons** (top preview + bottom CTA)
  now use the **YouTube official red** (`#FF0000`) with `#cc0000` shadow.
- Bottom Watch CTA is now a simple, centered closing block with copy +
  button — the video moved to the hero, so this section doesn't need
  its own large media.

### Removed (broken accent images)
- `.about__sketch--left` and `.about__sketch--right` (sketched Pippin
  watermarks)
- `.acorn-divider` (the small floating acorn between sections)
- `.watch-preview__peek` (Sable+Chip peek pair on the preview frame)
- The hero's old `HERO_backdrop.png` faded forest gradient (replaced
  by the new sky parallax)

### Copy
- Removed em dashes throughout. Where they made sense to keep, rewrote
  with commas or periods. The text now reads as the natural, plain
  prose it was always meant to be.

### Cache-bust + Netlify
- Added `?v=20260430` query strings on both `styles.css` and `script.js`
  links so browsers always pull the fresh version.
- `netlify.toml` keeps `Cache-Control: max-age=0, must-revalidate` on
  HTML/CSS/JS (long cache only on `/assets/*`). This means future
  redeploys take effect on the next page load — no hard refresh needed.

## Sections (in order)

1. **Hero** — sky parallax + autoplay video with click-to-unmute
2. **About** — fall mountain scene + show pitch
3. **The Quack Pack** — 3 character cards (Pippin, Chip, Sable)
4. **For Parents / FAQ** — 8-item accordion
5. **Watch (preview)** — YouTube Kids CTA in YouTube red
6. **Adventures gallery** — 3-column masonry
7. **Watch CTA** — closing band with YouTube red CTA
8. **Contact / Signup** — creator emails + Netlify Forms signup
9. **Footer** — centered MixMash logo + legal copy

## Netlify Forms

After your first deploy:
1. Netlify dashboard → Forms tab → form named **`signup`**
2. Settings & usage → Form notifications → Add email notification
3. Each submission captures `email` (required) and `message` (optional)

## Updating links and emails

In `index.html`:
- `https://www.youtubekids.com/` → real channel URL (two instances)
- `press@mixmashmedia.com` and `partners@mixmashmedia.com` → real
  addresses

## Deploying to Netlify

1. Drag this folder (or its zip) onto **app.netlify.com/drop**, or push
   to Git and import.
2. After the deploy publishes, do **one** hard refresh (Cmd+Shift+R /
   Ctrl+Shift+R) to break out of any cached state from previous deploys.
   Future deploys won't need this thanks to the `must-revalidate`
   cache headers.

---

© 2026 MixMash Media LLC. All rights reserved.
