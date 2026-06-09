/**
 * useRegister – sign-up via socket (REGISTER_USER), same contract as jackopot.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { C } from '@/constants';
import { encode, decode, storage, wait, connect, getSocket, isEmail } from '@/utils';
import { useToast } from '@/hooks/useToast.js';

const API_BASE = import.meta.env.VITE_THRILL_API_BASE_URL || 'https://apithrill.codefactory.games';

export function useRegister() {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const resendTimerIntervalRef = useRef(null);

  const verifyReferralCode = async (referral) => {
    if (!referral?.trim()) return true;
    try {
      const res = await fetch(`${API_BASE}/verify-referral-code/${encodeURIComponent(referral)}`);
      const data = await res.json();
      return data.valid === true;
    } catch (err) {
      console.error('Error verifying referral code:', err);
      return false;
    }
  };

  const startResendTimer = () => {
    if (resendTimerIntervalRef.current) clearInterval(resendTimerIntervalRef.current);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          resendTimerIntervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    resendTimerIntervalRef.current = interval;
  };

  const sendOtp = async (email) => {
    if (!email) {
      showError('Please enter an email address');
      return false;
    }
    if (!isEmail(email)) {
      showError('Please enter a valid email address');
      return false;
    }
    try {
      const res = await fetch(`${API_BASE}/email/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'register' }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setShowOtpSection(true);
        setResendTimer(30);
        startResendTimer();
        showSuccess('OTP sent to your email. Check Junk or Spam if needed.');
        return true;
      }
      showError(data.error || 'Failed to send OTP');
      return false;
    } catch (err) {
      console.error('Error sending OTP:', err);
      showError('An error occurred while sending OTP');
      return false;
    }
  };

  const verifyOtp = async (email, otpCode) => {
    if (!otpCode) {
      showError('Please enter the OTP');
      return false;
    }
    try {
      const res = await fetch(`${API_BASE}/email/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode, purpose: 'register' }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        setShowOtpSection(false);
        if (resendTimerIntervalRef.current) {
          clearInterval(resendTimerIntervalRef.current);
          resendTimerIntervalRef.current = null;
        }
        showSuccess('Email verified successfully!');
        return true;
      }
      showError(data.error || 'Invalid OTP');
      return false;
    } catch (err) {
      console.error('Error verifying OTP:', err);
      showError('An error occurred while verifying OTP');
      return false;
    }
  };

  const resendOtp = async (email) => {
    if (resendTimer > 0) {
      showInfo(`Please wait ${resendTimer} seconds before requesting another OTP`);
      return false;
    }
    try {
      const res = await fetch(`${API_BASE}/email/otp/resend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'register' }),
      });
      const data = await res.json();
      if (data.success) {
        setResendTimer(30);
        startResendTimer();
        showSuccess('OTP resent successfully');
        return true;
      }
      showError(data.error || 'Failed to resend OTP');
      return false;
    } catch (err) {
      console.error('Error resending OTP:', err);
      showError('An error occurred while resending OTP');
      return false;
    }
  };

  const setRegister = (data) => {
    if (data.error) {
      setIsLoading(false);
      showError(data.error);
      return;
    }
    if (data.status) {
      setIsLoading(false);
      showSuccess('Registration successful!');
      wait(1000).then(() => {
        const currentSocket = getSocket();
        if (currentSocket) {
          currentSocket.emit(C.LOGIN_USER, encode({
            username: data.name,
            password: data.password,
            recaptcha: 'google',
          }));
        }
      });
    }
  };

  useEffect(() => {
    let currentSocket = getSocket();
    if (!currentSocket) currentSocket = connect(storage.getKey('token'));
    if (currentSocket) {
      currentSocket.on(C.REGISTER_USER, (raw) => {
        const decoded = decode(raw);
        setRegister(decoded);
      });
    }
    return () => {
      if (currentSocket) currentSocket.off(C.REGISTER_USER);
      if (resendTimerIntervalRef.current) clearInterval(resendTimerIntervalRef.current);
    };
  }, []);

  const finalizeRegistration = async (formData) => {
    const { username, email, password, phoneNumber, referral, country } = formData;

    if (referral?.trim()) {
      const verified = await verifyReferralCode(referral);
      if (!verified) {
        showError('Please enter a valid referral code');
        return false;
      }
    }

    const registrationData = {
      username: username || '',
      password,
      email,
      phone: phoneNumber || '',
      method: true,
      refree: referral || '',
      country: country || '',
      aff: storage.getKey('aff') || null,
    };

    const currentSocket = getSocket();
    if (!currentSocket) {
      showError('Connection error. Please refresh the page.');
      return false;
    }

    try {
      currentSocket.emit(C.REGISTER_USER, encode(registrationData));
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      showError('An error occurred during registration. Please try again.');
      return false;
    }
  };

  const handleRegisterSubmit = async (formData) => {
    const { username, email, password, ruleChecked } = formData;

    if (!email || !password || !ruleChecked) {
      showError('Email, password, and Terms of Service agreement are required');
      return false;
    }
    if (!isEmail(email)) {
      showError('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      showError('Password must be at least 8 characters long');
      return false;
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!strongPasswordRegex.test(password)) {
      showError('Password must contain uppercase, lowercase, number, and special character');
      return false;
    }
    if (username?.trim()) {
      if (username.length < 5) {
        showError('Username must be at least 5 characters');
        return false;
      }
      if (username.length > 16) {
        showError('Username must be 16 characters or less');
        return false;
      }
      const emailLocal = email.split('@')[0];
      if (emailLocal.toLowerCase() === username.toLowerCase()) {
        showError('Username and email name cannot be the same');
        return false;
      }
    }

    setIsLoading(true);
    return await finalizeRegistration(formData);
  };

  return {
    isLoading,
    setIsLoading,
    showOtpSection,
    setShowOtpSection,
    otp,
    setOtp,
    otpSent,
    otpVerified,
    resendTimer,
    sendOtp,
    verifyOtp,
    resendOtp,
    handleRegisterSubmit,
    showError,
    showInfo,
  };
}

export default useRegister;
