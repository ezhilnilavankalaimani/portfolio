import React, { useEffect, useRef, useState } from 'react';
import { createWx } from './wxfx';

// India on the left, USA on the right, like they sit on the world map, with the time in each right now.
const CSS = `
.wc{max-width:980px;margin:36px auto 0;text-align:center;font-family:inherit}
.wc .wc-hd{font-size:13px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#6e6e73}
.wc .wc-hl{font-size:clamp(20px,3vw,28px);font-weight:700;letter-spacing:-.02em;color:#1d1d1f;margin:4px 0 18px}
.wc .wc-main{position:relative;display:grid;grid-template-columns:1fr minmax(64px,.5fr) 1fr minmax(64px,.5fr) 1fr;align-items:stretch;gap:20px}
.wc .wc-main::before{content:'';position:absolute;inset:-30px -10px;z-index:0;pointer-events:none;background:radial-gradient(180px 140px at 12% 40%,rgba(255,153,0,.28),transparent 70%),radial-gradient(220px 160px at 50% 60%,rgba(0,113,227,.26),transparent 70%),radial-gradient(180px 140px at 88% 40%,rgba(0,206,168,.24),transparent 70%)}
.wc .wc-main>*{position:relative;z-index:1}
.wc .wc-big{position:relative;overflow:hidden;isolation:isolate;-webkit-backdrop-filter:blur(22px) saturate(180%);backdrop-filter:blur(22px) saturate(180%);border:1px solid rgba(255,255,255,.7);box-shadow:inset 0 1px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(255,255,255,.3),0 14px 34px rgba(20,40,90,.13);border-radius:28px;background:var(--bg,rgba(255,255,255,.5));padding:22px 16px;transition:background .6s;display:flex;flex-direction:column;align-items:center;gap:4px}

.wc .wc-lab{font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6e6e73}
.wc .wc-tm{font-size:clamp(26px,4.6vw,40px);font-weight:700;letter-spacing:-.03em;color:#1d1d1f;white-space:nowrap;font-variant-numeric:tabular-nums;line-height:1.1}
.wc .wc-sub{font-size:13px;color:#6e6e73}
.wc .wc-role{margin-top:8px;font-size:13px;font-weight:600;border-radius:99px;padding:5px 12px}
.wc .wc-role.wc-was{background:#fff4e0;color:#a35a00}
.wc .wc-role.wc-cur{background:#e3f6ea;color:#127a3a}
.wc .wc-mid{display:flex;flex-direction:column;align-items:center;justify-content:center}
.wc .wc-mid svg{width:100%;height:56px;overflow:visible;display:block}
.wc .wc-diff{font-size:12px;color:#6e6e73;margin-top:2px}

.wc .wc-lock{-webkit-backdrop-filter:blur(18px) saturate(160%);backdrop-filter:blur(18px) saturate(160%);border:1.5px dashed rgba(142,142,147,.55);border-radius:28px;background:rgba(245,245,247,.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.9);padding:20px 16px;display:flex;flex-direction:column;align-items:center;gap:4px}
.wc .wc-lock svg{width:34px;height:34px;color:#8e8e93;margin-bottom:2px}
.wc .wc-lock .wc-tm{color:#aeaeb2;filter:blur(5px);user-select:none}
.wc .wc-role.soon{background:#e8e8ed;color:#6e6e73}
.wc .wc-lk{stroke:#c7c7cc!important;animation:none!important}

.wc .wc-big>*:not(.wc-fx){position:relative;z-index:1}
.wc .wc-big::after{content:'';position:absolute;inset:0;z-index:0;border-radius:inherit;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.55) 0%,rgba(255,255,255,0) 38%),linear-gradient(315deg,rgba(255,255,255,.18),transparent 30%)}
.wc .wc-big.night{border-color:rgba(255,255,255,.22);box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -1px 0 rgba(255,255,255,.08),0 14px 34px rgba(10,20,60,.35)}
.wc .wc-big.night::after{background:linear-gradient(135deg,rgba(255,255,255,.22) 0%,rgba(255,255,255,0) 38%)}
.wc .wc-big.night .wc-lab,.wc .wc-big.night .wc-sub,.wc .wc-big.night .wc-wx{color:#b8c3e6}
.wc .wc-big.night .wc-tm{color:#fff}
.wc .wc-wx{font-size:12px;color:#6e6e73;display:flex;align-items:center;gap:6px;min-height:16px}
.wc .wc-fx{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;border-radius:inherit}
@keyframes wc-rain{to{background-position:-14px 44px}}
@keyframes wc-snow{to{background-position:14px 56px,34px 116px}}
@keyframes wc-drift{to{transform:translateX(14px)}}
@keyframes wc-dash{to{stroke-dashoffset:-24}}
.wc .wc-arc{animation:wc-dash 2.4s linear infinite}
@media(prefers-reduced-motion:reduce){.wc .wc-arc{animation:none}}
@media(max-width:760px){.wc .wc-main{grid-template-columns:1fr 1fr;gap:14px}.wc .wc-mid{display:none}.wc .wc-lock{grid-column:1 / -1}.wc .wc-big{padding:16px 8px}}
`;
const fmt = (tz, now) => new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(now);
const day = (tz, now) => new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(now);
const hr = (tz, now) => Number(new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).format(now)) % 24;
const offsetMin = (tz, now) => {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(now).reduce((o, x) => { o[x.type] = x.value; return o; }, {});
  return (Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - now.getTime()) / 60000;
};
// Open-Meteo weather codes -> a scene kind, an intensity and a plain-English label.
const WX = (c) => {
  if (c === 0) return { k: 'clear', i: 0, label: 'Clear' };
  if (c === 1) return { k: 'clear', i: 0, label: 'Mostly clear' };
  if (c === 2) return { k: 'partly', i: 0, label: 'Partly cloudy' };
  if (c === 3) return { k: 'cloud', i: 0, label: 'Overcast' };
  if (c === 45 || c === 48) return { k: 'fog', i: 0.8, label: 'Foggy' };
  if (c === 51) return { k: 'drizzle', i: 0.4, label: 'Light drizzle' };
  if (c === 53) return { k: 'drizzle', i: 0.6, label: 'Drizzle' };
  if (c === 55 || c === 56 || c === 57) return { k: 'drizzle', i: 0.85, label: 'Heavy drizzle' };
  if (c === 61 || c === 80) return { k: 'rain', i: 0.5, label: 'Light rain' };
  if (c === 63 || c === 81 || c === 66) return { k: 'rain', i: 0.85, label: 'Rain' };
  if (c === 65 || c === 82 || c === 67) return { k: 'rain', i: 1.25, label: 'Heavy rain' };
  if (c === 71 || c === 77 || c === 85) return { k: 'snow', i: 0.55, label: 'Light snow' };
  if (c === 73) return { k: 'snow', i: 0.9, label: 'Snow' };
  if (c === 75 || c === 86) return { k: 'snow', i: 1.3, label: 'Heavy snow' };
  if (c >= 95) return { k: 'storm', i: 1.2, label: 'Thunderstorm' };
  return { k: 'cloud', i: 0, label: 'Cloudy' };
};
const EMOJI = { clear: null, partly: '⛅', cloud: '☁️', fog: '🌫️', drizzle: '🌦️', rain: '🌧️', storm: '⛈️', snow: '🌨️' };
const DEMO = (() => {
  try { const q = new URLSearchParams(window.location.search).get('wx'); return q ? q.split(',') : null; } catch (e) { return null; }
})();
const DEMO_MAP = { clear: 0, partly: 2, cloud: 3, fog: 45, drizzle: 53, rain: 63, heavyrain: 65, storm: 95, snow: 73 };
const phase = (h) => (h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'dusk' : 'night');
const GRAD = {
  dawn: ['#ffe2cf', '#fff6ea'], day: ['#dcefff', '#f7fbff'], dusk: ['#ffd7c0', '#ffeff6'], night: ['#0f1b3d', '#27386b'],
};
const bgFor = (ph, k) => {
  let [a, b] = GRAD[ph];
  if (ph !== 'night') {
    if (k === 'partly') { a = '#cfe5fb'; b = '#f2f8ff'; }
    if (k === 'cloud' || k === 'fog' || k === 'drizzle') { a = '#cdd6e2'; b = '#e9eef4'; }
    if (k === 'rain') { a = '#b9c4d3'; b = '#dde4ec'; }
    if (k === 'storm') { a = '#8f9bb0'; b = '#c1c9d6'; }
    if (k === 'snow') { a = '#dde8f5'; b = '#f6faff'; }
  } else {
    if (k === 'cloud' || k === 'fog' || k === 'drizzle' || k === 'partly') { a = '#1a2440'; b = '#2e3b62'; }
    if (k === 'rain') { a = '#121a2c'; b = '#243049'; }
    if (k === 'storm') { a = '#0b101d'; b = '#1e283f'; }
    if (k === 'snow') { a = '#1b2742'; b = '#38507f'; }
  }
  return `linear-gradient(160deg, ${a}c9, ${b}99)`;
};
const useWeather = (lat, lon, slot) => {
  const [w, setW] = useState(null);
  useEffect(() => {
    let dead = false;
    if (DEMO && DEMO[slot]) {
      const code = DEMO_MAP[DEMO[slot]] ?? 0;
      setW({ ...WX(code), t: 12, wind: DEMO[slot] === 'storm' ? 30 : 12 });
      return undefined;
    }
    const go = () => {
      if (typeof fetch === 'undefined') return;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m`)
        .then((r) => r.json())
        .then((j) => { if (!dead && j && j.current) setW({ ...WX(j.current.weather_code), t: Math.round(j.current.temperature_2m), wind: j.current.wind_speed_10m || 0 }); })
        .catch(() => {});
    };
    go();
    const id = setInterval(go, 15 * 60 * 1000);
    return () => { dead = true; clearInterval(id); };
  }, [lat, lon, slot]);
  return w;
};
// Draws the live weather behind a card.
const Sky = ({ kind, i, night, wind, phase: ph }) => {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return undefined;
    const fx = createWx(cv, { kind, i, night, wind, phase: ph });
    fx.start();
    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? fx.resume() : fx.stop())));
      io.observe(cv);
    }
    const onVis = () => (document.hidden ? fx.stop() : fx.resume());
    document.addEventListener('visibilitychange', onVis);
    let t = 0;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => fx.resize(), 150); };
    window.addEventListener('resize', onResize);
    return () => { fx.stop(); if (io) io.disconnect(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [kind, i, night, wind, ph]);
  return <canvas ref={ref} className='wc-fx' aria-hidden='true' />;
};
const Box = ({ lab, tz, city, now, w, role, roleCls, extra }) => {
  const h = hr(tz, now);
  const ph = phase(h);
  const k = w ? w.k : 'clear';
  const night = ph === 'night';
  const emoji = (w && EMOJI[k]) || icon(h);
  return (
    <div className={`wc-big${night ? ' night' : ''}`} style={{ '--bg': bgFor(ph, k) }}>
      <Sky kind={k} i={w ? w.i : 0} night={night} wind={w ? w.wind : 0} phase={ph} />
      <span className='wc-lab'>{lab}</span>
      <span className='wc-tm'>{fmt(tz, now)}</span>
      <span className='wc-sub'><span>{emoji}</span> {city} · {day(tz, now)}</span>
      <span className='wc-wx'>{w ? `${w.label} · ${w.t}°C` : '\u00a0'}</span>
      <span className={`wc-role ${roleCls}`}>{role}</span>
      {extra}
    </div>
  );
};
const icon = (h) => (h >= 6 && h < 18 ? '☀️' : '🌙');

const ApWorldClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const wi = useWeather(13.08, 80.27, 0);
  const wc = useWeather(43.65, -79.38, 1);
  const IN = 'Asia/Kolkata';
  const CA = 'America/Toronto';
  const d = offsetMin(IN, now) - offsetMin(CA, now);
  const h = Math.floor(d / 60), m = Math.round(d % 60);
  return (
    <div className='wc reveal' role='group' aria-label='Current time around the world'>
      <style>{CSS}</style>
      <div className='wc-hd'>Right now</div>
      <div className='wc-hl'>Where I was, where I am, and what's next.</div>
      <div className='wc-main'>
        <Box lab='India' tz={IN} city='Chennai' now={now} w={wi} role='Was an Automation Analyst at Amazon' roleCls='wc-was' />
        <div className='wc-mid' aria-hidden='true'>
          <svg viewBox='0 0 200 56' preserveAspectRatio='none'>
            <path className='wc-arc' d='M6 46 Q100 -14 194 46' fill='none' stroke='#0071e3' strokeWidth='2' strokeLinecap='round' strokeDasharray='4 8' />
            <circle cx='6' cy='46' r='5' fill='#ff9900' /><circle cx='194' cy='46' r='5' fill='#00cea8' />
          </svg>
          <div className='wc-diff'>{h}h {m ? `${m}m ` : ''}apart</div>
        </div>
        <Box lab='Canada' tz={CA} city='Toronto' now={now} w={wc} role='Now at TD, Toronto' roleCls='wc-cur' />
        <div className='wc-mid' aria-hidden='true'>
          <svg viewBox='0 0 200 56' preserveAspectRatio='none'>
            <path className='wc-lk' d='M6 46 Q100 -14 194 46' fill='none' strokeWidth='2' strokeLinecap='round' strokeDasharray='4 8' />
            <circle cx='6' cy='46' r='5' fill='#00cea8' /><circle cx='194' cy='46' r='5' fill='#c7c7cc' />
          </svg>
          <div className='wc-diff'>next</div>
        </div>
        <div className='wc-lock' aria-label='Locked until my new job'>
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'><rect x='4.5' y='10.5' width='15' height='10' rx='2.5' /><path d='M8 10.5V8a4 4 0 0 1 8 0v2.5' /><circle cx='12' cy='15.5' r='1.2' fill='currentColor' /></svg>
          <span className='wc-lab'>Next chapter</span>
          <span className='wc-tm' aria-hidden='true'>00:00 AM</span>
          <span className='wc-sub'>Locked</span>
          <span className='wc-role soon'>Unlocks after my new job</span>
        </div>
      </div>
    </div>
  );
};

export default ApWorldClock;
