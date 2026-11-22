import { useEffect } from 'react';

// Click the banyan and a handful of leaves blow out of the tree.
const CSS = `
.apx-leaf{position:fixed;z-index:65;pointer-events:none;width:22px;height:22px;margin:-11px 0 0 -11px;will-change:transform,opacity;animation:apx-fly var(--d) cubic-bezier(.2,.6,.4,1) forwards}
@keyframes apx-fly{
  0%{transform:translate(0,0) rotate(0) scale(.4);opacity:0}
  10%{opacity:1;transform:translate(calc(var(--dx)*.15),calc(var(--dy)*.6 - 40px)) rotate(calc(var(--r)*.2)) scale(1)}
  35%{transform:translate(calc(var(--dx)*.5 + var(--sw)),calc(var(--dy)*.5 - 90px)) rotate(calc(var(--r)*.5)) scale(1)}
  65%{transform:translate(calc(var(--dx)*.85 - var(--sw)),calc(var(--dy)*.4 + 40px)) rotate(calc(var(--r)*.8))}
  100%{transform:translate(var(--dx),calc(var(--dy) + 260px)) rotate(var(--r)) scale(.9);opacity:0}
}
@keyframes apx-shk{0%,100%{transform:translate(0,0) rotate(0)}20%{transform:translate(-3px,1px) rotate(-.9deg)}40%{transform:translate(3px,-1px) rotate(.9deg)}60%{transform:translate(-2px,1px) rotate(-.6deg)}80%{transform:translate(2px,0) rotate(.6deg)}}
#bsvg.apx-shake #blv{transform-box:fill-box;transform-origin:50% 100%;animation:apx-shk .22s linear infinite}
#bsvg.apx-shake #blv0{transform-box:fill-box;transform-origin:50% 100%;animation:apx-shk .27s linear infinite reverse}
.bico{cursor:pointer}
@media(prefers-reduced-motion:reduce){.apx-leaf{display:none}#bsvg.apx-shake #blv,#bsvg.apx-shake #blv0{animation:none}}
`;
const COLORS = ['#30d158', '#34c759', '#248a3d', '#7ed957', '#a8e063', '#1f7a3a'];
const SHAPE = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 20C4 9 11 3 21 3c0 10-6 17-17 17z" fill="COLOR"/><path d="M4 20L15 9" stroke="#0b3d1c" stroke-opacity=".45" stroke-width="1.3" fill="none"/></svg>';

export default function ApLeaves() {
  useEffect(() => {
    const st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    const burst = (x, y) => {
      const n = 22;
      for (let i = 0; i < n; i += 1) {
        const el = document.createElement('div');
        el.className = 'apx-leaf';
        const d = 2.4 + Math.random() * 1.8;
        el.style.cssText = `left:${x + (Math.random() - 0.5) * 40}px;top:${y + (Math.random() - 0.5) * 30}px;--dx:${(Math.random() - 0.5) * 520}px;--dy:${-60 - Math.random() * 120}px;--r:${(Math.random() - 0.5) * 900}deg;--sw:${(Math.random() - 0.5) * 120}px;--d:${d}s;animation-delay:${Math.random() * 0.25}s`;
        el.innerHTML = SHAPE.replace('COLOR', COLORS[i % COLORS.length]);
        document.body.appendChild(el);
        setTimeout(() => el.remove(), (d + 0.4) * 1000);
      }
    };
    const onClick = (e) => {
      const t = e.target;
      if (t && t.closest && t.closest('#bsvg, #banyan .bwrap, #banyan svg')) burst(e.clientX, e.clientY);
    };
    const onClick2 = (e) => {
      const t = e.target;
      if (t && t.closest && t.closest('.bico')) window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    let off = 0;
    const shake = (on) => { const sv = document.getElementById('bsvg'); if (sv) sv.classList.toggle('apx-shake', on); };
    const over = (e) => { if (e.target.closest && e.target.closest('#bsvg')) { shake(true); clearTimeout(off); } };
    const out = (e) => { if (e.target.closest && e.target.closest('#bsvg')) { clearTimeout(off); off = setTimeout(() => shake(false), 120); } };
    const touch = (e) => { if (e.target.closest && e.target.closest('#bsvg')) { shake(true); clearTimeout(off); off = setTimeout(() => shake(false), 900); } };
    document.addEventListener('click', onClick);
    document.addEventListener('click', onClick2);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    document.addEventListener('touchstart', touch, { passive: true });
    return () => {
      document.removeEventListener('click', onClick); document.removeEventListener('click', onClick2);
      document.removeEventListener('mouseover', over); document.removeEventListener('mouseout', out);
      document.removeEventListener('touchstart', touch); clearTimeout(off); st.remove();
    };
  }, []);
  return null;
}
