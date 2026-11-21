import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { education, experiences } from "../constants";
import { CERTS, LINKS, PROJECTS, SKILLS, STAGES } from "../game/data";
import { isSoundOn, setSound, sfx } from "./audio";
import { Engine, GROUND, ITEMS, LEVELS, SKILL_COUNT, VH, VW } from "./engine";
import { Poster, POSTER_THEMES, posterToPng } from "./poster";
import { validateName } from "./names";
import emailjs from "@emailjs/browser";
import { Entities, FarLayer, FgLayer, MidLayer, RESUME_URL, WorldContent } from "./world";
import "../game/game.css";
import "./adventure.css";

const SAVE_KEY = "advSave.v2";
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
  { id: "rider", icon: "🐯", name: "Tiger Rider", desc: "Ride the tiger." },
  { id: "ocean", icon: "🌊", name: "Ocean Explorer", desc: "Reach the seabed." },
  { id: "skills", icon: "🐟", name: "Skills Explorer", desc: "Catch all 12 skills." },
  { id: "projects", icon: "🧰", name: "Project Hunter", desc: "Open all 5 project chests." },
  { id: "finish", icon: "🏁", name: "Adventure Complete", desc: "Slide down the flagpole and enter the castle." },
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

const MapOverlay = ({ onClose, onGo, onRecruiter, onRestart, visited }) => (
  <Overlay title='World map' onClose={onClose}>
    <p className='av-lead'>Jump straight to any level.</p>
    <div className='av-mapgrid'>
      {LEVELS.map((l, i) => (
        <button key={l.id} className={visited.includes(i) ? "seen" : ""} onClick={() => onGo(i)}>
          <em>{i === 0 ? "START" : `LEVEL ${l.n}`}</em>
          <b>{l.name}</b>
        </button>
      ))}
    </div>
    <div className='av-row'>
      <button className='av-btn' onClick={onRecruiter}>📋 Recruiter mode</button>
      <button className='av-btn ghost' onClick={onRestart}>↺ Restart adventure</button>
    </div>
  </Overlay>
);

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
      <h2>நன்றி · Nandri · Thank you for playing, you made it to the castle 🏰</h2>
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
  const [overlay, setOverlay] = useState(null);
  const portrait = usePortrait();
  const [playAnyway, setPlayAnyway] = useState(false);
  const rotate = portrait && !playAnyway;
  const [sound, setSnd] = useState(false);
  const [tigerMode, setTigerMode] = useState("follow");
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
        if (d === 1) unlock("edu");
        if (["amazon", "work", "td"].every((id) => s.visited.has(LEVELS.findIndex((l) => l.id === id)))) unlock("career");
        persist();
        break;
      }
      case "hurdle": s.hurdles = d; if (d >= 5) unlock("hurdler"); break;
      case "item":
        if (d.type === "coin" || d.type === "star" || d.type === "pkg") { s.coins += d.type === "star" ? 5 : 1; setCoins(s.coins); }
        if (d.type === "skill") { s.skills += 1; setSkillCount(s.skills); if (s.skills >= SKILL_COUNT) { unlock("skills"); sfx("win"); } }
        if (d.type === "chq") { s.chq += 1; setChq(s.chq); if (s.chq >= 5) unlock("cheque"); }
        if (d.type === "chest") { s.opened = { ...s.opened, [d.index]: true }; setOpened(s.opened); if (Object.keys(s.opened).length >= PROJECTS.length) unlock("projects"); }
        persist();
        break;
      case "mount": setRiding(true); unlock("rider"); toast("🐯 Riding the tiger! Press E to hop off."); break;
      case "dismount": setRiding(false); break;
      case "seabed": unlock("ocean"); break;
      case "flyhigh": unlock("sky"); break;
      case "board": toast("🎈 Up, up and away! Arrows to fly · E to land."); break;
      case "roof": unlock("roof"); break;
      case "splash": toast("🌊 Swimming! Arrows to swim, Shift to go faster."); break;
      case "tigermode": setTigerMode(d); toast(d === "stay" ? "🐯 Tiger will wait here" : "🐯 Tiger follows you"); break;
      case "tiger": if (d === "call") toast("🐯 Tiger is coming!"); break;
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
    sfx("coin");
  };
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
        <div ref={(el) => (els.current.far = el)} className='av-layer'><FarLayer /></div>
        <div ref={(el) => (els.current.mid = el)} className='av-layer'><MidLayer /></div>
        <div ref={(el) => (els.current.world = el)} className='av-layer av-world'>
          <WorldContent skillCount={skillCount} opened={opened} finished={finished} />
          <Entities refs={entRefs} />
          <div className='av-wateroverlay' />
        </div>
        <div ref={(el) => (els.current.fg = el)} className='av-layer av-fglayer'><FgLayer /></div>
        <div className='av-depth' />
        {touch && <div className='av-gesture' onPointerDown={gDown} onPointerMove={gMove} onPointerUp={gUp} onPointerCancel={gUp} />}

        {/* HUD */}
        <div className='av-top'>
          <button className='gm-name' onClick={() => goLevel(0)}>Ezhil Nilavan Kalaimani | Wealth Operations Officer III</button>
          <div className='gm-nav'>
            <button onClick={() => setOverlay("map")}>🗺 Map</button>
            <button onClick={() => setOverlay("ach")}>🏆 {ach.length}/{ACHIEVEMENTS.length}</button>
            <button onClick={() => setOverlay("rec")}>📋 Recruiter mode</button>
            <button onClick={toggleSound}>{sound ? "🔊" : "🔇"}</button>
            <button className='formal' onClick={onFormal}>☰ Formal version</button>
          </div>
        </div>
        <div className='av-score'>⭐ {score} <span>🪙 {coins}</span></div>
        {level > 0 && <div className='av-lvtitle' key={titleKey}><em>{LEVELS[level].n ? `LEVEL ${LEVELS[level].n}` : ""}</em><b>{lv.name}</b></div>}
        <div className='av-toasts'>{toasts.map((t) => <div key={t.id} className={`av-toast ${t.kind}`}>{t.text}</div>)}</div>
        <div className='av-pad'>
          <button onClick={() => engine.current.callTiger()}>🐯 Call <kbd>C</kbd></button>
          <button onClick={() => engine.current.toggleStay()}>{tigerMode === "follow" ? "Stay" : "Follow"} <kbd>T</kbd></button>
          <button onClick={() => engine.current.roar()}>Roar <kbd>V</kbd></button>
          <button onClick={() => { const e = engine.current; if (e.p.mode === "fly") e.dismountBalloon(); else if (!e.p.mounted && e.nearBalloon()) e.boardBalloon(); else e.tryMount(); }}>{riding ? "Hop off" : "Ride / Board"} <kbd>E</kbd></button>
        </div>
        {touch && (
          <div className='av-touch'>
            <div className='av-hint'>👈 touch left or right to run · slide up ☝ to jump</div>
            <div><button {...holdProps("down")}>▼</button><button {...holdProps("sprint")}>»</button><button className='big' {...holdProps("jump")}>⤒</button><button {...holdProps("act")}>E</button></div>
          </div>
        )}

        {overlay === "map" && <MapOverlay onClose={() => setOverlay(null)} onGo={goLevel} visited={visited} onRecruiter={() => setOverlay("rec")} onRestart={restart} />}
        {overlay === "end" && (
          <EndOverlay score={score} coins={coins} skills={skillCount} achs={ach.length} onClose={() => setOverlay(null)} onFormal={onFormal}
            onAgain={() => { setOverlay(null); engine.current && engine.current.resetEnding(); }} />
        )}
        {overlay === "ach" && <AchOverlay onClose={() => setOverlay(null)} unlocked={ach} />}
        {overlay === "rec" && <Recruiter onClose={() => setOverlay(null)} onAdventure={() => setOverlay(null)} />}
      </div>
    </div>
  );
}
