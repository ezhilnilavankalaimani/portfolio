import React, { useEffect, useState } from 'react';

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
.wc .wc-fx{position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.85}
.wc .wc-fx.rain{background-image:repeating-linear-gradient(105deg,transparent 0 15px,rgba(70,110,170,.38) 15px 16px);background-size:44px 44px;animation:wc-rain .55s linear infinite}
.wc .night .wc-fx.rain{background-image:repeating-linear-gradient(105deg,transparent 0 15px,rgba(160,190,255,.35) 15px 16px)}
.wc .wc-fx.snow{background-image:radial-gradient(circle,#fff 1.6px,transparent 2.4px),radial-gradient(circle,#fff 1.2px,transparent 2px);background-size:56px 56px,86px 86px;background-position:0 0,20px 30px;animation:wc-snow 6s linear infinite;opacity:.55}
.wc .wc-fx.cloud{background:radial-gradient(60px 26px at 20% 22%,rgba(255,255,255,.75),transparent 70%),radial-gradient(80px 30px at 78% 16%,rgba(255,255,255,.6),transparent 70%);animation:wc-drift 14s ease-in-out infinite alternate}
.wc .night .wc-fx.cloud{background:radial-gradient(60px 26px at 20% 22%,rgba(255,255,255,.12),transparent 70%),radial-gradient(80px 30px at 78% 16%,rgba(255,255,255,.1),transparent 70%)}
.wc .wc-fx.sun{background:radial-gradient(70px 70px at 88% 12%,rgba(255,200,60,.55),transparent 70%)}
.wc .wc-fx.moon{background:radial-gradient(40px 40px at 88% 14%,rgba(255,255,255,.55),transparent 70%),radial-gradient(circle,#fff 1px,transparent 1.6px);background-size:auto,64px 64px;opacity:.7}
.wc .wc-fx.fog{background:linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,0) 60%)}
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
const WX = (c) => (c === 0 ? 'clear' : c <= 3 ? 'cloud' : c === 45 || c === 48 ? 'fog' : (c >= 51 && c <= 67) || (c >= 80 && c <= 82) ? 'rain' : (c >= 71 && c <= 77) || c === 85 || c === 86 ? 'snow' : c >= 95 ? 'rain' : 'cloud');
const WLABEL = { clear: 'Clear', cloud: 'Cloudy', fog: 'Foggy', rain: 'Rain', snow: 'Snow' };
const phase = (h) => (h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'dusk' : 'night');
const GRAD = {
  dawn: ['#ffe2cf', '#fff6ea'], day: ['#dcefff', '#f7fbff'], dusk: ['#ffd7c0', '#ffeff6'], night: ['#0f1b3d', '#27386b'],
};
const bgFor = (ph, wx) => {
  let [a, b] = GRAD[ph];
  if (ph !== 'night' && (wx === 'rain' || wx === 'cloud' || wx === 'fog')) { a = '#d5dee9'; b = '#eef2f7'; }
  if (ph !== 'night' && wx === 'snow') { a = '#e3edf8'; b = '#f8fbff'; }
  if (ph === 'night' && wx === 'rain') { a = '#141b2e'; b = '#27324f'; }
  if (ph === 'night' && wx === 'snow') { a = '#1b2742'; b = '#38507f'; }
  return `linear-gradient(160deg, ${a}c9, ${b}99)`;
};
const fxFor = (ph, wx) => (wx === 'rain' ? 'rain' : wx === 'snow' ? 'snow' : wx === 'cloud' ? 'cloud' : wx === 'fog' ? 'fog' : ph === 'night' ? 'moon' : 'sun');
const useWeather = (lat, lon) => {
  const [w, setW] = useState(null);
  useEffect(() => {
    let dead = false;
    const go = () => {
      if (typeof fetch === 'undefined') return;
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
        .then((r) => r.json())
        .then((j) => { if (!dead && j && j.current) setW({ wx: WX(j.current.weather_code), t: Math.round(j.current.temperature_2m) }); })
        .catch(() => {});
    };
    go();
    const id = setInterval(go, 15 * 60 * 1000);
    return () => { dead = true; clearInterval(id); };
  }, [lat, lon]);
  return w;
};
const Box = ({ lab, tz, city, now, w, role, roleCls, extra }) => {
  const ph = phase(hr(tz, now));
  const wx = w ? w.wx : 'clear';
  return (
    <div className={`wc-big${ph === 'night' ? ' night' : ''}`} style={{ '--bg': bgFor(ph, wx) }}>
      <i className={`wc-fx ${fxFor(ph, wx)}`} />
      <span className='wc-lab'>{lab}</span>
      <span className='wc-tm'>{fmt(tz, now)}</span>
      <span className='wc-sub'><span>{icon(hr(tz, now))}</span> {city} · {day(tz, now)}</span>
      <span className='wc-wx'>{w ? `${WLABEL[w.wx]} · ${w.t}°C` : '\u00a0'}</span>
      <span className={`wc-role ${roleCls}`}>{role}</span>
      {extra}
    </div>
  );
};
const icon = (h) => (h >= 6 && h < 18 ? '☀️' : '🌙');

const ApWorldClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const wi = useWeather(13.08, 80.27);
  const wc = useWeather(43.65, -79.38);
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
