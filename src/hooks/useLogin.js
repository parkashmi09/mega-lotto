/**
 * useLogin – sign-in via socket (LOGIN_USER), cookies and storage set on success.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { C, COOKIE_KEYS, SESSION_EXPIRY_DAYS } from '@/constants';
import { encode, decode, storage, wait, connect, getSocket } from '@/utils';
import { useToast } from '@/hooks/useToast.js';

export function useLogin() {
  const navigate = useNavigate();
  const { showSuccess, showError, showInfo } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactorInput, setShowTwoFactorInput] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [tempLoginData, setTempLoginData] = useState(null);
  const loginTimeoutRef = useRef(null);

  const setLogin = (data) => {
    if (data.status === true) {
      showSuccess('Login successful! Redirecting...');
      Cookies.set(COOKIE_KEYS.SESSION, data.token, { expires: SESSION_EXPIRY_DAYS });
      Cookies.set(COOKIE_KEYS.UID, data.uid);
      storage.setKey('logged', true);
      storage.setKey('token', data.token);
      storage.setKey('name', data.name);
      storage.setKey('avatar', data.avatar);
      storage.setKey('email', data.email);
      storage.setKey('credit', data.credit);
      storage.setKey('room', data.room);
      storage.setKey('friends', data.friends);
      storage.setKey('country', data.country);
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    } else {
      setIsLoading(false);
      showError(data.status || 'Login failed. Please try again.');
    }
  };

  const check2FAStatus = async (uid) => {
    try {
      const base = import.meta.env.VITE_THRILL_API_BASE_URL || 'https://apithrill.codefactory.games';
      const res = await fetch(`${base}/2fa/status/${uid}`);
      const data = await res.json();
      return data.isEnabled === true;
    } catch (err) {
      console.error('Error checking 2FA status:', err);
      return false;
    }
  };

  const handleLoginResponse = async (data) => {
    if (loginTimeoutRef.current) {
      clearTimeout(loginTimeoutRef.current);
      loginTimeoutRef.current = null;
    }
    if (!data || typeof data !== 'object') {
      setIsLoading(false);
      showError('Invalid response from server. Please try again.');
      return;
    }
    if (data.status === true) {
      try {
        const is2FAEnabled = await check2FAStatus(data.uid);
        if (is2FAEnabled) {
          setShowTwoFactorInput(true);
          setTempLoginData(data);
          setIsLoading(false);
        } else {
          setLogin(data);
        }
      } catch (err) {
        setIsLoading(false);
        showError('Error verifying account security');
      }
    } else {
      setIsLoading(false);
      showError(data.status || 'Login failed. Please try again.');
    }
  };

  useEffect(() => {
    let currentSocket = getSocket();
    if (!currentSocket) {
      currentSocket = connect(storage.getKey('token'));
    }
    if (currentSocket) {
      currentSocket.on(C.LOGIN_USER, (raw) => {
        const decoded = decode(raw);
        handleLoginResponse(decoded);
      });
      currentSocket.on(C.LOGIN_USER_GOOGLE, (raw) => {
        const decoded = decode(raw);
        handleLoginResponse(decoded);
      });
    }
    return () => {
      if (currentSocket) {
        currentSocket.off(C.LOGIN_USER);
        currentSocket.off(C.LOGIN_USER_GOOGLE);
      }
    };
  }, []);

  const handleTwoFactorSubmit = async (code) => {
    if (!code) {
      showError('Please enter verification code');
      return false;
    }
    setIsLoading(true);
    try {
      const base = import.meta.env.VITE_THRILL_API_BASE_URL || 'https://apithrill.codefactory.games';
      const res = await fetch(`${base}/2fa/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: tempLoginData.uid, token: code }),
      });
      const data = await res.json();
      if (data.success) {
        setLogin({ ...tempLoginData, status: true });
        return true;
      }
      setIsLoading(false);
      showError('Invalid verification code');
      return false;
    } catch (err) {
      setIsLoading(false);
      showError('Failed to verify code');
      return false;
    }
  };

  const handleLoginSubmit = async (username, password) => {
    setIsLoading(true);
    loginTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      showError('Login request timed out. Please check your connection and try again.');
    }, 15000);

    let currentSocket = getSocket();
    if (!currentSocket) {
      currentSocket = connect(storage.getKey('token'));
    }
    if (!currentSocket) {
      setIsLoading(false);
      showError('Connection error. Please refresh the page.');
      return false;
    }
    try {
      await wait(200);
      const payload = {
        username: username.toLowerCase(),
        password,
        recaptcha: 'google',
      };
      const encodedPayload = encode(payload);
      currentSocket.emit(C.LOGIN_USER, encodedPayload);
      return true;
    } catch (err) {
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
        loginTimeoutRef.current = null;
      }
      setIsLoading(false);
      showError('Connection error. Please try again.');
      return false;
    }
  };

  const loadGoogleScript = () => {
    return new Promise((resolve) => {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  };

  const handleGoogleLogin = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      showInfo('Google login is not configured. Set VITE_GOOGLE_CLIENT_ID in your environment.');
      return;
    }
    let currentSocket = getSocket();
    if (!currentSocket) {
      currentSocket = connect(storage.getKey('token'));
    }
    if (!currentSocket) {
      showError('Connection error. Please refresh the page.');
      return;
    }
    setIsLoading(true);
    try {
      await loadGoogleScript();
      if (!window.google?.accounts?.id) {
        showError('Google sign-in could not be loaded.');
        setIsLoading(false);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (!response?.credential) return;
          try {
            currentSocket.emit(C.LOGIN_USER_GOOGLE, encode({ token: response.credential }));
          } catch (err) {
            setIsLoading(false);
            showError('Failed to send Google credential.');
          }
        },
        auto_select: false,
      });
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
          setIsLoading(false);
        }
      });
    } catch (err) {
      setIsLoading(false);
      showError('Google sign-in failed. Please try again.');
    }
  };

  return {
    isLoading,
    setIsLoading,
    showTwoFactorInput,
    setShowTwoFactorInput,
    twoFactorCode,
    setTwoFactorCode,
    tempLoginData,
    handleLoginSubmit,
    handleTwoFactorSubmit,
    handleGoogleLogin,
    showError,
    showInfo,
  };
}

export default useLogin;
