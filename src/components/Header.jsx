import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { useLeftNav } from '../context/LeftNavContext.jsx';
import { AuthLink } from './AuthLink.jsx';
import { WalletPopover } from './WalletPopover.jsx';
import { ProfileMenu } from './ProfileMenu.jsx';
import { LanguageModal } from './LanguageModal.jsx';
import { Logo } from './Logo.jsx';
import { storage } from '@/utils';

/* SVG clip-path definition for the curved notch edges */
function NotchClipDefs() {
  return (
    <svg width="0" height="0" className="pointer-events-none absolute" aria-hidden="true">
      <defs>
        <clipPath clipPathUnits="objectBoundingBox" id="notch-clip">
          <path d="M 0.993 1 V 0 H 0.008 C 0.271 0 0.484 0.197 0.484 0.441 V 0.529 C 0.484 0.789 0.713 1 0.993 1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* Thrill text SVG logo for mobile */
function ThrillLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 20" fill="none" className="text-[var(--color-foreground-primary)] h-[36px] w-12 min-[428px]:w-[60px]">
      <path d="M20.4266 4.56681H17.2569L16.2408 8.37525H15.9923V0.00105366H9.98967V14.9551H6.00264V9.32658H8.50104V4.56681H6.00264V0.00105366H0V16.1939C0 18.2921 1.72845 20 3.85371 20H8.52313L9.74196 15.4311H9.99046V20H15.9931V10.4719C15.9931 9.85328 16.5035 9.33983 17.1299 9.32736C17.7246 9.32736 18.2777 9.70749 18.2777 10.4711V20H24.2804V8.37291C24.2804 6.27391 22.5519 4.56681 20.4274 4.56681" className="fill-current" />
      <path d="M43.1273 4.56624H37.1246V19.9994H43.1273V4.56624Z" className="fill-current" />
      <path d="M43.1273 0.00102984H37.1247V3.25861H43.1273V0.00102984Z" className="fill-current" />
      <path d="M58.5853 19.999H55.9678C54.2796 19.999 52.8043 18.9308 52.2955 17.3413L52.0273 16.503L51.0948 19.999H48.4718C46.3473 19.999 44.6181 18.2919 44.6181 16.1929V0H50.6207V14.954H52.1085V0H58.1112V14.954H59.9469L58.5853 19.999Z" className="fill-current" />
      <path d="M32.0189 8.3747H31.7704V4.56626H25.7677V19.9995H31.7704V10.4425C31.7704 9.82702 32.2776 9.32681 32.9001 9.32681H35.6375V4.56704H33.0342L32.0181 8.37548L32.0189 8.3747Z" className="fill-current" />
    </svg>
  );
}

/* Round icon button used for Rewards, Notifications, Search, Chat */
function IconButton({ label, children, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[40px] sm:size-[42px] items-center justify-center rounded-full
                 bg-[var(--color-control-primary)]
                 text-[var(--color-control-primary-foreground)]
                 transition-all hover:scale-110
                 hover:bg-[var(--color-control-primary-active)]
                 hover:text-[var(--color-control-primary-foreground-active)]
                 focus:outline-none cursor-pointer"
    >
      {children}
    </button>
  );
}

/* Icon SVGs */
const RewardsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={24} height={24} className="size-[18px] shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M7.625 2.5C6.786 2.5 6 3.244 6 4.5c0 .494.146.935.376 1.274 1.218-.012 2.705-.02 4.482-.023a6.2 6.2 0 0 0-.872-1.729C9.302 3.073 8.47 2.5 7.625 2.5M4 4.5c0 .452.068.89.195 1.3-.667.01-1.177.02-1.539.027C2.11 5.84 1.257 6.05.94 6.895.828 7.192.75 7.559.75 8s.078.808.19 1.105c.317.846 1.17 1.056 1.716 1.068 1.24.027 4.225.077 9.344.077 5.12 0 8.104-.05 9.344-.077.546-.012 1.399-.222 1.717-1.068.111-.297.189-.664.189-1.105s-.078-.808-.19-1.105c-.317-.846-1.17-1.056-1.716-1.068-.362-.008-.872-.018-1.54-.028.128-.41.196-.847.196-1.299 0-2.058-1.401-4-3.625-4-1.78 0-3.136 1.177-3.983 2.353q-.21.29-.392.598a8 8 0 0 0-.392-.598C10.761 1.677 9.405.5 7.625.5 5.402.5 4 2.442 4 4.5m9.142 1.25c1.777.004 3.264.012 4.482.024.23-.34.376-.78.376-1.274 0-1.256-.786-2-1.625-2-.845 0-1.677.573-2.36 1.522a6.2 6.2 0 0 0-.873 1.729M2.25 11.66v-.015q.211.025.373.027c1.19.026 3.954.073 8.627.077v11.498c-2.658-.016-4.591-.119-5.885-.222-1.564-.124-2.803-1.3-2.94-2.888-.094-1.076-.175-2.598-.175-4.637zm19.127.012c-1.19.026-3.954.073-8.627.077v11.498c2.658-.016 4.591-.119 5.885-.222 1.564-.124 2.803-1.3 2.94-2.888.094-1.076.175-2.598.175-4.637v-3.855q-.211.025-.373.027" clipRule="evenodd" fill="currentColor" stroke="transparent" />
  </svg>
);

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={24} height={24} className="size-[18px] shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M12 .25a8.35 8.35 0 0 0-8.32 7.665l-.27 3.277a7.25 7.25 0 0 1-1.056 3.214l-.938 1.52c-.395.64-.545 1.393-.297 2.07.26.708.89 1.165 1.692 1.287 1.588.241 4.359.467 9.19.467s7.6-.226 9.188-.467c.803-.123 1.433-.579 1.692-1.286.249-.678.099-1.43-.296-2.07l-.939-1.521a7.25 7.25 0 0 1-1.055-3.214l-.27-3.277A8.35 8.35 0 0 0 12.001.25M7.748 21.18c1.212.044 2.62.07 4.253.07s3.04-.026 4.252-.07a4.75 4.75 0 0 1-8.505 0M12.5 2.626a.875.875 0 0 0 0 1.75c1.828 0 3.459 1.54 3.628 3.694a.875.875 0 0 0 1.745-.138c-.231-2.936-2.51-5.306-5.373-5.306" clipRule="evenodd" fill="currentColor" stroke="transparent" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={24} height={24} className="size-[18px] shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M.75 11C.75 5.34 5.34.75 11 .75S21.25 5.34 21.25 11c0 2-.572 3.865-1.562 5.442l.303.252.034.027c.817.678 1.628 1.351 2.43 2.094.96.892 1.093 2.279.159 3.245a24 24 0 0 1-.553.553c-.966.936-2.352.803-3.243-.16-.743-.801-1.415-1.613-2.092-2.43l-.028-.034-.252-.304A10.2 10.2 0 0 1 11 21.25C5.34 21.25.75 16.66.75 11m2.5 0a7.75 7.75 0 1 1 15.5 0 7.75 7.75 0 0 1-15.5 0" clipRule="evenodd" fill="currentColor" stroke="transparent" />
  </svg>
);

/* Profile icon — identical to the bottom-nav PROFILE icon */
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={24} height={24} className="size-[18px] shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M.87 10.336a4.13 4.13 0 0 0 0 3.328 40 40 0 0 0 1.88 3.709 40 40 0 0 0 2.238 3.479 4.12 4.12 0 0 0 2.907 1.686c1 .107 2.413.212 4.104.212s3.106-.105 4.105-.212a4.12 4.12 0 0 0 2.907-1.686c.592-.819 1.39-2 2.238-3.48a40 40 0 0 0 1.88-3.708 4.13 4.13 0 0 0 0-3.328 40 40 0 0 0-1.88-3.709 40 40 0 0 0-2.238-3.479 4.12 4.12 0 0 0-2.906-1.686c-1-.107-2.414-.212-4.105-.212s-3.106.105-4.106.212a4.12 4.12 0 0 0-2.906 1.686c-.592.819-1.39 2-2.238 3.479a40 40 0 0 0-1.88 3.709m7.965 3.615a1 1 0 1 0-1.672 1.098C8.261 16.722 10.176 17.5 12 17.5s3.739-.778 4.836-2.451a1 1 0 1 0-1.672-1.098c-.652.994-1.862 1.549-3.164 1.549-1.301 0-2.511-.555-3.164-1.549M8.5 8a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1m6 1a1 1 0 1 1 2 0v1a1 1 0 0 1-2 0z" clipRule="evenodd" fill="currentColor" stroke="transparent" />
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={24} height={24} className="size-[18px] shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M11 .75C5.34.75.75 5.34.75 11c0 1.9.517 3.68 1.418 5.205-.433 1.05-.87 2.277-1.152 3.411-.21.84.536 1.553 1.365 1.323 1.093-.304 2.288-.74 3.329-1.158a10.2 10.2 0 0 0 5.108 1.467 7.5 7.5 0 0 1 10.43-10.43C21.152 5.241 16.6.75 11 .75M23.25 17a6.25 6.25 0 1 0-3.036 5.361c.426.19.9.383 1.401.547.826.27 1.59-.457 1.338-1.297a11 11 0 0 0-.557-1.456A6.2 6.2 0 0 0 23.25 17" clipRule="evenodd" fill="currentColor" stroke="transparent" />
  </svg>
);

export function Header() {
  const { t } = useTranslation();
  const { platformName, logo } = useSiteConfig();
  const { expanded: leftNavExpanded } = useLeftNav();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const token = storage.getKey('token');
    const logged = storage.getKey('logged');
    setIsLoggedIn(!!token || logged === true);
  }, []);

  useEffect(() => {
    const onFocus = () => {
      const token = storage.getKey('token');
      const logged = storage.getKey('logged');
      setIsLoggedIn(!!token || logged === true);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <header
      data-testid="header"
      className={`
        fixed top-0 left-0 z-[var(--z-index-header)] w-full
        h-[var(--bl-header-height)]
        pe-[var(--bl-right-panel-offset-x)]
        transition-[padding-left,padding-right] duration-300 ease-in-out
        ${leftNavExpanded ? 'xl:pl-[312px]' : 'xl:pl-[112px]'}
      `}
    >
      {/* Glassmorphism glow behind header */}
      <div className="pointer-events-none absolute -top-[620px] left-1/2 -translate-x-1/2 flex justify-center overflow-hidden z-[2]">
        <svg className="size-[690px] min-w-[690px]" viewBox="0 0 690 690" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#header-glow)">
            <path d="M200 345C200 264.919 264.919 200 345 200V200C425.081 200 490 264.919 490 345V345C490 425.081 425.081 490 345 490V490C264.919 490 200 425.081 200 345V345Z" fill="var(--color-effect-glow)" />
          </g>
          <defs>
            <filter id="header-glow" x="0" y="0" width="690" height="690" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Header content bar */}
      <div className="pointer-events-auto flex h-full justify-center px-5 grow
                       max-sm:bg-gradient-to-b max-sm:from-[var(--color-background-primary)] max-sm:to-transparent
                       sm:bg-[var(--color-header-background)] sm:backdrop-blur-[20px] sm:supports-[backdrop-filter]:backdrop-blur-[20px]
                       sm:pb-4">
        {/* 3-column grid: left | center notch | right */}
        <div className="grid h-[60px] grid-cols-[1fr_minmax(0,auto)_1fr] max-sm:w-full sm:h-full">

          {/* ── LEFT COLUMN ── */}
          <div className="mb-2 self-end sm:mb-[6px]">
            <div className="grid grid-cols-1 grid-rows-1" style={{ placeItems: 'end start' }}>
              {/* Mobile: Thrill logo */}
              <div className="col-start-1 row-start-1 rounded-full">
                <Link to="/" className="block sm:hidden">
                  <Logo className="w-[58px]" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── CENTER COLUMN (Notch) ── */}
          <div className="grid h-full grid-cols-1 grid-rows-1 place-items-center">
            <NotchClipDefs />

            <div className="h-full sm:h-[68px] mx-2 sm:mx-10 relative flex justify-center md:mx-12 z-[1] col-start-1 row-start-1">
              {/* Left notch curve */}
              <div className="pointer-events-none absolute top-0 right-[98%] aspect-[63/68] h-full -z-[1]">
                <div
                  className="bg-[var(--color-background-secondary)] pointer-events-none size-full"
                  aria-hidden="true"
                  style={{ clipPath: 'url(#notch-clip)' }}
                />
              </div>

              {/* Center panel — wallet + deposit in the notch (logged in), else auth links */}
              <div className="bg-[var(--color-background-secondary)] grid w-full">
                <div className="-mx-3 flex items-center justify-center">
                  <div className="flex gap-2">
                    {isLoggedIn ? (
                      <WalletPopover />
                    ) : (
                      <>
                        <AuthLink to="/login" variant="secondary">
                          {t('app.login', 'Log in')}
                        </AuthLink>
                        <AuthLink to="/signup" variant="primary">
                          {t('app.signup', 'Sign up')}
                        </AuthLink>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right notch curve */}
              <div className="pointer-events-none absolute top-0 left-[98%] aspect-[63/68] h-full -z-[1]">
                <div
                  className="bg-[var(--color-background-secondary)] pointer-events-none size-full"
                  aria-hidden="true"
                  style={{ clipPath: 'url(#notch-clip)', transform: 'rotateY(180deg)' }}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="mb-2 self-end sm:mb-[6px]">
            <div className="grid grid-cols-1 grid-rows-1" style={{ placeItems: 'end' }}>
              <div className="col-start-1 row-start-1 size-[40px] sm:size-[42px] rounded-full">
                {/* Mobile: Language switcher (profile moved to bottom nav) */}
                <div className="block sm:hidden">
                  <IconButton label="Change language" onClick={() => setLangOpen(true)}>
                    <Globe size={18} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Profile dropdown + Language button (absolute right) */}
      <div className="absolute top-5 right-6 hidden sm:flex items-center gap-2">
        {isLoggedIn && (
          <ProfileMenu
            side="bottom"
            align="end"
            trigger={
              <button
                type="button"
                aria-label="Profile menu"
                className="flex size-[42px] items-center justify-center rounded-full bg-[var(--color-control-primary)] text-[var(--color-control-primary-foreground)] transition-all hover:scale-110 hover:bg-[var(--color-control-primary-active)] hover:text-[var(--color-control-primary-foreground-active)] cursor-pointer"
              >
                <ProfileIcon />
              </button>
            }
          />
        )}
        <IconButton label="Change language" onClick={() => setLangOpen(true)}>
          <Globe size={18} />
        </IconButton>
      </div>

      <LanguageModal open={langOpen} onClose={() => setLangOpen(false)} />
    </header>
  );
}

export default Header;
