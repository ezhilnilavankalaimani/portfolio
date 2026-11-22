import React, { useEffect, useRef, useState } from 'react';
import body from '../assets/apple/memoji_body.png';
import hand from '../assets/apple/memoji_hand.png';

// A small memoji robot that rolls along the bottom of the page. Click it and it will only
// help you move around the page ("take me to projects"). It does not talk about anything else.
const CSS = `
.apx-buddy{position:fixed;right:0;bottom:110px;z-index:60;width:96px;height:100px;overflow:hidden;transform:translateX(56px);transition:transform .45s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.apx-buddy.open{transform:translateX(-8px);overflow:visible}
.apx-bob{position:absolute;inset:0;pointer-events:auto;cursor:pointer;border:0;background:none;padding:0}
.apx-me{position:absolute;left:0;top:0;width:96px;transform:scaleX(-1)}
.apx-me img{display:block;width:100%}
.apx-me .apx-h{position:absolute;left:65.5%;top:8%;width:34.5%;transform-origin:50% 96%;animation:apx-wave 5s ease-in-out infinite}
.apx-buddy.open .apx-h{animation:apx-wave 2.4s ease-in-out infinite}
@keyframes apx-wave{0%,45%{transform:rotate(0)}52%{transform:rotate(-18deg)}59%{transform:rotate(16deg)}66%{transform:rotate(-18deg)}73%{transform:rotate(12deg)}80%,100%{transform:rotate(0)}}
.apx-tip{position:fixed;right:58px;bottom:176px;z-index:60;background:#1d1d1f;color:#fff;font:600 12px -apple-system,BlinkMacSystemFont,'Inter',sans-serif;padding:6px 10px;border-radius:12px;opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap}
.apx-buddy:hover ~ .apx-tip{opacity:1}
.apx-buddy.open ~ .apx-tip{opacity:0}
.apx-chat{position:fixed;right:14px;bottom:222px;z-index:70;width:min(330px,calc(100vw - 24px));background:#fff;color:#1d1d1f;border-radius:22px;box-shadow:0 20px 60px rgba(0,0,0,.28);font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;overflow:hidden}
.apx-chat header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#1d1d1f;color:#fff;font-weight:600;font-size:14px}
.apx-chat header button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer;line-height:1}
.apx-log{max-height:210px;overflow:auto;padding:12px 14px;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.35}
.apx-m{max-width:85%;padding:8px 12px;border-radius:16px}
.apx-m.b{background:#f2f2f4;align-self:flex-start;border-bottom-left-radius:5px}
.apx-m.u{background:#0071e3;color:#fff;align-self:flex-end;border-bottom-right-radius:5px}
.apx-chips{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}
.apx-chips button{border:1px solid #d2d2d7;background:#fff;border-radius:99px;padding:5px 11px;font-size:12px;cursor:pointer;color:#1d1d1f;font-family:inherit}
.apx-chips button:hover{background:#f2f2f4}
.apx-chat form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #eee}
.apx-chat input{flex:1;min-width:0;border:1px solid #d2d2d7;border-radius:99px;padding:8px 14px;font-size:14px;font-family:inherit;outline:none}
.apx-chat form button{border:0;background:#0071e3;color:#fff;border-radius:99px;padding:8px 14px;font-weight:600;font-size:13px;cursor:pointer}
@media(max-width:700px){.apx-buddy{width:76px;height:80px;bottom:90px;transform:translateX(44px)}.apx-buddy.open{transform:translateX(-6px)}.apx-me{width:76px}.apx-chat{bottom:182px}.apx-tip{display:none}}
@media(prefers-reduced-motion:reduce){.apx-h{animation:none!important}.apx-buddy{transition:none}}
`;

const TARGETS = [
  ['experience', /(experience|work|career|job|td\b|amazon|walmart|company|companies|where.*work)/, 'work', 'Experience'],
  ['studies', /(stud(y|ies)|educat|school|college|degree|zion|anna|srm|sairam|mit\b|marks)/, 'studies', 'Studies'],
  ['skills', /(skill|tools?|sql|python|excel|power ?bi|tableau)/, 'skills', 'Skills'],
  ['projects', /(project|dashboard|case stud)/, 'projects', 'Projects'],
  ['accolades', /(accolade|award|recogni|achiev|star)/, 'accolades', 'Accolades'],
  ['banyan', /(banyan|tree|root)/, 'banyan', 'My banyan'],
  ['popcorn', /(popcorn|football|cricket|sport|brazil|manchester|chennai|score|movie)/, 'popcorn', 'Popcorn Corner'],
  ['contact', /(contact|email|mail|reach|hire|message|linkedin|github|social|talk)/, 'contact', 'Contact'],
  ['highlights', /(highlight)/, 'highlights', 'Highlights'],
  ['top', /(top|home|start|overview|beginning|hero)/, 'overview', 'the top'],
];
const CHIPS = ['Experience', 'Studies', 'Skills', 'Projects', 'Accolades', 'Banyan', 'Popcorn Corner', 'Contact', 'Game'];

const ApBuddy = ({ onGame }) => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ b: 1, t: 'Beep boop! I am the page guide. Tell me where to go, like "take me to projects".' }]);
  const [val, setVal] = useState('');
  const log = useRef(null);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [msgs, open]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const reply = (q) => {
    const s = q.toLowerCase().trim();
    if (/^(hi|hello|hey|yo|hola|vanakkam)\b/.test(s)) return 'Hello! Where would you like to go? Try a button below.';
    if (/(help|menu|what can you|options|where)/.test(s) && !/(work|stud)/.test(s)) return 'I can take you to: Experience, Studies, Skills, Projects, Accolades, My banyan, Popcorn Corner, Contact, or the Game.';
    if (/(game|play|adventure|interactive)/.test(s)) { setTimeout(() => onGame && onGame(), 700); return 'Loading the game version. Beep!'; }
    for (const [, re, id, label] of TARGETS) {
      if (re.test(s)) { go(id); return `Rolling to ${label}.`; }
    }
    return 'Beep. I only help you move around this page. Try "take me to projects".';
  };
  const send = (text) => {
    const t = (text || '').trim();
    if (!t) return;
    setMsgs((m) => [...m, { u: 1, t }, { b: 1, t: reply(t) }]);
    setVal('');
  };

  return (
    <>
      <style>{CSS}</style>
      <div className={`apx-buddy${open ? ' open' : ''}`}>
        <button type='button' className='apx-bob' aria-label={open ? 'Close page guide' : 'Open page guide'} onClick={() => setOpen((o) => !o)}>
          <span className='apx-me'><img src={body} alt='' /><img className='apx-h' src={hand} alt='' /></span>
        </button>
      </div>
      <span className='apx-tip'>Need help? Click me</span>
      {open && (
        <div className='apx-chat' role='dialog' aria-label='Page guide'>
          <header><span>Page guide</span><button type='button' aria-label='Close' onClick={() => setOpen(false)}>&times;</button></header>
          <div className='apx-log' ref={log}>{msgs.map((m, i) => <div key={i} className={`apx-m ${m.u ? 'u' : 'b'}`}>{m.t}</div>)}</div>
          <div className='apx-chips'>{CHIPS.map((c) => <button key={c} type='button' onClick={() => send(`take me to ${c}`)}>{c}</button>)}</div>
          <form onSubmit={(e) => { e.preventDefault(); send(val); }}>
            <input value={val} onChange={(e) => setVal(e.target.value)} placeholder='Take me to…' aria-label='Message' />
            <button type='submit'>Go</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ApBuddy;
