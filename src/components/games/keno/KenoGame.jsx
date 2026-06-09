import { useKenoGame } from './useKenoGame.js';
import { useKenoSounds } from './useKenoSounds.js';
import { KenoBoard } from './KenoBoard.jsx';
import { KenoControls } from './KenoControls.jsx';
import { KenoPayoutTable } from './KenoPayoutTable.jsx';

export function KenoGame() {
  const game = useKenoGame();
  const { play: playSound } = useKenoSounds();

  const handleToggle = (num) => {
    const wasSelected = game.selectedNumbers.has(num);
    game.toggleNumber(num);
    playSound('pick');
  };

  const handlePlay = () => {
    playSound('bet');
    game.play({ playSound });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-[16px] w-full">
      {/* Left Panel - Controls */}
      <div className="w-full lg:w-[360px] lg:min-w-[360px] shrink-0 order-2 lg:order-1">
        <KenoControls
          mode={game.mode}
          setMode={game.setMode}
          betAmount={game.betAmount}
          setBetAmount={game.setBetAmount}
          halveBet={game.halveBet}
          doubleBet={game.doubleBet}
          riskLevel={game.riskLevel}
          setRiskLevel={game.setRiskLevel}
          picksCount={game.picksCount}
          setPicksCount={game.setPicksCount}
          minPicks={game.minPicks}
          maxPicks={game.maxPicks}
          clearPicks={game.clearPicks}
          autoPickNumbers={() => { game.autoPickNumbers(); playSound('pick'); }}
          play={handlePlay}
          resetGame={game.resetGame}
          gamePhase={game.gamePhase}
          selectedNumbers={game.selectedNumbers}
          isPlaying={game.isPlaying}
        />
      </div>

      {/* Right Panel - Game Board */}
      <div className="flex-1 order-1 lg:order-2 flex flex-col items-center justify-center bg-[var(--color-surface-1)] rounded-[24px] sm:rounded-[32px] p-[16px] sm:p-[24px] min-h-[400px] lg:min-h-[550px]">
        {/* Result banner */}
        {game.gamePhase === 'result' && (
          <div className={`mb-[16px] px-[24px] py-[10px] rounded-full font-bold text-[16px] animate-[bounceOnce_0.4s_ease-out] ${game.payout > 0 ? 'bg-[var(--color-green-1)] text-[var(--color-base-14)]' : 'bg-[var(--color-surface-3)] text-[var(--color-foreground-muted-1)]'}`}>
            {game.payout > 0 ? `You won ${game.payout.toFixed(2)} USDT!` : 'No win this round'}
            <span className="ml-[8px] text-[14px] opacity-80">({game.hitCount} hits)</span>
          </div>
        )}

        <KenoBoard
          totalNumbers={game.totalNumbers}
          selectedNumbers={game.selectedNumbers}
          drawnNumbers={game.drawnNumbers}
          gamePhase={game.gamePhase}
          onToggle={handleToggle}
        />

        {/* Selection hint */}
        {game.gamePhase === 'idle' && game.selectedNumbers.size < game.picksCount && (
          <p className="mt-[12px] text-[13px] text-[var(--color-foreground-muted-2)]">
            Select 1-10 Numbers To Play
          </p>
        )}

        <KenoPayoutTable
          payoutTable={game.payoutTable}
          hitCount={game.hitCount}
          gamePhase={game.gamePhase}
          picksCount={game.picksCount}
        />
      </div>
    </div>
  );
}
