# Ramirez Rod — website

Static site. No build step, no framework, no dependencies. Serve the `site/`
folder and it runs.

## Run it locally

```bash
python -m http.server 8123 --directory site
```

Then open <http://localhost:8123>.

## Deploy

Upload the whole `site/` folder to any static host — Netlify, Vercel, Cloudflare
Pages, GitHub Pages, or plain shared hosting. Drag-and-drop works on Netlify.
It is about 19 MB total.

The `masters/` folder at the project root is **not** part of the site — see
"Video" below.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing — scroll-scrubbed warehouse hero, rebar animation, services, recent work, coverage |
| `services.html` | Rebar install, tie-in, tilt-up, elevated decks |
| `portfolio.html` | Filterable photo grid with lightbox |
| `about.html` | Vision, crew, values, coverage |
| `contact.html` | Contact details + estimate request form |

## Theme

White background, near-black text, steel greys, with the Mexican flag as the
accent system: green `#006847`, white `#ffffff`, red `#ce1126`.

Every colour is a CSS variable at the top of `assets/css/main.css`. Change
`--green` / `--red` there and the whole site follows — buttons, eyebrow rules,
tie wires, stat bars, region bars, form focus rings.

Green carries the primary weight (buttons, links, active states) and red is the
secondary accent (hover fills, sparks, alternating list markers), because a
white accent is invisible on a white page. Where all three appear together as a
flag stripe — the eyebrow rules, region bars, the bar under the CTA — the white
band is drawn with a hairline border so it reads.

### The ROD lettering

`R` green, `O` white, `D` red, in the header and footer wordmark. The white `O`
carries a 0.75px dark outline (`-webkit-text-stroke` on `.mx-w`), otherwise it
would disappear against the white page. If you ever move the wordmark onto a
dark panel, drop that stroke.

## Video

The hero video is **scroll-scrubbed**, not played: scrolling advances it frame
by frame, so the warehouse builds as you scroll — slab, reinforcing mat, panels
cast, panels lifted, shell braced — through one full 360° orbit.

```
site/assets/video/
  warehouse-tiltup.mp4       1080p, 8.6 MB — desktop
  warehouse-tiltup-720.mp4   720p,  3.8 MB — phones and tablets

masters/                     (project root — NOT deployed)
  warehouse-tiltup-4k.mp4    4K master, 157 MB
  tilt-up-loop*.mp4          the earlier beachfront video, superseded
```

Both shipped encodes use a short keyframe interval (`-g 8`). That is what makes
scrubbing land on real frames instead of stuttering, and it is why they are
larger than a normal web encode of the same length. If you replace the video,
encode it the same way or scrubbing will feel broken:

```bash
ffmpeg -i source.mp4 -vf scale=1920:-2 -c:v libx264 -crf 30 -g 8 -keyint_min 8 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart -an warehouse-tiltup.mp4
```

To change how much scrolling it takes to get through the build, edit
`.filmhero__track` height in `main.css`.

## Things you should edit

Search the HTML for `EDIT:` — every placeholder is marked.

- **Years of experience.** Currently `15` as a placeholder in `index.html` and
  `about.html` (`data-count="15"`). Your real number isn't published anywhere,
  so set it. To drop the stat, delete that whole `.stat` block.
- **Crew size.** Set to `40`. Change `data-count="40"` if it moves.
- **Project details.** The portfolio cards describe what's visible in each
  photo. To add real project names, locations or GCs, edit the `PHOTOS` array in
  `assets/js/main.js` — each entry has a title (`t`) and a note (`n`).

## Cache busting

CSS and JS are linked as `main.css?v=3` / `main.js?v=3`. When you change either
file, bump that number in all five HTML files, or returning visitors will keep
the old version.

## The estimate form

No backend. On submit it opens the visitor's mail app with every field
pre-filled, addressed to `ramirezrodbuster@gmail.com`, so they can attach
drawings before sending.

To have submissions land in an inbox or spreadsheet instead, use Formspree or
Netlify Forms: set the `<form>` `action` and `method` in `contact.html` and
delete the `data-mailto` attribute — that attribute is what switches on the
mail-app behaviour in `assets/js/main.js`.

## Assets

```
assets/
  css/main.css              all styling
  js/main.js                all behaviour + the photo manifest
  img/
    logo.png                original logo, untouched
    mark-dark.png           logo badge, transparent — used across the site
    mark-light.png          white version, for dark backgrounds
    favicon.png
    hero-poster.jpg         first frame of the hero video
    work/                   12 jobsite photos, full + -thumb versions
```

## Logo

The original is untouched at `assets/img/logo.png`. The header uses the circular
badge cropped out of it with a transparent background, and sets "RAMIREZ ROD" as
live text beside it — that's what let the name shorten and the flag colours
apply without redrawing the mark. The badge has a ring that draws itself in on
load and spins on hover.

## Motion

Everything respects `prefers-reduced-motion`; those visitors get the full site
with the entrance animation removed. The scroll-driven scenes still respond to
scrolling, since that motion is user-initiated.

Two scroll scenes use a tall track with a sticky stage — `.filmhero__track` and
`.tie__track` in `main.css`. Change those heights to make each one longer or
shorter.
