# Ramirez Rod — website

Static site for Ramirez Rod, a reinforcing steel (rebar) subcontractor in
Hilliard, Ohio. No build step, no framework, no dependencies — serve this folder
and it runs. About 18 MB.

**Live:** https://canaanstu18-byte.github.io/Ramirez-RodBuster/

## Run it locally

The stock `python -m http.server` does **not** support HTTP Range requests, so
video seeking misbehaves. Use the included server instead:

```bash
python ../serve.py 8124
```

Then open <http://localhost:8124>.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Landing — cover video, stats, services, recent work, coverage, FAQ |
| `services.html` | Rebar install, tie-in, tilt-up, elevated decks |
| `portfolio.html` | 16 real projects, filterable, with lightbox |
| `about.html` | Vision, crew, values, coverage |
| `contact.html` | Estimate form, office map and directions |
| `thanks.html` | After the form is sent (noindex) |
| `404.html` | Wrong URL (noindex) |

## Business details

Baked into every page and the structured data. To change them, search across
`*.html`:

- **1803 Jones Rd, Hilliard, OH 43026**
- **(502) 422-0710**
- ramirezrodbuster@gmail.com
- Coverage: Ohio, Kentucky, Tennessee, Carolinas, Florida, Midwest, Northeast

## Things you should still edit

Search the HTML for `EDIT:` — every placeholder is marked.

- **Years of experience** reads `15+` in `index.html` and `about.html`
  (`data-count="15"`). That is a placeholder, not a real figure. Set it, or
  delete that `.stat` block.
- **Crew size** is `40`. Change `data-count="40"` if it moves.

## Theme

White paper, near-black text, steel greys, with the Mexican flag as the accent
system: green `#006847`, white `#ffffff`, red `#ce1126`.

Every colour is a CSS variable at the top of `assets/css/main.css`. Change
`--green` / `--red` and the whole site follows.

Green carries the primary weight and red is the secondary accent, because a
white accent is invisible on a white page. Where all three appear as a flag
stripe, the white band gets a hairline border so it reads.

**The ROD lettering:** `R` green, `O` white, `D` red. The white `O` carries a
0.75px dark outline (`-webkit-text-stroke` on `.mx-w`) or it vanishes against
the page. Drop that stroke if you move the wordmark onto a dark panel.

## The cover video

`index.html` opens with a muted, looping 10-second clip of a tilt-up panel being
craned into place at sunset. Phones get the 720p file, desktops the 1080p; the
switch happens in `initVideoSource()` in `main.js`, because `<source media>` is
not reliably honoured on `<video>`.

```
assets/video/
  hero-beach.mp4       1080p, 4.9 MB — desktop
  hero-beach-720.mp4   720p,  1.7 MB — phones and tablets
```

Masters and unused renders live in `../masters/`, outside this folder, so they
are never deployed.

## Cache busting

CSS and JS are linked as `main.css?v=8` / `main.js?v=8`. **When you edit either
file, bump that number in every HTML file**, or returning visitors keep the old
version.

## The estimate form

No backend. On submit it opens the visitor's mail app with every field
pre-filled, addressed to `ramirezrodbuster@gmail.com`.

This is required on GitHub Pages, which serves static files only and cannot
accept a form POST. For real submissions see `GITHUB-PAGES.md` (Formspree) or
`LAUNCH.md` (Netlify Forms, which also handles file uploads).

## Tracking

Conversion tracking is wired and running in console-debug mode — nothing is sent
anywhere until you add a measurement ID. See `TRACKING.md`.

## Assets

```
assets/
  css/main.css     all styling
  js/main.js       behaviour + the project photo manifest
  js/analytics.js  conversion tracking
  img/
    logo.png       original logo, untouched
    mark-dark.png  logo badge, transparent — used across the site
    og-image.jpg   1200x630 social share preview
    hero-still.jpg cover video poster frame
    projects/      16 jobsite photos, full + -thumb versions
  video/           cover video, two encodes
```

## Other docs

- `GITHUB-PAGES.md` — publishing here, and what does not work on GitHub Pages
- `LAUNCH.md` — Netlify, custom domain, DNS
- `TRACKING.md` — turning on analytics and setting conversion goals

## Motion

Everything respects `prefers-reduced-motion`; those visitors get the full site
with entrance animation removed.
