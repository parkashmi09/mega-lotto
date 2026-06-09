import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { getDraws } from '../services/lottery/lotteryService.js';
import { DrawCard } from '../components/lottery/DrawCard.jsx';
import LotteryBannerSlider from '../components/lottery/LotteryBannerSlider.jsx';
import LotteryCategoryCarousel from '../components/lottery/LotteryCategoryCarousel.jsx';
import MegaLootSection from '../components/lottery/MegaLootSection.jsx';
import { PaymentMarquee } from '../components/lottery/PaymentMarquee.jsx';
import LatestWinners from '../components/lottery/LatestWinners.jsx';
import { DepositModal } from '../components/wallet/DepositModal.jsx';
import { useAuthState } from '../hooks/useAuthState.js';

export function LotteryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthState();
  const { activeLotteries } = useSiteConfig();
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('mega');
  const [depositOpen, setDepositOpen] = useState(false);

  const onDeposit = () => (isLoggedIn ? setDepositOpen(true) : navigate('/login'));

  useEffect(() => {
    let alive = true;
    getDraws(activeLotteries)
      .then((d) => { if (alive) setDraws(d); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [activeLotteries]);

  // Every draw matching the selected category shows as a card (Mega Lotto too).
  const gridDraws = useMemo(
    () => draws.filter((d) => (d.categories || []).includes(category)),
    [draws, category]
  );

  const heroSection = <MegaLootSection lotteryId="mega_millions" />;
  const grid = loading ? (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="h-48 animate-pulse rounded-2xl bg-[var(--color-surface)]" />
      ))}
    </div>
  ) : gridDraws.length === 0 ? null : (
    <div className="grid gap-4 sm:grid-cols-2">
      {gridDraws.map((draw) => (
        <DrawCard key={draw.id} draw={draw} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6 py-4">
      {/* Banner slider (same as old Thrill banner — replace image in LotteryBannerSlider) */}
      <LotteryBannerSlider />

      {/* Category carousel */}
      <LotteryCategoryCarousel activeCategory={category} onCategoryChange={setCategory} />

      {/* Every category → that category's draw cards on top, Mega Lotto buy hero below. */}
      {grid}
      {heroSection}

      {/* Latest winners (last results) */}
      <LatestWinners />

      {/* Payments + Deposit CTA (slim strip) */}
      <section className="relative overflow-hidden rounded-[18px] border border-[var(--color-green-1)]/15 bg-[var(--color-surface-1)] px-4 py-3.5">
        <div className="pointer-events-none absolute -right-12 -top-16 size-40 rounded-full bg-[var(--color-green-1)] opacity-[0.10] blur-3xl" aria-hidden />
        <div className="relative z-[1] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="shrink-0">
              <h3 className="text-[15px] font-extrabold leading-tight text-[var(--color-foreground-primary)]">{t('lottery.fundWallet', 'Fund your wallet')}</h3>
              <p className="text-[11px] text-[var(--color-foreground-muted-1)]">{t('lottery.fundWalletSub', 'UPI · Cards · Net banking & more')}</p>
            </div>
            {/* Slim payment marquee */}
            <div className="hidden min-w-0 flex-1 sm:block">
              <PaymentMarquee />
            </div>
          </div>
          <button
            type="button"
            onClick={onDeposit}
            className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--color-green-1)] px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide text-[var(--color-base-14)] shadow-[0_0_20px_-7px_var(--color-green-1)] transition hover:brightness-110 active:scale-[0.98] cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={17} height={17}><path fillRule="evenodd" d="M18.097 1.617c.418.458.03 1.103-.585 1.18-2.632.333-6.444.642-9.262.703-.585.013-.723.365-.722.7 0 .17.074.314.19.422.11.103.269.129.42.128 3.674-.012 7.168-.248 9.395-.437a3.26 3.26 0 0 1 2.907 1.304 3.1 3.1 0 0 1 .585 1.604v.005q.05.66.094 1.467c-1.153.125-2.286.203-3.358.174-1.69-.045-3.632 1.13-3.732 3.33a29 29 0 0 0 .009 2.737c.096 1.669 1.342 3.056 3.06 3.253 1.319.151 2.73.094 4.03-.082A57 57 0 0 1 21 19.865c-.126 1.426-1.136 2.617-2.595 2.863-1.492.252-3.911.523-7.405.523-3.525 0-5.935-.276-7.404-.53-1.412-.244-2.4-1.384-2.546-2.768-.145-1.366-.3-3.503-.3-6.373 0-3.03.173-5.364.323-6.816.129-1.247.702-2.513 1.912-3.22C4.884 2.435 8.778.927 16.039.765c.828-.018 1.552.297 2.058.853m3.75 14.854c-1.443.272-3.1.396-4.579.226a1.95 1.95 0 0 1-1.733-1.849 26.973 26.973 0 0 1-.008-2.581c.055-1.196 1.119-1.928 2.194-1.9 1.193.032 2.429-.058 3.64-.19 1.044-.116 2.049.596 2.106 1.718a27 27 0 0 1-.007 2.778c-.057.92-.73 1.632-1.612 1.798M18.5 12.5c.483 0 .875.392.875.875v.5a.875.875 0 0 1-1.75 0v-.5c0-.483.392-.875.875-.875" clipRule="evenodd" /></svg>
            {t('lottery.depositNow', 'Deposit Now')}
          </button>
        </div>
        {/* Mobile: payment marquee below */}
        <div className="relative z-[1] mt-3 sm:hidden">
          <PaymentMarquee />
        </div>
      </section>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />
    </div>
  );
}

export default LotteryPage;
