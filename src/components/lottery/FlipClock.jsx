import { useEffect, useRef, useState } from 'react';

/**
 * Authentic split-flap "3D flip clock" digit.
 * On change: the old top half folds down (rotateX 0 → -90deg) revealing the new
 * top half, then the new bottom half folds up (rotateX 90 → 0deg). Pure CSS 3D
 * transforms — see `.flip-*` rules in index.css.
 */
function FlipUnit({ digit }) {
  // `digit` (the prop) is the current value. `prev` lags one step and is only
  // advanced AFTER the fold animation finishes — kept in a ref so updating it
  // never re-runs the settle effect mid-flip (which previously cancelled it and
  // left `prev` stale, showing the wrong number in the folding flap).
  const prevRef = useRef(digit);
  const [, force] = useState(0);
  const prev = prevRef.current;
  const flipping = prev !== digit;

  useEffect(() => {
    if (prevRef.current === digit) return;
    const t = setTimeout(() => {
      prevRef.current = digit; // settle: static halves now both show the new digit
      force((n) => n + 1);
    }, 340);
    return () => clearTimeout(t);
  }, [digit]);

  return (
    <span className="flip-unit">
      {/* static halves: top = new digit, bottom = old digit (until the fold lands) */}
      <span className="flip-half flip-upper"><span>{digit}</span></span>
      <span className="flip-half flip-lower"><span>{prev}</span></span>
      {/* animated folds — keyed per transition so the animation restarts each tick */}
      {flipping && (
        <span key={`${prev}-${digit}`} className="flip-fold-layer">
          <span className="flip-half flip-fold-top"><span>{prev}</span></span>
          <span className="flip-half flip-fold-bottom"><span>{digit}</span></span>
        </span>
      )}
    </span>
  );
}

/** value: zero-padded "HHMMSS" string. */
export function FlipClock({ value, className = '' }) {
  const d = String(value).padStart(6, '0').slice(0, 6).split('');
  const label = `${d[0]}${d[1]}:${d[2]}${d[3]}:${d[4]}${d[5]}`;
  return (
    <span className={`flip-clock ${className}`} role="timer" aria-label={label}>
      <span className="flip-group">
        <FlipUnit digit={d[0]} />
        <FlipUnit digit={d[1]} />
      </span>
      <span className="flip-colon">:</span>
      <span className="flip-group">
        <FlipUnit digit={d[2]} />
        <FlipUnit digit={d[3]} />
      </span>
      <span className="flip-colon">:</span>
      <span className="flip-group">
        <FlipUnit digit={d[4]} />
        <FlipUnit digit={d[5]} />
      </span>
    </span>
  );
}

export default FlipClock;
