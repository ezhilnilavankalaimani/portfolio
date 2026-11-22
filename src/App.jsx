import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { About, Contact, Education, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from './components';
import Adventure from './adventure/Adventure';
import { Ninja } from './game/characters';
import AppleSite from './apple/AppleSite';
import memojiHand from './assets/apple/memoji_hand.png';
import memojiBody from './assets/apple/memoji_body.png';

const KEY = 'siteMode';

// Remembers the visitor's choice. Upright phones start on the formal version.
// Every visitor first sees a chooser: the game or the formal site.

const CH_CSS = `
@keyframes ch-peek {
  0%, 18% { transform: translateY(120px) rotate(0deg); }
  27% { transform: translateY(8px) rotate(-5deg); }
  33% { transform: translateY(0) rotate(4deg); }
  40% { transform: translateY(0) rotate(-4deg); }
  47% { transform: translateY(2px) rotate(3deg); }
  54% { transform: translateY(120px) rotate(0deg); }
  66% { transform: translateY(120px) rotate(0deg); }
  72% { transform: translateY(30px) rotate(6deg); }
  78% { transform: translateY(26px) rotate(-3deg); }
  84% { transform: translateY(26px) rotate(5deg); }
  92%, 100% { transform: translateY(120px) rotate(0deg); }
}
@keyframes ch-me {
  0%, 24% { transform: translateY(108px); }
  34%, 68% { transform: translateY(0); }
  78%, 100% { transform: translateY(108px); }
}
@keyframes ch-wave {
  0%, 34% { transform: rotate(0deg); }
  40% { transform: rotate(-16deg); }
  47% { transform: rotate(16deg); }
  54% { transform: rotate(-16deg); }
  61% { transform: rotate(12deg); }
  67%, 100% { transform: rotate(0deg); }
}
@keyframes ch-cape {
  0%, 100% { transform: rotate(14deg) scale(1.2, 1.02) skewY(5deg); }
  30% { transform: rotate(30deg) scale(1.45, .97) skewY(11deg); }
  62% { transform: rotate(9deg) scale(1.12, 1.05) skewY(2deg); }
}
@keyframes ch-tail {
  0%, 100% { transform: rotate(-8deg) scaleX(1.1); }
  50% { transform: rotate(10deg) scaleX(1.45); }
}
.ch-ninja svg > path:nth-of-type(-n+3) { transform-box: fill-box; transform-origin: 100% 0; animation: ch-cape 1.3s ease-in-out infinite; }
.ch-ninja svg > path:last-of-type { transform-box: fill-box; transform-origin: 0 50%; animation: ch-tail .9s ease-in-out infinite; }
.ch-ninja { position: absolute; left: 50px; top: -112px; width: 86px; z-index: 0; pointer-events: none; transform-origin: 50% 100%; animation: ch-peek 11s ease-in-out infinite; }
.ch-me { position: absolute; right: 44px; top: -100px; width: 112px; z-index: 0; pointer-events: none; animation: ch-me 8s ease-in-out infinite; }
.ch-me img { display: block; width: 100%; }
.ch-me .ch-wv { position: absolute; left: 65.5%; top: 8%; width: 34.5%; transform-origin: 50% 96%; animation: ch-wave 8s ease-in-out infinite; }
.ch-card { position: relative; z-index: 1; display: block; width: 100%; text-align: left; font-family: inherit; cursor: pointer; border: 0; border-radius: 28px; padding: 34px 30px; transition: transform .2s ease, box-shadow .2s ease; }
.ch-card:hover { transform: translateY(-5px); }
.ch-tag { font-size: 13px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; }
.ch-h { font-size: 27px; font-weight: 700; letter-spacing: -.5px; margin: 8px 0; }
.ch-p { font-size: 16px; line-height: 1.45; margin: 0 0 22px; }
.ch-go { font-size: 17px; font-weight: 500; }
@media (prefers-reduced-motion: reduce) { .ch-ninja, .ch-me, .ch-wv, .ch-ninja svg > path { animation: none; } .ch-ninja { transform: translateY(40px); } .ch-me { transform: translateY(8px); } }
`;

// After "Restart adventure" the page reloads; go straight back to the start of the game instead of the chooser.
const initialMode = () => {
  try {
    if (sessionStorage.getItem('advRestart')) { sessionStorage.removeItem('advRestart'); return 'game'; }
  } catch (e) { /* ignore */ }
  return null;
};

const Chooser = ({ onPick }) => {
  const [face, setFace] = useState('surprised');
  useEffect(() => { const t = setTimeout(() => setFace((f) => (f === 'surprised' ? 'happy' : f)), 2600); return () => clearTimeout(t); }, []);
  const pickFormal = () => { setFace('sad'); setTimeout(() => onPick('formal'), 650); };
  const phone = typeof window !== 'undefined' && window.innerWidth < 760;
  const wrap = { position: 'relative', marginTop: phone ? 130 : 116, width: phone ? '100%' : 360, maxWidth: 400 };
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '24px 20px', background: '#f5f5f7', color: '#1d1d1f', textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif' }}>
      <style>{CH_CSS}</style>
      <div style={{ fontSize: 15, color: '#6e6e73', fontWeight: 600 }}>Welcome to the portfolio of</div>
      <h1 style={{ fontSize: phone ? 38 : 60, fontWeight: 700, letterSpacing: -1.5, margin: '4px 0', lineHeight: 1.05 }}>Ezhil Nilavan Kalaimani</h1>
      <div style={{ fontSize: phone ? 18 : 21, color: '#6e6e73' }}>How would you like to explore?</div>
      <div style={{ display: 'flex', gap: phone ? 8 : 28, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        <div style={wrap}>
          <div className='ch-ninja'><Ninja face={face} style={{ width: '100%', display: 'block' }} /></div>
          <button className='ch-card' type='button' onMouseEnter={() => setFace('happy')} onFocus={() => setFace('happy')} onTouchStart={() => setFace('happy')} onMouseLeave={() => setFace('happy')} onClick={() => onPick('game')} style={{ background: '#1d1d1f', color: '#f5f5f7', boxShadow: '0 10px 40px rgba(0,0,0,.12)' }}>
            <div className='ch-tag' style={{ color: '#64d2ff' }}>Interactive</div>
            <div className='ch-h'>Play the adventure</div>
            <p className='ch-p' style={{ color: '#a1a1a6' }}>Run, jump and ride through my story, level by level.</p>
            <span className='ch-go' style={{ color: '#64d2ff' }}>Start playing &rsaquo;</span>
          </button>
        </div>
        <div style={wrap}>
          <div className='ch-me'><img src={memojiBody} alt='' /><img className='ch-wv' src={memojiHand} alt='' /></div>
          <button className='ch-card' type='button' onMouseEnter={() => setFace('sad')} onFocus={() => setFace('sad')} onTouchStart={() => setFace('sad')} onMouseLeave={() => setFace('happy')} onClick={pickFormal} style={{ background: '#fff', color: '#1d1d1f', boxShadow: '0 10px 40px rgba(0,0,0,.08)' }}>
            <div className='ch-tag' style={{ color: '#0071e3' }}>Classic</div>
            <div className='ch-h'>Scroll my portfolio</div>
            <p className='ch-p' style={{ color: '#6e6e73' }}>Experience, studies, skills, projects and accolades in one clean page.</p>
            <span className='ch-go' style={{ color: '#0071e3' }}>Open portfolio &rsaquo;</span>
          </button>
        </div>
      </div>
      <div style={{ marginTop: 36, fontSize: 13, color: '#86868b' }}>You can switch any time from the button on the page.</div>
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

  // Classic = the new Apple-style site. Add ?old to the address to see the previous formal site.
  if (typeof window === 'undefined' || !new URLSearchParams(window.location.search).has('old')) {
    return <AppleSite onGame={() => choose('game')} />;
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
        <div className="relative z-10 pb-8 text-center text-[12px] text-secondary">
          &copy; {new Date().getFullYear()} Ezhil Nilavan Kalaimani. All rights reserved.
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
