import React, { useEffect, useRef } from 'react';
import ApWorldClock from './ApWorldClock';
import memoji from '../assets/apple/memoji_sq.png';

const N = 150;
const R0 = 205;

// The ring of light lines around the Memoji leans toward the pointer.
const useRing = (svgRef) => {
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const lines = Array.from(svg.querySelectorAll('line'));
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ang = Math.PI * 0.75;
    let tgt = ang;
    let pw = 0;
    let pwT = 0;
    let raf = 0;
    const onMove = (e) => {
      const r = svg.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      tgt = Math.atan2(dy, dx);
      pwT = Math.min(1, Math.hypot(dx, dy) / (r.width * 0.9));
    };
    const draw = (t) => {
      const d = Math.atan2(Math.sin(tgt - ang), Math.cos(tgt - ang));
      ang += d * 0.09;
      pw += (pwT - pw) * 0.08;
      for (let i = 0; i < N; i += 1) {
        const a = (i / N) * Math.PI * 2;
        const bias = Math.pow(0.5 + 0.5 * Math.cos(a - ang), 1.4 - 0.5 * pw);
        const wave = 0.5 + 0.5 * Math.sin(a * 6 - t * 2.2);
        const len = 10 + bias * 26 + (reduce ? 0 : wave * 9);
        const hue = 205 + bias * 60;
        const l = lines[i];
        l.setAttribute('x1', Math.cos(a) * R0);
        l.setAttribute('y1', Math.sin(a) * R0);
        l.setAttribute('x2', Math.cos(a) * (R0 + len));
        l.setAttribute('y2', Math.sin(a) * (R0 + len));
        l.setAttribute('stroke', `hsl(${hue},100%,${55 - bias * 8}%)`);
        l.setAttribute('stroke-width', 2.2 + bias * 2);
        l.setAttribute('stroke-opacity', 0.3 + bias * 0.7);
      }
      raf = requestAnimationFrame((x) => draw(x / 1000));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    draw(0);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); };
  }, [svgRef]);
};

const ApHero = ({ onGame }) => {
  const ring = useRef(null);
  useRing(ring);
  return (
    <section className='sec hero' id='overview'>
      <div className='eyebrow'>Finance · Data analysis · Automation</div>
      <h1 className='reveal'>Making work <span className='grad'>run itself.</span></h1>
      <p className='sub reveal'>A rare mix of finance knowledge and analyst skills. I understand how money and client work actually move, and I use data to make that work faster, clearer and more accurate. From automation to wealth services, I like fixing the process behind the result.</p>
      <div className='cta reveal'>
        <a className='p' href='#projects'>See my work</a>
        <a href='#work'>Experience &rsaquo;</a>
        <a href='#play' onClick={(e) => { if (onGame) { e.preventDefault(); onGame(); } }}>Play the game version &rsaquo;</a>
      </div>
      <div className='orb reveal avatar'>
        <svg className='ring' ref={ring} viewBox='-300 -300 600 600' aria-hidden='true'>
          {Array.from({ length: N }, (_, i) => <line key={i} />)}
        </svg>
        <div className='avin'><img src={memoji} alt='Memoji of Ezhil' width={822} height={822} /><i className='halo-sweep' aria-hidden='true' /><span className='eyes' aria-hidden='true'><i className='eb l' /><i className='eb r' /></span></div>
      </div>
      <ApWorldClock />
    </section>
  );
};

export default ApHero;
