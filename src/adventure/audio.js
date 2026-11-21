// Optional sound effects, generated with WebAudio. Muted until the visitor turns them on.
const st = { on: false, ctx: null };

export const isSoundOn = () => st.on;
function ensure() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!st.ctx) {
    st.ctx = new AC();
    st.master = st.ctx.createGain();
    st.master.gain.value = 2.6; // sound effects were too quiet
    st.master.connect(st.ctx.destination);
  }
  if (st.ctx.state === "suspended") st.ctx.resume();
  return st.ctx;
}
// browsers keep audio locked until the visitor touches the page: unlock on the first tap, click or key
if (typeof window !== "undefined") {
  const unlock = () => { if (st.on) ensure(); };
  ["pointerdown", "touchstart", "keydown", "click"].forEach((ev) => window.addEventListener(ev, unlock, { passive: true }));
}
export const setSound = (v) => { st.on = !!v; if (v) ensure(); };

export function sfx(kind) {
  if (!st.on) return;
  try {
    const c = ensure();
    if (!c) return;
    const tone = (type, f0, f1, dur, vol = 0.1, at = 0) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      const t = c.currentTime + at;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(st.master);
      o.start(t);
      o.stop(t + dur + 0.02);
    };
    switch (kind) {
      case "jump": tone("square", 320, 640, 0.16, 0.05); break;
      case "djump": tone("square", 500, 900, 0.16, 0.05); break;
      case "coin": tone("square", 880, 880, 0.07, 0.05); tone("square", 1320, 1320, 0.16, 0.05, 0.07); break;
      case "chest": tone("triangle", 330, 330, 0.12, 0.09); tone("triangle", 440, 440, 0.12, 0.09, 0.12); tone("triangle", 660, 660, 0.3, 0.09, 0.24); break;
      case "roar": tone("sawtooth", 190, 55, 0.8, 0.12); tone("sawtooth", 140, 50, 0.8, 0.08, 0.05); break;
      case "trumpet": tone("sawtooth", 300, 520, 0.18, 0.1); tone("sawtooth", 520, 260, 0.5, 0.1, 0.18); tone("square", 310, 250, 0.5, 0.04, 0.18); break;
      case "peacock": tone("sawtooth", 700, 1100, 0.14, 0.07); tone("sawtooth", 1100, 520, 0.38, 0.07, 0.14); tone("square", 880, 440, 0.3, 0.03, 0.2); break;
      case "flap": tone("triangle", 180, 90, 0.12, 0.06); break;
      case "splash": tone("sawtooth", 900, 120, 0.35, 0.05); break;
      case "swim": tone("sine", 220, 330, 0.18, 0.04); break;
      case "mount": tone("triangle", 260, 520, 0.2, 0.08); break;
      case "win": [523, 659, 784, 1047].forEach((f, i) => tone("triangle", f, f, 0.22, 0.09, i * 0.11)); break;
      case "ach": [659, 880, 1175].forEach((f, i) => tone("square", f, f, 0.18, 0.06, i * 0.1)); tone("triangle", 1568, 1568, 0.4, 0.07, 0.3); break;
      case "whoosh": tone("triangle", 800, 160, 0.3, 0.06); break;
      default: break;
    }
  } catch (e) {
    /* audio unavailable */
  }
}
