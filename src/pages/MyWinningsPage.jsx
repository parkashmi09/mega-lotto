import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, IndianRupee, Clock } from 'lucide-react';
import { resolveTickets } from '../services/lottery/lotteryService.js';
import NumberStrip from '../components/lottery/NumberStrip.jsx';

const fmtDate = (iso) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);
const TIER = { 1: '1st Prize', 2: '2nd Prize', 3: '3rd Prize' };

export function MyWinningsPage({ embedded = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const refresh = () => setTickets(resolveTickets());
    refresh();
    const id = setInterval(refresh, 5000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(id); window.removeEventListener('focus', refresh); };
  }, []);

  const wins = useMemo(
    () => tickets.filter((t) => t.status === 'won').sort((a, b) => new Date(b.resolvedAt) - new Date(a.resolvedAt)),
    [tickets]
  );
  const total = useMemo(() => wins.reduce((s, w) => s + (w.prizeWon || 0), 0), [wins]);

  return (
    <div className={embedded ? 'space-y-5' : 'space-y-5 py-4'}>
      {!embedded && (
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-[var(--color-foreground-primary)]">
          <Trophy size={22} className="text-[var(--color-green-1)]" /> {t('lottery.myWinnings', 'My Winnings')}
        </h1>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-[18px] border border-[var(--color-green-1)]/15 bg-[var(--color-surface-1)] p-5"
          style={{ background: 'radial-gradient(120% 120% at 90% -10%, color-mix(in srgb, var(--color-green-1) 18%, transparent) 0%, transparent 55%), var(--color-surface-1)' }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-foreground-muted-2)]">{t('lottery.totalWon', 'Total Won')}</p>
          <p className="mt-1 flex items-center text-[26px] font-extrabold text-[var(--color-green-1)]"><IndianRupee size={20} strokeWidth={2.6} />{new Intl.NumberFormat('en-IN').format(total)}</p>
        </div>
        <div className="rounded-[18px] border border-white/[0.06] bg-[var(--color-surface-1)] p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-foreground-muted-2)]">{t('lottery.wins', 'Wins')}</p>
          <p className="mt-1 text-[26px] font-extrabold text-[var(--color-foreground-primary)]">{wins.length}</p>
        </div>
      </div>

      {wins.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-[var(--color-surface-1)] py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-foreground-muted-1)]">
            <Trophy size={26} />
          </span>
          <p className="text-sm text-[var(--color-foreground-muted-1)]">{t('lottery.noWins', 'No winnings yet — your next ticket could be the one!')}</p>
          <button type="button" onClick={() => navigate('/lottery')} className="rounded-full bg-[var(--color-green-1)] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[var(--color-base-14)] transition hover:brightness-110">
            {t('lottery.browseDraws', 'Browse Draws')}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {wins.map((tk) => (
            <article
              key={tk.id}
              className="relative flex flex-col gap-4 overflow-hidden rounded-[20px] border border-[var(--color-green-1)]/20 bg-[var(--color-surface-1)] p-5"
              style={{ background: 'radial-gradient(130% 110% at 100% -10%, color-mix(in srgb, var(--color-green-1) 16%, transparent) 0%, transparent 55%), var(--color-surface-1)' }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-white" style={{ backgroundColor: tk.color }}>
                    <Trophy size={15} />
                  </span>
                  <div>
                    <p className="text-[15px] font-extrabold text-[var(--color-foreground-primary)]">{tk.name}</p>
                    <p className="text-[11px] text-[var(--color-foreground-muted-2)]">{fmtDate(tk.resolvedAt || tk.purchasedAt)}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--color-green-1)]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-green-1)] ring-1 ring-[var(--color-green-1)]/40">
                  {TIER[tk.tier] || 'Win'}
                </span>
              </div>

              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-foreground-muted-2)]">{t('lottery.yourNumber', 'Your Number')}</p>
                <NumberStrip value={tk.number} size={30} />
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
                <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-foreground-muted-1)]"><Clock size={13} /> {fmtDate(tk.drawAt)}</span>
                <span className="flex items-center text-[18px] font-extrabold text-[var(--color-green-1)]"><IndianRupee size={15} strokeWidth={2.6} />{new Intl.NumberFormat('en-IN').format(tk.prizeWon)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyWinningsPage;
