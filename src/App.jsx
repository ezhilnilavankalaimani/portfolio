import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { About, Contact, Education, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from './components';
import Adventure from './adventure/Adventure';

const KEY = 'siteMode';

// Remembers the visitor's choice. Upright phones start on the formal version.
const initialMode = () => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'game' || saved === 'formal') return saved;
  } catch (e) {
    /* storage unavailable */
  }
  if (typeof window === 'undefined') return 'game';
  // phones held upright start on the formal site; laptops, tablets and sideways phones start on the adventure
  return window.innerWidth < 700 && window.innerHeight > window.innerWidth ? 'formal' : 'game';
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
