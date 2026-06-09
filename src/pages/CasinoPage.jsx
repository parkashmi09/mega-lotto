import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGames } from '@/context/GameContext';
import { useSiteConfig } from '@/context/SiteConfigContext.jsx';
import CategoryCarousel from '@/components/casino/CategoryCarousel';
import SearchBar from '@/components/casino/SearchBar';
import GameGrid from '@/components/casino/GameGrid';
import GameCard from '@/components/casino/GameCard';
import ProviderModal from '@/components/casino/ProviderModal';
import CasinoBannerSlider from '@/components/casino/CasinoBannerSlider';

/* ── Thrill Originals static game list (hardcoded CDN thumbnails) ── */
const THRILL_ORIGINALS = [
  { id: 'thrill-keno', title: 'Keno', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-keno.webp?c=7', href: '/casino/play/thrill-keno' },
  { id: 'thrill-limbo', title: 'Limbo', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-limbo.webp?c=7', href: '/casino/play/thrill-limbo' },
  { id: 'thrill-baccarat', title: 'Baccarat', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-baccarat.webp?c=7', href: '/casino/play/thrill-baccarat' },
  { id: 'thrill-coinflip', title: 'CoinFlip', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-coinflip.webp?c=7', href: '/casino/play/thrill-coinflip' },
  { id: 'thrill-dice', title: 'Dice', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-dice.webp?c=7', href: '/casino/play/thrill-dice' },
  { id: 'thrill-mines', title: 'Mines', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-mines.webp?c=7', href: '/casino/play/thrill-mines' },
  { id: 'thrill-blackjack', title: 'Blackjack', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-blackjack.webp?c=7', href: '/casino/play/thrill-blackjack' },
  { id: 'thrill-crash', title: 'Crash', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-crash.webp?c=7', href: '/casino/play/thrill-crash' },
  { id: 'thrill-plinko', title: 'Plinko', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-plinko.webp?c=7', href: '/casino/play/thrill-plinko' },
  { id: 'thrill-hilo', title: 'HiLo', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-hilo.webp?c=7', href: '/casino/play/thrill-hilo' },
  { id: 'thrill-slide', title: 'Slide', provider: 'Thrill Originals', game_icon: 'https://rushcdn.net/thumbnails_webp/thrill-slide.webp?c=7', href: '/casino/play/thrill-slide' },
];

const lobbyProviders = [
  'spribe', 'pragmaticplay', 'netent', 'playtech', 'bgaming',
  'ezugi', 'live88', 'sagaming', 'playngo', 'hacksawgaming',
  'yggdrasil', 'quickspin'
];

const categoryProviderMap = {
  lobby: lobbyProviders,
  originals: ['spribe', 'turbogames'],
  slots: ['pragmaticplay', 'netent', 'playtech', 'bgaming', 'hacksawgaming', 'playngo', 'quickspin', 'yggdrasil', 'thunderkick'],
  live: ['ezugi', 'live88', 'sagaming', 'onetouch', 'rich88'],
  gameshows: ['ezugi', 'pragmaticplay'],
  tables: ['ezugi', 'sagaming', 'playtech'],
  new: ['bgaming', 'hacksawgaming', 'spribe', 'pragmaticplay'],
  bonus: ['pragmaticplay', 'hacksawgaming', 'netent', 'quickspin'],
  blackjack: ['ezugi', 'playtech', 'sagaming'],
  roulette: ['ezugi', 'playtech', 'sagaming'],
  baccarat: ['ezugi', 'sagaming', 'playtech'],
};

// Label keys for section headings
const sectionLabelKeys = {
  originals: 'casino.originals',
  slots: 'casino.slots',
  live: 'casino.liveCasino',
  gameshows: 'casino.gameShows',
  tables: 'casino.tableGames',
  new: 'casino.newArrivals',
  bonus: 'casino.bonusBuys',
  blackjack: 'casino.blackjack',
  roulette: 'casino.roulette',
  baccarat: 'casino.baccarat',
};

/* ── Scroll arrow button ── */
function ScrollArrow({ direction, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Scroll ${direction}`}
      className={`shrink-0 flex items-center justify-center rounded-full p-[10px] transition-all duration-150
        ${disabled
          ? 'bg-[var(--color-surface-2)] text-[var(--color-foreground-muted-2)] opacity-40 cursor-default'
          : 'bg-[var(--color-surface-2)] text-[var(--color-foreground-muted-1)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-foreground-primary)] cursor-pointer hover:scale-110'
        }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[10px]">
        {direction === 'left' ? (
          <path fillRule="evenodd" d="M19.708 12c0-5.102-.22-8.225-.41-9.978-.08-.718-.488-1.307-1.087-1.596-.6-.29-1.317-.242-1.927.153-1.175.759-3.026 2.063-5.733 4.244-3.147 2.537-4.836 4.418-5.706 5.563a2.63 2.63 0 0 0 0 3.228c.87 1.145 2.559 3.025 5.706 5.562 2.707 2.182 4.559 3.487 5.733 4.246.61.394 1.327.442 1.927.152s1.008-.878 1.086-1.596c.191-1.753.41-4.876.41-9.978" clipRule="evenodd" className="fill-current stroke-transparent" />
        ) : (
          <path fillRule="evenodd" d="M4.292 12c0-5.102.22-8.225.41-9.978.08-.718.488-1.307 1.087-1.596.6-.29 1.317-.242 1.927.153 1.175.759 3.026 2.063 5.732 4.244 3.148 2.537 4.837 4.418 5.707 5.563a2.63 2.63 0 0 1 0 3.228c-.87 1.145-2.56 3.025-5.707 5.562-2.706 2.182-4.558 3.487-5.732 4.246-.61.394-1.327.442-1.927.152s-1.008-.878-1.086-1.596c-.191-1.753-.411-4.876-.411-9.978" clipRule="evenodd" className="fill-current stroke-transparent" />
        )}
      </svg>
    </button>
  );
}

/* ── Section icons ── */
const sectionIcons = {
  originals: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><path fillRule="evenodd" d="M10.097 2.076h3.805l2.3 6.947H7.797zm-1.568 0H5.273c-.816 0-1.567.445-1.959 1.16L.458 8.453a2.2 2.2 0 0 0-.218.57h6.041a3 3 0 0 1 .075-.386zM.413 10.512c.099.201.23.39.391.558l9.187 9.587-3.479-10.145zm13.594 10.147 9.19-9.589c.16-.168.292-.357.39-.559h-6.1zM23.76 9.023h-6.042a3 3 0 0 0-.075-.387l-2.173-6.56h3.257c.816 0 1.567.445 1.96 1.16l2.856 5.216q.15.276.217.57M12 21.923 8.086 10.513h7.827z" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>,
  slots: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><path fillRule="evenodd" d="M5.649 1.976a1 1 0 0 1 1.376-.327C8.87 2.785 10.8 3.282 12.882 3.456c1.908.16 4.475-.098 6.124-1.034a1 1 0 1 1 .988 1.74c-1.667.945-3.866 1.304-5.747 1.336.345 1.252.933 2.502 2.096 3.494a5.75 5.75 0 1 1-1.88.974c-1.238-1.288-1.85-2.792-2.198-4.138-2.848 1.144-4.513 2.872-5.11 5.038a5.75 5.75 0 1 1-2.047-.047c.54-2.525 2.108-4.5 4.485-5.904a13.7 13.7 0 0 1-3.617-1.563 1 1 0 0 1-.327-1.376M5.25 13.5a.75.75 0 0 1 .75-.75 3.75 3.75 0 0 1 3.75 3.75.75.75 0 0 1-1.5 0A2.25 2.25 0 0 0 6 14.25a.75.75 0 0 1-.75-.75M18 10.75a.75.75 0 0 0 0 1.5 2.25 2.25 0 0 1 2.25 2.25.75.75 0 0 0 1.5 0A3.75 3.75 0 0 0 18 10.75" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>,
  live: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><path fillRule="evenodd" d="M10.362 16.46a4.77 4.77 0 0 1-2.732-2.594 4.7 4.7 0 0 1-.363-2.276c.044-.513.17-1.002.363-1.455A4.74 4.74 0 0 1 12 7.25a4.74 4.74 0 0 1 4.37 2.885 4.7 4.7 0 0 1 .363 2.275 4.7 4.7 0 0 1-.363 1.456A4.74 4.74 0 0 1 12 16.75a4.7 4.7 0 0 1-1.639-.29M6.16 14.233a6.27 6.27 0 0 0 2.496 3.049c-1.368.619-2.972 1.247-4.53 1.62-1.897.457-3.504-.955-3.68-2.76A43 43 0 0 1 .25 12c0-1.635.09-3.046.197-4.141.176-1.806 1.783-3.218 3.68-2.762 1.558.374 3.161 1.002 4.529 1.621A6.27 6.27 0 0 0 6.16 9.767l-1.979-.494a.75.75 0 0 0-.364 1.455l1.98.495a6.3 6.3 0 0 0 0 1.555l-1.98.495a.75.75 0 0 0 .364 1.455zm11.678-4.466a6.27 6.27 0 0 0-2.495-3.048c1.368-.62 2.972-1.247 4.529-1.621 1.897-.456 3.504.956 3.68 2.762.107 1.095.197 2.506.197 4.14 0 1.635-.09 3.046-.197 4.141-.176 1.806-1.783 3.218-3.68 2.762-1.558-.374-3.162-1.002-4.53-1.621a6.27 6.27 0 0 0 2.496-3.049l1.98.495a.75.75 0 1 0 .363-1.455l-1.98-.495a6.3 6.3 0 0 0 0-1.555l1.98-.495a.75.75 0 1 0-.364-1.455z" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>,
  gameshows: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><path fillRule="evenodd" d="M9.66 8.398 6.908 1.055q-.242.144-.606.396c-.629.442-1.52 1.15-2.61 2.24s-1.798 1.981-2.24 2.61q-.254.364-.396.606l7.343 2.754c.149-.189.344-.413.597-.666s.477-.448.666-.597m1.381-.59c.25-.033.567-.058.959-.058s.71.025.959.057l2.719-7.25-.249-.046C14.673.38 13.542.25 12 .25S9.327.379 8.57.511l-.247.046zm3.298.59c.189.149.413.344.666.597s.448.477.597.666l7.343-2.754q-.144-.242-.396-.606c-.442-.629-1.15-1.52-2.24-2.61s-1.981-1.798-2.61-2.24q-.364-.254-.606-.396z" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>,
  tables: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><path fillRule="evenodd" d="M7.085 1.96c-1.93.516-3.341.983-4.31 1.34C1.417 3.799.703 5.178.984 6.56c.263 1.302.723 3.343 1.491 6.21.769 2.869 1.391 4.865 1.813 6.124.448 1.338 1.756 2.176 3.18 1.93a41 41 0 0 0 1.875-.373" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>,
  new: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><path fillRule="evenodd" d="M.25 12C.25 5.51 5.51.25 12 .25S23.75 5.51 23.75 12 18.49 23.75 12 23.75.25 18.49.25 12m18.29 3.707c.447 0 .83-.325.9-.768l.926-5.821a.75.75 0 0 0-1.482-.236l-.41 2.585-.389-1.94a.915.915 0 0 0-1.794 0l-.388 1.94-.412-2.585a.75.75 0 0 0-1.481.236l.926 5.82a.912.912 0 0 0 1.795.037l.457-2.286.457 2.286c.085.426.46.732.894.732" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>,
  bonus: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><path fillRule="evenodd" d="M7.75.75a5 5 0 1 0 0 10 5 5 0 0 0 0-10m-3 5A.75.75 0 0 1 5.5 5H7V3.5a.75.75 0 0 1 1.5 0V5H10a.75.75 0 0 1 0 1.5H8.5V8A.75.75 0 0 1 7 8V6.5H5.5a.75.75 0 0 1-.75-.75" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>,
  blackjack: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><path fillRule="evenodd" d="M12 .25a5.75 5.75 0 0 0-5.471 7.524 5.75 5.75 0 1 0 2.732 10.462c-.285 1.347-.536 2.684-.666 3.742-.106.861.512 1.6 1.367 1.678a22.3 22.3 0 0 0 4.076 0c.855-.079 1.473-.817 1.367-1.678-.13-1.058-.38-2.395-.666-3.742A5.75 5.75 0 1 0 17.47 7.775 5.75 5.75 0 0 0 12 .25" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>,
  roulette: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><circle cx="12" cy="12" r="11" className="fill-current stroke-transparent" /></svg>,
  baccarat: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[20px] sm:size-[22px] shrink-0"><path fillRule="evenodd" d="M13.591.785a2.65 2.65 0 0 0-3.191 0 76 76 0 0 1-2.372 1.712l-.021.015C5.77 4.084 3.443 5.72 1.962 7.747l-.005.006C.84 9.381.474 11.4.961 13.278c.877 3.599 5.034 5.386 8.456 4.237" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>,
};

/* ── Thrill Originals static section (hardcoded CDN tiles) ── */
function OriginalsSection({ onGameClick }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const scroll = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth * 0.75 : el.clientWidth * 0.75, behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex h-[34px] items-center gap-[24px] px-[4px]">
        <button
          onClick={() => navigate('/casino/originals')}
          className="group/section flex grow items-center gap-[16px] min-w-0 cursor-pointer"
        >
          <span className="text-[var(--color-foreground-muted-1)]">
            {sectionIcons.originals}
          </span>
          <span className="text-[18px] sm:text-[22px] font-bold text-[var(--color-foreground-primary)] uppercase truncate">
            Thrill Originals
          </span>
          <span className="hidden sm:flex shrink-0 items-center gap-[4px] text-[var(--color-green-1)] opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
            <span className="text-[11px] font-bold uppercase">View more</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[8px]"><path fillRule="evenodd" d="M4.292 12c0-5.102.22-8.225.41-9.978.08-.718.488-1.307 1.087-1.596.6-.29 1.317-.242 1.927.153 1.175.759 3.026 2.063 5.732 4.244 3.148 2.537 4.837 4.418 5.707 5.563a2.63 2.63 0 0 1 0 3.228c-.87 1.145-2.56 3.025-5.707 5.562-2.706 2.182-4.558 3.487-5.732 4.246-.61.394-1.327.442-1.927.152s-1.008-.878-1.086-1.596c-.191-1.753-.411-4.876-.411-9.978" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>
          </span>
        </button>
        <div className="flex items-center gap-[8px]">
          <ScrollArrow direction="left" onClick={() => scroll('left')} disabled={!canScrollLeft} />
          <ScrollArrow direction="right" onClick={() => scroll('right')} disabled={!canScrollRight} />
        </div>
      </div>

      {/* Scrollable tiles */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto gap-[8px] sm:gap-[10px] pt-[20px]"
      >
        {THRILL_ORIGINALS.map((game) => (
          <div
            key={game.id}
            className="aspect-[188/256] snap-start shrink-0"
            className="game-tile-width"
          >
            <GameCard game={game} onClick={(g) => {
              if (g.href) navigate(g.href);
              else onGameClick(g);
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Section component for lobby view (horizontal carousel) ── */
function GameSection({ sectionId, providers, onGameClick, fetchSectionGames }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchSectionGames(providers)
      .then(result => setGames(result))
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, [providers, fetchSectionGames]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [games, updateScrollState]);

  const scroll = useCallback((dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }, []);

  if (!loading && games.length === 0) return null;

  const categoryRoute = sectionId === 'live' ? 'live' : sectionId;

  return (
    <div className="flex flex-col">
      {/* Section Header */}
      <div className="flex h-[34px] items-center gap-[24px] px-[4px]">
        <button
          onClick={() => navigate(`/casino/${categoryRoute}`)}
          className="group/section flex grow items-center gap-[16px] min-w-0 cursor-pointer"
        >
          <span className="text-[var(--color-foreground-muted-1)]">
            {sectionIcons[sectionId] || sectionIcons.slots}
          </span>
          <span className="text-[18px] sm:text-[22px] font-bold text-[var(--color-foreground-primary)] uppercase truncate">
            {t(sectionLabelKeys[sectionId] || sectionId)}
          </span>
          <span className="hidden sm:flex shrink-0 items-center gap-[4px] text-[var(--color-green-1)] opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
            <span className="text-[11px] font-bold uppercase">View more</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[8px]"><path fillRule="evenodd" d="M4.292 12c0-5.102.22-8.225.41-9.978.08-.718.488-1.307 1.087-1.596.6-.29 1.317-.242 1.927.153 1.175.759 3.026 2.063 5.732 4.244 3.148 2.537 4.837 4.418 5.707 5.563a2.63 2.63 0 0 1 0 3.228c-.87 1.145-2.56 3.025-5.707 5.562-2.706 2.182-4.558 3.487-5.732 4.246-.61.394-1.327.442-1.927.152s-1.008-.878-1.086-1.596c-.191-1.753-.411-4.876-.411-9.978" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>
          </span>
        </button>
        <div className="flex items-center gap-[8px]">
          <ScrollArrow direction="left" onClick={() => scroll('left')} disabled={!canScrollLeft} />
          <ScrollArrow direction="right" onClick={() => scroll('right')} disabled={!canScrollRight} />
        </div>
      </div>

      {/* Scrollable Game Tiles */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto gap-[8px] sm:gap-[10px] pt-[20px]"
      >
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[188/256] snap-start shrink-0 animate-pulse rounded-[10%/7%] bg-[var(--color-surface-elevated)]" className="game-tile-width" />
          ))
        ) : (
          <>
            {games.slice(0, 30).map((game, i) => (
              <div
                key={game.id || game.uuid || i}
                className="aspect-[188/256] snap-start shrink-0"
                className="game-tile-width"
              >
                <GameCard game={game} onClick={onGameClick} />
              </div>
            ))}
            {/* View All tile */}
            <div
              className="aspect-[188/256] snap-start shrink-0 cursor-pointer"
              className="game-tile-width"
              onClick={() => navigate(`/casino/${categoryRoute}`)}
            >
              <div className="flex h-full w-full flex-col items-center justify-center gap-[18px] sm:gap-[20px] bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] rounded-[10%/7%] transition-colors cursor-pointer">
                <div className="flex items-center justify-center rounded-full size-[40px] sm:size-[52px] text-[var(--color-foreground-muted-1)] bg-[var(--color-surface-3)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[16px] sm:size-[20px]"><path fillRule="evenodd" d="M3.152.9C3.848.816 4.782.75 6 .75A24 24 0 0 1 8.848.9c1.362.164 2.271 1.251 2.343 2.561.034.621.059 1.45.059 2.539s-.025 1.918-.06 2.539c-.07 1.31-.98 2.396-2.342 2.561-.696.084-1.63.15-2.848.15s-2.152-.066-2.848-.15C1.79 10.935.881 9.85.81 8.54.775 7.918.75 7.089.75 6s.025-1.918.06-2.539C.88 2.151 1.79 1.064 3.151.9m12 12c.696-.084 1.63-.15 2.848-.15s2.152.066 2.848.15c1.362.165 2.271 1.251 2.343 2.561.034.621.059 1.45.059 2.539s-.025 1.918-.06 2.538c-.07 1.31-.98 2.398-2.343 2.562-.695.084-1.629.15-2.847.15s-2.152-.066-2.848-.15c-1.362-.165-2.271-1.251-2.343-2.562-.034-.62-.059-1.448-.059-2.538s.025-1.918.06-2.539c.07-1.31.98-2.396 2.342-2.561M6 12.75c-1.218 0-2.152.066-2.848.15C1.79 13.065.881 14.15.81 15.46.775 16.082.75 16.911.75 18s.025 1.918.06 2.538c.07 1.31.98 2.398 2.342 2.562.696.084 1.63.15 2.848.15s2.152-.066 2.848-.15c1.362-.165 2.271-1.251 2.343-2.562.034-.62.059-1.448.059-2.538s-.025-1.918-.06-2.539c-.07-1.31-.98-2.396-2.342-2.561-.696-.084-1.63-.15-2.848-.15M15.152.9A24 24 0 0 1 18 .75c1.218 0 2.152.066 2.848.15 1.362.164 2.271 1.251 2.343 2.561.034.621.059 1.45.059 2.539s-.025 1.918-.06 2.539c-.07 1.31-.98 2.396-2.343 2.561-.695.084-1.629.15-2.847.15s-2.152-.066-2.848-.15c-1.362-.165-2.271-1.251-2.343-2.561-.034-.621-.059-1.45-.059-2.539s.025-1.918.06-2.539c.07-1.31.98-2.397 2.342-2.561" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>
                </div>
                <div className="flex flex-col items-center gap-[10px] uppercase">
                  <span className="text-[var(--color-foreground-primary)] text-[12px] sm:text-[14px] font-bold">View All</span>
                  <span className="text-[var(--color-foreground-muted-1)] text-[10px] sm:text-[11px] font-semibold">{t(sectionLabelKeys[sectionId] || sectionId)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function CasinoPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOriginalEnabled, isTableEnabled, isCasinoActive, config } = useSiteConfig();

  const {
    searchResults, isLoading, selectedVendors, searchGames,
    vendorDisplayNames, setSelectedVendors, handleGameLaunch,
    loadMoreGames, hasMorePages, fetchSectionGames
  } = useGames();

  const [searchInput, setSearchInput] = useState('');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [activeTab, setActiveTab] = useState(category || 'lobby');
  const searchTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);
  const prevTabRef = useRef(null);

  // Compute allowed categories based on config flags
  const allowedCategories = useMemo(() => {
    const allowed = ['lobby'];

    const hasOriginals = (config?.active_originals || []).length > 0;
    if (hasOriginals) allowed.push('originals');

    if (isOriginalEnabled('slots')) allowed.push('slots');
    if (isOriginalEnabled('live_casino')) allowed.push('live');

    allowed.push('gameshows');

    const hasTables = (config?.active_tables || []).length > 0;
    if (hasTables) allowed.push('tables');

    allowed.push('new');

    const hasCasinoOriginals = (config?.active_casino_originals || []).length > 0;
    if (hasCasinoOriginals) allowed.push('bonus');

    if (isTableEnabled('blackjack')) allowed.push('blackjack');
    if (isTableEnabled('roulette')) allowed.push('roulette');
    if (isTableEnabled('baccarat')) allowed.push('baccarat');

    return allowed;
  }, [config, isOriginalEnabled, isTableEnabled]);

  // Sections to show on lobby (all allowed except 'lobby' itself)
  const lobbySections = useMemo(() =>
    allowedCategories.filter(id => id !== 'lobby'),
    [allowedCategories]
  );

  const isLobby = activeTab === 'lobby';

  const getProvidersForTab = useCallback((tabId) => {
    return categoryProviderMap[tabId] || lobbyProviders;
  }, []);

  // Reset on mount
  useEffect(() => {
    setSelectedVendors([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch games when tab changes (only for non-lobby tabs)
  useEffect(() => {
    if (activeTab === 'lobby') return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const providers = getProvidersForTab(activeTab);
      if (providers.length > 0) searchGames('', providers);
      return;
    }
    if (prevTabRef.current === activeTab) return;
    prevTabRef.current = activeTab;

    const providers = getProvidersForTab(activeTab);
    const providersToUse = selectedVendors.length === 1 ? selectedVendors : providers;
    if (providersToUse.length > 0) searchGames(searchInput, providersToUse);
  }, [activeTab, searchGames, getProvidersForTab, selectedVendors, searchInput]);

  // Sync URL param with activeTab
  useEffect(() => {
    if (category && category !== activeTab) setActiveTab(category);
  }, [category, activeTab]);

  const handleSearchInput = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      const providers = selectedVendors.length === 1 ? selectedVendors : getProvidersForTab(activeTab);
      searchGames(value, providers);
    }, 300);
  }, [selectedVendors, searchGames, activeTab, getProvidersForTab]);

  const handleProvidersChange = useCallback((newProviders) => {
    setSelectedVendors(newProviders);
    searchGames(searchInput, newProviders.length > 0 ? newProviders : getProvidersForTab(activeTab));
  }, [searchInput, setSelectedVendors, searchGames, activeTab, getProvidersForTab]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setSelectedVendors([]);
    if (tabId !== 'lobby') {
      const providers = getProvidersForTab(tabId);
      if (providers.length > 0) searchGames(searchInput, providers);
    }
    isInitialMount.current = false;
    prevTabRef.current = tabId;
    if (tabId !== 'lobby') navigate(`/casino/${tabId}`, { replace: true });
    else navigate('/casino', { replace: true });
  }, [navigate, searchInput, searchGames, getProvidersForTab, setSelectedVendors]);

  useEffect(() => {
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, []);

  const onGameClick = useCallback((game) => handleGameLaunch(game, navigate), [handleGameLaunch, navigate]);

  // If casino is not active in config, show placeholder
  if (!isCasinoActive) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-secondary)]">
        <p className="text-sm">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Banner Slider */}
      <CasinoBannerSlider />

      {/* Category Carousel */}
      <CategoryCarousel activeCategory={activeTab} onCategoryChange={handleTabChange} allowedCategories={allowedCategories} />

      {/* Search + Provider Filter (hidden on lobby) */}
      {!isLobby && (
        <div className="flex items-center gap-2">
          <SearchBar
            value={searchInput}
            onChange={handleSearchInput}
            placeholder={t('casino.searchPlaceholder')}
          />
          {selectedVendors.length === 1 ? (
            <button
              onClick={() => setShowProviderModal(true)}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-3 py-2.5 text-sm font-medium text-white"
            >
              <span className="max-w-[100px] truncate">{vendorDisplayNames[selectedVendors[0]] || selectedVendors[0]}</span>
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVendors([]);
                  searchGames(searchInput, getProvidersForTab(activeTab));
                }}
                className="ml-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </span>
            </button>
          ) : (
            <button
              onClick={() => setShowProviderModal(true)}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--color-surface-elevated)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-hover,var(--color-surface-elevated))]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
              <span>{t('casino.providers')}</span>
            </button>
          )}
        </div>
      )}

      {/* Provider heading when filtered */}
      {!isLobby && selectedVendors.length === 1 && (
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {vendorDisplayNames[selectedVendors[0]] || selectedVendors[0]}
          </h2>
          <button
            onClick={() => {
              setSelectedVendors([]);
              searchGames(searchInput, getProvidersForTab(activeTab));
            }}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Search + Sort/Filter pills (visible on lobby too, collapsed) */}
      {isLobby && (
        <div className="flex items-center gap-[12px] sm:gap-[16px] overflow-x-auto no-scrollbar">
          {/* Search icon button */}
          <button
            onClick={() => { setActiveTab('slots'); navigate('/casino/slots', { replace: true }); }}
            className="shrink-0 flex items-center justify-center size-[40px] rounded-full bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] transition-colors cursor-pointer"
            aria-label="Search Game"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[16px]"><path fillRule="evenodd" d="M.75 11C.75 5.34 5.34.75 11 .75S21.25 5.34 21.25 11c0 2-.572 3.865-1.562 5.442l.303.252.034.027c.817.678 1.628 1.351 2.43 2.094.96.892 1.093 2.279.159 3.245a24 24 0 0 1-.553.553c-.966.936-2.352.803-3.243-.16-.743-.801-1.415-1.613-2.092-2.43l-.028-.034-.252-.304A10.2 10.2 0 0 1 11 21.25C5.34 21.25.75 16.66.75 11m2.5 0a7.75 7.75 0 1 1 15.5 0 7.75 7.75 0 0 1-15.5 0" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>
          </button>

          {/* Sort pill */}
          <button className="shrink-0 flex items-center gap-[8px] px-[16px] py-[12px] rounded-full bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[16px]"><path fillRule="evenodd" d="M1.878 1.605C2.935 1.565 5.608 1.5 12 1.5s9.065.064 10.122.105c.521.02 1.183.295 1.316 1.02.038.204.062.452.062.75s-.024.546-.062.75c-.133.725-.795 1-1.316 1.02-1.057.04-3.73.105-10.122.105s-9.065-.064-10.122-.105C1.357 5.125.695 4.85.562 4.125a4 4 0 0 1-.062-.75c0-.298.024-.546.062-.75.133-.725.795-1 1.316-1.02" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>
            <span className="hidden sm:inline text-[12px] font-extrabold uppercase">Sort</span>
          </button>

          {/* Filter pill */}
          <button
            onClick={() => setShowProviderModal(true)}
            className="shrink-0 flex items-center gap-[8px] px-[16px] py-[12px] rounded-full bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-3)] text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-[16px]"><path fillRule="evenodd" d="M9.5 4.5c0 1.303-.041 2.19-.087 2.774a1.56 1.56 0 0 1-1.531 1.463c-.24.008-.53.013-.882.013s-.643-.005-.882-.013a1.56 1.56 0 0 1-1.53-1.463 28 28 0 0 1-.074-1.524H1.5a1.25 1.25 0 0 1 0-2.5h3.014c.016-.652.044-1.15.073-1.524A1.56 1.56 0 0 1 6.118.263C6.358.255 6.648.25 7 .25s.643.005.882.013a1.56 1.56 0 0 1 1.53 1.463c.047.584.088 1.47.088 2.774" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>
            <span className="hidden sm:inline text-[12px] font-extrabold uppercase">Filter</span>
          </button>
        </div>
      )}

      {/* Lobby: section-wise horizontal carousels */}
      {isLobby && (
        <div className="flex flex-col gap-[40px]">
          {/* Thrill Originals - static hardcoded section */}
          <OriginalsSection onGameClick={onGameClick} />

          {/* Rest of sections from API */}
          {lobbySections.filter(id => id !== 'originals').map(sectionId => (
            <GameSection
              key={sectionId}
              sectionId={sectionId}
              providers={categoryProviderMap[sectionId] || []}
              onGameClick={onGameClick}
              fetchSectionGames={fetchSectionGames}
            />
          ))}
        </div>
      )}

      {/* Non-lobby: single game grid with load more */}
      {!isLobby && (
        <GameGrid
          games={searchResults}
          isLoading={isLoading}
          onGameClick={onGameClick}
          onLoadMore={loadMoreGames}
          hasMore={hasMorePages}
        />
      )}

      {/* Provider Modal */}
      <ProviderModal
        isOpen={showProviderModal}
        onClose={() => setShowProviderModal(false)}
        onProvidersChange={handleProvidersChange}
      />
    </div>
  );
}

export default CasinoPage;
