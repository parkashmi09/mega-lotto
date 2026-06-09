import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { Sport, TableGame, Original } from '../config/enums.js';

export function ImplementationPage() {
  const { t } = useTranslation();
  const {
    config,
    isSportEnabled,
    isTableEnabled,
    isOriginalEnabled,
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
        <h2 className="mb-2 text-lg font-medium text-[var(--color-text-primary)]">{t('app.themeTitle')}</h2>
        <div className="flex flex-wrap gap-2">
          <span className="rounded bg-[var(--color-primary)] px-3 py-1 text-white">{t('common.primary')}</span>
          <span className="rounded bg-[var(--color-accent)] px-3 py-1 text-white">{t('common.accent')}</span>
          <span className="rounded bg-[var(--color-success)] px-3 py-1 text-white">{t('common.success')}</span>
        </div>
      </section>

      <p className="text-sm text-[var(--color-text-secondary)]">
        {t('app.configTheme', { theme: config?.theme_name, plan: config?.subscription_plan })}
      </p>
    </div>
  );
}

export default ImplementationPage;
