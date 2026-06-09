import { createSlice } from '@reduxjs/toolkit';

/**
 * Wallet state — INR only. Balance is managed here (Redux Toolkit) and persisted
 * to localStorage via redux-persist. Tickets purchases "cut" from this balance.
 */
const initialState = {
  currency: 'INR',
  balance: 10000, // static starting balance (₹) so the demo purchase flow works
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    deposit: (s, a) => { s.balance += Math.max(0, Number(a.payload) || 0); },
    withdraw: (s, a) => { s.balance = Math.max(0, s.balance - Math.max(0, Number(a.payload) || 0)); },
    deduct: (s, a) => { s.balance = Math.max(0, s.balance - Math.max(0, Number(a.payload) || 0)); },
    setBalance: (s, a) => { s.balance = Math.max(0, Number(a.payload) || 0); },
    resetWallet: () => ({ ...initialState }),
  },
});

export const { deposit, withdraw, deduct, setBalance, resetWallet } = walletSlice.actions;
export default walletSlice.reducer;
