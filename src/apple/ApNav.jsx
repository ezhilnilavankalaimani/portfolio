import React from 'react';

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
const ApNav = ({ onGame }) => (
  <div className='gnav'>
    <b>Ezhil Nilavan Kalaimani</b>
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
  </div>
);

export default ApNav;
