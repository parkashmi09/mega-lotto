import { useTranslation } from 'react-i18next';
import BannerSlider from '@/components/BannerSlider';

/**
 * Lottery banner slider — same component/design as the old Thrill casino banner.
 * Text is i18n-synced (see `lottery.banner.*` in the locale files) so it switches
 * with the selected language. Images are local in /public/assets/banners.
 */
const BANNERS = [
  {
    id: 1,
    bannerBg: '#5CFFC1', bannerFg: '#1B1D29',
    badgeBg: '#1B1D29', badgeFg: '#5CFFC1', iconBg: '#5CFFC1', iconFg: '#1B1D29',
    badgeIcon: 'star',
    badgeKey: 'lottery.banner.featuredBadge',
    titleKey: 'lottery.banner.b1Title',
    subKey: 'lottery.banner.b1Sub',
    image: '/assets/banners/new/lot-ban-1.png',
    href: '/lottery',
  },
  {
    id: 2,
    bannerBg: '#5956FF', bannerFg: '#FFFFFF',
    badgeBg: 'rgba(0,0,0,0.2)', badgeFg: '#FFFFFF', iconBg: '#FFFFFF', iconFg: '#514EE5',
    badgeIcon: 'percent',
    badgeKey: 'lottery.banner.promoBadge',
    titleKey: 'lottery.banner.b2Title',
    subKey: 'lottery.banner.b2Sub',
    image: '/assets/banners/banner-2.png',
    href: '/lottery',
  },
  {
    id: 3,
    bannerBg: '#6FECC1', bannerFg: '#13231C',
    badgeBg: '#13231C', badgeFg: '#6FECC1', iconBg: '#6FECC1', iconFg: '#13231C',
    badgeIcon: 'trophy',
    badgeKey: 'lottery.banner.resultsBadge',
    titleKey: 'lottery.banner.b3Title',
    subKey: 'lottery.banner.b3Sub',
    image: '/assets/banners/new/lot-ban-3.png',
    href: '/lottery/results',
  },
];

export default function LotteryBannerSlider() {
  const { t } = useTranslation();
  const banners = BANNERS.map((b) => ({
    ...b,
    badgeLabel: t(b.badgeKey),
    title: t(b.titleKey),
    subtitle: t(b.subKey),
  }));
  return <BannerSlider banners={banners} />;
}
