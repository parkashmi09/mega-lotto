import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Social login section: "or continue with" + custom icon button + Google button.
 * Renders below the main form in LoginForm and RegisterForm.
 */

/** Custom icon from user (Discord-style). */
function CustomIconButton() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="shrink-0" aria-hidden>
      <path
        fillRule="evenodd"
        d="M18.703 2.098C16.606.904 14.62.45 12.333.504 5.87.49 1.5 5.546 1.5 11.994S5.89 23.5 12.27 23.5c3.158 0 5.728-1.132 7.506-3.056 1.774-1.92 2.724-4.587 2.724-7.604q0-.468-.008-.844a2.48 2.48 0 0 0-2.27-2.452 33 33 0 0 0-3.333-.139 34 34 0 0 0-3.76.217 1.79 1.79 0 0 0-1.578 1.646c-.025.315-.043.668-.038 1.002.003.264.026.532.055.78.117.97.97 1.594 1.876 1.594h3.502c-.243 2.184-2.35 3.935-4.63 3.726l-.046-.002c-1.73 0-2.984-.726-3.82-1.862-.85-1.153-1.288-2.758-1.288-4.512 0-1.747.469-3.353 1.336-4.51.857-1.142 2.114-1.865 3.772-1.865h.017a6.36 6.36 0 0 1 3.841 1.141c.746.522 1.977.617 2.615-.31.459-.666.818-1.373.998-2.18.204-.911-.307-1.755-1.038-2.172"
        clipRule="evenodd"
        fill="currentColor"
        stroke="transparent"
      />
    </svg>
  );
}

/** Google G icon. */
function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

const socialButtonBase =
  'rounded-full aspect-square w-12 h-12 flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-foreground-primary)] hover:bg-[var(--color-surface-3)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-button-primary)] disabled:opacity-50';

export function SocialLoginButtons({ onCustomClick, onGoogleClick, disabled }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
        <span className="text-xs font-medium uppercase text-[var(--color-foreground-muted-1)]">{t('auth.orContinueWith', 'or continue with')}</span>
        <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
      </div>
      <div className="flex items-center justify-center gap-4">
        {/* <button
          type="button"
          onClick={onCustomClick}
          disabled={disabled}
          className={socialButtonBase}
          aria-label="Continue with Discord"
        >
          <CustomIconButton />
        </button> */}
        <button
          type="button"
          onClick={onGoogleClick}
          disabled={disabled}
          className={`${socialButtonBase} flex items-center justify-center gap-2 px-4 w-auto min-w-[12rem]`}
          aria-label={t('auth.continueWithGoogle', 'Continue with Google')}
        >
          <GoogleIcon />
          <span className="text-sm font-medium uppercase">{t('auth.google', 'Google')}</span>
        </button>
      </div>
    </div>
  );
}

export default SocialLoginButtons;
