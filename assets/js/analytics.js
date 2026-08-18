/* ==========================================================================
   Ramirez Rod — conversion tracking
   --------------------------------------------------------------------------
   ONE THING TO EDIT: put your measurement ID in CONFIG below. Until you do,
   the site still works and every event is logged to the browser console, so
   you can verify tracking before you sign up for anything.

   What counts as a conversion here:
     estimate_submit  a completed estimate request  (the money event)
     call             someone tapped a phone number
     email            someone tapped an email address
     directions       someone opened directions to the office
   Everything else (scroll depth, FAQ opens, portfolio filters) is context.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    // 'plausible' | 'ga4' | 'none'
    provider: 'none',

    // Plausible: your domain, exactly as registered. e.g. 'ramirezrodbuster.com'
    plausibleDomain: 'ramirezrodbuster.com',

    // GA4: your measurement ID, e.g. 'G-XXXXXXXXXX'
    ga4Id: '',

    // leave true until you trust the numbers — prints every event to the console
    debug: true
  };

  /* ------------------------------------------------------------ loaders */
  function loadPlausible() {
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', CONFIG.plausibleDomain);
    s.src = 'https://plausible.io/js/script.tagged-events.outbound-links.js';
    document.head.appendChild(s);
    window.plausible = window.plausible || function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  }

  function loadGA4() {
    if (!CONFIG.ga4Id) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.ga4Id;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CONFIG.ga4Id);
  }

  if (CONFIG.provider === 'plausible') loadPlausible();
  if (CONFIG.provider === 'ga4') loadGA4();

  /* -------------------------------------------------------------- track */
  var CONVERSIONS = ['estimate_submit', 'call', 'email', 'directions'];

  function track(name, props) {
    props = props || {};
    props.page = location.pathname.replace(/^\/|\.html$/g, '') || 'home';
    if (CONVERSIONS.indexOf(name) > -1) props.conversion = true;

    if (CONFIG.debug) {
      console.log('%c[track] ' + name, 'color:#006847;font-weight:600', props);
    }
    if (CONFIG.provider === 'plausible' && window.plausible) {
      window.plausible(name, { props: props });
    }
    if (CONFIG.provider === 'ga4' && window.gtag) {
      window.gtag('event', name, props);
    }
    // always available for Tag Manager or anything else you bolt on later
    (window.dataLayer = window.dataLayer || []).push(
      Object.assign({ event: name }, props));
  }
  window.RR_track = track;

  /* ------------------------------------------------- automatic wiring */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track], a[href^="tel:"], a[href^="mailto:"]');
    if (!el) return;

    var name = el.getAttribute('data-track');
    if (!name) {
      var href = el.getAttribute('href') || '';
      name = href.indexOf('tel:') === 0 ? 'call'
           : href.indexOf('mailto:') === 0 ? 'email' : null;
    }
    if (!name) return;

    track(name, {
      location: el.getAttribute('data-loc') || 'body',
      label: (el.textContent || '').trim().slice(0, 60)
    });
  }, true);

  // the estimate form: fires on submit, and again as a confirmed conversion
  // on the thank-you page (a submit can still fail in transit)
  var form = document.querySelector('form.form');
  if (form) {
    form.addEventListener('submit', function () {
      var d = new FormData(form);
      track('estimate_start', {
        region: d.get('Region') || 'unspecified',
        scope: d.get('Scope') || 'unspecified',
        has_files: !!(d.get('Drawings') && d.get('Drawings').name)
      });
    });
  }
  if (/thanks/.test(location.pathname)) {
    track('estimate_submit', { value: 1 });
  }

  // context signals
  document.addEventListener('toggle', function (e) {
    var d = e.target.closest('.faq__item');
    if (d && d.open) track('faq_open', { question: (d.querySelector('summary span') || {}).textContent });
  }, true);

  var filters = document.querySelector('.filters');
  if (filters) {
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) track('portfolio_filter', { scope: b.dataset.filter });
    });
  }

  // scroll depth, once per threshold
  var hit = {}, marks = [25, 50, 75, 90];
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    var pct = Math.round((window.scrollY / h) * 100);
    for (var i = 0; i < marks.length; i++) {
      if (pct >= marks[i] && !hit[marks[i]]) {
        hit[marks[i]] = true;
        track('scroll_depth', { depth: marks[i] });
      }
    }
  }, { passive: true });

  if (CONFIG.debug) {
    console.log('%c[Ramirez Rod] tracking active — provider: ' + CONFIG.provider +
                (CONFIG.provider === 'none' ? ' (console only, nothing sent)' : ''),
                'color:#ce1126;font-weight:600');
  }
})();
