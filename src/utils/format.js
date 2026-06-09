/**
 * Format utilities – balance display (aligned with jackopot forceSatoshiFormat usage).
 */

const FIAT_COINS = ['INR', 'USDT', 'PKR', 'USDC', 'BUSD', 'TUSD', 'USDP'];

/**
 * Format balance for display: 2 decimals for fiat/stablecoins, 8 for crypto.
 * @param {number|string} val
 * @param {string} coin - e.g. BTC, INR, USDT
 * @returns {string}
 */
export function formatBalance(val, coin = 'BTC') {
  const amount = parseFloat(val);
  if (isNaN(amount)) return '0.00';
  const isFiat = FIAT_COINS.includes((coin || '').toUpperCase());
  const decimals = isFiat ? 2 : 8;
  const fixed = amount.toFixed(decimals);
  return parseFloat(fixed).toLocaleString('en-US', {
    minimumFractionDigits: isFiat ? 2 : 2,
    maximumFractionDigits: isFiat ? 2 : 8,
  });
}

/** Lowercase string (for credits key). */
export function lowerCase(s) {
  return (s == null ? '' : String(s)).toLowerCase();
}

/**
 * Format balance for display (crypto: 8 decimals, fiat: 2).
 * @param {number|string} val
 * @param {string} coin - e.g. BTC, INR, USDT
 * @returns {string}
 */
export function forceSatoshiFormat(val, coin = 'BTC') {
  const amount = parseFloat(val);
  if (isNaN(amount)) return '0.00000000';
  const isFiat = FIAT_COINS.includes((coin || '').toUpperCase());
  const decimals = isFiat ? 2 : 8;
  return amount.toFixed(decimals);
}
