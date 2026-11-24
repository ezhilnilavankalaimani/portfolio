// Procedural, canvas-drawn weather scenes for the "Right now" cards.
// kinds: clear, partly, cloud, fog, drizzle, rain, storm, snow

const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// A soft cloud sprite: a cluster of blurred puffs, lit from above, shaded underneath.
function cloudSprite(w, h, tone) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  const puffs = 16 + Math.floor(Math.random() * 8);
  for (let i = 0; i < puffs; i++) {
    const t = Math.random();
    const x = w * (0.16 + 0.68 * t);
    const bump = Math.sin(t * Math.PI);
    const r = h * (0.2 + 0.26 * Math.random()) * (0.65 + 0.5 * bump);
    const y = h * 0.62 - bump * h * 0.2 - Math.random() * h * 0.1;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, 'rgba(255,255,255,0.95)');
    gr.addColorStop(0.55, 'rgba(255,255,255,0.55)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  g.globalCompositeOperation = 'source-atop';
  const sh = g.createLinearGradient(0, 0, 0, h);
  sh.addColorStop(0, tone[0]);
  sh.addColorStop(0.55, tone[1]);
  sh.addColorStop(1, tone[2]);
  g.fillStyle = sh;
  g.fillRect(0, 0, w, h);
  return c;
}

function blobSprite(w, h, rgb) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.scale(1, h / w);
  const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
  gr.addColorStop(0, `rgba(${rgb},0.9)`);
  gr.addColorStop(0.6, `rgba(${rgb},0.35)`);
  gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr;
  g.fillRect(0, 0, w, w);
  return c;
}

export function createWx(canvas, cfg) {
  const ctx = canvas.getContext('2d');
  const night = !!cfg.night;
  const kind = cfg.kind || 'clear';
  const inten = cfg.i == null ? 0.8 : cfg.i;
  const lean = -(0.1 + clamp((cfg.wind || 0) / 45, 0, 1) * 0.35);
  let W = 0, H = 0, dpr = 1, raf = 0, last = 0, running = false, time = 0;
  let drops = [], flakes = [], clouds = [], splashes = [], beads = [], stars = [], fogs = [];
  let flash = 0, nextFlash = rnd(2, 6), shoot = null, nextShoot = rnd(5, 10);
  let sprites = [], fogSprite = null;

  const overcast = kind === 'cloud' || kind === 'drizzle' || kind === 'rain' || kind === 'storm' || kind === 'snow';
  const dark = kind === 'storm' ? 1 : kind === 'rain' ? 0.65 : kind === 'drizzle' ? 0.45 : kind === 'cloud' ? 0.3 : kind === 'snow' ? 0.15 : 0;

  function tones() {
    if (night) return [['rgba(120,135,175,.55)', 'rgba(70,82,120,.55)', 'rgba(36,44,76,.6)']];
    if (kind === 'storm') return [['rgba(120,128,146,.95)', 'rgba(78,86,106,.95)', 'rgba(46,52,70,.95)']];
    if (kind === 'rain') return [['rgba(170,180,196,.95)', 'rgba(124,134,152,.95)', 'rgba(88,98,118,.95)']];
    if (kind === 'drizzle' || kind === 'cloud') return [['rgba(214,220,230,.95)', 'rgba(170,180,194,.9)', 'rgba(136,148,166,.9)']];
    if (kind === 'snow') return [['rgba(236,241,248,.95)', 'rgba(200,210,224,.9)', 'rgba(170,184,204,.9)']];
    return [['rgba(255,255,255,1)', 'rgba(244,247,252,.98)', 'rgba(205,215,230,.95)']];
  }

  function build() {
    drops = []; flakes = []; clouds = []; splashes = []; beads = []; stars = []; fogs = [];
    const area = W * H;
    if (kind === 'rain' || kind === 'drizzle' || kind === 'storm') {
      const dz = kind === 'drizzle';
      const n = Math.max(6, Math.round((area / 650) * Math.pow(inten, 1.7) * (dz ? 2 : 1)));
      const hv = inten > 1 ? 1.25 : 1;
      for (let i = 0; i < n; i++) {
        const z = Math.random();
        drops.push(dz
          ? { x: rnd(-W * 0.2, W * 1.1), y: rnd(-H, H), z, len: 5 + z * 11, v: 300 + z * 360, w: 0.4 + z * 0.55, a: 0.18 + z * 0.3 }
          : { x: rnd(-W * 0.2, W * 1.1), y: rnd(-H, H), z, len: (9 + z * 34) * hv, v: (520 + z * 980) * hv, w: 0.5 + z * 1.15, a: 0.28 + z * 0.5 });
      }
      const nb = Math.max(2, Math.round((kind === 'drizzle' ? 5 : 11) * inten));
      for (let i = 0; i < nb; i++) beads.push({ x: rnd(8, W - 8), y: rnd(8, H * 0.8), r: rnd(1.4, 4.2), vy: 0, wait: rnd(1, 9), trail: [] });
    }
    if (kind === 'snow') {
      const n = Math.round((area / 3800) * inten);
      for (let i = 0; i < n; i++) {
        const z = Math.random();
        flakes.push({ x: rnd(0, W), y: rnd(-H, H), z, r: 1 + z * 3.6, v: 22 + z * 46, ph: rnd(0, 6.28), sw: rnd(8, 26), sp: rnd(0.6, 1.6) });
      }
    }
    if (night && (kind === 'clear' || kind === 'partly')) {
      for (let i = 0; i < 70; i++) stars.push({ x: rnd(0, W), y: rnd(0, H * 0.8), r: rnd(0.4, 1.4), ph: rnd(0, 6.28), sp: rnd(0.8, 2.6) });
    }
    if (kind === 'partly' || overcast) {
      const tn = tones();
      sprites = [cloudSprite(420, 190, tn[0]), cloudSprite(380, 170, tn[0]), cloudSprite(460, 200, tn[0])];
      const count = kind === 'partly' ? 3 : kind === 'cloud' ? 7 : kind === 'snow' ? 6 : 8;
      for (let i = 0; i < count; i++) {
        const s = sprites[i % sprites.length];
        const sc = (kind === 'partly' ? rnd(0.45, 0.8) : rnd(0.8, 1.5)) * (W / 360);
        clouds.push({ s, sc, x: rnd(-s.width * sc, W), y: rnd(-0.05 * H, kind === 'partly' ? H * 0.5 : H * 0.42) - s.height * sc * 0.35, v: rnd(5, 16) * (0.6 + sc * 0.5), a: kind === 'partly' ? rnd(0.8, 0.95) : rnd(0.7, 0.95) });
      }
      clouds.sort((a, b) => a.sc - b.sc);
    }
    if (kind === 'fog') {
      fogSprite = blobSprite(300, 90, night ? '150,165,205' : '255,255,255');
      for (let i = 0; i < 6; i++) fogs.push({ x: rnd(-200, W), y: rnd(H * 0.05, H * 0.95), sc: rnd(1.4, 2.6) * (W / 360), v: rnd(4, 12) * (i % 2 ? -1 : 1), a: rnd(0.35, 0.7) });
    }
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(60, Math.round(r.width));
    H = Math.max(60, Math.round(r.height));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function drawSun(t) {
    const x = W * 0.84, y = H * 0.14, p = 0.5 + 0.5 * Math.sin(t * 0.8);
    const warm = cfg.phase === 'dawn' || cfg.phase === 'dusk';
    const sy = warm ? H * 0.2 : y;
    const g = ctx.createRadialGradient(x, sy, 0, x, sy, W * 0.62);
    g.addColorStop(0, warm ? 'rgba(255,170,90,.8)' : 'rgba(255,236,160,.85)');
    g.addColorStop(0.12, warm ? 'rgba(255,150,80,.4)' : 'rgba(255,214,110,.42)');
    g.addColorStop(0.4, warm ? 'rgba(255,170,120,.12)' : 'rgba(255,225,150,.14)');
    g.addColorStop(1, 'rgba(255,230,160,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // slow god rays
    ctx.save();
    ctx.translate(x, sy);
    ctx.rotate(t * 0.04);
    for (let i = 0; i < 9; i++) {
      ctx.rotate((Math.PI * 2) / 9);
      const rg = ctx.createLinearGradient(0, 0, W * 0.9, 0);
      rg.addColorStop(0, `rgba(255,240,190,${0.1 + p * 0.05})`);
      rg.addColorStop(1, 'rgba(255,240,190,0)');
      ctx.fillStyle = rg;
      ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(W * 0.9, -22); ctx.lineTo(W * 0.9, 22); ctx.lineTo(0, 3); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    // core
    const cg = ctx.createRadialGradient(x, sy, 0, x, sy, 17);
    cg.addColorStop(0, 'rgba(255,255,245,1)');
    cg.addColorStop(0.6, 'rgba(255,240,170,.95)');
    cg.addColorStop(1, 'rgba(255,220,120,0)');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(x, sy, 17, 0, 7); ctx.fill();
    // lens flare dots toward the centre
    const dx = W / 2 - x, dy = H * 0.55 - sy;
    [[0.35, 9, 0.12], [0.6, 5, 0.1], [0.85, 13, 0.07]].forEach(([k, r, a]) => {
      ctx.fillStyle = `rgba(255,230,170,${a + p * 0.03})`;
      ctx.beginPath(); ctx.arc(x + dx * k, sy + dy * k, r, 0, 7); ctx.fill();
    });
  }

  function drawMoon(t) {
    const x = W * 0.84, y = H * 0.15;
    const h = ctx.createRadialGradient(x, y, 0, x, y, W * 0.4);
    h.addColorStop(0, 'rgba(210,225,255,.38)'); h.addColorStop(0.3, 'rgba(180,200,255,.12)'); h.addColorStop(1, 'rgba(180,200,255,0)');
    ctx.fillStyle = h; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(x - 3, y - 3, 1, x, y, 15);
    g.addColorStop(0, '#fffdf2'); g.addColorStop(1, '#dfe4f2');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(150,160,185,.35)';
    [[-4, -2, 3.2], [4, 3, 2.4], [1, -6, 1.8], [-5, 5, 1.6]].forEach(([a, b, r]) => { ctx.beginPath(); ctx.arc(x + a, y + b, r, 0, 7); ctx.fill(); });
  }

  function drawStars(t) {
    stars.forEach((s) => {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph));
      ctx.fillStyle = `rgba(235,242,255,${a * 0.9})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    });
    if (shoot) {
      const k = shoot.t / shoot.d;
      const x = shoot.x + shoot.dx * k, y = shoot.y + shoot.dy * k;
      const g = ctx.createLinearGradient(x, y, x - shoot.dx * 0.12, y - shoot.dy * 0.12);
      g.addColorStop(0, `rgba(255,255,255,${0.9 * (1 - k)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - shoot.dx * 0.12, y - shoot.dy * 0.12); ctx.stroke();
    }
  }

  function drawClouds(dt) {
    clouds.forEach((c) => {
      c.x += c.v * dt;
      const w = c.s.width * c.sc;
      if (c.x > W + 10) c.x = -w;
      ctx.globalAlpha = c.a;
      ctx.drawImage(c.s, c.x, c.y, w, c.s.height * c.sc);
    });
    ctx.globalAlpha = 1;
  }

  function drawRain(dt) {
    const col = night ? '190,212,255' : '86,116,168';
    ctx.lineCap = 'round';
    for (const d of drops) {
      const dx = d.v * lean * -1 * dt * 0 + d.v * lean * dt;
      d.x += dx; d.y += d.v * dt;
      const tx = d.len * lean, ty = d.len;
      if (d.y - ty > H) {
        // splash near the bottom for the nearer drops
        if (d.z > 0.35 && Math.random() < 0.55) splashes.push({ x: d.x, y: H - rnd(1, 16), t: 0, d: rnd(0.35, 0.6), r: 3 + d.z * 11, up: [rnd(-1, 1), rnd(-1, 1), rnd(-1, 1)] });
        d.y = rnd(-60, -4); d.x = rnd(-W * 0.2, W * 1.1);
      }
      ctx.strokeStyle = `rgba(${col},${d.a})`;
      ctx.lineWidth = d.w;
      ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - tx, d.y - ty); ctx.stroke();
    }
    // ripples and droplets
    for (let i = splashes.length - 1; i >= 0; i--) {
      const s = splashes[i];
      s.t += dt;
      const k = s.t / s.d;
      if (k >= 1) { splashes.splice(i, 1); continue; }
      const rx = 1.5 + s.r * k;
      ctx.strokeStyle = `rgba(${col},${0.5 * (1 - k)})`;
      ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.ellipse(s.x, s.y, rx, rx * 0.28, 0, 0, 7); ctx.stroke();
      ctx.fillStyle = `rgba(${col},${0.6 * (1 - k)})`;
      s.up.forEach((u, j) => {
        const px = s.x + u * 9 * k, py = s.y - Math.sin(k * Math.PI) * (6 + j * 3);
        ctx.beginPath(); ctx.arc(px, py, 0.9, 0, 7); ctx.fill();
      });
    }
    // low mist where the rain lands
    const mg = ctx.createLinearGradient(0, H * 0.7, 0, H);
    mg.addColorStop(0, 'rgba(255,255,255,0)'); mg.addColorStop(1, night ? 'rgba(160,180,230,.14)' : 'rgba(255,255,255,.28)');
    ctx.fillStyle = mg; ctx.fillRect(0, H * 0.7, W, H * 0.3);
  }

  function drawBeads(dt) {
    // water beads on the glass; they gather, then slide down leaving a trail
    for (const b of beads) {
      if (b.vy === 0) {
        b.r += dt * 0.12;
        b.wait -= dt;
        if (b.wait <= 0 && b.r > 2.6) { b.vy = rnd(30, 70); b.trail = []; }
      } else {
        b.trail.push([b.x, b.y]); if (b.trail.length > 28) b.trail.shift();
        b.y += b.vy * dt; b.vy *= 0.985; b.r = Math.max(1.6, b.r - dt * 0.35);
        if (b.vy < 6 || b.y > H + 6) {
          if (b.y > H + 4) { b.y = rnd(4, H * 0.5); b.x = rnd(8, W - 8); b.r = rnd(1.2, 2.2); }
          b.vy = 0; b.wait = rnd(3, 11); b.trail = [];
        }
      }
      if (b.trail.length > 1) {
        ctx.strokeStyle = night ? 'rgba(200,220,255,.12)' : 'rgba(255,255,255,.4)';
        ctx.lineWidth = Math.max(1, b.r * 0.55);
        ctx.beginPath(); ctx.moveTo(b.trail[0][0], b.trail[0][1]);
        b.trail.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.stroke();
      }
      const g = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x, b.y, b.r);
      g.addColorStop(0, night ? 'rgba(220,235,255,.55)' : 'rgba(255,255,255,.85)');
      g.addColorStop(0.7, night ? 'rgba(150,175,230,.18)' : 'rgba(120,150,200,.16)');
      g.addColorStop(1, night ? 'rgba(20,30,60,.4)' : 'rgba(40,70,120,.34)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * 0.86, b.r, 0, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.9)';
      ctx.beginPath(); ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.38, Math.max(0.5, b.r * 0.22), 0, 7); ctx.fill();
    }
  }

  function drawSnow(dt, t) {
    for (const f of flakes) {
      f.y += f.v * dt;
      const sx = Math.sin(t * f.sp + f.ph) * f.sw * dt * 1.6;
      f.x += sx + lean * 40 * dt * (0.4 + f.z);
      if (f.y > H + 6) { f.y = rnd(-20, -4); f.x = rnd(0, W); }
      if (f.x < -8) f.x = W + 6; if (f.x > W + 8) f.x = -6;
      const a = 0.4 + f.z * 0.55;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(0.55, `rgba(255,255,255,${a * 0.65})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 7); ctx.fill();
    }
    const sg = ctx.createLinearGradient(0, H - 16, 0, H);
    sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(1, night ? 'rgba(220,232,255,.28)' : 'rgba(255,255,255,.7)');
    ctx.fillStyle = sg; ctx.fillRect(0, H - 16, W, 16);
  }

  function drawFog(dt) {
    fogs.forEach((f) => {
      f.x += f.v * dt;
      const w = fogSprite.width * f.sc;
      if (f.v > 0 && f.x > W) f.x = -w; if (f.v < 0 && f.x < -w) f.x = W;
      ctx.globalAlpha = f.a;
      ctx.drawImage(fogSprite, f.x, f.y - (fogSprite.height * f.sc) / 2, w, fogSprite.height * f.sc);
    });
    ctx.globalAlpha = 1;
  }

  function frame(dt) {
    time += dt;
    ctx.clearRect(0, 0, W, H);
    if (dark > 0) {
      const dg = ctx.createLinearGradient(0, 0, 0, H);
      const a = night ? dark * 0.35 : dark * 0.4;
      dg.addColorStop(0, `rgba(36,44,62,${a})`); dg.addColorStop(0.6, `rgba(36,44,62,${a * 0.35})`); dg.addColorStop(1, 'rgba(36,44,62,0)');
      ctx.fillStyle = dg; ctx.fillRect(0, 0, W, H);
    }
    if (kind === 'clear' || kind === 'partly') {
      if (night) { drawStars(time); drawMoon(time); } else drawSun(time);
    }
    if (kind === 'fog') drawFog(dt);
    if (clouds.length) drawClouds(dt);
    if (drops.length) drawRain(dt);
    if (flakes.length) drawSnow(dt, time);
    if (beads.length) drawBeads(dt);
    if (kind === 'storm') {
      nextFlash -= dt;
      if (nextFlash <= 0) { flash = 1; nextFlash = rnd(3, 9); if (Math.random() < 0.55) setTimeout(() => { flash = 0.8; }, 140); }
      if (flash > 0.01) { ctx.fillStyle = `rgba(225,235,255,${flash * 0.55})`; ctx.fillRect(0, 0, W, H); flash *= Math.pow(0.0008, dt); }
    }
    if (night && (kind === 'clear' || kind === 'partly')) {
      nextShoot -= dt;
      if (nextShoot <= 0 && !shoot) { shoot = { x: rnd(W * 0.1, W * 0.6), y: rnd(0, H * 0.3), dx: rnd(90, 150), dy: rnd(40, 70), t: 0, d: 0.9 }; nextShoot = rnd(8, 15); }
      if (shoot) { shoot.t += dt; if (shoot.t >= shoot.d) shoot = null; }
    }
  }

  function loop(ts) {
    if (!running) return;
    const dt = Math.min(0.05, (ts - last) / 1000 || 0.016);
    last = ts;
    frame(dt);
    raf = requestAnimationFrame(loop);
  }

  return {
    start() {
      resize();
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        for (let i = 0; i < 40; i++) frame(0.05);
        return;
      }
      if (running) return;
      running = true; last = performance.now(); raf = requestAnimationFrame(loop);
    },
    resume() { if (running || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
    resize,
  };
}
