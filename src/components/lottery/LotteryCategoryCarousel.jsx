import { useRef, useState, useEffect } from 'react';
import { CalendarDays, CalendarRange } from 'lucide-react';

/** Mega Lottery ticket icon (fill-based, inherits currentColor). */
function MegaIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path
        fillRule="evenodd"
        d="M10.362 16.46a4.77 4.77 0 0 1-2.732-2.594 4.7 4.7 0 0 1-.363-2.276c.044-.513.17-1.002.363-1.455A4.74 4.74 0 0 1 12 7.25a4.74 4.74 0 0 1 4.37 2.885 4.7 4.7 0 0 1 .363 2.275 4.7 4.7 0 0 1-.363 1.456A4.74 4.74 0 0 1 12 16.75a4.7 4.7 0 0 1-1.639-.29M6.16 14.233a6.27 6.27 0 0 0 2.496 3.049c-1.368.619-2.972 1.247-4.53 1.62-1.897.457-3.504-.955-3.68-2.76A43 43 0 0 1 .25 12c0-1.635.09-3.046.197-4.141.176-1.806 1.783-3.218 3.68-2.762 1.558.374 3.161 1.002 4.529 1.621A6.27 6.27 0 0 0 6.16 9.767l-1.979-.494a.75.75 0 0 0-.364 1.455l1.98.495a6.3 6.3 0 0 0 0 1.555l-1.98.495a.75.75 0 0 0 .364 1.455zm11.678-4.466a6.27 6.27 0 0 0-2.495-3.048c1.368-.62 2.972-1.247 4.529-1.621 1.897-.456 3.504.956 3.68 2.762.107 1.095.197 2.506.197 4.14 0 1.635-.09 3.046-.197 4.141-.176 1.806-1.783 3.218-3.68 2.762-1.558-.374-3.162-1.002-4.53-1.621a6.27 6.27 0 0 0 2.496-3.049l1.98.495a.75.75 0 1 0 .363-1.455l-1.98-.495a6.3 6.3 0 0 0 0-1.555l1.98-.495a.75.75 0 1 0-.364-1.455z"
        clipRule="evenodd"
        className="fill-current stroke-transparent"
      />
    </svg>
  );
}

/** Instant lightning-ticket icon (fill-based, inherits currentColor). */
function InstantIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path
        fillRule="evenodd"
        d="M3.535 3.448c1.523-.099 3.887-.198 7.215-.198s5.692.1 7.215.198c1.63.105 2.935 1.327 3.077 2.98q.044.505.083 1.136l.259.026c.955.097 1.89.721 2.116 1.801.133.637.25 1.511.25 2.617 0 1.103-.116 1.975-.25 2.611-.225 1.085-1.165 1.71-2.124 1.804l-.251.024q-.04.623-.083 1.125c-.142 1.653-1.447 2.876-3.077 2.98-1.523.099-3.887.198-7.215.198s-5.692-.1-7.215-.198C1.905 20.449.6 19.225.458 17.572.349 16.312.25 14.48.25 12s.1-4.311.208-5.572C.6 4.775 1.905 3.553 3.535 3.448m6.353 4.577a1.25 1.25 0 0 1 2.006.731l.357 1.783 2.445-.287c.998-.118 1.526 1.146.741 1.774l-4.171 3.337a1.25 1.25 0 0 1-2.007-.731l-.356-1.784-2.445.288c-.998.117-1.527-1.146-.742-1.774z"
        clipRule="evenodd"
        className="fill-current stroke-transparent"
      />
    </svg>
  );
}

/** Daily lottery-ball icon (fill-based, inherits currentColor). */
function DailyIcon({ size = 22 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={size} height={size}>
      <path
        fillRule="evenodd"
        d="M.25 12C.25 5.51 5.51.25 12 .25S23.75 5.51 23.75 12 18.49 23.75 12 23.75.25 18.49.25 12m18.29 3.707c.447 0 .83-.325.9-.768l.926-5.821a.75.75 0 0 0-1.482-.236l-.41 2.585-.389-1.94a.915.915 0 0 0-1.794 0l-.388 1.94-.412-2.585a.75.75 0 0 0-1.481.236l.926 5.82a.912.912 0 0 0 1.795.037l.457-2.286.457 2.286c.085.426.46.732.894.732M5.557 8.734a.75.75 0 0 0-1.433.31v5.958a.75.75 0 0 0 1.5 0v-2.495L6.9 15.31a.75.75 0 0 0 1.433-.31V9.043a.75.75 0 0 0-1.5 0v2.495zm3.994-.22a.75.75 0 0 1 .53-.22h2.708a.75.75 0 0 1 0 1.5h-1.958v1.208h1.416a.75.75 0 0 1 0 1.5h-1.416v1.75h1.958a.75.75 0 0 1 0 1.5h-2.708a.75.75 0 0 1-.75-.75V9.043a.75.75 0 0 1 .22-.53"
        clipRule="evenodd"
        className="fill-current stroke-transparent"
      />
    </svg>
  );
}

/** Lottery categories (pills). `id` matches the `categories` tags on each draw. */
export const LOTTERY_CATEGORIES = [
  { id: 'mega', label: 'Mega Lotto', Icon: MegaIcon },
  { id: 'instant', label: 'Instant', Icon: InstantIcon },
  { id: 'daily', label: 'Daily', Icon: DailyIcon },
  { id: 'weekly', label: 'Weekly', Icon: CalendarDays },
  { id: 'monthly', label: 'Monthly', Icon: CalendarRange },
];

export default function LotteryCategoryCarousel({ activeCategory, onCategoryChange }) {
  const scrollRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setShowArrow(el.scrollWidth > el.clientWidth && el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    check();
    el.addEventListener('scroll', check);
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);

  const scrollRight = () => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  return (
    <div className="relative grid">
      <div
        ref={scrollRef}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden gap-2 py-2 effect-fade-r"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {LOTTERY_CATEGORIES.map(({ id, label, Icon }) => {
          const isActive = activeCategory === id;
          return (
            <button
              key={id}
              onClick={() => onCategoryChange(id)}
              className={`group rounded-20 size-[90px] min-w-[90px] sm:size-[98px] sm:min-w-[98px] px-3 sm:px-4 flex flex-col items-center justify-center gap-2.5 text-center text-[11px] font-bold uppercase cursor-pointer transition-[background-color,translate] duration-150 hover:-translate-y-2 ${
                isActive
                  ? 'bg-surface-selected-secondary'
                  : 'bg-[var(--color-control-primary)] hover:bg-[var(--color-control-primary-active)]'
              }`}
            >
              <span className={`transition-colors duration-150 ${
                isActive
                  ? 'text-foreground-selected-secondary effect-glow'
                  : 'text-[var(--color-control-primary-foreground)] group-hover:text-[var(--color-control-secondary-foreground-active)]'
              }`}>
                <Icon size={22} strokeWidth={2} />
              </span>
              <span className={`transition-colors duration-150 whitespace-nowrap ${
                isActive
                  ? 'text-foreground-selected-secondary effect-glow'
                  : 'text-foreground-muted-1 group-hover:text-[var(--color-control-secondary-foreground-active)]'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      {showArrow && (
        <div className="absolute top-1/2 -right-[26px] -translate-y-1/2 hidden sm:block">
          <button
            onClick={scrollRight}
            className="rounded-64 shrink-0 bg-[var(--color-control-primary)] text-[var(--color-control-primary-foreground)] hover:bg-[var(--color-control-primary-active)] hover:text-[var(--color-control-primary-foreground-active)] cursor-pointer flex items-center justify-center transition-transform duration-150 hover:scale-110 p-3"
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="size-2.5"><path fillRule="evenodd" d="M4.292 12c0-5.102.22-8.225.41-9.978.08-.718.488-1.307 1.087-1.596.6-.29 1.317-.242 1.927.153 1.175.759 3.026 2.063 5.732 4.244 3.148 2.537 4.837 4.418 5.707 5.563a2.63 2.63 0 0 1 0 3.228c-.87 1.145-2.56 3.025-5.707 5.562-2.706 2.182-4.558 3.487-5.732 4.246-.61.394-1.327.442-1.927.152s-1.008-.878-1.086-1.596c-.191-1.753-.411-4.876-.411-9.978" clipRule="evenodd" className="fill-current stroke-transparent" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
