import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import { testimonials } from "../constants";
import { Elephant, Ninja, Parrot, Plane, Tiger, Trophy } from "./characters";
import { CERTS, GREETINGS, LINKS, NAV, PAGES, PROJECTS, SKILLS, STAGES } from "./data";
import "./game.css";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const ex = (color, n, dx = 1, dy = 1) =>
  Array.from({ length: n - 1 }, (_, i) => `${dx * (i + 1)}px ${dy * (i + 1)}px 0 ${color}`).join(",");

const HURDLES = { home: [430, 930], amazon: [780, 1000], conestoga: [430, 900], work: [430, 900] };
const WALK_PAGES = ["home", "amazon", "conestoga", "work"];

const SKY_BOTTOM = {
  home: "#8cd0e8",
  amazon: "#e9f7c7",
  conestoga: "#f0f8ff",
  work: "#fff4c7",
  td: "#cfe8ef",
  today: "#e9f7c7",
  skills: "#143e82",
  projects: "#e9f7c7",
  testimonials: "#ffe6b3",
  contact: "#f7b7a0",
};

function useFit() {
  const [s, setS] = useState(1);
  useEffect(() => {
    const f = () => setS(Math.min(window.innerWidth / 1440, window.innerHeight / 810));
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return s;
}

/* ------------------------------------------------------------------ */
/* scenery                                                             */
/* ------------------------------------------------------------------ */

const Palm = ({ x, h, s = 1 }) => (
  <g>
    <path d={`M${x} 640 Q${x + 22 * s} ${640 - h / 2} ${x + 8 * s} ${640 - h}`} stroke='#6b4a2b' strokeWidth={16 * s} fill='none' />
    {[-70, -35, 0, 35, 70, 110, -110].map((r) => (
      <path
        key={r}
        d={`M${x + 8 * s} ${640 - h} q${90 * s} ${-30 * s} ${130 * s} ${40 * s}`}
        fill='none'
        stroke='#2f8f4e'
        strokeWidth={12 * s}
        strokeLinecap='round'
        transform={`rotate(${r} ${x + 8 * s} ${640 - h})`}
      />
    ))}
  </g>
);

const Blob = ({ x, w, h, c }) => (
  <g>
    <rect x={x + w / 2 - 22} y={520} width={44} height={130} fill='#a07a50' />
    <rect x={x} y={520 - h} width={w} height={h} rx={w / 2} ry={w / 2} fill={c} />
  </g>
);

const Building = ({ x, w, h }) => (
  <g>
    <rect x={x} y={640 - h} width={w} height={h} fill='#3b7f5a' />
    {Array.from({ length: Math.floor(h / 34) * 3 }, (_, i) => (
      <rect key={i} x={x + 12 + (i % 3) * Math.floor((w - 24) / 3)} y={640 - h + 16 + Math.floor(i / 3) * 34} width={14} height={18} fill='#c8f0d2' />
    ))}
  </g>
);

const THEMES = {
  home: { sky: ["#4fc3e8", "#8cd0e8"], far: "#2f9b5a", mid: "#25804a", deco: () => (<><Blob x={70} w={170} h={300} c='#9ac655' /><Blob x={280} w={150} h={210} c='#5cb85c' /><Blob x={1060} w={150} h={240} c='#5cb85c' /><Blob x={1250} w={170} h={300} c='#9ac655' /></>) },
  amazon: { sky: ["#7fd6c2", "#e9f7c7"], far: "#5db873", mid: "#3f9b55", deco: () => (<><Palm x={250} h={320} /><Palm x={560} h={260} s={0.9} /><Palm x={1130} h={340} s={1.1} /><Palm x={1330} h={250} s={0.8} /></>) },
  conestoga: { sky: ["#8fd0ea", "#f0f8ff"], far: "#7fb8d8", mid: "#5fa3c4", deco: () => (<><Blob x={120} w={150} h={200} c='#9ac655' /><Blob x={1230} w={160} h={230} c='#9ac655' /><Building x={1020} w={130} h={260} /><Building x={1160} w={90} h={190} /></>) },
  work: { sky: ["#a8dca0", "#fff4c7"], far: "#8cc96a", mid: "#5cb85c", deco: () => (<><Blob x={110} w={160} h={220} c='#5cb85c' /><Blob x={1120} w={170} h={260} c='#9ac655' /><Blob x={1320} w={130} h={190} c='#5cb85c' /></>) },
  projects: { sky: ["#7fd6c2", "#e9f7c7"], far: "#5db873", mid: "#3f9b55", deco: () => (<><Blob x={30} w={140} h={200} c='#5cb85c' /><Blob x={1290} w={130} h={200} c='#9ac655' /></>) },
  testimonials: { sky: ["#ffb86b", "#ffe6b3"], far: "#8cc96a", mid: "#5cb85c", deco: () => (<><Palm x={120} h={280} s={0.9} /><Palm x={1320} h={300} /></>) },
};

const Backdrop = ({ theme }) => {
  const t = THEMES[theme];
  return (
    <svg className='gm-bg' viewBox='0 0 1440 810' aria-hidden='true'>
      <defs>
        <linearGradient id={`sk-${theme}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor={t.sky[0]} />
          <stop offset='1' stopColor={t.sky[1]} />
        </linearGradient>
      </defs>
      <rect width='1440' height='810' fill={`url(#sk-${theme})`} />
      <ellipse cx='190' cy='120' rx='90' ry='34' fill='#fff' opacity='.9' />
      <ellipse cx='1150' cy='90' rx='110' ry='38' fill='#fff' opacity='.9' />
      <path d='M0 520 Q200 380 420 500 T860 480 T1300 500 T1440 470 V700 H0Z' fill={t.far} />
      <path d='M0 580 Q300 470 600 570 T1200 560 T1440 550 V720 H0Z' fill={t.mid} />
      {t.deco()}
      <rect y='640' width='1440' height='170' fill='#8a6340' />
      <rect y='640' width='1440' height='46' fill='#9ac655' />
      <rect y='686' width='1440' height='8' fill='#6b4a2b' opacity='.35' />
    </svg>
  );
};

/* ---------- tiny sound effects (muted until the visitor turns them on) ---------- */
const sound = { on: false, ctx: null };
function sfx(kind) {
  if (!sound.on) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!sound.ctx) sound.ctx = new AC();
    const c = sound.ctx;
    const tone = (type, f0, f1, dur, vol = 0.12, at = 0) => {
      const o = c.createOscillator();
      const g2 = c.createGain();
      o.type = type;
      const t = c.currentTime + at;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g2.gain.setValueAtTime(vol, t);
      g2.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g2).connect(c.destination);
      o.start(t);
      o.stop(t + dur);
    };
    if (kind === "tiger") tone("sawtooth", 180, 60, 0.7, 0.14);
    else if (kind === "ninja") tone("triangle", 900, 200, 0.35, 0.1);
    else if (kind === "elephant") { tone("sawtooth", 300, 500, 0.5, 0.08); tone("sawtooth", 500, 260, 0.4, 0.08, 0.35); }
    else if (kind === "coin") { tone("square", 880, 880, 0.08, 0.06); tone("square", 1320, 1320, 0.18, 0.06, 0.08); }
    else if (kind === "win") [523, 659, 784, 1047].forEach((f, i) => tone("triangle", f, f, 0.25, 0.1, i * 0.12));
  } catch (e) {
    /* audio unavailable */
  }
}

const DROPS = [[70, -60], [110, -30], [150, 0], [95, -90], [135, -55], [175, -20], [60, -20], [120, 10]];

const Burst = ({ kind }) => {
  if (kind === "ninja")
    return (
      <svg className='gm-shuriken' viewBox='-20 -20 40 40' width='44' height='44' aria-hidden='true'>
        <path d='M0 -18 L5 -5 L18 0 L5 5 L0 18 L-5 5 L-18 0 L-5 -5Z' fill='#cfd8dc' stroke='#37474f' strokeWidth='2' />
        <circle r='3' fill='#37474f' />
      </svg>
    );
  if (kind === "elephant")
    return DROPS.map((d, i) => <i key={i} className='gm-drop' style={{ "--dx": `${d[0]}px`, "--dy": `${d[1]}px`, animationDelay: `${i * 0.04}s` }} />);
  if (kind === "tiger") return <div className='gm-bubble' style={{ top: -14, left: "55%" }}>ROAR!</div>;
  return null;
};

/* what a character does when clicked: ninja throws a star, elephant sprays water, tiger roars */
function useAct(children, custom) {
  const [burst, setBurst] = useState(0);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const t = children && children.type;
  const kind = t === Ninja ? "ninja" : t === Elephant ? "elephant" : t === Tiger ? "tiger" : null;
  const act = custom || (kind
    ? () => {
        sfx(kind);
        setBurst((v) => v + 1);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setBurst(0), 1300);
      }
    : undefined);
  const child = kind === "tiger" && !custom ? cloneElement(children, { roar: burst > 0 }) : children;
  return { act, child, fx: burst > 0 && !custom ? <Burst key={burst} kind={kind} /> : null };
}

/* a walking character: wrapper animates in, then idles */
const Walker = ({ left, bottom = 170, width, children, flip, onClick, delay = 0, still }) => {
  const { act, child, fx } = useAct(children, onClick);
  const t = children && children.type;
  const pace = !still && (t === Tiger || t === Elephant);
  return (
    <div
      className={`gm-ch gm-walkin ${act ? "gm-click" : ""}`}
      style={{ left, bottom, width, animationDelay: `${delay}s`, transform: flip ? "scaleX(-1)" : undefined }}
      onClick={act}
    >
      {fx}
      {pace ? (
        <div className='gm-pace' style={{ "--pd": t === Tiger ? "90px" : "55px", animationDuration: t === Tiger ? "15s" : "22s", animationDelay: `${-delay * 9}s` }}>
          <div className='gm-idle'>{child}</div>
        </div>
      ) : (
        <div className='gm-idle'>{child}</div>
      )}
    </div>
  );
};

const HURDLE_W = 72;
const Hurdles = ({ xs }) => (
  <>
    {xs.map((x) => (
      <svg key={x} className='ab' style={{ left: x, bottom: 168, zIndex: 17 }} width={HURDLE_W} height='64' viewBox='0 0 72 64' aria-hidden='true'>
        <rect x='4' y='6' width='8' height='58' fill='#fff' stroke='#c9d3da' strokeWidth='2' />
        <rect x='60' y='6' width='8' height='58' fill='#fff' stroke='#c9d3da' strokeWidth='2' />
        <rect x='0' y='4' width='72' height='14' rx='3' fill='#d9382f' />
        <rect x='14' y='4' width='12' height='14' fill='#fff' /><rect x='40' y='4' width='12' height='14' fill='#fff' />
      </svg>
    ))}
  </>
);

/* the playable character: arrow keys walk it (the ninja runs), space jumps, and it hops hurdles on its own.
   Walking off an edge changes level. */
const Player = ({ start, width, bottom = 170, children, go, hurdles = [] }) => {
  const [x, setX] = useState(start);
  const [dir, setDir] = useState(1);
  const [moving, setMoving] = useState(false);
  const [jy, setJy] = useState(0);
  const { act, child, fx } = useAct(children);
  const isNinja = children && children.type === Ninja;
  const speed = isNinja ? 560 : 340;
  const st = useRef({ x: start, keys: {}, done: false, jt: -1 });
  useEffect(() => {
    const s = st.current;
    const jump = () => { if (s.jt < 0) { s.jt = 0; sfx("ninja"); } };
    const down = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        s.keys[e.key] = true;
      } else if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    const up = (e) => { delete s.keys[e.key]; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    let prev = performance.now();
    let raf = 0;
    const H = isNinja ? 130 : 110;
    const DUR = isNinja ? 0.62 : 0.8;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const v = (s.keys.ArrowRight ? 1 : 0) - (s.keys.ArrowLeft ? 1 : 0);
      if (v && s.jt < 0) {
        const front = s.x + width / 2 + v * width * 0.32;
        if (hurdles.some((hx) => { const d = (hx + HURDLE_W / 2 - front) * v; return d > 0 && d < 70; })) jump();
      }
      if (s.jt >= 0) {
        s.jt += dt / DUR;
        if (s.jt >= 1) { s.jt = -1; setJy(0); } else setJy(4 * H * s.jt * (1 - s.jt));
      }
      if (v && !s.done) {
        s.x += v * speed * dt;
        setX(s.x);
        setDir(v);
        if (s.x > 1440 - width * 0.6) { s.done = true; if (!go("next")) { s.x = 1440 - width * 0.6; s.done = false; } }
        else if (s.x < -width * 0.4) { s.done = true; if (!go("prev")) { s.x = -width * 0.4; s.done = false; } }
      }
      setMoving((m) => (m !== (!!v || s.jt >= 0) ? !!v || s.jt >= 0 : m));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [go, width, hurdles, isNinja]);
  return (
    <div
      className={`gm-ch gm-click gm-player ${moving ? "moving" : ""} ${isNinja ? "ninja" : ""} ${jy > 0 ? "air" : ""}`}
      style={{ left: x, bottom: bottom + jy, width, zIndex: 19 }}
      onClick={act}
    >
      {fx}
      <div className='gm-flip' style={{ transform: `scaleX(${dir < 0 ? -1 : 1})` }}>
        <div className='gm-idle'>{child}</div>
      </div>
    </div>
  );
};

/* the ninja really swims: he glides toward the cursor (or wanders), paddling, tilted into the swim */
const Swimmer = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const stage = el && el.closest(".gm-stage");
    let tx = 1100, ty = 520, mouseAt = 0;
    let x = 1100, y = 520, a = 0, face = 1, t = 0;
    const move = (e) => {
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      const sc = r.width / 1440;
      tx = Math.max(60, Math.min(1380, (e.clientX - r.left) / sc));
      ty = Math.max(150, Math.min(600, (e.clientY - r.top) / sc));
      mouseAt = performance.now();
    };
    window.addEventListener("mousemove", move);
    let prev = performance.now();
    let raf = 0;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      t += dt;
      if (now - mouseAt > 4000) { tx = 720 + Math.sin(t * 0.35) * 560; ty = 400 + Math.sin(t * 0.8) * 150; }
      const dx = tx - x, dy = ty - y;
      x += dx * Math.min(1, dt * 1.6);
      y += dy * Math.min(1, dt * 1.6);
      if (Math.abs(dx) > 25) face = dx > 0 ? 1 : -1;
      const ta = face * (90 + Math.max(-35, Math.min(35, dy * 0.18)));
      a += (ta - a) * Math.min(1, dt * 5);
      if (el) el.style.transform = `translate(${x - 60}px, ${y - 92 + Math.sin(t * 6) * 4}px) rotate(${a}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", move); };
  }, []);
  return (
    <div ref={ref} className='gm-swimmer' aria-hidden='true'>
      <Ninja />
      <i className='gm-sb' style={{ left: 8, top: -6 }} /><i className='gm-sb' style={{ left: 40, top: -26, animationDelay: '-.7s' }} /><i className='gm-sb' style={{ left: 70, top: -10, animationDelay: '-1.3s' }} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* top bar, progress, hint                                             */
/* ------------------------------------------------------------------ */

const TopBar = ({ page, go, onFormal }) => {
  const active = page === 0 ? 0 : page <= 5 ? 1 : page;
  const activeLabel = NAV.find((n) => (n.page === 1 ? active === 1 : n.page === page))?.label;
  return (
    <div className='gm-top'>
      <button className='gm-name' onClick={() => go(0)}>Ezhil Nilavan Kalaimani | Analyst</button>
      <div className='gm-nav'>
        {NAV.map((n) => (
          <button key={n.label} className={n.label === activeLabel ? "on" : ""} onClick={() => go(n.page)}>{n.label}</button>
        ))}
        <button className='formal' onClick={onFormal}>☰ Formal version</button>
      </div>
    </div>
  );
};

const Progress = ({ page, go }) => (
  <div className='gm-prog'>
    {PAGES.slice(1, 6).map((p, i) => (
      <button key={p.id} className={`gm-stop ${page === i + 1 ? "on" : page > i + 1 ? "done" : ""}`} onClick={() => go(i + 1)}>
        <span>{i + 1}</span>
        <em>{p.label}</em>
      </button>
    ))}
  </div>
);

const Hint = ({ children }) => <div className='gm-hint'>{children}</div>;

/* ------------------------------------------------------------------ */
/* pages                                                               */
/* ------------------------------------------------------------------ */

const Opening = ({ go, walk }) => {
  const [g, setG] = useState(0);
  const [roar, setRoar] = useState(false);
  const colors = ["#d9382f", "#14653a", "#c47f10", "#1f4d8a", "#7a2a8a", "#b0306a"];
  const roarNow = () => {
    setRoar(true);
    setTimeout(() => setRoar(false), 1400);
  };
  return (
    <>
      <Backdrop theme='home' />
      <div className='gm-flyer' onAnimationIteration={() => setG((v) => (v + 1) % GREETINGS.length)}>
        <div className='gm-banner' style={{ "--c": colors[g % colors.length] }}>{GREETINGS[g]}</div>
        <div className='gm-rope' />
        <Plane className='gm-plane' />
      </div>
      <div className='gm-block gm-title1' style={{ textShadow: ex("#d97a1f", 28) }}>EZHIL NILAVAN</div>
      <div className='gm-block gm-title2' style={{ textShadow: ex("#14653a", 24) }}>KALAIMANI</div>
      <Parrot className='ab' style={{ left: 228, top: 300, width: 80, zIndex: 14 }} />
      <Walker left={290} width={280} delay={0} onClick={roarNow}>
        {roar && <div className='gm-bubble' style={{ top: -10, left: 160 }}>ROAR!</div>}
        <Tiger roar={roar} />
      </Walker>
      <Walker left={1030} width={240} delay={0.4} still><Elephant /></Walker>
      <Player start={660} width={120} go={walk} hurdles={HURDLES.home}><Ninja /></Player>
      <Hurdles xs={HURDLES.home} />
      <div className='gm-where'><span>HOME · INDIA</span><b>✈</b><span className='now'>NOW · TORONTO, CANADA</span></div>
      <div className='gm-role'>ANALYST · TORONTO-DOMINION BANK</div>
      <button className='gm-start' onClick={() => go(1)}>▶ EXPLORE MY WORK</button>
    </>
  );
};

const StageCard = ({ s, style }) => (
  <div className='gm-card' style={style}>
    <div className='gm-tag'>LEVEL {s.n}</div>
    <h2>{s.title}</h2>
    <div className='gm-sub'>{s.sub}</div>
    <ul>{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
  </div>
);

const Sign = ({ sign, left = 150, top = 430 }) => (
  <div className='gm-sign' style={{ left, top }}>
    <div className='b'>{sign[0]}<small>{sign[1]}</small></div>
    <div className='p' />
  </div>
);

const Packages = () => {
  const [m, setM] = useState({});
  const n = Object.values(m).filter(Boolean).length;
  return (
    <>
      {[330, 420, 510, 600, 690].map((x, i) => (
        <button
          type='button'
          key={x}
          className={`gm-pkg ${m[i] ? "on" : ""}`}
          style={{ left: x, top: 566 }}
          onClick={() => { if (!m[i]) { sfx("coin"); setM((v) => ({ ...v, [i]: true })); } }}
          aria-label='Map package'
        >
          {m[i] ? "✔" : "📦"}
        </button>
      ))}
      <div className='gm-pill' style={{ left: 330, top: 520 }}>{n >= 5 ? "All packages mapped ✔" : `Click packages to map them · ${n} / 5`}</div>
    </>
  );
};

const GroundStage = ({ id, theme, page, go, chars }) => {
  const s = STAGES[id];
  return (
    <>
      <Backdrop theme={theme} />
      <Sign sign={s.sign} />
      <StageCard s={s} style={{ right: 70, top: 180, width: 430 }} />
      {id === "amazon" && <Packages />}
      <Hurdles xs={HURDLES[id]} />
      {chars}
    </>
  );
};

const TDLevel = ({ page, go }) => {
  const s = STAGES.td;
  const [done, setDone] = useState({});
  const count = Object.values(done).filter(Boolean).length;
  const [total, setTotal] = useState(0);
  return (
    <>
      <svg className='gm-bg' viewBox='0 0 1440 810' aria-hidden='true'>
        <rect width='1440' height='810' fill='#cfe8ef' />
        <rect width='1440' height='130' fill='#14532d' />
        <rect y='560' width='1440' height='250' fill='#5b6b75' />
        <rect y='560' width='1440' height='22' fill='#f7b32b' />
        {Array.from({ length: 36 }, (_, i) => <path key={i} d={`M${i * 40} 560 l20 22 h-20 l-20 -22Z`} fill='#222' />)}
        <rect x='100' y='500' width='1000' height='40' rx='20' fill='#2c3a42' />
        {Array.from({ length: 17 }, (_, i) => <circle key={i} cx={130 + i * 60} cy='520' r='11' fill='#8fa3b5' />)}
        <rect x='520' y='140' width='40' height='190' fill='#8fa3b5' />
        <rect x='480' y='320' width='120' height='30' rx='8' fill='#c6d3dc' />
      </svg>
      <div className='gm-arm'>
        <svg width='120' height='170' viewBox='0 0 120 170' aria-hidden='true'>
          <rect x='50' y='0' width='20' height='110' fill='#7a8e9c' />
          <rect x='20' y='110' width='80' height='26' rx='6' fill='#2f8a57' />
          <text x='60' y='128' fontSize='14' fontWeight='800' fill='#fff' textAnchor='middle' fontFamily='DejaVu Sans, sans-serif'>ACCEPT</text>
        </svg>
      </div>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className={`gm-cheque ${done[i] ? "done" : ""}`}
          style={{ animationDelay: `${-i * 2.4}s` }}
          onClick={() => {
            if (done[i]) return;
            sfx("coin");
            setDone((d) => ({ ...d, [i]: true }));
            setTotal((t) => t + 1);
          }}
          onAnimationIteration={(e) => {
            if (e.target === e.currentTarget) setDone((d) => ({ ...d, [i]: false }));
          }}
        >
          CHEQUE
          <span className='m'>$ ……</span>
          <span className='a'>✔ ACCEPTED</span>
        </div>
      ))}
      <div className='ab' style={{ left: 50, top: 100, zIndex: 20 }}>
        <div style={{ background: "#d9382f", color: "#fff", fontWeight: 900, fontSize: 26, padding: "10px 26px", borderRadius: 10, border: "4px solid #8f1d17" }}>LEVEL 4</div>
        <div style={{ background: "#14532d", color: "#fff", fontWeight: 800, fontSize: 15, padding: "6px 12px", marginTop: 6, borderRadius: 8, textAlign: "center" }}>{s.sign[0]}</div>
      </div>
      <div className='gm-card gm-meter' style={{ borderBottomColor: "#2f8a57" }}>
        <div className='gm-tag'>SYMCOR CHEQUE PROCESSING</div>
        <div className='big'>99%</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>AUTOMATED</div>
        <div className='bar'><i /></div>
        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: "#14532d" }}>
          {total > 0 ? `✔ You processed ${total} cheque${total > 1 ? "s" : ""}` : "Click a cheque to process it"}
        </div>
      </div>
      <StageCard s={s} style={{ left: 50, top: 215, width: 420, zIndex: 21 }} />
      <Walker left={1130} bottom={40} width={230}><Elephant /></Walker>
      <Walker left={880} bottom={50} width={120} delay={0.3}><Ninja /></Walker>
    </>
  );
};

const Balloon = ({ go, page }) => (
  <>
    <svg className='gm-bg' viewBox='0 0 1440 810' aria-hidden='true'>
      <defs>
        <linearGradient id='sk-today' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#4fc3e8' />
          <stop offset='1' stopColor='#e9f7c7' />
        </linearGradient>
      </defs>
      <rect width='1440' height='810' fill='url(#sk-today)' />
    </svg>
    {[[220, 220, 110], [1180, 160, 130], [1260, 520, 100], [160, 560, 90]].map(([x, y, w]) => (
      <div key={x} className='ab gm-cloudy' style={{ left: x - w - 300, top: y, width: w * 2, height: w * 0.7, borderRadius: "50%", background: "#fff", animationDuration: `${40 + (x % 30)}s` }} />
    ))}
    <div className='ab gm-balloon' style={{ left: 520, top: 150, zIndex: 10 }}>
      <svg width='400' height='500' viewBox='0 0 500 620' aria-hidden='true'>
        <path d='M250 20 C60 20 40 250 150 350 L350 350 C460 250 440 20 250 20Z' fill='#f7b32b' />
        <path d='M250 20 C170 20 150 250 190 350 L310 350 C350 250 330 20 250 20Z' fill='#d9382f' />
        <path d='M250 20 C220 20 215 250 235 350 L265 350 C285 250 280 20 250 20Z' fill='#14653a' />
        <rect x='110' y='190' width='280' height='40' fill='#fff' opacity='.9' />
        <path d='M150 350 L205 470 M350 350 L295 470 M250 350 V470' stroke='#8a5a2b' strokeWidth='5' />
        <rect x='190' y='470' width='120' height='80' rx='8' fill='#c98a2b' stroke='#6b4a2b' strokeWidth='5' />
      </svg>
      <div className='ab' style={{ left: 160, top: 363, width: 78 }}><Tiger /></div>
    </div>
    <div className='gm-card' style={{ left: 70, top: 200, width: 400 }}>
      <div className='gm-tag'>STAGE 5 OF 5 · TODAY</div>
      <h2>Q2 2026 Star Award</h2>
      <div className='gm-sub'>Analyst · Toronto-Dominion Bank</div>
      <ul>
        <li>Recognized for taking Symcor cheque processing to 99% automation</li>
        <li>100% accuracy on RSP / TFSA transactions</li>
        <li>Python · SQL · Power BI · Tableau · Excel</li>
      </ul>
    </div>
    <div className='ab' style={{ left: 1090, top: 250, zIndex: 12, width: 150 }}><Trophy /></div>
    <div className='ab' style={{ left: 1050, top: 160, zIndex: 12, background: "#8a5a2b", border: "4px solid #5a3b1e", color: "#fff3d6", fontWeight: 800, padding: "8px 18px", borderRadius: 10 }}>Q2 2026 · STAR AWARD</div>
    <div className='ab' style={{ left: 0, right: 0, bottom: 0, height: 120, background: "#9ac655", borderTop: "10px solid #4aa05a", zIndex: 5 }} />
    <Walker left={140} bottom={90} width={120}><Ninja /></Walker>
    <Walker left={290} bottom={90} width={250}><Tiger /></Walker>
  </>
);

const Skills = () => {
  const [caught, setCaught] = useState({});
  const cols = ["#f7b32b", "#ff7a59", "#7ed6a0", "#c78bff", "#ffd166", "#5ad1d9"];
  return (
    <>
      <svg className='gm-bg' viewBox='0 0 1440 810' aria-hidden='true'>
        <defs>
          <linearGradient id='sea' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#6fdcf0' />
            <stop offset='.35' stopColor='#2a9fd6' />
            <stop offset='.75' stopColor='#17559a' />
            <stop offset='1' stopColor='#0e2f6b' />
          </linearGradient>
          <linearGradient id='ray' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#fff' stopOpacity='.55' />
            <stop offset='1' stopColor='#fff' stopOpacity='0' />
          </linearGradient>
        </defs>
        <rect width='1440' height='810' fill='url(#sea)' />
        {[[120, 90], [420, 130], [760, 100], [1080, 140], [1330, 90]].map(([x, w], i) => (
          <polygon key={x} className='gm-ray' style={{ animationDelay: `${-i * 1.7}s` }} points={`${x},0 ${x + w},0 ${x + w * 2.2},660 ${x - w * 0.6},660`} fill='url(#ray)' />
        ))}
        <path d='M0 560 Q120 470 260 540 T520 520 T800 545 T1100 505 T1440 540 V680 H0Z' fill='#1b4f93' opacity='.75' />
        <path d='M0 610 Q200 540 400 600 T820 590 T1240 585 T1440 600 V690 H0Z' fill='#16407d' opacity='.9' />
        <path d='M0 70 q60 -26 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 V0 H0Z' fill='#d8f7ff' opacity='.85' />
        <path className='gm-wave' d='M0 88 q60 -22 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 V0 H0Z' fill='#9be9fa' opacity='.55' />
        <path d='M0 668 Q180 650 360 668 T720 664 T1080 670 T1440 662 V810 H0Z' fill='#e2c48a' />
        <path d='M0 668 Q180 650 360 668 T720 664 T1080 670 T1440 662' stroke='#c9a566' strokeWidth='6' fill='none' />
        {[[90, 150], [240, 110], [1010, 170], [1290, 130]].map(([x, h]) => (
          <g key={x} className='gm-sway' style={{ animationDelay: `${-(x % 7) * 0.4}s` }}>
            <path d={`M${x} 670 C${x - 26} ${670 - h * 0.35} ${x + 26} ${670 - h * 0.65} ${x} ${670 - h}`} stroke='#2fae6a' strokeWidth='13' strokeLinecap='round' fill='none' />
            <path d={`M${x + 22} 670 C${x} ${670 - h * 0.3} ${x + 40} ${670 - h * 0.55} ${x + 20} ${670 - h * 0.8}`} stroke='#1f8a52' strokeWidth='10' strokeLinecap='round' fill='none' />
          </g>
        ))}
        <g fill='#ff7a59'>
          <circle cx='330' cy='660' r='20' /><circle cx='358' cy='650' r='24' /><circle cx='388' cy='662' r='18' />
        </g>
        <g fill='#c78bff'>
          <circle cx='860' cy='662' r='20' /><circle cx='890' cy='650' r='26' /><circle cx='922' cy='662' r='18' />
        </g>
        <path d='M1150 668 q-8 -70 14 -92 q10 36 22 6 q16 36 -2 86Z' fill='#f7b32b' />
        <path d='M560 668 q-6 -60 10 -80 q8 30 18 4 q14 30 -2 76Z' fill='#ff9f7a' />
        <g className='gm-jelly' style={{ transformOrigin: '1200px 300px' }}>
          <path d='M1170 300 q30 -50 60 0Z' fill='#f6b6ff' opacity='.85' />
          {[1180, 1195, 1210, 1222].map((x) => <path key={x} d={`M${x} 300 q-6 24 2 44`} stroke='#f6b6ff' strokeWidth='3' fill='none' opacity='.8' />)}
        </g>
        <g className='gm-jelly' style={{ transformOrigin: '110px 420px', animationDelay: '-2s' }}>
          <path d='M85 420 q25 -44 50 0Z' fill='#ffd1a6' opacity='.85' />
          {[92, 104, 116, 126].map((x) => <path key={x} d={`M${x} 420 q-5 20 2 38`} stroke='#ffd1a6' strokeWidth='3' fill='none' opacity='.8' />)}
        </g>
        <path d='M20 740 q40 -26 60 0 q-30 12 -60 0Z' fill='#fff2d6' />
        <path d='M1380 730 q-34 -22 -52 0 q26 10 52 0Z' fill='#ffd9e2' />
      </svg>
      <div className='gm-bgfish' style={{ top: 190, animationDuration: '36s' }}>🐟</div>
      <div className='gm-bgfish' style={{ top: 430, animationDuration: '48s', animationDelay: '-18s', fontSize: 22 }}>🐠</div>
      <div className='gm-bgfish' style={{ top: 330, animationDuration: '60s', animationDelay: '-40s', fontSize: 20 }}>🐟</div>
      {[40, 190, 310, 560, 760, 980, 1190, 1330].map((x, i) => (
        <div key={x} className='gm-bubble-dot' style={{ left: x, top: 560 + (i % 3) * 40, width: 10 + (i % 4) * 6, height: 10 + (i % 4) * 6, animationDelay: `${-i * 1.1}s` }} />
      ))}
      <div className='gm-sec'>
        <h1 style={{ textShadow: ex("#d97a1f", 11) }}>SKILLS</h1>
        <p>{Object.values(caught).filter(Boolean).length >= SKILLS.length ? "🏆 ALL SKILLS UNLOCKED!" : `Click a fish to catch it · ${Object.values(caught).filter(Boolean).length} / ${SKILLS.length}`}</p>
      </div>
      {SKILLS.map((s, i) => {
        const x = 70 + (i % 4) * 340;
        const y = 215 + Math.floor(i / 4) * 140;
        const c = cols[i % cols.length];
        return (
          <div
            key={s}
            className={`gm-fish ${caught[s] ? "caught" : ""}`}
            style={{ left: x, top: y, animationDelay: `${-i * 0.9}s`, animationDuration: `${6 + (i % 3)}s` }}
            onClick={() => {
              sfx(Object.values(caught).filter(Boolean).length + 1 >= SKILLS.length && !caught[s] ? "win" : "coin");
              setCaught((c0) => ({ ...c0, [s]: false }));
              requestAnimationFrame(() => setCaught((c0) => ({ ...c0, [s]: true })));
            }}
          >
            <svg width='220' height='96' viewBox='0 0 220 96' aria-hidden='true'>
              <path d='M184 48 L218 14 Q208 48 218 82Z' fill={c} />
              <path d='M80 14 Q110 -4 140 16 Z' fill={c} opacity='.8' />
              <path d='M92 78 Q112 96 132 80Z' fill={c} opacity='.8' />
              <ellipse cx='98' cy='48' rx='92' ry='38' fill={c} />
              <ellipse cx='98' cy='64' rx='80' ry='20' fill='#fff' opacity='.28' />
              <path d='M150 14 Q166 48 150 82' stroke='#12324a' strokeWidth='4' fill='none' opacity='.25' />
              <path d='M164 20 Q178 48 164 76' stroke='#12324a' strokeWidth='4' fill='none' opacity='.2' />
              <circle cx='38' cy='40' r='9' fill='#fff' />
              <circle cx='35' cy='40' r='4.5' fill='#1a1209' />
              <path d='M12 54 q10 6 18 0' stroke='#12324a' strokeWidth='3' fill='none' strokeLinecap='round' />
              <text x='100' y='56' fontSize={s.length > 8 ? 16 : 19} fontWeight='800' fill='#12324a' textAnchor='middle' fontFamily='DejaVu Sans, sans-serif'>{s}</text>
            </svg>
          </div>
        );
      })}
      <div className='gm-certs'>
        {CERTS.map((t, i) => <div key={t} className={i === 0 ? 'hot' : ''}>🏅 {t}</div>)}
      </div>
      <Swimmer />
    </>
  );
};

const Projects = () => (
  <>
    <Backdrop theme='projects' />
    <div className='gm-sec'>
      <h1 style={{ textShadow: ex("#d97a1f", 11) }}>PROJECTS</h1>
      <p>Things I have built and analyzed</p>
    </div>
    {PROJECTS.map((p, i) => (
      <div key={p.name} className='gm-pc' style={{ left: 70 + (i % 4) * 330, top: 260 + Math.floor(i / 4) * 200 }}>
        <h3>{p.name}</h3>
        <p>{p.text}</p>
        <div className='gm-tg'>{p.tags.map((t) => <i key={t}>{t}</i>)}</div>
      </div>
    ))}
    <Walker left={700} width={250}><Elephant /></Walker>
    <Walker left={1060} width={120} delay={0.3}><Ninja /></Walker>
  </>
);

const Testimonials = () => {
  const [i, setI] = useState(0);
  const n = testimonials.length;
  const t = testimonials[i];
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % n), 9000);
    return () => clearInterval(id);
  }, [n]);
  return (
    <>
      <Backdrop theme='testimonials' />
      <div className='gm-sec'>
        <h1 style={{ textShadow: ex("#d97a1f", 11) }}>TESTIMONIALS</h1>
        <p>What others say</p>
      </div>
      <button className='gm-qbtn' style={{ left: 190 }} onClick={() => setI((v) => (v - 1 + n) % n)} aria-label='Previous'>‹</button>
      <button className='gm-qbtn' style={{ right: 190 }} onClick={() => setI((v) => (v + 1) % n)} aria-label='Next'>›</button>
      <div className='gm-quote' key={i}>
        <div className='q'>“</div>
        <p className='t'>{t.testimonial.trim()}</p>
        <div className='who'>
          {t.name} · {t.subtitle || `${t.designation}, ${t.company}`}
        </div>
      </div>
      <div className='gm-dots'>
        {testimonials.map((x, k) => <button key={x.name} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} />)}
      </div>
      <Walker left={560} bottom={130} width={260}><Tiger /></Walker>
    </>
  );
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setStatus("Sending…");
    emailjs
      .send(
        "service_3yf8wil",
        "template_p3qaifo",
        {
          from_name: form.name,
          to_name: "Ezhil Nilavan Kalaimani",
          from_email: form.email,
          to_email: "iamezhilnilavan@gmail.com",
          message: form.message + " email is " + form.email,
        },
        "pmZPRYuPINkDLOE3c"
      )
      .then(
        () => {
          setStatus("Thank you! I will get back to you as soon as possible.");
          setForm({ name: "", email: "", message: "" });
        },
        (err) => {
          console.error(err);
          setStatus("Something went wrong. Please try again.");
        }
      );
  };
  return (
    <>
      <svg className='gm-bg' viewBox='0 0 1440 810' aria-hidden='true'>
        <defs>
          <linearGradient id='sk-contact' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0' stopColor='#54bdeb' />
            <stop offset='1' stopColor='#54bdeb' />
          </linearGradient>
        </defs>
        <rect width='1440' height='810' fill='url(#sk-contact)' />
        <ellipse cx='170' cy='140' rx='90' ry='30' fill='#fff' opacity='.8' />
        <ellipse cx='700' cy='70' rx='70' ry='22' fill='#fff' opacity='.8' />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={i * 110} cy='760' r='75' fill='#fff' />)}
        <rect y='760' width='1440' height='60' fill='#fff' />
        <polygon points='330,310 330,610 220,720 220,420' fill='#c98a2b' />
        <polygon points='330,610 850,610 740,720 220,720' fill='#a66b16' />
        <rect x='330' y='310' width='520' height='300' fill='#f7b32b' />
        <polygon points='820,454 820,584 690,584' fill='#e8a02a' />
        <g fontFamily='DejaVu Sans, sans-serif' fontWeight='800' fontSize='17' fill='#8a5a1b' textAnchor='end' letterSpacing='2'>
          <text x='482' y='366'>YOUR NAME</text>
          <text x='482' y='424'>YOUR EMAIL</text>
          <text x='482' y='482'>MESSAGE</text>
        </g>
      </svg>
      <div className='gm-block ab' style={{ left: 230, top: 120, fontSize: 118, color: "#9be3b4", zIndex: 6, textShadow: ex("#1f8a50", 17, -1, 1) }}>CONTACT</div>
      <div className='ab' style={{ left: 240, top: 255, color: "#0c3b24", fontWeight: 800, fontSize: 18, zIndex: 6 }}>Say hello · வணக்கம்</div>
      <form onSubmit={submit}>
        <input className='gm-inp' name='name' value={form.name} onChange={onChange} placeholder='Your name' required style={{ left: 500, top: 338, width: 320, height: 42 }} />
        <input className='gm-inp' name='email' type='email' value={form.email} onChange={onChange} placeholder='you@example.com' required style={{ left: 500, top: 396, width: 320, height: 42 }} />
        <textarea className='gm-inp' name='message' value={form.message} onChange={onChange} placeholder='Write your message' required style={{ left: 500, top: 454, width: 320, height: 130 }} />
        <button className='gm-send' type='submit' aria-label='Send message' />
        <svg className='ab' style={{ left: 560, top: 640, zIndex: 13, pointerEvents: "none" }} width='400' height='100' viewBox='560 640 400 100' aria-hidden='true'>
          <polygon points='640,642 900,642 900,702 640,702' fill='#d9382f' />
          <polygon points='640,702 900,702 880,722 620,722' fill='#8f1d17' />
          <polygon points='640,642 640,702 620,722 620,664' fill='#b52a22' />
          <text x='770' y='680' fontFamily='DejaVu Sans, sans-serif' fontWeight='900' fontSize='22' fill='#fff' textAnchor='middle' letterSpacing='2'>SEND MESSAGE ▶</text>
        </svg>
      </form>
      {status && <div className='gm-status'>{status}</div>}
      <svg className='ab' style={{ left: 800, top: 70, zIndex: 8 }} width='440' height='560' viewBox='0 0 500 610' aria-hidden='true'>
        <path d='M250 20 C60 20 40 250 150 350 L350 350 C460 250 440 20 250 20Z' fill='#f7b32b' />
        <path d='M250 20 C170 20 150 250 190 350 L310 350 C350 250 330 20 250 20Z' fill='#d9382f' />
        <path d='M250 20 C220 20 215 250 235 350 L265 350 C285 250 280 20 250 20Z' fill='#14653a' />
        <rect x='104' y='185' width='292' height='44' fill='#fff' />
        <path d='M150 350 L205 470 M350 350 L295 470 M250 350 V470' stroke='#8a5a2b' strokeWidth='5' />
        <rect x='190' y='470' width='120' height='80' rx='6' fill='#c98a2b' />
        <rect x='190' y='470' width='120' height='14' fill='#8a5a1b' />
      </svg>
      <div className='ab' style={{ left: 968, top: 458, width: 100, zIndex: 9 }}><Tiger /></div>
      <div className='gm-ribbon'>
        <a href={LINKS.linkedin} target='_blank' rel='noreferrer' aria-label='LinkedIn'>in</a>
        <a href={LINKS.github} target='_blank' rel='noreferrer' aria-label='GitHub'>GH</a>
        <a href={LINKS.email} aria-label='Email'>@</a>
      </div>
      <Walker left={1090} bottom={80} width={120}><Ninja /></Walker>
      <Walker left={1200} bottom={80} width={210} delay={0.3}><Elephant /></Walker>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

export default function GameSite({ onFormal }) {
  const [page, setPage] = useState(0);
  const [back, setBack] = useState(false);
  const pageRef = useRef(0);
  const scale = useFit();

  const go = useCallback((i) => {
    const n = Math.max(0, Math.min(PAGES.length - 1, i));
    if (n === pageRef.current) return;
    setBack(n < pageRef.current);
    pageRef.current = n;
    setPage(n);
  }, []);

  const walk = useCallback((d) => {
    const before = pageRef.current;
    go(before + (d === "next" ? 1 : -1));
    return pageRef.current !== before;
  }, [go]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const walkPage = WALK_PAGES.includes(PAGES[pageRef.current].id);
      if (e.key === "PageDown" || (!walkPage && e.key === "ArrowRight")) go(pageRef.current + 1);
      else if (e.key === "PageUp" || (!walkPage && e.key === "ArrowLeft")) go(pageRef.current - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(PAGES.length - 1);
    };
    let lock = false;
    const onWheel = (e) => {
      if (lock || Math.abs(e.deltaY) + Math.abs(e.deltaX) < 30) return;
      lock = true;
      setTimeout(() => (lock = false), 700);
      go(pageRef.current + (e.deltaY + e.deltaX > 0 ? 1 : -1));
    };
    let sx = 0;
    const ts = (e) => (sx = e.touches[0].clientX);
    const te = (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 60) go(pageRef.current + (dx < 0 ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", ts, { passive: true });
    window.addEventListener("touchend", te, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", ts);
      window.removeEventListener("touchend", te);
    };
  }, [go]);

  const id = PAGES[page].id;
  const start = back ? 1440 - 330 : 40;
  const [sndOn, setSndOn] = useState(false);
  const stageRef = useRef(null);
  const onMove = (e) => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
    el.style.setProperty("--my", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
  };
  let scene = null;
  if (id === "home") scene = <Opening go={go} walk={walk} />;
  else if (id === "amazon") scene = <GroundStage id='amazon' theme='amazon' page={page} go={go} chars={<Player start={start} width={250} go={walk} hurdles={HURDLES.amazon}><Elephant /></Player>} />;
  else if (id === "conestoga") scene = <GroundStage id='conestoga' theme='conestoga' page={page} go={go} chars={<Player start={start} width={120} go={walk} hurdles={HURDLES.conestoga}><Ninja /></Player>} />;
  else if (id === "work") scene = <GroundStage id='work' theme='work' page={page} go={go} chars={<Player start={start} width={280} go={walk} hurdles={HURDLES.work}><Tiger /></Player>} />;
  else if (id === "td") scene = <TDLevel page={page} go={go} />;
  else if (id === "today") scene = <Balloon page={page} go={go} />;
  else if (id === "skills") scene = <Skills />;
  else if (id === "projects") scene = <Projects />;
  else if (id === "testimonials") scene = <Testimonials />;
  else scene = <Contact />;

  return (
    <div className='gm-root' style={{ background: SKY_BOTTOM[id] }} onMouseMove={onMove}>
      <div className='gm-stage' ref={stageRef} style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className={`gm-scene ${back ? "back" : ""}`} key={page}>{scene}</div>
        <TopBar page={page} go={go} onFormal={onFormal} />
        {page > 0 && <button className='gm-arrow l' onClick={() => go(page - 1)} aria-label='Previous'>←</button>}
        {page < PAGES.length - 1 && <button className='gm-arrow r' onClick={() => go(page + 1)} aria-label='Next'>→</button>}
        <button
          type='button'
          className='gm-snd'
          onClick={() => { sound.on = !sound.on; setSndOn(sound.on); sfx("coin"); }}
          aria-label='Toggle sound'
        >
          {sndOn ? "🔊 Sound on" : "🔇 Sound off"}
        </button>
        <Hint>
          {WALK_PAGES.includes(id)
            ? <><b>←</b><b>→</b> run · <b>Space</b> jump · click characters · {page + 1} / {PAGES.length}</>
            : <><b>←</b><b>→</b> or scroll to move · {page + 1} / {PAGES.length}</>}
        </Hint>
      </div>
    </div>
  );
}
