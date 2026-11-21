// "Course Clear" certificate poster: drawn as one SVG so it can be shown, downloaded as a PNG, and rendered to a static image for the e-mail.
import { Ninja, Tiger } from "../game/characters";
import cuteFontUrl from "../assets/fonts/ComicRelief-Bold.ttf";

// Cute display font (Comic Relief, SIL Open Font License) with friendly system fall-backs.
export const DISP = "'Cute Poster', 'Comic Relief', 'Chalkboard SE', 'Marker Felt', 'Comic Sans MS', Poppins, sans-serif";
const SERIF = "'Playfair Display', Georgia, Gelasio, Cardo, 'Times New Roman', serif";
const BUB = { paintOrder: "stroke", strokeLinejoin: "round", strokeLinecap: "round" };

export const POSTER_W = 600;
export const POSTER_H = 800;

const STAR = "M0 -16 L4.800 -5 L16 -4.800 L7 3 L10 14.500 L0 8 L-10 14.500 L-7 3 L-16 -4.800 L-4.800 -5Z";

const Frame = ({ children }) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox={`0 0 ${POSTER_W} ${POSTER_H}`} width='100%' style={{ display: "block", borderRadius: 18 }} fontFamily={DISP}>
    {children}
  </svg>
);

const Stats = ({ score, coins, skills, achs, y = 722, dark = "#14532d" }) => (
  <g fontWeight='800' fontSize='17' textAnchor='middle'>
    {[[`⭐ ${score}`, "score"], [`🪙 ${coins}`, "coins"], [`🐟 ${skills}/12`, "skills"], [`🏆 ${achs}/13`, "badges"]].map(([v, l], i) => (
      <g key={l} transform={`translate(${75 + i * 150} ${y})`}>
        <rect x='-62' y='-24' width='124' height='54' rx='14' fill={dark} />
        <text y='-2' fill='#fff'>{v}</text><text y='20' fontSize='12' fill='#bfe8c8'>{l}</text>
      </g>
    ))}
  </g>
);

export const rankOf = (achs) => (achs >= 9 ? "MASTER NINJA" : achs >= 4 ? "SHADOW NINJA" : "ROOKIE NINJA");

const Awarded = ({ who, nameless, achs = 0, color = "#8e1b3a", stroke = "#fff", sub = "#5a3a12", y = 215 }) => (
  <>
    <text x='300' y={y} textAnchor='middle' fontSize='18' fill={sub} letterSpacing='3'>THE NINJA AWARD GOES TO</text>
    {nameless ? (
      <text x='300' y={y + 57} textAnchor='middle' fontSize='34' fontWeight='900' fill={color}>★ ★ ★</text>
    ) : (
      <text x='300' y={y + 57} textAnchor='middle' fontSize={who.length > 12 ? 36 : 46} fontWeight='900' fill={color} stroke={stroke} strokeWidth='9' {...BUB} opacity={who === "Type your name" ? 0.55 : 1}>{who}</text>
    )}
    <path d={`M110 ${y + 73} H490`} stroke={color} strokeWidth='3' strokeLinecap='round' strokeDasharray='2 9' />
    <text x='300' y={y + 103} textAnchor='middle' fontSize='16' fill={sub}>★ {rankOf(achs)} ★ · Chennai → Toronto</text>
  </>
);

const Footer = ({ date, color = "#fff7dd", y = 783 }) => (
  <text x='300' y={y} textAnchor='middle' fontSize='15' fill={color} fontWeight='700'>Ezhil Nilavan Kalaimani · ezhilnilavan.netlify.app{date ? ` · ${date}` : ""}</text>
);

export const POSTER_THEMES = [
  { id: "japan", label: "Japan sakura" },
  { id: "day", label: "Sunny castle" },
  { id: "night", label: "Fireworks night" },
  { id: "sky", label: "Sky balloon" },
  { id: "retro", label: "Retro filmi" },
];

export const Poster = ({ theme = "day", name = "", nameless = false, ...rest }) => {
  const who = (name || "Type your name").slice(0, 26);
  if (theme === "retro") return <RetroPoster who={who} nameless={nameless} {...rest} />;
  if (theme === "japan") return <JapanPoster who={who} nameless={nameless} {...rest} />;
  if (theme === "night") return <NightPoster who={who} nameless={nameless} {...rest} />;
  if (theme === "sky") return <SkyPoster who={who} nameless={nameless} {...rest} />;
  return <DayPoster who={who} nameless={nameless} {...rest} />;
};

const DayPoster = ({ who, nameless, score = 0, coins = 0, skills = 0, achs = 0, date = "" }) => {
  return (
    <Frame>
      <defs>
        <linearGradient id='pk-sky' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stopColor='#4fc3e8' /><stop offset='.6' stopColor='#ffd7a1' /><stop offset='1' stopColor='#ffb86b' /></linearGradient>
      </defs>
      <rect width={POSTER_W} height={POSTER_H} fill='url(#pk-sky)' />
      {/* sun rays */}
      <g opacity='.22' fill='#fff'>
        {Array.from({ length: 12 }, (_, i) => <path key={i} d='M300 330 L260 -60 L340 -60Z' transform={`rotate(${i * 30} 300 330)`} />)}
      </g>
      {/* clouds */}
      <g fill='#fff'><ellipse cx='90' cy='170' rx='70' ry='26' /><ellipse cx='130' cy='155' rx='40' ry='26' /><ellipse cx='500' cy='120' rx='70' ry='24' /><ellipse cx='470' cy='108' rx='36' ry='22' /></g>
      {/* ribbon title */}
      <path d='M30 52 H570 V150 H30Z' fill='#d9382f' /><path d='M30 52 L-8 78 L30 104Z' fill='#a9231b' transform='translate(0 0)' />
      <path d='M570 52 L608 78 L570 104Z' fill='#a9231b' />
      <text x='300' y='96' textAnchor='middle' fontSize='24' fontWeight='800' fill='#ffe9a8' letterSpacing='8'>THE OFFICIAL</text>
      <text x='300' y='136' textAnchor='middle' fontSize='42' fontWeight='900' fill='#fff' letterSpacing='3'>NINJA AWARD!</text>
      {/* stars */}
      {[[70, 230, 1], [530, 250, 1.2], [110, 330, .8], [500, 360, .9], [300, 205, 1.3]].map(([x, y, s], i) => <path key={i} d={STAR} fill='#ffd34d' stroke='#b9791a' strokeWidth='2' transform={`translate(${x} ${y}) scale(${s})`} />)}
      {/* awarded to */}
      <Awarded who={who} nameless={nameless} achs={achs} />
      {/* hills + ground */}
      <path d='M0 560 Q150 470 300 540 T600 520 V800 H0Z' fill='#7cc66a' />
      <path d='M0 610 Q200 560 400 610 T600 590 V800 H0Z' fill='#9ad37a' />
      <rect y='690' width='600' height='110' fill='#8a5a2b' /><rect y='680' width='600' height='22' fill='#9bcf53' />
      {/* castle */}
      <g transform='translate(410 470)'>
        <rect x='0' y='60' width='150' height='150' fill='#c98a5b' stroke='#7a4a22' strokeWidth='4' />
        <g fill='#c98a5b' stroke='#7a4a22' strokeWidth='4'><rect x='0' y='36' width='34' height='28' /><rect x='58' y='36' width='34' height='28' /><rect x='116' y='36' width='34' height='28' /></g>
        <path d='M50 210 V150 a25 25 0 0 1 50 0 V210Z' fill='#4a2b12' />
        <rect x='73' y='-10' width='5' height='48' fill='#7a4a22' /><path d='M78 -10 L110 3 L78 16Z' fill='#d9382f' />
      </g>
      {/* flag pole */}
      <rect x='60' y='430' width='8' height='255' rx='4' fill='#aab3bd' /><circle cx='64' cy='428' r='10' fill='#f7b32b' />
      <path d='M68 442 L128 466 L68 490Z' fill='#d9382f' /><text x='80' y='474' fontSize='20' fontWeight='900' fill='#fff'>E</text>
      {/* characters */}
      <Tiger x='110' y='578' width='190' height='101' />
      <Ninja x='290' y='500' width='124' height='190' />
      <Stats score={score} coins={coins} skills={skills} achs={achs} />
      <Footer date={date} />
    </Frame>
  );
};


const burst = (x, y, r, c, k) => (
  <g key={k} stroke={c} strokeWidth='4' strokeLinecap='round'>
    {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={x + Math.cos(a) * r * 0.45} y1={y + Math.sin(a) * r * 0.45} x2={x + Math.cos(a) * r} y2={y + Math.sin(a) * r} />; })}
    <circle cx={x} cy={y} r='5' fill={c} stroke='none' />
  </g>
);

const NightPoster = ({ who, nameless, score = 0, coins = 0, skills = 0, achs = 0, date = "" }) => (
  <Frame>
    <defs><linearGradient id='pk-night' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stopColor='#2a2160' /><stop offset='.65' stopColor='#6a3a8a' /><stop offset='1' stopColor='#e8846e' /></linearGradient></defs>
    <rect width={POSTER_W} height={POSTER_H} fill='url(#pk-night)' />
    {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={(i * 97) % 600} cy={(i * 53) % 420} r={i % 3 ? 1.6 : 2.6} fill='#fff' opacity='.85' />)}
    <circle cx='500' cy='80' r='34' fill='#fff3b0' /><circle cx='514' cy='72' r='30' fill='#2a2160' />
    {burst(110, 230, 60, "#ffd34d", 1)}{burst(500, 260, 70, "#ff6f91", 2)}{burst(300, 190, 50, "#6cf", 3)}{burst(70, 380, 40, "#9dff8a", 4)}
    {/* site-style 3D heading */}
    {[10, 8, 6, 4, 2].map((d) => <text key={d} x='300' y={118 + d} textAnchor='middle' fontSize='62' fontWeight='900' fill='#8e1b3a'>NINJA</text>)}
    <text x='300' y='118' textAnchor='middle' fontSize='62' fontWeight='900' fill='#f27d8c' stroke='#fff' strokeWidth='6' {...BUB}>NINJA</text>
    {[10, 8, 6, 4, 2].map((d) => <text key={d} x='300' y={186 + d} textAnchor='middle' fontSize='62' fontWeight='900' fill='#8e1b3a'>AWARD!</text>)}
    <text x='300' y='186' textAnchor='middle' fontSize='62' fontWeight='900' fill='#f27d8c' stroke='#fff' strokeWidth='6' {...BUB}>AWARD!</text>
    <Awarded who={who} nameless={nameless} achs={achs} color='#ffe9a8' stroke='#2a2160' sub='#e9dcff' y={268} />
    <path d='M0 600 Q150 520 300 590 T600 570 V800 H0Z' fill='#2f6b4a' />
    <rect y='690' width='600' height='110' fill='#5a3a22' /><rect y='680' width='600' height='22' fill='#4f9a4a' />
    <g transform='translate(410 480)'>
      <rect x='0' y='60' width='150' height='150' fill='#b57a4d' stroke='#5a3a22' strokeWidth='4' />
      <g fill='#b57a4d' stroke='#5a3a22' strokeWidth='4'><rect x='0' y='36' width='34' height='28' /><rect x='58' y='36' width='34' height='28' /><rect x='116' y='36' width='34' height='28' /></g>
      <path d='M50 210 V150 a25 25 0 0 1 50 0 V210Z' fill='#ffd34d' />
      <rect x='73' y='-10' width='5' height='48' fill='#5a3a22' /><path d='M78 -10 L110 3 L78 16Z' fill='#d9382f' />
    </g>
    <Tiger x='110' y='578' width='190' height='101' />
    <Ninja x='290' y='500' width='124' height='190' />
    <Stats score={score} coins={coins} skills={skills} achs={achs} dark='#1d1647' />
    <Footer date={date} />
  </Frame>
);

const SkyPoster = ({ who, nameless, score = 0, coins = 0, skills = 0, achs = 0, date = "" }) => (
  <Frame>
    <defs><linearGradient id='pk-sky2' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stopColor='#4fc3e8' /><stop offset='1' stopColor='#d9f3ff' /></linearGradient></defs>
    <rect width={POSTER_W} height={POSTER_H} fill='url(#pk-sky2)' />
    <g fill='#fff'><ellipse cx='90' cy='350' rx='80' ry='28' /><ellipse cx='140' cy='335' rx='46' ry='28' /><ellipse cx='520' cy='430' rx='80' ry='26' /><ellipse cx='480' cy='418' rx='40' ry='24' /><ellipse cx='60' cy='560' rx='70' ry='24' /></g>
    {[[60, 60, 1], [540, 70, 1.2], [90, 200, .8], [520, 220, 1]].map(([x, y, s], i) => <path key={i} d={STAR} fill='#ffd34d' stroke='#b9791a' strokeWidth='2' transform={`translate(${x} ${y}) scale(${s})`} />)}
    <text x='300' y='70' textAnchor='middle' fontSize='22' fontWeight='800' fill='#14532d' letterSpacing='6'>THE OFFICIAL</text>
    {[8, 6, 4, 2].map((d) => <text key={d} x='300' y={118 + d} textAnchor='middle' fontSize='50' fontWeight='900' fill='#a9231b'>NINJA AWARD!</text>)}
    <text x='300' y='118' textAnchor='middle' fontSize='50' fontWeight='900' fill='#ffcf4a' stroke='#fff' strokeWidth='6' {...BUB}>NINJA AWARD!</text>
    <Awarded who={who} nameless={nameless} achs={achs} y={165} color='#8e1b3a' />
    {/* balloon */}
    <g transform='translate(165 285) scale(.54)'>
      <path d='M250 20 C60 20 40 250 150 350 L350 350 C460 250 440 20 250 20Z' fill='#f7b32b' />
      <path d='M250 20 C170 20 150 250 190 350 L310 350 C350 250 330 20 250 20Z' fill='#d9382f' />
      <path d='M250 20 C220 20 215 250 235 350 L265 350 C285 250 280 20 250 20Z' fill='#14653a' />
      <rect x='110' y='190' width='280' height='40' fill='#fff' opacity='.9' />
      <path d='M150 350 L205 470 M350 350 L295 470 M250 350 V470' stroke='#8a5a2b' strokeWidth='5' />
    </g>
    <Ninja x='254' y='520' width='92' height='141' />
    <g transform='translate(165 285) scale(.54)'><rect x='190' y='470' width='120' height='80' rx='8' fill='#c98a2b' stroke='#6b4a2b' strokeWidth='5' /></g>
    <Tiger x='30' y='598' width='170' height='91' />
    <path d='M0 690 Q150 650 300 690 T600 680 V800 H0Z' fill='#fff' />
    <Stats score={score} coins={coins} skills={skills} achs={achs} y={722} />
    <Footer date={date} color='#14532d' />
  </Frame>
);


const JP = "'Cute Poster', Noto Sans CJK JP, Hiragino Kaku Gothic ProN, Yu Gothic, Meiryo, DejaVu Sans, sans-serif";
const burstPts = (cx, cy, ro, ri, n) =>
  Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2; const r = i % 2 ? ri : ro; return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`; }).join(" ");
const Petal = ({ x, y, r = 0, s = 1, c = "#f9b6c8" }) => (
  <path d='M0 0 C6 -6 14 -4 12 4 C10 10 3 10 0 6 C-3 10 -10 10 -12 4 C-14 -4 -6 -6 0 0Z' fill={c} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
);
const Sparkle = ({ x, y, s = 1, c = "#e0587f" }) => <path d='M0 -14 Q2 -2 14 0 Q2 2 0 14 Q-2 2 -14 0 Q-2 -2 0 -14Z' fill={c} transform={`translate(${x} ${y}) scale(${s})`} />;

const JapanPoster = ({ who, nameless, score = 0, coins = 0, skills = 0, achs = 0, date = "" }) => {
  const placeholder = who === "Type your name";
  const size = nameless ? 70 : Math.max(34, Math.min(92, 500 / (Math.max(who.length, 4) * 0.66)));
  const title = nameless ? "YOU!" : who.toUpperCase();
  const circles = [[`${score}`, "score"], [`${coins}`, "coins"], [`${skills}/12`, "skills"], [`${achs}/13`, "badges"]];
  return (
    <Frame>
      <defs>
        <clipPath id='jp-main'><rect x='40' y='228' width='330' height='392' rx='16' /></clipPath>
        <linearGradient id='jp-sky' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stopColor='#bfe6f6' /><stop offset='.7' stopColor='#fde9dc' /><stop offset='1' stopColor='#fff4c7' /></linearGradient>
      </defs>
      {/* stripes */}
      <rect width='600' height='800' fill='#f1f7e1' />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 100 + 50} width='50' height='800' fill='#cfe6b0' />)}
      <rect x='14' y='14' width='572' height='772' rx='6' fill='none' stroke='#14532d' strokeWidth='4' />
      {/* top banner */}
      <rect x='36' y='34' width='528' height='56' rx='8' fill='#14532d' />
      <text x='300' y='71' textAnchor='middle' fontSize='24' fontWeight='900' fill='#fff4e3' fontFamily={JP} letterSpacing='2'>NINJA AWARD · 忍者賞</text>
      {/* title: the visitor's name */}
      <text x='304' y='178' textAnchor='middle' fontSize={size} fontWeight='900' fill='#f7b32b' opacity={placeholder ? 0.8 : 1}>{title}</text>
      <text x='300' y='174' textAnchor='middle' fontSize={size} fontWeight='900' fill='#14532d' stroke='#fff' strokeWidth='10' {...BUB} opacity={placeholder ? 0.55 : 1}>{title}</text>
      <text x='300' y='212' textAnchor='middle' fontSize='15' fontWeight='800' fill='#14532d' fontFamily={JP} letterSpacing='4'>おめでとう！ · ★ {rankOf(achs)} ★</text>

      {/* main panel */}
      <rect x='40' y='228' width='330' height='392' rx='16' fill='#d6f1e6' stroke='#14532d' strokeWidth='4' />
      <g clipPath='url(#jp-main)'>
        <rect x='40' y='228' width='330' height='392' fill='url(#jp-sky)' />
        <circle cx='262' cy='346' r='54' fill='#e8453c' />
        {/* Mt Fuji */}
        <path d='M20 560 L196 330 L372 560Z' fill='#3f9a6a' />
        <path d='M196 330 L150 392 Q170 380 182 398 Q196 384 210 398 Q224 380 244 392Z' fill='#fff' />
        <g fill='#fff' opacity='.9'><ellipse cx='90' cy='290' rx='38' ry='12' /><ellipse cx='118' cy='282' rx='22' ry='12' /><ellipse cx='330' cy='268' rx='34' ry='11' /></g>
        {/* sakura tree */}
        <path d='M62 560 Q70 470 96 430' stroke='#7a4a2b' strokeWidth='12' fill='none' strokeLinecap='round' />
        {[[96, 420, 46], [62, 440, 34], [128, 436, 36], [88, 392, 30]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#5cb85c' : '#9ac655'} />)}
        {/* torii gate */}
        <g fill='#d9382f'>
          <rect x='288' y='452' width='11' height='108' /><rect x='336' y='452' width='11' height='108' />
          <path d='M276 446 Q318 434 360 446 V458 Q318 448 276 458Z' /><rect x='284' y='472' width='70' height='9' />
        </g>
        <rect x='311' y='458' width='10' height='14' fill='#1b1b1b' />
        {/* ground + seigaiha waves */}
        <rect x='30' y='548' width='350' height='34' fill='#9ad37a' />
        <rect x='30' y='576' width='350' height='50' fill='#2f5fb5' />
        {[0, 1, 2].map((row) => Array.from({ length: 9 }, (_, i) => {
          const cx = 40 + i * 44 + (row % 2) * 22, cy = 600 + row * 14;
          return <g key={`${row}-${i}`} fill='none' stroke='#cfe3ff' strokeWidth='2.5'><path d={`M${cx - 22} ${cy} a22 22 0 0 1 44 0`} /><path d={`M${cx - 14} ${cy} a14 14 0 0 1 28 0`} /><path d={`M${cx - 6} ${cy} a6 6 0 0 1 12 0`} /></g>;
        }))}
        <Tiger x='215' y='496' width='150' height='80' />
        <Ninja x='96' y='366' width='140' height='215' />
        <Petal x={60} y={262} r={20} c='#b6e08a' /><Petal x={150} y={300} r={-30} s={.8} c='#f7d35a' /><Petal x={340} y={420} r={40} s={.9} c='#b6e08a' /><Petal x={250} y={520} r={10} s={.7} c='#f7d35a' /><Petal x={120} y={520} r={-40} s={.8} c='#b6e08a' />
      </g>
      {/* hanko seal */}
      <g transform='translate(318 246) rotate(8)'>
        <rect width='44' height='44' rx='7' fill='#d9382f' /><rect x='4' y='4' width='36' height='36' rx='4' fill='none' stroke='#ffd7d0' strokeWidth='2' />
        <text x='22' y='33' textAnchor='middle' fontSize='28' fontWeight='900' fill='#fff' fontFamily={JP}>完</text>
      </g>
      {/* lantern sticker overlapping the panel corner */}
      <g transform='translate(48 252) rotate(-10)'>
        <rect x='-3' y='-34' width='30' height='7' rx='3' fill='#3a2a1a' /><ellipse cx='12' cy='0' rx='24' ry='30' fill='#e8453c' stroke='#8f1d17' strokeWidth='3' />
        <path d='M-10 -16 Q12 -8 34 -16 M-12 0 H36 M-10 16 Q12 8 34 16' stroke='#8f1d17' strokeWidth='2.5' fill='none' />
        <rect x='-3' y='28' width='30' height='7' rx='3' fill='#3a2a1a' /><path d='M12 35 V52' stroke='#e0b04a' strokeWidth='3' />
        <text x='12' y='7' textAnchor='middle' fontSize='20' fontWeight='900' fill='#ffe9a8' fontFamily={JP}>祭</text>
      </g>
      <Sparkle x={382} y={236} s={1.2} c='#f7b32b' /><Sparkle x={30} y={420} s={.8} c='#14532d' />

      {/* right panel with starburst stickers */}
      <rect x='386' y='228' width='178' height='392' fill='#14532d' rx='6' />
      <polygon points={burstPts(475, 330, 76, 66, 16)} fill='#fff4e3' stroke='#f7b32b' strokeWidth='3' />
      {/* tiger face sticker */}
      <g transform='translate(475 332)'>
        <circle cx='-34' cy='-34' r='15' fill='#f28c28' /><circle cx='-34' cy='-33' r='8' fill='#ffb3b3' /><circle cx='34' cy='-34' r='15' fill='#f28c28' /><circle cx='34' cy='-33' r='8' fill='#ffb3b3' />
        <circle r='46' fill='#f28c28' stroke='#7a3b0c' strokeWidth='3' />
        <path d='M0 -44 V-28 M-16 -42 L-12 -28 M16 -42 L12 -28 M-46 -4 H-34 M46 -4 H34' stroke='#1a1209' strokeWidth='5' strokeLinecap='round' />
        <ellipse cx='0' cy='18' rx='28' ry='20' fill='#ffe8c2' />
        <circle cx='-18' cy='-4' r='9' fill='#fff' /><circle cx='-16' cy='-3' r='6' fill='#1a1209' /><circle cx='-14' cy='-6' r='2.4' fill='#fff' />
        <circle cx='18' cy='-4' r='9' fill='#fff' /><circle cx='16' cy='-3' r='6' fill='#1a1209' /><circle cx='14' cy='-6' r='2.4' fill='#fff' />
        <ellipse cx='0' cy='10' rx='6' ry='4.500' fill='#e8607a' />
        <path d='M-10 20 Q-5 27 0 20 Q5 27 10 20' stroke='#1a1209' strokeWidth='2.800' fill='none' strokeLinecap='round' />
        <ellipse cx='-30' cy='12' rx='7' ry='4.500' fill='#ff8fa3' opacity='.6' /><ellipse cx='30' cy='12' rx='7' ry='4.500' fill='#ff8fa3' opacity='.6' />
      </g>
      <polygon points={burstPts(475, 512, 76, 66, 16)} fill='#fff4e3' stroke='#f7b32b' strokeWidth='3' />
      {/* peacock sticker */}
      <g transform='translate(475 514)'>
        {[-72, -48, -24, 0, 24, 48, 72].map((a) => (
          <g key={a} transform={`rotate(${a} 0 26)`}>
            <ellipse cx='0' cy='-14' rx='11' ry='36' fill={a % 48 === 0 ? '#2f8a57' : '#1f9fb0'} stroke='#14532d' strokeWidth='2' />
            <circle cx='0' cy='-38' r='7.500' fill='#f7b32b' /><circle cx='0' cy='-38' r='3.800' fill='#1f5fb0' />
          </g>
        ))}
        <ellipse cx='0' cy='34' rx='22' ry='19' fill='#1f9fb0' stroke='#14532d' strokeWidth='2.500' />
        <ellipse cx='0' cy='40' rx='13' ry='11' fill='#bfeee6' />
        <circle cx='0' cy='6' r='16' fill='#1f9fb0' stroke='#14532d' strokeWidth='2.500' />
        <g stroke='#14532d' strokeWidth='2.500' strokeLinecap='round'><path d='M-6 -8 L-9 -20 M0 -10 V-23 M6 -8 L9 -20' /></g>
        {[[-9, -21], [0, -24], [9, -21]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r='3.500' fill='#f7b32b' stroke='#14532d' strokeWidth='1.500' />)}
        <circle cx='-6' cy='3' r='4.500' fill='#fff' /><circle cx='6' cy='3' r='4.500' fill='#fff' />
        <circle cx='-5.500' cy='3.500' r='2.600' fill='#1a1209' /><circle cx='6.500' cy='3.500' r='2.600' fill='#1a1209' />
        <path d='M-3 10 L0 16 L3 10Z' fill='#f28c28' stroke='#8a4a0c' strokeWidth='1' />
        <ellipse cx='-12' cy='11' rx='4' ry='2.800' fill='#ff8fa3' opacity='.6' /><ellipse cx='12' cy='11' rx='4' ry='2.800' fill='#ff8fa3' opacity='.6' />
        <path d='M-7 52 V60 M7 52 V60' stroke='#f28c28' strokeWidth='3' strokeLinecap='round' />
      </g>
      <Sparkle x={560} y={232} s={.9} c='#f7b32b' /><Sparkle x={398} y={606} s={.7} c='#f7b32b' />

      {/* bottom strip with four round badges */}
      <rect x='36' y='634' width='528' height='104' fill='#2f8a57' rx='6' />
      {circles.map(([v, l], i) => (
        <g key={l} transform={`translate(${112 + i * 125} 686)`}>
          <circle r='41' fill='#fff4e3' stroke='#14532d' strokeWidth='4' />
          <text y='3' textAnchor='middle' fontSize={v.length > 4 ? 19 : 25} fontWeight='900' fill='#14532d'>{v}</text>
          <text y='22' textAnchor='middle' fontSize='12' fontWeight='800' fill='#2f8a57' letterSpacing='1'>{l}</text>
        </g>
      ))}
      {[[180, 646], [305, 730], [430, 646], [56, 730], [545, 730]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} s={.55} c='#f7b32b' />)}
      <text x='300' y='764' textAnchor='middle' fontSize='14' fontWeight='800' fill='#14532d'>Ezhil Nilavan Kalaimani · ezhilnilavan.netlify.app{date ? ` · ${date}` : ""}</text>
      <text x='300' y='782' textAnchor='middle' fontSize='11' fontWeight='700' fill='#2f8a57' fontFamily={JP} letterSpacing='3'>CHENNAI → TORONTO · ありがとう</text>
    </Frame>
  );
};


const Swirl = ({ x, y, r = 0, f = 1, c = "#e0a43a" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${f} 1)`} fill='none' stroke={c} strokeWidth='5' strokeLinecap='round'>
    <path d='M0 0 C30 -4 52 12 44 34 C38 50 18 50 14 36 C11 26 22 20 28 28' />
    <path d='M0 0 C-4 30 12 52 34 44' opacity='.8' />
    <circle cx='44' cy='34' r='3.500' fill={c} stroke='none' />
  </g>
);

const RetroPoster = ({ who, nameless, score = 0, coins = 0, skills = 0, achs = 0, date = "" }) => {
  const placeholder = who === "Type your name";
  const nm = nameless ? "Your Name" : who;
  const size = Math.max(30, Math.min(58, 400 / (Math.max(nm.length, 5) * 0.5)));
  return (
    <Frame>
      <defs>
        <clipPath id='rt-arch'><ellipse cx='300' cy='330' rx='214' ry='262' /></clipPath>
        <linearGradient id='rt-bg' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stopColor='#1b7f86' /><stop offset='1' stopColor='#2fa3a0' /></linearGradient>
      </defs>
      <rect width='600' height='800' fill='#ead8b3' />
      <rect x='18' y='18' width='564' height='764' rx='10' fill='url(#rt-bg)' stroke='#c47a1c' strokeWidth='6' />
      {/* swirly clouds */}
      <g fill='none' stroke='#7fd0c8' strokeWidth='5' opacity='.55' strokeLinecap='round'>
        {[[90, 120, 50], [500, 90, 44], [70, 330, 40], [530, 380, 48], [110, 560, 42], [500, 540, 46]].map(([x, y, r], i) => (
          <path key={i} d={`M${x - r} ${y} a${r / 2} ${r / 2} 0 0 1 ${r} 0 a${r / 2} ${r / 2} 0 0 1 ${r} 0 M${x - r + 10} ${y + 14} a${r / 3} ${r / 3} 0 0 1 ${r * 1.4} 0`} />
        ))}
      </g>
      {/* ornate corners */}
      <Swirl x={34} y={34} /><Swirl x={566} y={34} f={-1} /><Swirl x={34} y={560} r={-90} /><Swirl x={566} y={560} r={-90} f={-1} c='#e0a43a' />
      {/* sun rays + arch */}
      <ellipse cx='300' cy='330' rx='226' ry='274' fill='#f6d27a' stroke='#c47a1c' strokeWidth='8' />
      <ellipse cx='300' cy='330' rx='214' ry='262' fill='#1d6f83' />
      <g clipPath='url(#rt-arch)'>
        <g opacity='.35' fill='#ffd86b'>{Array.from({ length: 14 }, (_, i) => <path key={i} d='M300 330 L260 40 L340 40Z' transform={`rotate(${i * 25.7} 300 330)`} />)}</g>
        <circle cx='300' cy='250' r='70' fill='#ffd86b' stroke='#c47a1c' strokeWidth='5' />
        <circle cx='300' cy='250' r='54' fill='#ffe9a0' />
        <g stroke='#c47a1c' strokeWidth='4' strokeLinecap='round' opacity='.7'>{Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <line key={i} x1={300 + Math.cos(a) * 78} y1={250 + Math.sin(a) * 78} x2={300 + Math.cos(a) * 98} y2={250 + Math.sin(a) * 98} />; })}</g>
        {/* great-wave style curls (own drawing) */}
        <path d='M86 600 V470 Q130 420 190 450 Q150 460 160 500 Q220 470 270 520 Q330 440 420 470 Q380 480 380 520 Q470 480 520 540 V600Z' fill='#f4f1e8' stroke='#144a63' strokeWidth='4' />
        <path d='M86 600 V520 Q150 500 200 540 Q260 520 300 560 Q380 520 440 560 Q490 540 520 570 V600Z' fill='#2a77b8' />
        <path d='M86 600 V570 Q170 550 240 585 Q320 560 400 590 Q470 570 520 595 V600Z' fill='#144a63' />
        {[[120, 500], [250, 505], [380, 495], [470, 520]].map(([x, y], i) => <path key={i} d={`M${x} ${y} q12 -22 26 0`} fill='none' stroke='#fff' strokeWidth='3' />)}
        {/* swallows */}
        {[[420, 170, 1], [470, 205, .8], [150, 200, .8]].map(([x, y, k], i) => <path key={i} d='M0 0 Q12 -14 26 -2 Q14 -4 8 6 Q4 -2 0 0Z' fill='#1a1209' transform={`translate(${x} ${y}) scale(${k})`} />)}
      </g>
      <Ninja x='210' y='330' width='170' height='261' />
      <Tiger x='355' y='498' width='140' height='75' />
      <path d='M80 520 Q60 560 100 566' fill='none' stroke='#c47a1c' strokeWidth='0' />
      {/* heading */}
      <text x='300' y='62' textAnchor='middle' fontSize='12' fontWeight='700' fill='#ffe9a0' fontFamily={SERIF} letterSpacing='2'>EZHIL NILAVAN KALAIMANI PRESENTS</text>
      {/* red cartouche */}
      <ellipse cx='300' cy='674' rx='262' ry='80' fill='#c8283a' stroke='#f6d27a' strokeWidth='6' />
      <ellipse cx='300' cy='674' rx='248' ry='68' fill='none' stroke='#f6d27a' strokeWidth='2' strokeDasharray='2 7' />
      <text x='300' y='634' textAnchor='middle' fontSize='18' fontWeight='700' fill='#ffe9a0' fontFamily={SERIF} letterSpacing='7'>THE NINJA AWARD</text>
      <text x='300' y='696' textAnchor='middle' fontSize={size} fontWeight='900' fill='#fff4e3' stroke='#7a1220' strokeWidth='7' {...BUB} opacity={placeholder ? 0.6 : 1}>{nm}</text>
      <text x='300' y='724' textAnchor='middle' fontSize='13' fontWeight='700' fill='#ffe9a0' fontFamily={SERIF}>★ {rankOf(achs)} ★ · {score} pts · {skills}/12 skills</text>
      <text x='300' y='774' textAnchor='middle' fontSize='11' fontWeight='700' fill='#7a1220' fontFamily={SERIF} letterSpacing='1'>NOW SHOWING WORLDWIDE{date ? ` · ${date.toUpperCase()}` : ""}</text>
    </Frame>
  );
};

// the cute font, inlined so the downloaded PNG looks the same as the preview
let fontCache = null;
function fontCss() {
  if (fontCache) return fontCache;
  fontCache = fetch(cuteFontUrl)
    .then((r) => r.blob())
    .then((b) => new Promise((res) => { const f = new FileReader(); f.onload = () => res(`@font-face{font-family:'Cute Poster';font-weight:700;src:url(${f.result}) format('truetype');}`); f.readAsDataURL(b); }))
    .catch(() => "");
  return fontCache;
}

// Draws the poster to a PNG data URL (used by the Download button).
export function posterToPng(svgEl, scale = 2) {
  return new Promise((resolve, reject) => {
    fontCss().then((css) => {
    const xml = new XMLSerializer().serializeToString(svgEl).replace(/(<svg[^>]*>)/, `$1<style>${css}</style>`);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = POSTER_W * scale; c.height = POSTER_H * scale;
      const ctx = c.getContext("2d");
      // Safari paints SVG text only after the embedded font has decoded, so draw, wait, draw again.
      ctx.drawImage(img, 0, 0, c.width, c.height);
      setTimeout(() => {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        setTimeout(() => {
          ctx.clearRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/png"));
        }, 350);
      }, 350);
    };
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    }).catch(reject);
  });
}
