import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { About, Contact, Education, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from './components';
import Adventure from './adventure/Adventure';

const KEY = 'siteMode';

// Remembers the visitor's choice. Upright phones start on the formal version.
// Every visitor first sees a chooser: the game or the formal site.
const initialMode = () => null;

const Chooser = ({ onPick }) => {
  const phone = typeof window !== 'undefined' && window.innerWidth < 700;
  const card = (bg, border) => ({ background: bg, border: `3px solid ${border}`, borderRadius: 22, padding: '26px 22px', width: phone ? '100%' : 300, cursor: 'pointer', textAlign: 'left', color: '#fff', fontFamily: 'inherit', boxShadow: '0 12px 30px rgba(0,0,0,.35)' });
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, padding: 24, background: 'radial-gradient(circle at 50% 30%, #1f6b3a 0%, #0c3b24 60%, #072616 100%)', color: '#fff', textAlign: 'center', fontFamily: 'Poppins, system-ui, sans-serif' }}>
      <div>
        <div style={{ fontSize: 14, letterSpacing: 4, opacity: 0.8, fontWeight: 700 }}>WELCOME TO THE PORTFOLIO OF</div>
        <h1 style={{ fontSize: phone ? 34 : 52, fontWeight: 800, margin: '8px 0 6px', lineHeight: 1.05 }}>Ezhil Nilavan Kalaimani</h1>
        <div style={{ fontSize: 17, opacity: 0.85 }}>How would you like to explore?</div>
      </div>
      <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: 680 }}>
        <button type='button' onClick={() => onPick('game')} style={card('linear-gradient(160deg,#f7b32b,#e07a1f)', '#fff3c4')}>
          <div style={{ fontSize: 42 }}>🎮</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#1b1b1b', margin: '6px 0 4px' }}>Play the adventure</div>
          <div style={{ fontSize: 14, color: '#3a2a10' }}>Run, jump and ride through my story with a tiger, an elephant or a peacock.</div>
        </button>
        <button type='button' onClick={() => onPick('formal')} style={card('linear-gradient(160deg,#1d1836,#3b2a7a)', '#915EFF')}>
          <div style={{ fontSize: 42 }}>📄</div>
          <div style={{ fontSize: 24, fontWeight: 800, margin: '6px 0 4px' }}>Formal version</div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>A clean, professional view of my experience, education, skills and projects.</div>
        </button>
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
