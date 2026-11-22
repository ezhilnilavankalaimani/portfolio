import React, { useState } from 'react';
import { JOBS } from './data';

const Logo = ({ job, alt }) => (
  <span className='wl' style={{ background: job.bg }}><img src={job.logo} alt={alt} /></span>
);

// Career path of company logos, oldest to newest. Tap one to read what I did there.
const ApWork = () => {
  const [i, setI] = useState(JOBS.length - 1);
  const j = JOBS[i];
  return (
    <section className='sec' id='work'>
      <div className='eyebrow'>The experience.</div>
      <h2 className='reveal'>One role at a time.</h2>
      <p className='sub'>From Amazon India to TD Toronto.</p>
      <div className='wpath' id='wpath'>
        <div className='wline'><i id='wfill' style={{ width: (i / (JOBS.length - 1)) * 100 + '%' }} /></div>
        {JOBS.map((x, k) => (
          <button key={x.n} type='button' className={'wn' + (k === i ? ' on' : '')} style={{ '--c': x.c }} onClick={() => setI(k)} aria-pressed={k === i}>
            <Logo job={x} alt={x.n + ' logo'} />
            <b>{x.n}</b>
            <small>{x.short}</small>
          </button>
        ))}
      </div>
      <div className='wp' id='wpanel' style={{ '--c': j.c }}>
        <div className='wh'>
          <Logo job={j} alt='' />
          <div><h3>{j.role}</h3><small>{j.org}</small></div>
          <em>{j.date}</em>
        </div>
        {j.kf.length > 0 && (
          <div className='wkf'>{j.kf.map((k) => <div key={k[1]}><b>{k[0]}</b><span>{k[1]}</span></div>)}</div>
        )}
        <div className='wtags'>{j.tags.map((t) => <span key={t}>{t}</span>)}</div>
        <div className='wpts' key={i}>
          {j.pts.map((t, k) => (
            <div className='wpt' key={k} style={{ animationDelay: k * 45 + 'ms' }}><i>{k + 1}</i><p>{t}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApWork;
