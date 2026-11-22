import React, { useState } from 'react';
import { HL } from './data';

const CHIPS = ['Automation', 'Accuracy', 'Reporting', 'Academics'];

const ApHighlights = () => {
  const [i, setI] = useState(0);
  const [num, text] = HL[i];
  return (
    <section className='sec dark' id='highlights'>
      <div className='eyebrow'>Get the highlights.</div>
      <h2 className='reveal'>Results that moved the numbers.</h2>
      <div className='chips' id='hchips'>
        {CHIPS.map((c, k) => (
          <span key={c} className={'chip' + (k === i ? ' on' : '')} role='button' tabIndex={0} onClick={() => setI(k)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setI(k); }}>{c}</span>
        ))}
      </div>
      <div className='hl reveal'>
        <div className='num grad' id='hnum'>{num}</div>
        <div className='sub' id='htxt' style={{ color: '#f5f5f7' }}>{text}</div>
      </div>
    </section>
  );
};

export default ApHighlights;
