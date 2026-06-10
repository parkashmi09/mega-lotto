import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ticket, Clock, IndianRupee } from 'lucide-react';
import { resolveTickets } from '../services/lottery/lotteryService.js';
import RealisticTicket from '../components/lottery/RealisticTicket.jsx';

const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export function MyTicketsPage({ embedded = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  // Resolve immediately, then poll so results auto-declare once a draw passes.
  useEffect(() => {
    const refresh = () => setTickets(resolveTickets());
    refresh();
    const id = setInterval(refresh, 5000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(id); window.removeEventListener('focus', refresh); };
  }, []);

  return (
    <div className={embedded ? 'space-y-5' : 'space-y-5 py-4'}>
      {!embedded && (
        <h1 className="flex items-center gap-2 text-2xl font-extrabold text-[var(--color-foreground-primary)]">
          <Ticket size={22} className="text-[var(--color-green-1)]" /> {t('lottery.myTickets', 'My Tickets')}
        </h1>
      )}

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-[var(--color-surface-1)] py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-foreground-muted-1)]">
            <Ticket size={26} />
          </span>
          <p className="text-sm text-[var(--color-foreground-muted-1)]">{t('lottery.noTickets', 'You have no tickets yet.')}</p>
          <button
            type="button"
            onClick={() => navigate('/lottery')}
            className="rounded-full bg-[var(--color-green-1)] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[var(--color-base-14)] transition hover:brightness-110"
          >
            {t('lottery.browseDraws', 'Browse Draws')}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
          {tickets.map((tk) => (
            <article key={tk.id} className="flex flex-col gap-3">
              <RealisticTicket
                name={tk.name}
                subtitle={t('lottery.ticketSubtitle', 'PREMIUM LUCK DRAW')}
                color={tk.color}
                prizeText={t('lottery.ticketPrizeText', 'WIN ₹10,00,000')}
                prizeWon={tk.prizeWon}
                number={tk.number}
                status={tk.status}
              />

              {/* meta below the ticket */}
              <div className="flex items-center justify-between px-1 text-[12px] text-[var(--color-foreground-muted-1)]">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> {tk.status === 'pending' ? t('lottery.drawAt', 'Draw') : t('lottery.drawn', 'Drawn')} · {fmtDate(tk.drawAt)}
                </span>
                <span className="flex items-center font-bold text-[var(--color-foreground-primary)]">
                  <IndianRupee size={12} strokeWidth={2.6} />{new Intl.NumberFormat('en-IN').format(tk.price)}
                </span>
              </div>

              {/* declared winning number */}
              {tk.winningNumber && (
                <p className="px-1 text-[12px] text-[var(--color-foreground-muted-2)]">
                  {t('lottery.winningNumber', 'Winning Number')}:{' '}
                  <span className={`font-extrabold tabular-nums ${tk.status === 'won' ? 'text-[var(--color-green-1)]' : 'text-[var(--color-foreground-primary)]'}`}>#{tk.winningNumber}</span>
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTicketsPage;
