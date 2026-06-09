import { useTranslation } from 'react-i18next';

export default function SearchBar({ value, onChange, placeholder }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex-1">
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
      >
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || t('casino.searchPlaceholder')}
        className="w-full rounded-lg bg-[var(--color-surface-elevated)] py-2.5 pl-10 pr-9 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] outline-none transition focus:ring-2 focus:ring-[var(--color-primary)]"
      />
      {value && (
        <button
          onClick={() => onChange({ target: { value: '' } })}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          aria-label="Clear search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </div>
  );
}
