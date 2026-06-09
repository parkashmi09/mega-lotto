import { useId } from 'react';

/**
 * Realistic lottery ticket — a data-driven, pixel-faithful React port of
 * public/assets/ref/download.svg, but the metallic paper is derived from the
 * draw's `color` (not hard-gold) so every draw prints in its own theme colour.
 * Glossy emboss, notched edges, perforated stub, scratch panel and barcode are
 * preserved. All defs IDs are namespaced per-instance (useId) so many tickets
 * can render in one document without SVG global-ID collisions.
 *
 * Props:
 *   name        – draw / brand name (big embossed title)
 *   subtitle    – small spaced caption under the title
 *   color       – base paper colour (the draw colour); default gold
 *   prizeText   – text inside the scratch panel (e.g. "WIN ₹10,00,000")
 *   prizeWon    – when truthy + status==='won', shown in green on the panel
 *   stubLabel   – small word above the stub number (default "LUCKY")
 *   number      – ticket number for the stub (#...)
 *   status      – 'pending' | 'won' | 'lost' (drives the footer stamp)
 *   footerText  – bottom-stub caption
 */
const STATUS_FOOT = {
  pending: 'VALID ONLY TODAY',
  won: 'WINNING TICKET ✓',
  lost: 'NOT A WINNER',
};

function titleSize(name = '') {
  const len = name.length;
  if (len <= 7) return 58;
  if (len <= 10) return 48;
  if (len <= 13) return 40;
  return 34;
}

/* ── tiny hex colour helpers (derive metallic stops from the base colour) ── */
const hex2rgb = (h) => {
  let s = String(h).replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgb2hex = (rgb) => '#' + rgb.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
const mix = (hex, target, t) => {
  const a = hex2rgb(hex), b = hex2rgb(target);
  return rgb2hex(a.map((v, i) => v + (b[i] - v) * t));
};
const lighten = (hex, t) => mix(hex, '#ffffff', t);
const darken = (hex, t) => mix(hex, '#000000', t);

export default function RealisticTicket({
  name = 'LOTTERY',
  subtitle = 'PREMIUM LUCK DRAW',
  color = '#f0a020',
  prizeText = 'WIN ₹10,00,000',
  prizeWon = 0,
  stubLabel = 'LUCKY',
  number = '000000',
  status = 'pending',
  footerText,
}) {
  const uid = useId().replace(/:/g, '');
  const id = (k) => `${k}-${uid}`;

  const won = status === 'won';
  const lost = status === 'lost';

  // metallic paper stops derived from the draw colour — alternating light/dark
  // bands give a polished foil sheen instead of a flat light→muddy gradient.
  const cTop = lighten(color, 0.88);   // bright top edge
  const cHi = lighten(color, 0.5);     // reflective highlight bands
  const cBase = color;
  const cMid = darken(color, 0.12);
  const cDeep = darken(color, 0.4);    // deepest tone (kept rich, not muddy-brown)
  const edge = darken(color, 0.52);    // border / emboss-dark / perforation
  const dots = darken(color, 0.64);
  const titleFill = lighten(color, 0.88);
  const subFill = lighten(color, 0.62);
  const ink = darken(color, 0.6);      // numbers / footer
  const barInk = darken(color, 0.72);

  const panelText = won ? `WON ₹${new Intl.NumberFormat('en-IN').format(prizeWon)}` : lost ? 'BETTER LUCK NEXT TIME' : prizeText;
  const panelFill = won ? '#0b6b2e' : ink;
  const foot = footerText || STATUS_FOOT[status] || STATUS_FOOT.pending;

  return (
    <svg viewBox="34 40 692 240" className="block w-full h-auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`${name} ticket ${number}`}>
      <defs>
        <linearGradient id={id('paper')} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={cTop} />
          <stop offset="15%" stopColor={cHi} />
          <stop offset="32%" stopColor={cBase} />
          <stop offset="50%" stopColor={cHi} />
          <stop offset="68%" stopColor={cMid} />
          <stop offset="85%" stopColor={cBase} />
          <stop offset="100%" stopColor={cDeep} />
        </linearGradient>

        <radialGradient id={id('glow')} cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".5" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity=".1" />
          <stop offset="100%" stopColor="#000000" stopOpacity=".12" />
        </radialGradient>

        {/* sweeping foil shine */}
        <linearGradient id={id('shine')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity=".6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <clipPath id={id('bodyClip')}>
          <path d="M70 55 H690 Q715 55 715 80 V113 Q682 120 682 155 Q682 190 715 197 V230 Q715 255 690 255 H70 Q45 255 45 230 V197 Q78 190 78 155 Q78 120 45 113 V80 Q45 55 70 55Z" />
        </clipPath>

        <filter id={id('paperNoise')}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="8" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 .13" />
          </feComponentTransfer>
        </filter>

        <filter id={id('innerEmboss')}>
          <feDropShadow dx="0" dy="2" stdDeviation="1.4" floodColor="#ffffff" floodOpacity=".45" />
          <feDropShadow dx="0" dy="-3" stdDeviation="2" floodColor={edge} floodOpacity=".45" />
        </filter>

        <linearGradient id={id('scratch')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d7d7d7" />
          <stop offset="35%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#a7a7a7" />
          <stop offset="100%" stopColor="#eeeeee" />
        </linearGradient>
      </defs>

      <g transform="rotate(-2 380 155)">
        {/* notched body */}
        <path
          d="M70 55 H690 Q715 55 715 80 V113
             Q682 120 682 155 Q682 190 715 197
             V230 Q715 255 690 255 H70
             Q45 255 45 230 V197
             Q78 190 78 155 Q78 120 45 113
             V80 Q45 55 70 55Z"
          fill={`url(#${id('paper')})`}
          stroke={edge}
          strokeWidth="5"
        />
        {/* glow + paper-noise — clipped to the notched body so no square box bleeds into the corners */}
        <g clipPath={`url(#${id('bodyClip')})`}>
          <rect x="45" y="55" width="670" height="200" fill={`url(#${id('glow')})`} opacity=".85" />
          <rect x="45" y="55" width="670" height="200" fill="#000" filter={`url(#${id('paperNoise')})`} opacity=".7" />
        </g>

        {/* top gloss highlight */}
        <path d="M75 68 H675 Q696 68 696 87 V98 C520 82 300 80 90 105 Q70 108 62 101 V83 Q62 68 75 68Z" fill={lighten(color, 0.92)} opacity=".32" />

        {/* sweeping foil shine (clipped to the body) */}
        <g clipPath={`url(#${id('bodyClip')})`}>
          <rect y="-20" width="150" height="350" fill={`url(#${id('shine')})`} transform="skewX(-16)">
            <animate attributeName="x" values="-220;-220;860;860" keyTimes="0;0.45;0.85;1" dur="4.5s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* perforation */}
        <line x1="545" y1="70" x2="545" y2="240" stroke={edge} strokeWidth="3" strokeDasharray="10 10" opacity=".8" />
        <g fill={dots} opacity=".4">
          {[82, 108, 134, 160, 186, 212, 238].map((cy) => (
            <circle key={cy} cx="545" cy={cy} r="4" />
          ))}
        </g>

        {/* title + subtitle */}
        <text x="95" y="130" fontFamily="Georgia, serif" fontSize={titleSize(name)} fontWeight="900" fill={titleFill} stroke={edge} strokeWidth="2.4" filter={`url(#${id('innerEmboss')})`} style={{ textTransform: 'uppercase' }}>
          {name}
        </text>
        <text x="102" y="163" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="800" letterSpacing="3" fill={subFill}>
          {subtitle}
        </text>

        {/* scratch panel (stays metallic-silver) */}
        <rect x="100" y="185" width="360" height="48" rx="10" fill={`url(#${id('scratch')})`} stroke={darken(color, 0.5)} strokeWidth="3" />
        <path d="M110 195 C160 188 210 202 260 194 S360 188 450 199" stroke="#ffffff" strokeWidth="3" opacity=".45" fill="none" />
        <text x="120" y="216" fontFamily="'Arial Black', Arial" fontSize="22" fontWeight="900" fill={panelFill}>
          {panelText}
        </text>

        {/* stub */}
        <text x="584" y="112" fontFamily="'Arial Black', Arial" fontSize="28" fill={titleFill} stroke={edge} strokeWidth="1.5">
          {stubLabel}
        </text>
        <text x="584" y="145" fontFamily="'Courier New', monospace" fontSize="24" fontWeight="900" fill={ink}>
          #{number}
        </text>

        {/* barcode */}
        <g fill={barInk}>
          <rect x="585" y="174" width="5" height="45" />
          <rect x="596" y="174" width="2" height="45" />
          <rect x="604" y="174" width="8" height="45" />
          <rect x="618" y="174" width="3" height="45" />
          <rect x="628" y="174" width="7" height="45" />
          <rect x="642" y="174" width="4" height="45" />
          <rect x="653" y="174" width="9" height="45" />
          <rect x="668" y="174" width="3" height="45" />
        </g>

        <text x="584" y="235" fontFamily="Arial" fontSize="11" fontWeight="700" fill={won ? '#0b6b2e' : ink}>
          {foot}
        </text>
      </g>
    </svg>
  );
}
