import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks/useRegister.js';
import { useLogin } from '@/hooks/useLogin.js';
import { Button } from '@/components/Button.jsx';
import { SocialLoginButtons } from './SocialLoginButtons.jsx';
import { useSiteConfig } from '@/context/SiteConfigContext.jsx';

const inputClass =
  'w-full rounded-xl border bg-[var(--color-surface-2)] px-4 py-3 text-[var(--color-foreground-primary)] ' +
  'placeholder-[var(--color-foreground-muted-1)] outline-none transition-colors ' +
  'border-[var(--color-border)] focus:border-[var(--color-button-primary)]';

const eyeSvg = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const eyeOffSvg = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function PasswordInput({ name, value, onChange, placeholder, error, disabled, showPassword, onToggleShow }) {
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClass + ' pe-12'}
        disabled={disabled}
        aria-invalid={!!error}
      />
      <button
        type="button"
        onClick={onToggleShow}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)] focus:outline-none disabled:opacity-50"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? eyeOffSvg : eyeSvg}
      </button>
    </div>
  );
}

/**
 * Register form – four stages.
 * Step 1: Email only + CONTINUE.
 * Step 2: Username only + CONTINUE.
 * Step 3: Password + Confirm + CONTINUE.
 * Step 4: Referral code, privacy/terms acceptance, Sign Up, Google.
 */
export function RegisterForm({ onSwitchToSignin }) {
  const navigate = useNavigate();
  const { platformName } = useSiteConfig() || {};
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referral: '',
    ruleChecked: false,
    marketingChecked: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    isLoading,
    showOtpSection,
    otp,
    setOtp,
    resendTimer,
    sendOtp,
    verifyOtp,
    resendOtp,
    handleRegisterSubmit,
    showError,
  } = useRegister();
  const { handleGoogleLogin, showInfo } = useLogin();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const next = {};
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Please enter a valid email';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2Username = () => {
    const next = {};
    if (formData.username.trim()) {
      if (formData.username.length < 5) next.username = 'Username must be at least 5 characters';
      else if (formData.username.length > 16) next.username = 'Username must be less than 16 characters';
      else if (formData.email && formData.email.split('@')[0].toLowerCase() === formData.username.toLowerCase()) {
        next.username = 'Username and email name cannot be the same';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep3 = () => {
    const next = {};
    if (!formData.password) next.password = 'Password is required';
    else if (formData.password.length < 8) next.password = 'Password must be at least 8 characters';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      next.password = 'Password must contain uppercase, lowercase, number, and special character';
    }
    if (!formData.confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep4 = () => {
    const next = {};
    if (!formData.ruleChecked) next.ruleChecked = 'You must agree to the Terms of Service';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onStep1Submit = (e) => {
    e.preventDefault();
    if (!validateStep1()) {
      showError('Please enter a valid email address.');
      return;
    }
    setStep(2);
  };

  const onStep2Submit = (e) => {
    e.preventDefault();
    if (!validateStep2Username()) {
      showError('Please fix the username.');
      return;
    }
    setStep(3);
  };

  const onStep3Submit = (e) => {
    e.preventDefault();
    if (!validateStep3()) {
      showError('Please fix the errors below.');
      return;
    }
    setStep(4);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep4()) {
      showError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    await handleRegisterSubmit(formData);
  };

  const handleOtpSubmit = async (e) => {
    e?.preventDefault();
    await verifyOtp(formData.email, otp);
  };

  const toggleShow = (setter) => () => setter((v) => !v);

  // —— Step 1: Email only (like thrill first screen) ——
  if (step === 1) {
    return (
      <form onSubmit={onStep1Submit} className="flex flex-col gap-5">
        <p className="text-[var(--color-foreground-primary)]">Enter your email address:</p>
        <div className="flex flex-col gap-2">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email Address"
            className={inputClass}
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-sm text-[var(--color-danger)]">{errors.email}</p>}
        </div>
        <Button type="submit" variant="primary" className="w-full py-3 uppercase">
          Continue
        </Button>
        <p className="text-center text-xs text-[var(--color-foreground-muted-1)]">
          By continuing, you agree to {platformName || 'thrill'}'s{' '}
          <a href="/terms" className="underline hover:opacity-90">Terms of Service</a>
          {' and '}
          <a href="/privacy" className="underline hover:opacity-90">Privacy Policy</a>.
        </p>
      </form>
    );
  }

  // —— Step 2: Username only ——
  if (step === 2) {
    return (
      <form onSubmit={onStep2Submit} className="flex flex-col gap-5">
       
        <p className="text-[var(--color-foreground-primary)]">Choose a username:</p>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username (5–16 characters)"
            className={inputClass}
            autoComplete="username"
            aria-invalid={!!errors.username}
          />
          {errors.username && <p className="text-sm text-[var(--color-danger)]">{errors.username}</p>}
          <p className="text-xs text-[var(--color-foreground-muted-1)]">Optional. Leave blank to use your email.</p>
        </div>
        <Button type="submit" variant="primary" className="w-full py-3 uppercase">
          Continue
        </Button>
      </form>
    );
  }

  // —— Step 3: Password + Confirm password only ——
  if (step === 3) {
    return (
      <form onSubmit={onStep3Submit} className="flex flex-col gap-5">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="-mt-1 mb-1 self-start text-xs text-[var(--color-foreground-muted-1)] underline hover:text-[var(--color-foreground-primary)]"
        >
          ← Change username
        </button>
        <p className="text-[var(--color-foreground-primary)]">Create a password:</p>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--color-foreground-primary)]">Password</label>
          <PasswordInput
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password (min 8 characters)"
            error={errors.password}
            showPassword={showPassword}
            onToggleShow={toggleShow(setShowPassword)}
          />
          {errors.password && <p className="text-sm text-[var(--color-danger)]">{errors.password}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--color-foreground-primary)]">Confirm Password</label>
          <PasswordInput
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            showPassword={showConfirmPassword}
            onToggleShow={toggleShow(setShowConfirmPassword)}
          />
          {errors.confirmPassword && <p className="text-sm text-[var(--color-danger)]">{errors.confirmPassword}</p>}
        </div>
        <Button type="submit" variant="primary" className="w-full py-3 uppercase">
          Continue
        </Button>
      </form>
    );
  }

  // —— Step 4: Referral code + privacy acceptance + Sign Up ——
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setStep(3)}
        className="-mt-1 mb-1 self-start text-xs text-[var(--color-foreground-muted-1)] underline hover:text-[var(--color-foreground-primary)]"
      >
        ← Change password
      </button>
      <h2 className="text-xl font-semibold uppercase text-[var(--color-foreground-primary)]">Sign Up</h2>
      <p className="text-sm text-[var(--color-foreground-muted-1)]">Almost done. Add a referral code (optional) and accept the terms.</p>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--color-foreground-primary)]">Referral code (optional)</label>
        <input
          type="text"
          name="referral"
          value={formData.referral}
          onChange={handleChange}
          placeholder="Enter referral code"
          className={inputClass}
          disabled={isLoading}
        />
      </div>

      <p className="text-xs text-[var(--color-foreground-muted-1)]">Email: {formData.email}</p>

      {showOtpSection && (
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <p className="text-sm text-[var(--color-foreground-primary)]">We sent a verification code to your email.</p>
          <button
            type="button"
            onClick={() => resendOtp(formData.email)}
            disabled={resendTimer > 0 || isLoading}
            className="text-sm text-[var(--color-button-primary)] hover:underline disabled:opacity-50"
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </button>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--color-foreground-primary)]">Verification code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter verification code"
              className={inputClass}
              disabled={isLoading}
            />
          </div>
          <Button type="button" variant="secondary" className="w-full py-3" onClick={handleOtpSubmit} disabled={isLoading || !otp}>
            Verify OTP
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            name="ruleChecked"
            checked={formData.ruleChecked}
            onChange={handleChange}
            className="mt-1 rounded border-[var(--color-border)]"
            disabled={isLoading}
          />
          <span className="text-sm text-[var(--color-foreground-muted-1)]">
            I agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-90">Terms of Service</a>
            {' and '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-90">Privacy Policy</a>
          </span>
        </label>
        {errors.ruleChecked && <p className="text-sm text-[var(--color-danger)]">{errors.ruleChecked}</p>}
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          name="marketingChecked"
          checked={formData.marketingChecked}
          onChange={handleChange}
          className="mt-1 rounded border-[var(--color-border)]"
          disabled={isLoading}
        />
        <span className="text-sm text-[var(--color-foreground-muted-1)]">I agree to receive marketing communications</span>
      </div>

      <Button type="submit" variant="primary" className="w-full py-3 uppercase" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </Button>
      <SocialLoginButtons
        onCustomClick={() => showInfo('Coming soon')}
        onGoogleClick={handleGoogleLogin}
        disabled={isLoading}
      />
      <p className="text-center text-sm text-[var(--color-foreground-muted-1)]">
        Already have an account?{' '}
        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            onSwitchToSignin?.();
            navigate('/login');
          }}
          className="font-medium text-[var(--color-button-primary)] underline hover:opacity-90"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}

export default RegisterForm;
