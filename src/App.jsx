import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { About, Contact, Education, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from './components';
import Adventure from './adventure/Adventure';
import { Ninja } from './game/characters';

const KEY = 'siteMode';

// Remembers the visitor's choice. Upright phones start on the formal version.
// Every visitor first sees a chooser: the game or the formal site.

const CH_CSS = `
@keyframes ch-peek {
  0%, 18% { transform: translateY(128px) rotate(0deg); }
  27% { transform: translateY(8px) rotate(-5deg); }
  33% { transform: translateY(0) rotate(4deg); }
  40% { transform: translateY(0) rotate(-4deg); }
  47% { transform: translateY(2px) rotate(3deg); }
  54% { transform: translateY(128px) rotate(0deg); }
  66% { transform: translateY(128px) rotate(0deg); }
  72% { transform: translateY(30px) rotate(6deg); }
  78% { transform: translateY(26px) rotate(-3deg); }
  84% { transform: translateY(26px) rotate(5deg); }
  92%, 100% { transform: translateY(128px) rotate(0deg); }
}
@keyframes ch-hands {
  0%, 22% { opacity: 0; transform: translateY(14px); }
  27%, 48% { opacity: 1; transform: translateY(0); }
  52%, 70% { opacity: 0; transform: translateY(14px); }
  74%, 86% { opacity: 1; transform: translateY(0); }
  90%, 100% { opacity: 0; transform: translateY(14px); }
}
@keyframes ch-float { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 10% { opacity: .8; } 100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; } }
@keyframes ch-twinkle { 0%, 100% { opacity: .15; transform: scale(.8); } 50% { opacity: .9; transform: scale(1.2); } }
.ch-ninja { position: absolute; left: 44px; top: -122px; width: 118px; z-index: 0; pointer-events: none; transform-origin: 50% 100%; animation: ch-peek 11s ease-in-out infinite; }
.ch-hands { position: absolute; left: 44px; top: -16px; width: 118px; height: 30px; z-index: 3; pointer-events: none; animation: ch-hands 11s ease-in-out infinite; }
.ch-card { position: relative; z-index: 1; transition: transform .18s ease, box-shadow .18s ease; }
.ch-card:hover { transform: translateY(-6px) scale(1.02); }
.ch-leaf, .ch-star { position: absolute; pointer-events: none; user-select: none; }
.ch-leaf { bottom: -40px; animation: ch-float linear infinite; }
.ch-star { animation: ch-twinkle ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ch-ninja, .ch-hands, .ch-leaf, .ch-star { animation: none; } .ch-ninja { transform: translateY(40px); } .ch-hands { opacity: 1; } }
`;

const initialMode = () => null;

const Chooser = ({ onPick }) => {
  const [face, setFace] = useState('surprised');
  useEffect(() => { const t = setTimeout(() => setFace((f) => (f === 'surprised' ? 'happy' : f)), 2600); return () => clearTimeout(t); }, []);
  const pickFormal = () => { setFace('sad'); setTimeout(() => onPick('formal'), 650); };
  const phone = typeof window !== 'undefined' && window.innerWidth < 700;
  const card = (bg, border) => ({ background: bg, border: `3px solid ${border}`, borderRadius: 22, padding: '26px 22px', width: phone ? '100%' : 300, cursor: 'pointer', textAlign: 'left', color: '#fff', fontFamily: 'inherit', boxShadow: '0 12px 30px rgba(0,0,0,.35)' });
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: 24, background: 'radial-gradient(circle at 50% 30%, #1f6b3a 0%, #0c3b24 60%, #072616 100%)', color: '#fff', textAlign: 'center', fontFamily: 'Poppins, system-ui, sans-serif' }}>
      <style>{CH_CSS}</style>
      {[8, 22, 37, 55, 70, 86].map((x, i) => <span key={'l' + x} className='ch-leaf' style={{ left: x + '%', fontSize: 20 + (i % 3) * 6, animationDuration: 14 + i * 2.5 + 's', animationDelay: -i * 3 + 's' }}>{i % 2 ? '🍃' : '🌿'}</span>)}
      {[[12, 14], [30, 8], [48, 18], [66, 10], [82, 20], [92, 9], [18, 34], [76, 36]].map(([x, y], i) => <span key={'s' + i} className='ch-star' style={{ left: x + '%', top: y + '%', fontSize: 14, color: '#fff3c4', animationDuration: 2.5 + (i % 4) * 0.7 + 's', animationDelay: -i * 0.6 + 's' }}>✦</span>)}
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 14, letterSpacing: 4, opacity: 0.8, fontWeight: 700 }}>WELCOME TO THE PORTFOLIO OF</div>
        <h1 style={{ fontSize: phone ? 34 : 52, fontWeight: 800, margin: '8px 0 6px', lineHeight: 1.05 }}>Ezhil Nilavan Kalaimani</h1>
        <div style={{ fontSize: 17, opacity: 0.85 }}>How would you like to explore?</div>
      </div>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 680 }}>
        <div style={{ position: 'relative', marginTop: 56, width: phone ? '100%' : 300 }}>
          <div className='ch-ninja'><Ninja face={face} style={{ width: '100%', display: 'block' }} /></div>
          <svg className='ch-hands' viewBox='0 0 118 30' aria-hidden='true'>
            {[[22, 14], [96, 14]].map(([x, y]) => (
              <g key={x}>
                <rect x={x - 12} y={y - 4} width='24' height='20' rx='10' fill='#f3c9a0' stroke='#b98a5a' strokeWidth='2' />
                <path d={`M${x - 6} ${y - 2} v8 M${x} ${y - 3} v9 M${x + 6} ${y - 2} v8`} stroke='#b98a5a' strokeWidth='1.5' strokeLinecap='round' />
              </g>
            ))}
          </svg>
        <button className='ch-card' type='button' onMouseEnter={() => setFace('happy')} onFocus={() => setFace('happy')} onTouchStart={() => setFace('happy')} onMouseLeave={() => setFace('happy')} onClick={() => onPick('game')} style={{ ...card('linear-gradient(160deg,#f7b32b,#e07a1f)', '#fff3c4'), width: '100%' }}>
          <div style={{ fontSize: 42 }}>🎮</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1b1b1b', margin: '6px 0 4px' }}>Play the adventure</div>
          <div style={{ fontSize: 14, color: '#3a2a10' }}>Run, jump and ride through my story with a tiger, an elephant or a peacock.</div>
        </button>
        </div>
        <div style={{ marginTop: 56, width: phone ? '100%' : 300 }}>
        <button className='ch-card' type='button' onMouseEnter={() => setFace('sad')} onFocus={() => setFace('sad')} onTouchStart={() => setFace('sad')} onMouseLeave={() => setFace('happy')} onClick={pickFormal} style={{ ...card('linear-gradient(160deg,#1d1836,#3b2a7a)', '#915EFF'), width: '100%' }}>
          <div style={{ fontSize: 42 }}>📄</div>
          <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 4px' }}>Formal version</div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>A clean, professional view of my experience, education, skills and projects.</div>
        </button>
        </div>
      </div>
      <div style={{ fontSize: 13, opacity: 0.65 }}>You can switch any time from the button on the page.</div>
    </div>
  );
};

const App = () => {
  const [mode, setMode] = useState(initialMode);

  const choose = (m) => {
    setMode(m);
    try {
      localStorage.setItem(KEY, m);
    } catch (e) {
      /* ignore */
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    document.body.style.overflow = mode === 'game' ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mode]);

  if (mode === null) return <Chooser onPick={choose} />;

  if (mode === 'game') {
    return <Adventure onFormal={() => choose('formal')} />;
  }

  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
        <About />
        <Education />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <div className="relative z-0">
          <Contact />
          <StarsCanvas />
        </div>
      </div>
      <button
        type="button"
        onClick={() => choose('game')}
        className="fixed bottom-5 left-5 z-[60] rounded-xl border border-[#915EFF] bg-black px-4 py-2 text-[14px] font-bold text-white hover:bg-[#915EFF]"
      >
        🎮 Game version
      </button>
    </BrowserRouter>
  );
};

export default App;
