# Quack, Quack, Pippin

## What's new in this revision (May 7, 2026 — client round 2 feedback, take 3)

### About headline — clean two-line break
- Restructured `<h2>Three friends. One pack. A whole world to discover.</h2>`
  with each sentence wrapped in its own `<span class="about__title-line">`
  with `white-space: nowrap` (at 480px+), so each sentence stays on one
  line at all desktop and tablet widths. On phones below 480px the
  sentences wrap naturally.
- Tuned the H2 font-size with a tighter clamp (`clamp(1.7rem, 2.2vw + 0.4rem, 2.0rem)`)
  so the longer sentence "A whole world to discover." always fits in
  whatever column width the layout gives it. The trickiest spot is
  ~960-1100px viewports where the 2-column layout kicks in but the
  text column is still narrow; the smaller cap prevents wrapping there.

### Character cards — same ground plane, no painted shadows, naturally proportional

The previous round still had two issues: heads getting clipped on mobile,
and Sable looking like she was floating above the others on desktop
because her PNG had no painted ground shadow while Pippin and Chip did.

Four coordinated fixes this round:

1. **Erased painted shadows from all three character PNGs.** Pippin had
   a prominent gray shadow puddle extending down-right from his feet;
   Chip and Sable had smaller ones. The shadow-stripping is conservative
   — it only operates in the bottom 20% of each character's body height,
   which preserves props higher up (Pippin's magnifying glass, Chip's
   pencil and tail, Sable's tail).

2. **Re-exported PNGs on a 1200×1500 (4:5) canvas** that exactly matches
   the CSS photo frame's aspect ratio. With `object-fit: cover` on a
   matching ratio, every character fills the frame edge-to-edge with
   zero clipping at any breakpoint — no more cut-off heads on mobile.

3. **Pinned all three feet at exactly y=1380** (~92% from the top of
   each canvas). This is pixel-identical across all three PNGs, so when
   the CSS uses `object-position: center bottom`, all three feet land on
   the exact same baseline in their photo frames. Sable, Pippin, and
   Chip stand on the same ground line — guaranteed.

4. **Sized characters proportionally** to their real-world relative
   sizes: Pippin (duckling) at 100% body height, Chip (beaver kit) at
   95%, Sable (raccoon kit) at 88%. Sable now reads as naturally
   smaller — a believable trio of forest-friend sizes — rather than
   "centered weirdly" the way she did before.

5. **Added a unified CSS-painted ground shadow** at the bottom of every
   photo frame (`.character__photo::after`) with a soft elliptical
   radial-gradient in brand teal. With the painted PNG shadows erased,
   this CSS shadow is the single source of truth for the ground plane,
   keeping all three characters visually anchored to the same ground.

### Cache-bust
- Bumped `?v=` query string on `styles.css` and `script.js` to
  `20260507d`. Image filenames are unchanged so Netlify's long
  `assets/*` cache stays valid; the new image bytes are picked up via
  the new deploy.

---

## Previous revision (May 7, 2026 — client round 2 feedback, take 2)

The previous attempt tried to balance Pippin, Chip, and Sable with CSS
`transform: scale()` and `object-position` tricks. That approach broke
on both mobile (feet getting clipped at the bottom of the 1:1 frame) and
desktop (Sable floating to the top of the 4:5 frame), because each
character's source PNG had wildly different content placement and CSS
can't cleanly compensate for that across multiple aspect ratios.

The fix from that round: **normalize the source PNGs themselves.** Every
character now sits on a consistent 1200x1200 transparent canvas with:
- Content height = 80% of the canvas
- Content centered horizontally
- Feet ~4% from the bottom edge

This was a step in the right direction but didn't solve the missing
ground-shadow problem or the clipped-head problem on mobile, which
this revision addresses.

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
