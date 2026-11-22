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

export const Tiger = ({ className = "", style, roar = false, gear = false, ...rest }) => (
  <svg className={className} style={style} {...rest} viewBox='0 0 300 160' xmlns='http://www.w3.org/2000/svg'>
    {/* tail */}
    <g className='gm-tail'>
      <path d='M66 74 C26 70 14 40 34 24' stroke={O} strokeWidth='15' fill='none' strokeLinecap='round' />
      <path d='M24 36 L38 40 M28 24 L40 30' stroke={S} strokeWidth='5' strokeLinecap='round' />
    </g>
    {/* far legs */}
    <Leg x={96} y={100} cls='b' color={D} paw={D} />
    <Leg x={190} y={100} cls='a' color={D} paw={D} />
    {gear && <Cape d='M176 54 Q130 34 82 62 Q110 80 98 102 Q150 88 190 94Z' ox={176} oy={60} />}
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
    {gear && <Band x={202} y={34} w={70} h={10} />}
    {roar ? <path d='M244 80 Q256 98 270 80 Z' fill='#7a0f0f' stroke={S} strokeWidth='2.5' /> : <path d='M246 80 Q254 87 262 80 M262 80 Q268 86 274 79' stroke={S} strokeWidth='3' fill='none' strokeLinecap='round' />}
  </svg>
);

export const Ninja = ({ className = "", style, face = "happy", ...rest }) => (
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
    {face === "surprised" ? <>
      <circle cx="51" cy="50" r="16" fill="#fff"/><circle cx="83" cy="50" r="16" fill="#fff"/>
      <circle cx="53" cy="51" r="5" fill="#1a1209"/><circle cx="85" cy="51" r="5" fill="#1a1209"/>
      <path d="M104 30 q4 6 0 10 q-4 -4 0 -10Z" fill="#7fd3f7"/>
    </> : face === "sad" ? <>
      <circle cx="51" cy="54" r="14" fill="#fff"/><circle cx="83" cy="54" r="14" fill="#fff"/>
      <circle cx="52" cy="58" r="8" fill="#1a1209"/><circle cx="84" cy="58" r="8" fill="#1a1209"/><circle cx="55" cy="55" r="3" fill="#fff"/><circle cx="87" cy="55" r="3" fill="#fff"/>
      <path d="M44 74 q-5 9 0 13 q5 -4 0 -13Z" fill="#7fd3f7"/>
    </> : <>
      <circle cx="51" cy="50" r="14" fill="#fff"/><circle cx="83" cy="50" r="14" fill="#fff"/>
      <circle cx="55" cy="52" r="8" fill="#1a1209"/><circle cx="87" cy="52" r="8" fill="#1a1209"/><circle cx="58" cy="48" r="3" fill="#fff"/><circle cx="90" cy="48" r="3" fill="#fff"/>
    </>}
    <ellipse cx="40" cy="64" rx="7" ry="4" fill="#ff8fa3" opacity="0.7"/><ellipse cx="94" cy="64" rx="7" ry="4" fill="#ff8fa3" opacity="0.7"/>
    <path d={face === "surprised" ? "M40 28 q10 -7 20 0 M72 28 q10 -7 20 0" : face === "sad" ? "M40 40 l22 -8 M94 40 l-22 -8" : "M42 34 q10 -6 20 -1 M72 33 q10 -5 20 1"} stroke="#1a1209" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M32 72 q34 16 68 0 l-4 14 q-30 10 -60 0Z" fill="#1f4d3a"/>
    <path d="M56 78 q10 7 20 0" stroke="#f3c9a0" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.0"/>
    <rect x="28" y="20" width="76" height="14" rx="5" fill="#d9382f"/><rect x="55" y="17" width="24" height="19" rx="5" fill="#f7b32b"/><path d="M101 26 q18 -4 24 8 q-12 0 -22 6Z" fill="#d9382f"/>
  </svg>
);

export const Elephant = ({ className = "", style, gear = false }) => (
  <svg viewBox="0 0 250 190" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="#8fa8c4"><rect x="56" y="118" width="34" height="62" rx="16"/><rect x="100" y="118" width="34" height="62" rx="16"/><rect x="146" y="118" width="34" height="62" rx="16"/><rect x="186" y="118" width="34" height="62" rx="16"/></g>
    <g fill="#e9eef5"><rect x="58" y="168" width="30" height="12" rx="6"/><rect x="102" y="168" width="30" height="12" rx="6"/><rect x="148" y="168" width="30" height="12" rx="6"/><rect x="188" y="168" width="30" height="12" rx="6"/></g>
    {gear && <Cape d="M150 50 Q100 26 38 66 Q68 84 54 112 Q112 90 162 98Z" ox={150} oy={60} />}
    <ellipse cx="125" cy="98" rx="92" ry="62" fill="#a9c1da"/>
    <g className="av-etail"><path d="M40 84 q-30 22 -10 60" stroke="#a9c1da" strokeWidth="13" fill="none" strokeLinecap="round"/><path d="M30 130 q-8 10 -2 22" stroke="#6f86a3" strokeWidth="9" fill="none" strokeLinecap="round"/></g>
    <circle cx="208" cy="76" r="44" fill="#a9c1da"/>
    <g className="av-eear"><ellipse cx="174" cy="80" rx="30" ry="42" fill="#8fa8c4"/><ellipse cx="176" cy="82" rx="18" ry="30" fill="#f6b6c6"/></g>
    <path d="M236 84 q20 24 4 66 q-4 14 -18 8" stroke="#a9c1da" strokeWidth="24" fill="none" strokeLinecap="round"/>
    <circle cx="216" cy="66" r="11" fill="#fff"/><circle cx="219" cy="68" r="7" fill="#1a1209"/><circle cx="221" cy="65" r="2.6" fill="#fff"/>
    <ellipse cx="226" cy="92" rx="8" ry="5" fill="#ff8fa3" opacity="0.6"/>
    <path d="M200 96 q8 8 16 3" stroke="#1a1209" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    
    {gear && <Band x={168} y={42} w={80} h={11} />}
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

export const Peacock = ({ className = "", style, gear = false }) => (
  <svg viewBox="0 0 250 190" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g className="av-pfan">
      {[-82, -56, -30, -4, 22, 48].map((a, i) => (
        <g key={a} transform={`rotate(${a} 96 112)`}>
          <ellipse cx="96" cy="46" rx="15" ry="52" fill={i % 2 ? "#1fa37a" : "#2bb98a"} stroke="#0f6e52" strokeWidth="2.5"/>
          <ellipse cx="96" cy="26" rx="8" ry="11" fill="#2b6fd6"/><circle cx="96" cy="26" r="4.5" fill="#f7b32b"/>
        </g>
      ))}
    </g>
    <path d="M110 150 L104 186 M138 150 L142 186" stroke="#b9791a" strokeWidth="6" strokeLinecap="round"/>
    <path d="M96 186 H112 M134 186 H152" stroke="#b9791a" strokeWidth="6" strokeLinecap="round"/>
    {gear && <Cape d="M156 90 Q118 72 80 102 Q102 114 96 130 Q130 112 164 120Z" ox={156} oy={96} />}
    <ellipse cx="124" cy="120" rx="56" ry="38" fill="#1e7fc0" stroke="#145a8a" strokeWidth="3"/>
    <g className="av-pwing"><ellipse cx="116" cy="118" rx="34" ry="22" fill="#2ab3a6" stroke="#145a8a" strokeWidth="3"/><path d="M92 118 q24 12 50 0" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none"/></g>
    <path d="M160 104 Q192 90 198 56" stroke="#1e7fc0" strokeWidth="22" fill="none" strokeLinecap="round"/>
    <circle cx="204" cy="46" r="16" fill="#2b8fd0" stroke="#145a8a" strokeWidth="3"/>
    <path d="M218 46 L236 52 L218 58Z" fill="#f7b32b" stroke="#b9791a" strokeWidth="2"/>
    <circle cx="208" cy="42" r="4.5" fill="#fff"/><circle cx="209.5" cy="42.5" r="2.4" fill="#1a1209"/>
    <path d="M200 30 q-6 -14 -12 -20 M204 30 q0 -16 -2 -24 M208 30 q6 -14 12 -18" stroke="#145a8a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <circle cx="188" cy="10" r="4" fill="#f7b32b"/><circle cx="202" cy="6" r="4" fill="#f7b32b"/><circle cx="220" cy="12" r="4" fill="#f7b32b"/>
    <ellipse cx="214" cy="56" rx="6" ry="4" fill="#ff8fa3" opacity=".6"/>
    {gear && <Band x={187} y={37} w={34} h={7} />}
    
  </svg>
);

export const Rabbit = ({ className = "", style }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="20" cy="70" r="9" fill="#fff"/>
    <ellipse cx="48" cy="72" rx="28" ry="20" fill="#f4efe6" stroke="#cfc6b4" strokeWidth="2.5"/>
    <ellipse cx="72" cy="86" rx="12" ry="6" fill="#f4efe6" stroke="#cfc6b4" strokeWidth="2"/>
    <circle cx="72" cy="52" r="16" fill="#f4efe6" stroke="#cfc6b4" strokeWidth="2.5"/>
    <g className="av-rear"><ellipse cx="66" cy="22" rx="6" ry="18" fill="#f4efe6" stroke="#cfc6b4" strokeWidth="2.5"/><ellipse cx="66" cy="24" rx="2.8" ry="12" fill="#ffb7c5"/></g>
    <g className="av-rear b"><ellipse cx="80" cy="24" rx="6" ry="17" fill="#f4efe6" stroke="#cfc6b4" strokeWidth="2.5" transform="rotate(14 80 24)"/><ellipse cx="80" cy="26" rx="2.8" ry="11" fill="#ffb7c5" transform="rotate(14 80 26)"/></g>
    <circle cx="78" cy="50" r="3" fill="#1a1209"/><circle cx="79" cy="49" r="1" fill="#fff"/><ellipse cx="86" cy="56" rx="3" ry="2.2" fill="#ff8fa3"/><ellipse cx="70" cy="58" rx="4" ry="2.5" fill="#ffb7c5" opacity=".7"/>
  </svg>
);

export const Deer = ({ className = "", style }) => (
  <svg viewBox="0 0 170 160" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M30 70 q-14 -4 -16 -16 q12 -2 20 8Z" fill="#c68a4a"/>
    <rect x="44" y="96" width="11" height="58" rx="5" fill="#a86e35"/><rect x="104" y="96" width="11" height="58" rx="5" fill="#a86e35"/>
    <ellipse cx="78" cy="82" rx="50" ry="28" fill="#c68a4a"/>
    <ellipse cx="78" cy="96" rx="38" ry="12" fill="#f3dcb4"/>
    <g fill="#fff6e0" opacity=".9"><circle cx="58" cy="72" r="3.5"/><circle cx="76" cy="66" r="3.5"/><circle cx="94" cy="72" r="3.5"/><circle cx="68" cy="82" r="3"/><circle cx="86" cy="82" r="3"/></g>
    <rect x="58" y="100" width="11" height="54" rx="5" fill="#c68a4a"/><rect x="118" y="100" width="11" height="54" rx="5" fill="#c68a4a"/>
    <path d="M114 70 Q132 56 138 34" stroke="#c68a4a" strokeWidth="20" fill="none" strokeLinecap="round"/>
    <g className="av-dhead">
      <ellipse cx="146" cy="30" rx="19" ry="15" fill="#c68a4a"/>
      <ellipse cx="160" cy="36" rx="9" ry="7" fill="#f3dcb4"/><circle cx="165" cy="33" r="3" fill="#2b1a0a"/>
      <circle cx="148" cy="24" r="4.5" fill="#fff"/><circle cx="149.5" cy="24.5" r="2.4" fill="#1a1209"/>
      <ellipse cx="132" cy="18" rx="6" ry="11" fill="#a86e35" transform="rotate(-30 132 18)"/>
      <path d="M142 14 q-4 -14 -14 -20 M136 4 q-6 0 -8 -6 M144 12 q4 -14 14 -18 M152 2 q6 0 8 -6" stroke="#8a5a2b" strokeWidth="4" fill="none" strokeLinecap="round"/>
    </g>
  </svg>
);

export const Hedgehog = ({ className = "", style }) => (
  <svg viewBox="0 0 110 80" className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 60 Q10 18 56 14 Q98 14 98 58Z" fill="#7a5a3c" stroke="#4d3822" strokeWidth="2.5"/>
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${16 + i * 7.5} ${50 - Math.sin(i / 10 * Math.PI) * 30} l${-5 + i * .5} -${9 + Math.sin(i / 10 * Math.PI) * 4}`} stroke="#4d3822" strokeWidth="3" strokeLinecap="round"/>)}
    <path d="M70 60 Q96 44 108 58 Q106 70 90 70 H70Z" fill="#f0cfa0" stroke="#b98a5c" strokeWidth="2"/>
    <circle cx="94" cy="56" r="3.2" fill="#1a1209"/><circle cx="95" cy="55" r="1" fill="#fff"/><circle cx="108" cy="60" r="3.5" fill="#2b1a0a"/>
    <ellipse cx="82" cy="72" rx="7" ry="4" fill="#b98a5c"/><ellipse cx="46" cy="72" rx="7" ry="4" fill="#b98a5c"/>
  </svg>
);

const Band = ({ x, y, w, h }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="#d9382f" stroke="#9c2a22" strokeWidth="1.5"/>
    <rect x={x + w / 2 - h * 1.1} y={y - h * 0.15} width={h * 2.2} height={h * 1.3} rx={h * 0.3} fill="#f7b32b" stroke="#b9791a" strokeWidth="1.2"/>
    <path d={`M${x + w / 2 - h * 0.5} ${y + h * 0.5} l${h * .8} ${-h * .2} l${-h * .1} ${h * .5} Z`} fill="#d9382f"/>
    <g className="av-btail"><path d={`M${x + 2} ${y + h / 2} q${-h * 1.4} ${-h * .2} ${-h * 2.2} ${h * .9} q${h * 1.1} ${-h * .1} ${h * 2} ${-h * .3}Z`} fill="#d9382f" stroke="#9c2a22" strokeWidth="1.2"/></g>
  </g>
);
const Cape = ({ d, ox, oy }) => (
  <g className="av-bcape" style={{ transformOrigin: `${ox}px ${oy}px` }}>
    <path d={d} fill="#d9382f" stroke="#9c2a22" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d={d} fill="none" stroke="#f7b32b" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" transform="translate(0 -3)"/>
  </g>
);
