import BannerSlider from '@/components/BannerSlider';

const CASINO_BANNERS = [
  {
    id: 1,
    bannerBg: '#5CFFC1',
    bannerFg: '#1B1D29',
    badgeBg: '#1B1D29',
    badgeFg: '#5CFFC1',
    iconBg: '#5CFFC1',
    iconFg: '#1B1D29',
    badgeLabel: 'Featured',
    badgeIcon: 'star',
    title: 'New releases',
    subtitle: 'discover and play\nthe latest games',
    image: 'https://banners.thrill.com/92279688-0a6a-4dfa-a854-34f76edebbf1',
    href: '/casino/category/new-releases',
  },
  {
    id: 2,
    bannerBg: '#5956FF',
    bannerFg: '#FFFFFF',
    badgeBg: 'rgba(0,0,0,0.2)',
    badgeFg: '#FFFFFF',
    iconBg: '#FFFFFF',
    iconFg: '#514EE5',
    badgeLabel: 'Promotion',
    badgeIcon: 'percent',
    title: '$10,000\nDAILY RACE',
    subtitle: 'secure your spot.',
    image: 'https://banners.thrill.com/ecfa3ca9-5556-474f-a116-d44b62a54f48',
    href: '/promo/race/latest?type=daily',
  },
  {
    id: 3,
    bannerBg: '#5CFFC1',
    bannerFg: '#1B1D29',
    badgeBg: '#1B1D29',
    badgeFg: '#5CFFC1',
    iconBg: '#5CFFC1',
    iconFg: '#1B1D29',
    badgeLabel: 'Announcement',
    badgeIcon: 'bell',
    title: 'Join our Telegram',
    subtitle: 'for daily drops and more',
    image: 'https://banners.thrill.com/1e4d0881-2b73-4be2-9d14-7664b050861c',
    href: 'https://t.me/Thrillcom',
    external: true,
  },
];

export default function CasinoBannerSlider({ banners = CASINO_BANNERS }) {
  return <BannerSlider banners={banners} />;
}
