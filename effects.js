/* ============ effects.js : نجوم، لمعات، تفاعل مع الماوس ============ */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var COLORS = ['#8b5cf6', '#a855f7', '#c084fc', '#f472b6', '#818cf8', '#b8b3d9'];

  /* ---- كانفاس: نجوم متلألئة + جزيئات عائمة + شرارات الضغط ---- */
  var cv = document.createElement('canvas');
  cv.className = 'fx-canvas';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, stars = [], dust = [], bursts = [], raf = 0, rt;
  var mx = 0, my = 0, sx = 0, sy = 0, px = 0, py = 0, cx = 0, cy = 0;

  var glow = null;
  if (fine && !reduce) {
    glow = document.createElement('div');
    glow.className = 'fx-cursor';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);
  }

  function sparkle(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y);
    ctx.quadraticCurveTo(x, y, x, y - r);
    ctx.fill();
  }

  function build() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(85, Math.max(28, (W * H) / 17000)));
    stars = [];
    for (var i = 0; i < n; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, r: rand(0.6, 2.6),
        p: rand(0, 6.28), s: rand(0.5, 1.6), d: rand(0.2, 1),
        c: COLORS[(Math.random() * COLORS.length) | 0] });
    }
    dust = [];
    var m = W < 700 ? 12 : 22;
    for (i = 0; i < m; i++) {
      dust.push({ x: Math.random() * W, y: Math.random() * H, r: rand(1.5, 3.8),
        vy: rand(0.12, 0.4), vx: rand(-0.12, 0.12), p: rand(0, 6.28),
        c: COLORS[(Math.random() * COLORS.length) | 0] });
    }
    if (!raf) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    sx += (mx - sx) * 0.05; sy += (my - sy) * 0.05;
    var i, s, a;
    for (i = 0; i < stars.length; i++) {
      s = stars[i];
      a = reduce ? 0.5 : 0.2 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.s + s.p));
      ctx.globalAlpha = a; ctx.fillStyle = s.c;
      var x = s.x + sx * s.d * 16, y = s.y + sy * s.d * 16;
      if (s.r > 1.6) { sparkle(x, y, s.r * 3.2); }
      else { ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill(); }
    }
    for (i = 0; i < dust.length; i++) {
      s = dust[i];
      if (!reduce) {
        s.y -= s.vy; s.x += s.vx + Math.sin(t * 0.0006 + s.p) * 0.15;
        if (s.y < -10) { s.y = H + 10; s.x = Math.random() * W; }
        if (s.x < -10) s.x = W + 10; if (s.x > W + 10) s.x = -10;
      }
      ctx.globalAlpha = 0.18 + 0.12 * Math.sin(t * 0.001 + s.p);
      ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
    }
    for (i = bursts.length - 1; i >= 0; i--) {
      s = bursts[i];
      s.x += s.vx; s.y += s.vy; s.vy += 0.03; s.l -= 0.025;
      if (s.l <= 0) { bursts.splice(i, 1); continue; }
      ctx.globalAlpha = s.l; ctx.fillStyle = s.c;
      sparkle(s.x, s.y, 2 + 5 * s.l);
    }
    ctx.globalAlpha = 1;
    if (glow) {
      cx += (px - cx) * 0.12; cy += (py - cy) * 0.12;
      glow.style.transform = 'translate3d(' + (cx - 180) + 'px,' + (cy - 180) + 'px,0)';
    }
  }

  function loop(t) { draw(t); raf = requestAnimationFrame(loop); }
  function start() { if (!raf && !reduce) raf = requestAnimationFrame(loop); }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (window.innerWidth !== W || Math.abs(window.
        innerHeight - H) > 200) build();
    }, 200);
  });

  if (!reduce) {
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      mx = (e.clientX / W - 0.5) * 2; my = (e.clientY / H - 0.5) * 2;
      px = e.clientX; py = e.clientY;
      if (glow) glow.classList.add('on');
    }, { passive: true });
    document.addEventListener('pointerdown', function (e) {
      for (var i = 0; i < 9; i++) {
        var ang = rand(0, 6.283), sp = rand(1, 3.2);
        bursts.push({ x: e.clientX, y: e.clientY, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1,
          l: 1, c: COLORS[(Math.random() * COLORS.length) | 0] });
      }
    }, { passive: true });
  }

  build();
  start();

  /* ---- لمعات داخل البانر والبطاقات ---- */
  function sparks(sel, n) {
    document.querySelectorAll(sel).forEach(function (host) {
      for (var i = 0; i < n; i++) {
        var s = document.createElement('i');
        s.className = 'fx-spark';
        s.textContent = '✦';
        s.setAttribute('aria-hidden', 'true');
        s.style.cssText = 'left:' + rand(4, 94) + '%;top:' + rand(6, 90) + '%;font-size:' +
          rand(9, 18) + 'px;animation-delay:' + rand(0, 6) + 's;animation-duration:' + rand(3.5, 6.5) + 's';
        host.appendChild(s);
      }
    });
  }
  sparks('.welcome-banner', 9);
  sparks('.ai-main-card', 8);
  sparks('.lab-content', 7);
  sparks('.frontend-side', 5);

  /* ---- ظهور ناعم للأقسام عند التمرير ---- */
  if ('IntersectionObserver' in window && !reduce) {
    var items = document.querySelectorAll('body > section, body > .visitor-box');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('fx-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { el.classList.add('fx-reveal'); io.observe(el); });
    root.classList.add('fx-ready');
  }

  /* ---- شريط تقدم التمرير ---- */
  var bar = document.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
