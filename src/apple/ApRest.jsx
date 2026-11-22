import React, { useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
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
    const form = root.querySelector('form.cf');
    const submit = (e) => {
      e.preventDefault();
      const [n, m, t] = form.querySelectorAll('input, textarea');
      const btn = form.querySelector('button');
      let st = form.querySelector('.cfstatus');
      if (!st) { st = document.createElement('p'); st.className = 'cfstatus'; st.setAttribute('role', 'status'); st.style.cssText = 'margin:12px 0 0;font-size:15px;color:#a1a1a6;text-align:center'; form.appendChild(st); }
      const name = n.value.trim(); const email = m.value.trim(); const msg = t.value.trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || !msg) { st.textContent = 'Please add your name, a valid email and a message.'; return; }
      btn.disabled = true; st.textContent = 'Sending…';
      emailjs
        .send('service_3yf8wil', 'template_p3qaifo', { from_name: name, to_name: 'Ezhil Nilavan Kalaimani', from_email: email, to_email: 'iamezhilnilavan@gmail.com', message: `${msg} email is ${email}` }, 'pmZPRYuPINkDLOE3c')
        .then(
          () => { st.textContent = 'Thank you! I will get back to you as soon as possible.'; n.value = ''; m.value = ''; t.value = ''; btn.disabled = false; },
          (err) => { if (typeof console !== 'undefined') console.error(err); st.textContent = 'Something went wrong. Please try again, or email me directly.'; btn.disabled = false; }
        );
    };
    if (form) { form.onsubmit = null; form.addEventListener('submit', submit); }
    return () => {
      if (form) form.removeEventListener('submit', submit);
      timers.forEach(([k, id]) => (k === 'i' ? clearInterval(id) : clearTimeout(id)));
      if (pb) pb.removeEventListener('click', click);
      mo.disconnect();
      if (io.disconnect) io.disconnect();
    };
  }, [onGame]);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: rest.html }} />;
};

export default React.memo(ApRest);
