import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ticket } from 'lucide-react';
import { resolveTickets } from '../services/lottery/lotteryService.js';
import TicketCard from '../components/lottery/TicketCard.jsx';

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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tickets.map((tk) => (
            <TicketCard key={tk.id} tk={tk} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTicketsPage;
