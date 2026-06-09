/* Shared lottery number tile — exact Keno squircle box (radial fill + gradient/green
   border). Used by the inline buy board (MegaLootSection) and the play page. */

/* Exact Keno tile squircle path (viewBox 0 0 61 62) */
const TILE_PATH =
  'M1 14.75C1 7.018 7.268 0.75 15 0.75H45.5C53.232 0.75 59.5 7.018 59.5 14.75V45.25C59.5 52.982 53.232 59.25 45.5 59.25H15C7.268 59.25 1 52.982 1 45.25V14.75Z';

/* Gradient defs — copied 1:1 from the Keno board */
export function TileGradients() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <radialGradient id="lp-tile" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30.25 30) rotate(90) scale(29.25)">
          <stop stopOpacity="0.6" stopColor="#3C4357" />
          <stop offset="1" stopOpacity="0.6" stopColor="#262C3E" />
        </radialGradient>
        <radialGradient id="lp-tile-active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30.25 31) rotate(90) scale(26.141)">
          <stop stopColor="var(--color-green-1)" stopOpacity="0.3" />
          <stop offset="1" stopColor="var(--color-green-1)" stopOpacity="0.1" />
        </radialGradient>
        <linearGradient id="lp-border-idle" x1="30.25" y1="0.75" x2="30.25" y2="59.25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3C4357" stopOpacity="0.4" />
          <stop offset="1" stopColor="#262C3E" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Single number tile. `owned` = already-purchased → disabled, faded & blurred. */
export function NumberTile({ num, selected, owned, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={owned}
      aria-disabled={owned || undefined}
      title={owned ? 'Already purchased' : undefined}
      className={`group relative aspect-square w-full select-none will-change-transform transition-transform duration-150 ${
        owned
          ? 'pointer-events-none cursor-not-allowed opacity-40 blur-[1.2px]'
          : `cursor-pointer ${selected ? 'animate-[bounceOnce_0.25s_ease-out]' : 'hover:-translate-y-[2px]'}`
      }`}
      style={{ filter: selected && !owned ? 'drop-shadow(0 0 7px color-mix(in srgb, var(--color-green-1) 50%, transparent))' : undefined }}
    >
      <svg viewBox="0 0 61 62" fill="none" className="absolute inset-0 h-full w-full">
        <path d={TILE_PATH} fill={selected ? 'url(#lp-tile-active)' : 'url(#lp-tile)'} />
        <path d={TILE_PATH} stroke={selected ? 'var(--color-green-1)' : 'url(#lp-border-idle)'} strokeWidth={selected ? 2 : 1} fill="none" />
      </svg>
      <span className={`absolute inset-0 z-10 flex items-center justify-center text-[16px] font-bold tabular-nums transition-colors ${selected ? 'text-[var(--color-green-1)]' : 'text-[var(--color-foreground-muted-1)] group-hover:text-[var(--color-foreground-primary)]'}`}>
        {num}
      </span>
    </button>
  );
}

export default NumberTile;
