import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext.jsx';
import { useMobileMenu } from '../context/MobileMenuContext.jsx';
import { useAuthState } from '../hooks/useAuthState.js';
import { ProfileMenu } from './ProfileMenu.jsx';

/* Profile (smiley) */
const PROFILE_ICON = 'M.87 10.336a4.13 4.13 0 0 0 0 3.328 40 40 0 0 0 1.88 3.709 40 40 0 0 0 2.238 3.479 4.12 4.12 0 0 0 2.907 1.686c1 .107 2.413.212 4.104.212s3.106-.105 4.105-.212a4.12 4.12 0 0 0 2.907-1.686c.592-.819 1.39-2 2.238-3.48a40 40 0 0 0 1.88-3.708 4.13 4.13 0 0 0 0-3.328 40 40 0 0 0-1.88-3.709 40 40 0 0 0-2.238-3.479 4.12 4.12 0 0 0-2.906-1.686c-1-.107-2.414-.212-4.105-.212s-3.106.105-4.106.212a4.12 4.12 0 0 0-2.906 1.686c-.592.819-1.39 2-2.238 3.479a40 40 0 0 0-1.88 3.709m7.965 3.615a1 1 0 1 0-1.672 1.098C8.261 16.722 10.176 17.5 12 17.5s3.739-.778 4.836-2.451a1 1 0 1 0-1.672-1.098c-.652.994-1.862 1.549-3.164 1.549-1.301 0-2.511-.555-3.164-1.549M8.5 8a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1m6 1a1 1 0 1 1 2 0v1a1 1 0 0 1-2 0z';

function NavIcon({ path }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={24} height={24} className="size-5 self-center transition-colors" aria-hidden>
      <path fillRule="evenodd" d={path} clipRule="evenodd" fill="currentColor" stroke="transparent" />
    </svg>
  );
}

/* Menu (circle + three lines) */
const MENU_ICON = 'M4.068 22.978c1.636.133 4.231.272 7.932.272 3.7 0 6.296-.139 7.932-.272a3.296 3.296 0 0 0 3.046-3.046c.133-1.636.272-4.231.272-7.932 0-3.7-.139-6.296-.272-7.932a3.296 3.296 0 0 0-3.046-3.046C18.296.889 15.701.75 12 .75c-3.7 0-6.296.139-7.932.272a3.296 3.296 0 0 0-3.046 3.046C.889 5.704.75 8.299.75 12c0 3.7.139 6.296.272 7.932a3.296 3.296 0 0 0 3.046 3.046M6 6a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2zM5 17a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1m0-5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1';
/* Lottery (ticket) */
const LOTTERY_ICON = 'M19 5.25c1.24 0 2.25 1.01 2.25 2.25v2a.75.75 0 0 1-.53.72 1.75 1.75 0 0 0 0 3.36.75.75 0 0 1 .53.72v2c0 1.24-1.01 2.25-2.25 2.25H5c-1.24 0-2.25-1.01-2.25-2.25v-2a.75.75 0 0 1 .53-.72 1.75 1.75 0 0 0 0-3.36A.75.75 0 0 1 2.75 9.5v-2C2.75 6.26 3.76 5.25 5 5.25zM8.5 8a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1m4.75 0a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1';
/* Casino (dice) */
const CASINO_ICON = 'M13.591.785a2.65 2.65 0 0 0-3.191 0 76 76 0 0 1-2.372 1.712l-.021.015C5.77 4.084 3.443 5.72 1.962 7.747l-.005.006C.84 9.381.474 11.4.961 13.278c.877 3.599 5.034 5.386 8.456 4.237-.348 1.581-.669 3.216-.822 4.463-.106.861.512 1.6 1.367 1.678a22.3 22.3 0 0 0 4.076 0c.855-.079 1.473-.817 1.367-1.678-.153-1.246-.474-2.88-.821-4.46 3.42 1.143 7.57-.645 8.446-4.24.485-1.874.174-3.924-1-5.53-1.482-2.028-3.81-3.664-6.046-5.235l-.021-.016c-.814-.572-1.617-1.136-2.372-1.712';
/* Sports (ball) */
const SPORTS_ICON = 'M3.504 3.283C5.394 1.393 7.993.257 11.037.06a1 1 0 0 0-.039.275V4.45q-.067.032-.133.068a22.5 22.5 0 0 0-2.64 1.71 27 27 0 0 0-2.632 2.23 3 3 0 0 0-.166.176L.942 7.436c.55-1.605 1.418-3.008 2.562-4.153m1.368 7.272L.45 9.375Q.251 10.53.25 11.779c0 3.46 1.167 6.41 3.254 8.496q.334.334.697.637l2.75-3.873a3 3 0 0 1-.068-.135 28 28 0 0 1-1.23-3.195 23.5 23.5 0 0 1-.78-3.154m3.656 7.717L5.853 22.04c1.751.968 3.835 1.49 6.147 1.49 2.287 0 4.352-.51 6.091-1.46l-2.804-3.742-.046.007c-.67.095-1.72.201-3.086.201-1.416 0-2.596-.114-3.339-.21a3 3 0 0 1-.288-.054m8.423-1.058 2.8 3.737a10 10 0 0 0 .745-.676c2.087-2.086 3.254-5.036 3.254-8.496q-.001-1.251-.2-2.406l-4.424 1.181-.009.057a23.5 23.5 0 0 1-.771 3.098 28 28 0 0 1-1.25 3.236 3 3 0 0 1-.145.27m1.62-8.582 4.487-1.198c-.55-1.604-1.418-3.007-2.562-4.15C18.606 1.392 16.006.256 12.96.06q.038.132.038.275V4.45q.068.03.135.067c.596.324 1.518.875 2.64 1.71a27 27 0 0 1 2.633 2.23q.087.085.165.176m-6.75-2.359a.37.37 0 0 1 .357 0c.52.284 1.361.785 2.401 1.558 1.1.818 1.943 1.586 2.436 2.063a.42.42 0 0 1 .131.38 21.5 21.5 0 0 1-.706 2.83 26 26 0 0 1-1.159 3.002.42.42 0 0 1-.322.25c-.586.082-1.542.18-2.804.18-1.312 0-2.405-.106-3.083-.193a.47.47 0 0 1-.372-.275 26 26 0 0 1-1.141-2.964 21.5 21.5 0 0 1-.707-2.83.42.42 0 0 1 .131-.38A25 25 0 0 1 9.42 7.83a20.5 20.5 0 0 1 2.401-1.558';
/* InPlay (play circle) */
const INPLAY_ICON = 'M12 .25C5.51.25.25 5.51.25 12S5.51 23.75 12 23.75 23.75 18.49 23.75 12 18.49.25 12 .25M9.5 7.32a1 1 0 0 1 1.04.06l7 5a1 1 0 0 1 0 1.64l-7 4.5A1 1 0 0 1 9 17.75v-9.5a1 1 0 0 1 .5-.93';
/* Rewards */
const REWARDS_ICON = 'M7.625 2.5C6.786 2.5 6 3.244 6 4.5c0 .494.146.935.376 1.274 1.218-.012 2.705-.02 4.482-.023a6.2 6.2 0 0 0-.872-1.729C9.302 3.073 8.47 2.5 7.625 2.5M4 4.5c0 .452.068.89.195 1.3-.667.01-1.177.02-1.539.027C2.11 5.84 1.257 6.05.94 6.895.828 7.192.75 7.559.75 8s.078.808.19 1.105c.317.846 1.17 1.056 1.716 1.068 1.24.027 4.225.077 9.344.077 5.12 0 8.104-.05 9.344-.077.546-.012 1.399-.222 1.717-1.068.111-.297.189-.664.189-1.105s-.078-.808-.19-1.105c-.317-.846-1.17-1.056-1.716-1.068-.362-.008-.872-.018-1.54-.028.128-.41.196-.847.196-1.299 0-2.058-1.401-4-3.625-4-1.78 0-3.136 1.177-3.983 2.353q-.21.29-.392.598a8 8 0 0 0-.392-.598C10.761 1.677 9.405.5 7.625.5 5.402.5 4 2.442 4 4.5m9.142 1.25c1.777.004 3.264.012 4.482.024.23-.34.376-.78.376-1.274 0-1.256-.786-2-1.625-2-.845 0-1.677.573-2.36 1.522a6.2 6.2 0 0 0-.873 1.729M2.25 11.66v-.015q.211.025.373.027c1.19.026 3.954.073 8.627.077v11.498c-2.658-.016-4.591-.119-5.885-.222-1.564-.124-2.803-1.3-2.94-2.888-.094-1.076-.175-2.598-.175-4.637zm19.127.012c-1.19.026-3.954.073-8.627.077v11.498c2.658-.016 4.591-.119 5.885-.222 1.564-.124 2.803-1.3 2.94-2.888.094-1.076.175-2.598.175-4.637v-3.855q-.211.025-.373.027';
/* Chat / Live Support */
const CHAT_ICON = 'M3.593.497C5.295.377 8.043.25 12 .25s6.705.128 8.407.247c1.63.114 2.93 1.342 3.08 2.99.133 1.456.263 3.675.263 6.763s-.13 5.307-.263 6.763c-.15 1.648-1.45 2.876-3.08 2.99-1.637.115-4.243.237-7.962.247l-3.632 3.112c-.81.695-2.063.119-2.063-.95v-2.248a92 92 0 0 1-3.157-.16c-1.63-.115-2.93-1.343-3.08-2.991C.38 15.557.25 13.338.25 10.25s.13-5.307.263-6.763C.663 1.84 1.963.611 3.593.497m3.858 11.167a1 1 0 0 1 1.385.287C9.488 12.945 10.7 13.5 12 13.5s2.512-.555 3.164-1.549a1 1 0 1 1 1.672 1.098C15.738 14.722 13.824 15.5 12 15.5c-1.823 0-3.738-.778-4.836-2.451a1 1 0 0 1 .287-1.385';

// Static tab definitions — `showKey` indicates which config flag controls visibility
const ALL_TABS = [
  { id: 'menu',    type: 'menu',  labelKey: 'app.menu',    iconPath: MENU_ICON,    always: true },
  { id: 'lottery', to: '/lottery', end: false, labelKey: 'lottery.lottery', iconPath: LOTTERY_ICON, showKey: 'lottery',
    match: (p) => p === '/lottery' || p.startsWith('/lottery/play') || p === '/login' || p === '/signup' },
  { id: 'results', to: '/lottery/my-tickets', end: false, labelKey: 'lottery.results', Icon: Trophy, showKey: 'lottery',
    match: (p) => p.startsWith('/lottery/my-tickets') || p.startsWith('/lottery/results') || p.startsWith('/lottery/my-winnings') },
  { id: 'casino',  to: '/casino',  end: true,  labelKey: 'app.casino',  iconPath: CASINO_ICON,  showKey: 'casino' },
  { id: 'sports',  to: '/sports',  end: true,  labelKey: 'app.sports',  iconPath: SPORTS_ICON,  showKey: 'sports' },
  { id: 'inplay',  to: '/sports/in-play', end: true, labelKey: 'app.inPlay', iconPath: INPLAY_ICON, showKey: 'sports' },
  // { id: 'rewards', to: '/rewards', end: true,  labelKey: 'app.rewards', iconPath: REWARDS_ICON, always: true },
  // { id: 'chat',    to: '/chat',    end: true,  labelKey: 'app.chat',    iconPath: CHAT_ICON,    always: true },
];

export function BottomNav() {
  const { t } = useTranslation();
  const { config, isCasinoActive, isLotteryActive } = useSiteConfig();
  const { open: menuOpen, toggleMenu } = useMobileMenu();
  const { isLoggedIn } = useAuthState();
  const { pathname } = useLocation();

  // Custom active matching — tabs may share a path prefix (e.g. /lottery and
  // /lottery/my-tickets), so a `match` fn decides per-tab which one lights up
  // instead of NavLink's prefix logic highlighting both.
  const isTabActive = (tab) =>
    tab.match ? tab.match(pathname) : tab.end ? pathname === tab.to : pathname.startsWith(tab.to);

  const hasCasino = isCasinoActive;
  const hasSports = (config?.active_sports || []).length > 0;

  const tabs = useMemo(() => {
    return ALL_TABS.filter(tab => {
      if (tab.always) return true;
      if (tab.showKey === 'lottery') return isLotteryActive;
      if (tab.showKey === 'casino') return hasCasino;
      if (tab.showKey === 'sports') return hasSports;
      return true;
    });
  }, [hasCasino, hasSports, isLotteryActive]);

  const baseTabClass =
    'local-z-1 bottom-nav-tab outline-none rounded-[var(--radius-24)] flex flex-1 min-w-0 flex-col items-center justify-center gap-[var(--spacing-8)] py-1 transition-colors delay-300 duration-200 ease-in-out cursor-pointer ';
  const activeTabClass = 'text-[var(--color-bottom-navigation-selected-foreground)] bg-[var(--color-bottom-navigation-selected-surface)]';
  const idleTabClass = 'text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)]';

  const tabClass = (active) =>
    baseTabClass + (active && !menuOpen ? activeTabClass : idleTabClass);

  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 grid px-[var(--bl-bottom-nav-padding-x)] pt-[var(--bl-bottom-nav-padding-top)] pb-[var(--bl-bottom-nav-padding-bottom)] w-full max-w-[100dvw] h-[var(--bl-bottom-nav-offset-y)] z-bottom-nav pointer-events-auto bg-gradient-to-t from-[var(--color-background-primary)] to-transparent xl:invisible sm:translate-y-[var(--bl-bottom-nav-offset-y)] transition-all local-z-stack"
    >
      <div className={`rounded-[32px] relative contain-layout h-[var(--bl-bottom-nav-height)] grid gap-0 min-w-0 px-1 py-1 sm:px-3 bg-[var(--color-bottom-navigation-background)] border border-[var(--color-foreground-muted-1)]/10 shadow-lg`} style={{ gridTemplateColumns: `repeat(${tabs.length + (isLoggedIn ? 1 : 0)}, minmax(0, 1fr))` }}>
        {tabs.map((tab) => {
          const { id, type, to, end, labelKey, iconPath, Icon } = tab;
          return type === 'menu' ? (
            <button
              key={id}
              type="button"
              onClick={toggleMenu}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className={baseTabClass + (menuOpen ? activeTabClass : idleTabClass)}
            >
              <div className="relative">
                <NavIcon path={iconPath} />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase truncate w-full text-center">{t(labelKey)}</span>
            </button>
          ) : (
            <NavLink key={id} to={to} end={end} className={tabClass(isTabActive(tab))}>
              <div className="relative">
                {Icon ? <Icon className="size-5 self-center transition-colors" aria-hidden /> : <NavIcon path={iconPath} />}
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase truncate w-full text-center">{t(labelKey)}</span>
            </NavLink>
          );
        })}

        {/* Profile (logged in) — opens the profile menu upward */}
        {isLoggedIn && (
          <ProfileMenu
            side="top"
            align="end"
            trigger={
              <button type="button" aria-label="Profile" className={baseTabClass + idleTabClass}>
                <div className="relative">
                  <NavIcon path={PROFILE_ICON} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase truncate w-full text-center">{t('account.profile', 'Profile')}</span>
              </button>
            }
          />
        )}
      </div>
    </nav>
  );
}

export default BottomNav;
