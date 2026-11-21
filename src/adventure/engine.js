// Game engine for the adventure version of the portfolio.
// Plain JS (no React): it owns the physics, input and camera and writes transforms straight to the DOM,
// so the game loop never triggers React re-renders. React only hears about meaningful events.
import { sfx } from "./audio";

export const VW = 1440;
export const VH = 810;
export const GROUND = 640;
export const WORLD_W = 17280;
export const POOL = { x0: 10200, x1: 12840, seabed: 1390 };

export const LEVELS = [
  { id: "home", x: 0, name: "Welcome", big: "" },
  { id: "edu", x: 1440, name: "Education", big: "EDUCATION", n: 1 },
  { id: "amazon", x: 2880, name: "Experience · Amazon", big: "AMAZON", n: 2 },
  { id: "move", x: 4320, name: "Chennai → Toronto", big: "", n: 3 },
  { id: "work", x: 5760, name: "Experience · Walmart · Kelly", big: "WORK", n: 4 },
  { id: "td", x: 7200, name: "Experience · TD", big: "TD", n: 5 },
  { id: "today", x: 8640, name: "Today", big: "TODAY", n: 6 },
  { id: "skills", x: 10080, name: "Skills · Underwater", big: "SKILLS", n: 7 },
  { id: "projects", x: 12960, name: "Projects", big: "PROJECTS", n: 8 },
  { id: "kudos", x: 14400, name: "Testimonials", big: "KUDOS", n: 9 },
  { id: "contact", x: 15840, name: "Contact", big: "CONTACT", n: 10 },
];

export const HURDLE_W = 72;
export const HURDLE_H = 58;
export const HURDLES = [430, 930, 2220, 2440, 3310, 3780, 4900, 6190, 6660, 9920, 13540, 14940];
export const ROOF = { x0: 8230, x1: 8600, y: 430 };
export const LADDER = { x: 8255, top: 430, bottom: GROUND };
export const BALLOON_HOME = { x: 8640 + 640, y: GROUND };
export const FLY_BOUNDS = { x0: 8640 + 220, x1: 10080 - 200, y0: 350, y1: GROUND };

const PLATFORMS = [
  ...HURDLES.map((h) => ({ x0: h + 4, x1: h + HURDLE_W - 4, y: GROUND - HURDLE_H })),
  { x0: ROOF.x0, x1: ROOF.x1, y: ROOF.y },
];

export const SKILL_COUNT = 12;
export const FLAG = { x: 17040, top: 250 };
export const CASTLE_X = 17205;

function buildItems() {
  const items = [];
  const push = (type, x, y, r = 30, extra = {}) => items.push({ id: `${type}${items.length}`, type, x, y, r, ...extra });
  [0, 1, 2, 3, 4, 8, 9, 10].forEach((li) => {
    const x0 = LEVELS[li].x;
    [640, 700, 760].forEach((dx) => push("coin", x0 + dx, GROUND - 80));
    [1180, 1240, 1300].forEach((dx, k) => push("coin", x0 + dx, GROUND - 250 + (k === 1 ? -30 : 0)));
  });
  for (let i = 0; i < 5; i++) push("pkg", 2880 + 340 + i * 90, GROUND - 34, 34);
  for (let i = 0; i < 5; i++) push("chq", 7200 + 360 + i * 170, 450, 34);
  [8370, 8440, 8510].forEach((x) => push("coin", x, ROOF.y - 80));
  for (let i = 0; i < 8; i++) push("star", 8640 + 250 + i * 150, 360 + (i % 3) * 110, 30);
  for (let i = 0; i < SKILL_COUNT; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    push("skill", 10420 + col * 620 + (row % 2) * 160, 790 + row * 240, 48, { index: i });
  }
  for (let i = 0; i < 5; i++) push("chest", 13160 + i * 250, GROUND - 36, 52, { index: i });
  return items;
}
export const ITEMS = buildItems();

const SKY = [
  [0, "#4fc3e8", "#8cd0e8"], [1440, "#7fd6c2", "#e9f7c7"], [2880, "#8fd0ea", "#f0f8ff"], [4320, "#ffc98a", "#fff0cf"], [5040, "#8fd0ea", "#eaf6ff"],
  [5760, "#a8dca0", "#fff4c7"], [7200, "#9fc2ce", "#cfe8ef"], [8640, "#4fc3e8", "#e9f7c7"], [10080, "#6fcdf0", "#bfeef7"], [12960, "#7fd6c2", "#e9f7c7"],
  [14400, "#ffb86b", "#ffe6b3"], [15840, "#34296b", "#e8846e"], [17280, "#34296b", "#e8846e"],
];
// rain only on the Chennai → Toronto slide
const RAIN = [[4320, 5760]];
const rainAt = (x) => {
  let r = 0;
  for (const [a, b] of RAIN) {
    const k = Math.max(0, Math.min(1, Math.min(x - a, b - x) / 320));
    r = Math.max(r, k * k * (3 - 2 * k));
  }
  return r;
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`;
};
function skyAt(x) {
  let i = 0;
  while (i < SKY.length - 2 && x > SKY[i + 1][0]) i++;
  const [x0, a0, b0] = SKY[i], [x1, a1, b1] = SKY[i + 1];
  const t = Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
  return [mix(a0, a1, t), mix(b0, b1, t)];
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const approach = (v, t, d) => (v < t ? Math.min(t, v + d) : Math.max(t, v - d));
export const inPool = (x) => x > POOL.x0 && x < POOL.x1;
const G = 2300;

export class Engine {
  constructor({ els, emit, collected = new Set(), start }) {
    this.els = els;
    this.emit = emit;
    this.collected = collected;
    this.keys = {};
    this.buddy = "tiger";
    this.pressed = {};
    this.time = 0;
    this.paused = false;
    this.raf = 0;
    this.lvl = -1;
    this.bubbleT = 0;
    this.skyT = 0;
    this.p = { x: start, y: GROUND, vx: 0, vy: 0, face: 1, ground: true, jumps: 0, mode: "land", mounted: false, anim: "", hop: 0 };
    this.t = { x: start - 160, y: GROUND, vx: 0, vy: 0, face: 1, ground: true, swim: false, mode: "follow", call: false, roar: 0, celebrate: 0, anim: "" };
    this.b = { x: BALLOON_HOME.x, y: BALLOON_HOME.y, flying: false, release: 0 };
    this.cam = { x: clamp(start - 560, 0, WORLD_W - VW), y: 0 };
    this.stats = { hurdles: 0, flyHigh: false };
    this.onKey = this.onKey.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onBlur = () => { this.keys = {}; };
    this.onVis = () => { if (document.hidden) this.stop(); else if (!this.paused) this.run(); };
    this.itemEls = new Map();
    els.root.querySelectorAll("[data-item]").forEach((el) => {
      this.itemEls.set(el.dataset.item, el);
      if (collected.has(el.dataset.item)) el.classList.add("got");
    });
    this.bubbles = Array.from(els.root.querySelectorAll(".av-bub"));
    this.bi = 0;
  }

  /* ---------- lifecycle ---------- */
  mount() {
    window.addEventListener("keydown", this.onKey);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    document.addEventListener("visibilitychange", this.onVis);
    this.run();
  }
  unmount() {
    this.stop();
    window.removeEventListener("keydown", this.onKey);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    document.removeEventListener("visibilitychange", this.onVis);
  }
  run() {
    if (this.raf) return;
    let prev = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      if (!this.paused) this.update(dt);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
  setPaused(v) {
    this.paused = v;
    if (v) this.keys = {};
  }

  /* ---------- input ---------- */
  keyName(e) {
    switch (e.key) {
      case "ArrowLeft": case "a": case "A": return "left";
      case "ArrowRight": case "d": case "D": return "right";
      case "ArrowUp": case "w": case "W": return "up";
      case "ArrowDown": case "s": case "S": return "down";
      case " ": return "jump";
      case "Shift": return "sprint";
      case "e": case "E": return "act";
      case "t": case "T": return "stay";
      case "c": case "C": return "call";
      case "v": case "V": return "roar";
      default: return null;
    }
  }
  onKey(e) {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = this.keyName(e);
    if (!k) return;
    if (["left", "right", "up", "down", "jump"].includes(k)) e.preventDefault();
    if (this.paused) return;
    if (!this.keys[k] && !e.repeat) this.pressed[k] = true;
    if (k === "up") this.pressed.jump = this.pressed.jump || !e.repeat;
    this.keys[k] = true;
  }
  onKeyUp(e) {
    const k = this.keyName(e);
    if (k) this.keys[k] = false;
  }
  setKey(k, v) {
    if (v && !this.keys[k]) this.pressed[k] = true;
    if (v && k === "up") this.pressed.jump = true;
    this.keys[k] = v;
  }
  take(k) {
    const v = this.pressed[k];
    this.pressed[k] = false;
    return !!v;
  }

  /* ---------- actions ---------- */
  teleport(x, y = GROUND) {
    const p = this.p;
    if (p.mode === "fly") this.dismountBalloon();
    p.x = x; p.y = y; p.vx = p.vy = 0; p.mode = "land"; p.ground = true; p.mounted = p.mounted && x < POOL.x0 - 100;
    const t = this.t;
    t.x = x - 160 * p.face; t.y = GROUND; t.vx = 0; t.vy = 0; t.swim = false; t.call = false;
    this.cam.x = clamp(x - 560, 0, WORLD_W - VW);
    this.cam.y = 0;
  }
  callTiger() {
    const t = this.t, p = this.p;
    t.mode = "follow";
    t.call = true;
    if (Math.abs(p.x - t.x) > 800) {
      // far away: dash in from just off-screen so the buddy arrives right away
      let nx = clamp(p.x + (t.x < p.x ? -1 : 1) * (VW * 0.62), 40, WORLD_W - 40);
      if (nx > POOL.x0 - 40 && nx < POOL.x1 + 40) nx = p.x < POOL.x0 ? POOL.x0 - 60 : POOL.x1 + 60;
      t.x = nx; t.y = GROUND; t.vy = 0; t.swim = false; t.ground = true;
    }
    this.t.roar = 0.9;
    sfx("roar");
    this.emit("tiger", "call");
  }
  roar() {
    this.t.roar = 1;
    sfx("roar");
    this.emit("tiger", "roar");
  }
  toggleStay() {
    this.t.mode = this.t.mode === "follow" ? "stay" : "follow";
    this.emit("tigermode", this.t.mode);
  }
  nearTiger() { return !this.t.swim && this.t.ground && Math.abs(this.p.x - this.t.x) < 190; }
  tryMount() {
    const p = this.p, t = this.t;
    if (p.mode !== "land") return false;
    if (p.mounted) {
      p.mounted = false;
      t.x = p.x - p.face * 20;
      sfx("mount");
      this.emit("dismount");
      return true;
    }
    if (!this.nearTiger() && p.ground) {
      // too far: summon the buddy and hop on the moment it arrives
      this.mountWhenNear = 4;
      this.callTiger();
      return true;
    }
    if (this.nearTiger() && p.ground) {
      p.mounted = true;
      p.x = t.x;
      t.call = false;
      sfx("mount");
      this.emit("mount");
      return true;
    }
    return false;
  }
  nearBalloon() { return Math.abs(this.p.x - this.b.x) < 170 && this.p.ground && this.b.y >= GROUND - 4; }
  boardBalloon() {
    const p = this.p;
    p.mounted = false;
    p.mode = "fly";
    p.x = this.b.x; p.y = this.b.y - 6; p.vx = p.vy = 0;
    this.b.flying = true;
    this.b.release = 0;
    sfx("whoosh");
    this.emit("board");
  }
  dismountBalloon() {
    const p = this.p;
    p.mode = "land";
    p.ground = false;
    p.vy = 0;
    this.b.flying = false;
    this.b.release = 3;
    this.emit("unboard");
  }

  startEnding() {
    const p = this.p;
    p.mounted = false;
    p.mode = "end";
    p.vx = 0; p.vy = 0;
    p.x = FLAG.x - 16;
    p.y0 = clamp(Math.min(p.y, GROUND - 130), FLAG.top + 60, GROUND - 130);
    p.y = p.y0;
    p.face = 1;
    this.t.call = false; this.t.mode = "follow";
    this.ending = { t: 0 };
    this.els.stage.classList.add("av-flagdown");
    sfx("win");
    this.emit("flag");
  }

  updateEnding(dt) {
    const p = this.p, e = this.ending;
    e.t += dt;
    if (e.t < 1.7) {
      const k = e.t / 1.7;
      p.x = FLAG.x - 16; p.y = p.y0 + (GROUND - p.y0) * k; p.anim = "climb";
    } else if (e.t < 2.3) {
      p.y = GROUND; p.anim = "idle"; p.face = 1;
    } else if (p.x < CASTLE_X) {
      p.x = Math.min(CASTLE_X, (p.x < FLAG.x ? FLAG.x : p.x) + 250 * dt); p.y = GROUND; p.anim = "run"; p.face = 1;
    } else {
      this.ending = null; this.ended = true; p.hidden = true; p.anim = "idle";
      this.emit("ending");
    }
  }

  setAward(s) { const el = this.els.root && this.els.root.querySelector(".av-award"); if (el) el.dataset.state = s; }

  resetEnding() {
    this.ending = null; this.ended = false; this.p.hidden = false; this.p.mode = "land";
    this.els.stage.classList.remove("av-flagdown");
    this.teleport(60);
  }

  /* ---------- simulation ---------- */
  update(dt) {
    this.time += dt;
    const k = this.keys;
    const jp = this.take("jump");
    const ep = this.take("act");
    if (this.take("stay")) this.toggleStay();
    if (this.take("call")) this.callTiger();
    if (this.take("roar")) this.roar();
    this.updatePlayer(dt, k, jp, ep);
    this.updateTiger(dt);
    this.updateBalloon(dt);
    this.collect();
    this.updateCamera(dt);
    this.write(dt);
  }

  updatePlayer(dt, k, jp, ep) {
    const p = this.p;
    const ax = (k.right ? 1 : 0) - (k.left ? 1 : 0);
    const ay = (k.down ? 1 : 0) - (k.up ? 1 : 0);
    const sprint = !!k.sprint;
    if (ax) p.face = ax;
    if (!this.moved && (ax || jp)) { this.moved = true; this.emit("start"); }
    if (p.hop > 0) p.hop -= dt;
    const was = p.mode;

    if (p.mode === "fly") {
      p.vx = approach(p.vx, ax * 300, 700 * dt);
      p.vy = approach(p.vy, ay * 240 + 14, 600 * dt);
      p.x = clamp(p.x + p.vx * dt, FLY_BOUNDS.x0, FLY_BOUNDS.x1);
      p.y = clamp(p.y + p.vy * dt, FLY_BOUNDS.y0, FLY_BOUNDS.y1);
      if (p.y < 440 && !this.stats.flyHigh) { this.stats.flyHigh = true; this.emit("flyhigh"); }
      if (ep) { this.dismountBalloon(); }
      p.anim = "fly";
      return;
    }

    if (p.mode === "swim") {
      const maxS = sprint ? 400 : 270;
      p.vx += (ax * maxS - p.vx) * Math.min(1, dt * 3.2);
      const ty = ay ? ay * maxS : Math.sin(this.time * 2.2) * 16 - 18;
      p.vy += (ty - p.vy) * Math.min(1, dt * 3);
      if (jp) { p.vy = -360; sfx("swim"); }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const surf = GROUND + 92;
      if (p.y < surf - 22) {
        // at the surface: hop out
        p.y = surf - 22;
        if (p.vy < 0) p.vy = 0;
      }
      if (p.y > surf + 8) p.x = clamp(p.x, POOL.x0 + 40, POOL.x1 - 40);
      const seabed = POOL.seabed + 24;
      if (p.y >= seabed) { p.y = seabed; p.vy = Math.min(0, p.vy); this.emit("seabed"); }
      if (p.y <= surf - 10 && (jp || k.up) && (p.x < POOL.x0 + 90 || p.x > POOL.x1 - 90)) {
        p.mode = "land"; p.vy = -760; p.vx = p.face * 320; p.ground = false; p.jumps = 1; p.y = GROUND + 20;
        sfx("jump");
      } else if (!inPool(p.x) && p.y <= GROUND + 100) {
        p.mode = "land"; p.y = GROUND; p.vy = 0; p.ground = true; p.jumps = 0;
      }
      this.bubbleT -= dt;
      if (this.bubbleT <= 0 && (Math.abs(p.vx) + Math.abs(p.vy) > 60 || Math.random() < 0.1)) {
        this.bubbleT = 0.22;
        this.spawnBubble(p.x + p.face * 40, p.y - 90);
        if (Math.abs(p.vx) > 120) sfx("swim");
      }
      p.anim = Math.abs(p.vy) > 140 && ay > 0 ? "dive" : "swim";
      return;
    }

    if (p.mode === "climb") {
      p.x = LADDER.x;
      p.vy = ay * 230;
      p.y += p.vy * dt;
      p.vx = 0;
      if (p.y <= LADDER.top) { p.y = LADDER.top; p.mode = "land"; p.ground = true; p.vy = 0; p.x = LADDER.x + 54; p.jumps = 0; }
      else if (p.y >= LADDER.bottom) { p.y = LADDER.bottom; p.mode = "land"; p.ground = true; p.vy = 0; p.jumps = 0; }
      else if (jp) { p.mode = "land"; p.vy = -640; p.vx = p.face * 240; p.ground = false; p.jumps = 1; sfx("jump"); }
      p.anim = "climb";
      this.emit("climb");
      return;
    }

    // ---- Master ninja award ----
    const AX = 8640 + 900;
    if (this.awardT == null && p.x > AX - 450 && p.x < AX + 500 && p.mode === "land") { this.awardT = 0; this.setAward("give"); this.emit("award", "give"); }
    if (this.awardT != null && this.awardT < 99) {
      this.awardT += dt;
      if (this.awardT > 2.6 && !this.awardPin) {
        this.awardPin = true;
        const el = this.els.root.querySelector(".av-award");
        if (el) { el.style.setProperty("--dx", `${this.p.x - 9660}px`); el.style.setProperty("--dy", `${this.p.y - 125 - 490}px`); }
        this.setAward("pin");
      }
      if (this.awardT > 3.5 && !this.awardPinned) { this.awardPinned = true; this.els.stage.classList.add("av-hasmedal"); this.emit("award", "pinned"); }
      if (this.awardT > 5.5 && this.awardS !== "fly") { this.awardS = "fly"; this.setAward("fly"); }
      if (this.awardT > 12 && this.awardS !== "gone") { this.awardS = "gone"; this.setAward("gone"); this.awardT = 100; }
    }

    if (this.ending) { this.updateEnding(dt); return; }
    if (this.ended) { p.vx = 0; p.anim = "idle"; return; }
    if (p.mode === "land" && p.x >= FLAG.x - 24 && !this.ended) { this.startEnding(); return; }

    // ---- land ----
    if (ep) {
      if (!p.mounted && this.nearBalloon()) this.boardBalloon(); else this.tryMount();
      if (p.mode === "fly") return;
    }
    const max = p.mounted ? (sprint ? 1000 : 740) : sprint ? 780 : 480;
    const acc = p.ground ? 3200 : 1800;
    p.vx = approach(p.vx, ax * max, (ax ? acc : 3800) * dt);

    // ladder: Up at the base, Down on the roof, or anywhere on the rails
    if (!p.mounted && Math.abs(p.x - LADDER.x) < 40 && ay !== 0) {
      const onRoof = p.ground && p.y <= LADDER.top + 2;
      const atBase = p.ground && p.y >= LADDER.bottom - 2;
      const onRails = !p.ground && p.y > LADDER.top && p.y < LADDER.bottom;
      if ((ay < 0 && atBase) || (ay > 0 && onRoof) || onRails) {
        p.mode = "climb"; p.vx = 0; p.vy = 0;
        return;
      }
    }

    // hurdle assist: jump automatically when running into a hurdle
    let wantJump = jp;
    if (ax && p.ground && Math.abs(p.vx) > 120) {
      const front = p.x + ax * (p.mounted ? 90 : 34);
      for (const h of HURDLES) {
        const ahead = (h + HURDLE_W / 2 - front) * ax;
        if (ahead > 0 && ahead < 70 + Math.abs(p.vx) * 0.1) { wantJump = true; this.stats.hurdles += 0; break; }
      }
    }
    if (wantJump) {
      if (p.ground) {
        p.vy = p.mounted ? -980 : -880; p.ground = false; p.jumps = 1; sfx(p.mounted ? "mount" : "jump");
        this.emit("jump");
      } else if (p.jumps < 2 && !p.mounted && jp) {
        p.vy = -800; p.jumps = 2; sfx("djump"); this.emit("djump");
      }
    }

    p.vy += G * dt;
    let nx = p.x + p.vx * dt;
    const half = p.mounted ? 100 : 26;
    // hurdles block the way if the player is below their top
    if (p.y > GROUND - HURDLE_H + 4) {
      for (const h of HURDLES) {
        const c = h + HURDLE_W / 2;
        if (Math.abs(nx - c) < HURDLE_W / 2 + half && Math.abs(p.x - c) >= HURDLE_W / 2 + half - 2) { nx = p.x; p.vx = 0; break; }
      }
    }
    p.x = clamp(nx, 40, WORLD_W - 40);
    const prevY = p.y;
    p.y += p.vy * dt;
    let landed = false;
    if (p.vy >= 0) {
      for (const pl of PLATFORMS) {
        if (p.x > pl.x0 - 10 && p.x < pl.x1 + 10 && prevY <= pl.y + 3 && p.y >= pl.y) {
          if (pl.y < GROUND - 100 || Math.abs(prevY - pl.y) < 40 || prevY < pl.y) {
            p.y = pl.y; landed = true;
            if (pl.y === GROUND - HURDLE_H && !p.ground) { this.stats.hurdles++; this.emit("hurdle", this.stats.hurdles); }
            if (pl.y === ROOF.y && !p.ground) this.emit("roof");
            break;
          }
        }
      }
    }
    if (!landed && p.y >= GROUND && !inPool(p.x)) { p.y = GROUND; landed = true; }
    if (landed) {
      if (!p.ground && p.vy > 700) this.emit("land");
      p.vy = 0; p.ground = true; p.jumps = 0;
    } else {
      p.ground = false;
    }
    // falling into the pool
    if (!p.ground && p.y > GROUND + 6 && inPool(p.x)) {
      p.mounted = false;
      p.mode = "swim";
      p.vy *= 0.35; p.vx *= 0.6;
      sfx("splash");
      this.emit("splash", { x: p.x });
      for (let i = 0; i < 6; i++) this.spawnBubble(p.x + (i - 3) * 14, GROUND + 20);
    }
    // keep out of the water walls above ground level
    if (p.y > GROUND + 4 && !inPool(p.x) && p.ground === false) p.x = clamp(p.x, POOL.x0 - 4, POOL.x1 + 4);

    // animation state
    if (p.mounted) p.anim = "ride";
    else if (!p.ground) p.anim = p.vy < 0 ? (p.jumps >= 2 ? "djump" : "jump") : "fall";
    else if (Math.abs(p.vx) < 12) p.anim = p.hop > 0 ? "win" : "idle";
    else if (Math.abs(p.vx) < 260) p.anim = "walk";
    else if (Math.abs(p.vx) < 560) p.anim = "run";
    else p.anim = "sprint";
    if (was !== p.mode) this.emit("mode", p.mode);
  }

  updateTiger(dt) {
    const p = this.p, t = this.t;
    if (t.roar > 0) t.roar -= dt;
    if (this.mountWhenNear > 0) {
      this.mountWhenNear -= dt;
      if (!p.mounted && p.mode === "land" && p.ground && this.nearTiger()) { this.mountWhenNear = 0; this.tryMount(); }
    }
    if (t.celebrate > 0) {
      t.celebrate -= dt;
      if (t.ground && !t.swim && t.vy === 0 && Math.sin(this.time * 14) > 0.97) t.vy = -620;
    }
    if (p.mounted) {
      t.x = p.x; t.y = p.y; t.vx = p.vx; t.face = p.face; t.ground = p.ground; t.swim = false; t.vy = p.vy;
      t.anim = !p.ground ? "air" : Math.abs(p.vx) > 40 ? (Math.abs(p.vx) > 560 ? "sprint" : "run") : "idle";
      return;
    }
    let desired = 0;
    if (t.mode === "follow" || t.call) {
      const target = p.x - p.face * (t.call ? 90 : 150);
      const dx = target - t.x;
      const d = Math.abs(dx);
      const speed = t.call ? 1900 : d > 650 ? 1050 : 540;
      if (d > 16) desired = Math.sign(dx) * Math.min(speed, d * 5);
      if (t.call && d < 70) t.call = false;
    }
    if (t.mode === "follow" && Math.abs(p.x - t.x) > 1500) {
      t.x = clamp(p.x - p.face * 400, 40, WORLD_W - 40); t.y = GROUND; t.vy = 0; t.vx = 0;
      t.swim = inPool(t.x) ? false : false; t.ground = true;
      if (inPool(t.x)) t.x = p.x < POOL.x0 ? POOL.x0 - 60 : POOL.x1 + 60;
    }
    const lim = t.swim ? (Math.abs(p.x - t.x) > 500 ? 600 : 300) : 2000;
    desired = clamp(desired, -lim, lim);
    t.vx = approach(t.vx, desired, (t.call ? 9000 : 2600) * dt);
    if (Math.abs(t.vx) > 25) t.face = Math.sign(t.vx);
    else t.face = p.x >= t.x ? 1 : -1;

    if (t.swim) {
      const target = GROUND + 28 + Math.sin(this.time * 3) * 4;
      t.y += (target - t.y) * Math.min(1, dt * 5);
      t.vy = 0;
      t.x += t.vx * dt;
      if (!inPool(t.x)) { t.swim = false; t.y = GROUND; t.ground = true; }
      else t.x = clamp(t.x, POOL.x0 + 80, POOL.x1 - 80);
    } else {
      if (t.ground && Math.abs(t.vx) > 150) {
        const front = t.x + Math.sign(t.vx) * 80;
        for (const h of HURDLES) {
          const ahead = (h + HURDLE_W / 2 - front) * Math.sign(t.vx);
          if (ahead > 0 && ahead < 120) { t.vy = -900; t.ground = false; break; }
        }
      }
      t.vy += G * dt;
      t.x = clamp(t.x + t.vx * dt, 40, WORLD_W - 40);
      t.y += t.vy * dt;
      if (t.y >= GROUND && !inPool(t.x)) { t.y = GROUND; t.vy = 0; t.ground = true; }
      else if (t.y >= GROUND) { t.ground = false; if (t.y > GROUND + 14) { t.swim = true; t.vy = 0; sfx("splash"); } }
      else t.ground = false;
    }
    t.anim = !t.ground && !t.swim ? "air" : t.swim ? "swim" : Math.abs(t.vx) > 40 ? (Math.abs(t.vx) > 560 ? "sprint" : "run") : "idle";
  }

  updateBalloon(dt) {
    const b = this.b;
    if (b.flying) { b.x = this.p.x; b.y = this.p.y + 6; return; }
    if (b.release > 0) { b.release -= dt; return; }
    const k = Math.min(1, dt * 2.2);
    b.x += (BALLOON_HOME.x - b.x) * k;
    b.y += (BALLOON_HOME.y - b.y) * k;
  }

  collect() {
    const p = this.p;
    const cx = p.x, cy = p.y - (p.mounted ? 120 : p.mode === "swim" ? 92 : 90);
    for (const it of ITEMS) {
      if (this.collected.has(it.id)) continue;
      const dx = it.x - cx, dy = it.y - cy;
      const r = it.r + 56;
      if (dx * dx + dy * dy > r * r) continue;
      if (it.type === "star" && p.mode !== "fly") continue;
      if (it.type === "skill" && p.mode !== "swim") continue;
      this.collected.add(it.id);
      const el = this.itemEls.get(it.id);
      if (el) el.classList.add(it.type === "chest" ? "open" : "got");
      sfx(it.type === "chest" ? "chest" : "coin");
      this.emit("item", it);
    }
  }

  updateCamera(dt) {
    const p = this.p, c = this.cam;
    const tx = clamp(p.x - 560 + p.face * 70 + (p.mode === "fly" ? 0 : 0), 0, WORLD_W - VW);
    const deep = inPool(p.x) && p.y > GROUND + 30;
    const ty = deep ? clamp(p.y - 470, 0, 640) : 0;
    const k = Math.min(1, dt * 5);
    c.x += (tx - c.x) * k;
    c.y += (ty - c.y) * Math.min(1, dt * 3.5);
    if (Math.abs(tx - c.x) < 0.05) c.x = tx;
    const l = this.levelAt(p.x);
    if (l !== this.lvl) { this.lvl = l; this.emit("level", l); }
  }
  levelAt(x) {
    let l = 0;
    for (let i = 0; i < LEVELS.length; i++) if (x >= LEVELS[i].x) l = i;
    return l;
  }

  spawnBubble(x, y) {
    if (!this.bubbles.length) return;
    const el = this.bubbles[this.bi++ % this.bubbles.length];
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
    el.classList.remove("on");
    void el.offsetWidth;
    el.classList.add("on");
  }

  /* ---------- rendering (direct DOM writes) ---------- */
  write(dt) {
    const { cam, p, t, b } = this;
    const e = this.els;
    const cx = Math.round(cam.x * 10) / 10, cy = Math.round(cam.y * 10) / 10;
    e.world.style.transform = `translate3d(${-cx}px,${-cy}px,0)`;
    e.far.style.transform = `translate3d(${-cx * 0.22}px,${-cy * 0.12}px,0)`;
    e.mid.style.transform = `translate3d(${-cx * 0.5}px,${-cy * 0.3}px,0)`;
    e.fg.style.transform = `translate3d(${-cx * 1.35}px,${-cy}px,0)`;
    this.skyT -= dt;
    if (this.skyT <= 0) {
      this.skyT = 0.06;
      const [a, bb] = skyAt(cam.x + 720);
      e.stage.style.setProperty("--sky1", a);
      e.stage.style.setProperty("--sky2", bb);
      e.stage.style.setProperty("--depth", String(clamp(cam.y / 640, 0, 1)));
      const rn = rainAt(cam.x + 720) * (1 - clamp(cam.y / 300, 0, 1));
      e.stage.style.setProperty("--rain", rn.toFixed(2));
    }

    // ninja
    const nin = e.ninja;
    const swimming = p.mode === "swim";
    let nx = p.x - 60, ny = p.y - 184;
    if (p.mounted) { nx = p.x - 60 + p.face * 8; ny = p.y - (this.buddy === "elephant" ? 236 : 204); }
    nin.style.transform = `translate3d(${nx}px,${ny}px,0)`;
    nin.style.opacity = p.hidden ? "0" : "";
    let rot = "";
    if (swimming) rot = ` rotate(${90 + clamp(p.vy * 0.1, -30, 30)}deg)`;
    else if (p.mode === "fly") rot = " rotate(0deg)";
    else if (p.anim === "sprint") rot = " rotate(14deg)";
    else if (p.anim === "run") rot = " rotate(8deg)";
    e.ninjaFlip.style.transform = `scaleX(${p.face < 0 ? -1 : 1})${rot}`;
    if (nin.dataset.anim !== p.anim) { nin.dataset.anim = p.anim; nin.className = `av-ent av-ninja s-${p.anim}${p.mounted ? " mounted" : ""}`; }

    // tiger
    const tg = e.tiger;
    const ty = t.y - 150 + (t.swim ? 36 : 0);
    tg.style.transform = `translate3d(${t.x - 140}px,${ty}px,0)`;
    e.tigerFlip.style.transform = `scaleX(${t.face < 0 ? -1 : 1})`;
    const tcls = `av-ent av-tiger t-${t.anim}${t.roar > 0 ? " roaring" : ""}${p.mounted ? " ridden" : ""}`;
    if (tg.dataset.cls !== tcls) { tg.dataset.cls = tcls; tg.className = tcls; }

    // balloon
    e.balloon.style.transform = `translate3d(${b.x - 130}px,${b.y - 286}px,0)`;
    e.balloon.classList.toggle("up", b.flying || b.y < GROUND - 8);
  }
}
