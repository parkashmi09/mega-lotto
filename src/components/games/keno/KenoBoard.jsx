import { useMemo } from 'react';

function getTileState(num, selectedNumbers, drawnNumbers, gamePhase) {
  const isSelected = selectedNumbers.has(num);
  const isDrawn = drawnNumbers.has(num);

  if (gamePhase === 'idle') {
    return isSelected ? 'active' : 'idle';
  }
  if (isSelected && isDrawn) return 'hit';
  if (!isSelected && isDrawn) return 'drawn';
  if (isSelected && !isDrawn) return 'miss-pending';
  return 'idle';
}

function KenoTile({ num, state, onClick, gamePhase }) {
  const isIdle = state === 'idle';
  const isActive = state === 'active';
  const isHit = state === 'hit';
  const isDrawn = state === 'drawn';
  const isMiss = state === 'miss-pending';

  const fillId = isActive ? 'url(#paint-keno-tile-active)' :
                 isHit ? 'url(#paint-keno-tile-active)' :
                 isMiss ? 'url(#paint-keno-tile-lost)' :
                 isDrawn ? 'url(#paint-keno-tile-drawn)' :
                 'url(#paint-keno-tile)';

  const strokeColor = isActive || isHit ? 'var(--color-green-1)' :
                      isMiss ? 'var(--color-foreground-muted-2)' :
                      'none';

  const strokeWidth = isActive || isHit ? '2' : isMiss ? '1.5' : '0';

  const textClass = isActive ? 'fill-[var(--color-green-1)]' :
                    isHit ? 'fill-[var(--color-base-14)]' :
                    isDrawn ? 'fill-[var(--color-foreground-muted-2)]' :
                    isMiss ? 'fill-[var(--color-foreground-muted-2)]' :
                    'fill-[var(--color-foreground-muted-1)]';

  const animClass = isHit ? 'animate-[bounceOnce_0.4s_ease-out]' :
                    isActive ? 'animate-[bounceOnce_0.25s_ease-out]' :
                    isDrawn ? 'animate-[fadeInTile_0.15s_ease-out]' :
                    '';

  const canClick = gamePhase === 'idle';

  return (
    <button
      type="button"
      onClick={() => canClick && onClick(num)}
      disabled={!canClick}
      className={`inline-block will-change-transform aspect-square ${animClass} disabled:cursor-default`}
      style={{ cursor: canClick ? 'pointer' : 'default' }}
    >
      <div className="h-full w-full relative aspect-square select-none">
        <svg
          viewBox="0 0 61 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full transition-opacity duration-[50ms] ease-out"
        >
          <path
            d="M1 14.75C1 7.018 7.268 0.75 15 0.75H45.5C53.232 0.75 59.5 7.018 59.5 14.75V45.25C59.5 52.982 53.232 59.25 45.5 59.25H15C7.268 59.25 1 52.982 1 45.25V14.75Z"
            fill={fillId}
          />

          {/* Hit gem overlay */}
          {isHit && (
            <g opacity="0.9">
              <circle cx="30" cy="30" r="18" fill="var(--color-green-1)" opacity="0.25" />
              <circle cx="30" cy="30" r="12" fill="var(--color-green-1)" opacity="0.15" />
            </g>
          )}

          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="18"
            x="30"
            y="32"
            className={`font-bold ${textClass}`}
          >
            {num}
          </text>

          {/* Border */}
          <path
            d="M1 14.75C1 7.018 7.268 0.75 15 0.75H45.5C53.232 0.75 59.5 7.018 59.5 14.75V45.25C59.5 52.982 53.232 59.25 45.5 59.25H15C7.268 59.25 1 52.982 1 45.25V14.75Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Idle subtle border */}
          {isIdle && (
            <path
              d="M1 14.75C1 7.018 7.268 0.75 15 0.75H45.5C53.232 0.75 59.5 7.018 59.5 14.75V45.25C59.5 52.982 53.232 59.25 45.5 59.25H15C7.268 59.25 1 52.982 1 45.25V14.75Z"
              stroke="url(#border-idle)"
              strokeWidth="1"
              fill="none"
            />
          )}
        </svg>
      </div>
    </button>
  );
}

export function KenoBoard({ totalNumbers, selectedNumbers, drawnNumbers, gamePhase, onToggle }) {
  const numbers = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= totalNumbers; i++) arr.push(i);
    return arr;
  }, [totalNumbers]);

  return (
    <div className="w-full max-w-[700px]">
      {/* SVG gradient defs */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <radialGradient id="paint-keno-tile" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30.25 30) rotate(90) scale(29.25)">
            <stop stopOpacity="0.6" stopColor="#3C4357" />
            <stop offset="1" stopOpacity="0.6" stopColor="#262C3E" />
          </radialGradient>
          <radialGradient id="paint-keno-tile-active" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30.25 31) rotate(90) scale(26.141)">
            <stop stopColor="var(--color-green-1)" stopOpacity="0.3" />
            <stop offset="1" stopColor="var(--color-green-1)" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="paint-keno-tile-lost" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(29.75 30) rotate(90) scale(29.25)">
            <stop stopColor="#FF6B6B" stopOpacity="0.2" />
            <stop offset="1" stopColor="#FF6B6B" stopOpacity="0.06" />
          </radialGradient>
          <radialGradient id="paint-keno-tile-drawn" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30.25 30) rotate(90) scale(29.25)">
            <stop stopColor="#FF6B6B" stopOpacity="0.12" />
            <stop offset="1" stopColor="#FF6B6B" stopOpacity="0.04" />
          </radialGradient>
          <linearGradient id="border-idle" x1="30.25" y1="0.75" x2="30.25" y2="59.25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3C4357" stopOpacity="0.4" />
            <stop offset="1" stopColor="#262C3E" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="grid grid-cols-8 gap-[6px] sm:gap-[8px]">
        {numbers.map(num => {
          const state = getTileState(num, selectedNumbers, drawnNumbers, gamePhase);
          return (
            <KenoTile
              key={num}
              num={num}
              state={state}
              onClick={onToggle}
              gamePhase={gamePhase}
            />
          );
        })}
      </div>
    </div>
  );
}
