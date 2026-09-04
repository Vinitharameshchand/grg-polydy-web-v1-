# GRG Polydynamics — Website

React + Vite site for **GRG Polydynamics Private Limited**, prerendered to static HTML.
Replaces the previous three-page site at grgpolydynamics.com.

Content sources:

- [reference.md](reference.md) — client brief extracted from `GRG Polydynamics.pdf`
- [reference-oldsite.md](reference-oldsite.md) — everything scraped from the previous live site
- `public/images/` — 26 photographs selected from the client's Google Drive folder

## Commands

```bash
npm install
npm run dev          # dev server, http://localhost:5173

npm run build        # client build -> SSR build -> prerender. Output: dist/
npm run serve        # serve dist/ with the production security headers (8080)
npm run audit:a11y   # static checks in Chrome: images, contrast, keyboard, routing
npm run probe        # real-time checks over CDP: scroll animations, lightbox, scroll-spy, tilt
npm run test:e2e     # Playwright: 40 live tests on desktop + phone (see Testing)
npm run capture:3d   # Playwright: rest/hover sheet + pointer-sweep video of the 3D tilt

npm run images       # regenerate responsive derivatives from public/images/*.jpg
npm run fonts        # re-download the self-hosted Inter woff2 files
```

`npm run build` runs three stages. The prerender step imports the SSR bundle and writes a
real HTML file per route, then deletes `dist/server/`.

## Deploying

`dist/` is plain static output. Routes are real paths (`/about`), so the host must serve
`dist/about/index.html` for `/about` — every static host does this for directory `index.html`
files. `dist/404.html` handles unknown URLs.

- **Vercel** — [vercel.json](vercel.json) sets `cleanUrls`, the build command and all headers.
- **Netlify / Cloudflare Pages** — [public/_headers](public/_headers) is copied into `dist/`
  and applied automatically.
- **Nginx / Apache** — neither file is read. Port the headers from `_headers` into the server
  config, or the CSP and cache policy will not be applied.

Set the canonical origin with `SITE_URL=https://example.com npm run build` (defaults to
`https://grgpolydynamics.com`). It drives canonical tags, Open Graph URLs and `sitemap.xml`.

## Structure

```
index.html                  template; prerender injects <head> tags and markup
vite.config.js              base '/', vendor chunk splitting
vercel.json                 headers + clean URLs for Vercel
src/
  main.jsx                  hydrates the prerendered markup (falls back to render in dev)
  entry-server.jsx          renderToString for the prerender step
  App.jsx  routes.jsx       route table + per-route title/description
  data/site.js              ALL content: company facts, services, industries, NPD, policies
  data/images.json          generated manifest of image derivatives
  hooks/useScroll.js        ONE scroll listener + rAF loop shared by every effect
  components/
    Layout.jsx              header, drawer, footer, scroll manager, progress bar
    Img.jsx                 <picture> with webp + jpeg srcset
    ui.jsx                  Section, PageHead, Split, CTA, Reveal, Words, CountUp, Ticker
    scroll.jsx              SectionNav (scroll-spy), ProcessTrack, BackToTop, ScrollCue
    Gallery.jsx             photo grid whose tiles open the viewer
    AnimText.jsx            SplitText / SplitChars / ScrollCopy text animation
    Tilt.jsx                pointer-tracked 3D tilt wrapper (inert on touch / reduced motion)
    Lightbox.jsx            accessible full-size image viewer
  styles/  global.css  scroll.css  hero.css  footer.css  text.css  wow.css  depth.css  gradients.css  fonts.css
scripts/
  images.mjs                builds responsive derivatives + og-cover.jpg
  fetch-fonts.mjs           downloads and self-hosts Inter
  prerender.mjs             static HTML per route + sitemap + robots + 404
  serve.mjs                 preview server that applies the production headers
  audit.mjs                 static browser audit (see Accessibility)
  probe.mjs                 real-time browser audit over the DevTools Protocol
public/
  images/                   originals (source of truth) + images/gen/ (derivatives)
  fonts/                    self-hosted Inter woff2
  _headers                  Netlify/Cloudflare header policy
legacy-static/              the earlier hand-built version, kept for reference
```

**To change copy, edit [src/data/site.js](src/data/site.js).**

## Security

| Control | Where |
| --- | --- |
| CSP — `script-src 'self'`, no inline scripts, `object-src 'none'`, `frame-ancestors 'none'` | `_headers`, `vercel.json`, `serve.mjs` |
| HSTS, 2 years, preload | `_headers`, `vercel.json` |
| `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` | all three |
| `Referrer-Policy: strict-origin-when-cross-origin` | all three |
| `Permissions-Policy` — geolocation/camera/mic/payment/USB off | all three |
| No third-party requests | fonts are self-hosted; no analytics, no CDN, no tracker |
| `rel="noopener noreferrer"` on every external link | components |
| Path-traversal guard in the preview server | `serve.mjs` |

`style-src` allows `'unsafe-inline'` because React writes inline `style` attributes for the
animation custom properties. `frame-src` allows `https://www.google.com` for the contact map;
remove it if the map is dropped. The CSP is enforced — `npm run audit:a11y` needs a server
*without* `frame-ancestors` (it drives the site in an iframe), which is why it points at a
plain static server on 8091 rather than `npm run serve`.

## Performance

First-visit home page, mobile: **580 KB** (was 2.28 MB).

- Every photograph is served as WebP with a JPEG fallback, at 400/640/900/1280w (hero also
  1800/2400w), chosen by `sizes` that match the real layout. Sources stay untouched in
  `public/images/`; `npm run images` rebuilds `public/images/gen/`.
- Fonts self-hosted: Inter is variable, so one 47 KB woff2 covers weights 300–700 for latin
  (a second file loads only for latin-ext). Preloaded, `font-display: swap`.
- Vendor split into `react` and `router` chunks so app edits do not invalidate them.
- Fingerprinted assets get a one-year immutable cache; HTML revalidates.
- Every `<img>` carries intrinsic width/height, so there is no layout shift.

## Accessibility

Verified by `npm run audit:a11y` on every build:

- Colour contrast: 0 failures. The old `--muted` failed at 3.1–3.7:1; it is now 5.67:1, and
  footer text on navy measures 7.25–10.36:1.
- The closed mobile drawer is `inert` — 0 of its 12 links are reachable by Tab. Opening moves
  focus to the first link, Tab is trapped inside, Escape closes it and focus returns to the
  button that opened it.
- One `h1` per page, no skipped heading levels.
- Skip link, visible focus rings, `aria-current` on the active nav item.
- All motion disabled under `prefers-reduced-motion`; hover effects dropped on touch.
- Animated text is split into spans for the effect, but each wrapper carries the full string as
  `aria-label` and every piece is `aria-hidden`, so a screen reader announces the sentence once
  and normally rather than word by word. Verified by `npm run probe`.

## Interaction & motion

Scroll effects share **one** listener and **one** rAF loop
([src/hooks/useScroll.js](src/hooks/useScroll.js)) rather than each attaching their own, so a
scroll costs a single measurement pass regardless of how many effects are live.

| Feature | Where | What it does |
| --- | --- | --- |
| Sticky section nav | Capabilities, Industries | Scroll-spy underlines the section you are in, with an `07 / 08` counter; click to jump |
| Process track | Development | A rule beside the ten stages fills as you read through them |
| Scroll progress | every page | Amber hairline under the header |
| Image parallax | every split feature | The photo drifts ~26px against the scroll inside its crop |
| Back to top | every page | Appears past 900px |
| Gallery lightbox | Home, Products, Facility | Tiles are real buttons; opens a full-size viewer |
| Hero layers | Home | Copy and the drawing-grid backdrop drift at different rates (0.16 vs 0.34) |
| Scroll cue | Home | Sweeping amber rule under the hero buttons, jumps to the first section |
| Heading entrances | every `SectionHead` and `PageHead` | Words clip up in sequence when the heading is scrolled into view |
| Lead copy | under every section heading | Words fade and unblur, offset behind the heading |
| Commitment passage | Home | Words light up as the reader scrolls through them |

The lightbox traps focus, supports arrow keys and Escape, locks background scroll and
returns focus to the tile that opened it. Everything above is disabled or pinned to its
end state under `prefers-reduced-motion`.

### Verifying motion

`npm run audit:a11y` runs under Chrome's `--virtual-time-budget`, which **suppresses
requestAnimationFrame entirely** — every rAF-driven value reads as frozen there, which looks
like a broken animation but is not. Use `npm run probe` for anything scroll-driven: it drives
a normally-running browser over the DevTools Protocol. Latest run:

```
process track   scaleY 0.16 -> 0.51 -> 0.85 -> 1.00   (fills, never reverses)
progress bar    --p 0 -> 0.499 -> 1
parallax        --py -0.06px -> -18.03px
scroll-spy      product-development / mould-making / metal-casting all correct
nav click       section lands 73px from top
lightbox        opens, focus in, ArrowRight 1/18 -> 2/18, Escape closes, focus returns
hero layers     scrollY 600 -> copy 90px, backdrop 200px (different rates)
text animation  heading split into 5 words, atRise, delays 0.05/0.105/0.16/0.215s
                aria-label matches visible text exactly; pieces aria-hidden
scroll passage  --lit 0.19 -> 1.00 across the passage as it is read
skip link       stays at -9999px after back-to-top; focus goes to <main>
```

### Impact layer (`wow.css`)

- **Cinematic masthead** — the plant photograph sits *behind* the headline under a navy scrim
  (near-solid on the left where the type is, opening to the right), with a frosted stat panel
  over it, a gradient-filled emphasis word, and a location tag. Headline on the scrim measures
  16.5:1.
- **Amber as a working colour** — the header CTA, hero primary and every CTA-band primary are
  amber with navy text (7.6:1). Card numerals and the hero eyebrow are amber on navy (7.6–8.2:1).
- **Dark card grid** for the six services on the home page, with a lift, glow border and an
  amber top rule on hover.
- **Watermark numerals** (`01`–`04`) outlined behind the home section heads; hidden under 880px.
- **Industry tiles** lift, darken at the base and reveal an amber arrow badge on hover.

Two selector traps surfaced while building this, both commented in the CSS: `background-clip:
text` does not paint through the word-clip spans (the gradient must be on the innermost span, or
the word vanishes), and `.hero__panel span` restyled the `CountUp` span inside `<strong>` as a
label (use the direct-child combinator).

### Depth (`depth.css` + `Tilt.jsx`)

CSS 3D only — no WebGL, no library. There is no model to show, and Three.js would cost ~600 KB
of JavaScript for a rotating rectangle.

- **Pointer-tracked tilt** on the service cards, industry tiles, gallery tiles and the hero stat
  panel: the element rotates toward the cursor in perspective (`--rx`/`--ry`), comes forward
  (`translateZ`), and a specular highlight rides the surface at the pointer (`--gx`/`--gy`).
  Contents sit at different `translateZ` depths so it reads as a solid object, not a flat card.
- Follows the pointer at 120ms, settles back over 550ms. Custom properties only — the browser
  composites; React never re-renders per move.
- **On touch there is no hover, so the pointer tilt cannot run — but the depth is still
  visible.** Cards, tiles and gallery photos swing in from a tilted plane as they scroll into
  view (`reveal--3d`), and the hero stat panel sits at a fixed 7° angle in perspective. `Tilt`
  attaches no listeners on coarse pointers. Verified under emulated touch: panel is a 3D matrix
  at rest, sized to content (205px in a 920px hero), tracking inert.
- Under `prefers-reduced-motion` everything is flat and still — a separate media block, so the
  touch cue and the accessibility preference are not conflated.
- The wrapper's `height: 100%` (so cards fill their grid cells) is overridden inside the
  masthead: on phones it had stretched the stat panel to the full hero height, leaving a void
  under every figure.
- Also: the brand mark spins on hover, the lightbox opens with an 8° rotateX, and NPD rows come
  forward as the pointer crosses them.

Verified by `npm run probe`, which fires synthetic `pointermove` events at two corners of a card
and reads the rotation back, then re-runs under emulated touch.

## Testing

Three layers, each catching what the others cannot:

| Command | Engine | Catches |
| --- | --- | --- |
| `npm run audit:a11y` | headless Chrome, virtual time | contrast, `inert`, headings, broken images, anchor routing |
| `npm run probe` | real-time Chrome over the DevTools Protocol | anything rAF-driven: scroll progress, parallax, process track, text lighting, tilt |
| `npm run test:e2e` | Playwright, desktop + Pixel 7 | real mouse and keyboard, every route, 404, form, lightbox, drawer, scroll-spy, 3D tilt, touch tilt; fails on any console error or failed request |

Run e2e against `node scripts/serve.mjs 8092` (clean URLs + real `404.html`), with
`E2E_ORIGIN=http://127.0.0.1:8092`. A plain directory server redirects `/route` to `/route/`
and serves its own 404 page, so the 404 test fails there for the wrong reason.

`npm run capture:3d` is evidence rather than assertion: it drives a real pointer over each
tilting element, screenshots it at rest and mid-tilt, records a sweep video and composes an
annotated sheet in `artifacts/3d/`. It is how the hero-panel bug below was found — the probe's
synthetic events only checked one card.

Two things the live tests found that the earlier harnesses did not: the hero stat panel computed
a tilt angle but never applied it (`.reveal.in { transform: none }` outranked the tilt rule —
fixed by matching specificity), and three of the first e2e failures were test bugs, not site
bugs: the error collector flagged the deliberately-requested 404 document, a scroll used
`offsetTop` (relative to a positioned ancestor, not the page), and a focus check read
`activeElement` before the next-frame restore ran.

### Gradients (`gradients.css`)

Four named ramps, used consistently so the site reads as one palette with depth:

| Token | Ramp | Used for |
| --- | --- | --- |
| `--grad-amber` | pale gold → amber → gold | hero panel numerals, card numerals, the amber button, label bars, progress bar, track fill |
| `--grad-ink` | navy → link blue | About stat figures, the solid button, link underlines, section watermarks |
| `--grad-navy` | indigo → navy → near-black | reserved for dark surfaces |
| `--grad-cool` | pale blue → white | page banners, ticker band |

Gradient text is confined to numerals and the hero emphasis word; the amber ramp only ever sits
on navy (darkest stop 7:1) and the ink ramp only on white. Cards get a true gradient *border*
on hover — a masked pseudo-element, so the glass fill beneath is untouched. Photo tiles rise a
navy scrim on hover so the caption stays legible.

`npm run audit:a11y` evaluates gradient text by testing every colour stop against the ground
and reporting the worst — `color: transparent` would otherwise read as black and fail falsely.

## Known constraints

1. **The enquiry form does not send anything.** It validates and shows a confirmation, but
   makes no network request. Wire `onSubmit` in [src/pages/Contact.jsx](src/pages/Contact.jsx)
   to an endpoint. If you use a third-party form service, add its origin to `connect-src` in
   the CSP or the request will be blocked.
2. **Two policy PDFs 404 on GRG's server** — `Occupational Health and Safety Policy` and
   `Wastewater Management Plan – SOP`. They render as "On request". Upload them and remove the
   `false` flag on those entries in `site.js`.
3. **Policy PDFs are hotlinked** to `grgpolydynamics.com`. They break the moment that host is
   repointed at this site. Move them into `public/docs/` and set `DOC_BASE = '/docs/'`.
4. **The logo is a placeholder** monogram, in `Layout.jsx` and `public/favicon.svg`.
5. **`legacy-static/` is not deployed** but is still in the repo; delete it when you no longer
   need the comparison.

## Content requiring client sign-off

Facts trace to the two reference files. Kept verbatim: the company background and figures, the
commitment statement, the positioning line, the child-labour declaration, all four
certifications, all ten NPD activities.

**Written by me, not sourced — GRG must review before publishing:** the operating-model
section on About, the gate deliverables and "what we need to start" on Development, the
process-control and commitments tables, the per-sector descriptions on Industries, and the
quality-lab paragraph.

**Photography captions are deliberately non-asserting.** Nobody has confirmed what the
photographed parts are, who they are for, or which sector they ship into, so captions and alt
text describe only what is visible in the frame ("Moulded structural component", not
"Automotive frame"). Replace them with real part designations once GRG confirms. For the same
reason, which photo illustrates which capability or sector is my judgement and should be
checked.

**Two further points for GRG:** the facility photographs show identifiable employees, so
confirm consent before publishing; and the headline "3 decades / ₹300 Cr+" figures are
*group* figures, which a reader could take as this company's own turnover.
