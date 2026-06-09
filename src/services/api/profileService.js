import { getSocket, encode, decode, storage, getUID } from '@/utils';
import { C, API_URL } from '@/constants.js';

export const fetchUserInfo = () => {
  return new Promise((resolve, reject) => {
    const uid = getUID();
    const currentSocket = getSocket();

    if (!uid || !currentSocket) {
      reject(new Error('User ID or socket not available'));
      return;
    }

    const timeout = setTimeout(() => {
      currentSocket.off(C.USER_INFO, handleUserInfo);
      reject(new Error('User info request timeout'));
    }, 10000);

    const handleUserInfo = (data) => {
      try {
        clearTimeout(timeout);
        currentSocket.off(C.USER_INFO, handleUserInfo);
        const decodedData = decode(data);
        if (decodedData && decodedData.status) {
          resolve(decodedData);
        } else {
          reject(new Error('Invalid user info data'));
        }
      } catch (error) {
        clearTimeout(timeout);
        currentSocket.off(C.USER_INFO, handleUserInfo);
        reject(error);
      }
    };

    currentSocket.on(C.USER_INFO, handleUserInfo);

    currentSocket.emit(C.USER_INFO, encode({
      id: uid,
      coin: storage.getKey('coin') || '',
      rate: null,
      game: 'all',
      first: true,
    }));
  });
};

export const fetchBetWinCount = async () => {
  const uid = getUID();
  if (!uid) throw new Error('User ID not available');

  const response = await fetch(`${API_URL}/betHistory/user/${uid}/bet-win-count`);
  if (!response.ok) throw new Error('Failed to fetch bet and win counts');
  const data = await response.json();
  return {
    betCount: data.betCount || 0,
    winCount: data.winCount || 0,
  };
};

export const fetchWagerCheck = async () => {
  const uid = getUID();
  if (!uid) throw new Error('User ID not available');

  const response = await fetch(`${API_URL}/api/deposits/check-wager/${uid}`);
  if (!response.ok) throw new Error('Failed to fetch wager check data');
  return response.json();
};

export const fetchKYCStatus = async () => {
  const uid = getUID();
  if (!uid) throw new Error('User ID not available');

  const response = await fetch(`${API_URL}/kyc/status/${uid}`);
  if (!response.ok) throw new Error('Failed to fetch KYC status');
  return response.json();
};
