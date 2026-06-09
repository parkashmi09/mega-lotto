import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ticket, Trophy, ChevronRight } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { useMobileMenu } from '../context/MobileMenuContext.jsx';

const LOTTERY_LABELS = {
  powerball: 'Powerball',
  mega_millions: 'Mega Loot',
  euro_jackpot: 'EuroJackpot',
  daily_pick: 'Daily Pick',
  keno_draw: 'Keno Draw',
};

const LOTTERY_COLORS = {
  powerball: '#e23b3b',
  mega_millions: '#f0a020',
  euro_jackpot: '#5b8def',
  daily_pick: '#27c498',
  keno_draw: '#9b6bdf',
};

/* Polished menu row — colored icon chip + label + hover chevron. */
function MenuRow({ icon: Icon, label, onClick, color, dot, disabled }) {
  const accent = color || 'var(--color-green-1)';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 transition-colors duration-200 cursor-pointer hover:bg-[var(--color-surface-2)] disabled:pointer-events-none disabled:opacity-50"
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-[11px]"
        style={{ backgroundColor: `color-mix(in oklab, ${accent} 16%, transparent)`, color: accent }}
      >
        {dot ? <span className="size-2.5 rounded-full" style={{ backgroundColor: accent }} /> : <Icon size={18} strokeWidth={2.2} />}
      </span>
      <span className="flex-1 text-left text-[15px] font-bold text-[var(--color-foreground-secondary)]">{label}</span>
      <ChevronRight size={16} className="shrink-0 text-[var(--color-foreground-muted-2)] opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="px-[18px] pt-[10px] pb-[12px]">
      <span className="block text-[11px] font-bold uppercase tracking-widest text-[var(--color-foreground-muted-1)]">
        {children}
      </span>
    </div>
  );
}

export function MobileMenuDrawer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { open, closeMenu } = useMobileMenu();
  const { isLotteryActive, activeLotteries } = useSiteConfig();

  // Keep mounted through the exit animation
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const tmo = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(tmo);
  }, [open]);

  // Close on route change
  useEffect(() => {
    if (open) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeMenu]);

  const go = (to) => { navigate(to); closeMenu(); };

  const lotteries = useMemo(
    () => (isLotteryActive ? activeLotteries || [] : []),
    [isLotteryActive, activeLotteries]
  );

  if (!mounted) return null;

  return (
    <div className="xl:hidden" aria-hidden={!open}>
      {/* Transparent click-catcher (keeps bottom nav visible underneath) */}
      <div
        onClick={closeMenu}
        className="fixed inset-0 z-[var(--z-index-floating-panel)]"
      />

      {/* Full overlay panel: fills from below the header down to above the bottom nav */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('app.menu')}
        className={`fixed left-0 right-0 z-[var(--z-index-mobile-menu)]
          top-[calc(var(--bl-header-height)+8px)]
          bottom-[calc(var(--bl-bottom-nav-offset-y)+8px)]
          mx-[var(--bl-bottom-nav-padding-x)]
          overflow-hidden rounded-[32px]
          bg-[var(--color-background-secondary)] effect-blur-m
          border border-[var(--color-foreground-muted-1)]/10 shadow-2xl
          origin-bottom transition-[opacity,transform] duration-200 ease-out
          ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
      >
        <div className="relative flex h-full flex-col pt-6">
          {/* Title */}
          <div className="px-6 pb-3">
            <h2 className="text-lg font-extrabold uppercase tracking-wide text-[var(--color-foreground-primary)]">
              {t('lottery.lottery', 'Lottery')}
            </h2>
          </div>

          {/* Scrollable content */}
          <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-24">
            {/* Quick links */}
            <div className="flex flex-col gap-0.5">
              <MenuRow icon={Ticket} color="#27c498" label={t('lottery.myTickets', 'My Tickets')} onClick={() => go('/lottery/my-tickets')} />
              <MenuRow icon={Trophy} color="#f0a020" label={t('lottery.results', 'Results')} onClick={() => go('/lottery/results')} />
            </div>

            {/* Lottery draws */}
            {lotteries.length > 0 && (
              <>
                <SectionLabel>{t('lottery.draws', 'Draws')}</SectionLabel>
                <div className="flex flex-col gap-0.5">
                  {lotteries.map((lot) => (
                    <MenuRow
                      key={lot}
                      icon={Ticket}
                      color={LOTTERY_COLORS[lot] || 'var(--color-green-1)'}
                      label={LOTTERY_LABELS[lot] || lot}
                      onClick={() => go(`/lottery/play/${lot}`)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenuDrawer;
