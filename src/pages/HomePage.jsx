import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { Sport, TableGame, Original, ThemeName } from '../config/enums.js';

const THEME_LABELS = {
  [ThemeName.DARK]: 'Dark',
  [ThemeName.LIGHT]: 'Light',
  [ThemeName.THRILL_TEMPLATE]: 'Thrill',
  [ThemeName.ROYAL_TEMPLATE]: 'Royal',
  [ThemeName.PREMIUM]: 'Premium',
};

export function HomePage() {
  const { t } = useTranslation();
  const {
    config,
    isSportEnabled,
    isTableEnabled,
    isOriginalEnabled,
    themeName,
    setTheme,
  } = useSiteConfig();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-lg bg-[var(--color-surface)] p-4">
        <h1 className="mb-2 text-xl font-semibold text-[var(--color-text-primary)]">
          {t('app.featuresTitle')}
        </h1>
        <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
          {isSportEnabled(Sport.FOOTBALL) && <li>{t('app.sports')}: {t('app.football')}</li>}
          {isSportEnabled(Sport.BASKETBALL) && <li>{t('app.sports')}: {t('app.basketball')}</li>}
          {isSportEnabled(Sport.TENNIS) && <li>{t('app.sports')}: {t('app.tennis')}</li>}
          {isTableEnabled(TableGame.BLACKJACK) && <li>{t('app.tables')}: {t('app.blackjack')}</li>}
          {isTableEnabled(TableGame.ROULETTE) && <li>{t('app.tables')}: {t('app.roulette')}</li>}
          {isTableEnabled(TableGame.BACCARAT) && <li>{t('app.tables')}: {t('app.baccarat')}</li>}
          {isOriginalEnabled(Original.SLOTS) && <li>{t('app.originals')}: {t('app.slots')}</li>}
          {isOriginalEnabled(Original.LIVE_CASINO) && <li>{t('app.originals')}: {t('app.liveCasino')}</li>}
        </ul>
      </section>

      <section className="rounded-lg bg-[var(--color-surface)] p-4">
        <h2 className="mb-2 text-lg font-medium text-[var(--color-text-primary)]">
          {t('app.themeTitle')}
        </h2>
        {/* Dark / Light switch toggle box – check theme switch */}
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            {t('app.themeSwitchLabel', 'Theme:')}
          </span>
          <label className="relative inline-flex cursor-pointer items-center gap-2 rounded focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-surface)]">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {(themeName ?? config?.theme_name) === ThemeName.LIGHT ? t('app.light', 'Light') : t('app.dark', 'Dark')}
            </span>
            <input
              type="checkbox"
              checked={(themeName ?? config?.theme_name) === ThemeName.LIGHT}
              onChange={(e) =>
                setTheme(e.target.checked ? ThemeName.LIGHT : (config?.theme_name ?? ThemeName.DARK))
              }
              className="peer sr-only"
              aria-label={t('app.themeSwitchA11y', 'Toggle dark or light theme')}
            />
            <span className="relative block h-6 w-11 shrink-0 rounded-full bg-[var(--color-surface-elevated)] after:absolute after:left-0.5 after:top-0.5 after:block after:h-5 after:w-5 after:rounded-full after:bg-[var(--color-primary)] after:transition-[transform] after:duration-200 after:content-[''] peer-checked:after:translate-x-5" />
          </label>
        </div>
        <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
          {t('app.themeToggleHint', 'Toggle theme to verify palette:')} <strong>{themeName ?? config?.theme_name}</strong>
        </p>
        <div className="mb-3 flex flex-wrap gap-2">
          {(Object.values(ThemeName)).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setTheme(name)}
              className={`rounded px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] ${
                (themeName ?? config?.theme_name) === name
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:opacity-90'
              }`}
            >
              {THEME_LABELS[name] ?? name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded bg-[var(--color-primary)] px-3 py-1 text-white">{t('common.primary')}</span>
          <span className="rounded bg-[var(--color-accent)] px-3 py-1 text-white">{t('common.accent')}</span>
          <span className="rounded bg-[var(--color-success)] px-3 py-1 text-white">{t('common.success')}</span>
        </div>
      </section>

      <p className="text-sm text-[var(--color-text-secondary)]">
        {t('app.configTheme', { theme: themeName ?? config?.theme_name, plan: config?.subscription_plan })}
      </p>
    </div>
  );
}

export default HomePage;
