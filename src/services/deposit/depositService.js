/**
 * Deposit Service – same API as jackopot (https://apithrill.codefactory.games/createDeposit etc.)
 */
import axios from 'axios';
import { API } from '@/constants';
import { getUID } from '@/utils/helper';

const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchCoinDetails = async (symbol) => {
  const response = await apiClient.post('/getCoinDetails', {
    symbol: symbol.toUpperCase(),
  });
  return response.data;
};

/** POST https://apithrill.codefactory.games/createDeposit – same as jackopot depositService */
export const createCryptoDeposit = async (payload) => {
  const response = await apiClient.post('/createDeposit', {
    ...payload,
    userid: getUID().toString(),
  });
  return response.data;
};

export const fetchBankDetails = async (currency) => {
  const response = await apiClient.get(`/bankDetails/${currency}`);
  return response.data;
};

export const createINRPayment = async (payload) => {
  const response = await apiClient.post('/remotes/create-deposit', {
    amount: payload.amount,
    currency: 'INR',
    custom_user_id: getUID(),
    custom_transaction_id: `TX_${Date.now()}`,
    payment_system: payload.paymentSystem || 'phonepe',
    webhook_id: 2472417,
    return_url: window.location.origin || 'https://jackopot.com',
  });
  return response.data;
};

export const createOkPayPayment = async (payload) => {
  const response = await apiClient.post('/api/payments/payin/initiate', {
    userId: getUID(),
    currency: 'INR',
    out_trade_no: `TX${Date.now()}`,
    pay_type: 'UPI',
    money: payload.amount,
    attach: '',
    notify_url: `${API}/api/payments/payin/callback`,
    returnUrl: window.location.origin || 'https://jackopot.com',
    phone: payload.phoneNumber,
  });
  return response.data;
};

export const createManualDeposit = async (formData) => {
  const response = await apiClient.post('/api/deposits/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const createCricPayPayment = async (payload) => {
  const response = await apiClient.post('/cricpay/payment-request', {
    amount: payload.amount,
    userId: getUID(),
    paymentMethod: payload.paymentMethod,
    userName: typeof localStorage !== 'undefined' ? localStorage.getItem('name') || 'User' : 'User',
  });
  return response.data;
};
