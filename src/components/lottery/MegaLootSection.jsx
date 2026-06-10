import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useSelector, useDispatch } from 'react-redux';
import { Shuffle, X, Search, IndianRupee, Clock, Ticket } from 'lucide-react';
import { getDrawById, buyTicket, getMyTickets, randomTicketNumber, padTicket, TICKET_MAX, winningNumbersFor } from '../../services/lottery/lotteryService.js';
import { deduct } from '../../store/walletSlice.js';
import { useAuthState } from '../../hooks/useAuthState.js';
import { useKenoSounds } from '../games/keno/useKenoSounds.js';
import { NumberTile, TileGradients } from './NumberTile.jsx';
import NeonTimer from './NeonTimer.jsx';
import SlotReveal from './SlotReveal.jsx';

const PAGE = 48;            // numbers shown per "Load More" on the home board
const QUICK_PICK_COUNT = 6;
const PRIZE_LABELS = ['1st Prize', '2nd Prize', '3rd Prize'];

// Next draw boundary computed FRESH at purchase time — the draw's load-time
// `closesAt` can already be in the past for a fast (e.g. 1-minute) draw, which
// would resolve the ticket the instant it's bought. We also require a small lead
// time so a ticket always has a real "pending" window; buying right on a boundary
// rolls it into the NEXT draw instead of declaring a result immediately.
const MIN_LEAD_MS = 4000;
function computeClosesAt(intervalHours) {
  const ms = (intervalHours || 1 / 60) * 3600 * 1000;
  const now = Date.now();
  let boundary = Math.ceil((now + 1) / ms) * ms;
  if (boundary - now < MIN_LEAD_MS) boundary += ms;
  return new Date(boundary).toISOString();
}

const fmtMoney = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

/**
 * Featured inline quick-buy section — shows whichever draw is selected via the
 * category carousel (defaults to Mega Lotto). Pick numbers & buy without leaving
 * the home page. SEO-friendly markup (section / h2 / descriptive copy + JSON-LD).
 */
export default function MegaLootSection({ lotteryId = 'mega_millions' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuthState();
  const { play: playSound } = useKenoSounds();
  const balance = useSelector((s) => s.wallet.balance);

  const [draw, setDraw] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE);

  // Inline expandable search — collapsed to an icon, expands to full width on click
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Load the featured draw; reset picks when the featured draw changes
  useEffect(() => {
    let alive = true;
    setDraw(null);
    setSelected(new Set());
    setQuery('');
    setVisible(PAGE);
    getDrawById(lotteryId).then((d) => { if (alive) setDraw(d); });
    return () => { alive = false; };
  }, [lotteryId]);

  const NAME = draw?.name || '';

  // Focus the field once it expands
  useEffect(() => {
    if (searchOpen) {
      const id = setTimeout(() => searchInputRef.current?.focus(), 180);
      return () => clearTimeout(id);
    }
  }, [searchOpen]);

  const openSearch = () => setSearchOpen(true);
  const collapseIfEmpty = () => { if (!query.trim()) setSearchOpen(false); };
  const closeSearch = () => { setSearchOpen(false); setQuery(''); setVisible(PAGE); };

  const scrollRef = useRef(null);
  const chipsRef = useRef(null);
  const loadMore = () => {
    const el = scrollRef.current;
    const from = el ? el.scrollTop : 0;
    setVisible((v) => v + PAGE);
    // reveal the freshly-loaded numbers with a gentle smooth scroll
    if (el) setTimeout(() => el.scrollTo({ top: from + el.clientHeight * 0.85, behavior: 'smooth' }), 60);
  };

  // Draw cycle: count down to the period boundary → reveal 1st/2nd/3rd winning
  // numbers as GSAP slot reels (same as the home DrawCard) → restart.
  const intervalMs = (draw?.intervalHours || 1 / 60) * 3_600_000;
  const [tick, setTick] = useState(() => Date.now());
  const [phase, setPhase] = useState('counting'); // 'counting' | 'revealing'
  const [periodEnd, setPeriodEnd] = useState(() => Math.ceil((Date.now() + 1) / ((1 / 60) * 3_600_000)) * ((1 / 60) * 3_600_000));
  const [revealStep, setRevealStep] = useState(0);

  const confettiCanvasRef = useRef(null);
  const fireRef = useRef(null);
  useEffect(() => {
    if (confettiCanvasRef.current && !fireRef.current) {
      fireRef.current = confetti.create(confettiCanvasRef.current, { resize: true });
    }
    return () => { fireRef.current = null; };
  }, []);
  // Whichever timer is currently on-screen (mobile header vs desktop row).
  const timerWrapMobileRef = useRef(null);
  const timerWrapDesktopRef = useRef(null);

  // Firecracker burst (canvas-confetti) — a transparent, full-screen celebratory
  // pop fired right OVER whichever timer is visible. The canvas is a fixed,
  // body-level overlay (no card clipping), so the burst shows on mobile too,
  // where the timer sits at the very top of the card and an in-card canvas would
  // clip the upward particles. Omnidirectional so it reads as a cracker from any
  // position. Origin is mapped from the live timer rect into viewport space.
  // Fired the instant the countdown hits 00:00 and on each 1st/2nd/3rd reveal.
  const crackerBurst = () => {
    const fire = fireRef.current;
    if (!fire) return;
    const colors = [draw?.color || '#34d399', '#22d3c4', '#ffffff', '#f0a020'];

    // Locate the visible timer and convert its centre into viewport 0..1 space
    let ox = 0.5, oy = 0.18;
    const timerEl = [timerWrapDesktopRef.current, timerWrapMobileRef.current]
      .find((el) => el && el.offsetParent !== null && el.getBoundingClientRect().width > 0);
    if (timerEl) {
      const tr = timerEl.getBoundingClientRect();
      ox = (tr.left + tr.width / 2) / window.innerWidth;
      oy = (tr.top + tr.height / 2) / window.innerHeight;
    }

    // omnidirectional firework burst centred on the timer + two upward cracker shots
    fire({ particleCount: 90, spread: 360, startVelocity: 26, scalar: 0.85, ticks: 170, gravity: 0.95, decay: 0.92, origin: { x: ox, y: oy }, colors });
    fire({ particleCount: 40, angle: 60, spread: 65, startVelocity: 40, scalar: 0.8, ticks: 160, gravity: 1.1, origin: { x: ox, y: oy }, colors });
    fire({ particleCount: 40, angle: 120, spread: 65, startVelocity: 40, scalar: 0.8, ticks: 160, gravity: 1.1, origin: { x: ox, y: oy }, colors });
  };

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Align the countdown to the loaded draw's interval
  useEffect(() => {
    setPeriodEnd(Math.ceil((Date.now() + 1) / intervalMs) * intervalMs);
    setPhase('counting');
  }, [intervalMs]);

  // Period ended → clear this round's picks and start the reveal, so each new
  // round begins with a fresh selection automatically.
  useEffect(() => {
    if (phase === 'counting' && tick >= periodEnd) {
      setSelected(new Set());
      setPhase('revealing');
    }
  }, [tick, periodEnd, phase]);

  const winners = useMemo(
    () => winningNumbersFor(draw?.id || 'x', new Date(periodEnd).toISOString(), 3),
    [draw?.id, periodEnd]
  );

  // Reveal sequence: 1st → 2nd → 3rd (confetti each) → restart
  useEffect(() => {
    if (phase !== 'revealing') return;
    setRevealStep(0);
    const timers = [
      // cracker burst the instant the countdown hits 00:00 — over the timer
      setTimeout(crackerBurst, 60),
      setTimeout(crackerBurst, 420),
      setTimeout(crackerBurst, 4000),
      setTimeout(() => setRevealStep(1), 5000),
      setTimeout(crackerBurst, 9000),
      setTimeout(() => setRevealStep(2), 10000),
      setTimeout(crackerBurst, 14000),
      setTimeout(() => {
        setPhase('counting');
        setPeriodEnd(Math.ceil((Date.now() + 1) / intervalMs) * intervalMs);
      }, 15800),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const _diff = Math.max(0, periodEnd - tick);
  const _pad = (x) => String(x).padStart(2, '0');
  const countdown = `${_pad(Math.min(99, Math.floor(_diff / 3_600_000)))}${_pad(Math.floor((_diff % 3_600_000) / 60_000))}${_pad(Math.floor((_diff % 60_000) / 1000))}`;
  const revealing = phase === 'revealing';

  // timer / slot-reveal content, reused at a compact size in the mobile header
  const timerView = (size) =>
    revealing ? (
      <SlotReveal key={revealStep} value={winners[revealStep]} accent="var(--color-green-1)" size={size} />
    ) : (
      <NeonTimer value={countdown} accent="var(--color-green-1)" size={size} />
    );

  const count = selected.size;
  const total = (draw?.price ?? 0) * count;

  // Auto-scroll the chips row to the end as more numbers are added
  useEffect(() => {
    const el = chipsRef.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
  }, [count]);

  const all = useMemo(() => Array.from({ length: TICKET_MAX }, (_, i) => padTicket(i + 1)), []);
  // Numbers the user has already bought for the CURRENT round → disabled in the
  // grid. Recomputed each round (periodEnd) so once a draw passes those numbers
  // free up again and the next round starts with a clean board.
  const owned = useMemo(
    () => {
      const now = Date.now();
      return new Set(
        getMyTickets()
          .filter((tk) => tk.lotteryId === lotteryId && new Date(tk.drawAt).getTime() > now)
          .map((tk) => tk.number)
      );
    },
    [lotteryId, periodEnd]
  );

  // Main board always browses the full list (search no longer filters it).
  const shown = all.slice(0, visible);
  const hasMore = all.length > visible;

  // Search matches shown in a dropdown right below the input.
  const matches = useMemo(() => {
    const q = query.replace(/\D/g, '');
    return q ? all.filter((s) => s.includes(q)).slice(0, 60) : [];
  }, [all, query]);

  // Numbers only — strip non-digits, cap at 4 (ticket numbers are 0001–9999)
  const onSearch = (v) => setQuery(v.replace(/\D/g, '').slice(0, 4));
  const showDropdown = searchOpen && !!query;

  const toggle = (num) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(num) ? next.delete(num) : next.add(num);
      return next;
    });
    playSound('pick');
  };

  const randomPick = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      let guard = 0;
      const target = prev.size + QUICK_PICK_COUNT;
      while (next.size < target && guard < 1000) { next.add(padTicket(randomTicketNumber())); guard++; }
      return next;
    });
    playSound('pick');
  };

  const clear = () => { setSelected(new Set()); playSound('tick'); };

  // Buy Now → validate, then ask for confirmation
  const buyNow = () => {
    if (!isLoggedIn) { toast.error(t('lottery.loginToBuy', 'Please log in to buy tickets')); navigate('/login'); return; }
    if (count < 1 || !draw) return;
    if (total > balance) { toast.error(t('lottery.insufficientBalance', 'Insufficient balance — please deposit')); return; }
    setConfirmOpen(true);
  };

  // Actually purchase after the user confirms
  const confirmBuy = () => {
    setConfirmOpen(false);
    playSound('bet');
    playSound('win');
    dispatch(deduct(total));
    const closesAt = computeClosesAt(draw.intervalHours);
    for (const number of selected) {
      buyTicket({ lotteryId: draw.id, name: NAME, color: draw.color, number, price: draw.price, jackpot: draw.jackpot, closesAt });
    }
    toast.success(`${count} × ${NAME} ${t('lottery.purchaseSuccess', 'ticket(s) purchased')}`);
    navigate('/lottery/my-tickets');
  };

  if (!draw) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${NAME} Lottery`,
    description: `Buy ${NAME} lottery tickets online and play for a ${fmtMoney(draw.jackpot)} jackpot. Pick your 4-digit number (0001–9999) and enter the live draw.`,
    brand: { '@type': 'Brand', name: 'Mega Lotto' },
    offers: { '@type': 'Offer', price: draw.price, priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
  };

  return (
    <section aria-labelledby="megaloot-heading" className="scroll-mt-24">
      {/* Full-screen, transparent confetti overlay (body-level so the cracker
          burst is never clipped by the card — critical for the mobile layout) */}
      {createPortal(
        <canvas ref={confettiCanvasRef} className="pointer-events-none fixed inset-0 z-[9999] h-full w-full" aria-hidden />,
        document.body
      )}

      {/* SEO structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Tile gradient defs — rendered once for the whole section */}
      <TileGradients />

      {/* Heading */}
      <div className="mb-[16px]">
        <h2 id="megaloot-heading" className="text-[22px] font-extrabold uppercase tracking-wide text-[var(--color-foreground-primary)]">
          {NAME} — {t('lottery.buyTicket', 'Buy Ticket')}
        </h2>
      </div>

      <div className="rounded-[28px] bg-[color-mix(in_srgb,var(--color-surface-3)_55%,var(--color-surface-1))] p-2.5 ring-1 ring-white/[0.05] sm:p-3">
      <div className="flex w-full flex-col gap-[12px] lg:flex-row">
        {/* Left — info + actions */}
        <div className="order-2 w-full shrink-0 lg:order-1 lg:w-[340px] lg:min-w-[340px]">
          <div className="relative flex w-full flex-col gap-[16px] overflow-hidden rounded-[24px] bg-[var(--color-surface-1)] p-[20px] sm:rounded-[28px] lg:h-[480px]">
            <div className="flex items-center gap-[10px]">
              <span className="flex size-[34px] items-center justify-center rounded-[10px] text-white" style={{ backgroundColor: draw.color }}>
                <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M19 5.25c1.24 0 2.25 1.01 2.25 2.25v2a.75.75 0 0 1-.53.72 1.75 1.75 0 0 0 0 3.36.75.75 0 0 1 .53.72v2c0 1.24-1.01 2.25-2.25 2.25H5c-1.24 0-2.25-1.01-2.25-2.25v-2a.75.75 0 0 1 .53-.72 1.75 1.75 0 0 0 0-3.36A.75.75 0 0 1 2.75 9.5v-2C2.75 6.26 3.76 5.25 5 5.25z" /></svg>
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-[16px] font-bold text-[var(--color-foreground-primary)]">{NAME}</h3>
                <p className="text-[12px] text-[var(--color-foreground-muted-1)]">{fmtMoney(draw.jackpot)} {t('lottery.jackpot', 'jackpot').toLowerCase()}</p>
              </div>
              {/* Mobile: timer sits in the header to save vertical space */}
              <div ref={timerWrapMobileRef} className="relative z-[1] ml-auto shrink-0 lg:hidden">{timerView(20)}</div>
            </div>

            {/* Countdown → winner reveal (desktop row) */}
            <div className="relative z-[1] hidden min-h-[58px] items-center justify-between gap-2 rounded-[14px] bg-[var(--color-surface-2)] px-[14px] py-[10px] lg:flex">
              {revealing ? (
                <>
                  <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide" style={{ color: 'var(--color-green-1)' }}>
                    {t(`lottery.prize${revealStep + 1}`, PRIZE_LABELS[revealStep])}
                  </span>
                  <span ref={timerWrapDesktopRef} className="relative">
                    <SlotReveal key={revealStep} value={winners[revealStep]} accent="var(--color-green-1)" size={24} />
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-[var(--color-foreground-muted-1)]">
                    <Clock size={14} /> {t('lottery.drawsIn', 'Results in')}
                  </span>
                  <span ref={timerWrapDesktopRef} className="relative">
                    <NeonTimer value={countdown} accent="var(--color-green-1)" />
                  </span>
                </>
              )}
            </div>

            {/* Selected */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold uppercase tracking-wide text-[var(--color-foreground-primary)]">{t('lottery.yourNumbers', 'Your Numbers')}</span>
              <span className="text-[12px] text-[var(--color-foreground-muted-1)]">{count} {t('lottery.selected', 'selected')}</span>
            </div>
            <div className="flex gap-[8px]">
              <button type="button" onClick={randomPick} className="flex flex-1 items-center justify-center gap-[8px] rounded-full bg-[var(--color-surface-2)] py-[10px] text-[13px] font-bold uppercase tracking-wide text-[var(--color-foreground-primary)] transition-colors hover:bg-[var(--color-surface-3)] cursor-pointer">
                <Shuffle size={15} /> {t('lottery.quickPick', 'Random Pick')}
              </button>
              <button type="button" onClick={clear} disabled={count === 0} className="flex items-center justify-center gap-[6px] rounded-full bg-[var(--color-surface-2)] px-[16px] py-[10px] text-[13px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted-1)] transition-colors hover:text-[var(--color-foreground-primary)] cursor-pointer disabled:opacity-40 disabled:cursor-default">
                <X size={15} /> {t('lottery.clear', 'Clear')}
              </button>
            </div>

            {/* Selected number chips — float directly on the card (no box), scroll when many */}
            <div className="lg:min-h-0 lg:flex-1">
              {count > 0 && (
                <div ref={chipsRef} className="no-scrollbar flex max-w-full touch-pan-x items-center gap-[10px] overflow-x-auto overflow-y-hidden scroll-smooth py-[2px] pl-[2px] pr-1">
                  {[...selected].sort().map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => toggle(num)}
                      title={t('lottery.remove', 'Remove')}
                      className="group flex h-fit shrink-0 items-center gap-1.5 rounded-[12px] bg-[var(--color-green-1)]/15 px-[12px] py-[7px] text-[13px] font-bold tabular-nums text-[var(--color-green-1)] ring-1 ring-[var(--color-green-1)]/60 transition-transform hover:scale-105 cursor-pointer"
                    >
                      {num}<X size={12} className="opacity-60 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between rounded-[16px] bg-[var(--color-surface-2)] px-[18px] py-[14px]">
              <span className="text-[13px] font-bold uppercase tracking-wide text-[var(--color-foreground-muted-1)]">{t('lottery.total', 'Total')}</span>
              <span className="flex items-center text-[18px] font-extrabold text-[var(--color-foreground-primary)]"><IndianRupee size={16} strokeWidth={2.5} />{(total).toLocaleString('en-IN')}</span>
            </div>

            <button
              type="button"
              onClick={buyNow}
              disabled={count < 1}
              className={`w-full rounded-full py-[15px] text-[16px] font-bold uppercase tracking-wide transition-all duration-150 ${count >= 1 ? 'cursor-pointer bg-[var(--color-green-1)] text-[var(--color-base-14)] hover:brightness-110 active:scale-[0.98] shadow-[0_0_22px_-6px_var(--color-green-1)]' : 'cursor-not-allowed bg-[var(--color-surface-3)] text-[var(--color-foreground-muted-2)]'}`}
            >
              {t('lottery.buyNow', 'Buy Now')}
            </button>
          </div>
        </div>

        {/* Right — number board (fixed height; only the numbers scroll) */}
        <div className="order-1 flex h-[480px] min-w-0 flex-col rounded-[24px] bg-[var(--color-surface-1)] p-[16px] sm:rounded-[28px] sm:p-[20px] lg:order-2 lg:flex-1">
          {/* Inline expandable search — icon collapses; expands left to full width.
              Typing opens a results dropdown right below the input. */}
          <div className="relative z-10 mb-[12px] flex shrink-0 items-center gap-3">
            <div className={`flex shrink-0 items-center overflow-hidden rounded-full bg-[var(--color-surface-2)] transition-[width] duration-300 ease-out ${searchOpen ? 'w-full' : 'w-[44px]'}`}>
              <button
                type="button"
                onClick={() => (searchOpen ? closeSearch() : openSearch())}
                aria-label={t('lottery.searchNumberAria', 'Search number')}
                className="flex size-[44px] shrink-0 items-center justify-center rounded-full text-[var(--color-foreground-secondary)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-foreground-primary)] cursor-pointer"
              >
                <Search size={20} strokeWidth={2.4} />
              </button>
              <input
                ref={searchInputRef}
                inputMode="numeric"
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                onBlur={() => setTimeout(collapseIfEmpty, 120)}
                tabIndex={searchOpen ? 0 : -1}
                maxLength={4}
                pattern="[0-9]*"
                placeholder={t('lottery.searchNumber', 'Search number… e.g. 0042')}
                className={`min-w-0 bg-transparent text-[15px] font-semibold tabular-nums text-[var(--color-foreground-primary)] outline-none placeholder:text-[var(--color-foreground-muted-2)] ${searchOpen ? 'flex-1 pl-1 pr-2' : 'w-0 flex-none p-0'}`}
              />
              {searchOpen && query && (
                <button type="button" onClick={closeSearch} aria-label={t('lottery.clearSearch', 'Clear search')} className="mr-2 flex size-7 shrink-0 items-center justify-center text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] cursor-pointer">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Board heading — fades out when the search expands */}
            {!searchOpen && (
              <h3 className="min-w-0 flex-1 truncate pr-2 text-center text-[15px] font-bold uppercase tracking-wide text-[var(--color-foreground-primary)] duration-200 animate-in fade-in-0">
                {t('lottery.pickYourNumber', 'Pick Your Lucky Number')}
              </h3>
            )}

            {/* Results dropdown — just below the input */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-[18px] border border-[var(--color-foreground-muted-1)]/10 bg-[var(--color-surface-2)]/65 shadow-2xl backdrop-blur-xl backdrop-saturate-150 duration-150 animate-in fade-in-0 slide-in-from-top-1">
                {matches.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-[var(--color-foreground-muted-2)]">{t('lottery.noMatch', 'No matching number.')}</p>
                ) : (
                  <div className="no-scrollbar max-h-[230px] overflow-y-auto p-2.5">
                    <div className="grid grid-cols-6 gap-[6px] sm:grid-cols-[repeat(auto-fill,minmax(64px,1fr))] sm:gap-[8px]">
                      {matches.map((num) => (
                        <NumberTile key={num} num={num} selected={selected.has(num)} owned={owned.has(num)} onClick={() => toggle(num)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Scrollable numbers — only this area scrolls, layout stays fixed */}
          <div
            ref={scrollRef}
            className={`no-scrollbar -mr-1 min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain scroll-smooth pr-1 transition-[filter,opacity] duration-200 ${showDropdown ? 'pointer-events-none opacity-40 blur-[2px]' : ''}`}
            style={{
              WebkitOverflowScrolling: 'touch',
              maskImage: 'linear-gradient(to bottom, #000 calc(100% - 22px), transparent)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 22px), transparent)',
            }}
          >
            <div className="grid grid-cols-6 gap-[6px] pb-[6px] sm:grid-cols-[repeat(auto-fill,minmax(68px,1fr))] sm:gap-[8px]">
              {shown.map((num) => (
                <NumberTile key={num} num={num} selected={selected.has(num)} owned={owned.has(num)} onClick={() => toggle(num)} />
              ))}
            </div>
          </div>

          {hasMore && (
            <div className="flex shrink-0 justify-center pt-[14px]">
              <button type="button" onClick={loadMore} className="rounded-full bg-[var(--color-surface-2)] px-6 py-[12px] text-[13px] font-bold uppercase tracking-wide text-[var(--color-foreground-primary)] transition-colors hover:bg-[var(--color-surface-3)] cursor-pointer">
                {t('lottery.loadMoreNumbers', 'Load More Numbers')}
              </button>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* ── Purchase confirmation modal ── */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[var(--z-index-drawer-portal,150)] flex items-center justify-center p-4">
          <div onClick={() => setConfirmOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm duration-150 animate-in fade-in-0" />
          <div role="dialog" aria-modal="true" aria-label={t('lottery.confirmPurchaseAria', 'Confirm purchase')} className="relative w-[min(400px,calc(100vw-24px))] rounded-[24px] border border-[var(--color-foreground-muted-1)]/10 bg-[var(--color-surface-1)] p-5 shadow-2xl duration-150 animate-in fade-in-0 zoom-in-95">
            <div className="mb-3 flex items-center gap-[10px]">
              <span className="flex size-[34px] items-center justify-center rounded-[10px] text-white" style={{ backgroundColor: draw.color }}>
                <Ticket size={18} />
              </span>
              <div>
                <h3 className="text-[16px] font-extrabold text-[var(--color-foreground-primary)]">{t('lottery.confirmPurchase', 'Confirm Purchase')}</h3>
                <p className="text-[12px] text-[var(--color-foreground-muted-1)]">{NAME} · {count} {t('lottery.ticket', 'ticket')}{count > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="no-scrollbar mb-3 flex max-h-[120px] flex-wrap gap-[6px] overflow-y-auto rounded-[14px] bg-[var(--color-surface-2)]/40 p-[12px]">
              {[...selected].sort().map((num) => (
                <span key={num} className="rounded-[10px] bg-[var(--color-green-1)]/15 px-[9px] py-[5px] text-[13px] font-bold tabular-nums text-[var(--color-green-1)] ring-1 ring-[var(--color-green-1)]/60">{num}</span>
              ))}
            </div>

            <div className="mb-4 space-y-2 rounded-[14px] bg-[var(--color-surface-2)] px-[16px] py-[12px] text-[13px]">
              <div className="flex justify-between text-[var(--color-foreground-muted-1)]"><span>{t('lottery.pricePerTicket', 'Price / ticket')}</span><span className="font-bold text-[var(--color-foreground-primary)]">{fmtMoney(draw.price)}</span></div>
              <div className="flex justify-between text-[var(--color-foreground-muted-1)]"><span>{t('lottery.tickets', 'Tickets')}</span><span className="font-bold text-[var(--color-foreground-primary)]">{count}</span></div>
              <div className="flex justify-between border-t border-[var(--color-foreground-muted-1)]/10 pt-2 text-[15px]"><span className="font-bold uppercase tracking-wide text-[var(--color-foreground-primary)]">{t('lottery.total', 'Total')}</span><span className="font-extrabold text-[var(--color-green-1)]">{fmtMoney(total)}</span></div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmOpen(false)} className="flex-1 rounded-full bg-[var(--color-surface-2)] py-[12px] text-[14px] font-bold uppercase tracking-wide text-[var(--color-foreground-primary)] transition-colors hover:bg-[var(--color-surface-3)] cursor-pointer">
                {t('common.cancel', 'Cancel')}
              </button>
              <button type="button" onClick={confirmBuy} className="flex-1 rounded-full bg-[var(--color-green-1)] py-[12px] text-[14px] font-bold uppercase tracking-wide text-[var(--color-base-14)] transition hover:brightness-110 active:scale-[0.98] cursor-pointer">
                {t('lottery.confirmBuy', 'Confirm & Buy')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
