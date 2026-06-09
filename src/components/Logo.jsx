/**
 * App wordmark — "MEGA" stacked over "LOTTO" (two lines), drawn as SVG so it
 * scales to the given width and never clips. Size with a width class via `className`
 * (height follows the 96:52 ratio). Single source of truth for the brand mark.
 */
export function Logo({ className = 'w-[88px]' }) {
  const common = {
    textAnchor: 'middle',
    textLength: '88',
    lengthAdjust: 'spacingAndGlyphs',
    fontFamily: "'Oxanium', system-ui, sans-serif",
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: '-0.5',
  };
  return (
    <svg
      viewBox="0 0 96 52"
      className={`${className} h-auto`}
      role="img"
      aria-label="Mega Lotto"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text x="48" y="22" {...common} fill="var(--color-foreground-primary)">MEGA</text>
      <text x="48" y="48" {...common} fill="var(--color-green-1)">LOTTO</text>
    </svg>
  );
}

export default Logo;
