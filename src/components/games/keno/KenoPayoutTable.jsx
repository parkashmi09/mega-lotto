export function KenoPayoutTable({ payoutTable, hitCount, gamePhase, picksCount }) {
  if (!payoutTable || payoutTable.length === 0) return null;

  return (
    <div className="w-full max-w-[700px] mt-[16px]">
      {/* Multiplier row */}
      <div className="flex gap-[4px]">
        {payoutTable.map((mult, idx) => {
          const isHit = gamePhase === 'result' && idx === hitCount;
          const isBelow = gamePhase === 'result' && idx < hitCount;
          return (
            <div
              key={idx}
              className={`
                flex-1 text-center py-[6px] sm:py-[8px] rounded-[10px] text-[11px] sm:text-[13px] font-bold transition-all duration-300
                ${isHit
                  ? 'bg-[var(--color-green-1)] text-[var(--color-base-14)]'
                  : isBelow
                    ? 'bg-[var(--color-surface-3)] text-[var(--color-foreground-muted-2)]'
                    : 'bg-[var(--color-surface-2)] text-[var(--color-foreground-muted-1)]'
                }
              `}
            >
              {mult}x
            </div>
          );
        })}
      </div>
      {/* Dots row */}
      <div className="flex gap-[4px] mt-[8px]">
        {payoutTable.map((_, idx) => {
          const isActive = gamePhase === 'result' && idx <= hitCount;
          const isHit = gamePhase === 'result' && idx === hitCount;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-[3px]">
              <div
                className={`
                  w-[8px] h-[8px] rounded-full transition-all duration-300
                  ${isHit
                    ? 'bg-[var(--color-green-1)] shadow-[0_0_6px_var(--color-green-1)]'
                    : isActive
                      ? 'bg-[var(--color-green-1)]'
                      : 'bg-[var(--color-surface-3)]'
                  }
                `}
              />
              <span className="text-[10px] text-[var(--color-foreground-muted-2)]">{idx}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
