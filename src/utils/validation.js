/**
 * Simple email validation.
 * @param {string} email
 * @returns {boolean}
 */
export function isEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
}
