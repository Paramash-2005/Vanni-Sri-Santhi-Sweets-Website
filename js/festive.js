// festive.js — Deepavali layer: hero fireworks (crackers), string lights, countdown.
// Cheap by design: one canvas, no shadowBlur, paused when hero is off-screen or tab hidden,
// disabled entirely for prefers-reduced-motion.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Active festival comes from seasons.js (window.VANNAI_SEASON). Outside festivals: classic look, no effects.
  const S = window.VANNAI_SEASON || { festival: false, effect: 'none' };
  if (!S.festival) return;
  const TARGET = S.target;

  // ---------- String lights ----------
  const lights = document.getElementById('lights');
  if (lights) {
    const n = Math.ceil(window.innerWidth / 46);
    let h = '';
    for (let i = 0; i < n; i++) h += `<i style="--d:${((i * 0.37) % 2).toFixed(2)}s"></i>`;
    lights.innerHTML = h;
  }

  // ---------- Countdown ----------
  const box = document.getElementById('countdown');
  const eD = document.getElementById('cdD'), eH = document.getElementById('cdH');
  const eM = document.getElementById('cdM'), eS = document.getElementById('cdS');
  if (box && eD) {
    const pad = (v) => String(v).padStart(2, '0');
    let timer = 0;
    const tickCd = () => {
      const diff = TARGET - Date.now();
      if (diff <= 0) {
        box.innerHTML = '<div class="cd-title"></div>'; box.firstChild.textContent = S.done;
        clearInterval(timer);
        return;
      }
      const s = Math.floor(diff / 1000);
      eD.textContent = Math.floor(s / 86400);
      eH.textContent = pad(Math.floor((s % 86400) / 3600));
      eM.textContent = pad(Math.floor((s % 3600) / 60));
      eS.textContent = pad(s % 60);
    };
    timer = setInterval(tickCd, 1000);
    tickCd();
  }

  // ---------- Fireworks ----------
  const canvas = document.getElementById('emberCanvas');
  if (!canvas || reduce || S.effect === 'none') return;
  const hero = canvas.parentElement;
  const ctx = canvas.getContext('2d');
  const COLORS = ['255,214,102', '255,140,66', '255,99,132', '255,245,214', '120,220,255', '170,255,160'];
  const MAX_SPARKS = 320;
  let w = 0, h = 0, rockets = [], sparks = [], raf = 0, visible = true, nextLaunch = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = hero.offsetWidth; h = hero.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(hero);

  function launch(x) {
    const tx = x == null ? w * (0.1 + Math.random() * 0.8) : x;
    rockets.push({
      x: tx + (Math.random() - 0.5) * 60, y: h,
      vx: (w / 2 - tx) * 0.0008, vy: -(6 + Math.random() * 2.5),
      peak: h * (0.15 + Math.random() * 0.35),
      color: COLORS[(Math.random() * COLORS.length) | 0],
    });
  }

  function burst(x, y, color) {
    const count = 36 + ((Math.random() * 26) | 0);
    const ring = Math.random() < 0.4; // some bursts are clean rings
    const alt = COLORS[(Math.random() * COLORS.length) | 0];
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count;
      const sp = ring ? 3.2 : 1 + Math.random() * 3.6;
      sparks.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0, max: 55 + Math.random() * 30, r: 1.5 + Math.random() * 1.2,
        c: i % 3 === 0 ? alt : color,
      });
    }
    if (sparks.length > MAX_SPARKS) sparks.splice(0, sparks.length - MAX_SPARKS);
  }

  // Falling particles for non-cracker festivals: snow (Christmas) or marigold petals (Pongal, Puthandu)
  const FALL = S.effect === 'snow' || S.effect === 'petals';
  const FALL_COLORS = S.effect === 'snow' ? ['255,255,255', '225,240,255'] : ['255,170,40', '255,200,70', '255,120,60'];
  const flakes = [];
  if (FALL) for (let i = 0; i < 55; i++) flakes.push({ x: Math.random(), y: Math.random(), r: 1.5 + Math.random() * 2.5, s: 0.4 + Math.random() * 0.8, p: Math.random() * 6.28, c: FALL_COLORS[i % FALL_COLORS.length] });

  function frameFall() {
    raf = 0;
    ctx.clearRect(0, 0, w, h);
    for (const f of flakes) {
      f.y += f.s * 0.0022 * (h > 0 ? 400 / h : 1); f.p += 0.02;
      if (f.y > 1.05) { f.y = -0.05; f.x = Math.random(); }
      const x = (f.x + Math.sin(f.p) * 0.015) * w, y = f.y * h;
      ctx.fillStyle = `rgba(${f.c},0.8)`;
      ctx.beginPath();
      if (S.effect === 'snow') ctx.arc(x, y, f.r, 0, 6.283); else ctx.ellipse(x, y, f.r * 1.6, f.r * 0.8, f.p, 0, 6.283);
      ctx.fill();
    }
    schedule();
  }

  function frame(t) {
    if (FALL) return frameFall();
    raf = 0;
    // fade previous frame -> trails, while staying transparent over the hero gradient
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';

    if (t > nextLaunch) { launch(); nextLaunch = t + 900 + Math.random() * 1400; }

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.x += r.vx; r.y += r.vy; r.vy += 0.045;
      ctx.fillStyle = 'rgba(255,235,190,0.9)';
      ctx.fillRect(r.x - 1, r.y - 1, 2, 5);
      if (r.y <= r.peak || r.vy >= -0.6) { burst(r.x, r.y, r.color); rockets.splice(i, 1); }
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const p = sparks[i];
      p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.045; p.life++;
      const a = 1 - p.life / p.max;
      if (a <= 0) { sparks.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(${p.c},${a.toFixed(2)})`;
      ctx.fillRect(p.x, p.y, p.r, p.r);
    }
    schedule();
  }
  function schedule() { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); }

  new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
    if (visible) schedule(); else { cancelAnimationFrame(raf); raf = 0; }
  }).observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else schedule();
  });

  // tap / click the hero background to light a cracker there
  if (!FALL) hero.addEventListener('click', (e) => {
    if (e.target.closest('a,button,input')) return;
    launch(e.clientX - hero.getBoundingClientRect().left);
    schedule();
  });

  schedule();
})();
