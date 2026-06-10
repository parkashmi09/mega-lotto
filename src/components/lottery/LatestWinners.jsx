import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, IndianRupee } from 'lucide-react';

const fmtMoney = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

const NAMES = [
  'RaviKumar', 'Priya_99', 'LuckyStar', 'Tdjtigcsumuac', 'AvichayFun', 'Sk_Gamer',
  'NehaWins', 'MrJackpot', 'AdityaR', 'GoldenTkt', 'Yurrrrr', 'Megastar',
];
const POSITION = [
  { key: 'lottery.prize1', fallback: '1st Prize' },
  { key: 'lottery.prize2', fallback: '2nd Prize' },
  { key: 'lottery.prize3', fallback: '3rd Prize' },
];
const PRIZE = [5_000_000, 1_000_000, 100_000];
const AVATAR_COLORS = ['#e23b3b', '#f0a020', '#5b8def', '#27c498', '#9b6bdf', '#22d3c4'];

// deterministic pseudo-random from a seed string
function seeded(seed) {
  let x = 0;
  for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) % 1_000_000_007;
  return () => {
    x = (x * 1103515245 + 12345) & 0x7fffffff;
    return x / 0x7fffffff;
  };
}

function Ball({ digit, win }) {
  const c = win ? 'var(--color-green-1)' : '#cdd6e3';
  return (
    <span
      className="flex size-[26px] shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold"
      style={{
        background: `radial-gradient(circle at 34% 28%, color-mix(in srgb, ${c} 40%, #fff), ${c} 62%, color-mix(in srgb, ${c} 50%, #000))`,
        color: win ? '#06281d' : '#1a1140',
        boxShadow: win ? `0 0 10px color-mix(in srgb, ${c} 60%, transparent)` : '0 1px 3px rgba(0,0,0,0.4)',
      }}
    >
      {digit}
    </span>
  );
}

export default function LatestWinners() {
  const { t } = useTranslation();
  const { winners, ticketsSold } = useMemo(() => {
    const rnd = seeded('megalotto-winners-v1');
    const list = NAMES.map((name, i) => {
      const num = String(Math.floor(rnd() * 9999) + 1).padStart(4, '0');
      const pos = i % 3;
      const mins = Math.floor(rnd() * 58) + 1;
      return { name, num, pos, prize: PRIZE[pos], color: AVATAR_COLORS[i % AVATAR_COLORS.length], mins };
    });
    return { winners: list.slice(0, 8), ticketsSold: 412 };
  }, []);

  return (
    <section className="space-y-3">
      {/* Standalone section heading — no surrounding card box */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[18px] font-extrabold uppercase tracking-wide text-[var(--color-foreground-primary)]">
          <Trophy size={18} className="text-[var(--color-green-1)]" /> {t('lottery.lastResult', 'Last Result')}
        </h2>
        <span className="text-[12px] text-[var(--color-foreground-muted-1)]">
          {t('lottery.ticketsSoldThisRound', 'Tickets sold this round')} <b className="text-[var(--color-foreground-primary)]">{ticketsSold}</b>
        </span>
      </div>

      {/* Column header (desktop) */}
      <div className="hidden grid-cols-[1.7fr_1.7fr_1fr_1fr] gap-3 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-foreground-muted-2)] sm:grid">
        <span>{t('lottery.winner', 'Winner')}</span>
        <span>{t('lottery.number', 'Number')}</span>
        <span>{t('lottery.position', 'Position')}</span>
        <span>{t('lottery.prize', 'Prize')}</span>
      </div>

      {/* Rows — hover + zebra */}
      <div className="flex flex-col gap-1">
        {winners.map((w, i) => (
          <div
            key={i}
            className={`grid grid-cols-2 items-center gap-x-3 gap-y-3 rounded-[14px] px-3 py-3 transition-colors hover:bg-[var(--color-surface-2)]/60 sm:grid-cols-[1.7fr_1.7fr_1fr_1fr] ${
              i % 2 === 1 ? 'bg-[var(--color-surface-2)]/35' : 'bg-transparent'
            }`}
          >
            {/* Winner + time */}
            <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-extrabold text-white"
                style={{ background: `linear-gradient(140deg, ${w.color}, color-mix(in srgb, ${w.color} 55%, #000))` }}
              >
                {w.name[0]}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold text-[var(--color-foreground-primary)]">{w.name}</p>
                <p className="text-[11px] text-[var(--color-foreground-muted-2)]">{t('lottery.minAgo', '{{count}} min ago', { count: w.mins })}</p>
              </div>
            </div>

            {/* Number */}
            <div className="col-span-2 sm:col-span-1">
              <p className="mb-1 text-[11px] font-semibold text-[var(--color-foreground-muted-2)] sm:hidden">{t('lottery.number', 'Number')}</p>
              <div
                className="relative inline-flex items-center gap-1.5 py-2 pl-5 pr-4"
                style={{
                  background:
                    'radial-gradient(ellipse 58% 135% at 97% 50%, color-mix(in srgb, var(--color-green-1) 50%, transparent) 0%, color-mix(in srgb, var(--color-green-1) 16%, transparent) 36%, transparent 64%), #151c2a',
                  WebkitMaskImage:
                    'conic-gradient(from -45deg at left, #0000 25%, #000 0), conic-gradient(from 135deg at right, #0000 25%, #000 0)',
                  WebkitMaskSize: '51% 9px, 51% 9px',
                  WebkitMaskPosition: 'left, right',
                  WebkitMaskRepeat: 'repeat-y',
                  maskImage:
                    'conic-gradient(from -45deg at left, #0000 25%, #000 0), conic-gradient(from 135deg at right, #0000 25%, #000 0)',
                  maskSize: '51% 9px, 51% 9px',
                  maskPosition: 'left, right',
                  maskRepeat: 'repeat-y',
                }}
              >
                {w.num.split('').map((d, j) => (
                  <Ball key={j} digit={d} win={j === w.num.length - 1} />
                ))}
              </div>
            </div>

            {/* Position */}
            <div>
              <p className="mb-1 text-[11px] font-semibold text-[var(--color-foreground-muted-2)] sm:hidden">{t('lottery.position', 'Position')}</p>
              <span className="inline-block rounded-full bg-[var(--color-surface-2)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-foreground-primary)]">{t(POSITION[w.pos].key, POSITION[w.pos].fallback)}</span>
            </div>

            {/* Prize */}
            <div className="text-right sm:text-left">
              <p className="mb-1 text-[11px] font-semibold text-[var(--color-foreground-muted-2)] sm:hidden">{t('lottery.prize', 'Prize')}</p>
              <p className="flex items-center justify-end gap-0.5 text-[14px] font-extrabold text-[var(--color-green-1)] sm:justify-start">
                <IndianRupee size={13} strokeWidth={2.6} />{new Intl.NumberFormat('en-IN').format(w.prize)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
