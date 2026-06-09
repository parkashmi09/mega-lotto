/**
 * LocalStorage wrapper for session/user data (compatible with jackopot-style usage).
 */

class Storage {
  setKey(key, value) {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {
      console.error('Error setting storage key:', err);
    }
  }

  getKey(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch (err) {
      return localStorage.getItem(key);
    }
  }

  removeKey(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error('Error removing storage key:', err);
    }
  }

  clear() {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Error clearing storage:', err);
    }
  }
}

const storage = new Storage();
export default storage;
