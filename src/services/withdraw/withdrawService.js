/**
 * Withdraw Service – same API shape as jackopot
 */
import axios from 'axios';
import { API } from '@/constants';
import { getUID } from '@/utils/helper';

export const createCryptoWithdrawal = async () => {
  return Promise.resolve({ success: true });
};

export const createFiatWithdrawal = async (payload) => {
  try {
    const response = await axios.post(`${API}/createFiatWithdrawal`, {
      uid: getUID().toString(),
      ...payload,
    });
    const responseData = response.data || {};
    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        message: responseData.message || 'Withdrawal request submitted successfully',
        ...responseData,
      };
    }
    return { success: responseData.success !== false, ...responseData };
  } catch (error) {
    if (error?.response?.status === 201 || error?.response?.status === 200) {
      const responseData = error.response.data || {};
      return {
        success: true,
        message: responseData.message || 'Withdrawal request submitted successfully',
        ...responseData,
      };
    }
    throw error;
  }
};

export const check2FAStatus = async (uid) => {
  const response = await axios.get(`${API}/2fa/status/${uid}`);
  return response.data;
};

export const verify2FA = async (payload) => {
  const response = await axios.post(`${API}/2fa/verify`, {
    uid: getUID(),
    ...payload,
  });
  return response.data;
};
