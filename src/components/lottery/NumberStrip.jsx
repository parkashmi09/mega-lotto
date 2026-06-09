/**
 * A lottery number rendered as balls on a zig-zag (perforated) ticket strip
 * with a green glow on the right. Shared by Last Result + My Tickets.
 */
function Ball({ digit, win, size }) {
  const c = win ? 'var(--color-green-1)' : '#cdd6e3';
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-extrabold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.46,
        background: `radial-gradient(circle at 34% 28%, color-mix(in srgb, ${c} 40%, #fff), ${c} 62%, color-mix(in srgb, ${c} 50%, #000))`,
        color: win ? '#06281d' : '#1a1140',
        boxShadow: win ? `0 0 10px color-mix(in srgb, ${c} 60%, transparent)` : '0 1px 3px rgba(0,0,0,0.4)',
      }}
    >
      {digit}
    </span>
  );
}

export default function NumberStrip({ value, size = 28, highlightLast = true }) {
  const s = String(value);
  return (
    <div
      className="relative inline-flex items-center gap-1.5 py-2 pl-5 pr-4"
      style={{
        background:
          'radial-gradient(ellipse 58% 135% at 97% 50%, color-mix(in srgb, var(--color-green-1) 50%, transparent) 0%, color-mix(in srgb, var(--color-green-1) 16%, transparent) 36%, transparent 64%), #151c2a',
        WebkitMaskImage:
          'conic-gradient(from -45deg at left, #0000 25%, #000 0), conic-gradient(from 135deg at right, #0000 25%, #000 0)',
        WebkitMaskSize: '51% 9px, 51% 9px',
        WebkitMaskPosition: 'left, right',
        WebkitMaskRepeat: 'repeat-y',
        maskImage:
          'conic-gradient(from -45deg at left, #0000 25%, #000 0), conic-gradient(from 135deg at right, #0000 25%, #000 0)',
        maskSize: '51% 9px, 51% 9px',
        maskPosition: 'left, right',
        maskRepeat: 'repeat-y',
      }}
    >
      {s.split('').map((d, j) => (
        <Ball key={j} digit={d} win={highlightLast && j === s.length - 1} size={size} />
      ))}
    </div>
  );
}
