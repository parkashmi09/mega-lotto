import { useState } from 'react';

export default function GameCard({ game, onClick }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = game.game_icon || game.image || '';
  const gameName = game.title || game.name || game.game_name || 'Game';
  const provider = game.provider || game.vendor || '';

  if (imgError || !imageUrl) return null;

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-[var(--color-surface-elevated)]"
      onClick={() => onClick?.(game)}
    >
      <div className="relative aspect-[3/4] w-full">
        <img
          src={imageUrl}
          alt={gameName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/50 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        {provider && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="truncate text-xs text-white/80">{provider}</p>
          </div>
        )}
      </div>
    </div>
  );
}
