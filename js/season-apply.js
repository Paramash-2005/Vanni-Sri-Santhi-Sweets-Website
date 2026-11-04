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
      document.querySelectorAll('.lantern').forEach(function (l) { l.hidden = !S.lanterns; });
      $('hamperRow').innerHTML = S.hampers.map(function (m, i) {
        return '<article class="hamper' + (i === 1 ? ' hamper-hero' : '') + ' reveal">' +
          '<span class="hamper-no">0' + (i + 1) + '</span>' +
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

  // Hamper "Enquire" links: build the WhatsApp URL at click time (site.js owns the number/format)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.hamper a[data-wa]');
    if (!a || typeof buildWhatsappLink !== 'function') return;
    e.preventDefault();
    window.open(buildWhatsappLink(a.dataset.wa), '_blank', 'noopener');
  });
})();
