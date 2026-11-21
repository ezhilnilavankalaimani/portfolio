// Original flat-style characters used by the game version of the site.
const O = "#F28C28";
const D = "#7A3B0C";
const S = "#1A1209";

const Leg = ({ x, y, cls, color }) => (
  <g className={`gm-leg ${cls}`} style={{ transformOrigin: `${x}px ${y}px` }}>
    <path
      d={`M${x - 7} ${y} L${x + 7} ${y} L${x + 5} ${y + 44} L${x + 11} ${y + 50} L${x - 9} ${y + 50} L${x - 5} ${y + 44} Z`}
      fill={color}
    />
    <rect x={x - 4} y={y + 18} width='9' height='3' fill={S} opacity='0.8' />
    <rect x={x - 4} y={y + 30} width='9' height='3' fill={S} opacity='0.8' />
  </g>
);

export const Tiger = ({ className = "", style, roar = false }) => (
  <svg className={className} style={style} viewBox='0 0 300 160' xmlns='http://www.w3.org/2000/svg'>
          {/* tail */}
          <g className='gm-tail'>
            <path d='M62 62 C20 50 12 20 30 8' stroke={O} strokeWidth='11' fill='none' strokeLinecap='round' />
            <path d='M24 14 L34 20 M18 30 L30 32' stroke={S} strokeWidth='4' />
          </g>
          {/* far legs */}
          <Leg x={92} y={92} cls='b' color={D} />
          <Leg x={196} y={92} cls='a' color={D} />
          {/* body */}
          <ellipse cx='140' cy='76' rx='88' ry='36' fill={O} />
          <ellipse cx='140' cy='94' rx='70' ry='16' fill='#FBD9A6' opacity='0.85' />
          {/* stripes */}
          <g stroke={S} strokeWidth='6' strokeLinecap='round' fill='none'>
            <path d='M92 44 Q98 62 90 76' />
            <path d='M116 40 Q124 60 116 80' />
            <path d='M142 39 Q150 60 142 82' />
            <path d='M168 40 Q176 60 168 80' />
            <path d='M194 44 Q198 60 192 76' />
          </g>
          {/* near legs */}
          <Leg x={104} y={92} cls='a' color={O} />
          <Leg x={208} y={92} cls='b' color={O} />
          {/* neck + head */}
          <ellipse cx='226' cy='58' rx='26' ry='22' fill={O} />
          <circle cx='252' cy='52' r='24' fill={O} />
          <circle cx='238' cy='32' r='8' fill={O} />
          <circle cx='238' cy='32' r='4' fill='#FBD9A6' />
          <circle cx='262' cy='30' r='8' fill={O} />
          <circle cx='262' cy='30' r='4' fill='#FBD9A6' />
          <path d='M240 38 L246 48 M252 34 L254 46 M264 38 L260 48' stroke={S} strokeWidth='4' strokeLinecap='round' />
          <ellipse cx='268' cy='62' rx='14' ry='11' fill='#FBD9A6' />
          <ellipse cx='278' cy='56' rx='5' ry='4' fill={S} />
          <circle cx='258' cy='48' r='3.5' fill={S} />
          <circle cx='259' cy='47' r='1.2' fill='#fff' />
          {roar ? <path d='M264 66 Q274 80 284 66 Z' fill='#7a0f0f' stroke={S} strokeWidth='2' /> : <path d='M264 66 Q272 70 282 65' stroke={S} strokeWidth='2.5' fill='none' />}
          <path d='M232 44 L226 52 M236 62 L230 68' stroke={S} strokeWidth='4' strokeLinecap='round' />
        </svg>
);

export const Ninja = ({ className = "", style }) => (
  <svg viewBox="0 0 130 200" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M30 70 q-34 6 -28 34 q18 -10 36 -6Z" fill="#d9382f"/>
<rect x="38" y="84" width="56" height="64" rx="12" fill="#1f4d3a"/><rect x="38" y="116" width="56" height="9" fill="#f7b32b"/>
<rect x="40" y="146" width="22" height="44" rx="6" fill="#16372a"/><rect x="70" y="146" width="22" height="44" rx="6" fill="#16372a"/>
<rect x="30" y="92" width="14" height="40" rx="7" fill="#1f4d3a"/><rect x="88" y="92" width="14" height="40" rx="7" fill="#1f4d3a"/>
<rect x="104" y="40" width="7" height="110" fill="#8a6340"/><circle cx="107" cy="38" r="9" fill="#f7b32b"/>
<circle cx="66" cy="52" r="32" fill="#1f4d3a"/><rect x="38" y="42" width="56" height="20" rx="6" fill="#f3c9a0"/>
<rect x="34" y="30" width="64" height="13" fill="#d9382f"/><rect x="56" y="28" width="20" height="17" rx="3" fill="#f7b32b"/>
<circle cx="55" cy="52" r="4" fill="#1a1209"/><circle cx="77" cy="52" r="4" fill="#1a1209"/></svg>
);

export const Elephant = ({ className = "", style }) => (
  <svg viewBox="0 0 250 190" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<g fill="#8fa3b5"><rect x="48" y="110" width="30" height="70" rx="8"/><rect x="92" y="110" width="30" height="70" rx="8"/><rect x="140" y="110" width="30" height="70" rx="8"/><rect x="182" y="110" width="30" height="70" rx="8"/></g>
<ellipse cx="125" cy="90" rx="95" ry="58" fill="#a7b9c9"/><path d="M30 80 q-22 20 -6 60" stroke="#a7b9c9" strokeWidth="9" fill="none" strokeLinecap="round"/>
<circle cx="205" cy="70" r="40" fill="#a7b9c9"/><ellipse cx="178" cy="75" rx="26" ry="38" fill="#8fa3b5"/>
<path d="M232 78 q22 20 6 70 q-4 16 -16 8" stroke="#a7b9c9" strokeWidth="22" fill="none" strokeLinecap="round"/>
<path d="M220 100 q18 12 26 4" stroke="#fff6dd" strokeWidth="9" fill="none" strokeLinecap="round"/>
<circle cx="218" cy="62" r="4" fill="#1a1209"/><rect x="95" y="60" width="60" height="26" rx="8" fill="#d9382f"/><rect x="95" y="68" width="60" height="6" fill="#f7b32b"/></svg>
);

export const Parrot = ({ className = "", style }) => (
  <svg viewBox="0 0 90 110" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<rect x="0" y="92" width="90" height="10" rx="5" fill="#a07a50"/><ellipse cx="45" cy="58" rx="24" ry="36" fill="#2fb56a"/>
<ellipse cx="38" cy="64" rx="12" ry="22" fill="#1f8a50"/><circle cx="48" cy="26" r="17" fill="#2fb56a"/>
<path d="M60 24 q18 4 10 18 q-8 -4 -10 -8Z" fill="#f7b32b"/><circle cx="50" cy="22" r="4" fill="#fff"/><circle cx="51" cy="22" r="2" fill="#1a1209"/>
<path d="M40 92 l-6 16 M52 92 l6 16" stroke="#d9382f" strokeWidth="5"/></svg>
);

export const Plane = ({ className = "", style }) => (
  <svg viewBox="0 0 260 110" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M10 52 L38 40 L38 66Z" fill="#d9382f"/><path d="M14 40 L30 12 L44 12 L40 44Z" fill="#d9382f"/>
<ellipse cx="120" cy="54" rx="100" ry="26" fill="#fff"/><path d="M60 54 q60 -34 150 -4 l-8 12 q-70 10 -142 -8Z" fill="#f7b32b" opacity=".0"/>
<rect x="60" y="44" width="116" height="9" fill="#d9382f"/><circle cx="104" cy="50" r="9" fill="#4fc3e8" stroke="#14653a" strokeWidth="3"/><circle cx="134" cy="50" r="9" fill="#4fc3e8" stroke="#14653a" strokeWidth="3"/><circle cx="164" cy="50" r="9" fill="#4fc3e8" stroke="#14653a" strokeWidth="3"/>
<path d="M104 70 L150 70 L118 100 L96 100Z" fill="#f7b32b" stroke="#c47f10" strokeWidth="2"/>
<path d="M150 36 L120 8 L136 8 L176 38Z" fill="#f7b32b"/>
<rect x="214" y="40" width="14" height="28" rx="5" fill="#8a6340"/><rect x="226" y="20" width="6" height="68" rx="3" fill="#555"/></svg>
);

export const Trophy = ({ className = "", style }) => (
  <svg viewBox="0 0 150 190" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M30 20 h90 v50 q0 46 -45 50 q-45 -4 -45 -50Z" fill="#f7b32b"/><path d="M30 34 q-26 0 -22 24 q4 22 28 24" fill="none" stroke="#f7b32b" strokeWidth="9"/><path d="M120 34 q26 0 22 24 q-4 22 -28 24" fill="none" stroke="#f7b32b" strokeWidth="9"/><rect x="66" y="118" width="18" height="30" fill="#e09a14"/><rect x="40" y="146" width="70" height="16" rx="5" fill="#c47f10"/><rect x="30" y="160" width="90" height="22" rx="6" fill="#8a5a1b"/><path d="M75 36 l7 16 17 2 -13 11 4 17 -15 -9 -15 9 4 -17 -13 -11 17 -2Z" fill="#fff6c8"/></svg>
);
