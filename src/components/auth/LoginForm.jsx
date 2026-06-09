import { useState } from 'react';
import { useLogin } from '@/hooks/useLogin.js';
import { Button } from '@/components/Button.jsx';
import { SocialLoginButtons } from './SocialLoginButtons.jsx';
import { useSiteConfig } from '@/context/SiteConfigContext.jsx';
import { staticLogin } from '@/services/auth/staticAuth.js';

/**
 * Login form – email/username + password, socket sign-in, Thrill UI.
 */
export function LoginForm({ onClose, onSwitchToSignup }) {
  const { platformName } = useSiteConfig() || {};
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    showTwoFactorInput,
    twoFactorCode,
    setTwoFactorCode,
    handleTwoFactorSubmit,
    handleGoogleLogin,
    showError,
    showInfo,
  } = useLogin();
  const isLoading = submitting;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.username.trim()) next.username = 'Email or username is required';
    if (!formData.password) next.password = 'Password is required';
    else if (formData.password.length < 6) next.password = 'Password must be at least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError('Please fix the errors below.');
      return;
    }
    setSubmitting(true);
    // Static/dummy login against /api/auth.json (no real backend yet).
    const res = await staticLogin(formData.username, formData.password);
    setSubmitting(false);
    if (res.ok) {
      showInfo?.(`Welcome, ${res.user.name}!`);
      // Header listens to window 'focus' to re-read the session → switches to logged-in UI.
      window.dispatchEvent(new Event('focus'));
      onClose?.();
    } else {
      showError(res.message);
    }
  };

  const on2FASubmit = async (e) => {
    e.preventDefault();
    await handleTwoFactorSubmit(twoFactorCode);
  };

  const inputClass =
    'w-full rounded-xl border bg-[var(--color-surface-2)] px-4 py-3 text-[var(--color-foreground-primary)] ' +
    'placeholder-[var(--color-foreground-muted-1)] outline-none transition-colors ' +
    'border-[var(--color-border)] focus:border-[var(--color-button-primary)]';

  if (showTwoFactorInput) {
    return (
      <form onSubmit={on2FASubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold uppercase text-[var(--color-foreground-primary)]">
          Two-Factor Authentication
        </h2>
        <p className="text-sm text-[var(--color-foreground-muted-1)]">
          Please enter your verification code.
        </p>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--color-foreground-primary)]">
            Verification Code
          </label>
          <input
            type="text"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            placeholder="Enter verification code"
            className={inputClass}
            disabled={isLoading}
            required
          />
        </div>
        <Button type="submit" variant="primary" className="w-full py-3" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <p className="text-[var(--color-foreground-primary)]">Enter Username</p>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter Email Address"
          className={inputClass}
          disabled={isLoading}
          autoComplete="username email"
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <p className="text-sm text-[var(--color-danger)]">{errors.username}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--color-foreground-primary)]">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={inputClass + ' pe-12'}
            disabled={isLoading}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] focus:outline-none disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-[var(--color-danger)]">{errors.password}</p>
        )}
      </div>
      <Button type="submit" variant="primary" className="w-full py-3 uppercase" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Continue'}
      </Button>
      <SocialLoginButtons
        onCustomClick={() => showInfo('Coming soon')}
        onGoogleClick={handleGoogleLogin}
        disabled={isLoading}
      />
      <p className="text-center text-xs text-[var(--color-foreground-muted-1)]">
        By continuing, you agree to {platformName || 'thrill'}'s{' '}
        <a href="/terms" className="underline hover:opacity-90">Terms of Service</a>
        {' and '}
        <a href="/privacy" className="underline hover:opacity-90">Privacy Policy</a>.
      </p>
      {onSwitchToSignup && (
        <p className="text-center text-sm text-[var(--color-foreground-muted-1)]">
          Don&apos;t have an account?{' '}
          <a href="/signup" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }} className="font-medium text-[var(--color-button-primary)] underline hover:opacity-90">
            Sign up
          </a>
        </p>
      )}
    </form>
  );
}

export default LoginForm;
