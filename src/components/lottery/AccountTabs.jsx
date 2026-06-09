/**
 * Segmented pill tab bar (My Tickets / My Winnings / Last Result).
 * Active segment gets a green gradient pill + glow; idle segments are muted.
 */
export default function AccountTabs({ tabs, active, onChange }) {
  return (
    <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
      <div className="inline-flex min-w-full gap-1 rounded-full bg-[var(--color-surface-2)]/70 p-1 sm:min-w-0">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-[14px] font-bold transition-all duration-200 cursor-pointer sm:flex-none ${
                isActive
                  ? 'text-white shadow-[0_0_18px_-6px_var(--color-green-1)]'
                  : 'text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)]'
              }`}
              style={
                isActive
                  ? { background: 'linear-gradient(90deg, color-mix(in srgb, var(--color-green-1) 22%, var(--color-surface-3)) 0%, var(--color-green-1) 100%)' }
                  : undefined
              }
            >
              {tab.label}
              {typeof tab.count === 'number' && (
                <span className={isActive ? 'opacity-90' : 'opacity-70'}>({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
