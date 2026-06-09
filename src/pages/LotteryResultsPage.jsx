import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Clock } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { getResults } from '../services/lottery/lotteryService.js';
import NumberStrip from '../components/lottery/NumberStrip.jsx';

const fmtMoney = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export function LotteryResultsPage({ embedded = false }) {
  const { t } = useTranslation();
  const { activeLotteries } = useSiteConfig();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getResults(activeLotteries)
      .then((r) => { if (alive) setResults(r); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [activeLotteries]);

  return (
    <div className={embedded ? 'space-y-5' : 'space-y-5 py-4'}>
      {!embedded && (
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-[var(--color-foreground-primary)]">
          <Trophy size={22} className="text-[var(--color-green-1)]" /> {t('lottery.results', 'Results')}
        </h1>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[18px] bg-[var(--color-surface-1)]" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r) => (
            <article
              key={r.id}
              className="grid grid-cols-1 items-center gap-4 rounded-[18px] border border-white/[0.05] bg-[var(--color-surface-1)] p-4 sm:grid-cols-[1.4fr_auto_1fr] sm:gap-6 sm:p-5"
              style={{ background: `radial-gradient(120% 130% at 100% -20%, color-mix(in srgb, ${r.color} 12%, transparent) 0%, transparent 55%), var(--color-surface-1)` }}
            >
              {/* Draw name + date */}
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-white" style={{ backgroundColor: r.color }}>
                  <Trophy size={15} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-extrabold text-[var(--color-foreground-primary)]">{r.name}</p>
                  <p className="flex items-center gap-1 text-[11px] text-[var(--color-foreground-muted-2)]">
                    <Clock size={11} /> {fmtDate(r.drawDate)}
                  </p>
                </div>
              </div>

              {/* Winning number strip */}
              <div className="flex flex-col items-start gap-1.5 sm:items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-foreground-muted-2)]">{t('lottery.winningNumbers', 'Winning Number')}</span>
                <NumberStrip value={r.number} size={28} />
              </div>

              {/* Jackpot */}
              <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-foreground-muted-2)]">{t('lottery.jackpot', 'Jackpot')}</span>
                <p className="text-[16px] font-extrabold text-[var(--color-foreground-primary)]">{fmtMoney(r.jackpot)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default LotteryResultsPage;
