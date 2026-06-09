import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '@/context/SiteConfigContext.jsx';
import BannerSlider from '@/components/BannerSlider';
import HomeSportsSection from '@/components/sports/HomeSportsSection';

const SPORTS_BANNERS = [
  {
    id: 's1',
    bannerBg: '#FF6B35',
    bannerFg: '#FFFFFF',
    badgeBg: 'rgba(0,0,0,0.25)',
    badgeFg: '#FFFFFF',
    iconBg: '#FFFFFF',
    iconFg: '#FF6B35',
    badgeLabel: 'Live Now',
    badgeIcon: 'trophy',
    title: 'CRICKET\nPREMIER LEAGUE',
    subtitle: 'bet on live matches\nwith boosted odds',
    image: 'https://banners.thrill.com/92279688-0a6a-4dfa-a854-34f76edebbf1',
    href: '/sports/cricket',
  },
  {
    id: 's2',
    bannerBg: '#1E90FF',
    bannerFg: '#FFFFFF',
    badgeBg: 'rgba(0,0,0,0.2)',
    badgeFg: '#FFFFFF',
    iconBg: '#FFFFFF',
    iconFg: '#1E90FF',
    badgeLabel: 'Promotion',
    badgeIcon: 'percent',
    title: 'FREE BET\nWEEKEND',
    subtitle: 'place your first bet risk-free',
    image: 'https://banners.thrill.com/ecfa3ca9-5556-474f-a116-d44b62a54f48',
    href: '/sports/in-play',
  },
  {
    id: 's3',
    bannerBg: '#2ECC71',
    bannerFg: '#1B1D29',
    badgeBg: '#1B1D29',
    badgeFg: '#2ECC71',
    iconBg: '#2ECC71',
    iconFg: '#1B1D29',
    badgeLabel: 'Featured',
    badgeIcon: 'star',
    title: 'FOOTBALL\nCHAMPIONS',
    subtitle: 'top leagues & markets\navailable now',
    image: 'https://banners.thrill.com/1e4d0881-2b73-4be2-9d14-7664b050861c',
    href: '/sports/football',
  },
];

/* Sport label mapping for sub-page headings */
const SPORT_LABELS = {
  cricket: 'app.cricket',
  football: 'app.football',
  basketball: 'app.basketball',
  tennis: 'app.tennis',
  'horse-racing': 'app.horseRacing',
  esports: 'app.esports',
  'in-play': 'app.inPlay',
};

export function SportsPage() {
  const { sport } = useParams();
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Banner Slider */}
      <BannerSlider banners={SPORTS_BANNERS} />

      {/* Sports lobby — show match sections when no specific sport selected */}
      {!sport && <HomeSportsSection />}

      {/* Sport sub-page heading + placeholder */}
      {sport && (
        <>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {t(SPORT_LABELS[sport] || 'app.sports')}
          </h1>
          <div className="rounded-2xl bg-[var(--color-surface-elevated,var(--color-background-secondary))] p-8 text-center">
            <p className="text-sm text-[var(--color-text-secondary,var(--color-foreground-muted-1))]">
              {t(SPORT_LABELS[sport] || 'app.sports')} content coming soon
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default SportsPage;
