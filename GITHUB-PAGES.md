# Publishing to GitHub Pages

## Why only raw HTML showed up

Almost certainly the `assets` folder never made it into the repo. Dragging files
onto github.com uploads **files**, not folder structure, unless you drag the
folder itself — and even then some browsers flatten it. The HTML then loads with
no CSS, no JS, no images, which looks exactly like "raw HTML".

Two other GitHub-Pages-specific things were also wrong. Both are fixed now:

- **`.nojekyll`** — GitHub runs Jekyll on your files by default and skips
  anything starting with `_`. The empty `.nojekyll` file in this folder turns
  that off and serves the files exactly as they are.
- **The estimate form** — it was wired for Netlify Forms, which posts to the
  server. GitHub Pages serves static files only and cannot accept a POST, so it
  would have failed silently. It now opens a pre-filled email instead, which
  works on any host. See "Getting the form back" below.

## Upload it properly (use git, not the web UI)

This is the reliable way to preserve structure. Run it from
`C:\Users\Canaan\Ramirez Rod Buster\site` — that folder becomes the repo root,
so `index.html` sits at the top where GitHub Pages expects it.

```bash
cd "C:\Users\Canaan\Ramirez Rod Buster\site"
git init -b main
git add -A
git commit -m "Ramirez Rod website"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save.**

Give it a minute, then load the URL. It'll be
`https://YOUR-USERNAME.github.io/YOUR-REPO/`.

To confirm the structure survived, open the repo on github.com — you should see
an `assets` folder, and inside it `css`, `img`, `js`, `video`.

### No git installed?

**GitHub Desktop** (desktop.github.com) does the same thing with buttons: File →
Add local repository → pick the `site` folder → Publish repository. It preserves
folders correctly.

### If you must use the web UI

On the repo page choose **Add file → Upload files**, then drag the **`site`
folder itself** into the drop zone — not its contents. Chrome and Edge will walk
the subfolders. Confirm `assets/css/main.css` exists in the repo before assuming
it worked.

## Updating later

```bash
cd "C:\Users\Canaan\Ramirez Rod Buster\site"
git add -A
git commit -m "what changed"
git push
```

## Two things that do not work on GitHub Pages

**The estimate form has no backend.** It now opens the visitor's mail app
pre-filled. That works everywhere, but some people won't hit send. To get real
form submissions you need either:

- **Formspree** (works on GitHub Pages) — sign up, then in `contact.html`
  replace `<form class="form" data-mailto="ramirezrodbuster@gmail.com">` with:
  ```html
  <form class="form" method="POST" action="https://formspree.io/f/YOUR_ID" enctype="multipart/form-data">
  ```
- **Netlify instead of GitHub Pages** — the form works with zero code changes
  there, and file uploads come through. See LAUNCH.md.

**`netlify.toml` does nothing here.** It's harmless — GitHub ignores it — but
the clean URLs, caching headers and 404 wiring it provides are Netlify-only.
GitHub Pages does serve `404.html` automatically, so that part still works.

## Custom domain

Settings → Pages → Custom domain → `ramirezrodbuster.com`. GitHub writes a
`CNAME` file into the repo. Then at your registrar point the domain at GitHub's
IPs (GitHub shows them). Tick **Enforce HTTPS** once the certificate issues.

Remember the canonical URLs and sitemap already point at
`https://www.ramirezrodbuster.com`. If you publish at a `github.io` address
long-term, search-and-replace that string across the site or search engines will
be told the real page lives somewhere else.
