/**
 * Static/dummy login — validates against /public/api/auth.json (no real backend).
 * On success it sets the session keys the app already checks for
 * (`token`, `logged`, `user`) so the header switches to the logged-in state.
 */
import storage from '../../utils/storage.js';
import { store } from '../../store/index.js';
import { resetWallet } from '../../store/walletSlice.js';
import { clearMyTickets } from '../lottery/lotteryService.js';

const AUTH_URL = '/api/auth.json';

export async function staticLogin(identifier, password) {
  try {
    const res = await fetch(AUTH_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const id = String(identifier || '').trim().toLowerCase();
    const user = (data.users || []).find(
      (u) =>
        (u.username?.toLowerCase() === id || u.email?.toLowerCase() === id) &&
        u.password === password
    );
    if (!user) return { ok: false, message: 'Invalid email/username or password' };

    storage.setKey('token', `demo-${Date.now()}`);
    storage.setKey('logged', true);
    storage.setKey('user', { name: user.name, email: user.email, username: user.username });
    notifyAuthChange();
    return { ok: true, user };
  } catch {
    return { ok: false, message: 'Login failed — please try again' };
  }
}

export function staticLogout() {
  storage.removeKey('token');
  storage.removeKey('logged');
  storage.removeKey('user');
  // Clear all per-session state: wallet balance back to start + remove all tickets.
  try { store.dispatch(resetWallet()); } catch { /* store not ready */ }
  try { clearMyTickets(); } catch { /* no storage */ }
  notifyAuthChange();
}

/** Tell the app (useAuthState / Header) that the session changed. */
function notifyAuthChange() {
  try {
    window.dispatchEvent(new Event('auth-change'));
    window.dispatchEvent(new Event('focus'));
  } catch { /* SSR / no window */ }
}
