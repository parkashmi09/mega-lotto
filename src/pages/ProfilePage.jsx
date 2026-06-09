import { useTranslation } from 'react-i18next';
import { storage } from '@/utils';
import { useUserInfo, useBetWinCount, useWagerCheck, useKYCStatus } from '@/hooks';

const VerifiedBadgeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-[var(--color-button-primary)] size-3.5">
    <path fillRule="evenodd" d="M10.706.806a1.75 1.75 0 0 1 2.587 0l1.21 1.328a.25.25 0 0 0 .261.07l1.712-.545a1.75 1.75 0 0 1 2.24 1.293l.385 1.756a.25.25 0 0 0 .19.19l1.756.384a1.75 1.75 0 0 1 1.293 2.24l-.545 1.713a.25.25 0 0 0 .07.26l1.328 1.21a1.75 1.75 0 0 1 0 2.588l-1.328 1.21a.25.25 0 0 0-.07.261l.545 1.712a1.75 1.75 0 0 1-1.293 2.24l-1.756.385a.25.25 0 0 0-.19.19l-.384 1.756a1.75 1.75 0 0 1-2.24 1.293l-1.713-.545a.25.25 0 0 0-.26.07l-1.21 1.328a1.75 1.75 0 0 1-2.588 0l-1.21-1.328a.25.25 0 0 0-.26-.07l-1.713.545a1.75 1.75 0 0 1-2.24-1.293l-.385-1.756a.25.25 0 0 0-.19-.19l-1.756-.384a1.75 1.75 0 0 1-1.293-2.24l.545-1.713a.25.25 0 0 0-.07-.26l-1.328-1.21a1.75 1.75 0 0 1 0-2.588l1.328-1.21a.25.25 0 0 0 .07-.26l-.545-1.713a1.75 1.75 0 0 1 1.293-2.24l1.756-.385a.25.25 0 0 0 .19-.19l.384-1.756a1.75 1.75 0 0 1 2.24-1.293l1.713.545a.25.25 0 0 0 .26-.07zm6.866 8.505c.269-.411.334-.945.043-1.341a3.9 3.9 0 0 0-1.207-1.059c-.54-.312-1.186-.074-1.545.435-2.191 3.112-3.556 5.132-3.556 5.132s-.82-1.02-2.184-2.487c-.474-.51-1.242-.611-1.766-.155a6.5 6.5 0 0 0-.865.902c-.348.449-.275 1.07.082 1.511a48 48 0 0 0 3.585 3.957c.755.745 1.94.683 2.605-.144 1.015-1.264 2.642-3.427 4.808-6.75" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const UnverifiedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-[var(--color-foreground-muted-1)] size-3.5">
    <path fillRule="evenodd" d="M10.706.806a1.75 1.75 0 0 1 2.587 0l1.21 1.328a.25.25 0 0 0 .261.07l1.712-.545a1.75 1.75 0 0 1 2.24 1.293l.385 1.756a.25.25 0 0 0 .19.19l1.756.384a1.75 1.75 0 0 1 1.293 2.24l-.545 1.713a.25.25 0 0 0 .07.26l1.328 1.21a1.75 1.75 0 0 1 0 2.588l-1.328 1.21a.25.25 0 0 0-.07.261l.545 1.712a1.75 1.75 0 0 1-1.293 2.24l-1.756.385a.25.25 0 0 0-.19.19l-.384 1.756a1.75 1.75 0 0 1-2.24 1.293l-1.713-.545a.25.25 0 0 0-.26.07l-1.21 1.328a1.75 1.75 0 0 1-2.588 0l-1.21-1.328a.25.25 0 0 0-.26-.07l-1.713.545a1.75 1.75 0 0 1-2.24-1.293l-.385-1.756a.25.25 0 0 0-.19-.19l-1.756-.384a1.75 1.75 0 0 1-1.293-2.24l.545-1.713a.25.25 0 0 0-.07-.26l-1.328-1.21a1.75 1.75 0 0 1 0-2.588l1.328-1.21a.25.25 0 0 0 .07-.26l-.545-1.713a1.75 1.75 0 0 1 1.293-2.24l1.756-.385a.25.25 0 0 0 .19-.19l.384-1.756a1.75 1.75 0 0 1 2.24-1.293l1.713.545a.25.25 0 0 0 .26-.07zM13 8a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0zm-1 8a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 12 16" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const StatsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-[var(--color-foreground-muted-3)] size-4">
    <path fillRule="evenodd" d="M3.629 19.106c.363.082.82.144 1.371.144a6.3 6.3 0 0 0 1.371-.144c.953-.214 1.379-1.092 1.379-1.853V10c0-3.899-.045-6.27-.073-7.376-.018-.68-.391-1.495-1.275-1.716A5.8 5.8 0 0 0 5 .75c-.578 0-1.042.068-1.402.158-.884.221-1.257 1.035-1.275 1.716A297 297 0 0 0 2.25 10v7.253c0 .761.426 1.64 1.379 1.853m7.436.112q.403.031.935.032.531-.002.935-.032c1.127-.081 1.815-1.046 1.815-2.04V14.5c0-1.284-.022-2.22-.045-2.85-.034-.919-.68-1.778-1.714-1.862A12 12 0 0 0 12 9.75q-.578.002-.99.038c-1.035.084-1.681.943-1.715 1.862-.023.63-.045 1.566-.045 2.85v2.679c0 .993.688 1.958 1.815 2.039M19 19.25c-.442 0-.82-.029-1.136-.07-1.055-.14-1.614-1.072-1.614-1.954V12.5c0-2.398.034-3.98.062-4.868.025-.806.536-1.66 1.515-1.803A8 8 0 0 1 19 5.75c.468 0 .857.033 1.173.079.98.143 1.49.997 1.515 1.803.028.888.062 2.47.062 4.868v4.726c0 .882-.559 1.815-1.614 1.954-.315.041-.694.07-1.136.07m-17 1.5a1.25 1.25 0 0 0 0 2.5h20a1.25 1.25 0 0 0 0-2.5z" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const ChevronRightSmIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-[var(--color-foreground-primary)] size-2">
    <path fillRule="evenodd" d="M4.292 12c0-5.102.22-8.225.41-9.978.08-.718.488-1.307 1.087-1.596.6-.29 1.317-.242 1.927.153 1.175.759 3.026 2.063 5.732 4.244 3.148 2.537 4.837 4.418 5.707 5.563a2.63 2.63 0 0 1 0 3.228c-.87 1.145-2.56 3.025-5.707 5.562-2.706 2.182-4.558 3.487-5.732 4.246-.61.394-1.327.442-1.927.152s-1.008-.878-1.086-1.596c-.191-1.753-.411-4.876-.411-9.978" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const STAT_CARDS = [
  { label: 'account.greatestAchievement', image: 'https://images.thrill.com/thumbnails_webp/rlx_7goldfruits.webp?c=7' },
  { label: 'account.mostFortunateWin', image: 'https://images.thrill.com/thumbnails_webp/rlx_tigerkingdom.webp?c=7' },
  { label: 'account.mostPlayed', image: 'https://images.thrill.com/thumbnails_webp/pgp_sugarsupremepowernudge.webp?c=7' },
  { label: 'account.totalEarnings', image: null },
  { label: 'account.bonusEarnings', image: null },
  { label: 'account.vipRewards', image: null },
];

function formatCurrency(value) {
  return parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ProfilePage() {
  const { t } = useTranslation();

  const username = storage.getKey('name') || localStorage.getItem('name') || 'Guest';
  const email = storage.getKey('email') || localStorage.getItem('email') || '';

  const { data: userData, isLoading: isLoadingUser } = useUserInfo();
  const { data: statsData, isLoading: isLoadingStats } = useBetWinCount();
  const { data: wagerData, isLoading: isLoadingWager } = useWagerCheck();
  const { data: kycData } = useKYCStatus();

  const isLoading = isLoadingUser || isLoadingStats || isLoadingWager;
  const kycStatus = kycData?.status || 'Unverified';
  const isVerified = kycStatus === 'Verified';

  const currentWager = wagerData?.wager || 0;
  const targetWager = wagerData?.target || 0;
  const totalDeposit = wagerData?.total_deposit || 0;
  const remainingWager = Math.max(0, targetWager - currentWager);
  const progressPercentage = targetWager > 0
    ? Math.min(100, (currentWager / targetWager) * 100)
    : 0;

  const stats = statsData || { betCount: 0, winCount: 0 };
  const wagered = userData?.profit || 0;
  const totalBets = stats.betCount || 0;
  const averageWager = totalBets > 0 ? (wagered / totalBets).toFixed(2) : '0.00';

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-10">
      {/* Avatar + User Info */}
      <div className="flex w-full flex-col items-center gap-8 px-4 pb-2 sm:p-0">
        <img
          src="https://thrill.com/core/img/avatar.webp"
          className="size-[84px] rounded-full"
          alt="Avatar"
        />

        <div className="flex w-full max-w-full flex-col items-center gap-4">
          <div className="typ-display-xsmall text-[var(--color-foreground-primary)] font-bold uppercase">
            {username}
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <span className="typ-label-medium text-[var(--color-foreground-muted-1)] font-medium">
              {email || t('account.noEmail')}
            </span>
            {isVerified ? VerifiedBadgeIcon : UnverifiedIcon}
          </div>
        </div>
      </div>

      {/* Request Statistics */}
      <div className="flex w-full flex-col gap-2.5">
        <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] flex flex-col px-5 py-3.5">
          <button className="flex min-h-[24px] items-center gap-3 cursor-pointer">
            {StatsIcon}
            <span className="typ-label-medium text-[var(--color-foreground-primary)] font-semibold">
              {t('account.requestStatistics')}
            </span>
            <div className="ml-auto flex items-center gap-3">
              {ChevronRightSmIcon}
            </div>
          </button>
        </div>
        <p className="text-[10px] text-[var(--color-foreground-muted-3)] px-3 leading-[120%]">
          {t('account.requestStatisticsDesc')}
        </p>
      </div>

      {isLoading ? (
        <div className="flex w-full items-center justify-center py-12">
          <div className="size-8 animate-spin rounded-full border-2 border-[var(--color-foreground-muted-1)] border-t-[var(--color-button-primary)]" />
        </div>
      ) : (
        <>
          {/* Turnover Section */}
          <div className="flex w-full flex-col gap-4">
            <h4 className="text-sm font-bold uppercase text-[var(--color-foreground-primary)] px-1">
              {t('account.turnover')}
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] px-4 py-3.5 flex flex-col gap-1.5">
                <p className="text-xs text-[var(--color-foreground-muted-1)] font-medium">{t('account.totalWager')}</p>
                <p className="text-sm text-[var(--color-foreground-primary)] font-bold">
                  ₹{formatCurrency(currentWager)}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] px-4 py-3.5 flex flex-col gap-1.5">
                <p className="text-xs text-[var(--color-foreground-muted-1)] font-medium">{t('account.requiredWager')}</p>
                <p className="text-sm text-[var(--color-foreground-primary)] font-bold">
                  ₹{formatCurrency(targetWager)}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] px-4 py-3.5 flex flex-col gap-1.5">
                <p className="text-xs text-[var(--color-foreground-muted-1)] font-medium">{t('account.totalDeposit')}</p>
                <p className="text-sm text-[var(--color-foreground-primary)] font-bold">
                  ₹{formatCurrency(totalDeposit)}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] px-4 py-3.5 flex flex-col gap-2">
                <p className="text-xs text-[var(--color-foreground-muted-1)] font-medium">{t('account.progress')}</p>
                <p className="text-[10px] text-[var(--color-foreground-muted-3)]">
                  {t('account.remaining')} ₹{formatCurrency(remainingWager)}
                </p>
                <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-3)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-button-primary)] transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-[var(--color-foreground-muted-3)]">
                  {progressPercentage.toFixed(2)}% {t('account.complete')}
                </p>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="flex w-full flex-col gap-4">
            <h4 className="text-sm font-bold uppercase text-[var(--color-foreground-primary)] px-1">
              {t('account.accountStatistics')}
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] px-4 py-3.5 flex flex-col gap-1.5">
                <p className="text-xs text-[var(--color-foreground-muted-1)] font-medium">{t('account.wagered')}</p>
                <p className="text-sm text-[var(--color-foreground-primary)] font-bold">
                  ₹{formatCurrency(wagered)}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] px-4 py-3.5 flex flex-col gap-1.5">
                <p className="text-xs text-[var(--color-foreground-muted-1)] font-medium">{t('account.totalBets')}</p>
                <p className="text-sm text-[var(--color-foreground-primary)] font-bold">
                  {totalBets}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] px-4 py-3.5 flex flex-col gap-1.5">
                <p className="text-xs text-[var(--color-foreground-muted-1)] font-medium">{t('account.averageWager')}</p>
                <p className="text-sm text-[var(--color-foreground-primary)] font-bold">
                  ₹{formatCurrency(averageWager)}
                </p>
              </div>
              <div className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] px-4 py-3.5 flex flex-col gap-1.5">
                <p className="text-xs text-[var(--color-foreground-muted-1)] font-medium">{t('account.winCount')}</p>
                <p className="text-sm text-[var(--color-foreground-primary)] font-bold">
                  {stats.winCount}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Chart placeholder (blurred) */}
      <div className="bg-[var(--color-surface-2)] rounded-32 pointer-events-none flex w-full justify-center opacity-40 blur-[2px]">
        <div className="w-full h-[200px] sm:h-[260px] flex items-center justify-center">
          <span className="text-[var(--color-foreground-muted-1)] text-sm select-none">
            {t('account.chartComingSoon')}
          </span>
        </div>
      </div>

      {/* Stats cards (blurred placeholder) */}
      <div className="pointer-events-none flex w-full flex-col gap-3 opacity-40 blur-[2px] sm:flex-row sm:flex-wrap sm:gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-24 bg-[var(--color-surface-2)] flex w-full gap-2.5 px-6 py-5 sm:w-[calc(50%-8px)]"
          >
            <div className="flex w-full flex-col gap-4">
              <span className="rounded-[20px] bg-[var(--color-foreground-muted-2)] h-[17px] w-full max-w-[131px]" />
              <span className="text-xs text-[var(--color-foreground-muted-1)] font-medium select-none">
                {t(card.label)}
              </span>
            </div>
            {card.image && (
              <div className="w-full max-w-[42px]">
                <img
                  className="rounded-[10px] aspect-[188/256] size-full select-none"
                  src={card.image}
                  alt={t(card.label)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
