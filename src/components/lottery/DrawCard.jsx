import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { Ticket, Clock, Trophy } from 'lucide-react';
import NeonTimer from './NeonTimer.jsx';
import SlotReveal from './SlotReveal.jsx';
import { useAuthState } from '../../hooks/useAuthState.js';
import { winningNumbersFor } from '../../services/lottery/lotteryService.js';

const fmtMoney = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

/* Subtle background FX — twinkling sparkles + 2-3 slow drifting numbered balls */
const FLOAT_BALLS = [
  { n: 7, left: '8%',  bottom: '14%', size: 30, dx: '100px', dy: '-110px', dur: '11s', delay: '0s' },
  { n: 3, left: '30%', bottom: '40%', size: 22, dx: '90px',  dy: '-80px',  dur: '13s', delay: '4s' },
  { n: 5, left: '16%', bottom: '60%', size: 26, dx: '120px', dy: '-90px',  dur: '12s', delay: '7.5s' },
];
const SPARKLES = [
  { left: '26%', top: '20%', size: 5, dur: '2.6s', delay: '0s' },
  { left: '42%', top: '56%', size: 4, dur: '3.3s', delay: '0.9s' },
  { left: '14%', top: '70%', size: 6, dur: '2.9s', delay: '1.5s' },
  { left: '48%', top: '28%', size: 4, dur: '3.6s', delay: '2.2s' },
  { left: '32%', top: '82%', size: 5, dur: '2.4s', delay: '1.1s' },
  { left: '20%', top: '44%', size: 3, dur: '3.0s', delay: '2.8s' },
];

function BgFx({ accent }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {SPARKLES.map((s, i) => (
        <span
          key={`s${i}`}
          className="drawsparkle"
          style={{
            left: s.left, top: s.top, width: s.size, height: s.size,
            background: '#ffffff',
            boxShadow: `0 0 6px #ffffff, 0 0 12px ${accent}`,
            '--dur': s.dur, '--delay': s.delay,
          }}
        />
      ))}
      {FLOAT_BALLS.map((b, i) => {
        const c = i % 2 ? '#22d3c4' : accent;
        return (
          <span
            key={`b${i}`}
            className="drawball flex items-center justify-center max-sm:hidden"
            style={{
              left: b.left, bottom: b.bottom, width: b.size, height: b.size,
              background: `radial-gradient(circle at 34% 28%, ${`color-mix(in srgb, ${c} 35%, #fff)`}, ${c} 58%, color-mix(in srgb, ${c} 45%, #000))`,
              boxShadow: `0 0 14px color-mix(in srgb, ${c} 55%, transparent)`,
              '--dx': b.dx, '--dy': b.dy, '--dur': b.dur, '--delay': b.delay,
            }}
          >
            <span
              className="flex items-center justify-center rounded-full bg-white/90 font-extrabold text-[#1a1140]"
              style={{ width: b.size * 0.6, height: b.size * 0.6, fontSize: b.size * 0.4 }}
            >
              {b.n}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function useCountdown(target, intervalHours) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  // With intervalHours the timer rolls to the next draw boundary automatically
  // (e.g. Mega Lotto resets every minute) instead of getting stuck on "ended".
  let end;
  if (intervalHours) {
    const ms = intervalHours * 3600 * 1000;
    end = Math.ceil((now + 1) / ms) * ms;
  } else {
    end = new Date(target).getTime();
  }
  const diff = Math.max(0, end - now);
  const h = Math.min(99, Math.floor(diff / 3_600_000));
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const pad = (x) => String(x).padStart(2, '0');
  return { value: `${pad(h)}${pad(m)}${pad(s)}`, ended: diff === 0 };
}

const PRIZE_LABELS = ['1st Prize', '2nd Prize', '3rd Prize'];

export function DrawCard({ draw }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthState();

  // Draw cycle: count down to the period boundary → reveal winners → restart.
  const intervalMs = (draw.intervalHours || 1 / 60) * 3_600_000;
  const [now, setNow] = useState(() => Date.now());
  const [phase, setPhase] = useState('counting'); // 'counting' | 'revealing'
  const [periodEnd, setPeriodEnd] = useState(() => Math.ceil((Date.now() + 1) / intervalMs) * intervalMs);
  const [revealStep, setRevealStep] = useState(0);

  // Confetti bound to a canvas INSIDE this card (not full-screen)
  const confettiCanvasRef = useRef(null);
  const fireRef = useRef(null);
  useEffect(() => {
    if (confettiCanvasRef.current && !fireRef.current) {
      fireRef.current = confetti.create(confettiCanvasRef.current, { resize: true, disableForReducedMotion: true });
    }
    return () => { fireRef.current = null; };
  }, []);
  const popConfetti = () => {
    const fire = fireRef.current;
    if (!fire) return;
    const colors = [draw.color, '#22d3c4', '#ffffff'];
    fire({ particleCount: 55, spread: 78, startVelocity: 26, scalar: 0.7, ticks: 110, gravity: 1.1, origin: { x: 0.5, y: 0.55 }, colors });
  };

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Period ended → start the winner reveal
  useEffect(() => {
    if (phase === 'counting' && now >= periodEnd) setPhase('revealing');
  }, [now, periodEnd, phase]);

  const winners = useMemo(
    () => winningNumbersFor(draw.id, new Date(periodEnd).toISOString(), 3),
    [draw.id, periodEnd]
  );

  // Reveal sequence: 1st → 2nd → 3rd → confetti → restart timer
  useEffect(() => {
    if (phase !== 'revealing') return;
    setRevealStep(0);
    // 1st prize announced → confetti, then 2nd → confetti, then 3rd → confetti, then restart
    const timers = [
      setTimeout(popConfetti, 4000),                 // 1st prize settled → confetti
      setTimeout(() => { setRevealStep(1); }, 5000),
      setTimeout(popConfetti, 9000),                 // 2nd prize
      setTimeout(() => { setRevealStep(2); }, 10000),
      setTimeout(popConfetti, 14000),                // 3rd prize
      setTimeout(() => {
        setPhase('counting');
        setPeriodEnd(Math.ceil((Date.now() + 1) / intervalMs) * intervalMs);
      }, 15800),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const diff = Math.max(0, periodEnd - now);
  const pad = (x) => String(x).padStart(2, '0');
  const value = `${pad(Math.min(99, Math.floor(diff / 3_600_000)))}${pad(Math.floor((diff % 3_600_000) / 60_000))}${pad(Math.floor((diff % 60_000) / 1000))}`;
  const revealing = phase === 'revealing';

  const goBuy = () => navigate(isLoggedIn ? `/lottery/play/${draw.id}` : '/login');
  const entryPill = (
    <span
      className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1"
      style={{ backgroundColor: `color-mix(in srgb, ${draw.color} 18%, transparent)`, color: draw.color, '--tw-ring-color': `color-mix(in srgb, ${draw.color} 45%, transparent)` }}
    >
      {revealing ? t('lottery.drawing', 'Drawing…') : t('lottery.entryOpen', 'Entry Open')}
    </span>
  );

  return (
    <article
      className="group relative block overflow-hidden rounded-[22px] transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: `radial-gradient(135% 100% at 92% -10%, color-mix(in srgb, ${draw.color} 26%, transparent) 0%, transparent 58%), linear-gradient(155deg, color-mix(in srgb, ${draw.color} 12%, #0c1024) 0%, #080b16 100%)`,
        // Ticket silhouette — concave notch cut from the left & right edges
        WebkitMaskImage:
          'radial-gradient(circle 13px at 0 50%, transparent 12px, #000 12.5px), radial-gradient(circle 13px at 100% 50%, transparent 12px, #000 12.5px)',
        WebkitMaskComposite: 'source-in',
        maskImage:
          'radial-gradient(circle 13px at 0 50%, transparent 12px, #000 12.5px), radial-gradient(circle 13px at 100% 50%, transparent 12px, #000 12.5px)',
        maskComposite: 'intersect',
        filter: `drop-shadow(0 0 1px color-mix(in srgb, ${draw.color} 55%, transparent)) drop-shadow(0 10px 26px color-mix(in srgb, ${draw.color} 30%, transparent))`,
      }}
    >
      <BgFx accent={draw.color} />
      <canvas ref={confettiCanvasRef} className="pointer-events-none absolute inset-0 z-[6] h-full w-full" aria-hidden />

      {/* ═════════════ MOBILE: compact, space-efficient layout ═════════════ */}
      <div className="relative z-[1] flex flex-col gap-2.5 p-4 sm:hidden">
        {/* header: icon + name + entry pill */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] text-white" style={{ backgroundColor: draw.color }}>
              <Ticket size={16} />
            </span>
            <h3 className="truncate text-[17px] font-extrabold text-[var(--color-foreground-primary)]">{draw.name}</h3>
          </div>
          {entryPill}
        </div>

        {/* jackpot + price on one row */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--color-foreground-muted-2)]">{t('lottery.jackpot')}</p>
            <p className="truncate text-[22px] font-extrabold leading-tight text-[var(--color-foreground-primary)]">{fmtMoney(draw.jackpot)}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--color-foreground-muted-2)]">{t('lottery.ticketPrice', 'Ticket Price')}</p>
            <p className="text-[15px] font-extrabold leading-tight" style={{ color: draw.color }}>{fmtMoney(draw.price)}</p>
          </div>
        </div>

        <div className="h-0 border-t border-dashed border-white/12" />

        {/* timer/reveal + buy on one row */}
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {revealing ? (
              <>
                <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.14em]" style={{ color: draw.color }}>
                  <Trophy size={11} /> {t(`lottery.prize${revealStep}`, PRIZE_LABELS[revealStep])}
                </p>
                <div className="mt-1"><SlotReveal key={revealStep} value={winners[revealStep]} accent={draw.color} size={22} /></div>
              </>
            ) : (
              <>
                <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--color-foreground-muted-2)]">
                  <Clock size={11} /> {t('lottery.drawsIn')}
                </p>
                <div className="mt-1"><NeonTimer value={value} accent={draw.color} size={24} /></div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={goBuy}
            style={{ backgroundColor: draw.color, color: '#fff', boxShadow: `0 0 20px -7px ${draw.color}` }}
            className="shrink-0 rounded-full px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide transition hover:brightness-110 active:scale-[0.98] cursor-pointer"
          >
            {t('lottery.buyTicket')}
          </button>
        </div>
      </div>

      {/* ═════════════ DESKTOP (sm+): original ticket layout ═════════════ */}
      <div className="relative z-[1] hidden sm:flex sm:flex-row">
        {/* Left: name + jackpot (balls float in the bg) */}
        <div className="flex flex-1 items-center sm:p-6 lg:p-7">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[11px] text-white" style={{ backgroundColor: draw.color }}>
                <Ticket size={19} />
              </span>
              <h3 className="truncate text-[23px] font-extrabold text-[var(--color-foreground-primary)]">{draw.name}</h3>
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-foreground-muted-2)]">{t('lottery.jackpot')}</p>
            <p className="text-[34px] font-extrabold leading-[1.05] text-[var(--color-foreground-primary)]">{fmtMoney(draw.jackpot)}</p>
            <p className="mt-2.5 text-[11px] font-medium text-[var(--color-foreground-muted-1)]">{t('lottery.matchToWin', 'Match the winning number to win the jackpot')}</p>
          </div>
        </div>

        {/* Vertical perforation */}
        <div className="my-4 w-0 border-l-2 border-dashed border-white/12" />

        {/* Right stub: entry + timer + price + buy */}
        <div className="flex flex-col justify-center gap-2.5 sm:w-[228px] sm:shrink-0 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            {entryPill}
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--color-foreground-muted-2)]">{t('lottery.ticketPrice', 'Ticket Price')}</p>
              <p className="text-[16px] font-extrabold leading-tight" style={{ color: draw.color }}>{fmtMoney(draw.price)}</p>
            </div>
          </div>

          {revealing ? (
            <div className="min-h-[58px]">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: draw.color }}>
                <Trophy size={12} /> {t(`lottery.prize${revealStep}`, PRIZE_LABELS[revealStep])}
              </p>
              <div className="mt-1.5">
                <SlotReveal key={revealStep} value={winners[revealStep]} accent={draw.color} size={26} />
              </div>
            </div>
          ) : (
            <div className="min-h-[58px]">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-foreground-muted-2)]">
                <Clock size={12} /> {t('lottery.drawsIn')}
              </p>
              <div className="mt-1.5">
                <NeonTimer value={value} accent={draw.color} />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={goBuy}
            style={{ backgroundColor: draw.color, color: '#fff', boxShadow: `0 0 20px -7px ${draw.color}` }}
            className="mt-0.5 w-full rounded-full py-2.5 text-sm font-bold uppercase tracking-wide transition hover:brightness-110 active:scale-[0.98] cursor-pointer"
          >
            {t('lottery.buyTicket')}
          </button>
        </div>
      </div>
    </article>
  );
}

export default DrawCard;
