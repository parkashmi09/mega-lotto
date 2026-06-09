import { useTranslation } from 'react-i18next';
import GameCard from './GameCard';

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg bg-[var(--color-surface-elevated)]">
      <div className="aspect-[3/4] w-full bg-[var(--color-surface-hover,var(--color-surface-elevated))]" />
    </div>
  );
}

export default function GameGrid({ games = [], isLoading, onGameClick, onLoadMore, hasMore }) {
  const { t } = useTranslation();

  if (isLoading && games.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
        {Array.from({ length: 18 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!isLoading && games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-secondary)]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p className="text-sm">{t('casino.noGames')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
        {games.map(game => (
          <GameCard
            key={game.id || game.uuid || game.game_uid}
            game={game}
            onClick={onGameClick}
          />
        ))}
      </div>
      {hasMore && games.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-lg bg-[var(--color-surface-elevated)] px-8 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-hover,var(--color-surface-elevated))] disabled:opacity-50"
          >
            {isLoading ? t('common.loading') : t('casino.loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
