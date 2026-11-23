import React, { useState } from 'react';

const LINKS = [
  ['overview', 'Overview'],
  ['highlights', 'Highlights'],
  ['work', 'Work'],
  ['studies', 'Studies'],
  ['skills', 'Skills'],
  ['projects', 'Projects'],
  ['accolades', 'Accolades'],
];

// Sticky, blurred menu. "Game version" switches to the adventure through the same handler the chooser uses.
const ApNav = ({ onGame }) => {
  const [open, setOpen] = useState(false);
  const top = () => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const go = (e) => { if (onGame) { e.preventDefault(); setOpen(false); onGame(); } };
  return (
  <div className={'gnav' + (open ? ' mopen' : '')}>
    <b role='link' tabIndex={0} aria-label='Back to top' onClick={top} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); top(); } }} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <svg viewBox='0 0 32 24' width='34' height='26' aria-hidden='true' style={{ flex: 'none' }}><defs><linearGradient id="ap-nb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#915eff"/><stop offset=".5" stopColor="#3b6cff"/><stop offset="1" stopColor="#00cea8"/></linearGradient></defs>
<g fill="url(#ap-nb)"><circle cx="8" cy="10" r="5.2"/><circle cx="16" cy="6.5" r="6.2"/><circle cx="24" cy="10" r="5.2"/><circle cx="12" cy="11" r="4.6"/><circle cx="20" cy="11" r="4.6"/></g>
<g fill="#fff" opacity=".18"><circle cx="14" cy="5.5" r="3.2"/><circle cx="22" cy="8.5" r="2.6"/><circle cx="9" cy="8.5" r="2.4"/></g>
<g stroke="#8e8e96" strokeLinecap="round" fill="none"><path d="M14.2 13v8.5M17.8 13v8.5" strokeWidth="2.4"/><path d="M9 14.5v6.8M23 14.5v6.8M5.5 13.5v5.5M26.5 13.5v5.5" strokeWidth="1.2"/></g>
<path d="M3 22.2h26" stroke="#00cea8" strokeWidth="1.2" strokeLinecap="round"/></svg>
      Ezhil Nilavan Kalaimani</b>
    <div className='l'>
      {LINKS.map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}
      <a
        href='#play'
        className='pl'
        onClick={(e) => { if (onGame) { e.preventDefault(); onGame(); } }}
      >
        Game version
      </a>
      <a href='#contact' className='btn'>Contact</a>
    </div>
    <button type='button' className='mm' aria-label='Menu' aria-expanded={open} onClick={() => setOpen(!open)}>
      <i /><i /><i />
    </button>
    <div className='mdrop' role='menu'>
      {LINKS.map(([id, label]) => <a key={id} href={'#' + id} onClick={() => setOpen(false)}>{label}</a>)}
      <a href='#contact' className='mg' onClick={() => setOpen(false)}>Contact</a>
    </div>
  </div>
  );
};

export default ApNav;
