# Conversion tracking

Everything is wired. You need to paste one ID to turn it on.

## Turn it on (5 minutes)

Open `assets/js/analytics.js`. The only block you edit is at the top:

```js
var CONFIG = {
  provider: 'none',          // change to 'plausible' or 'ga4'
  plausibleDomain: 'ramirezrodbuster.com',
  ga4Id: '',                 // 'G-XXXXXXXXXX' if you use GA4
  debug: true                // set false once you trust the numbers
};
```

**Which one?**

- **Plausible** (~$9/mo) — recommended. One simple dashboard, no cookie banner
  needed in most cases, and a shareable public link you can send to anyone.
  Sign up at plausible.io, add `ramirezrodbuster.com`, set `provider: 'plausible'`.
- **Google Analytics 4** (free) — more powerful, much more to learn, and you
  should add a cookie notice. Create a property at analytics.google.com, copy
  the `G-` ID into `ga4Id`, set `provider: 'ga4'`.

Then bump `?v=8` to `?v=9` on the script tags in all 7 HTML files so browsers
pick up the change.

## The link you asked for

The dashboard link comes from whichever provider you pick — I can't create it
because it needs an account in your name.

- Plausible: after signup your dashboard is `plausible.io/ramirezrodbuster.com`.
  In **Site Settings → Visibility** you can make it a **public shareable link**,
  which is the single URL that shows all site activity. That is the closest
  thing to "one link that tracks everything."
- GA4: `analytics.google.com`, no public link without granting account access.

## Verify it before you trust it

`debug: true` prints every event to the browser console. Open the site, press
F12, click the Console tab, and click around. You'll see lines like:

```
[track] call {location: "hero", label: "Call (502) 422-0710", page: "home", conversion: true}
```

If you see those, tracking works — even with `provider: 'none'`, nothing is
being sent anywhere yet.

## What gets tracked

**Conversions** (the ones that mean money):

| Event | Fires when |
|---|---|
| `estimate_submit` | Someone lands on the thank-you page — a completed request |
| `call` | Any phone number tapped, anywhere on the site |
| `email` | Any email address clicked |
| `directions` | Directions to the Hilliard office opened |

**Context** (how people got there):

| Event | Fires when |
|---|---|
| `estimate_start` | Form submitted — carries region, scope, and whether files were attached |
| `faq_open` | An FAQ is expanded, with which question |
| `portfolio_filter` | A portfolio scope filter is used |
| `scroll_depth` | 25 / 50 / 75 / 90% of a page reached |

`estimate_start` and `estimate_submit` are deliberately separate. If starts are
much higher than submits, the form is failing in transit and you'd never know
from a single event.

## Set up conversion goals

**Plausible** — Site Settings → Goals → Add goal → Custom event. Add
`estimate_submit`, `call`, `email`. Your conversion rate then shows on the
dashboard automatically.

**GA4** — Admin → Events → mark `estimate_submit`, `call` and `email` as
conversions. Takes ~24h to populate.

## Adding tracking to a new button

Add two attributes. No JS needed:

```html
<a href="..." data-track="cta_estimate" data-loc="footer">Get an Estimate</a>
```

`data-track` is the event name, `data-loc` is where it sits on the page so you
can tell which CTA is actually working. Phone and email links are tracked
automatically without any attributes.

## Privacy

Plausible sets no cookies and collects no personal data — generally no consent
banner required. GA4 does set cookies; if you get EU or UK traffic you should
add a consent banner. Neither is wired to a banner right now.
