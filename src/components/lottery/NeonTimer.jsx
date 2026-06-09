import { Fragment } from 'react';

/**
 * Neon countdown timer — dark cells with a neon gradient border, glowing digits,
 * colon separators and HRS/MIN/SEC labels. Fully themed by `accent` so every
 * draw renders the timer in its own colour. `value` is a "HHMMSS" string.
 */
function Cell({ digits, label, accent, h, minW, font }) {
  const border = {
    padding: '1.6px',
    background: `linear-gradient(150deg, color-mix(in srgb, ${accent} 80%, #ffffff) 0%, ${accent} 55%, color-mix(in srgb, ${accent} 55%, #000) 100%)`,
    WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="relative flex items-center justify-center rounded-[9px] px-1.5 font-extrabold tabular-nums text-white"
        style={{
          height: h, minWidth: minW, fontSize: font,
          background: `linear-gradient(155deg, color-mix(in srgb, ${accent} 20%, #0b0d1c) 0%, #07090f 100%)`,
          boxShadow: `inset 0 0 10px color-mix(in srgb, ${accent} 35%, transparent)`,
          textShadow: `0 0 9px color-mix(in srgb, ${accent} 65%, transparent)`,
        }}
      >
        <span className="pointer-events-none absolute inset-0 rounded-[9px]" style={border} aria-hidden />
        <span key={digits} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">{digits}</span>
      </span>
      <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--color-foreground-muted-2)]">{label}</span>
    </div>
  );
}

export default function NeonTimer({ value, accent = '#6a4dff', size = 30 }) {
  const h = size;
  const minW = Math.round(size * 1.13);
  const font = Math.round(size * 0.53);
  const parts = [
    [value.slice(0, 2), 'Hrs'],
    [value.slice(2, 4), 'Min'],
    [value.slice(4, 6), 'Sec'],
  ];
  return (
    <div className="flex items-start gap-1.5">
      {parts.map(([digits, label], i) => (
        <Fragment key={label}>
          {i > 0 && <span className="pt-1 font-extrabold" style={{ color: accent, fontSize: font }}>:</span>}
          <Cell digits={digits} label={label} accent={accent} h={h} minW={minW} font={font} />
        </Fragment>
      ))}
    </div>
  );
}
