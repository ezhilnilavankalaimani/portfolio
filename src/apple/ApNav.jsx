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
      <img src='/logo-banyan.png' alt='' width='46' height='33' aria-hidden='true' style={{ flex: 'none', display: 'block' }} />
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
