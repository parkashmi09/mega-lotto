/**
 * Application constants – API, Socket, and auth event names.
 * Use publicEnv.PUBLIC_THRILL_API_BASE_URL when set; else fallbacks for development.
 */

const DEVELOPMENT = import.meta.env.DEV ?? true;

/** Base API URL (no trailing slash). Override via PUBLIC_THRILL_API_BASE_URL. */
export const API_URL =
  (typeof import.meta.env.VITE_THRILL_API_BASE_URL !== 'undefined' &&
    import.meta.env.VITE_THRILL_API_BASE_URL) ||
  (DEVELOPMENT ? 'https://apithrill.codefactory.games' : 'https://apithrill.codefactory.games');

/** API base (alias for services). */
export const API = API_URL;

/** WebSocket URL for socket.io. Same host as API in most setups. */
export const SOCKET_URL =
  (typeof import.meta.env.VITE_THRILL_SOCKET_URL !== 'undefined' &&
    import.meta.env.VITE_THRILL_SOCKET_URL) ||
  (DEVELOPMENT ? 'wss://apithrill.codefactory.games' : 'wss://apithrill.codefactory.games');

/** Socket event name hashes (must match backend). */
export const C = {
  LOGIN_USER: 'faf9ba208ad90e7313b6ffafde53b801',
  LOGIN_USER_GOOGLE: '383f7bf0257c3ef6cab20278dd1579be',
  REGISTER_USER: '0a2637735ee07dd5f0e5eba7b9ca1ce7',
  USER_INFO: '18566cda79f670c2098360799275aa31',
  LOGOUT_USER: '1f7009c5312bab76e660578ecbe08350',
  CREDIT: '660cb6fe7737d7b70e7a07b706b93f70',
  UPDATE_CREDIT: '80d8b773e76b21777faaccfbd3c2a687',
  SUBMIT_NEW_WITHDRAWL: '7c0b37955cf21c7f2f3773c1268edc08',
};

/** Cookie keys used for session. */
export const COOKIE_KEYS = {
  SESSION: 'session',
  UID: 'uid',
};

/** Session cookie expiry (days). */
export const SESSION_EXPIRY_DAYS = 14;
