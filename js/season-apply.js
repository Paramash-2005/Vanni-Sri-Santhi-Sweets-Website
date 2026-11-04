// season-apply.js — fills the hero, festival section and marquee from window.VANNAI_SEASON (see seasons.js).
// Loaded with `defer` BEFORE effects.js / festive.js so they see the final DOM.
(function () {
  var S = window.VANNAI_SEASON; if (!S) return;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // Hero
  var h = $('heroHeading');
  if (h) h.innerHTML = S.heroWords.split('|').map(function (line) {
    return line.split(' ').map(function (w) { return '<span class="hw">' + esc(w) + '</span>'; }).join(' ');
  }).join('<br>');
  if ($('heroTa')) $('heroTa').textContent = S.ta;
  if ($('heroP')) $('heroP').textContent = S.heroP;
  var cta = $('heroCta');
  if (cta) { cta.textContent = S.cta; cta.setAttribute('href', S.ctaHref || '#festival'); }

  var badge = $('festBadge');
  if (badge) { if (S.festival) badge.lastChild.textContent = S.badge; else badge.hidden = true; }
  var lights = $('lights'); if (lights && !S.festival) lights.hidden = true;

  // Festival section (hidden entirely when no festival is on)
  var sec = $('festival');
  if (sec) {
    if (!S.festival) { sec.hidden = true; }
    else {
      $('festEyebrow').textContent = S.eyebrow;
      $('festTitle').textContent = S.title;
      $('festTa').textContent = S.fta;
      $('festCopy').textContent = S.copy;
      $('cdLabel').textContent = S.count;
      $('hamperRow').innerHTML = S.hampers.map(function (m, i) {
        return '<article class="hamper' + (i === 1 ? ' hamper-hero' : '') + ' reveal">' +
          '<span class="hamper-no">0' + (i + 1) + '</span>' +
          '<div class="hamper-emblem">' + EMBLEMS[i % EMBLEMS.length] + '</div>' +
          '<h3 class="serif">' + esc(m[0]) + '</h3><div class="ta">' + esc(m[1]) + '</div><p>' + esc(m[2]) + '</p>' +
          '<a class="btn btn-gold" data-wa="' + esc("Hi! I'd like to order the " + m[3] + ".\nQuantity: ") + '" href="#" target="_blank" rel="noopener">Enquire</a></article>';
      }).join('');
    }
  }

  // Nav / footer links that pointed at the festival section
  document.querySelectorAll('[data-festival-link]').forEach(function (a) { if (!S.festival) a.hidden = true; });

  // Marquee
  var mt = $('marqueeTrack');
  if (mt) { var m = S.marquee.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join(''); mt.innerHTML = m + m; }

  // Ancient-Tamil emblems drawn as line art (gold strokes): Yaazh harp, temple gopuram, lotus.
  var EMBLEMS = [
    '<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M18 80C30 96 90 96 102 80C90 86 30 86 18 80Z"/><path d="M100 80C112 50 90 14 50 14C36 14 28 22 30 30"/><circle cx="30" cy="33" r="3"/><path d="M96 66L90 85M88 44L76 88M76 28L62 89M62 18L48 88M48 15L34 85"/><path d="M26 80h-8M102 80h8" /></svg>',
    '<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M26 92h68M32 92V78h56v14M36 78l4-14h40l4 14M42 64l4-12h28l4 12M48 52l4-10h16l4 10M54 42l3-9h6l3 9"/><path d="M60 33v-9"/><ellipse cx="60" cy="19" rx="3.5" ry="5"/><path d="M53 92V82q7-9 14 0v10M44 71h32M50 58h20M55 47h10"/></svg>',
    '<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M60 18C71 38 71 60 60 78C49 60 49 38 60 18Z"/><path d="M60 78C40 72 26 54 28 34C44 40 56 56 60 78ZM60 78C80 72 94 54 92 34C76 40 64 56 60 78Z"/><path d="M60 78C34 80 14 68 10 50C28 52 48 62 60 78ZM60 78C86 80 106 68 110 50C92 52 72 62 60 78Z"/><path d="M28 90Q60 80 92 90M40 94Q60 88 80 94"/></svg>'
  ];

  // Hamper "Enquire" links: build the WhatsApp URL at click time (site.js owns the number/format)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.hamper a[data-wa]');
    if (!a || typeof buildWhatsappLink !== 'function') return;
    e.preventDefault();
    window.open(buildWhatsappLink(a.dataset.wa), '_blank', 'noopener');
  });
})();
