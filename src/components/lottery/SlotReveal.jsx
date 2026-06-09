import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

/**
 * A single slot reel: a vertical strip of numbered lottery balls that GSAP
 * scrolls fast then eases to a stop on the `target` ball (last in the strip).
 * Reels stop left → right via the `idx` stagger — a real slot-machine feel.
 */
function Reel({ target, size, accent, idx }) {
  const stripRef = useRef(null);
  const c = idx % 2 ? '#22d3c4' : accent;

  // Strip of random balls ending with the target number.
  const balls = useMemo(() => {
    const arr = Array.from({ length: 24 }, () => Math.floor(Math.random() * 10));
    arr.push(Number(target));
    return arr;
  }, [target]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const finalY = -((balls.length - 1) * size);
    const tween = gsap.fromTo(
      strip,
      { y: 0 },
      { y: finalY, duration: 2.1 + idx * 0.55, ease: 'expo.out' }
    );
    return () => tween.kill();
  }, [balls, size, idx]);

  const ballStyle = {
    width: size,
    height: size,
    background: `radial-gradient(circle at 34% 28%, color-mix(in srgb, ${c} 38%, #fff), ${c} 58%, color-mix(in srgb, ${c} 45%, #000))`,
    boxShadow: `inset 0 0 4px rgba(0,0,0,0.35), 0 2px 5px rgba(0,0,0,0.5)`,
  };

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size, boxShadow: `0 0 10px color-mix(in srgb, ${c} 45%, transparent)` }}
    >
      <div ref={stripRef} className="absolute left-0 top-0 will-change-transform">
        {balls.map((n, i) => (
          <span key={i} className="flex items-center justify-center rounded-full" style={ballStyle}>
            <span
              className="flex items-center justify-center rounded-full bg-white font-extrabold text-[#1a1140]"
              style={{ width: size * 0.62, height: size * 0.62, fontSize: size * 0.42 }}
            >
              {n}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Animated slot reveal of a number — a row of spinning ball reels. */
export default function SlotReveal({ value, accent = '#22d3c4', size = 30 }) {
  return (
    <div className="flex items-center gap-[5px]">
      {String(value).split('').map((ch, i) => (
        <Reel key={`${value}-${i}`} idx={i} target={ch} size={size} accent={accent} />
      ))}
    </div>
  );
}
