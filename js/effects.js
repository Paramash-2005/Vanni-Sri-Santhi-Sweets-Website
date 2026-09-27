// effects.js — smooth scroll, scroll-triggered reveals, pinned storytelling, ember hero.
// Loaded after Lenis + GSAP + ScrollTrigger from CDN, and after site.js has rendered content.

(function () {
  // ---------- Respect reduced-motion preference ----------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Lenis smooth scroll ----------
  let lenis = null;
  if (!prefersReducedMotion && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ---------- GSAP + ScrollTrigger ----------
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // ---------- Section / card reveals ----------
    function initReveals() {
      document.querySelectorAll('.reveal').forEach((el) => {
        if (el.dataset.revealBound) return; // avoid double-binding on re-render
        el.dataset.revealBound = '1';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => el.classList.add('revealed'),
        });
      });
    }
    initReveals();
    // categories/trust/products render slightly after DOM parse — re-check shortly after load
    setTimeout(initReveals, 300);
    setTimeout(initReveals, 1000);

    // ---------- Pinned "Our Story" scrollytelling ----------
    const pinWrap = document.getElementById('storyPinWrap');
    if (pinWrap) {
      const beats = pinWrap.querySelectorAll('.story-beat');
      if (beats.length) {
        beats[0].classList.add('active');
        ScrollTrigger.create({
          trigger: pinWrap,
          start: 'top top',
          end: 'bottom bottom',
          pin: '.story-pin-inner',
          onUpdate: (self) => {
            const step = Math.min(beats.length - 1, Math.floor(self.progress * beats.length));
            beats.forEach((b, i) => b.classList.toggle('active', i === step));
          },
        });
      }
    }
  }

  // ---------- Ember canvas in hero ----------
  const canvas = document.getElementById('emberCanvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      const hero = canvas.parentElement;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function makeParticle() {
      return {
        x: Math.random() * w,
        y: h + Math.random() * 40,
        r: 1 + Math.random() * 2.2,
        speed: 0.4 + Math.random() * 0.9,
        drift: (Math.random() - 0.5) * 0.6,
        life: 0,
        maxLife: 200 + Math.random() * 200,
        hue: Math.random() > 0.5 ? '242,211,126' : '212,175,55', // gold-bright / gold
      };
    }
    particles = Array.from({ length: 55 }, makeParticle);

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        p.life++;
        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.15 ? lifeRatio / 0.15 : Math.max(0, 1 - (lifeRatio - 0.15) / 0.85);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${alpha * 0.55})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${p.hue},${alpha * 0.6})`;
        ctx.fill();
        if (p.life >= p.maxLife || p.y < -10) {
          Object.assign(p, makeParticle());
        }
      });
      requestAnimationFrame(tick);
    }
    tick();
  }
  // ---------- Marquee strip ----------
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    const items = [
      'Own-Made Daily', 'Tirunelveli Halwa', 'Mixture & Balcova',
      'No Preservatives', 'Ships Across Tamil Nadu & India', 'Bulk & Festival Orders Welcome',
    ];
    const html = items.map((t) => `<span>${t}</span>`).join('');
    marqueeTrack.innerHTML = html + html; // duplicated for seamless loop
  }

  // ---------- Hero word-by-word reveal ----------
  if (window.gsap) {
    gsap.to('.hw', {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', delay: 0.25,
    });
  }

  // ---------- 3D tilt on category / product cards (event delegation, survives re-render) ----------
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.cat-card, .prod-card');
      document.querySelectorAll('.cat-card, .prod-card').forEach((c) => {
        if (c !== card) c.style.transform = '';
      });
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) translateY(-4px)`;
    });
    document.addEventListener('mouseleave', () => {
      document.querySelectorAll('.cat-card, .prod-card').forEach((c) => { c.style.transform = ''; });
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

  // ---------- Cursor sparkle trail (desktop only) ----------
  if (!isTouch && !prefersReducedMotion) {
    const sparkleCanvas = document.createElement('canvas');
    sparkleCanvas.id = 'sparkleCanvas';
    document.body.appendChild(sparkleCanvas);
    const sctx = sparkleCanvas.getContext('2d');
    let sw, sh;
    function sresize() { sw = sparkleCanvas.width = window.innerWidth; sh = sparkleCanvas.height = window.innerHeight; }
    sresize();
    window.addEventListener('resize', sresize);

    let sparks = [];
    let lastSpark = 0;
    document.addEventListener('mousemove', (e) => {
      const now = performance.now();
      if (now - lastSpark < 40) return; // throttle
      lastSpark = now;
      sparks.push({ x: e.clientX, y: e.clientY, r: 1.5 + Math.random() * 2, life: 0, maxLife: 34 });
      if (sparks.length > 60) sparks.shift();
    });

    function sTick() {
      sctx.clearRect(0, 0, sw, sh);
      sparks.forEach((p) => {
        p.life++;
        const a = Math.max(0, 1 - p.life / p.maxLife);
        sctx.beginPath();
        sctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2);
        sctx.fillStyle = `rgba(212,175,55,${a * 0.8})`;
        sctx.shadowBlur = 8;
        sctx.shadowColor = `rgba(242,215,126,${a})`;
        sctx.fill();
      });
      sparks = sparks.filter((p) => p.life < p.maxLife);
      requestAnimationFrame(sTick);
    }
    sTick();
  }
})();
