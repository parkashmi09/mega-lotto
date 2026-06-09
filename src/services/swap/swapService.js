/**
 * Swap Service – same API shape as jackopot
 */
import { API } from '@/constants';
import { getUID } from '@/utils/helper';

export const getSwapEstimate = async (fromCurrency, toCurrency, amount) => {
  const response = await fetch(
    `${API}/internalswap/estimate?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&amount=${amount}`
  );
  if (!response.ok) throw new Error('Failed to fetch swap estimate');
  return response.json();
};

export const performSwap = async (payload) => {
  const response = await fetch(`${API}/internalswap/swap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid: getUID(), ...payload }),
  });
  if (!response.ok) throw new Error('Swap failed');
  return response.json();
};
