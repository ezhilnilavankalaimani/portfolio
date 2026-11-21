// Visual world for the adventure: parallax layers, level scenery, collectibles and characters.
// Everything here is static markup (rendered once); the engine moves it with transforms.
import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import emailjs from "@emailjs/browser";
import { testimonials } from "../constants";
import { Deer, Elephant, Hedgehog, Ninja, Parrot, Peacock, Plane, Rabbit, Tiger, Trophy } from "../game/characters";
import { CERTS, DETAILS, GREETINGS, LINKS, PROJECTS, SKILLS, STAGES } from "../game/data";
import { CASTLE_X, FLAG, GROUND, HURDLES, HURDLE_W, HURDLE_H, ITEMS, LADDER, LEVELS, POOL, ROOF, WORLD_W } from "./engine";

export const RESUME_URL = "/Ezhil_Nilavan_Kalaimani_Resume.pdf";

const ex = (color, n, dx = 1, dy = 1) =>
  Array.from({ length: n - 1 }, (_, i) => `${dx * (i + 1)}px ${dy * (i + 1)}px 0 ${color}`).join(",");

/* ---------------------------------------------------------------- */
/* parallax scenery                                                  */
/* ---------------------------------------------------------------- */

const Palm = ({ x, h, s = 1 }) => (
  <g className='av-sway' style={{ animationDelay: `${-(x % 9) * 0.3}s`, animationDuration: `${4.2 + (x % 5) * 0.6}s` }}>
    <path d={`M${x} 640 Q${x + 22 * s} ${640 - h / 2} ${x + 8 * s} ${640 - h}`} stroke='#6b4a2b' strokeWidth={16 * s} fill='none' />
    {[-70, -35, 0, 35, 70, 110, -110].map((r) => (
      <path key={r} d={`M${x + 8 * s} ${640 - h} q${90 * s} ${-30 * s} ${130 * s} ${40 * s}`} fill='none' stroke='#2f8f4e' strokeWidth={12 * s} strokeLinecap='round' transform={`rotate(${r} ${x + 8 * s} ${640 - h})`} />
    ))}
  </g>
);
const Blob = ({ x, w, h, c }) => (
  <g className='av-sway av-sway-b' style={{ animationDelay: `${-(x % 7) * 0.4}s`, animationDuration: `${4.8 + (x % 4) * 0.7}s` }}>
    <rect x={x + w / 2 - 20} y={520} width={40} height={130} fill='#a07a50' />
    <rect x={x} y={520 - h} width={w} height={h} rx={w / 2} ry={w / 2} fill={c} />
  </g>
);
const Building = ({ x, w, h, c = "#3b7f5a" }) => (
  <g>
    <rect x={x} y={640 - h} width={w} height={h} fill={c} />
    {Array.from({ length: Math.floor(h / 34) * 3 }, (_, i) => (
      <rect key={i} className='av-blink' style={{ animationDelay: `${-((i * 7) % 11) * 0.5}s` }} x={x + 12 + (i % 3) * Math.floor((w - 24) / 3)} y={640 - h + 16 + Math.floor(i / 3) * 34} width={14} height={18} fill='#c8f0d2' />
    ))}
  </g>
);

const DECOR = {
  0: () => (<><Blob x={70} w={170} h={300} c='#9ac655' /><Blob x={280} w={150} h={210} c='#5cb85c' /><Blob x={1060} w={150} h={240} c='#5cb85c' /><Blob x={1250} w={170} h={300} c='#9ac655' /></>),
  1: () => (<><Blob x={120} w={150} h={200} c='#9ac655' /><Blob x={1230} w={160} h={230} c='#9ac655' /><Building x={1020} w={130} h={260} /><Building x={1160} w={90} h={190} /></>),
  2: () => (<><Palm x={250} h={320} /><Palm x={560} h={260} s={0.9} /><Palm x={1130} h={340} s={1.1} /><Palm x={1330} h={250} s={0.8} /></>),
  4: () => (<><Blob x={110} w={160} h={220} c='#5cb85c' /><Blob x={1120} w={170} h={260} c='#9ac655' /><Blob x={1320} w={130} h={190} c='#5cb85c' /></>),
  6: () => (<><Blob x={60} w={150} h={220} c='#9ac655' /><Blob x={1260} w={150} h={250} c='#5cb85c' /></>),
  8: () => (<><Blob x={30} w={140} h={200} c='#5cb85c' /><Blob x={1290} w={130} h={200} c='#9ac655' /></>),
  9: () => (<><Palm x={120} h={280} s={0.9} /><Palm x={1320} h={300} /></>),
  10: () => (<><Building x={80} w={120} h={250} c='#7a5a8a' /><Building x={230} w={90} h={190} c='#8a6a9a' /><Blob x={1260} w={150} h={210} c='#5cb85c' /></>),
};

const hills = (w, amp, base, step, phase) => {
  let d = `M0 ${base}`;
  for (let x = 0; x < w; x += step) d += ` Q${x + step / 2} ${base - amp * (((x / step + phase) % 2) ? 1 : 0.55)} ${x + step} ${base}`;
  return `${d} V810 H0Z`;
};

const FAR_W = Math.round((WORLD_W - 1440) * 0.22 + 1440);
const MID_W = Math.round((WORLD_W - 1440) * 0.5 + 1440);

export const FarLayer = memo(() => (
  <div className='av-far'>
    <svg width={FAR_W} height='810' viewBox={`0 0 ${FAR_W} 810`} aria-hidden='true'>
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} className='av-star' style={{ animationDelay: `${-i * 0.37}s` }} d='M0 -6 L2 -2 L6 0 L2 2 L0 6 L-2 2 L-6 0 L-2 -2Z' fill='#fff' transform={`translate(${FAR_W - 1380 + ((i * 197) % 1300)} ${60 + ((i * 83) % 260)})`} />
      ))}
      <path d={hills(FAR_W, 210, 600, 520, 0)} fill='#9fd4b4' opacity='.55' />
      <path d={hills(FAR_W, 150, 620, 380, 1)} fill='#7cc39b' opacity='.7' />
      {Array.from({ length: 13 }, (_, i) => (
        <g key={i} className='av-cloud' style={{ animationDelay: `${-i * 2.1}s`, animationDuration: `${26 + (i % 4) * 6}s` }}>
          <ellipse cx={170 + i * 360} cy={110 + ((i * 53) % 170)} rx={80 + (i % 3) * 20} ry={30} fill='#fff' opacity='.92' />
          <ellipse cx={210 + i * 360} cy={95 + ((i * 53) % 170)} rx={46} ry={24} fill='#fff' opacity='.92' />
        </g>
      ))}
    </svg>
  </div>
));

export const MidLayer = memo(() => (
  <div className='av-mid'>
    <svg className='av-midhills' width={MID_W} height='810' viewBox={`0 0 ${MID_W} 810`} aria-hidden='true'>
      <path d={hills(MID_W, 150, 640, 640, 0)} fill='#3f9b55' opacity='.85' />
      <path d={hills(MID_W, 100, 650, 440, 1)} fill='#2d8a4f' />
    </svg>
    {Object.entries(DECOR).map(([li, fn]) => (
      <svg key={li} className='av-decor' style={{ left: Number(li) * 720 }} width='1440' height='810' viewBox='0 0 1440 810' aria-hidden='true'>{fn()}</svg>
    ))}
  </div>
));

export const FgLayer = memo(() => (
  <div className='av-fg' aria-hidden='true'>
    <svg width={Math.round((WORLD_W - 1440) * 1.35 + 1440)} height='810' viewBox={`0 0 ${Math.round((WORLD_W - 1440) * 1.35 + 1440)} 810`}>
      {Array.from({ length: 60 }, (_, i) => {
        const x = i * 330 + ((i * 97) % 160);
        // no bushes over the pool, so the skill fish stay visible
        if (x / 1.35 > POOL.x0 - 500 && x / 1.35 < POOL.x1 + 400) return null;
        return (
          <g key={i} className='av-sway' style={{ animationDelay: `${-(i % 7) * 0.5}s` }}>
            <ellipse cx={x} cy={800} rx={90 + (i % 3) * 20} ry={46} fill={i % 2 ? "#2f8a4a" : "#3aa05a"} />
            <ellipse cx={x + 60} cy={806} rx={60} ry={34} fill='#256f3b' />
          </g>
        );
      })}
    </svg>
  </div>
));

/* ---------------------------------------------------------------- */
/* ground and water                                                  */
/* ---------------------------------------------------------------- */

const GroundLayer = memo(() => {
  const strip = (x0, x1) => (
    <g key={x0}>
      <rect x={x0} y={GROUND} width={x1 - x0} height={810} fill='url(#av-dirt)' />
      <rect x={x0} y={GROUND} width={x1 - x0} height={46} fill='#9ac655' />
      <path d={`M${x0} ${GROUND + 46} ${Array.from({ length: Math.ceil((x1 - x0) / 18) }, (_, i) => `l9 7 l9 -7`).join(" ")}`} fill='none' stroke='#6b8f2e' strokeWidth='3' opacity='.5' />
    </g>
  );
  return (
    <svg className='av-ground' width={WORLD_W} height={GROUND + 810} viewBox={`0 0 ${WORLD_W} ${GROUND + 810}`} aria-hidden='true'>
      <defs>
        <pattern id='av-dirt' width='120' height='70' patternUnits='userSpaceOnUse'>
          <rect width='120' height='70' fill='#9e7b54' />
          <path d='M0 18 L30 0 L60 18 L90 0 L120 18 V38 L90 20 L60 38 L30 20 L0 38Z' fill='#86633f' />
          <path d='M0 53 L30 35 L60 53 L90 35 L120 53 V73 L90 55 L60 73 L30 55 L0 73Z' fill='#86633f' />
        </pattern>
      </defs>
      {strip(0, POOL.x0)}
      {strip(POOL.x1, WORLD_W)}
      <rect x={POOL.x0 - 14} y={GROUND} width={14} height={810} fill='#6b4a2b' />
      <rect x={POOL.x1} y={GROUND} width={14} height={810} fill='#6b4a2b' />
    </svg>
  );
});

const WATER_W = POOL.x1 - POOL.x0;
const SW = [60, 260, 520, 900, 1300, 1700, 2100, 2400];
const CORALS = [[140, "#ff7a59"], [640, "#c78bff"], [1180, "#ff7a59"], [1620, "#f7b32b"], [2000, "#c78bff"], [2480, "#ff9f7a"]];


const star5 = (x, y, r) => Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + (k * Math.PI) / 5; const rr = k % 2 ? r * 0.45 : r; return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`; }).join(" ");

const BgCreature = ({ kind }) => {
  switch (kind) {
    case "shark":
      return (<svg width='132' height='56' viewBox='0 0 220 96' aria-hidden='true'><path d='M176 48 L216 8 Q202 48 216 88Z' fill='#6c8aa3' /><path d='M84 20 L112 -2 L132 22Z' fill='#6c8aa3' /><path d='M6 52 Q8 14 100 14 Q176 14 184 48 Q176 84 100 82 Q14 84 6 52Z' fill='#8aa7bd' /><path d='M20 58 Q100 92 178 58 Q176 82 100 82 Q30 82 20 58Z' fill='#eef4f9' /><circle cx='38' cy='40' r='7' fill='#fff' /><circle cx='36' cy='40' r='3.5' fill='#1a1209' /></svg>);
    case "angel":
      return (<svg width='78' height='78' viewBox='0 0 100 100' aria-hidden='true'><path d='M50 4 L74 40 L50 96 L26 40Z' fill='#ffd166' /><path d='M62 42 L96 20 L90 50 L96 80Z' fill='#ff9f43' /><path d='M40 18 L50 50 L40 82 M60 18 L50 50 L60 82' stroke='#7a4a10' strokeWidth='4' opacity='.5' fill='none' /><circle cx='38' cy='38' r='6' fill='#fff' /><circle cx='36' cy='38' r='3' fill='#1a1209' /></svg>);
    case "ray":
      return (<svg width='120' height='70' viewBox='0 0 160 90' aria-hidden='true'><path d='M80 8 Q150 4 156 34 Q130 40 100 52 L84 86 L72 52 Q30 40 4 34 Q10 4 80 8Z' fill='#7aa6c9' /><path d='M60 30 Q80 40 100 30' stroke='#fff' strokeWidth='3' fill='none' opacity='.6' /><circle cx='66' cy='24' r='4' fill='#1a1209' /><circle cx='94' cy='24' r='4' fill='#1a1209' /></svg>);
    case "puffer":
      return (<svg width='82' height='70' viewBox='0 0 120 100' aria-hidden='true'><g fill='#f2c46d'>{Array.from({ length: 12 }, (_, k) => { const t = (k / 12) * Math.PI * 2; return <path key={k} d={`M${55 + Math.cos(t) * 34} ${50 + Math.sin(t) * 34} L${55 + Math.cos(t) * 48} ${50 + Math.sin(t) * 46} L${55 + Math.cos(t + 0.2) * 34} ${50 + Math.sin(t + 0.2) * 34}Z`} />; })}</g><path d='M92 50 L116 34 L116 66Z' fill='#f2c46d' /><ellipse cx='55' cy='50' rx='40' ry='36' fill='#f2c46d' /><ellipse cx='55' cy='68' rx='30' ry='14' fill='#fff' opacity='.4' /><circle cx='34' cy='38' r='7' fill='#fff' /><circle cx='32' cy='38' r='3.5' fill='#1a1209' /></svg>);
    case "whale":
      return (<svg width='150' height='70' viewBox='0 0 220 96' aria-hidden='true'><path d='M170 56 Q196 30 214 18 Q210 52 214 84 Q192 76 170 66Z' fill='#4a79a8' /><path d='M6 56 Q8 12 96 12 Q176 12 182 60 Q176 86 96 84 Q16 86 6 56Z' fill='#5b8fc2' /><path d='M18 62 Q96 92 176 62 Q172 84 96 84 Q26 84 18 62Z' fill='#e9f2fb' /><circle cx='34' cy='42' r='6' fill='#fff' /><circle cx='32' cy='42' r='3' fill='#1a1209' /></svg>);
    default:
      return (<svg width='84' height='46' viewBox='0 0 220 96' aria-hidden='true'><path d='M184 48 L218 14 Q208 48 218 82Z' fill='#ff9f43' /><ellipse cx='98' cy='48' rx='92' ry='38' fill='#ffb86b' /><ellipse cx='98' cy='64' rx='80' ry='20' fill='#fff' opacity='.28' /><circle cx='38' cy='40' r='9' fill='#fff' /><circle cx='35' cy='40' r='4.5' fill='#1a1209' /></svg>);
  }
};

const Starfish = ({ x, y, r, c }) => (
  <g>
    <polygon points={star5(x, y, r)} fill={c} stroke='#b4532a' strokeWidth='3' strokeLinejoin='round' />
    {[0, 1, 2, 3, 4].map((k) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5; return <circle key={k} cx={x + Math.cos(a) * r * 0.45} cy={y + Math.sin(a) * r * 0.45} r='2.4' fill='#fff' opacity='.8' />; })}
  </g>
);
const Scallop = ({ x, y, s = 1, c }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d='M0 0 L-26 -26 Q0 -50 26 -26 Z' fill={c} stroke='#a8553a' strokeWidth='3' strokeLinejoin='round' />
    <path d='M0 0 L-14 -40 M0 0 L0 -44 M0 0 L14 -40 M0 0 L-24 -32 M0 0 L24 -32' stroke='#fff' strokeWidth='2' opacity='.55' fill='none' />
    <rect x='-9' y='-2' width='18' height='8' rx='3' fill={c} stroke='#a8553a' strokeWidth='3' />
  </g>
);
const Conch = ({ x, y, s = 1, c }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d='M-24 0 Q-30 -26 -4 -34 Q26 -38 30 -10 Q32 6 14 6 Z' fill={c} stroke='#a8553a' strokeWidth='3' strokeLinejoin='round' />
    <path d='M-4 -30 Q18 -26 16 -10 Q12 0 2 -6 Q-4 -16 8 -20' stroke='#fff' strokeWidth='2.5' fill='none' opacity='.7' />
    <ellipse cx='-24' cy='0' rx='6' ry='4' fill='#ffd7c7' stroke='#a8553a' strokeWidth='2' />
  </g>
);

const Water = memo(() => (
  <div className='av-water' style={{ left: POOL.x0, top: GROUND, width: WATER_W, height: 810 }}>
    <svg width={WATER_W} height='810' viewBox={`0 0 ${WATER_W} 810`} aria-hidden='true'>
      {Array.from({ length: 9 }, (_, i) => (
        <polygon key={i} className='av-ray' style={{ animationDelay: `${-i * 1.3}s` }} points={`${i * 300 + 40},0 ${i * 300 + 130},0 ${i * 300 + 330},620 ${i * 300 - 30},620`} fill='#fff' opacity='.12' />
      ))}
      <path d={`M0 ${POOL.seabed - GROUND} Q300 ${POOL.seabed - GROUND - 26} 640 ${POOL.seabed - GROUND} T1300 ${POOL.seabed - GROUND} T1960 ${POOL.seabed - GROUND} T${WATER_W} ${POOL.seabed - GROUND} V810 H0Z`} fill='#e2c48a' />
      {SW.map((x, i) => {
        const base = POOL.seabed - GROUND + 6, h = 130 + (i % 3) * 50;
        return (
          <g key={x} className='av-sway' style={{ animationDelay: `${-i * 0.6}s` }}>
            <path d={`M${x} ${base} C${x - 24} ${base - h * 0.35} ${x + 24} ${base - h * 0.65} ${x} ${base - h}`} stroke='#2fae6a' strokeWidth='13' strokeLinecap='round' fill='none' />
            <path d={`M${x + 22} ${base} C${x} ${base - h * 0.3} ${x + 40} ${base - h * 0.55} ${x + 20} ${base - h * 0.8}`} stroke='#1f8a52' strokeWidth='10' strokeLinecap='round' fill='none' />
          </g>
        );
      })}
      {CORALS.map(([x, c]) => (
        <g key={x} fill={c}>
          <circle cx={x} cy={POOL.seabed - GROUND - 6} r='22' /><circle cx={x + 30} cy={POOL.seabed - GROUND - 18} r='28' /><circle cx={x + 62} cy={POOL.seabed - GROUND - 6} r='20' />
        </g>
      ))}
      {[[160, "#ff8a65", 20], [520, "#ffb74d", 16], [900, "#f06292", 22], [1420, "#ff8a65", 18], [1800, "#ffd54f", 20], [2240, "#f06292", 16], [2500, "#ffb74d", 22]].map(([x, c, r]) => (
        <Starfish key={'st' + x} x={x} y={POOL.seabed - GROUND + 2} r={r} c={c} />
      ))}
      {[[300, "#ffd7c7", 0.9, 0], [740, "#ffc2d9", 1, 0], [1120, "#ffe0a3", 0.85, 1], [1600, "#ffc2d9", 1, 0], [2050, "#ffd7c7", 0.9, 1], [2380, "#ffe0a3", 1, 0]].map(([x, c, s, t]) => (
        t ? <Conch key={'sh' + x} x={x} y={POOL.seabed - GROUND + 8} s={s} c={c} /> : <Scallop key={'sh' + x} x={x} y={POOL.seabed - GROUND + 10} s={s} c={c} />
      ))}
      {[[380, 420], [1500, 300], [2200, 520]].map(([x, y], i) => (
        <g key={x} className='av-jelly' style={{ animationDelay: `${-i * 1.7}s`, transformOrigin: `${x}px ${y}px` }}>
          <path d={`M${x - 26} ${y} q26 -46 52 0Z`} fill='#f6b6ff' opacity='.85' />
          {[-16, -5, 6, 16].map((dx) => <path key={dx} d={`M${x + dx} ${y} q-6 22 2 40`} stroke='#f6b6ff' strokeWidth='3' fill='none' opacity='.8' />)}
        </g>
      ))}
    </svg>
    {[[120, 190, 34, "fish"], [900, 330, 52, "shark"], [1700, 250, 44, "angel"], [2300, 410, 38, "shark"], [600, 470, 60, "ray"], [1300, 150, 46, "puffer"], [1950, 520, 56, "fish"], [380, 290, 66, "whale"]].map(([x, y, d, k], i) => (
      <div key={x} className='av-bgfish' style={{ left: x, top: y, animationDuration: `${d}s`, animationDelay: `${-i * 7}s` }}><BgCreature kind={k} /></div>
    ))}
    {Array.from({ length: 12 }, (_, i) => <i key={i} className='av-amb' style={{ left: 80 + ((i * 223) % 2480), animationDelay: `${-(i * 1.3) % 9}s`, animationDuration: `${7 + (i % 4)}s` }} />)}
    <div className='av-certs'>
      {CERTS.map((t, i) => <div key={t} className={i === 0 ? "hot" : ""}>🏅 {t}</div>)}
    </div>
  </div>
));

const WaterSurface = memo(() => (
  <svg className='av-surface' style={{ left: POOL.x0 - 40, top: GROUND - 12 }} width={WATER_W + 80} height='40' viewBox={`0 0 ${WATER_W + 80} 40`} aria-hidden='true'>
    <path className='av-wave' d={`M0 14 ${Array.from({ length: Math.ceil((WATER_W + 200) / 60) }, () => "q15 -12 30 0 t30 0").join(" ")} V40 H0Z`} fill='#aaf0ff' opacity='.85' />
    <path className='av-wave b' d={`M0 20 ${Array.from({ length: Math.ceil((WATER_W + 200) / 60) }, () => "q15 -10 30 0 t30 0").join(" ")} V40 H0Z`} fill='#6fd6ee' opacity='.9' />
  </svg>
));

/* ---------------------------------------------------------------- */
/* collectibles                                                      */
/* ---------------------------------------------------------------- */

const COLS = ["#f7b32b", "#ff7a59", "#7ed6a0", "#c78bff", "#ffd166", "#5ad1d9"];
const ItemVisual = ({ it }) => {
  switch (it.type) {
    case "coin":
      return <svg width='44' height='44' viewBox='-22 -22 44 44'><circle r='19' fill='#f7b32b' stroke='#c47f10' strokeWidth='3' /><circle r='11' fill='none' stroke='#fff3b0' strokeWidth='3' /><path d='M-4 -8 h8 v16 h-8Z' fill='#c47f10' opacity='.6' /></svg>;
    case "star":
      return <svg width='56' height='56' viewBox='-28 -28 56 56'><path d='M0 -24 L7 -8 L24 -7 L11 4 L15 21 L0 12 L-15 21 L-11 4 L-24 -7 L-7 -8Z' fill='#ffe14d' stroke='#e0a500' strokeWidth='3' /></svg>;
    case "pkg":
      return <svg width='68' height='64' viewBox='-34 -32 68 64'><rect x='-30' y='-26' width='60' height='54' rx='4' fill='#d9a65b' stroke='#5a3b1e' strokeWidth='3' /><rect x='-6' y='-26' width='12' height='54' fill='#f1d9a7' /><text y='14' fontSize='13' fontWeight='800' fill='#5a3b1e' textAnchor='middle' fontFamily='DejaVu Sans, sans-serif'>MAP</text></svg>;
    case "chq":
      return <svg width='68' height='68' viewBox='-34 -34 68 68'><circle r='30' fill='#fff7c8' stroke='#2f8a57' strokeWidth='4' /><text y='9' fontSize='28' fontWeight='900' fill='#2f8a57' textAnchor='middle' fontFamily='DejaVu Sans, sans-serif'>✔</text></svg>;
    case "skill": {
      const c = COLS[it.index % COLS.length];
      const s = SKILLS[it.index];
      const kind = [0, 1, 2, 3, 4, 5][(it.index * 5) % 6];
      const eye = (x, y) => <g><circle cx={x} cy={y} r='9' fill='#fff' /><circle cx={x - 3} cy={y} r='4.5' fill='#1a1209' /></g>;
      const label = (x = 100, y = 56, k = 1) => <text x={x} y={y} fontSize={(s.length > 8 ? 17 : 21) * k} fontWeight='800' fill='#12324a' textAnchor='middle' fontFamily='DejaVu Sans, sans-serif'>{s}</text>;
      return (
        <svg width='150' height='72' viewBox='0 0 220 96'>
          {kind === 0 && (<>
            <path d='M184 48 L218 14 Q208 48 218 82Z' fill={c} /><path d='M80 14 Q110 -4 140 16 Z' fill={c} opacity='.8' />
            <ellipse cx='98' cy='48' rx='92' ry='38' fill={c} /><ellipse cx='98' cy='64' rx='80' ry='20' fill='#fff' opacity='.28' />
            <path d='M150 14 Q166 48 150 82' stroke='#12324a' strokeWidth='4' fill='none' opacity='.25' />{eye(38, 40)}{label()}
          </>)}
          {kind === 1 && (<>{/* shark */}
            <path d='M176 48 L216 8 Q202 48 216 88Z' fill='#5d7a92' /><path d='M84 20 L112 -2 L132 22Z' fill='#5d7a92' />
            <path d='M6 52 Q8 14 100 14 Q176 14 184 48 Q176 84 100 82 Q14 84 6 52Z' fill='#7f9db5' />
            <path d='M20 58 Q100 92 178 58 Q176 82 100 82 Q30 82 20 58Z' fill='#f2f7fb' />
            <path d='M26 62 l8 8 l8 -8 l8 8 l8 -8' stroke='#fff' strokeWidth='3' fill='none' />{eye(38, 40)}{label(104, 54)}
          </>)}
          {kind === 2 && (<>{/* pufferfish */}
            <g fill={c} stroke={c}>{Array.from({ length: 14 }, (_, k) => { const t = (k / 14) * Math.PI * 2; return <path key={k} d={`M${105 + Math.cos(t) * 40} ${48 + Math.sin(t) * 36} L${105 + Math.cos(t) * 56} ${48 + Math.sin(t) * 50} L${105 + Math.cos(t + 0.18) * 40} ${48 + Math.sin(t + 0.18) * 36}Z`} />; })}</g>
            <path d='M158 48 L200 26 L200 70Z' fill={c} /><ellipse cx='105' cy='48' rx='54' ry='44' fill={c} />
            <ellipse cx='105' cy='70' rx='42' ry='18' fill='#fff' opacity='.35' />{eye(66, 34)}<ellipse cx='52' cy='54' rx='7' ry='5' fill='#e8453c' />{label(108, 56, s.length > 6 ? 0.72 : 0.9)}
          </>)}
          {kind === 3 && (<>{/* turtle */}
            <ellipse cx='60' cy='60' rx='16' ry='10' fill='#7bbf6a' /><circle cx='30' cy='44' r='17' fill='#7bbf6a' />{eye(26, 40)}
            <ellipse cx='150' cy='84' rx='22' ry='9' fill='#7bbf6a' /><ellipse cx='64' cy='84' rx='22' ry='9' fill='#7bbf6a' />
            <path d='M172 62 l30 6 l-26 8Z' fill='#7bbf6a' />
            <path d='M52 62 Q60 6 112 6 Q170 6 176 62Z' fill={c} stroke='#2d6a3a' strokeWidth='4' /><path d='M52 62 H176' stroke='#2d6a3a' strokeWidth='5' />
            <path d='M92 12 L86 62 M132 10 L140 62' stroke='#2d6a3a' strokeWidth='3' opacity='.5' />{label(114, 48)}
          </>)}
          {kind === 4 && (<>{/* octopus */}
            <g stroke={c} strokeWidth='11' strokeLinecap='round' fill='none'><path d='M52 64 q-18 12 -6 28' /><path d='M78 70 q-8 14 4 22' /><path d='M108 72 q0 14 12 20' /><path d='M136 68 q10 14 26 16' /><path d='M160 56 q22 4 30 22' /></g>
            <ellipse cx='108' cy='42' rx='76' ry='38' fill={c} /><ellipse cx='108' cy='62' rx='60' ry='14' fill='#fff' opacity='.22' />{eye(56, 46)}<circle cx='58' cy='62' r='5' fill='#ff9db0' opacity='.7' />{label(116, 50)}
          </>)}
          {kind === 5 && (<>{/* whale */}
            <path d='M170 56 Q196 30 214 18 Q210 52 214 84 Q192 76 170 66Z' fill='#4a79a8' />
            <path d='M6 56 Q8 12 96 12 Q176 12 182 60 Q176 86 96 84 Q16 86 6 56Z' fill='#5b8fc2' /><path d='M18 62 Q96 92 176 62 Q172 84 96 84 Q26 84 18 62Z' fill='#e9f2fb' />
            <path d='M100 12 Q96 -6 84 -4 M100 12 Q106 -8 120 -2' stroke='#a9d6f5' strokeWidth='5' fill='none' strokeLinecap='round' />{eye(34, 42)}{label(102, 56)}
          </>)}
        </svg>
      );
    }
    case "chest":
      return (
        <svg width='110' height='84' viewBox='0 0 110 84'>
          <rect x='8' y='34' width='94' height='46' rx='6' fill='#a8651f' stroke='#5a3b1e' strokeWidth='4' />
          <rect x='8' y='50' width='94' height='8' fill='#f7b32b' />
          <g className='av-lid'><path d='M8 36 q0 -28 47 -28 q47 0 47 28Z' fill='#c27a2a' stroke='#5a3b1e' strokeWidth='4' /><rect x='8' y='24' width='94' height='8' fill='#f7b32b' opacity='.85' /></g>
          <rect x='47' y='46' width='16' height='20' rx='3' fill='#f7b32b' stroke='#5a3b1e' strokeWidth='3' />
          <g className='av-glow'><circle cx='55' cy='30' r='22' fill='#fff3a0' opacity='.7' /></g>
        </svg>
      );
    default:
      return null;
  }
};

const Items = memo(() => (
  <>
    {ITEMS.map((it) => {
      const w = it.type === "skill" ? 150 : it.type === "chest" ? 110 : it.r * 2;
      const h = it.type === "skill" ? 72 : it.type === "chest" ? 84 : it.r * 2;
      const top = it.type === "chest" ? it.y + 36 - 84 : it.y - h / 2;
      return (
        <div key={it.id} data-item={it.id} className={`av-item av-${it.type}`} style={{ left: it.x - w / 2, top, width: w, height: h }}>
          <div className='av-bob' style={{ animationDelay: `${-(it.x % 13) * 0.2}s` }}><ItemVisual it={it} /></div>
        </div>
      );
    })}
  </>
));

/* ---------------------------------------------------------------- */
/* levels                                                            */
/* ---------------------------------------------------------------- */

const Gate = ({ n, name }) => (
  <div className='av-gate'>
    <div className='top'>LEVEL {n}</div>
    <div className='name'>{name}</div>
    <div className='door' />
  </div>
);

const Big = ({ children, left, top, color = "#f7b32b", shade = "#d97a1f", size = 96, depth = 22 }) => (
  <div className='gm-block ab' style={{ left, top, fontSize: size, color, textShadow: ex(shade, depth), zIndex: 6, whiteSpace: "nowrap" }}>{children}</div>
);

const DetailModal = ({ d, onClose }) => {
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return createPortal(
    <div className='av-detail' onClick={onClose} role='dialog' aria-modal='true'>
      <div className='av-detailcard' onClick={(e) => e.stopPropagation()}>
        <button className='av-detailx' onClick={onClose} aria-label='Close'>×</button>
        <h2>{d.head}</h2>
        <div className='org'>{d.org}</div>
        <ul>{d.points.map((p) => <li key={p}>{p}</li>)}</ul>
        <button className='av-btn' onClick={onClose}>Back to the adventure</button>
      </div>
    </div>,
    document.body
  );
};

const DetailCard = ({ d, className = "gm-card", style, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${className}${d ? " clickable" : ""}`} style={style} onClick={d ? () => setOpen(true) : undefined} role={d ? "button" : undefined} tabIndex={d ? 0 : undefined} onKeyDown={d ? (e) => { if (e.key === "Enter") setOpen(true); } : undefined}>
      {children}
      {d && <div className='gm-more'>👆 Click for full details</div>}
      {open && <DetailModal d={d} onClose={() => setOpen(false)} />}
    </div>
  );
};

const StageCard = ({ s, style, n, did }) => (
  <DetailCard d={DETAILS[did]} style={style}>
    <div className='gm-tag'>LEVEL {n || s.n} · EXPERIENCE</div>
    <h2>{s.title}</h2>
    <div className='gm-sub'>{s.sub}</div>
    <ul>{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
  </DetailCard>
);

const Sign = ({ sign, left, top = 508 }) => (
  <div className='gm-sign' style={{ left, top }}>
    <div className='b'>{sign[0]}<small>{sign[1]}</small></div>
    <div className='p' />
  </div>
);

const Home = () => {
  const [g, setG] = useState(0);
  const colors = ["#d9382f", "#14653a", "#c47f10", "#1f4d8a", "#7a2a8a", "#b0306a"];
  return (
    <>
      <div className='gm-flyer' onAnimationIteration={() => setG((v) => (v + 1) % GREETINGS.length)}>
        <div className='gm-banner' style={{ "--c": colors[g % colors.length] }}>{GREETINGS[g]}</div>
        <div className='gm-rope' />
        <Plane className='gm-plane' />
      </div>
      <div className='gm-block gm-title1' style={{ textShadow: ex("#d97a1f", 28) }}>EZHIL NILAVAN</div>
      <div className='gm-block gm-title2' style={{ textShadow: ex("#14653a", 24) }}>KALAIMANI</div>
      <Parrot className='ab' style={{ left: 228, top: 300, width: 80, zIndex: 14 }} />
      <div className='av-how'>
        <b>HOW TO PLAY</b>
        <span className='av-howtouch'>👈 Touch the left or right side to run · slide a finger up ☝ to jump (slide again for a double jump)</span>
        <span className='av-howkeys'><kbd>←</kbd><kbd>→</kbd> run · <kbd>Shift</kbd> sprint · <kbd>Space</kbd> jump (twice!)</span>
        <span className='av-howkeys'><kbd>E</kbd> ride your buddy / balloon · <kbd>T</kbd> stay/follow · <kbd>C</kbd> call · <kbd>M</kbd> map</span>
      </div>
      <div className='av-arrowhint'>RUN THIS WAY ▶▶▶</div>
    </>
  );
};

const Ground = ({ id, n }) => {
  const s = STAGES[id];
  const lv = LEVELS[n];
  return (
    <>
      <Gate n={lv.n} name={lv.name} />
      <Big left={420} top={150} size={92}>{lv.big}</Big>
      <Sign sign={s.sign} left={430} />
      <StageCard s={s} did={id} n={lv.n} style={{ left: 930, top: 180, width: 430 }} />
    </>
  );
};

const Education = () => (
  <>
    <Gate n={2} name='Education' />
    <Big left={420} top={100} size={92}>EDUCATION</Big>
    <DetailCard d={DETAILS.anna} style={{ left: 420, top: 240, width: 440 }}>
      <div className='gm-tag'>STUDIES · BACHELOR'S</div>
      <h2>B.E. Computer Science and Engineering</h2>
      <div className='gm-sub'>Anna University, India · Graduated May 2018 · GPA 3.70</div>
      <ul>
        <li>Algorithms, Software Engineering, Compiler Design</li>
        <li>General Secretary, Computer Society of India Student Chapter</li>
        <li>2nd of 25 teams · Android workshop by IIT Bombay</li>
      </ul>
    </DetailCard>
    <DetailCard d={DETAILS.conestoga} style={{ left: 900, top: 240, width: 440 }}>
      <div className='gm-tag'>STUDIES · POSTGRADUATE</div>
      <h2>IT Business Analysis</h2>
      <div className='gm-sub'>Conestoga College, Ontario · Sep 2021 – Dec 2022 · GPA 3.84 (Distinction)</div>
      <ul>
        <li>Data Analytics, Business Process Modeling, Databases</li>
        <li>Project Management, Requirements Modeling, SQL</li>
        <li>Data Science SQL (UC Davis) · Football Analytics with Python</li>
      </ul>
    </DetailCard>
    <div className='av-csm' style={{ left: 900, top: 470 }}>
      <svg width='46' height='46' viewBox='0 0 46 46' aria-hidden='true'><circle cx='23' cy='23' r='21' fill='#f7b32b' stroke='#b9791a' strokeWidth='3' /><circle cx='23' cy='23' r='15' fill='#d9382f' /><text x='23' y='29' textAnchor='middle' fontSize='15' fontWeight='900' fill='#fff' fontFamily='DejaVu Sans, sans-serif'>CSM</text></svg>
      <div><b>Certified ScrumMaster®</b><span>Scrum Alliance · May 2025</span></div>
    </div>
  </>
);

const TD = () => {
  const s = STAGES.td;
  return (
    <>
      <svg className='av-hall' width='1440' height='640' viewBox='0 0 1440 640' aria-hidden='true'>
        <rect width='1440' height='640' fill='#cfe8ef' />
        <rect width='1440' height='120' fill='#14532d' />
        <rect y='120' width='1440' height='16' fill='#f7b32b' />
        {Array.from({ length: 36 }, (_, i) => <path key={i} d={`M${i * 40} 120 l20 16 h-20 l-20 -16Z`} fill='#222' />)}
        {Array.from({ length: 5 }, (_, i) => <rect key={i} x={120 + i * 270} y='160' width='110' height='60' rx='6' fill='#b9d4de' />)}
        <rect x='100' y='500' width='900' height='40' rx='20' fill='#2c3a42' />
        {Array.from({ length: 15 }, (_, i) => <circle key={i} cx={130 + i * 60} cy='520' r='11' fill='#8fa3b5' />)}
        <rect x='520' y='140' width='40' height='190' fill='#8fa3b5' /><rect x='480' y='320' width='120' height='30' rx='8' fill='#c6d3dc' />
        {Array.from({ length: 6 }, (_, i) => <circle key={i} className='av-blink' style={{ animationDelay: `${-i * 0.4}s` }} cx={80 + i * 270} cy='60' r='9' fill='#f7b32b' />)}
      </svg>
      <div className='gm-arm'>
        <svg width='120' height='170' viewBox='0 0 120 170' aria-hidden='true'>
          <rect x='50' y='0' width='20' height='110' fill='#7a8e9c' /><rect x='20' y='110' width='80' height='26' rx='6' fill='#2f8a57' />
          <text x='60' y='128' fontSize='14' fontWeight='800' fill='#fff' textAnchor='middle' fontFamily='DejaVu Sans, sans-serif'>ACCEPT</text>
        </svg>
      </div>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className='gm-cheque' style={{ animationDelay: `${-i * 2.4}s` }}>CHEQUE<span className='m'>$ ……</span><span className='a'>✔ ACCEPTED</span></div>
      ))}
      <Gate n={5} name='TD' />
      <div className='gm-card gm-meter' style={{ borderBottomColor: "#2f8a57" }}>
        <div className='gm-tag'>SYMCOR CHEQUE PROCESSING</div>
        <div className='big'>99%</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>AUTOMATED</div>
        <div className='bar'><i /></div>
        <div className='av-chqc' style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: "#14532d" }}>Jump to grab the ✔ cheques</div>
      </div>
      <StageCard s={s} did='td' n={5} style={{ left: 360, top: 250, width: 400, zIndex: 21 }} />
      <div className='av-roofbld' style={{ left: ROOF.x0 - 7200, top: ROOF.y, width: ROOF.x1 - ROOF.x0 - 50, height: GROUND - ROOF.y }}>
        <div className='slab' style={{ width: ROOF.x1 - ROOF.x0 + 10 }} />
        <span>CONTROL ROOM</span>
        {Array.from({ length: 6 }, (_, i) => <i key={i} className='av-blink' style={{ left: 28 + (i % 3) * 78, top: 50 + Math.floor(i / 3) * 70, animationDelay: `${-i * 0.6}s` }} />)}
      </div>
      <div className='av-ladder' style={{ left: LADDER.x - 7200 - 20, top: LADDER.top, height: LADDER.bottom - LADDER.top }} />
    </>
  );
};

const Medal = ({ badge }) => (
  <svg viewBox={badge ? '8 56 74 74' : '0 0 90 130'} aria-hidden='true'>
    {!badge && <path d='M18 0 L45 62 L30 66 L2 6Z' fill='#e8453c' stroke='#9c2a22' strokeWidth='2' />}{!badge && <path d='M72 0 L45 62 L60 66 L88 6Z' fill='#2b8cc0' stroke='#1b5f86' strokeWidth='2' />}
    <circle cx='45' cy='92' r='34' fill='#f7b32b' stroke='#b9791a' strokeWidth='5' /><circle cx='45' cy='92' r='26' fill='#ffd75e' stroke='#e09a14' strokeWidth='3' />
    <path d='M45 70 l6.5 14 15 1.8 -11 10 3.2 15 -13.7 -8 -13.7 8 3.2 -15 -11 -10 15 -1.8Z' fill='#fff6c8' stroke='#b9791a' strokeWidth='2.5' strokeLinejoin='round' />
  </svg>
);

const MasterNinja = () => (
  <svg viewBox='0 0 150 230' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
    {/* staff */}
    <rect x='12' y='40' width='7' height='182' rx='3.5' fill='#8a5a1b' /><circle cx='15.5' cy='38' r='9' fill='#f7b32b' stroke='#b9791a' strokeWidth='3' />
    {/* robe */}
    <path d='M40 100 Q75 84 110 100 L124 206 Q75 220 26 206Z' fill='#7a1f3d' stroke='#4d1226' strokeWidth='3' />
    <path d='M75 96 L75 212' stroke='#4d1226' strokeWidth='3' />
    <path d='M34 154 Q75 170 116 154 V172 Q75 188 34 172Z' fill='#f7b32b' stroke='#b9791a' strokeWidth='3' />
    {/* feet */}
    <rect x='42' y='208' width='28' height='14' rx='7' fill='#3b2a1a' /><rect x='80' y='208' width='28' height='14' rx='7' fill='#3b2a1a' />
    {/* arms */}
    <path d='M42 108 Q24 128 20 150' stroke='#7a1f3d' strokeWidth='16' strokeLinecap='round' fill='none' /><circle cx='19' cy='154' r='9' fill='#f2c79a' stroke='#b98a5c' strokeWidth='2' />
    <path d='M108 108 Q124 126 120 146' stroke='#7a1f3d' strokeWidth='16' strokeLinecap='round' fill='none' />
    {/* STAR emblem on chest */}
    <circle cx='75' cy='128' r='19' fill='#fff6c8' stroke='#b9791a' strokeWidth='3' />
    <path d='M75 112 l5 11 12 1.4 -9 8 2.8 12 -10.8 -6.4 -10.8 6.4 2.8 -12 -9 -8 12 -1.4Z' fill='#f7b32b' stroke='#b9791a' strokeWidth='2' strokeLinejoin='round' />
    {/* head */}
    <circle cx='75' cy='62' r='34' fill='#f2c79a' stroke='#b98a5c' strokeWidth='3' />
    {/* hood / headband */}
    <path d='M40 56 Q42 24 75 22 Q108 24 110 56 Q75 44 40 56Z' fill='#7a1f3d' stroke='#4d1226' strokeWidth='3' />
    <path d='M75 26 l3.5 7.5 8 1 -6 5.5 1.8 8 -7.3 -4.3 -7.3 4.3 1.8 -8 -6 -5.5 8 -1Z' fill='#ffd75e' stroke='#b9791a' strokeWidth='1.6' strokeLinejoin='round' />
    {/* eyes + long white brows */}
    <ellipse cx='62' cy='64' rx='5' ry='6' fill='#1b2e1f' /><ellipse cx='88' cy='64' rx='5' ry='6' fill='#1b2e1f' />
    <circle cx='63.5' cy='62' r='1.8' fill='#fff' /><circle cx='89.5' cy='62' r='1.8' fill='#fff' />
    <path d='M44 56 Q58 48 70 58 Q56 56 44 62Z' fill='#fff' stroke='#c9c9c9' strokeWidth='1.5' /><path d='M106 56 Q92 48 80 58 Q94 56 106 62Z' fill='#fff' stroke='#c9c9c9' strokeWidth='1.5' />
    <path d='M72 70 Q75 74 78 70' stroke='#b98a5c' strokeWidth='2.5' fill='none' strokeLinecap='round' />
    {/* moustache + beard */}
    <path d='M75 76 Q58 70 48 80 Q60 82 75 80 Q90 82 102 80 Q92 70 75 76Z' fill='#fff' stroke='#c9c9c9' strokeWidth='1.5' />
    <path d='M52 84 Q56 118 75 126 Q94 118 98 84 Q86 94 75 92 Q64 94 52 84Z' fill='#fff' stroke='#c9c9c9' strokeWidth='2' />
  </svg>
);

const AwardScene = () => (
  <div className='ab av-award' data-state='idle' style={{ left: 880, top: 380, width: 500, height: 262, zIndex: 11 }}>
    <svg className='av-heli' viewBox='0 0 300 140' style={{ position: "absolute", left: 200, top: 100, width: 300 }} aria-hidden='true'>
      <g className='av-rotor'><rect x='20' y='6' width='260' height='7' rx='3.5' fill='#3b3f46' /></g>
      <rect x='146' y='10' width='8' height='22' fill='#3b3f46' />
      <path d='M60 70 Q60 34 130 34 H190 Q230 36 236 70 Q236 100 196 102 H100 Q60 102 60 70Z' fill='#f7b32b' stroke='#b9791a' strokeWidth='4' />
      <path d='M196 62 L296 56 L296 70 L206 84Z' fill='#e8453c' stroke='#9c2a22' strokeWidth='3' />
      <g className='av-tailrot'><rect x='288' y='38' width='6' height='42' rx='3' fill='#3b3f46' /></g>
      <path d='M82 48 Q96 40 128 40 V76 H76 Q72 56 82 48Z' fill='#bfe6ff' stroke='#b9791a' strokeWidth='3' />
      <path d='M138 40 H184 Q214 42 218 70 H138Z' fill='#bfe6ff' stroke='#b9791a' strokeWidth='3' />
      <text x='158' y='92' textAnchor='middle' fontSize='14' fontWeight='800' fill='#7a1f18'>EZ AIR</text>
      <path d='M70 118 H230 M96 102 V118 M204 102 V118' stroke='#3b3f46' strokeWidth='6' strokeLinecap='round' fill='none' />
    </svg>
    <div className='av-master'>
      <div className='av-mbubble'>🌟 Q2 2026 Star Award<br /><small>Best Performance · TD</small></div>
      <div className='av-mflip'><MasterNinja /></div>
      <div className='av-mtrophy'><Medal /></div>
      <div className='av-mtag'>MASTER NINJA</div>
    </div>
  </div>
);

const Today = () => (
  <>
    <Gate n={6} name='Today' />
    <Big left={420} top={140} size={92} color='#f27d8c' shade='#8e1b3a'>TODAY</Big>
    <DetailCard d={DETAILS.today} style={{ left: 70, top: 300, width: 400 }}>
      <div className='gm-tag'>LEVEL 5 · TODAY</div>
      <h2>Q2 2026 Star Award</h2>
      <div className='gm-sub'>Wealth Operations Officer III · TD, Toronto</div>
      <ul>
        <li>Recognized for taking Symcor cheque processing to 99% automation</li>
        <li>100% accuracy on RSP / TFSA transactions</li>
        <li>Python · SQL · Power BI · Tableau · Excel</li>
      </ul>
    </DetailCard>
    <AwardScene />
    <div className='av-tip' style={{ left: 600, top: 560 }}>Stand by the balloon and press <kbd>E</kbd> to fly ☁</div>
    {[[220, 220, 110], [900, 120, 130], [1260, 320, 100]].map(([x, y, w]) => (
      <div key={x} className='ab av-cloudy' style={{ left: x, top: y, width: w * 2, height: w * 0.6 }} />
    ))}
  </>
);

const Skills = ({ skillCount }) => (
  <>
    <Big left={760} top={110} size={104} color='#f27d8c' shade='#8e1b3a' depth={24}>SKILLS</Big>
    <div className='av-sub' style={{ left: 780, top: 262 }}>
      {skillCount >= SKILLS.length ? "🏆 ALL SKILLS UNLOCKED!" : `Dive in and swim into the skills · ${skillCount} / ${SKILLS.length}`}
    </div>
    <Gate n={7} name='Skills · Underwater' />
    <div className='av-tip' style={{ left: 120, top: 520 }}>Jump into the water ➜ <kbd>←↑↓→</kbd> swim · <kbd>Shift</kbd> faster</div>
  </>
);

const Projects = ({ opened }) => (
  <>
    <Gate n={8} name='Projects' />
    <Big left={430} top={110} size={96} color='#f27d8c' shade='#8e1b3a'>PROJECTS</Big>
    <div className='av-sub' style={{ left: 440, top: 232 }}>Open the treasure chests · {Object.keys(opened).length} / {PROJECTS.length}</div>
    {PROJECTS.map((p, i) => (
      <DetailCard key={p.name} className={`av-pcard ${opened[i] ? "show" : ""}`} d={opened[i] ? (DETAILS.proj[p.name] || { head: p.name, org: p.tags.join(" · "), points: [p.text] }) : null} style={{ left: 82 + i * 250, top: 300 }}>
        <h3>{p.name}</h3>
        <p>{p.text}</p>
        <div className='gm-tg'>{p.tags.map((t) => <i key={t}>{t}</i>)}</div>
      </DetailCard>
    ))}
  </>
);

const Kudos = () => {
  const [i, setI] = useState(0);
  const n = testimonials.length;
  const t = testimonials[i];
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % n), 9000);
    return () => clearInterval(id);
  }, [n]);
  return (
    <>
      <Gate n={9} name='Testimonials' />
      <Big left={420} top={120} size={86} color='#f7b32b' shade='#b9561a'>TESTIMONIALS</Big>
      <button className='gm-qbtn' style={{ left: 300, top: 360 }} onClick={() => setI((v) => (v - 1 + n) % n)} aria-label='Previous'>‹</button>
      <button className='gm-qbtn' style={{ left: 1150, top: 360 }} onClick={() => setI((v) => (v + 1) % n)} aria-label='Next'>›</button>
      <div className='gm-quote' key={i} style={{ left: 350, top: 260, width: 780 }}>
        <div className='q'>“</div>
        <p className='t'>{t.testimonial.trim()}</p>
        <div className='who'>{t.name} · {t.subtitle || `${t.designation}, ${t.company}`}</div>
      </div>
      <div className='gm-dots' style={{ top: 480, left: 350, right: "auto", width: 780 }}>
        {testimonials.map((x, k) => <button key={x.name} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`} />)}
      </div>
    </>
  );
};

const SocialRibbon = () => {
  const ext = { target: "_blank", rel: "noreferrer" };
  return (
    <div className='av-ribbon'>
      <div className='av-ribbon-in'>
        <a href={LINKS.linkedin} {...ext} aria-label='LinkedIn' title='LinkedIn'>
          <svg viewBox='0 0 24 24' width='26' height='26'><rect width='24' height='24' rx='4' fill='#0a66c2' /><path d='M5 9.5h3V19H5zM6.5 5a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6zM10 9.5h2.9v1.3c.5-.9 1.6-1.5 3-1.5 3 0 3.6 2 3.6 4.5V19h-3v-4.7c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3z' fill='#fff' /></svg>
        </a>
        <a href={LINKS.github} {...ext} aria-label='GitHub' title='GitHub'>
          <svg viewBox='0 0 24 24' width='28' height='28'><circle cx='12' cy='12' r='11' fill='#171a1f' /><path d='M12 4.5a7.5 7.5 0 00-2.4 14.6c.4.1.5-.2.5-.4v-1.4c-2.1.5-2.5-.9-2.5-.9-.3-.9-.8-1.100-.8-1.100-.7-.5.1-.5.1-.5.8.1 1.200.8 1.200.8.7 1.200 1.800.9 2.300.7.1-.5.3-.9.5-1.100-1.700-.2-3.400-.8-3.400-3.700 0-.8.3-1.500.8-2-.1-.2-.4-1 .1-2 0 0 .6-.2 2 .8a6.800 6.800 0 013.600 0c1.400-1 2-.8 2-.8.4 1 .2 1.800.1 2 .5.5.8 1.200.8 2 0 2.900-1.700 3.500-3.400 3.700.3.2.5.700.5 1.400v2.100c0 .2.1.5.5.4A7.500 7.500 0 0012 4.500z' fill='#fff' /></svg>
        </a>
        <a href={LINKS.letterboxd} {...ext} aria-label='Letterboxd' title='Letterboxd'>
          <svg viewBox='0 0 30 20' width='34' height='24'><circle cx='7' cy='10' r='6' fill='#00e054' /><circle cx='15' cy='10' r='6' fill='#40bcf4' /><circle cx='23' cy='10' r='6' fill='#ff8000' /><path d='M11 5.6a6 6 0 010 8.800 6 6 0 010-8.800zM19 5.6a6 6 0 010 8.800 6 6 0 010-8.800z' fill='#a8c8c8' /></svg>
        </a>
        <a href={LINKS.instagram} {...ext} aria-label='Instagram' title='Instagram'>
          <svg viewBox='0 0 24 24' width='28' height='28'><defs><linearGradient id='ig' x1='0' y1='1' x2='1' y2='0'><stop offset='0' stopColor='#fdc468' /><stop offset='.5' stopColor='#e1306c' /><stop offset='1' stopColor='#5851db' /></linearGradient></defs><rect x='1' y='1' width='22' height='22' rx='6' fill='url(#ig)' /><rect x='5.500' y='5.500' width='13' height='13' rx='4' fill='none' stroke='#fff' strokeWidth='1.800' /><circle cx='12' cy='12' r='3.100' fill='none' stroke='#fff' strokeWidth='1.800' /><circle cx='16.300' cy='7.700' r='1' fill='#fff' /></svg>
        </a>
        <a href={LINKS.facebook} {...ext} aria-label='Facebook' title='Facebook'>
          <svg viewBox='0 0 24 24' width='28' height='28'><circle cx='12' cy='12' r='11' fill='#1877f2' /><path d='M13.200 20v-6.800h2.300l.4-2.700h-2.700V8.800c0-.8.300-1.300 1.400-1.300h1.400V5.100c-.3 0-1.100-.1-2.100-.1-2.100 0-3.500 1.300-3.500 3.600v2h-2.300v2.700h2.300V20z' fill='#fff' /></svg>
        </a>
        <a href={LINKS.email} aria-label='Email' title='Email'>
          <svg viewBox='0 0 24 24' width='28' height='28'><rect x='2' y='5' width='20' height='14' rx='3' fill='#fff' /><path d='M3 7l9 6 9-6' stroke='#d9382f' strokeWidth='2' fill='none' strokeLinecap='round' strokeLinejoin='round' /></svg>
        </a>
        <a href={RESUME_URL} download aria-label='Download resume' title='Download resume'>
          <svg viewBox='0 0 24 24' width='26' height='26'><path d='M6 2h8l5 5v15H6z' fill='#fff' /><path d='M14 2v5h5' fill='#e5e5e5' /><path d='M9 12h7M9 15h7M9 18h5' stroke='#d9382f' strokeWidth='1.600' strokeLinecap='round' /></svg>
        </a>
      </div>
    </div>
  );
};

const Move = () => (
  <>
    <Gate n={1} name='India → Canada' />
    <svg className='ab' style={{ left: 0, top: 0, zIndex: 2, pointerEvents: "none" }} width='1440' height='810' viewBox='0 0 1440 810' aria-hidden='true'>
      {/* ribbon */}
      <g>
        <path d='M300 70 H1140 V150 H300Z' fill='#d9382f' />
        <path d='M300 70 L255 92 L285 112 L255 132 L300 150Z' fill='#a9231b' />
        <path d='M1140 70 L1185 92 L1155 112 L1185 132 L1140 150Z' fill='#a9231b' />
        <text x='720' y='126' textAnchor='middle' fontFamily='Georgia, serif' fontStyle='italic' fontWeight='700' fontSize='44' fill='#fff'>Previously in India · Now in Canada</text>
      </g>
      {/* India: Taj Mahal */}
      <g transform='translate(430 0)'>
        <rect x='0' y='606' width='380' height='34' rx='4' fill='#efe7d2' stroke='#9c8f72' strokeWidth='3' />
        {[28, 352].map((x) => (
          <g key={x}>
            <rect x={x - 12} y='400' width='24' height='206' fill='#faf6ea' stroke='#9c8f72' strokeWidth='3' />
            <rect x={x - 16} y='430' width='32' height='9' fill='#e4dcc4' stroke='#9c8f72' strokeWidth='2' /><rect x={x - 16} y='500' width='32' height='9' fill='#e4dcc4' stroke='#9c8f72' strokeWidth='2' />
            <ellipse cx={x} cy='394' rx='18' ry='13' fill='#fffdf5' stroke='#9c8f72' strokeWidth='3' /><path d={`M${x} 381 V362`} stroke='#9c8f72' strokeWidth='3' />
          </g>
        ))}
        <rect x='86' y='470' width='208' height='136' fill='#fbf7ec' stroke='#9c8f72' strokeWidth='3' />
        <path d='M164 606 V524 Q190 484 216 524 V606Z' fill='#d6cdb4' stroke='#9c8f72' strokeWidth='3' />
        {[104, 262].map((x) => <path key={x} d={`M${x} 606 V540 Q${x + 12} 520 ${x + 24} 540 V606Z`} fill='#d6cdb4' stroke='#9c8f72' strokeWidth='2.5' />)}
        {[108, 262].map((x) => <g key={x}><ellipse cx={x + 8} cy='470' rx='20' ry='23' fill='#fffdf5' stroke='#9c8f72' strokeWidth='3' /><path d={`M${x + 8} 447 V432`} stroke='#9c8f72' strokeWidth='3' /></g>)}
        <rect x='160' y='424' width='60' height='48' fill='#fbf7ec' stroke='#9c8f72' strokeWidth='3' />
        <path d='M120 430 Q190 330 260 430Z' fill='#fffdf5' stroke='#9c8f72' strokeWidth='3' transform='translate(0 20)' />
        <ellipse cx='190' cy='418' rx='66' ry='72' fill='#fffdf5' stroke='#9c8f72' strokeWidth='3.5' />
        <path d='M190 346 V316' stroke='#d9a62b' strokeWidth='4' strokeLinecap='round' /><circle cx='190' cy='312' r='6' fill='#f7b32b' stroke='#b9791a' strokeWidth='2' />
        <path d='M150 380 Q190 350 230 380' stroke='#e9e1c8' strokeWidth='3' fill='none' />
      </g>
      {/* Toronto: CN Tower (big, bold, easy to recognise) */}
      <g transform='translate(902 0)'>
        <ellipse cx='123' cy='640' rx='70' ry='10' fill='#2f3b48' opacity='.25' />
        {/* three-legged base */}
        <path d='M96 640 L108 560 L138 560 L150 640Z' fill='#8795a5' stroke='#2f3b48' strokeWidth='3' strokeLinejoin='round' />
        {/* concrete shaft */}
        <path d='M110 560 L116 400 L130 400 L136 560Z' fill='#b9c4cf' stroke='#2f3b48' strokeWidth='3' strokeLinejoin='round' />
        <path d='M118 560 L122 400' stroke='#fff' strokeWidth='3' opacity='.8' />
        {/* main pod */}
        <path d='M64 392 Q123 372 182 392 L172 410 Q123 424 74 410Z' fill='#7d8b9a' stroke='#2f3b48' strokeWidth='3' strokeLinejoin='round' />
        <path d='M70 380 Q123 358 176 380 L182 392 Q123 372 64 392Z' fill='#dfe6ee' stroke='#2f3b48' strokeWidth='3' strokeLinejoin='round' />
        <path d='M86 394 H160' stroke='#f7d36a' strokeWidth='4' strokeLinecap='round' strokeDasharray='2 7' />
        {/* upper shaft + sky pod */}
        <path d='M118 372 L120 262 L126 262 L128 372Z' fill='#b9c4cf' stroke='#2f3b48' strokeWidth='3' />
        <ellipse cx='123' cy='256' rx='15' ry='7' fill='#dfe6ee' stroke='#2f3b48' strokeWidth='3' />
        {/* antenna */}
        <path d='M123 249 L123 168' stroke='#2f3b48' strokeWidth='6' strokeLinecap='round' />
        <path d='M123 249 L123 168' stroke='#fff' strokeWidth='2' strokeLinecap='round' />
        <circle cx='123' cy='164' r='11' fill='#e8453c' opacity='.35' />
        <circle cx='123' cy='164' r='5' fill='#e8453c' stroke='#fff' strokeWidth='2' />
      </g>
      {/* Toronto: Rogers Centre dome + skyline */}
      <g transform='translate(1080 0)'>
        <path d='M10 640 V560 Q130 440 250 560 V640Z' fill='#cfd6de' stroke='#6c7886' strokeWidth='3' />
        <path d='M60 600 Q130 520 200 600' stroke='#6c7886' strokeWidth='3' fill='none' />
        <rect x='258' y='470' width='70' height='170' fill='#9aa7b4' stroke='#6c7886' strokeWidth='3' />
        <rect x='330' y='520' width='50' height='120' fill='#b4bfca' stroke='#6c7886' strokeWidth='3' />
        {Array.from({ length: 6 }, (_, r) => Array.from({ length: 2 }, (_, c) => <rect key={r + '-' + c} x={270 + c * 28} y={486 + r * 24} width='16' height='12' fill='#f7d36a' opacity='.8' />))}
      </g>
      {/* flight path */}
      <path d='M470 230 Q720 20 970 200' stroke='#fff' strokeWidth='4' strokeDasharray='4 12' strokeLinecap='round' fill='none' opacity='.9' />
    </svg>
    <div className='av-moveplane'>✈</div>
    <div className='av-movetag' style={{ left: 560, top: 654 }}>TAJ MAHAL · INDIA</div>
    <div className='av-movetag now' style={{ left: 1030, top: 654 }}>CN TOWER · CANADA</div>
  </>
);

const FlagCastle = () => {
  const fx = FLAG.x - 15840;
  const cx = CASTLE_X - 15840;
  return (
    <>
      <div className='av-flagpole' style={{ left: fx - 4, top: FLAG.top, height: GROUND - FLAG.top }}>
        <i className='ball' />
        <div className='av-flagcloth'><svg width='84' height='54' viewBox='0 0 84 54'><path d='M0 0 L84 27 L0 54Z' fill='#d9382f' /><text x='8' y='34' fontSize='22' fontWeight='900' fill='#fff' fontFamily='DejaVu Sans, sans-serif'>E</text></svg></div>
      </div>
      <div className='av-flagbase' style={{ left: fx - 22, top: GROUND - 14 }} />
      <svg className='ab' style={{ left: cx - 80, top: GROUND - 170, zIndex: 8 }} width='160' height='172' viewBox='0 0 160 172' aria-hidden='true'>
        <rect x='20' y='60' width='120' height='112' fill='#c98a5b' stroke='#7a4a22' strokeWidth='3' />
        <g fill='#c98a5b' stroke='#7a4a22' strokeWidth='3'><rect x='20' y='40' width='26' height='24' /><rect x='67' y='40' width='26' height='24' /><rect x='114' y='40' width='26' height='24' /></g>
        <path d='M80 172 V130 a24 24 0 0 1 48 0 V172Z' transform='translate(-24 0)' fill='#4a2b12' />
        <rect x='0' y='60' width='160' height='8' fill='#a96f3d' />
        <path d='M80 40 V8 L112 20 L80 30' fill='#d9382f' stroke='#7a1d17' strokeWidth='2' />
        <rect x='78' y='8' width='4' height='36' fill='#7a4a22' />
      </svg>
      <div className='av-firew'>{Array.from({ length: 7 }, (_, i) => <i key={i} style={{ left: 40 + i * 190, animationDelay: `${i * 0.35}s` }} />)}</div>
    </>
  );
};

const Contact = ({ finished }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setStatus("Sending…");
    emailjs
      .send("service_3yf8wil", "template_p3qaifo", { from_name: form.name, to_name: "Ezhil Nilavan Kalaimani", from_email: form.email, to_email: "iamezhilnilavan@gmail.com", message: form.message + " email is " + form.email }, "pmZPRYuPINkDLOE3c")
      .then(
        () => { setStatus("Thank you! I will get back to you as soon as possible."); setForm({ name: "", email: "", message: "" }); },
        (err) => { console.error(err); setStatus("Something went wrong. Please try again."); }
      );
  };
  return (
    <>
      <Gate n={10} name='Contact' />
      <svg className='ab' style={{ left: 0, top: 0, zIndex: 3, pointerEvents: "none" }} width='1440' height='810' viewBox='0 0 1440 810' aria-hidden='true'>
        <polygon points='620,310 620,610 510,700 510,420' fill='#c98a2b' />
        <polygon points='620,610 1140,610 1030,700 510,700' fill='#a66b16' />
        <rect x='620' y='310' width='520' height='300' fill='#f7b32b' />
        <g fontFamily='DejaVu Sans, sans-serif' fontWeight='800' fontSize='17' fill='#8a5a1b' textAnchor='end' letterSpacing='2'>
          <text x='772' y='366'>YOUR NAME</text><text x='772' y='424'>YOUR EMAIL</text><text x='772' y='482'>MESSAGE</text>
        </g>
      </svg>
      <Big left={520} top={120} size={118} color='#f27d8c' shade='#8e1b3a' depth={24}>CONTACT</Big>
      <div className='ab' style={{ left: 530, top: 255, color: "#0c3b24", fontWeight: 800, fontSize: 18, zIndex: 6 }}>Say hello · வணக்கம்</div>
      <form onSubmit={submit}>
        <input className='gm-inp' name='name' value={form.name} onChange={onChange} placeholder='Your name' required style={{ left: 790, top: 338, width: 320, height: 42 }} />
        <input className='gm-inp' name='email' type='email' value={form.email} onChange={onChange} placeholder='you@example.com' required style={{ left: 790, top: 396, width: 320, height: 42 }} />
        <textarea className='gm-inp' name='message' value={form.message} onChange={onChange} placeholder='Write your message' required style={{ left: 790, top: 454, width: 320, height: 130 }} />
        <button className='av-send' type='submit'>SEND MESSAGE ▶</button>
      </form>
      {status && <div className='gm-status' style={{ left: 640, top: 705 }}>{status}</div>}
      <FlagCastle />
      <SocialRibbon />
    </>
  );
};

const Hurdles = memo(() => (
  <>
    {HURDLES.map((x) => (
      <svg key={x} className='ab' style={{ left: x, top: GROUND - HURDLE_H - 4, zIndex: 17 }} width={HURDLE_W} height='64' viewBox='0 0 72 64' aria-hidden='true'>
        <rect x='4' y='6' width='8' height='58' fill='#fff' stroke='#c9d3da' strokeWidth='2' /><rect x='60' y='6' width='8' height='58' fill='#fff' stroke='#c9d3da' strokeWidth='2' />
        <rect x='0' y='4' width='72' height='14' rx='3' fill='#d9382f' /><rect x='14' y='4' width='12' height='14' fill='#fff' /><rect x='40' y='4' width='12' height='14' fill='#fff' />
      </svg>
    ))}
  </>
));

const Falling = memo(() => (
  <>
    {Array.from({ length: 18 }, (_, i) => (
      <i key={i} className='av-leaf' style={{ left: 1440 + ((i * 331) % 2900), animationDelay: `${-(i * 1.7) % 11}s`, animationDuration: `${9 + (i % 5)}s` }} />
    ))}
  </>
));

/* ---------------------------------------------------------------- */
/* assembled world                                                   */
/* ---------------------------------------------------------------- */

const ELEPHANTS = [
  { x: 4050, w: 190, d: 18 }, { x: 8920, w: 180, d: 16 }, { x: 13820, w: 190, d: 20 },
];
const Elephants = memo(() => (
  <>
    {ELEPHANTS.map((e, i) => (
      <div key={i} className='av-eleph' style={{ left: e.x, top: GROUND - e.w * 0.76 + 4, width: e.w, '--d': `${e.d}s` }}>
        <div className='av-eleph-in'><Elephant /></div>
      </div>
    ))}
  </>
));

const CRITTERS = [
  ["rabbit", 1900, 78, 6], ["rabbit", 6550, 86, 5], ["rabbit", 9150, 80, 6], ["rabbit", 14750, 82, 6],
  ["deer", 330, 170, 22], ["deer", 7620, 165, 22], ["deer", 13900, 168, 23],
  ["hog", 3650, 90, 17], ["hog", 14150, 96, 18],
];
const Critters = memo(() => (
  <>
    {CRITTERS.map(([k, x, w, d], i) => {
      const h = k === "deer" ? w * 0.94 : k === "hog" ? w * 0.73 : w;
      return (
        <div key={i} className={`av-crit ${k}`} style={{ left: x, top: GROUND - h + 6, width: w, '--d': `${d}s` }}>
          <div className='av-crit-in'>{k === "rabbit" ? <Rabbit /> : k === "deer" ? <Deer /> : <Hedgehog />}</div>
        </div>
      );
    })}
  </>
));

export const WorldContent = memo(({ skillCount, opened, finished }) => (
  <>
    <GroundLayer />
    <Water />
    <WaterSurface />
    <Hurdles />
    <Falling />
    <Elephants />
    <Critters />
    {LEVELS.map((l, i) => {
      let body = null;
      if (l.id === "home") body = <Home />;
      else if (l.id === "edu") body = <Education />;
      else if (l.id === "move") body = <Move />;
      else if (["amazon", "work"].includes(l.id)) body = <Ground id={l.id} n={i} />;
      else if (l.id === "td") body = <TD />;
      else if (l.id === "today") body = <Today />;
      else if (l.id === "skills") body = <Skills skillCount={skillCount} />;
      else if (l.id === "projects") body = <Projects opened={opened} />;
      else if (l.id === "kudos") body = <Kudos />;
      else body = <Contact finished={finished} />;
      return <div key={l.id} className={`av-lv av-lv-${l.id}`} style={{ left: l.x }}>{body}</div>;
    })}
    <Items />
  </>
));

export const Entities = memo(({ refs, buddy = "tiger" }) => (
  <>
    <div ref={refs.balloon} className='av-ent av-balloon' style={{ width: 260 }}>
      <svg width='260' height='322' viewBox='0 0 500 620' aria-hidden='true'>
        <path d='M250 20 C60 20 40 250 150 350 L350 350 C460 250 440 20 250 20Z' fill='#f7b32b' />
        <path d='M250 20 C170 20 150 250 190 350 L310 350 C350 250 330 20 250 20Z' fill='#d9382f' />
        <path d='M250 20 C220 20 215 250 235 350 L265 350 C285 250 280 20 250 20Z' fill='#14653a' />
        <rect x='110' y='190' width='280' height='40' fill='#fff' opacity='.9' />
        <path d='M150 350 L205 470 M350 350 L295 470 M250 350 V470' stroke='#8a5a2b' strokeWidth='5' />
        <rect x='190' y='470' width='120' height='80' rx='8' fill='#c98a2b' stroke='#6b4a2b' strokeWidth='5' />
      </svg>
    </div>
    <div ref={refs.tiger} className='av-ent av-tiger' data-buddy={buddy} style={{ width: 280 }}>
      <div ref={refs.tigerFlip} className='av-flip'>
        <Tiger gear className='av-tsvg' />
        <Tiger roar gear className='av-roarsvg av-tsvg' />
        <Elephant gear className='av-esvg' />
        <Peacock gear className='av-psvg' />
      </div>
      <div className='av-roarbub'>{buddy === "elephant" ? "TOOOT!" : buddy === "peacock" ? "PEE-OW!" : "ROAR!"}</div>
    </div>
    <div ref={refs.ninja} className='av-ent av-ninja' style={{ width: 120 }}>
      <div ref={refs.ninjaFlip} className='av-flip'><Ninja /><div className='av-pmedal'><Medal badge /></div></div>
    </div>
    {Array.from({ length: 14 }, (_, i) => <i key={i} className='av-bub' />)}
  </>
));
