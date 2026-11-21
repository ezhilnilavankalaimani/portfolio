// Original flat-style characters used by the game version of the site.
const O = "#F28C28";
const D = "#7A3B0C";
const S = "#1A1209";

const Leg = ({ x, y, cls, color, paw = "#FBD9A6" }) => (
  <g className={`gm-leg ${cls}`} style={{ transformOrigin: `${x}px ${y}px` }}>
    <rect x={x - 11} y={y} width='22' height='34' rx='11' fill={color} />
    <ellipse cx={x + 2} cy={y + 38} rx='15' ry='9' fill={color} />
    <ellipse cx={x + 4} cy={y + 41} rx='11' ry='5' fill={paw} opacity='0.9' />
    <rect x={x - 8} y={y + 12} width='14' height='4' rx='2' fill={S} opacity='0.75' />
  </g>
);

export const Tiger = ({ className = "", style, roar = false, ...rest }) => (
  <svg className={className} style={style} {...rest} viewBox='0 0 300 160' xmlns='http://www.w3.org/2000/svg'>
    {/* tail */}
    <g className='gm-tail'>
      <path d='M66 74 C26 70 14 40 34 24' stroke={O} strokeWidth='15' fill='none' strokeLinecap='round' />
      <path d='M24 36 L38 40 M28 24 L40 30' stroke={S} strokeWidth='5' strokeLinecap='round' />
    </g>
    {/* far legs */}
    <Leg x={96} y={100} cls='b' color={D} paw={D} />
    <Leg x={190} y={100} cls='a' color={D} paw={D} />
    {/* body */}
    <ellipse cx='140' cy='84' rx='80' ry='42' fill={O} />
    <ellipse cx='140' cy='106' rx='60' ry='16' fill='#FFE8C2' />
    <g stroke={S} strokeWidth='7' strokeLinecap='round' fill='none'>
      <path d='M96 50 Q104 66 96 80' />
      <path d='M122 44 Q132 64 122 86' />
      <path d='M150 43 Q160 64 150 88' />
      <path d='M178 46 Q186 64 178 84' />
    </g>
    {/* near legs */}
    <Leg x={110} y={100} cls='a' color={O} />
    <Leg x={204} y={100} cls='b' color={O} />
    {/* head */}
    <circle cx='222' cy='54' r='20' fill='#FFE8C2' opacity='0' />
    <circle cx='236' cy='62' r='38' fill={O} />
    <circle cx='208' cy='30' r='13' fill={O} /><circle cx='208' cy='31' r='7' fill='#FFB3B3' />
    <circle cx='262' cy='28' r='13' fill={O} /><circle cx='262' cy='29' r='7' fill='#FFB3B3' />
    <path d='M226 28 L230 40 M240 24 L240 38 M254 28 L250 40' stroke={S} strokeWidth='5' strokeLinecap='round' />
    <ellipse cx='254' cy='78' rx='22' ry='16' fill='#FFE8C2' />
    <ellipse cx='258' cy='68' rx='7' ry='5' fill='#E8607A' />
    <circle cx='250' cy='56' r='9' fill='#fff' /><circle cx='253' cy='57' r='6' fill={S} /><circle cx='255' cy='54' r='2.4' fill='#fff' />
    <circle cx='224' cy='58' r='7' fill='#fff' /><circle cx='226' cy='59' r='4.5' fill={S} /><circle cx='228' cy='57' r='1.8' fill='#fff' />
    <ellipse cx='236' cy='74' rx='8' ry='5' fill='#FF8FA3' opacity='0.55' />
    <ellipse cx='272' cy='68' rx='7' ry='4.5' fill='#FF8FA3' opacity='0.55' />
    {roar ? <path d='M244 80 Q256 98 270 80 Z' fill='#7a0f0f' stroke={S} strokeWidth='2.5' /> : <path d='M246 80 Q254 87 262 80 M262 80 Q268 86 274 79' stroke={S} strokeWidth='3' fill='none' strokeLinecap='round' />}
  </svg>
);

export const Ninja = ({ className = "", style, ...rest }) => (
  <svg viewBox="0 0 130 200" className={className} style={style} {...rest} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* hero cape */}
    <path d="M40 84 C4 92 -4 140 6 172 C22 160 34 150 44 140Z" fill="#c92b24"/>
    <path d="M40 84 C14 98 8 130 12 152 C26 140 36 126 44 110Z" fill="#e8453c"/>
    <path d="M6 172 C22 160 34 150 44 140" stroke="#f7b32b" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <g className="gm-leg a" style={{ transformOrigin: "52px 146px" }}><rect x="40" y="146" width="24" height="38" rx="10" fill="#1f4d3a"/><rect x="35" y="176" width="34" height="18" rx="9" fill="#d9382f"/></g>
    <g className="gm-leg b" style={{ transformOrigin: "80px 146px" }}><rect x="68" y="146" width="24" height="38" rx="10" fill="#1f4d3a"/><rect x="63" y="176" width="34" height="18" rx="9" fill="#d9382f"/></g>
    <rect x="36" y="84" width="60" height="68" rx="24" fill="#2b6b50"/><rect x="38" y="124" width="56" height="11" fill="#f7b32b"/>
    {/* E shield */}
    <path d="M66 90 L84 96 V114 C84 124 76 130 66 134 C56 130 48 124 48 114 V96 Z" fill="#f7b32b" stroke="#b9791a" strokeWidth="2.5"/>
    <path d="M66 94 L80 99 V113 C80 121 74 126 66 129 C58 126 52 121 52 113 V99 Z" fill="#d9382f"/>
    <path d="M71 102 H59 V122 H71 M59 112 H69" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <g className="av-arm b" style={{ transformOrigin: "31px 98px" }}><rect x="22" y="92" width="18" height="42" rx="9" fill="#2b6b50"/><circle cx="31" cy="138" r="10" fill="#f3c9a0"/></g>
    <g className="av-arm a" style={{ transformOrigin: "101px 98px" }}><rect x="92" y="92" width="18" height="42" rx="9" fill="#2b6b50"/><circle cx="101" cy="138" r="10" fill="#f3c9a0"/></g>
    <circle cx="66" cy="50" r="42" fill="#2b6b50"/>
    <rect x="32" y="34" width="68" height="34" rx="17" fill="#f3c9a0"/>
    <circle cx="51" cy="50" r="14" fill="#fff"/><circle cx="83" cy="50" r="14" fill="#fff"/>
    <circle cx="55" cy="52" r="8" fill="#1a1209"/><circle cx="87" cy="52" r="8" fill="#1a1209"/><circle cx="58" cy="48" r="3" fill="#fff"/><circle cx="90" cy="48" r="3" fill="#fff"/>
    <ellipse cx="40" cy="64" rx="7" ry="4" fill="#ff8fa3" opacity="0.7"/><ellipse cx="94" cy="64" rx="7" ry="4" fill="#ff8fa3" opacity="0.7"/>
    <path d="M42 34 q10 -6 20 -1 M72 33 q10 -5 20 1" stroke="#1a1209" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M32 72 q34 16 68 0 l-4 14 q-30 10 -60 0Z" fill="#1f4d3a"/>
    <path d="M56 78 q10 7 20 0" stroke="#f3c9a0" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.0"/>
    <rect x="28" y="20" width="76" height="14" rx="5" fill="#d9382f"/><rect x="55" y="17" width="24" height="19" rx="5" fill="#f7b32b"/><path d="M101 26 q18 -4 24 8 q-12 0 -22 6Z" fill="#d9382f"/>
  </svg>
);

export const Elephant = ({ className = "", style }) => (
  <svg viewBox="0 0 250 190" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="#8fa8c4"><rect x="56" y="118" width="34" height="62" rx="16"/><rect x="100" y="118" width="34" height="62" rx="16"/><rect x="146" y="118" width="34" height="62" rx="16"/><rect x="186" y="118" width="34" height="62" rx="16"/></g>
    <g fill="#e9eef5"><rect x="58" y="168" width="30" height="12" rx="6"/><rect x="102" y="168" width="30" height="12" rx="6"/><rect x="148" y="168" width="30" height="12" rx="6"/><rect x="188" y="168" width="30" height="12" rx="6"/></g>
    <ellipse cx="125" cy="98" rx="92" ry="62" fill="#a9c1da"/>
    <path d="M40 84 q-26 20 -8 62" stroke="#a9c1da" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <circle cx="208" cy="76" r="44" fill="#a9c1da"/>
    <ellipse cx="174" cy="80" rx="30" ry="42" fill="#8fa8c4"/><ellipse cx="176" cy="82" rx="18" ry="30" fill="#f6b6c6"/>
    <path d="M236 84 q20 24 4 66 q-4 14 -18 8" stroke="#a9c1da" strokeWidth="24" fill="none" strokeLinecap="round"/>
    <circle cx="216" cy="66" r="11" fill="#fff"/><circle cx="219" cy="68" r="7" fill="#1a1209"/><circle cx="221" cy="65" r="2.6" fill="#fff"/>
    <ellipse cx="226" cy="92" rx="8" ry="5" fill="#ff8fa3" opacity="0.6"/>
    <path d="M200 96 q8 8 16 3" stroke="#1a1209" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <rect x="92" y="60" width="62" height="28" rx="12" fill="#d9382f"/><rect x="92" y="69" width="62" height="6" fill="#f7b32b"/>
  </svg>
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
