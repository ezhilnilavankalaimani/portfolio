import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { education, experiences } from "../constants";
import { CERTS, LINKS, PROJECTS, SKILLS, STAGES } from "../game/data";
import { Elephant, Peacock, Tiger } from "../game/characters";
import { isSoundOn, setSound, sfx } from "./audio";
import { Engine, GROUND, ITEMS, LEVELS, POOL, SKILL_COUNT, VH, VW, WORLD_W } from "./engine";
import { Poster, POSTER_THEMES, posterToPng } from "./poster";
import { validateName } from "./names";
import emailjs from "@emailjs/browser";
import { Entities, FarLayer, FgLayer, MidLayer, RESUME_URL, WorldContent } from "./world";
import "../game/game.css";
import "./adventure.css";

const SAVE_KEY = "advSave.v2";
const BUDDY_KEY = "advBuddy";
const CTL_KEY = "advControls";
const loadCtl = () => { try { return localStorage.getItem(CTL_KEY) === "buttons" ? "buttons" : "gesture"; } catch (e) { return "gesture"; } };
const BUD = { tiger: { n: "Tiger", e: "🐯" }, elephant: { n: "Elephant", e: "🐘" }, peacock: { n: "Peacock", e: "🦚" } };
const loadBuddy = () => { try { const b = localStorage.getItem(BUDDY_KEY); return b === "elephant" || b === "tiger" || b === "peacock" ? b : null; } catch (e) { return null; } };
// EmailJS: the first template is the existing contact-form one (mail to Ezhil); the second is the new "course clear" poster mail to the visitor.
const EJ = { service: "service_3yf8wil", owner: "template_p3qaifo", visitor: "template_olacjjo", key: "pmZPRYuPINkDLOE3c" };

const ACHIEVEMENTS = [
  { id: "first", icon: "👟", name: "First Adventure", desc: "Take your first steps." },
  { id: "hurdler", icon: "🏃", name: "Hurdler", desc: "Jump over 5 hurdles." },
  { id: "edu", icon: "🎓", name: "Education Champion", desc: "Visit the Education level." },
  { id: "career", icon: "💼", name: "Career Explorer", desc: "Visit Amazon, Walmart · Kelly and TD." },
  { id: "cheque", icon: "🧾", name: "Cheque Master", desc: "Collect all 5 cheques at TD." },
  { id: "roof", icon: "🪜", name: "Roof Climber", desc: "Climb the ladder to the control room." },
  { id: "sky", icon: "🎈", name: "Sky Pilot", desc: "Fly the hot-air balloon." },
  { id: "rider", icon: "🐯", name: "Buddy Rider", desc: "Ride your tiger, elephant or peacock." },
  { id: "ocean", icon: "🌊", name: "Ocean Explorer", desc: "Reach the seabed." },
  { id: "skills", icon: "🐟", name: "Skills Explorer", desc: "Catch all 12 skills." },
  { id: "projects", icon: "🧰", name: "Project Hunter", desc: "Open all 5 project chests." },
  { id: "finish", icon: "🏁", name: "Adventure Complete", desc: "Slide down the flagpole and enter the castle." },
  { id: "star", icon: "🌟", name: "Star Award", desc: "Receive the Q2 2026 Star Award from the Master Ninja." },
  { id: "collector", icon: "🏆", name: "Achievement Collector", desc: "Unlock 6 achievements." },
];

const loadSave = () => {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
  } catch (e) {
    return null;
  }
};
const writeSave = (s) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch (e) {
    /* storage unavailable */
  }
};

function usePortrait() {
  const [p, setP] = useState(false);
  useEffect(() => {
    const f = () => setP(window.innerWidth < 700 && window.innerHeight > window.innerWidth);
    f();
    window.addEventListener("resize", f);
    window.addEventListener("orientationchange", f);
    return () => { window.removeEventListener("resize", f); window.removeEventListener("orientationchange", f); };
  }, []);
  return p;
}

function useFit() {
  const [s, setS] = useState(1);
  useEffect(() => {
    const f = () => setS(Math.min(window.innerWidth / VW, window.innerHeight / VH));
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return s;
}

/* ---------------------------------------------------------------- */
/* overlays                                                          */
/* ---------------------------------------------------------------- */

const Overlay = ({ title, onClose, children, wide }) => (
  <div className='av-overlay' onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className={`av-panel ${wide ? "wide" : ""}`} role='dialog' aria-label={title}>
      <button className='av-x' onClick={onClose} aria-label='Close'>✕</button>
      <h2>{title}</h2>
      {children}
    </div>
  </div>
);

const Minimap = ({ engine, visited, onOpen }) => {
  const dot = useRef(null);
  const pct = (x) => `${(x / WORLD_W) * 100}%`;
  useEffect(() => {
    let raf;
    const loop = () => {
      const e = engine.current;
      if (e && dot.current) {
        const px = Math.max(0, Math.min(1, e.p.x / WORLD_W));
        dot.current.style.left = `${px * 100}%`;
        dot.current.style.transform = `translate(-50%,-50%) rotate(${e.p.vx < -5 ? 180 : 0}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [engine]);
  return (
    <button className='av-mini' onClick={onOpen} title='Open world map' aria-label='Open world map'>
      <span className='av-mini-zone sea' style={{ left: pct(POOL.x0), width: pct(POOL.x1 - POOL.x0) }} />
      <span className='av-mini-zone rain' style={{ left: pct(4320), width: pct(1440) }} />
      <span className='av-mini-road' />
      {LEVELS.map((l, i) => (
        <span key={l.id} className={`av-mini-blip ${visited.includes(i) ? "seen" : ""}`} style={{ left: pct(l.x + 400) }}>{i === 0 ? "★" : l.n}</span>
      ))}
      <span className='av-mini-blip flag' style={{ left: pct(17040) }}>🏁</span>
      <span className='av-mini-me' ref={dot}>▶</span>
    </button>
  );
};

const MAP_NODES = [
  { x: 95, y: 455, ico: "🏡" }, { x: 215, y: 350, ico: "✈️" }, { x: 135, y: 215, ico: "🎓" },
  { x: 290, y: 120, ico: "📦" }, { x: 420, y: 215, ico: "🛒" }, { x: 380, y: 355, ico: "🏦" },
  { x: 520, y: 450, ico: "⭐" }, { x: 640, y: 340, ico: "🐠" }, { x: 740, y: 215, ico: "🚀" },
  { x: 840, y: 330, ico: "💬" }, { x: 880, y: 450, ico: "📮" },
];
const TREES = [[40,330],[60,260],[30,140],[170,70],[230,200],[250,270],[330,60],[350,150],[470,110],[500,290],[300,440],[280,510],[430,520],[580,520],[470,360],[590,230],[560,110],[680,110],[700,450],[760,420],[800,230],[930,250],[950,380],[780,520],[860,540],[130,520],[40,520],[330,300],[190,140],[610,430]];

const MapOverlay = ({ onClose, onGo, onRecruiter, onRestart, visited, level }) => {
  const path = MAP_NODES.map((n, i) => `${i ? "L" : "M"}${n.x} ${n.y}`).join(" ");
  const smooth = MAP_NODES.reduce((d, n, i, arr) => {
    if (!i) return `M${n.x} ${n.y}`;
    const p = arr[i - 1];
    return `${d} Q${p.x + (n.x - p.x) * 0.2} ${p.y + (n.y - p.y) * 0.9} ${(p.x + n.x) / 2} ${(p.y + n.y) / 2} T${n.x} ${n.y}`;
  }, "");
  void path;
  return (
    <Overlay title='🗺 The Enchanted Forest' onClose={onClose} wide>
      <p className='av-lead'>Tap a place to run straight there. A new forest opens when I land my next job!</p>
      <div className='av-gtamap'>
        <svg viewBox='0 0 1000 580' role='img' aria-label='Forest adventure map'>
          <defs>
            <radialGradient id='mgGrass' cx='45%' cy='50%' r='75%'><stop offset='0' stopColor='#9ed36a' /><stop offset='1' stopColor='#5aa04a' /></radialGradient>
            <pattern id='mgGrid' width='40' height='40' patternUnits='userSpaceOnUse'><path d='M40 0H0V40' fill='none' stroke='#ffffff' strokeOpacity='.12' /></pattern>
            <filter id='mgBlur'><feGaussianBlur stdDeviation='6' /></filter>
          </defs>
          <rect width='1000' height='580' fill='#7cc4e8' />
          <path d='M20 60 Q60 10 200 30 Q330 5 430 50 Q520 15 640 40 Q780 5 880 60 Q985 110 975 250 Q990 400 940 500 Q880 575 700 560 Q540 580 380 560 Q200 580 90 530 Q10 470 25 330 Q5 180 20 60Z' fill='url(#mgGrass)' stroke='#2f6b3a' strokeWidth='6' />
          <rect width='1000' height='580' fill='url(#mgGrid)' />
          {/* India -> Canada sea bay */}
          <path d='M0 255 Q90 245 160 285 Q190 335 160 395 Q90 415 0 400Z' fill='#5fb6e6' stroke='#2b8cc0' strokeWidth='3' />
          {/* lake for skills */}
          <ellipse cx='640' cy='345' rx='95' ry='62' fill='#4fb3e8' stroke='#2b8cc0' strokeWidth='4' />
          <path d='M600 335q15-10 30 0M650 360q15-10 30 0' stroke='#fff' strokeOpacity='.7' strokeWidth='3' fill='none' strokeLinecap='round' />
          {/* mountains */}
          {[[560, 120], [610, 135], [585, 95]].map(([x, y], i) => <path key={i} d={`M${x - 38} ${y + 28}L${x} ${y - 20}L${x + 38} ${y + 28}Z`} fill='#8d9a8f' stroke='#5c6b5f' strokeWidth='3' />)}
          {TREES.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect x='-3' y='8' width='6' height='12' fill='#7a4e2a' />
              <path d='M0 -22L16 10H-16Z' fill={i % 3 ? "#2f8a4a" : "#3aa05a"} stroke='#1f5e33' strokeWidth='2' />
              <path d='M0 -34L12 -8H-12Z' fill={i % 3 ? "#38985a" : "#46b36a"} stroke='#1f5e33' strokeWidth='2' />
            </g>
          ))}
          {/* trail */}
          <path d={smooth} fill='none' stroke='#fff3c4' strokeWidth='12' strokeLinecap='round' strokeLinejoin='round' opacity='.95' />
          <path d={smooth} fill='none' stroke='#c58a3c' strokeWidth='4' strokeDasharray='2 12' strokeLinecap='round' />
          {/* locked next forest */}
          <g>
            <rect x='735' y='40' width='235' height='120' rx='22' fill='#cfd6d8' stroke='#8d999c' strokeWidth='4' strokeDasharray='10 8' opacity='.97' />
            <circle cx='790' cy='72' r='30' fill='#fff' opacity='.7' filter='url(#mgBlur)' /><circle cx='930' cy='130' r='34' fill='#fff' opacity='.7' filter='url(#mgBlur)' />
            <text x='852' y='88' textAnchor='middle' fontSize='34'>🔒</text>
            <text x='852' y='114' textAnchor='middle' fontSize='15' fontWeight='800' fill='#4a5559'>NEXT FOREST</text>
            <text x='852' y='136' textAnchor='middle' fontSize='12' fill='#4a5559'>Unlocks with my next job 🎉</text>
          </g>
          {/* castle / finish */}
          <text x='945' y='500' textAnchor='middle' fontSize='34'>🏰</text>
          <text x='945' y='525' textAnchor='middle' fontSize='11' fontWeight='800' fill='#14532d'>FINISH</text>
          {MAP_NODES.map((n, i) => {
            const l = LEVELS[i];
            const seen = visited.includes(i);
            const here = level === i;
            return (
              <g key={l.id} className={`mg-node ${seen ? "seen" : ""} ${here ? "here" : ""}`} transform={`translate(${n.x} ${n.y})`} onClick={() => onGo(i)} tabIndex={0} role='button' aria-label={l.name} onKeyDown={(e) => e.key === "Enter" && onGo(i)}>
                {here && <circle r='34' className='mg-pulse' />}
                <circle r='24' className='mg-dot' />
                <text y='8' textAnchor='middle' fontSize='22'>{n.ico}</text>
                <g transform='translate(0 44)'>
                  <rect x='-62' y='-14' width='124' height='24' rx='12' fill='#0c3b24' opacity='.9' />
                  <text y='3' textAnchor='middle' fontSize='11.5' fontWeight='800' fill='#fff'>{i === 0 ? "START" : `${l.n}`} · {l.name.replace("Experience · ", "").replace(" · Underwater", "").slice(0, 16)}</text>
                </g>
                {here && <text y='-34' textAnchor='middle' fontSize='24'>🥷</text>}
              </g>
            );
          })}
          <g transform='translate(18 18)'>
            <rect width='150' height='76' rx='12' fill='#fffbe6' stroke='#0c3b24' strokeWidth='3' />
            <text x='12' y='22' fontSize='12' fontWeight='800' fill='#14532d'>LEGEND</text>
            <circle cx='20' cy='38' r='6' fill='#f7b32b' stroke='#14532d' strokeWidth='2' /><text x='34' y='42' fontSize='11' fill='#14532d'>visited</text>
            <circle cx='20' cy='58' r='6' fill='#fff' stroke='#14532d' strokeWidth='2' /><text x='34' y='62' fontSize='11' fill='#14532d'>not yet</text>
            <text x='96' y='42' fontSize='14'>🥷</text><text x='114' y='42' fontSize='11' fill='#14532d'>you</text>
          </g>
        </svg>
      </div>
      <div className='av-row'>
        <button className='av-btn' onClick={onRecruiter}>📋 Recruiter mode</button>
        <button className='av-btn ghost' onClick={onRestart}>↺ Restart adventure</button>
      </div>
    </Overlay>
  );
};

const AchOverlay = ({ onClose, unlocked }) => (
  <Overlay title={`Achievements · ${unlocked.length} / ${ACHIEVEMENTS.length}`} onClose={onClose}>
    <div className='av-achgrid'>
      {ACHIEVEMENTS.map((a) => (
        <div key={a.id} className={`av-ach ${unlocked.includes(a.id) ? "on" : ""}`}>
          <span>{unlocked.includes(a.id) ? a.icon : "🔒"}</span>
          <div><b>{a.name}</b><small>{a.desc}</small></div>
        </div>
      ))}
    </div>
  </Overlay>
);

const CONFETTI = Array.from({ length: 46 }, (_, i) => ({ l: (i * 37) % 100, d: (i % 9) * 0.35, c: ["#f7b32b", "#d9382f", "#2f8a57", "#6cf", "#ff6f91"][i % 5], s: 6 + (i % 4) * 3 }));

const BuddyOverlay = ({ current, onPick, touch, ctl, onCtl }) => (
  <div className='av-overlay'>
    <div className='av-card av-buddy'>
      <h2>Pick your buddy</h2>
      <p className='av-lead'>Who should follow you and carry you through the adventure?</p>
      <div className='av-buddies'>
        <button className={current === "tiger" ? "on" : ""} onClick={() => onPick("tiger")}>
          <Tiger style={{ width: 190 }} /><b>🐯 Tiger</b><span>Fast and fierce. Roars!</span>
        </button>
        <button className={current === "elephant" ? "on" : ""} onClick={() => onPick("elephant")}>
          <Elephant style={{ width: 160 }} /><b>🐘 Elephant</b><span>Big, gentle and strong. Trumpets!</span>
        </button>
        <button className={current === "peacock" ? "on" : ""} onClick={() => onPick("peacock")}>
          <Peacock style={{ width: 160 }} /><b>🦚 Peacock</b><span>Colourful! Lets you fly when you hop on.</span>
        </button>
      </div>
      {touch && (
        <>
          <h3 className='av-ctltitle'>How do you want to control the ninja?</h3>
          <div className='av-ctls'>
            <button className={ctl === "gesture" ? "on" : ""} onClick={() => onCtl("gesture")}><b>👆 Motion</b><span>Hold the left or right side to run, slide up to jump</span></button>
            <button className={ctl === "buttons" ? "on" : ""} onClick={() => onCtl("buttons")}><b>🎮 Buttons</b><span>On-screen ◀ ▶ and jump buttons</span></button>
          </div>
        </>
      )}
      <p className='av-lead small'>You can change these any time with the buttons at the top.</p>
    </div>
  </div>
);

const RestartOverlay = ({ onYes, onNo }) => (
  <div className='av-overlay' onMouseDown={(e) => e.target === e.currentTarget && onNo()}>
    <div className='av-card av-buddy'>
      <h2>Restart the adventure?</h2>
      <p className='av-lead'>You will go back to the start. Coins, skills and achievements are cleared.</p>
      <div className='av-row'>
        <button className='av-btn' onClick={onYes}>↻ Yes, start over</button>
        <button className='av-btn ghost' onClick={onNo}>Keep playing</button>
      </div>
    </div>
  </div>
);

const THANKS = [
  ["Thank you", "English"], ["Gracias", "Español"], ["Merci", "Français"], ["Danke", "Deutsch"], ["Grazie", "Italiano"], ["Obrigado", "Português"],
  ["ありがとう", "日本語"], ["谢谢", "中文"], ["감사합니다", "한국어"], ["شكراً", "العربية"], ["Спасибо", "Русский"], ["നന്ദി", "മലയാളം"],
  ["ధన్యవాదాలు", "తెలుగు"], ["ಧನ್ಯವಾದಗಳು", "ಕನ್ನಡ"], ["Salamat", "Filipino"], ["Asante", "Kiswahili"], ["Teşekkürler", "Türkçe"], ["Dank je", "Nederlands"], ["Ευχαριστώ", "Ελληνικά"],
];
const ThanksBanner = () => {
  const [i, setI] = useState(-1); // -1 = Tamil
  useEffect(() => {
    let t;
    const next = (k) => {
      const nk = (k + 1) % THANKS.length;
      t = setTimeout(() => { setI(nk); next(nk); }, 2000);
    };
    t = setTimeout(() => { setI(0); next(0); }, 10000);
    return () => clearTimeout(t);
  }, []);
  const tamil = i < 0;
  return (
    <div className='av-thanks' aria-live='polite'>
      <div key={i} className='av-thanks-in'>
        <b>{tamil ? "நன்றி · Nandri" : THANKS[i][0]}</b>
        <small>{tamil ? "Tamil · Thank you" : THANKS[i][1]}</small>
      </div>
    </div>
  );
};

const EndOverlay = ({ score, coins, skills, achs, onClose, onAgain, onFormal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState("japan");
  const check = useMemo(() => (name.trim() ? validateName(name) : { ok: false, reason: "" }), [name]);
  const posterRef = useRef(null);
  const date = useMemo(() => new Date().toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" }), []);

  const download = async () => {
    if (!name.trim()) { setStatus("Type your name first, then download."); return; }
    if (!check.ok) { setStatus(check.reason); return; }
    try {
      const url = await posterToPng(posterRef.current.querySelector("svg"));
      const a = document.createElement("a");
      a.href = url; a.download = `Ninja-Award-${theme}.png`; a.click();
    } catch (e) { setStatus("Could not make the image. Try a screenshot instead."); }
  };
  const send = async (e) => {
    e.preventDefault();
    const v = validateName(name);
    if (!v.ok) { setStatus(v.reason); return; }
    setBusy(true); setStatus("Sending your poster…");
    let ownerErr = "";
    const common = { score, coins, skills, achievements: achs, poster_url: `${window.location.origin}/posters/course-clear-${theme}.png`, theme, date };
    try {
      // tell Ezhil (existing template)
      await emailjs.send(EJ.service, EJ.owner, { from_name: v.clean, to_name: "Ezhil Nilavan Kalaimani", from_email: email, to_email: "iamezhilnilavan@gmail.com", message: `🎉 ${v.clean} (${email}) cleared the course! Score ${score}, ${coins} coins, ${skills}/12 skills, ${achs}/13 achievements. email is ${email}` }, EJ.key);
    } catch (err) { console.error(err); ownerErr = (err && (err.text || err.message)) || String(err); }
    try {
      await emailjs.send(EJ.service, EJ.visitor, { ...common, to_name: v.clean, to_email: email, reply_to: "iamezhilnilavan@gmail.com" }, EJ.key);
      setStatus("📬 Sent! Check your inbox (and spam) for your Ninja Award poster.");
    } catch (err) {
      console.error(err);
      const why = (err && (err.text || err.message)) || String(err);
      setStatus(`Could not mail the poster (${err && err.status ? err.status + ": " : ""}${why}). You can download it instead.${ownerErr ? "" : " Ezhil has been told you finished!"}`);
    }
    setBusy(false);
  };

  return (
  <div className='av-overlay av-endov'>
    <div className='av-endfx' aria-hidden='true'>
      {CONFETTI.map((c, i) => <i key={i} style={{ left: `${c.l}%`, animationDelay: `${c.d}s`, background: c.c, width: c.s, height: c.s * 1.6 }} />)}
    </div>
    <div className='av-endcard av-endwide'>
      <div className='av-endposter' ref={posterRef}><Poster theme={theme} name={check.ok ? check.clean : ""} score={score} coins={coins} skills={skills} achs={achs} date={date} /></div>
      <div className='av-endmain'>
      <div className='av-clear'>COURSE CLEAR!</div>
      <ThanksBanner />
      <div className='av-stats'>
        <span>⭐ {score} score</span><span>🪙 {coins} coins</span><span>🐟 {skills}/12 skills</span><span>🏆 {achs}/13 achievements</span>
      </div>
      <div className='av-reward'>
        <div className='av-ticket'>🎟</div>
        <div>
          <b>Reward unlocked: the Golden Ticket</b>
          <p>A free 15-minute chat with me about data, automation or your team, no strings attached. Claim it by email.</p>
        </div>
      </div>
      <form className='av-posterform' onSubmit={send}>
        <b>🎟 Pick your Ninja Award poster, type your name, get it by e-mail</b>
        <div className='av-themes'>
          {POSTER_THEMES.map((t) => (
            <button type='button' key={t.id} className={theme === t.id ? "on" : ""} onClick={() => setTheme(t.id)}>{t.label}</button>
          ))}
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Your name' required maxLength={40} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='you@example.com' type='email' required />
        <div className='row'>
          <button className='av-btn' type='submit' disabled={busy}>📬 Send me the poster</button>
          <button className='av-btn ghost' type='button' onClick={download}>⬇ Download PNG</button>
        </div>
        {!status && name.trim() && !check.ok && check.reason && <div className='av-poststatus bad'>{check.reason}</div>}
        {status && <div className='av-poststatus'>{status}</div>}
        <small>Your name and e-mail are used only to send this poster and to let Ezhil know you finished.</small>
      </form>
      <div className='av-endbtns'>
        <a className='av-btn' href={`${LINKS.email}?subject=${encodeURIComponent("Golden Ticket: let's chat")}`}>🎟 Claim my reward</a>
        <a className='av-btn ghost' href={RESUME_URL} download>⬇ Download resume</a>
        <a className='av-btn ghost' href={LINKS.linkedin} target='_blank' rel='noreferrer'>LinkedIn</a>
        <a className='av-btn ghost' href={LINKS.github} target='_blank' rel='noreferrer'>GitHub</a>
        <a className='av-btn ghost' href={LINKS.letterboxd} target='_blank' rel='noreferrer'>Letterboxd</a>
        <a className='av-btn ghost' href={LINKS.instagram} target='_blank' rel='noreferrer'>Instagram</a>
        <a className='av-btn ghost' href={LINKS.facebook} target='_blank' rel='noreferrer'>Facebook</a>
      </div>
      <div className='av-endbtns'>
        <button className='av-btn ghost' onClick={onAgain}>↻ Play again</button>
        <button className='av-btn ghost' onClick={onFormal}>View formal version</button>
        <button className='av-btn ghost' onClick={onClose}>Close</button>
      </div>
      </div>
    </div>
  </div>
  );
};

const Recruiter = ({ onClose, onAdventure }) => (
  <Overlay title='Recruiter mode' onClose={onClose} wide>
    <div className='av-rec'>
      <div className='av-recbar'>
        <a className='av-btn' href={RESUME_URL} download>⬇ Download resume</a>
        <a href={LINKS.linkedin} target='_blank' rel='noreferrer'>LinkedIn</a>
        <a href={LINKS.github} target='_blank' rel='noreferrer'>GitHub</a>
        <a href={LINKS.letterboxd} target='_blank' rel='noreferrer'>Letterboxd</a>
        <a href={LINKS.instagram} target='_blank' rel='noreferrer'>Instagram</a>
        <a href={LINKS.facebook} target='_blank' rel='noreferrer'>Facebook</a>
        <a href={LINKS.email}>Email</a>
        <button className='av-btn ghost' onClick={onAdventure}>🎮 Back to the adventure</button>
      </div>
      <h3>Ezhil Nilavan Kalaimani · Wealth Operations Officer III, TD</h3>
      <p>Toronto, Canada (originally from India). Postgraduate in IT Business Analysis (GPA 3.84, Distinction). Took cheque processing from manual to 99% automation and won the Q2 2026 Star Award.</p>

      <h4>Education</h4>
      {education.map((x) => (
        <div key={x.title + x.date} className='av-recitem'>
          <b>{x.title}</b> <span>{x.company_name} · {x.date}</span>
          <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      ))}

      <h4>Work experience</h4>
      {experiences.map((x) => (
        <div key={x.title + x.date} className='av-recitem'>
          <b>{x.title}</b> <span>{x.company_name} · {x.date}</span>
          <ul>{x.points.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      ))}

      <h4>Skills</h4>
      <div className='av-chips'>{SKILLS.map((s) => <i key={s}>{s}</i>)}</div>

      <h4>Certifications</h4>
      <ul>{CERTS.map((c) => <li key={c}>{c}</li>)}</ul>

      <h4>Projects</h4>
      {PROJECTS.map((p) => (
        <div key={p.name} className='av-recitem'><b>{p.name}</b><p>{p.text}</p><div className='av-chips'>{p.tags.map((t) => <i key={t}>{t}</i>)}</div></div>
      ))}

      <h4>Highlights</h4>
      <ul>{STAGES.td.bullets.concat(STAGES.amazon.bullets).map((b) => <li key={b}>{b}</li>)}</ul>
    </div>
  </Overlay>
);

/* ---------------------------------------------------------------- */
/* main component                                                    */
/* ---------------------------------------------------------------- */

export default function Adventure({ onFormal }) {
  const scale = useFit();
  const saved = useMemo(loadSave, []);
  const els = useRef({});
  const engine = useRef(null);
  const rootRef = useRef(null);
  const entRefs = useMemo(() => ({
    balloon: (el) => (els.current.balloon = el),
    tiger: (el) => (els.current.tiger = el),
    tigerFlip: (el) => (els.current.tigerFlip = el),
    ninja: (el) => (els.current.ninja = el),
    ninjaFlip: (el) => (els.current.ninjaFlip = el),
  }), []);

  const [level, setLevel] = useState(saved && saved.lvl ? saved.lvl : 0);
  const [titleKey, setTitleKey] = useState(0);
  const [ach, setAch] = useState(saved?.ach || []);
  const [visited, setVisited] = useState(saved?.visited || [0]);
  const [coins, setCoins] = useState(saved?.coins || 0);
  const [skillCount, setSkillCount] = useState(saved?.skills || 0);
  const [chq, setChq] = useState(saved?.chq || 0);
  const [opened, setOpened] = useState(saved?.opened || {});
  const [toasts, setToasts] = useState([]);
  const [buddy, setBuddy] = useState(() => loadBuddy() || "tiger");
  const [ctl, setCtl] = useState(loadCtl);
  const [wx, setWx] = useState("");
  const [overlay, setOverlay] = useState("buddy");
  const portrait = usePortrait();
  const [playAnyway, setPlayAnyway] = useState(false);
  const rotate = portrait && !playAnyway;
  const [sound, setSnd] = useState(false);
  const [tigerMode, setTigerMode] = useState("follow");
  const buddyRef = useRef(buddy);
  buddyRef.current = buddy;
  const bn = BUD[buddy].n;
  const be = BUD[buddy].e;
  const [riding, setRiding] = useState(false);
  const [finished, setFinished] = useState(!!saved?.ach?.includes("finish"));
  const [touch] = useState(() => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  const state = useRef({ ach: new Set(saved?.ach || []), visited: new Set(saved?.visited || [0]), hurdles: saved?.hurdles || 0, coins: saved?.coins || 0, skills: saved?.skills || 0, chq: saved?.chq || 0, opened: saved?.opened || {}, lvl: saved?.lvl || 0 });

  const persist = useCallback(() => {
    const s = state.current;
    writeSave({ ach: [...s.ach], visited: [...s.visited], hurdles: s.hurdles, coins: s.coins, skills: s.skills, chq: s.chq, opened: s.opened, lvl: s.lvl, collected: [...(engine.current?.collected || [])] });
  }, []);

  const toast = useCallback((text, kind = "info") => {
    const id = Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === "ach" ? 3800 : 2600);
  }, []);

  const unlock = useCallback((id) => {
    const s = state.current;
    if (s.ach.has(id)) return;
    s.ach.add(id);
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    setAch([...s.ach]);
    toast(`${a.icon} Achievement unlocked: ${a.name}`, "ach");
    sfx("ach");
    if (engine.current) { engine.current.t.celebrate = 1.4; engine.current.p.hop = 1.2; }
    if (s.ach.size >= 6 && !s.ach.has("collector")) setTimeout(() => unlock("collector"), 600);
    persist();
  }, [persist, toast]);

  const onEvent = useCallback((type, d) => {
    const s = state.current;
    switch (type) {
      case "start": unlock("first"); break;
      case "flag": toast("🏁 Course clear!", "ach"); break;
      case "ending": unlock("finish"); setFinished(true); setTimeout(() => setOverlay("end"), 300); break;
      case "level": {
        s.lvl = d;
        setLevel(d);
        setTitleKey((k) => k + 1);
        if (!s.visited.has(d)) { s.visited.add(d); setVisited([...s.visited]); }
        if (LEVELS[d].id === "edu") unlock("edu");
        if (["amazon", "work", "td"].every((id) => s.visited.has(LEVELS.findIndex((l) => l.id === id)))) unlock("career");
        persist();
        break;
      }
      case "award": if (d === "give") { unlock("star"); toast("🌟 The Master Ninja is awarding you the Q2 2026 Star Medal!", "ach"); s.coins += 25; setCoins(s.coins); sfx("coin"); } break;
      
      case "weather": setWx(d); if (d === "wind") toast("💨 Windstorm! Hold on to your headband!"); else if (d === "storm") toast("⛈ Thunderstorm ahead, almost at the castle!"); break;
      case "hurdle": s.hurdles = d; if (d >= 5) unlock("hurdler"); break;
      case "item":
        if (d.type === "coin" || d.type === "star" || d.type === "pkg") { s.coins += d.type === "star" ? 5 : 1; setCoins(s.coins); }
        if (d.type === "skill") { s.skills += 1; setSkillCount(s.skills); if (s.skills >= SKILL_COUNT) { unlock("skills"); sfx("win"); } }
        if (d.type === "chq") { s.chq += 1; setChq(s.chq); if (s.chq >= 5) unlock("cheque"); }
        if (d.type === "chest") { s.opened = { ...s.opened, [d.index]: true }; setOpened(s.opened); if (Object.keys(s.opened).length >= PROJECTS.length) unlock("projects"); }
        persist();
        break;
      case "mount": setRiding(true); unlock("rider"); { const B = BUD[buddyRef.current]; toast(buddyRef.current === "peacock" ? `🦚 Flying on the peacock! Hold ↑ or tap jump to flap. E to hop off.` : `${B.e} Riding the ${B.n.toLowerCase()}! Press E to hop off.`); }; break;
      case "dismount": setRiding(false); break;
      case "seabed": unlock("ocean"); break;
      case "flyhigh": unlock("sky"); break;
      case "board": toast("🎈 Up, up and away! Arrows to fly · E to land."); break;
      case "roof": unlock("roof"); break;
      case "splash": toast("🌊 Swimming! Arrows to swim, Shift to go faster."); break;
      case "tigermode": setTigerMode(d); { const B = BUD[buddyRef.current]; const n = `${B.e} ${B.n}`; toast(d === "stay" ? `${n} will wait here` : `${n} follows you`); }; break;
      case "tiger": if (d === "call") toast(`${BUD[buddyRef.current].e} ${BUD[buddyRef.current].n} is coming!`); break;
      default: break;
    }
  }, [persist, toast, unlock]);

  // engine lifecycle
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const start = saved && saved.lvl > 0 ? LEVELS[saved.lvl].x + 220 : 330;
    const eng = new Engine({ els: { ...els.current, root, stage: root }, emit: (t, d) => onEvent(t, d), collected: new Set(saved?.collected || []), start });
    engine.current = eng; if (typeof window !== "undefined") window.__eng = eng;
    eng.mount();
    if (saved && saved.lvl > 0) toast(`👋 Welcome back! Continuing from ${LEVELS[saved.lvl].name}`);
    return () => eng.unmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pause the game while an overlay is open
  useEffect(() => { engine.current && engine.current.setPaused(!!overlay || rotate); }, [overlay, rotate]);

  // global keys: map / recruiter / escape
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "Escape") setOverlay(null);
      else if (e.key === "m" || e.key === "M") setOverlay((o) => (o === "map" ? null : "map"));
      else if (e.key === "r" || e.key === "R") setOverlay((o) => (o === "rec" ? null : "rec"));
      else if (e.key === "g" || e.key === "G") setOverlay((o) => (o === "ach" ? null : "ach"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goLevel = (i) => {
    setOverlay(null);
    const x = i === 0 ? 330 : LEVELS[i].x + 220;
    engine.current && engine.current.teleport(x);
    sfx("whoosh");
  };
  const restart = () => {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
    window.location.reload();
  };
  const toggleSound = () => {
    setSound(!isSoundOn());
    setSnd(isSoundOn());
    try { localStorage.setItem("advSound", isSoundOn() ? "on" : "off"); } catch (e) { /* ignore */ }
    sfx("coin");
  };
  const pickCtl = (m) => {
    setCtl(m);
    try { localStorage.setItem(CTL_KEY, m); } catch (e) { /* ignore */ }
    sfx("coin");
  };
  const pickBuddy = (b) => {
    try { if (localStorage.getItem("advSound") !== "off" && !isSoundOn()) { setSound(true); setSnd(true); } } catch (e) { /* ignore */ }
    setBuddy(b);
    try { localStorage.setItem(BUDDY_KEY, b); } catch (e) { /* ignore */ }
    setOverlay(null);
    sfx("coin");
  };
  useEffect(() => { if (engine.current) engine.current.buddy = buddy; }, [buddy]);
  const press = (k, v) => engine.current && engine.current.setKey(k, v);
  const holdProps = (k) => ({
    onPointerDown: (e) => { e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId); press(k, true); },
    onPointerUp: () => press(k, false),
    onPointerCancel: () => press(k, false),
    onPointerLeave: () => press(k, false),
  });

  // touch gestures: hold the left / right half of the screen to run, slide a finger up to jump
  const gest = useRef({});
  const gDown = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const g = { x0: e.clientX, y0: e.clientY, t0: Date.now(), baseY: e.clientY, side: null, jump: false, moved: false };
    gest.current[e.pointerId] = g;
    const side = e.clientX < r.left + r.width / 2 ? "left" : "right";
    g.side = side; press(side, true);
  };
  const gMove = (e) => {
    const g = gest.current[e.pointerId];
    if (!g) return;
    const r = e.currentTarget.getBoundingClientRect();
    const side = e.clientX < r.left + r.width / 2 ? "left" : "right";
    if (side !== g.side) { press(g.side, false); g.side = side; press(side, true); }
    if (Math.abs(e.clientX - g.x0) > 12 || Math.abs(e.clientY - g.y0) > 12) g.moved = true;
    if (g.baseY - e.clientY > 36) {          // slid up: jump (slide up again to double-jump, or hold to swim up)
      if (g.jump) press("jump", false);
      press("jump", true); g.jump = true; g.baseY = e.clientY;
    }
  };
  const gUp = (e) => {
    const g = gest.current[e.pointerId];
    if (!g) return;
    delete gest.current[e.pointerId];
    press(g.side, false);
    if (g.jump) press("jump", false);
    // a quick tap on a card, link or form field underneath: pass it on
    if (!g.moved && Date.now() - g.t0 < 350 && e.type === "pointerup") {
      const hit = document.elementsFromPoint(e.clientX, e.clientY).find((n) => n.matches && n.matches("a, button, input, textarea, .gm-card.clickable, .av-pcard.clickable"));
      if (hit) { if (/^(INPUT|TEXTAREA)$/.test(hit.tagName)) hit.focus(); else hit.click(); }
    }
  };

  const score = coins * 10 + skillCount * 50 + chq * 20 + ach.length * 100;
  const lv = LEVELS[level];

  return (
    <div className='gm-root av-root'>
      {rotate && (
        <div className='av-rotate'>
          <div className='av-rotate-ico'>📱↻</div>
          <h2>Turn your phone sideways</h2>
          <p>The adventure plays best in landscape.</p>
          <button onClick={onFormal}>View the formal version</button>
          <button className='alt' onClick={() => setPlayAnyway(true)}>Play anyway</button>
        </div>
      )}
      <div className='av-stage' ref={rootRef} aria-label='Interactive adventure' style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <div className='av-sky' />
        <div className='av-rain' aria-hidden='true' />
        <div className='av-wind' aria-hidden='true'>{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ top: `${8 + i * 10}%`, animationDelay: `${-i * 0.37}s`, animationDuration: `${1.2 + (i % 4) * 0.25}s` }}>{i % 3 === 0 ? "🍃" : i % 3 === 1 ? "🍂" : "🌿"}</i>)}</div>
        <div className='av-flash' aria-hidden='true' />
        {wx && wx !== "rain" && <div className='av-wxbadge'>{wx === "wind" ? "💨 Windstorm" : "⛈ Thunderstorm"}</div>}
        <div ref={(el) => (els.current.far = el)} className='av-layer'><FarLayer /></div>
        <div ref={(el) => (els.current.mid = el)} className='av-layer'><MidLayer /></div>
        <div ref={(el) => (els.current.world = el)} className='av-layer av-world'>
          <WorldContent skillCount={skillCount} opened={opened} finished={finished} />
          <Entities refs={entRefs} buddy={buddy} />
          <div className='av-wateroverlay' />
        </div>
        <div ref={(el) => (els.current.fg = el)} className='av-layer av-fglayer'><FgLayer /></div>
        <div className='av-depth' />
        <div className='av-flyparrot' aria-hidden='true'>
          <svg viewBox='0 0 140 80' width='110' height='63'>
            <path d='M18 44 L-6 58 L8 62 L-8 74 L22 62Z' fill='#d9382f' />
            <ellipse cx='56' cy='46' rx='38' ry='16' fill='#2fb56a' />
            <ellipse cx='50' cy='52' rx='24' ry='8' fill='#1f8a50' />
            <g className='av-wing'><path d='M46 40 Q36 8 70 2 Q72 26 62 42Z' fill='#27a15d' /><path d='M52 38 Q46 16 68 8' stroke='#f7b32b' strokeWidth='3' fill='none' /></g>
            <circle cx='92' cy='38' r='15' fill='#2fb56a' />
            <path d='M102 34 q20 2 12 16 q-9 -2 -12 -8Z' fill='#f7b32b' />
            <circle cx='96' cy='34' r='4.5' fill='#fff' /><circle cx='97.5' cy='34' r='2.2' fill='#1a1209' />
          </svg>
        </div>
        {touch && ctl === "gesture" && <div className='av-gesture' onPointerDown={gDown} onPointerMove={gMove} onPointerUp={gUp} onPointerCancel={gUp} />}

        {/* HUD */}
        <div className='av-top'>
          <button className='gm-name' onClick={() => goLevel(0)}>Ezhil Nilavan Kalaimani</button>
          <div className='gm-nav'>
            <button onClick={() => setOverlay("map")}>🗺 Map</button>
            <button onClick={() => setOverlay("ach")}>🏆 {ach.length}/{ACHIEVEMENTS.length}</button>
            <button onClick={() => setOverlay("rec")}>📋 Recruiter mode</button>
            {touch && <button onClick={() => pickCtl(ctl === "gesture" ? "buttons" : "gesture")} title='Switch controls'>{ctl === "gesture" ? "👆 Motion" : "🎮 Buttons"}</button>}
            <button onClick={() => setOverlay("buddy")} title='Change buddy'>{be} Buddy</button>
            <button onClick={() => setOverlay("restart")} title='Restart adventure'>↻ Restart</button>
            <button onClick={toggleSound}>{sound ? "🔊" : "🔇"}</button>
            <button className='formal' onClick={onFormal}>☰ Formal version</button>
          </div>
        </div>
        <div className='av-score'>⭐ {score} <span>🪙 {coins}</span></div>
        <div className='av-toasts'>{toasts.map((t) => <div key={t.id} className={`av-toast ${t.kind}`}>{t.text}</div>)}</div>
        <div className='av-pad'>
          <button onClick={() => engine.current.callTiger()}>{be} Call <kbd>C</kbd></button>
          <button onClick={() => engine.current.toggleStay()}>{tigerMode === "follow" ? "Stay" : "Follow"} <kbd>T</kbd></button>
          <button onClick={() => engine.current.roar()}>Roar <kbd>V</kbd></button>
          <button onClick={() => { const e = engine.current; if (e.p.mode === "fly") e.dismountBalloon(); else if (!e.p.mounted && e.nearBalloon()) e.boardBalloon(); else e.tryMount(); }}>{riding ? "Hop off" : "Ride / Board"} <kbd>E</kbd></button>
        </div>
        {touch && (
          <div className='av-touch'>
            {ctl === "buttons" ? <div><button {...holdProps("left")}>◀</button><button {...holdProps("right")}>▶</button></div> : <div className='av-hint'>👈 touch left or right to run · slide up ☝ to jump</div>}
            <div><button {...holdProps("down")}>▼</button><button {...holdProps("sprint")}>»</button><button className='big' {...holdProps("jump")}>⤒</button><button {...holdProps("act")}>E</button></div>
          </div>
        )}

        {overlay === "map" && <MapOverlay onClose={() => setOverlay(null)} onGo={goLevel} visited={visited} level={level} onRecruiter={() => setOverlay("rec")} onRestart={restart} />}
        {overlay === "end" && (
          <EndOverlay score={score} coins={coins} skills={skillCount} achs={ach.length} onClose={() => { setOverlay(null); const e = engine.current; if (e) { e.resetEnding(); e.teleport(LEVELS[LEVELS.length - 1].x + 250); } }} onFormal={onFormal}
            onAgain={() => { setOverlay(null); engine.current && engine.current.resetEnding(); }} />
        )}
        {overlay === "buddy" && <BuddyOverlay current={buddy} onPick={pickBuddy} touch={touch} ctl={ctl} onCtl={pickCtl} />}
        {overlay === "restart" && <RestartOverlay onYes={restart} onNo={() => setOverlay(null)} />}
        {overlay === "ach" && <AchOverlay onClose={() => setOverlay(null)} unlocked={ach} />}
        {overlay === "rec" && <Recruiter onClose={() => setOverlay(null)} onAdventure={() => setOverlay(null)} />}
      </div>
    </div>
  );
}
