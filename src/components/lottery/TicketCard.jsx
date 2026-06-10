import { useTranslation } from 'react-i18next';
import { Clock, Trophy, XCircle, Hourglass } from 'lucide-react';

/**
 * Modern My-Tickets card. Flat, theme-aware ticket with a perforated stub,
 * side notches and a status-driven accent (pending → draw colour, won → green,
 * lost → muted). Replaces the old skeuomorphic gold SVG ticket.
 *
 * Expects a resolved ticket: { name, color, number, price, jackpot, drawAt,
 *   status: 'pending'|'won'|'lost', prizeWon, winningNumber, matched }.
 */
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
const fmtMoney = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

export default function TicketCard({ tk }) {
  const { t } = useTranslation();
  const won = tk.status === 'won';
  const lost = tk.status === 'lost';
  const pending = tk.status === 'pending';

  // accent colour: green when won, draw colour while pending, muted when lost
  const accent = won ? 'var(--color-green-1)' : lost ? 'var(--color-foreground-muted-2)' : tk.color;

  const statusMeta = won
    ? { label: t('lottery.won', 'Won'), Icon: Trophy }
    : lost
    ? { label: t('lottery.lost', 'Lost'), Icon: XCircle }
    : { label: t('lottery.pending', 'Pending'), Icon: Hourglass };

  return (
    <article
      className="relative overflow-hidden rounded-[20px] border border-white/[0.06] bg-[var(--color-surface-1)] transition duration-300 hover:border-white/[0.12] hover:-translate-y-0.5"
      style={{ boxShadow: won ? '0 0 30px -16px var(--color-green-1)' : undefined }}
    >
      {/* left accent strip */}
      <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: accent }} aria-hidden />
      {/* soft corner glow */}
      <div
        className="pointer-events-none absolute -right-12 -top-14 size-36 rounded-full opacity-[0.18] blur-3xl"
        style={{ background: accent }}
        aria-hidden
      />

      {/* ── top: brand + status ── */}
      <div className="relative flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-extrabold uppercase leading-tight tracking-wide text-[var(--color-foreground-primary)]">
            {tk.name}
          </h3>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-foreground-muted-2)]">
            {t('lottery.premiumLuckDraw', 'PREMIUM LUCK DRAW')}
          </p>
        </div>
        <span
          className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
          style={{ color: accent, backgroundColor: 'color-mix(in srgb, currentColor 14%, transparent)' }}
        >
          <statusMeta.Icon size={12} />
          {statusMeta.label}
        </span>
      </div>

      {/* ── middle: lucky number + prize ── */}
      <div className="relative flex items-end justify-between gap-4 px-5 pb-4 pt-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-muted-2)]">
            {t('lottery.lucky', 'LUCKY')} {t('lottery.number', 'Number')}
          </p>
          <p className="font-mono text-[34px] font-black leading-none tabular-nums" style={{ color: accent }}>
            #{tk.number}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-muted-2)]">
            {won ? t('lottery.totalWon', 'Total Won') : t('lottery.prize', 'Prize')}
          </p>
          <p
            className="text-lg font-extrabold tabular-nums"
            style={{ color: won ? 'var(--color-green-1)' : 'var(--color-foreground-primary)' }}
          >
            {won ? `₹${fmtMoney(tk.prizeWon)}` : lost ? '—' : `₹${fmtMoney(tk.jackpot)}`}
          </p>
        </div>
      </div>

      {/* ── perforation with side notches ── */}
      <div className="relative h-0">
        <span className="absolute -left-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-[var(--color-background-primary)]" aria-hidden />
        <span className="absolute -right-2 top-1/2 size-4 -translate-y-1/2 rounded-full bg-[var(--color-background-primary)]" aria-hidden />
        <div className="mx-4 border-t border-dashed border-white/15" aria-hidden />
      </div>

      {/* ── stub: meta ── */}
      <div className="relative space-y-2 px-5 py-3.5">
        <div className="flex items-center justify-between text-[12px]">
          <span className="flex items-center gap-1.5 text-[var(--color-foreground-muted-1)]">
            <Clock size={13} />
            {pending ? t('lottery.drawAt', 'Draw') : t('lottery.drawn', 'Drawn')} · {fmtDate(tk.drawAt)}
          </span>
          <span className="font-bold tabular-nums text-[var(--color-foreground-primary)]">
            ₹{fmtMoney(tk.price)}
          </span>
        </div>

        {tk.winningNumber && (
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[var(--color-foreground-muted-2)]">
              {t('lottery.winningNumber', 'Winning Number')}
            </span>
            <span className="flex items-center gap-2">
              <span
                className="font-mono font-extrabold tabular-nums"
                style={{ color: won ? 'var(--color-green-1)' : 'var(--color-foreground-primary)' }}
              >
                #{tk.winningNumber}
              </span>
              {typeof tk.matched === 'number' && (
                <span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-foreground-muted-1)]">
                  {tk.matched} {t('lottery.matched', 'Matched')}
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
