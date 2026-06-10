import { useTranslation } from 'react-i18next';
import { Ticket, Clock, Trophy, XCircle, Hourglass } from 'lucide-react';

/**
 * My-Tickets card — shares the DrawCard visual language: a draw-colour gradient
 * body, soft glow, icon badge, perforated stub and side notches. Status drives
 * the badge + prize colour (pending → draw colour, won → green, lost → red) but
 * the card stays brand-tinted so it never looks flat/dead.
 *
 * Expects a resolved ticket: { name, color, number, price, jackpot, drawAt,
 *   status: 'pending'|'won'|'lost', prizeWon, winningNumber, matched }.
 */
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const fmtMoney = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

export default function TicketCard({ tk }) {
  const { t } = useTranslation();
  const won = tk.status === 'won';
  const lost = tk.status === 'lost';
  const pending = tk.status === 'pending';
  const brand = tk.color || '#f0a020';
  const glow = won ? 'var(--color-green-1)' : brand;

  const status = won
    ? { label: t('lottery.won', 'Won'), Icon: Trophy, color: 'var(--color-green-1)' }
    : lost
    ? { label: t('lottery.lost', 'Lost'), Icon: XCircle, color: '#e2493b' }
    : { label: t('lottery.pending', 'Pending'), Icon: Hourglass, color: brand };

  return (
    <article
      className="group relative block overflow-hidden rounded-[22px] border transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: `radial-gradient(135% 100% at 92% -10%, color-mix(in srgb, ${brand} 26%, transparent) 0%, transparent 58%), linear-gradient(155deg, color-mix(in srgb, ${brand} 12%, #0c1024) 0%, #080b16 100%)`,
        borderColor: `color-mix(in srgb, ${glow} 24%, transparent)`,
      }}
    >
      {/* ── top: brand + status ── */}
      <div className="relative z-[1] px-5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] text-white" style={{ backgroundColor: brand }}>
              <Ticket size={17} />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-[16px] font-extrabold leading-tight text-[var(--color-foreground-primary)]">{tk.name}</h3>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-foreground-muted-2)]">
                {t('lottery.premiumLuckDraw', 'PREMIUM LUCK DRAW')}
              </p>
            </div>
          </div>
          <span
            className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1"
            style={{
              color: status.color,
              backgroundColor: `color-mix(in srgb, ${status.color} 16%, transparent)`,
              '--tw-ring-color': `color-mix(in srgb, ${status.color} 42%, transparent)`,
            }}
          >
            <status.Icon size={11} /> {status.label}
          </span>
        </div>

        {/* ── number + prize: pending shows the player's lucky number, once
             drawn it flips to the declared winning number ── */}
        <div className="mt-4 mb-5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-foreground-muted-2)]">
              {pending
                ? `${t('lottery.lucky', 'LUCKY')} ${t('lottery.number', 'Number')}`
                : t('lottery.winningNumber', 'Winning Number')}
            </p>
            <p className="font-mono text-[32px] font-black leading-none tabular-nums" style={{ color: won ? 'var(--color-green-1)' : brand }}>
              #{pending ? tk.number : (tk.winningNumber ?? tk.number)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-foreground-muted-2)]">
              {won ? t('lottery.totalWon', 'Total Won') : t('lottery.prize', 'Prize')}
            </p>
            <p
              className="text-[18px] font-extrabold leading-tight tabular-nums"
              style={{ color: won ? 'var(--color-green-1)' : lost ? 'var(--color-foreground-muted-2)' : 'var(--color-foreground-primary)' }}
            >
              {won ? fmtMoney(tk.prizeWon) : lost ? '—' : fmtMoney(tk.jackpot)}
            </p>
          </div>
        </div>
      </div>

      {/* ── perforation: a single clean dashed tear line (no side notches) ── */}
      <div className="relative z-[1] h-0">
        <div className="mx-5 border-t-[2px] border-dashed border-white/20" aria-hidden />
      </div>

      {/* ── stub: meta ── */}
      <div className="relative z-[1] space-y-1.5 px-5 pb-4 pt-3.5">
        <div className="flex items-center justify-between text-[12px]">
          <span className="flex items-center gap-1.5 text-[var(--color-foreground-muted-1)]">
            <Clock size={13} />
            {pending ? t('lottery.drawAt', 'Draw') : t('lottery.drawn', 'Drawn')} · {fmtDate(tk.drawAt)}
          </span>
          <span className="font-bold tabular-nums text-[var(--color-foreground-primary)]">{fmtMoney(tk.price)}</span>
        </div>
      </div>
    </article>
  );
}
