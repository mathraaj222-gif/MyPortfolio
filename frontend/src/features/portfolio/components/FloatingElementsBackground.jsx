import React from 'react';

// ── SVG Elements ─────────────────────────────────────────────────────────────

/** Open book with circuit-trace pages */
function BookSvg({ color = '#CF2229', size = 120 }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Spine */}
      <rect x="78" y="10" width="4" height="100" rx="2" fill={color} opacity="0.9" />
      {/* Left page */}
      <path d="M80 15 C55 12 18 20 12 30 L12 105 C18 96 55 88 80 90 Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.8" />
      {/* Right page */}
      <path d="M80 15 C105 12 142 20 148 30 L148 105 C142 96 105 88 80 90 Z" stroke={color} strokeWidth="1.5" fill="none" opacity="0.8" />
      {/* Left page lines */}
      <line x1="22" y1="40" x2="72" y2="37" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="20" y1="52" x2="70" y2="49" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="19" y1="64" x2="69" y2="61" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="18" y1="76" x2="68" y2="73" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="17" y1="88" x2="67" y2="85" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Right page lines */}
      <line x1="88" y1="37" x2="138" y2="40" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="90" y1="49" x2="140" y2="52" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="91" y1="61" x2="141" y2="64" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="92" y1="73" x2="142" y2="76" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="93" y1="85" x2="143" y2="88" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Circuit node dots on left page */}
      <circle cx="30" cy="40" r="2" fill={color} opacity="0.7" />
      <circle cx="55" cy="52" r="2" fill={color} opacity="0.7" />
      <circle cx="35" cy="64" r="2" fill={color} opacity="0.7" />
      {/* Circuit node dots on right page */}
      <circle cx="130" cy="40" r="2" fill={color} opacity="0.7" />
      <circle cx="105" cy="52" r="2" fill={color} opacity="0.7" />
      <circle cx="125" cy="64" r="2" fill={color} opacity="0.7" />
    </svg>
  );
}

/** Complex math equation block */
function MathEquationSvg({ color = '#3D3F47', size = 140 }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Integral sign */}
      <path d="M30 20 Q22 35 25 60 Q28 85 20 100" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* Limits */}
      <text x="32" y="18" fontFamily="serif" fontSize="10" fill={color} opacity="0.8">&#x221E;</text>
      <text x="28" y="108" fontFamily="serif" fontSize="10" fill={color} opacity="0.8">0</text>
      {/* Main equation body */}
      <text x="42" y="68" fontFamily="serif" fontSize="14" fill={color} opacity="0.9">e</text>
      <text x="53" y="60" fontFamily="serif" fontSize="9" fill={color} opacity="0.9">-x&#xB2;</text>
      <text x="68" y="68" fontFamily="serif" fontSize="14" fill={color} opacity="0.9">dx</text>
      {/* Equals sign */}
      <line x1="94" y1="63" x2="108" y2="63" stroke={color} strokeWidth="2" opacity="0.9" />
      <line x1="94" y1="70" x2="108" y2="70" stroke={color} strokeWidth="2" opacity="0.9" />
      {/* Right side: sqrt(pi)/2 */}
      <path d="M112 75 L116 75 L120 50 L170 50" stroke={color} strokeWidth="1.8" fill="none" opacity="0.9" />
      <text x="124" y="72" fontFamily="serif" fontSize="16" fill={color} opacity="0.9">&#x03C0;</text>
      {/* Dividing line */}
      <line x1="113" y1="80" x2="145" y2="80" stroke={color} strokeWidth="2" opacity="0.9" />
      <text x="124" y="96" fontFamily="serif" fontSize="16" fill={color} opacity="0.9">2</text>
      {/* Top floating formula */}
      <text x="10" y="18" fontFamily="serif" fontSize="9" fill={color} opacity="0.55">&#x2207;&#xB2;&#x03C8; + 8&#x03C0;&#xB2;m/h&#xB2;</text>
      {/* Bottom annotation */}
      <text x="8" y="114" fontFamily="serif" fontSize="8" fill={color} opacity="0.45">&#x2211;&#x1D62; &#x03BB;&#x1D62; = tr(A) &#xB7; det(M&#x207B;&#xB9;)</text>
    </svg>
  );
}

/** Matrix equation */
function MatrixSvg({ color = '#CF2229', size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left bracket */}
      <path d="M20 10 L10 10 L10 120 L20 120" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* Right bracket */}
      <path d="M110 10 L120 10 L120 120 L110 120" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* Matrix values */}
      {[
        { x: 30, y: 42, val: 'a\u2081\u2081' },
        { x: 62, y: 42, val: 'a\u2081\u2082' },
        { x: 94, y: 42, val: 'a\u2081\u2083' },
        { x: 30, y: 70, val: 'a\u2082\u2081' },
        { x: 62, y: 70, val: 'a\u2082\u2082' },
        { x: 94, y: 70, val: 'a\u2082\u2083' },
        { x: 30, y: 98, val: 'a\u2083\u2081' },
        { x: 62, y: 98, val: 'a\u2083\u2082' },
        { x: 94, y: 98, val: 'a\u2083\u2083' },
      ].map(({ x, y, val }) => (
        <text key={val} x={x} y={y} fontFamily="serif" fontSize="11" fill={color} opacity="0.8" textAnchor="middle">{val}</text>
      ))}
      {/* Notation above */}
      <text x="65" y="12" fontFamily="serif" fontSize="12" fill={color} opacity="0.6" textAnchor="middle">A &#x2208; &#x211D;&#x207F;&#xD7;&#x207F;</text>
    </svg>
  );
}

/** Line graph / data chart */
function GraphSvg({ color = '#CF2229', gridColor = '#3D3F47', size = 150 }) {
  const pts = [
    [10, 80], [30, 60], [50, 70], [70, 35], [90, 45], [110, 20], [130, 30], [150, 15],
  ];
  const area = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const areaClose = `${area} L${pts[pts.length - 1][0]},95 L${pts[0][0]},95 Z`;

  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grid lines */}
      {[20, 40, 60, 80].map(y => (
        <line key={y} x1="10" y1={y} x2="155" y2={y} stroke={gridColor} strokeWidth="0.6" opacity="0.25" strokeDasharray="3,4" />
      ))}
      {/* Area fill */}
      <path d={areaClose} fill={color} opacity="0.08" />
      {/* Line */}
      <path d={area} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" fill="none" />
      {/* Data points */}
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={color} opacity="0.85" />
      ))}
      {/* Axes */}
      <line x1="10" y1="10" x2="10" y2="95" stroke={gridColor} strokeWidth="1.5" opacity="0.6" />
      <line x1="10" y1="95" x2="155" y2="95" stroke={gridColor} strokeWidth="1.5" opacity="0.6" />
      {/* Y-axis ticks */}
      {[20, 40, 60, 80].map(y => (
        <line key={y} x1="7" y1={y} x2="13" y2={y} stroke={gridColor} strokeWidth="1" opacity="0.5" />
      ))}
      {/* Second dashed curve */}
      <path d="M10,90 L30,72 L50,78 L70,55 L90,62 L110,42 L130,50 L150,38"
        stroke={gridColor} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" fill="none" />
      {/* Label */}
      <text x="78" y="108" fontFamily="monospace" fontSize="8" fill={gridColor} opacity="0.55" textAnchor="middle">f(x) &#x2014; Loss Curve</text>
    </svg>
  );
}

/** Neural network / AI robot head */
function AiRobotSvg({ color = '#CF2229', accentColor = '#3D3F47', size = 130 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 130 145" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <line x1="65" y1="5" x2="65" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="65" cy="4" r="3.5" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="65" cy="4" r="1.5" fill={color} opacity="0.8" />

      {/* Head */}
      <rect x="20" y="22" width="90" height="68" rx="14" stroke={color} strokeWidth="1.8" fill="none" opacity="0.9" />

      {/* Eyes */}
      <rect x="32" y="38" width="24" height="16" rx="5" stroke={color} strokeWidth="1.5" fill="none" opacity="0.9" />
      <rect x="74" y="38" width="24" height="16" rx="5" stroke={color} strokeWidth="1.5" fill="none" opacity="0.9" />
      <circle cx="44" cy="46" r="4" fill={color} opacity="0.7" />
      <circle cx="86" cy="46" r="4" fill={color} opacity="0.7" />
      <circle cx="46" cy="44" r="1.5" fill="white" opacity="0.9" />
      <circle cx="88" cy="44" r="1.5" fill="white" opacity="0.9" />

      {/* Mouth grill */}
      <rect x="38" y="66" width="54" height="10" rx="4" stroke={color} strokeWidth="1.3" fill="none" opacity="0.7" />
      <line x1="50" y1="66" x2="50" y2="76" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="62" y1="66" x2="62" y2="76" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="74" y1="66" x2="74" y2="76" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="82" y1="66" x2="82" y2="76" stroke={color} strokeWidth="1" opacity="0.5" />

      {/* Ear sensors */}
      <rect x="7" y="40" width="13" height="24" rx="5" stroke={accentColor} strokeWidth="1.3" fill="none" opacity="0.7" />
      <rect x="110" y="40" width="13" height="24" rx="5" stroke={accentColor} strokeWidth="1.3" fill="none" opacity="0.7" />

      {/* Body */}
      <rect x="28" y="94" width="74" height="42" rx="10" stroke={accentColor} strokeWidth="1.5" fill="none" opacity="0.7" />

      {/* Neural network nodes inside body */}
      <circle cx="44" cy="108" r="4" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />
      <circle cx="44" cy="122" r="4" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />
      <circle cx="65" cy="104" r="4" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />
      <circle cx="65" cy="115" r="4" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />
      <circle cx="65" cy="126" r="4" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />
      <circle cx="86" cy="108" r="4" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />
      <circle cx="86" cy="122" r="4" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />

      {/* NN Connections */}
      <line x1="48" y1="108" x2="61" y2="104" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="48" y1="108" x2="61" y2="115" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="48" y1="108" x2="61" y2="126" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="48" y1="122" x2="61" y2="104" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="48" y1="122" x2="61" y2="115" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="48" y1="122" x2="61" y2="126" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="69" y1="104" x2="82" y2="108" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="69" y1="115" x2="82" y2="108" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="69" y1="115" x2="82" y2="122" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />
      <line x1="69" y1="126" x2="82" y2="122" stroke={accentColor} strokeWidth="0.8" opacity="0.4" />

      {/* Legs */}
      <rect x="37" y="136" width="18" height="8" rx="4" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.6" />
      <rect x="75" y="136" width="18" height="8" rx="4" stroke={accentColor} strokeWidth="1.2" fill="none" opacity="0.6" />
    </svg>
  );
}

/** Formula cluster: E=mc², Euler identity, gradient descent */
function FormulaClusterSvg({ color = '#3D3F47', size = 120 }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="8" y="28" fontFamily="serif" fontSize="20" fill={color} opacity="0.9" fontStyle="italic">E = mc&#xB2;</text>
      <line x1="8" y1="35" x2="152" y2="35" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <text x="8" y="62" fontFamily="serif" fontSize="16" fill={color} opacity="0.85" fontStyle="italic">e</text>
      <text x="21" y="54" fontFamily="serif" fontSize="10" fill={color} opacity="0.85" fontStyle="italic">i&#x03C0;</text>
      <text x="34" y="62" fontFamily="serif" fontSize="16" fill={color} opacity="0.85"> + 1 = 0</text>
      <text x="8" y="88" fontFamily="monospace" fontSize="10" fill={color} opacity="0.7">&#x03B8; := &#x03B8; - &#x03B1;&#x2207;J(&#x03B8;)</text>
      <text x="8" y="108" fontFamily="monospace" fontSize="9" fill={color} opacity="0.6">&#x03C3;(z)&#x1D62; = e&#x1DA2;&#x2071; / &#x2211;e&#x1DA2;&#x02B2;</text>
      <text x="8" y="126" fontFamily="monospace" fontSize="9" fill={color} opacity="0.55">&#x2202;L/&#x2202;w = &#x03B4; &#xB7; x&#x1D40;</text>
      <circle cx="148" cy="62" r="2" fill={color} opacity="0.4" />
      <circle cx="153" cy="68" r="1.5" fill={color} opacity="0.3" />
    </svg>
  );
}

/** Scatter plot */
function ScatterPlotSvg({ color = '#CF2229', size = 130 }) {
  const dots = [
    [20, 30], [35, 55], [48, 25], [60, 45], [72, 20], [82, 35],
    [95, 60], [110, 40], [30, 70], [55, 80], [70, 65], [90, 75],
  ];
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 130 105" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="5" x2="10" y2="92" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1="10" y1="92" x2="125" y2="92" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1="15" y1="80" x2="120" y2="20" stroke={color} strokeWidth="1.2" strokeDasharray="5,4" opacity="0.45" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4.5 : 3} fill={color} opacity={i % 2 === 0 ? 0.7 : 0.45} />
      ))}
      <circle cx="65" cy="40" r="22" stroke={color} strokeWidth="1" strokeDasharray="3,3" fill="none" opacity="0.25" />
      <text x="65" y="103" fontFamily="monospace" fontSize="7" fill={color} opacity="0.5" textAnchor="middle">Distribution Plot</text>
    </svg>
  );
}

// ── Element layout ─────────────────────────────────────────────────────────────
const ELEMENTS = [
  { id: 'book-1', el: <BookSvg color="#CF2229" size={130} />, style: { top: '3%', left: '1%' }, cls: 'fe-float-1', op: 0.28 },
  { id: 'book-2', el: <BookSvg color="#3D3F47" size={100} />, style: { top: '60%', right: '2%' }, cls: 'fe-float-3', op: 0.22 },
  { id: 'book-3', el: <BookSvg color="#CF2229" size={80} />, style: { bottom: '5%', left: '20%' }, cls: 'fe-float-5', op: 0.20 },
  { id: 'math-1', el: <MathEquationSvg color="#3D3F47" size={160} />, style: { top: '12%', right: '0%' }, cls: 'fe-float-2', op: 0.25 },
  { id: 'math-2', el: <MathEquationSvg color="#CF2229" size={120} />, style: { top: '45%', left: '0%' }, cls: 'fe-float-4', op: 0.20 },
  { id: 'matrix-1', el: <MatrixSvg color="#CF2229" size={120} />, style: { top: '25%', left: '2%' }, cls: 'fe-float-3', op: 0.22 },
  { id: 'matrix-2', el: <MatrixSvg color="#3D3F47" size={90} />, style: { bottom: '15%', right: '3%' }, cls: 'fe-float-1', op: 0.18 },
  { id: 'formula-1', el: <FormulaClusterSvg color="#3D3F47" size={150} />, style: { top: '75%', left: '1%' }, cls: 'fe-float-2', op: 0.22 },
  { id: 'formula-2', el: <FormulaClusterSvg color="#CF2229" size={110} />, style: { top: '38%', right: '1%' }, cls: 'fe-float-5', op: 0.18 },
  { id: 'graph-1', el: <GraphSvg color="#CF2229" gridColor="#3D3F47" size={170} />, style: { top: '5%', right: '2%' }, cls: 'fe-float-4', op: 0.28 },
  { id: 'graph-2', el: <GraphSvg color="#3D3F47" gridColor="#CF2229" size={130} />, style: { bottom: '8%', right: '15%' }, cls: 'fe-float-2', op: 0.22 },
  { id: 'scatter-1', el: <ScatterPlotSvg color="#CF2229" size={145} />, style: { top: '50%', right: '0%' }, cls: 'fe-float-1', op: 0.25 },
  { id: 'scatter-2', el: <ScatterPlotSvg color="#3D3F47" size={110} />, style: { top: '20%', right: '28%' }, cls: 'fe-float-3', op: 0.15 },
  { id: 'robot-1', el: <AiRobotSvg color="#CF2229" accentColor="#3D3F47" size={140} />, style: { top: '1%', right: '22%' }, cls: 'fe-float-5', op: 0.22 },
  { id: 'robot-2', el: <AiRobotSvg color="#3D3F47" accentColor="#CF2229" size={110} />, style: { bottom: '2%', left: '3%' }, cls: 'fe-float-3', op: 0.20 },
  { id: 'robot-3', el: <AiRobotSvg color="#CF2229" accentColor="#3D3F47" size={90} />, style: { top: '68%', left: '22%' }, cls: 'fe-float-1', op: 0.18 },
];

// ── Master Background Component ───────────────────────────────────────────────
export default function FloatingElementsBackground() {
  return (
    <div className="fe-bg-layer" aria-hidden="true">
      {ELEMENTS.map(({ id, el, style, cls, op }) => (
        <div key={id} className={`fe-element ${cls}`} style={{ ...style, opacity: op }}>
          {el}
        </div>
      ))}
    </div>
  );
}
