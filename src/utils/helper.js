import Cookies from 'js-cookie';
import { COOKIE_KEYS } from '../constants.js';

/** Promise that resolves after ms milliseconds. */
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Get user ID from cookie (set on login). */
export function getUID() {
  const uid = Cookies.get(COOKIE_KEYS.UID);
  if (uid === undefined || uid === '') return '';
  const n = parseFloat(uid);
  return Number.isNaN(n) ? uid : n;
}
