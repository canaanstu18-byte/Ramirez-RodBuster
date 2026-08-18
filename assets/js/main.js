/* ==========================================================================
   Ramirez Rod — site behaviour
   Reveal-on-scroll, count-up stats, portfolio filtering and lightbox.
   No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ photo set
     Real jobs, straight out of the 2025-26 project portfolio. `t` is the
     project name, `loc` the job location, `n` what the photo shows.        */
  var PHOTOS = [
    { f: 'scout-metal-deck',        t: 'Scout',               loc: 'Blythewood, SC', k: 'elevated-deck', n: 'Slab-on-metal-deck reinforcement tied over structural steel framing.' },
    { f: 'arthrex-footings',        t: 'Arthrex',             loc: 'South Carolina', k: 'foundations',   n: 'Formed footing and grade-beam run tied out, finished tilt-up shell behind.' },
    { f: 'bunker-slab-mat',         t: 'Bunker',              loc: 'Blythewood, SC', k: 'slab',          n: 'Large-format slab-on-grade mat set within edge forms.' },
    { f: 'cash-panel-tieout',       t: 'Cash Corporate',      loc: 'Apex, NC',       k: 'panels',        n: 'Completed panel mat tie-out with the crew on site.' },
    { f: 'bunker-elevated-slab',    t: 'Bunker',              loc: 'Blythewood, SC', k: 'elevated-deck', n: 'Elevated slab reinforcement placed with shoring in progress.' },
    { f: 'scout-column-footings',   t: 'Scout',               loc: 'Blythewood, SC', k: 'foundations',   n: 'Isolated column footings formed within the building slab, ahead of pour.' },
    { f: 'cash-long-panel',         t: 'Cash Corporate',      loc: 'Apex, NC',       k: 'panels',        n: 'Long-format panel slab, tied and formed, ready for pour.' },
    { f: 'bunker-strip-footing',    t: 'Bunker',              loc: 'Blythewood, SC', k: 'foundations',   n: 'Continuous strip footing cage tied and set ahead of pour.' },
    { f: 'naples-panel-embeds',     t: 'Naples Gym Addition', loc: 'Naples, FL',     k: 'panels',        n: 'Broad slab panel mat with embeds set, ahead of concrete placement.' },
    { f: 'scout-mat-foundation',    t: 'Scout',               loc: 'Blythewood, SC', k: 'foundations',   n: 'Mat foundation tied and formed in the excavation, ready for pour.' },
    { f: 'cash-panel-forms',        t: 'Cash Corporate',      loc: 'Apex, NC',       k: 'panels',        n: 'Slab panel reinforcement mat with edge forms set.' },
    { f: 'scout-deck-wide',         t: 'Scout',               loc: 'Blythewood, SC', k: 'elevated-deck', n: 'Elevated deck mat run out across the bay, tied over metal deck.' },
    { f: 'bunker-perimeter-footing',t: 'Bunker',              loc: 'Blythewood, SC', k: 'foundations',   n: 'Deep strip footing cage along the building perimeter, dowels set.' },
    { f: 'naples-panel-mat',        t: 'Naples Gym Addition', loc: 'Naples, FL',     k: 'panels',        n: 'Panel reinforcement mat tied on grade, chairs set for cover.' },
    { f: 'scout-pier-caps',         t: 'Scout',               loc: 'Blythewood, SC', k: 'foundations',   n: 'Interior pier caps and grade beams formed and tied.' },
    { f: 'scout-foundation-level',  t: 'Scout',               loc: 'Blythewood, SC', k: 'foundations',   n: 'Foundation mat set to level ahead of the framing work.' }
  ];
  window.RR_PHOTOS = PHOTOS;

  var SCOPE_LABEL = {
    'foundations': 'Footings & foundations',
    'panels': 'Panels',
    'elevated-deck': 'Slab on metal deck',
    'slab': 'Slab on grade'
  };
  window.RR_SCOPE_LABEL = SCOPE_LABEL;

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ------------------------------------------------------------------ nav */
  function initNav() {
    var nav = $('.nav');
    if (!nav) return;
    var burger = $('.nav__burger', nav);

    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 30); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
      });
      $$('.nav__links a', nav).forEach(function (a) {
        a.addEventListener('click', function () { nav.classList.remove('is-open'); });
      });
    }

    $$('.brand__word span').forEach(function (s, i) {
      s.style.animationDelay = (0.35 + i * 0.035) + 's';
    });
  }

  /* -------------------------------------------------------------- reveals */
  function initReveals() {
    var els = $$('[data-reveal], .stat, .region');
    if (!els.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------- count-up stats */
  function initCounters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.textContent = n.dataset.count; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, target = parseFloat(el.dataset.count), t0 = null, dur = 1500;
        (function step(ts) {
          if (t0 === null) t0 = ts;
          var p = clamp((ts - t0) / dur, 0, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString();
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      });
    }, { threshold: 0.5 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------------------------------------------------------- photo cards */
  function cardMarkup(p) {
    return '<img src="assets/img/projects/' + p.f + '-thumb.jpg" alt="' + p.t + ', ' + p.loc + ' — ' + p.n + '" loading="lazy">' +
           '<div class="card__body">' +
             '<div class="card__tag">' + (SCOPE_LABEL[p.k] || p.k) + ' &middot; ' + p.loc + '</div>' +
             '<h3>' + p.t + '</h3>' +
             '<p>' + p.n + '</p>' +
           '</div>';
  }

  function buildCards(grid, list, wideAt) {
    list.forEach(function (p, i) {
      var a = document.createElement('article');
      a.className = 'card' + (wideAt.indexOf(i) > -1 ? ' card--wide' : '');
      a.dataset.kind = p.k;
      a.dataset.full = 'assets/img/projects/' + p.f + '.jpg';
      a.dataset.title = p.t + ' — ' + p.loc;
      a.dataset.note = p.n;
      a.innerHTML = cardMarkup(p);
      grid.appendChild(a);
    });
  }

  /* -------------------------------------------------- portfolio + lightbox */
  function initPortfolio() {
    var full = $('#workGrid');
    if (full) buildCards(full, PHOTOS, [0, 5]);

    var recent = $('#recentGrid');
    if (recent) buildCards(recent, PHOTOS.slice(0, 6), [0]);

    var filters = $('.filters');
    if (filters) {
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest('button');
        if (!btn) return;
        var key = btn.dataset.filter;
        $$('button', filters).forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        $$('.grid .card').forEach(function (c) {
          c.classList.toggle('is-hidden', key !== 'all' && c.dataset.kind !== key);
        });
      });
    }

    var lb = $('.lb');
    if (!lb) return;
    var lbImg = $('img', lb), lbCap = $('.lb__cap', lb);

    $$('.grid .card').forEach(function (card) {
      card.style.cursor = 'zoom-in';
      card.addEventListener('click', function () {
        lbImg.src = card.dataset.full;
        lbImg.alt = card.dataset.title || '';
        lbCap.textContent = (card.dataset.title || '') + ' — ' + (card.dataset.note || '');
        lb.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    function close() { lb.classList.remove('is-open'); document.body.style.overflow = ''; }
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('.lb__close')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ------------------------------------------------------- estimate form */
  function initForm() {
    var form = $('.form');
    if (!form || !form.dataset.mailto) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form), lines = [];
      d.forEach(function (v, k) { if (String(v).trim()) lines.push(k + ': ' + v); });
      var subject = 'Estimate request — ' + (d.get('Company') || d.get('Name') || 'new enquiry');
      window.location.href = 'mailto:' + form.dataset.mailto +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var note = $('.form__sent', form);
      if (note) note.hidden = false;
    });
  }

  /* ------------------------------------------------------------- boot up */
  /* ------------------------------------------------- responsive video src */
  // <source media> isn't reliably honoured on <video>, so pick the file here.
  // Re-picks on change, since a one-shot check at load misfires on rotation
  // or a viewport that hasn't settled yet.
  function initVideoSource() {
    var video = $('.hero__video');
    if (!video || !video.dataset.srcSmall) return;
    var full = video.getAttribute('src');
    var small = video.dataset.srcSmall;
    var mq = window.matchMedia('(max-width: 900px)');

    var pick = function () {
      var want = mq.matches ? small : full;
      if (video.getAttribute('src') === want) return;
      video.src = want;
      video.load();
      var play = video.play();
      if (play && play.catch) play.catch(function () {});
    };

    video.addEventListener('error', function () {
      if (video.getAttribute('src') === small) { video.src = full; video.load(); }
    });

    pick();
    if (mq.addEventListener) mq.addEventListener('change', pick);
    window.addEventListener('resize', pick);
  }

  /* --------------------------------------------------- hero parallax */
  function initHeroParallax() {
    var bg = $('.hero__bg');
    if (!bg || reduced) return;
    var vh = window.innerHeight, queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < vh * 1.2) bg.style.transform = 'translate3d(0,' + (y * 0.22) + 'px,0)';
        queued = false;
      });
    }, { passive: true });
  }

  function init() {
    initNav();
    initPortfolio();          // builds cards before reveals observe them
    initReveals();
    initCounters();
    initForm();
    initHeroParallax();
    initVideoSource();


    document.documentElement.classList.add('is-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
