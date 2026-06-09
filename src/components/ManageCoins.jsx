import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import coinsData from '@/utils/coins';

/**
 * ManageCoins – toggle which coins show in wallet popover (mirrors jackopot ManageCoins).
 */
export function ManageCoins({ isOpen, onClose, onCoinsUpdated }) {
  const [coins, setCoins] = useState([]);
  const [activeCoins, setActiveCoins] = useState([]);

  useEffect(() => {
    const available = coinsData.filter(
      (c) => c.preffix !== 'SC' && c.preffix !== 'JPC' && c.active
    );
    const stored = localStorage.getItem('active_coins');
    const ids = stored ? stored.split(',').map((id) => id.trim()) : ['1', '2', '3', '4'];
    setCoins(available);
    setActiveCoins(ids);
  }, [isOpen]);

  const getCoinImagePath = (coin) => {
    if (!coin?.image) return '/assets/images/coins/BTC.webp';
    const map = { USDT: 'USDT.webp', TRX: 'TRON.webp' };
    let name = map[coin.preffix] || coin.image;
    name = name.replace(/^coins\//, '').replace(/^assets\/images\//, '');
    return `/assets/images/coins/${name}`;
  };

  const handleToggle = (coinId) => {
    setActiveCoins((prev) => {
      const id = String(coinId);
      const isActive = prev.includes(id);
      let next = isActive ? prev.filter((i) => i !== id) : [...prev, id];
      if (next.length === 0) next = ['1'];
      if (!next.includes('1')) next = ['1', ...next];
      localStorage.setItem('active_coins', next.join(','));
      onCoinsUpdated?.(next);
      return next;
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-index-drawer-portal)] bg-[var(--color-surface-backdrop)]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[var(--z-index-drawer-portal)] w-[90vw] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-lg outline-none p-4"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between mb-3">
            <Dialog.Title className="text-lg font-semibold text-[var(--color-foreground-primary)]">
              Manage Coins
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1 rounded-[var(--radius-sm)] text-[var(--color-foreground-muted-1)] hover:bg-[var(--color-control-primary)]"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <p className="text-sm text-[var(--color-foreground-muted-1)] mb-4">
            Toggle coins to show or hide them in your wallet dropdown.
          </p>
          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            {coins.map((coin) => {
              const isActive = activeCoins.includes(String(coin.id));
              return (
                <div
                  key={coin.id}
                  className="flex items-center justify-between gap-3 py-2 px-3 rounded-[var(--radius-md)] bg-[var(--color-control-primary)]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={getCoinImagePath(coin)}
                      alt={coin.name}
                      className="size-8 shrink-0 rounded-full object-cover"
                      onError={(e) => {
                        if (coin.preffix === 'USDT' && e.target.src.includes('USDT.webp'))
                          e.target.src = '/assets/images/coins/TETHER.webp';
                        else e.target.src = '/assets/images/coins/BTC.webp';
                      }}
                    />
                    <span className="font-medium text-[var(--color-foreground-primary)] truncate">
                      {coin.preffix}
                    </span>
                  </div>
                  <label className="relative inline-block w-9 h-5 shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => handleToggle(coin.id)}
                      disabled={coin.id === 1}
                      className="sr-only"
                    />
                    <span
                      className={`absolute inset-0 rounded-full transition-colors ${isActive ? 'bg-[var(--color-button-primary)]' : 'bg-[var(--color-surface-2)]'}`}
                    />
                    <span
                      className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform"
                      style={{ transform: isActive ? 'translateX(1rem)' : 'translateX(0)' }}
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default ManageCoins;
