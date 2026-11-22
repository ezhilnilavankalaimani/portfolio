import React, { useEffect, useRef } from 'react';
import rest from './rest';

// Skills, Projects, Accolades, Banyan, Popcorn Corner, Game card, Contact and Footer.
// Markup and behaviour come from rest.js (generated from the approved preview), mounted once.
const ApRest = ({ onGame }) => {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const timers = [];
    const origSI = window.setInterval;
    const origST = window.setTimeout;
    window.setInterval = (...a) => { const id = origSI(...a); timers.push(['i', id]); return id; };
    window.setTimeout = (...a) => { const id = origST(...a); timers.push(['t', id]); return id; };
    let io = null;
    const nodes = () => root.querySelectorAll('.reveal');
    if (typeof IntersectionObserver === 'undefined') {
      nodes().forEach((n) => n.classList.add('in'));
      io = { observe: (n) => n.classList.add('in'), unobserve() {}, disconnect() {} };
    } else {
      io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
        { threshold: 0.15 }
      );
    }
    nodes().forEach((n) => io.observe(n));
    // scripts that inject .reveal elements later
    const mo = new MutationObserver(() => nodes().forEach((n) => { if (!n.classList.contains('in')) io.observe(n); }));
    mo.observe(root, { childList: true, subtree: true });
    rest.scripts.slice(1).forEach((code) => {
      try { new Function('io', code)(io); } catch (err) { /* keep the rest of the page alive */ if (typeof console !== 'undefined') console.warn('apple section script', err); }
    });
    window.setInterval = origSI;
    window.setTimeout = origST;
    const pb = root.querySelector('#playbtn');
    const click = (e) => { e.preventDefault(); if (onGame) onGame(); };
    if (pb) pb.addEventListener('click', click);
    return () => {
      timers.forEach(([k, id]) => (k === 'i' ? clearInterval(id) : clearTimeout(id)));
      if (pb) pb.removeEventListener('click', click);
      mo.disconnect();
      if (io.disconnect) io.disconnect();
    };
  }, [onGame]);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: rest.html }} />;
};

export default React.memo(ApRest);
