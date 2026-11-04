// effects.js — smooth scroll, scroll-triggered reveals, marquee, card tilt, cursor sparkle.
// Loaded after Lenis + GSAP + ScrollTrigger from CDN, and after site.js has rendered content.
// Fireworks / countdown live in festive.js.

(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  // ---------- Lenis smooth scroll (driven ONLY by the GSAP ticker — one raf per frame) ----------
  let lenis = null;
  if (!prefersReducedMotion && !isTouch && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  }

  // ---------- GSAP + ScrollTrigger ----------
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    function initReveals() {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (el.dataset.revealBound) return;
        el.dataset.revealBound = '1';
        ScrollTrigger.create({
          trigger: el, start: 'top 90%', once: true,
          onEnter: () => el.classList.add('revealed'),
        });
      });
    }
    initReveals();
    setTimeout(initReveals, 300);
    setTimeout(initReveals, 1000);
  } else {
    // CDN blocked/failed: never leave content invisible
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
  }

  // ---------- Marquee strip ----------
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
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

  // ---------- Count-up for the "years in business" trust badge ----------
  function initCountUps() {
    document.querySelectorAll('[data-countup]').forEach((el) => {
      if (el.dataset.countBound) return;
      el.dataset.countBound = '1';
      const target = parseInt(el.dataset.countup, 10) || 0;
      const suffix = el.dataset.suffix || '';
      if (window.gsap && window.ScrollTrigger) {
        ScrollTrigger.create({
          trigger: el, start: 'top 90%', once: true,
          onEnter: () => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target, duration: 1.4, ease: 'power2.out',
              onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
            });
          },
        });
      } else {
        el.textContent = target + suffix;
      }
    });
  }
  initCountUps();
  setTimeout(initCountUps, 400);
  setTimeout(initCountUps, 1200);

  // ---------- Cursor sparkle trail (desktop only; loop sleeps when no sparks) ----------
  if (!isTouch && !prefersReducedMotion) {
    const cv = document.createElement('canvas');
    cv.id = 'sparkleCanvas';
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    let sw, sh, sparks = [], lastSpark = 0, running = false;
    function resize() { sw = cv.width = window.innerWidth; sh = cv.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

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
      else { running = false; ctx.clearRect(0, 0, sw, sh); }
    }
    document.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSpark < 45) return;
      lastSpark = now;
      sparks.push({ x: e.clientX, y: e.clientY, r: 1.5 + Math.random() * 2, life: 0, maxLife: 30 });
      if (sparks.length > 40) sparks.shift();
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
  }
})();
