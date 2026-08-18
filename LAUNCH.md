# Going live

> **Note:** `README.md` was locked by another program when this was written, so
> its "The estimate form" section is out of date — it still describes the old
> mail-app behaviour. **This file is correct.** The form is now a real form.
> Close whatever has `README.md` open and that section can be updated.

Three things have to happen: **host it**, **point the domain at it**, and
**turn the form on**. Budget about an hour, most of it waiting for DNS.

---

## 1. Host it (Netlify — free)

1. Create a free account at [netlify.com](https://netlify.com).
2. **Sites → Add new site → Deploy manually**, then drag the `site` folder in.
3. You get a live URL immediately, like `random-name-123.netlify.app`.

`netlify.toml` is already in the folder, so caching, security headers, the 404
page and clean URLs (`/about` as well as `/about.html`) are configured on the
first deploy. Nothing to set up.

To update later, drag the folder in again. If you'd rather not re-drag every
time, put the project in a GitHub repo and connect it — Netlify then redeploys
on every push.

---

## 2. Point the domain at it

`ramirezrodbuster.com` is currently on Squarespace.

> **Do not cancel Squarespace until the new site is live and you have confirmed
> the domain moved.** If the domain is registered *through* Squarespace,
> cancelling the plan can take the domain with it.

In Netlify: **Domain settings → Add a custom domain →** enter
`ramirezrodbuster.com`. Netlify shows you the exact DNS records to set.

- **Domain registered at Squarespace** — either transfer it out to a registrar
  like Cloudflare or Porkbun, or leave it registered there and change its DNS
  records to Netlify's. Changing DNS is the simpler path.
- **Domain registered elsewhere** (GoDaddy, Namecheap, Google Domains) — update
  the records at that registrar.

DNS propagation takes anywhere from a few minutes to 48 hours. HTTPS is
automatic and free once the domain resolves — Netlify issues the certificate.

When the new site is live on the domain and you have clicked through every page,
then cancel Squarespace.

---

## 3. Turn the form on

The estimate form is wired for **Netlify Forms**. It works the moment you deploy
to Netlify — no code changes, no third-party account. Submissions appear under
**Forms** in the dashboard, with any drawings attached.

> **Set up the email notification, or you will not know a request came in.**
> Netlify dashboard → **Forms → Form notifications → Add notification → Email
> notification** → send to `ramirezrodbuster@gmail.com`.

Free tier is 100 submissions and 10 MB of uploads per month — plenty for
estimate requests.

### Hosting somewhere other than Netlify?

The form would post to nothing and fail. Two options, both quick.

**Formspree** (works on any host) — create a form at
[formspree.io](https://formspree.io), then in `contact.html` replace the opening
`<form>` tag with:

```html
<form class="form" method="POST" action="https://formspree.io/f/YOUR_ID" enctype="multipart/form-data">
```

and delete the `data-netlify` and `netlify-honeypot` attributes and the hidden
`form-name` input.

**Mail-app fallback** (no account, no backend) — replace the opening `<form>`
tag with:

```html
<form class="form" data-mailto="ramirezrodbuster@gmail.com">
```

That switches `assets/js/main.js` back to opening a pre-filled email in the
visitor's mail app. It always works, but the visitor has to hit send themselves
and some will not.

---

## 4. After launch

- **Test the form yourself from your phone** before telling anyone the site is
  live. Send a real request with a real attachment and confirm it arrives.
- **Google Search Console** — add the site at
  [search.google.com/search-console](https://search.google.com/search-console)
  and submit `https://www.ramirezrodbuster.com/sitemap.xml` so you get indexed.
- **Google Business Profile** — for a contractor this drives more calls than the
  website does, and it is free.
- **Analytics**, optional: Netlify Analytics is $9/mo and needs no code;
  Plausible and Fathom are similar; Google Analytics is free but wants a cookie
  banner in some jurisdictions.

---

## If you use a different domain

The domain is baked into the share-preview tags, `sitemap.xml` and `robots.txt`.
If it will not be `https://www.ramirezrodbuster.com`, search and replace that
string across `site/` — it appears in the `<head>` of every page plus those two
files.

---

## What was added for launch

| File | Why |
|---|---|
| `netlify.toml` | Caching, security headers, clean URLs, 404 wiring |
| `thanks.html` | Where the form lands after a successful submit |
| `404.html` | Wrong URL, styled to match |
| `sitemap.xml` | So search engines find all five public pages |
| `robots.txt` | Points at the sitemap, hides `thanks.html` |
| `assets/img/og-image.jpg` | Link preview when the site is shared in text, email, LinkedIn |

Every page also gained Open Graph and Twitter card tags, a canonical URL, and
`theme-color`. The home page carries `GeneralContractor` structured data with
the address, phone and service areas, which is what Google reads for local
results.

---

## Still worth doing before you launch

- **Years of experience** still reads `15+` — that is a placeholder, not your
  real number. It is in `index.html` and `about.html` as `data-count="15"`.
- **Portfolio photos have no project names or locations.** They are described by
  what is visible in the frame, which is accurate but generic. Real job names
  would carry more weight with a GC.
