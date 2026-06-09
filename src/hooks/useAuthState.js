import { useState, useEffect } from 'react';
import storage from '../utils/storage.js';

/** Read the current static-auth session from localStorage. */
export function readAuth() {
  return {
    isLoggedIn: !!storage.getKey('token') || storage.getKey('logged') === true,
    user: storage.getKey('user') || null,
  };
}

/**
 * Reactive static-auth state. Re-renders on login/logout — staticAuth dispatches
 * a window 'auth-change' event; we also listen to 'focus' and cross-tab 'storage'.
 */
export function useAuthState() {
  const [state, setState] = useState(readAuth);
  useEffect(() => {
    const update = () => setState(readAuth());
    window.addEventListener('auth-change', update);
    window.addEventListener('focus', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('auth-change', update);
      window.removeEventListener('focus', update);
      window.removeEventListener('storage', update);
    };
  }, []);
  return state;
}

export default useAuthState;
