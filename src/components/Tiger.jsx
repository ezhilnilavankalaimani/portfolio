import { useState } from "react";

// Original animated SVG tiger that walks across the hero. Click it to make it roar.
const O = "#F28C28"; // orange
const D = "#7A3B0C"; // dark orange (far legs)
const S = "#1A1209"; // stripes

const Leg = ({ x, y, cls, color }) => (
  <g className={`tiger-leg ${cls}`} style={{ transformOrigin: `${x}px ${y}px` }}>
    <path
      d={`M${x - 7} ${y} L${x + 7} ${y} L${x + 5} ${y + 44} L${x + 11} ${y + 50} L${x - 9} ${y + 50} L${x - 5} ${y + 44} Z`}
      fill={color}
    />
    <rect x={x - 4} y={y + 18} width='9' height='3' fill={S} opacity='0.8' />
    <rect x={x - 4} y={y + 30} width='9' height='3' fill={S} opacity='0.8' />
  </g>
);

const Tiger = () => {
  const [roar, setRoar] = useState(false);

  const onClick = () => {
    setRoar(true);
    setTimeout(() => setRoar(false), 1400);
  };

  return (
    <div className='tiger-track' aria-hidden='true'>
      <style>{`
        .tiger-track{position:relative;width:100%;height:150px;overflow:hidden;margin-top:24px}
        .tiger-ground{position:absolute;left:0;right:0;bottom:12px;height:2px;
          background:linear-gradient(90deg,transparent,#915EFF,transparent);opacity:.6}
        .tiger-walker{position:absolute;bottom:14px;left:0;width:190px;cursor:pointer;
          animation:tigerWalk 22s linear infinite}
        .tiger-walker.roar{animation-play-state:paused}
        .tiger-svg{width:190px;height:auto;animation:tigerBob .5s ease-in-out infinite}
        .tiger-leg{animation:legSwing .9s ease-in-out infinite}
        .tiger-leg.b{animation-delay:-.45s}
        .tiger-tail{transform-origin:60px 62px;animation:tailWag 1.2s ease-in-out infinite}
        .tiger-bubble{position:absolute;top:-6px;left:120px;background:#fff;color:#111;font-weight:800;
          font-size:14px;padding:4px 10px;border-radius:12px;white-space:nowrap}
        @keyframes tigerWalk{from{transform:translateX(-220px)}to{transform:translateX(calc(100vw + 40px))}}
        @keyframes tigerBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes legSwing{0%,100%{transform:rotate(-24deg)}50%{transform:rotate(24deg)}}
        @keyframes tailWag{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}
        @media (prefers-reduced-motion:reduce){.tiger-walker,.tiger-svg,.tiger-leg,.tiger-tail{animation:none}}
      `}</style>
      <div className='tiger-ground' />
      <div className={`tiger-walker ${roar ? "roar" : ""}`} onClick={onClick}>
        {roar && <div className='tiger-bubble'>ROAR!</div>}
        <svg className='tiger-svg' viewBox='0 0 300 160' xmlns='http://www.w3.org/2000/svg'>
          {/* tail */}
          <g className='tiger-tail'>
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
          {roar ? (
            <path d='M264 66 Q274 80 284 66 Z' fill='#7a0f0f' stroke={S} strokeWidth='2' />
          ) : (
            <path d='M264 66 Q272 70 282 65' stroke={S} strokeWidth='2.5' fill='none' />
          )}
          <path d='M232 44 L226 52 M236 62 L230 68' stroke={S} strokeWidth='4' strokeLinecap='round' />
        </svg>
      </div>
    </div>
  );
};

export default Tiger;
