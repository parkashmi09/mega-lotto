import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useScreenSize } from '@/hooks';
import { useGames } from '@/context/GameContext';

export default function ProviderModal({ isOpen, onClose, onProvidersChange }) {
  const { t } = useTranslation();
  const { isMobile } = useScreenSize();
  const { selectedVendors, vendorDisplayNames, setSelectedVendors } = useGames();
  const [searchInput, setSearchInput] = useState('');

  const providerOptions = useMemo(() =>
    Object.entries(vendorDisplayNames).map(([key, name]) => ({ key, name })),
    [vendorDisplayNames]
  );

  const filteredProviders = useMemo(() => {
    if (!searchInput.trim()) return providerOptions;
    return providerOptions.filter(p =>
      p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      p.key.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [providerOptions, searchInput]);

  const groupedProviders = useMemo(() => {
    const groups = {};
    filteredProviders.forEach(p => {
      const letter = p.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(p);
    });
    return groups;
  }, [filteredProviders]);

  const handleProviderToggle = useCallback((providerKey) => {
    const newSelection = selectedVendors.includes(providerKey) ? [] : [providerKey];
    setSelectedVendors(newSelection);
    if (onProvidersChange) onProvidersChange(newSelection);
    onClose();
  }, [selectedVendors, setSelectedVendors, onProvidersChange, onClose]);

  useEffect(() => {
    if (!isOpen) {
      // Reset search when modal closes
      const timer = setTimeout(() => setSearchInput(''), 0);
      document.body.classList.remove('modal-open');
      return () => clearTimeout(timer);
    }
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className={`relative flex max-h-[85vh] flex-col overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-2xl ${
          isMobile ? 'h-full w-full max-w-none rounded-none' : 'w-full max-w-lg'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {t('casino.selectProvider')}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)]"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4">
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('casino.searchProviders')}
              className="w-full rounded-lg bg-[var(--color-surface-elevated)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          {selectedVendors.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-secondary)]">
                {t('casino.selected')}: {vendorDisplayNames[selectedVendors[0]] || selectedVendors[0]}
              </span>
              <button
                onClick={() => {
                  setSelectedVendors([]);
                  if (onProvidersChange) onProvidersChange([]);
                  onClose();
                }}
                className="text-xs text-[var(--color-primary)] hover:underline"
              >
                {t('casino.clearFilter')}
              </button>
            </div>
          )}
        </div>

        {/* Provider List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {Object.entries(groupedProviders).map(([letter, providers]) => (
            <div key={letter} className="mb-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">{letter}</h3>
              <div className="grid grid-cols-2 gap-2">
                {providers.map(provider => {
                  const isSelected = selectedVendors.includes(provider.key);
                  return (
                    <button
                      key={provider.key}
                      onClick={() => handleProviderToggle(provider.key)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        isSelected
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover,var(--color-surface-elevated))]'
                      }`}
                    >
                      <span className="truncate">{provider.name}</span>
                      {isSelected && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {filteredProviders.length === 0 && (
            <div className="py-12 text-center text-sm text-[var(--color-text-secondary)]">
              {t('casino.noProviders')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
