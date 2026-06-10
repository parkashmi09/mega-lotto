import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Search, Info } from 'lucide-react';
import coinsData from '@/utils/coins';
import { C } from '@/constants';
import {
  encode,
  decode,
  forceSatoshiFormat,
  storage,
  Event,
  wait,
  getSocket,
  lowerCase,
  getUID,
} from '@/utils';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/Button';
import { API } from '@/constants';
import {
  createFiatWithdrawal,
  check2FAStatus,
  verify2FA,
} from '@/services/withdraw/withdrawService';

function getCoinImagePath(coin) {
  if (!coin || !coin.image) return '/assets/images/coins/BTC.webp';
  const map = { USDT: 'USDT.webp', TRX: 'TRON.webp' };
  let name = map[coin.preffix] || coin.image;
  name = name.replace(/^coins\//, '').replace(/^assets\/images\//, '');
  return `/assets/images/coins/${name}`;
}

const FIAT_LIST = ['INR', 'MVR', 'PKR', 'AED', 'BDT', 'NPR', 'SC'];
const isFiatCurrency = (c) => FIAT_LIST.includes(c);

export default function WithdrawTab() {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const socket = getSocket();
  const [selectedCoin, setSelectedCoin] = useState(storage.getKey('coin') || 'BTC');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [coinOpen, setCoinOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [chainName, setChainName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [credits, setCredits] = useState({});
  const [activeCoins, setActiveCoins] = useState(
    () => localStorage.getItem('active_coins')?.split(',').map(String) || ['1', '2', '3', '4']
  );
  const [inrType, setInrType] = useState('upi');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const filteredCoins = coinsData
    .filter(
      (c) =>
        activeCoins.includes(c.id.toString()) &&
        c.preffix !== 'BJT' &&
        c.preffix !== 'SC' &&
        c.preffix.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.preffix === 'BTC' ? -1 : b.preffix === 'BTC' ? 1 : 0));

  const selectedCoinData = coinsData.find((c) => c.preffix === selectedCoin);

  const { data: coinDetails, isLoading: loadingCoin } = useQuery({
    queryKey: ['coinDetails', selectedCoin],
    queryFn: async () => {
      if (isFiatCurrency(selectedCoin)) return null;
      const res = await fetch(`${API}/getCoinDetails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: selectedCoin.toUpperCase() }),
      });
      return res.json();
    },
    enabled: !isFiatCurrency(selectedCoin),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (coinDetails?.networks) {
      const nets = Object.keys(coinDetails.networks);
      if (nets.length && !selectedNetwork) setSelectedNetwork(nets[0]);
    }
  }, [coinDetails, selectedNetwork]);

  useEffect(() => {
    const token = storage.getKey('token');
    if (!token || !socket) return;
    socket.emit(C.CREDIT, encode({ token, coin: selectedCoin }));
    const onCredit = (d) => {
      const data = decode(d);
      if (data?.credit) {
        setCredits(data.credit);
        storage.setKey('credits', data.credit);
      }
    };
    const onUpdate = (d) => {
      const data = decode(d);
      if (data?.value != null && data?.coin) {
        setCredits((prev) => ({ ...prev, [lowerCase(data.coin)]: data.value }));
      }
    };
    socket.on(C.CREDIT, onCredit);
    socket.on(C.UPDATE_CREDIT, onUpdate);
    return () => {
      socket.off(C.CREDIT, onCredit);
      socket.off(C.UPDATE_CREDIT, onUpdate);
    };
  }, [selectedCoin]);

  useEffect(() => {
    const handler = (name) => {
      setSelectedCoin(name);
      setSelectedNetwork('');
      setShowPreview(false);
      setWithdrawAddress('');
      setChainName('');
    };
    Event.on('coin_changed', handler);
    return () => Event.off('coin_changed', handler);
  }, []);

  useEffect(() => {
    setAmount('');
    setShowPreview(false);
    setWithdrawAddress('');
    setChainName('');
    setPassword('');
    setPasswordError('');
    setError('');
    setAccountHolderName('');
    setBankName('');
    setAccountNumber('');
    setIfscCode('');
    setUpiId('');
  }, [selectedCoin]);

  const fiatMutation = useMutation({
    mutationFn: createFiatWithdrawal,
    onSuccess: (data) => {
      if (data?.success !== false) {
        showSuccess(data?.message || t('wallet.withdrawalSubmitted', 'Withdrawal submitted'));
        setAmount('');
        setAccountHolderName('');
        setBankName('');
        setAccountNumber('');
        setIfscCode('');
        setUpiId('');
        setShowPreview(false);
        const token = storage.getKey('token');
        if (token && socket) socket.emit(C.CREDIT, encode({ token, coin: selectedCoin }));
      } else {
        showError(data?.message || data?.error || t('wallet.withdrawalFailed', 'Withdrawal failed'));
      }
    },
    onError: (e) =>
      showError(e?.response?.data?.message || e?.message || t('wallet.withdrawalFailed', 'Withdrawal failed')),
  });

  const check2FAMutation = useMutation({
    mutationFn: () => check2FAStatus(getUID()),
    onSuccess: (data) => {
      setIs2FAEnabled(data?.isEnabled ?? false);
      if (data?.isEnabled) setShow2FA(true);
      else doWithdrawSubmit();
    },
  });

  const verify2FAMutation = useMutation({
    mutationFn: (code) => verify2FA({ token: code }),
    onSuccess: (data) => {
      if (data?.success) {
        setShow2FA(false);
        setTwoFactorCode('');
        doWithdrawSubmit();
      } else showError(t('wallet.invalidCode', 'Invalid code'));
    },
    onError: () => showError(t('wallet.verificationFailed', 'Verification failed')),
  });

  const handleCoinSelect = (name) => {
    if (storage.getKey('coin') === name) {
      setCoinOpen(false);
      return;
    }
    storage.setKey('coin', name);
    setSelectedCoin(name);
    setSelectedNetwork('');
    setShowPreview(false);
    setCoinOpen(false);
    const key = lowerCase(name);
    const val = credits[key] ?? 0;
    storage.setKey('credit', forceSatoshiFormat(val, name));
    wait(200).then(() => Event.emit('coin_changed', name));
    const token = storage.getKey('token');
    if (token && socket) socket.emit(C.CREDIT, encode({ token, coin: name }));
  };

  const validate = () => {
    setError('');
    setAddressError('');
    setPasswordError('');
    if (!amount || parseFloat(amount) <= 0) {
      setError(t('wallet.enterValidAmount', 'Enter a valid amount'));
      return false;
    }
    const info = coinsData.find((c) => c.preffix === selectedCoin);
    if (info && parseFloat(amount) < Number(info.min)) {
      setError(t('wallet.minimumIs', 'Minimum is {{min}} {{coin}}', { min: info.min, coin: selectedCoin }));
      return false;
    }
    if (isFiatCurrency(selectedCoin)) {
      if (!accountHolderName.trim()) {
        setError(t('wallet.accountHolderNameRequired', 'Account holder name required'));
        return false;
      }
      if (selectedCoin === 'INR') {
        if (inrType === 'upi' && !upiId.trim()) {
          setError(t('wallet.upiIdRequired', 'UPI ID required'));
          return false;
        }
        if (inrType === 'bank' && (!bankName || !accountNumber || !ifscCode)) {
          setError(t('wallet.bankDetailsRequired', 'Bank details required'));
          return false;
        }
      } else {
        if (!bankName || !accountNumber || !ifscCode) {
          setError(t('wallet.bankDetailsRequired', 'Bank details required'));
          return false;
        }
      }
    } else {
      if (!withdrawAddress.trim()) {
        setAddressError(t('wallet.addressRequired', 'Address required'));
        return false;
      }
      if (!chainName.trim()) setError(t('wallet.chainRequired', 'Chain required'));
    }
    return true;
  };

  const doWithdrawSubmit = () => {
    if (!validate()) return;
    if (isFiatCurrency(selectedCoin)) {
      fiatMutation.mutate({
        amount,
        currency: selectedCoin,
        withdrawal_type: selectedCoin === 'INR' ? inrType : 'bank',
        bank_name: bankName,
        account_number: accountNumber,
        account_holder_name: accountHolderName,
        ifsc_code: ifscCode,
        upi_id: upiId,
      });
    } else {
      if (!password.trim()) {
        setPasswordError(t('wallet.passwordRequired', 'Password required'));
        return;
      }
      if (!showPreview) {
        setShowPreview(true);
        return;
      }
      setLoading(true);
      const fee = parseFloat(amount) * 0.01;
      setTimeout(() => {
        socket.emit(
          C.SUBMIT_NEW_WITHDRAWL,
          encode({
            coin: selectedCoin,
            wallet: withdrawAddress,
            amount,
            immed: fee,
            password,
            chain: chainName,
            network: selectedNetwork,
          })
        );
        setAmount('');
        setWithdrawAddress('');
        setPassword('');
        setChainName('');
        setShowPreview(false);
        setLoading(false);
        showSuccess(t('wallet.withdrawalSubmitted', 'Withdrawal submitted'));
      }, 500);
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    check2FAMutation.mutate();
  };

  const handle2FA = () => {
    if (!twoFactorCode.trim()) {
      showError(t('wallet.enterCode', 'Enter code'));
      return;
    }
    verify2FAMutation.mutate(twoFactorCode);
  };

  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCoinOpen(false);
        setNetworkOpen(false);
      }
    };
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);

  const isLoading =
    fiatMutation.isPending ||
    check2FAMutation.isPending ||
    verify2FAMutation.isPending ||
    loadingCoin ||
    loading;
  const fee = !isFiatCurrency(selectedCoin) && amount ? parseFloat(amount) * 0.01 : 0;
  const finalAmount = amount ? parseFloat(amount) - fee : 0;

  return (
    <div ref={dropdownRef} className="flex flex-col gap-4 p-4">
      {/* Currency */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
          {t('wallet.withdrawalCurrency', 'Withdrawal Currency')}
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCoinOpen(!coinOpen);
              setNetworkOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm"
          >
            <div className="flex items-center gap-2">
              {selectedCoinData && (
                <img
                  src={getCoinImagePath(selectedCoinData)}
                  alt={selectedCoin}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => (e.target.src = '/assets/images/coins/BTC.webp')}
                />
              )}
              <span>{selectedCoin}</span>
            </div>
            <ChevronDown size={18} />
          </button>
          {coinOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="relative mb-2">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted-1)]" />
                <input
                  type="text"
                  placeholder={t('wallet.searchPlaceholder', 'Search...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 rounded text-sm bg-[var(--color-surface-1)] border border-[var(--color-border)] text-[var(--color-foreground-primary)]"
                />
              </div>
              {filteredCoins.map((coin) => (
                <button
                  key={coin.id}
                  type="button"
                  onClick={() => handleCoinSelect(coin.preffix)}
                  className={`w-full flex items-center gap-2 p-2 rounded text-sm text-left ${
                    selectedCoin === coin.preffix ? 'bg-[var(--color-control-primary)]' : ''
                  } text-[var(--color-foreground-primary)]`}
                >
                  <img
                    src={getCoinImagePath(coin)}
                    alt={coin.preffix}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => (e.target.src = '/assets/images/coins/BTC.webp')}
                  />
                  <span className="flex-1">{coin.preffix}</span>
                  <span className="text-xs text-[var(--color-foreground-muted-1)]">
                    {forceSatoshiFormat(credits[lowerCase(coin.preffix)] ?? 0)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Network (crypto) */}
      {!isFiatCurrency(selectedCoin) && coinDetails?.networks && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
            {t('wallet.network', 'Network')}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setNetworkOpen(!networkOpen);
                setCoinOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm"
            >
              <span>{selectedNetwork || t('wallet.select', 'Select')}</span>
              <ChevronDown size={18} />
            </button>
            {networkOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-lg z-50">
                {Object.keys(coinDetails.networks).map((net) => (
                  <button
                    key={net}
                    type="button"
                    onClick={() => {
                      setSelectedNetwork(net);
                      setChainName(net);
                      setNetworkOpen(false);
                    }}
                    className={`w-full p-2 rounded text-sm text-left ${
                      selectedNetwork === net ? 'bg-[var(--color-control-primary)]' : ''
                    } text-[var(--color-foreground-primary)]`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
          {t('wallet.amount', 'Amount')}
        </label>
        <input
          type="number"
          placeholder={t('wallet.amountPlaceholderCoin', '0.00 {{coin}}', { coin: selectedCoin })}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm focus:outline-none focus:border-[var(--color-button-primary)]"
        />
      </div>

      {/* Crypto: address */}
      {!isFiatCurrency(selectedCoin) && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
              {t('wallet.withdrawalAddress', 'Withdrawal Address')}
            </label>
            <input
              type="text"
              placeholder={t('wallet.address', 'Address')}
              value={withdrawAddress}
              onChange={(e) => {
                setWithdrawAddress(e.target.value);
                setAddressError('');
              }}
              className={`w-full p-3 rounded-lg bg-[var(--color-surface-2)] border text-sm text-[var(--color-foreground-primary)] focus:outline-none ${
                addressError ? 'border-[var(--color-negative)]' : 'border-[var(--color-border)] focus:border-[var(--color-button-primary)]'
              }`}
            />
            {addressError && (
              <span className="text-xs text-[var(--color-negative)]">{addressError}</span>
            )}
          </div>
          {showPreview && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
                {t('wallet.password', 'Password')}
              </label>
              <input
                type="password"
                placeholder={t('wallet.password', 'Password')}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                className={`w-full p-3 rounded-lg bg-[var(--color-surface-2)] border text-sm text-[var(--color-foreground-primary)] focus:outline-none ${
                  passwordError ? 'border-[var(--color-negative)]' : 'border-[var(--color-border)]'
                }`}
              />
              {passwordError && (
                <span className="text-xs text-[var(--color-negative)]">{passwordError}</span>
              )}
            </div>
          )}
        </>
      )}

      {/* Fiat: bank/UPI */}
      {isFiatCurrency(selectedCoin) && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
              {t('wallet.accountHolderName', 'Account Holder Name')}
            </label>
            <input
              type="text"
              placeholder={t('wallet.name', 'Name')}
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-foreground-primary)]"
            />
          </div>
          {selectedCoin === 'INR' && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInrType('upi')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                  inrType === 'upi'
                    ? 'bg-[var(--color-button-primary)] border-[var(--color-button-primary)] text-[var(--color-button-primary-foreground)]'
                    : 'border-[var(--color-border)] text-[var(--color-foreground-primary)]'
                }`}
              >
                {t('wallet.upi', 'UPI')}
              </button>
              <button
                type="button"
                onClick={() => setInrType('bank')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                  inrType === 'bank'
                    ? 'bg-[var(--color-button-primary)] border-[var(--color-button-primary)] text-[var(--color-button-primary-foreground)]'
                    : 'border-[var(--color-border)] text-[var(--color-foreground-primary)]'
                }`}
              >
                {t('wallet.bank', 'Bank')}
              </button>
            </div>
          )}
          {selectedCoin === 'INR' && inrType === 'upi' && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--color-foreground-muted-1)]">{t('wallet.upiId', 'UPI ID')}</label>
              <input
                type="text"
                placeholder={t('wallet.upiIdPlaceholder', 'yourname@upi')}
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-foreground-primary)]"
              />
            </div>
          )}
          {(selectedCoin !== 'INR' || inrType === 'bank') && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-foreground-muted-1)]">{t('wallet.bankName', 'Bank Name')}</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-foreground-primary)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-foreground-muted-1)]">
                  {t('wallet.accountNumber', 'Account Number')}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-foreground-primary)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-foreground-muted-1)]">{t('wallet.ifsc', 'IFSC')}</label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-foreground-primary)]"
                />
              </div>
            </>
          )}
        </>
      )}

      {error && (
        <p className="text-sm text-[var(--color-negative)]">{error}</p>
      )}

      {/* 2FA */}
      {show2FA && (
        <div className="flex flex-col gap-2 p-4 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
          <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
            {t('wallet.twoFaCode', '2FA Code')}
          </label>
          <input
            type="text"
            placeholder={t('wallet.code', 'Code')}
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            className="w-full p-3 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] text-sm text-[var(--color-foreground-primary)]"
          />
          <Button
            type="button"
            variant="primary"
            className="w-full"
            disabled={verify2FAMutation.isPending}
            onClick={handle2FA}
          >
            {t('wallet.verify', 'Verify')}
          </Button>
        </div>
      )}

      {/* Summary (crypto) */}
      {!isFiatCurrency(selectedCoin) && amount && parseFloat(amount) > 0 && (
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-foreground-muted-1)]">{t('wallet.feePercent', 'Fee (1%)')}</span>
            <span className="text-[var(--color-foreground-primary)]">{fee.toFixed(8)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span className="text-[var(--color-foreground-muted-1)]">{t('wallet.youReceive', 'You receive')}</span>
            <span className="text-[var(--color-foreground-primary)]">
              {finalAmount.toFixed(8)} {selectedCoin}
            </span>
          </div>
        </div>
      )}

      {!show2FA && (
        <Button
          type="button"
          variant="primary"
          className="w-full"
          disabled={isLoading || !amount}
          onClick={handleSubmit}
        >
          {isLoading ? t('wallet.processing', 'Processing...') : t('wallet.withdraw', 'Withdraw')}
        </Button>
      )}

      <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-surface-2)] border-l-4 border-[var(--color-button-primary)]">
        <Info size={18} className="shrink-0 mt-0.5 text-[var(--color-button-primary)]" />
        <p className="text-xs text-[var(--color-foreground-primary)]">
          {t('wallet.withdrawWarning', 'Ensure the withdrawal address and network are correct. Wrong network may cause loss.')}
        </p>
      </div>
    </div>
  );
}
