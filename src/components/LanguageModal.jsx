import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { LanguageLabel } from '../config/enums.js';

export function LanguageModal({ open, onClose }) {
  const { t, i18n } = useTranslation();
  const { supportedLanguages, setLanguage } = useSiteConfig();
  const current = i18n.language;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const langs = (supportedLanguages?.length ? supportedLanguages : ['en', 'te']);

  const choose = (lng) => {
    setLanguage(lng);
    try { localStorage.setItem('user_language', lng); } catch { /* ignore */ }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[var(--z-index-drawer-portal)] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-label={t('language.title', 'Select Language')} className="relative w-full max-w-[380px] overflow-hidden rounded-[24px] bg-[var(--color-surface-1)] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-[20px] pb-[12px]">
          <div>
            <h3 className="text-[18px] font-bold text-[var(--color-foreground-primary)]">{t('language.title', 'Select Language')}</h3>
            <p className="text-[13px] text-[var(--color-foreground-muted-1)]">{t('language.subtitle', 'Choose your preferred language')}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-8 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-[8px] p-[20px] pt-[8px]">
          {langs.map((lng) => {
            const active = current === lng;
            return (
              <button
                key={lng}
                type="button"
                onClick={() => choose(lng)}
                className={`flex items-center justify-between rounded-[16px] px-[18px] py-[14px] text-left transition-colors cursor-pointer
                  ${active
                    ? 'bg-[var(--color-green-1)]/15 ring-2 ring-[var(--color-green-1)]'
                    : 'bg-[var(--color-surface-2)] ring-1 ring-[var(--color-foreground-muted-1)]/10 hover:bg-[var(--color-surface-3)]'}`}
              >
                <span className={`text-[16px] font-bold ${active ? 'text-[var(--color-green-1)]' : 'text-[var(--color-foreground-primary)]'}`}>
                  {LanguageLabel[lng] || lng.toUpperCase()}
                </span>
                {active && <Check size={18} className="text-[var(--color-green-1)]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LanguageModal;
