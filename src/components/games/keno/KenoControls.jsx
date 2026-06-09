const RISK_LEVELS = ['classic', 'low', 'medium', 'high'];

export function KenoControls({
  mode, setMode,
  betAmount, setBetAmount, halveBet, doubleBet,
  riskLevel, setRiskLevel,
  picksCount, setPicksCount, minPicks, maxPicks,
  clearPicks, autoPickNumbers,
  play, resetGame,
  gamePhase, selectedNumbers, isPlaying,
}) {
  const canPlay = selectedNumbers.size === picksCount && gamePhase === 'idle';

  return (
    <div className="flex flex-col gap-[16px] w-full bg-[var(--color-surface-1)] rounded-[24px] sm:rounded-[32px] p-[20px] sm:p-[24px]">
      {/* Mode Tabs */}
      <div className="flex gap-[4px] bg-[var(--color-surface-2)] rounded-full p-[4px]">
        {['manual', 'autoplay'].map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`
              flex-1 py-[8px] rounded-full text-[13px] font-bold uppercase tracking-wide transition-all cursor-pointer
              ${mode === m
                ? 'bg-[var(--color-background-secondary)] text-[var(--color-green-1)]'
                : 'text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)]'
              }
            `}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Bet Amount */}
      <div>
        <div className="flex items-center justify-between mb-[8px]">
          <span className="text-[13px] font-bold text-[var(--color-foreground-primary)] uppercase tracking-wide flex items-center gap-[6px]">
            Bet Amount
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" width={14} height={14} className="text-[var(--color-foreground-muted-2)]">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <text x="8" y="12" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="bold">i</text>
            </svg>
          </span>
          <span className="text-[13px] text-[var(--color-foreground-muted-1)]">
            {betAmount.toFixed(2)} USDT
          </span>
        </div>
        <div className="flex items-center gap-[8px] bg-[var(--color-surface-2)] rounded-full px-[16px] py-[10px]">
          <span className="flex items-center justify-center w-[28px] h-[28px] rounded-full bg-[var(--color-green-1)] text-[var(--color-base-14)] text-[14px] font-bold shrink-0">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={betAmount}
            onChange={e => setBetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="flex-1 bg-transparent text-[var(--color-foreground-primary)] text-[18px] font-bold outline-none min-w-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button type="button" onClick={halveBet} className="text-[14px] font-bold text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] cursor-pointer px-[4px]">1/2</button>
          <button type="button" onClick={doubleBet} className="text-[14px] font-bold text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] cursor-pointer px-[4px]">X2</button>
        </div>
      </div>

      {/* Risk Level */}
      <div>
        <span className="text-[13px] font-bold text-[var(--color-foreground-primary)] uppercase tracking-wide block mb-[8px]">
          Risk Level
        </span>
        <div className="flex gap-[6px]">
          {RISK_LEVELS.map(level => (
            <button
              key={level}
              type="button"
              onClick={() => setRiskLevel(level)}
              disabled={gamePhase !== 'idle'}
              className={`
                flex-1 py-[8px] rounded-full text-[12px] font-bold uppercase tracking-wide transition-all cursor-pointer
                ${riskLevel === level
                  ? 'bg-[var(--color-background-secondary)] text-[var(--color-green-1)]'
                  : 'text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)]'
                }
                disabled:cursor-default disabled:opacity-60
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Number Picker */}
      <div>
        <div className="flex items-center justify-between mb-[8px]">
          <span className="text-[13px] font-bold text-[var(--color-foreground-primary)] uppercase tracking-wide">
            Number Picker
          </span>
          <button
            type="button"
            onClick={clearPicks}
            disabled={gamePhase !== 'idle'}
            className="text-[12px] text-[var(--color-foreground-muted-1)] underline hover:text-[var(--color-foreground-primary)] cursor-pointer disabled:opacity-50 disabled:cursor-default"
          >
            Clear Picks
          </button>
        </div>
        <div className="flex items-center gap-[12px]">
          <span className="text-[18px] font-bold text-[var(--color-foreground-primary)] w-[24px] text-center shrink-0">{picksCount}</span>
          <input
            type="range"
            min={minPicks}
            max={maxPicks}
            value={picksCount}
            onChange={e => setPicksCount(parseInt(e.target.value))}
            disabled={gamePhase !== 'idle'}
            className="flex-1 h-[6px] appearance-none rounded-full bg-[var(--color-surface-3)] outline-none cursor-pointer disabled:opacity-60
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:h-[22px]
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-green-1)]
              [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[var(--color-base-14)]
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            style={{
              background: `linear-gradient(to right, var(--color-green-1) ${((picksCount - minPicks) / (maxPicks - minPicks)) * 100}%, var(--color-surface-3) ${((picksCount - minPicks) / (maxPicks - minPicks)) * 100}%)`,
            }}
          />
          <button
            type="button"
            onClick={autoPickNumbers}
            disabled={gamePhase !== 'idle'}
            className="text-[13px] font-bold text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] cursor-pointer disabled:opacity-50 disabled:cursor-default shrink-0"
          >
            PICK
          </button>
        </div>
      </div>

      {/* Selection info */}
      <div className="text-center text-[12px] text-[var(--color-foreground-muted-2)]">
        {selectedNumbers.size} / {picksCount} numbers selected
      </div>

      {/* Play / Reset Button */}
      {gamePhase === 'result' ? (
        <button
          type="button"
          onClick={resetGame}
          className="w-full py-[16px] rounded-full bg-[var(--color-surface-3)] text-[var(--color-foreground-primary)] text-[18px] font-bold uppercase tracking-wide cursor-pointer hover:bg-[var(--color-surface-4)] transition-all"
        >
          New Game
        </button>
      ) : (
        <button
          type="button"
          onClick={play}
          disabled={!canPlay || isPlaying}
          className={`
            w-full py-[16px] rounded-full text-[18px] font-bold uppercase tracking-wide transition-all
            ${canPlay && !isPlaying
              ? 'bg-[var(--color-green-1)] text-[var(--color-base-14)] cursor-pointer hover:brightness-110 active:scale-[0.98]'
              : 'bg-[var(--color-surface-3)] text-[var(--color-foreground-muted-2)] cursor-not-allowed'
            }
          `}
        >
          {isPlaying ? 'Drawing...' : 'Play'}
        </button>
      )}
    </div>
  );
}
