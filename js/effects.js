// effects.js — scroll-triggered reveals, count-up, marquee, card tilt, cursor sparkle.
// No external libraries: ONE IntersectionObserver handles every reveal and count-up.
// Fireworks / countdown live in festive.js.

(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // ---------- Reveals + count-up ----------
  // observeReveals(instant): call after any re-render (site.js does). With instant=true the
  // new elements appear immediately with no fade, so a data refresh never makes cards flash or vanish.
  const hasIO = 'IntersectionObserver' in window;
  function countUp(el, instant) {
    const target = parseInt(el.dataset.countup, 10) || 0;
    const suffix = el.dataset.suffix || '';
    el.dataset.countDone = '1';
    if (instant || prefersReducedMotion) { el.textContent = target + suffix; return; }
    const t0 = performance.now(), dur = 1400;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const io = hasIO ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      if (el.classList.contains('reveal')) el.classList.add('revealed');
      if (el.hasAttribute('data-countup') && !el.dataset.countDone) countUp(el, false);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 }) : null;

  function observeReveals(instant) {
    document.querySelectorAll('.reveal:not(.revealed), [data-countup]:not([data-count-done])').forEach((el) => {
      if (instant || !io) {
        if (el.classList.contains('reveal')) el.classList.add('revealed');
        if (el.hasAttribute('data-countup') && !el.dataset.countDone) countUp(el, true);
        return;
      }
      if (el.dataset.revealBound) return;
      el.dataset.revealBound = '1';
      io.observe(el);
    });
  }
  window.vannaiReveal = observeReveals;
  observeReveals(false);

  // ---------- Marquee strip ----------
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack && !marqueeTrack.children.length) { // normally filled by season-apply.js
    const items = [
      'Happy Deepavali · இனிய தீபாவளி', 'Deepavali Gift Boxes', 'Tirunelveli Halwa', 'Mixture & Balcova',
      'No Preservatives', 'Ships Across Tamil Nadu & India', 'Bulk & Festival Orders Welcome',
    ];
    const html = items.map((t) => `<span>${t}</span>`).join('');
    marqueeTrack.innerHTML = html + html; // duplicated for seamless loop
  }

  // ---------- 3D tilt on cards (one active card, rAF-throttled, no DOM scans per move) ----------
  if (!isTouch && !prefersReducedMotion) {
    let active = null, pending = null, raf = 0;
    function apply() {
      raf = 0;
      if (!pending) return;
      const { card, x, y } = pending;
      if (active && active !== card) active.style.transform = '';
      active = card;
      const r = card.getBoundingClientRect();
      const px = (x - r.left) / r.width - 0.5;
      const py = (y - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
    }
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest && e.target.closest('.cat-card, .prod-card, .hamper');
      if (!card) {
        if (active) { active.style.transform = ''; active = null; }
        pending = null;
        return;
      }
      pending = { card, x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    document.addEventListener('mouseleave', () => {
      if (active) { active.style.transform = ''; active = null; }
    }, true);
  }

  // ---------- Cursor sparkle trail (desktop only; canvas is hidden and loop sleeps when idle) ----------
  if (!isTouch && !prefersReducedMotion) {
    const cv = document.createElement('canvas');
    cv.id = 'sparkleCanvas';
    cv.style.display = 'none'; // a full-screen layer only exists while sparks are visible
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    let sw = 0, sh = 0, sparks = [], lastSpark = 0, running = false;
    function resize() { sw = cv.width = window.innerWidth; sh = cv.height = window.innerHeight; }
    window.addEventListener('resize', () => { if (running) resize(); });

    function tick() {
      ctx.clearRect(0, 0, sw, sh);
      for (const p of sparks) {
        p.life++;
        const a = Math.max(0, 1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * a + 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242,215,126,${a * 0.85})`;
        ctx.fill();
      }
      sparks = sparks.filter((p) => p.life < p.maxLife);
      if (sparks.length) requestAnimationFrame(tick);
      else { running = false; ctx.clearRect(0, 0, sw, sh); cv.style.display = 'none'; }
    }
    document.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSpark < 45) return;
      lastSpark = now;
      sparks.push({ x: e.clientX, y: e.clientY, r: 1.5 + Math.random() * 2, life: 0, maxLife: 30 });
      if (sparks.length > 40) sparks.shift();
      if (!running) { running = true; resize(); cv.style.display = 'block'; requestAnimationFrame(tick); }
    }, { passive: true });
  }
})();
