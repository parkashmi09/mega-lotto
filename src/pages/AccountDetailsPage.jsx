import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { storage } from '@/utils';
import { useKYCStatus } from '@/hooks';

/* ── SVG Icons ── */
const GoogleIcon = (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-[18px]">
    <mask id="gm0" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="3" width="7" height="12"><path d="M0.567 3.9H6.456V14.1H0.567V3.9Z" fill="white" /></mask>
    <g mask="url(#gm0)"><mask id="gm1" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18"><path d="M17.222 7.432H9.188v3.33h4.625c-.431 2.117-2.234 3.331-4.625 3.331-2.821 0-5.094-2.272-5.094-5.094 0-2.821 2.273-5.094 5.094-5.094 1.215 0 2.312.431 3.175 1.137l2.508-2.508C13.342 1.201 11.383.378 9.188.378 4.407.378.567 4.219.567 9c0 4.78 3.84 8.62 8.621 8.62 4.311 0 8.23-3.135 8.23-8.62 0-.51-.079-1.058-.196-1.568Z" fill="white" /></mask><g mask="url(#gm1)"><path d="M-0.217 14.094V3.905L6.445 9-0.217 14.094Z" fill="#FBBC05" /></g></g>
    <mask id="gm2" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="9"><path d="M0.567 0.372H17.418V9H0.567V0.372Z" fill="white" /></mask>
    <g mask="url(#gm2)"><mask id="gm3" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18"><path d="M17.222 7.432H9.188v3.33h4.625c-.431 2.117-2.234 3.331-4.625 3.331-2.821 0-5.094-2.272-5.094-5.094 0-2.821 2.273-5.094 5.094-5.094 1.215 0 2.312.431 3.175 1.137l2.508-2.508C13.342 1.201 11.383.378 9.188.378 4.407.378.567 4.219.567 9c0 4.78 3.84 8.62 8.621 8.62 4.311 0 8.23-3.135 8.23-8.62 0-.51-.079-1.058-.196-1.568Z" fill="white" /></mask><g mask="url(#gm3)"><path d="M-0.217 3.905L6.445 9l2.743-2.39L18.594 5.08V-0.405H-0.217V3.905Z" fill="#EA4335" /></g></g>
    <mask id="gm4" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18"><path d="M0.567 0.372H17.418V17.62H0.567V0.372Z" fill="white" /></mask>
    <g mask="url(#gm4)"><mask id="gm5" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18"><path d="M17.222 7.432H9.188v3.33h4.625c-.431 2.117-2.234 3.331-4.625 3.331-2.821 0-5.094-2.272-5.094-5.094 0-2.821 2.273-5.094 5.094-5.094 1.215 0 2.312.431 3.175 1.137l2.508-2.508C13.342 1.201 11.383.378 9.188.378 4.407.378.567 4.219.567 9c0 4.78 3.84 8.62 8.621 8.62 4.311 0 8.23-3.135 8.23-8.62 0-.51-.079-1.058-.196-1.568Z" fill="white" /></mask><g mask="url(#gm5)"><path d="M-0.217 14.094L11.54 5.081l3.096.392L18.594-0.405V18.404H-0.217V14.094Z" fill="#34A853" /></g></g>
    <mask id="gm6" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="4" y="3" width="14" height="15"><path d="M4.872 3.9H17.418V17.62H4.872V3.9Z" fill="white" /></mask>
    <g mask="url(#gm6)"><mask id="gm7" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18"><path d="M17.222 7.432H9.188v3.33h4.625c-.431 2.117-2.234 3.331-4.625 3.331-2.821 0-5.094-2.272-5.094-5.094 0-2.821 2.273-5.094 5.094-5.094 1.215 0 2.312.431 3.175 1.137l2.508-2.508C13.342 1.201 11.383.378 9.188.378 4.407.378.567 4.219.567 9c0 4.78 3.84 8.62 8.621 8.62 4.311 0 8.23-3.135 8.23-8.62 0-.51-.079-1.058-.196-1.568Z" fill="white" /></mask><g mask="url(#gm7)"><path d="M18.594 18.404L6.445 9l-1.568-1.176L18.594 3.905V18.404Z" fill="#4285F4" /></g></g>
  </svg>
);

const VerifiedBadgeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-[var(--color-button-primary)] size-3.5 shrink-0">
    <path fillRule="evenodd" d="M10.706.806a1.75 1.75 0 0 1 2.587 0l1.21 1.328a.25.25 0 0 0 .261.07l1.712-.545a1.75 1.75 0 0 1 2.24 1.293l.385 1.756a.25.25 0 0 0 .19.19l1.756.384a1.75 1.75 0 0 1 1.293 2.24l-.545 1.713a.25.25 0 0 0 .07.26l1.328 1.21a1.75 1.75 0 0 1 0 2.588l-1.328 1.21a.25.25 0 0 0-.07.261l.545 1.712a1.75 1.75 0 0 1-1.293 2.24l-1.756.385a.25.25 0 0 0-.19.19l-.384 1.756a1.75 1.75 0 0 1-2.24 1.293l-1.713-.545a.25.25 0 0 0-.26.07l-1.21 1.328a1.75 1.75 0 0 1-2.588 0l-1.21-1.328a.25.25 0 0 0-.26-.07l-1.713.545a1.75 1.75 0 0 1-2.24-1.293l-.385-1.756a.25.25 0 0 0-.19-.19l-1.756-.384a1.75 1.75 0 0 1-1.293-2.24l.545-1.713a.25.25 0 0 0-.07-.26l-1.328-1.21a1.75 1.75 0 0 1 0-2.588l1.328-1.21a.25.25 0 0 0 .07-.26l-.545-1.713a1.75 1.75 0 0 1 1.293-2.24l1.756-.385a.25.25 0 0 0 .19-.19l.384-1.756a1.75 1.75 0 0 1 2.24-1.293l1.713.545a.25.25 0 0 0 .26-.07zm6.866 8.505c.269-.411.334-.945.043-1.341a3.9 3.9 0 0 0-1.207-1.059c-.54-.312-1.186-.074-1.545.435-2.191 3.112-3.556 5.132-3.556 5.132s-.82-1.02-2.184-2.487c-.474-.51-1.242-.611-1.766-.155a6.5 6.5 0 0 0-.865.902c-.348.449-.275 1.07.082 1.511a48 48 0 0 0 3.585 3.957c.755.745 1.94.683 2.605-.144 1.015-1.264 2.642-3.427 4.808-6.75" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const UnverifiedIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-[var(--color-foreground-muted-1)] size-3.5 shrink-0">
    <path fillRule="evenodd" d="M10.706.806a1.75 1.75 0 0 1 2.587 0l1.21 1.328a.25.25 0 0 0 .261.07l1.712-.545a1.75 1.75 0 0 1 2.24 1.293l.385 1.756a.25.25 0 0 0 .19.19l1.756.384a1.75 1.75 0 0 1 1.293 2.24l-.545 1.713a.25.25 0 0 0 .07.26l1.328 1.21a1.75 1.75 0 0 1 0 2.588l-1.328 1.21a.25.25 0 0 0-.07.261l.545 1.712a1.75 1.75 0 0 1-1.293 2.24l-1.756.385a.25.25 0 0 0-.19.19l-.384 1.756a1.75 1.75 0 0 1-2.24 1.293l-1.713-.545a.25.25 0 0 0-.26.07l-1.21 1.328a1.75 1.75 0 0 1-2.588 0l-1.21-1.328a.25.25 0 0 0-.26-.07l-1.713.545a1.75 1.75 0 0 1-2.24-1.293l-.385-1.756a.25.25 0 0 0-.19-.19l-1.756-.384a1.75 1.75 0 0 1-1.293-2.24l.545-1.713a.25.25 0 0 0-.07-.26l-1.328-1.21a1.75 1.75 0 0 1 0-2.588l1.328-1.21a.25.25 0 0 0 .07-.26l-.545-1.713a1.75 1.75 0 0 1 1.293-2.24l1.756-.385a.25.25 0 0 0 .19-.19l.384-1.756a1.75 1.75 0 0 1 2.24-1.293l1.713.545a.25.25 0 0 0 .26-.07zM13 8a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0zm-1 8a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 12 16" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const PhoneIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-[var(--color-foreground-muted-3)] size-4 shrink-0">
    <path fillRule="evenodd" d="M6.394 23.513c1.264.123 3.108.237 5.606.237 2.499 0 4.342-.114 5.606-.237 1.645-.161 2.832-1.48 2.93-3.09.103-1.697.214-4.45.214-8.423s-.111-6.725-.215-8.423c-.097-1.61-1.283-2.929-2.929-3.09C16.342.364 14.498.25 12 .25S7.658.364 6.394.487c-1.646.161-2.832 1.48-2.93 3.09C3.362 5.275 3.25 8.027 3.25 12s.111 6.726.215 8.423c.097 1.61 1.283 2.929 2.929 3.09M12 21.5c-2.555 0-4.32-.131-5.402-.251-.472-.053-.833-.429-.867-.942-.1-1.528-.231-4.303-.231-8.307s.132-6.779.231-8.307c.034-.513.395-.89.867-.942a39 39 0 0 1 2.351-.18l.155.772A1.75 1.75 0 0 0 10.82 4.75h2.36a1.75 1.75 0 0 0 1.716-1.407l.155-.773c.992.049 1.77.117 2.35.181.473.053.834.429.868.942.1 1.528.231 4.303.231 8.307s-.132 6.779-.231 8.307c-.034.513-.395.89-.867.942-1.082.12-2.847.251-5.402.251m-1-3a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2z" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const TelegramIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-[var(--color-foreground-muted-3)] size-4 shrink-0">
    <path fillRule="evenodd" d="M22.497 1.943C22.534 1.25 21.966.664 21.25.76c-2.626.354-6.82 1.889-10.836 3.646C6.39 6.166 2.508 8.168.496 9.474c-.379.246-.54.638-.486 1.018.053.375.31.716.713.886l5.788 2.444a.75.75 0 0 0 .76-.106l.306-.245c1.944-1.555 4.538-3.631 6.696-5.27 1.08-.82 2.046-1.528 2.765-2.005.333-.222.607-.39.812-.496q-.06.1-.144.23c-.25.375-.645.888-1.146 1.5-1 1.22-2.396 2.81-3.83 4.441v.001a331 331 0 0 0-2.97 3.41.75.75 0 0 0 .044 1.019l6.71 6.609c.24.236.556.36.864.338a.94.94 0 0 0 .776-.513c.477-.91.968-2.338 1.438-4.034.473-1.7.93-3.688 1.336-5.727.814-4.076 1.43-8.376 1.57-11.03" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

const ChevronRightIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="text-[var(--color-foreground-primary)] size-2 shrink-0">
    <path fillRule="evenodd" d="M4.292 12c0-5.102.22-8.225.41-9.978.08-.718.488-1.307 1.087-1.596.6-.29 1.317-.242 1.927.153 1.175.759 3.026 2.063 5.732 4.244 3.148 2.537 4.837 4.418 5.707 5.563a2.63 2.63 0 0 1 0 3.228c-.87 1.145-2.56 3.025-5.707 5.562-2.706 2.182-4.558 3.487-5.732 4.246-.61.394-1.327.442-1.927.152s-1.008-.878-1.086-1.596c-.191-1.753-.411-4.876-.411-9.978" clipRule="evenodd" className="fill-current stroke-transparent" />
  </svg>
);

export function AccountDetailsPage() {
  const { t } = useTranslation();
  const email = storage.getKey('email') || localStorage.getItem('email') || '';
  const { data: kycData } = useKYCStatus();
  const isVerified = kycData?.status === 'Verified';

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Account Email Section */}
      <div className="flex flex-col gap-2 sm:gap-2.5">
        <div className="px-4 py-2 text-[var(--color-foreground-secondary)] typ-label-medium font-extrabold uppercase">
          {t('accountDetails.accountEmail')}
        </div>

        <section
          className="rounded-[20px] bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] px-5 py-3.5 flex items-center gap-3"
          aria-label={t('accountDetails.accountEmail')}
        >
          {/* Google icon circle */}
          <div className="size-[42px] shrink-0 rounded-full bg-[var(--color-surface-2)] sm:bg-[var(--color-surface-3)] grid place-content-center">
            {GoogleIcon}
          </div>

          {/* Email info */}
          <div className="flex min-w-0 grow flex-col gap-2">
            <div className="typ-label-medium text-[var(--color-foreground-primary)] font-semibold">
              Google
            </div>
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="typ-label-medium text-[var(--color-foreground-muted-3)] font-normal truncate min-w-0">
                {email || t('account.noEmail')}
              </span>
              {isVerified ? VerifiedBadgeIcon : UnverifiedIcon}
            </div>
          </div>

          {/* Verified badge button */}
          <button
            type="button"
            disabled
            className="tActionButton tActionButton--with-text tActionButton--secondary tActionButton--small min-w-max disabled:cursor-auto disabled:opacity-30"
          >
            <div className="tActionButton__container rounded-40 flex items-center justify-center w-full">
              <div className="tActionButton__content flex items-center justify-center">
                <span className="tActionButton__text whitespace-nowrap uppercase">
                  {isVerified ? t('accountDetails.verified') : t('accountDetails.unverified')}
                </span>
              </div>
            </div>
          </button>
        </section>
      </div>

      {/* Contact Info Section */}
      <div className="flex flex-col gap-2 sm:gap-2.5">
        <div className="px-4 py-2 text-[var(--color-foreground-secondary)] typ-label-medium font-extrabold uppercase">
          {t('accountDetails.contactInfo')}
        </div>

        <div className="flex flex-col gap-6">
          {/* Phone Number */}
          <div>
            <div className="bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] rounded-[20px] flex flex-col gap-4 px-5 py-3.5">
              <Link
                to="/account/details/phone"
                className="flex min-h-[24px] items-center gap-3 cursor-pointer text-[var(--color-foreground-primary)] font-semibold"
              >
                {PhoneIcon}
                <span className="typ-label-medium shrink-0">{t('accountDetails.phoneNumber')}</span>
                <div className="ml-auto flex min-w-0 items-center gap-3">
                  {ChevronRightIcon}
                </div>
              </Link>
            </div>
            <p className="typ-label-medium font-normal text-[var(--color-foreground-muted-3)] px-3 pt-3 text-xs leading-[120%]">
              {t('accountDetails.jurisdictionNote')}
            </p>
          </div>

          {/* Telegram Handle */}
          <div className="bg-[var(--color-surface-1)] sm:bg-[var(--color-surface-2)] rounded-[20px] flex flex-col gap-4 px-5 py-3.5">
            <Link
              to="/account/details/telegram"
              className="flex min-h-[24px] items-center gap-3 cursor-pointer text-[var(--color-foreground-primary)] font-semibold"
            >
              {TelegramIcon}
              <span className="typ-label-medium shrink-0">{t('accountDetails.telegramHandle')}</span>
              <div className="ml-auto flex min-w-0 items-center gap-3">
                {ChevronRightIcon}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetailsPage;
