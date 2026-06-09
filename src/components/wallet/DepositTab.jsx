import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronDown, Search, Copy, CheckCircle, Info } from 'lucide-react';
import { QRCode } from 'react-qrcode-logo';
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
  getUID,
  lowerCase,
} from '@/utils';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/Button';
import {
  fetchCoinDetails,
  createCryptoDeposit,
  fetchBankDetails,
  createManualDeposit,
} from '@/services/deposit/depositService';

function getCoinImagePath(coin) {
  if (!coin || !coin.image) return '/assets/images/coins/BTC.webp';
  const map = { USDT: 'USDT.webp', TRX: 'TRON.webp' };
  let name = map[coin.preffix] || coin.image;
  name = name.replace(/^coins\//, '').replace(/^assets\/images\//, '');
  return `/assets/images/coins/${name}`;
}

const FIAT_CURRENCIES = {
  INR: { minAmount: 100 },
  MVR: { minAmount: 100 },
  PKR: { minAmount: 100 },
  AED: { minAmount: 100 },
  BDT: { minAmount: 100 },
};
const isFiatCurrency = (c) => Object.keys(FIAT_CURRENCIES).includes(c);

const POPULAR = ['BTC', 'ETH', 'USDT', 'DOGE', 'BNB', 'INR', 'LTC', 'ADA', 'XRP'];

export default function DepositTab() {
  const { showSuccess, showError } = useToast();
  const socket = getSocket();
  const [selectedCoin, setSelectedCoin] = useState(storage.getKey('coin') || 'INR');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [amount, setAmount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [coinOpen, setCoinOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [depositAddress, setDepositAddress] = useState('');
  const [qrString, setQrString] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState({});
  const [paymentMode, setPaymentMode] = useState('manual');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [showTxForm, setShowTxForm] = useState(false);
  const [credits, setCredits] = useState({});
  const [activeCoins, setActiveCoins] = useState(
    () => localStorage.getItem('active_coins')?.split(',').map(String) || ['1', '2', '3', '4']
  );
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
  const quickCoins = coinsData
    .filter(
      (c) =>
        activeCoins.includes(c.id.toString()) &&
        c.preffix !== 'BJT' &&
        c.preffix !== 'SC' &&
        c.preffix !== 'JPC'
    )
    .sort((a, b) => {
      const ai = POPULAR.indexOf(a.preffix);
      const bi = POPULAR.indexOf(b.preffix);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.preffix.localeCompare(b.preffix);
    })
    .slice(0, 8);

  const { data: coinDetails, isLoading: loadingCoin } = useQuery({
    queryKey: ['coinDetails', selectedCoin],
    queryFn: () => fetchCoinDetails(selectedCoin),
    enabled: !isFiatCurrency(selectedCoin) && selectedCoin !== 'INR',
    staleTime: 5 * 60 * 1000,
  });

  const { data: bankList = [], isLoading: loadingBanks } = useQuery({
    queryKey: ['bankDetails', selectedCoin],
    queryFn: () => fetchBankDetails(selectedCoin),
    enabled: isFiatCurrency(selectedCoin),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (coinDetails?.networks) {
      const nets = Object.keys(coinDetails.networks);
      if (nets.length && !selectedNetwork) setSelectedNetwork(nets[0]);
    }
  }, [coinDetails, selectedNetwork]);

  useEffect(() => {
    if (bankList.length && !selectedBank) setSelectedBank(bankList[0].bank_name);
  }, [bankList, selectedBank]);

  useEffect(() => {
    const token = storage.getKey('token');
    if (!token || !socket) return;
    socket.emit(C.CREDIT, encode({ token, coin: selectedCoin }));
    const onCredit = (data) => {
      const d = decode(data);
      if (d?.credit) {
        setCredits(d.credit);
        storage.setKey('credits', d.credit);
      }
    };
    const onUpdate = (data) => {
      const d = decode(data);
      if (d?.value != null && d?.coin) {
        setCredits((prev) => ({ ...prev, [lowerCase(d.coin)]: d.value }));
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
    const handler = (coinName) => {
      setSelectedCoin(coinName);
      setSelectedNetwork('');
      setShowDetails(false);
      setDepositAddress('');
      setQrString('');
    };
    Event.on('coin_changed', handler);
    return () => Event.off('coin_changed', handler);
  }, []);

  useEffect(() => {
    setAmount('');
    setShowDetails(false);
    setDepositAddress('');
    setQrString('');
    setShowTxForm(false);
    setTransactionId('');
    setScreenshot(null);
  }, [selectedCoin]);

  const cryptoMutation = useMutation({
    mutationFn: createCryptoDeposit,
    onSuccess: (data) => {
      // Match jackopot: API may return data.data.address or data.address
      const address = data?.data?.address ?? data?.address ?? data?.data?.depositAddress;
      if (address && typeof address === 'string') {
        setDepositAddress(address);
        setQrString(address);
        setShowDetails(true);
        showSuccess('Deposit address generated');
      } else {
        showError('Failed to generate deposit address');
      }
    },
    onError: (e) => showError(e?.message || 'Failed to create deposit'),
  });

  const manualMutation = useMutation({
    mutationFn: createManualDeposit,
    onSuccess: (data) => {
      if (data?.success) {
        showSuccess('Deposit request submitted');
        setShowTxForm(false);
        setTransactionId('');
        setScreenshot(null);
        setAmount('');
        const token = storage.getKey('token');
        if (token && socket) socket.emit(C.CREDIT, encode({ token, coin: selectedCoin }));
      } else showError('Failed to submit');
    },
    onError: (e) => showError(e.message || 'Failed to submit'),
  });

  const handleCoinSelect = (name) => {
    setSelectedCoin(name);
    storage.setKey('coin', name);
    setSelectedNetwork('');
    setShowDetails(false);
    setCoinOpen(false);
    const key = lowerCase(name);
    const val = credits[key] ?? 0;
    storage.setKey('credit', forceSatoshiFormat(val, name));
    wait(200).then(() => Event.emit('coin_changed', name));
    const token = storage.getKey('token');
    if (token && socket) socket.emit(C.CREDIT, encode({ token, coin: name }));
  };

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopied((p) => ({ ...p, [field]: true }));
    setTimeout(() => setCopied((p) => ({ ...p, [field]: false })), 2000);
    showSuccess('Copied');
  };

  const handleCryptoDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showError('Enter a valid amount');
      return;
    }
    if (!selectedNetwork) {
      showError('Select a network');
      return;
    }
    if (!coinDetails?.coinId) {
      showError('Coin details not loaded');
      return;
    }
    cryptoMutation.mutate({
      coinId: coinDetails.coinId,
      price: amount,
      orderId: `order${Date.now()}`,
      chain: selectedNetwork,
      generateCheckoutURL: true,
      returnUrl: window.location.origin || 'https://jackopot.com',
    });
  };

  const handleManualSubmit = () => {
    if (!transactionId || !screenshot) {
      showError('Fill transaction ID and screenshot');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      showError('Enter a valid amount');
      return;
    }
    const form = new FormData();
    form.append('user_id', getUID());
    form.append('amount', amount);
    form.append('transaction_id', transactionId);
    form.append('screenshot', screenshot);
    form.append('currency', selectedCoin);
    const bank = bankList.find((b) => b.bank_name === selectedBank);
    if (bank) {
      form.append('bank_name', selectedBank);
      form.append('account_number', bank.account_number);
      form.append('ifsc_code', bank.ifsc_code);
      form.append('account_holder_name', bank.account_holder_name);
    }
    manualMutation.mutate(form);
  };

  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCoinOpen(false);
        setNetworkOpen(false);
        setBankOpen(false);
      }
    };
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);

  const selectedBankData = bankList.find((b) => b.bank_name === selectedBank);
  const isLoading =
    cryptoMutation.isPending ||
    manualMutation.isPending ||
    loadingCoin ||
    loadingBanks;

  return (
    <div ref={dropdownRef} className="flex flex-col gap-4 p-4 animate-in fade-in duration-300">
      {/* Quick select */}
      <div className="flex flex-wrap gap-2">
        {quickCoins.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => handleCoinSelect(c.preffix)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
              selectedCoin === c.preffix
                ? 'bg-[var(--color-button-primary)] border-[var(--color-button-primary)] text-[var(--color-button-primary-foreground)]'
                : 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-foreground-primary)] hover:border-[var(--color-button-primary)]'
            }`}
          >
            <img
              src={getCoinImagePath(c)}
              alt={c.preffix}
              className="w-5 h-5 rounded-full object-cover"
              onError={(e) => (e.target.src = '/assets/images/coins/BTC.webp')}
            />
            <span>{c.preffix}</span>
          </button>
        ))}
      </div>

      {/* Currency */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
          Deposit Currency
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCoinOpen(!coinOpen);
              setNetworkOpen(false);
              setBankOpen(false);
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
            <ChevronDown size={18} className="shrink-0" />
          </button>
          {coinOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="relative mb-2">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted-1)]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 rounded text-sm bg-[var(--color-surface-1)] border border-[var(--color-border)] text-[var(--color-foreground-primary)]"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                {filteredCoins.map((coin) => (
                  <button
                    key={coin.id}
                    type="button"
                    onClick={() => handleCoinSelect(coin.preffix)}
                    className={`flex items-center gap-2 p-2 rounded text-left text-sm ${
                      selectedCoin === coin.preffix
                        ? 'bg-[var(--color-control-primary)] border border-[var(--color-button-primary)]'
                        : 'hover:bg-[var(--color-control-primary)]'
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
            </div>
          )}
        </div>
      </div>

      {/* Network */}
      {!isFiatCurrency(selectedCoin) && coinDetails?.networks && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
            Network
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setNetworkOpen(!networkOpen);
                setCoinOpen(false);
                setBankOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm"
            >
              <span>{selectedNetwork || 'Select'}</span>
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
                      setNetworkOpen(false);
                    }}
                    className={`w-full flex items-center p-2 rounded text-sm ${
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

      {/* Bank (fiat) */}
      {isFiatCurrency(selectedCoin) && bankList.length > 0 && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
            Bank
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBankOpen(!bankOpen);
                setCoinOpen(false);
                setNetworkOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm"
            >
              <span>{selectedBank || 'Select'}</span>
              <ChevronDown size={18} />
            </button>
            {bankOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-lg z-50 max-h-48 overflow-y-auto">
                {bankList.map((b) => (
                  <button
                    key={b.bank_name}
                    type="button"
                    onClick={() => {
                      setSelectedBank(b.bank_name);
                      setBankOpen(false);
                    }}
                    className={`w-full flex items-center p-2 rounded text-sm ${
                      selectedBank === b.bank_name ? 'bg-[var(--color-control-primary)]' : ''
                    } text-[var(--color-foreground-primary)]`}
                  >
                    {b.bank_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR & Address (crypto) - same as jackopot DepositTab */}
      {showDetails && depositAddress && qrString && (
        <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
          <div className="p-3 bg-white rounded-lg flex items-center justify-center w-[200px] h-[200px]">
            <QRCode value={qrString} size={200} />
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
              Deposit Address
            </label>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)]">
              <span className="flex-1 text-xs break-all font-mono text-[var(--color-foreground-primary)]">
                {depositAddress}
              </span>
              <button
                type="button"
                onClick={() => handleCopy('address', depositAddress)}
                className="p-1.5 rounded bg-[var(--color-control-primary)] text-[var(--color-foreground-primary)]"
              >
                {copied.address ? <CheckCircle size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bank details (fiat manual) */}
      {isFiatCurrency(selectedCoin) && selectedBankData && paymentMode === 'manual' && (
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
          {selectedBankData.account_holder_name && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[var(--color-foreground-muted-1)]">
                Account Holder
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-foreground-primary)]">
                  {selectedBankData.account_holder_name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('holder', selectedBankData.account_holder_name)
                  }
                  className="p-1 rounded text-[var(--color-foreground-primary)]"
                >
                  {copied.holder ? <CheckCircle size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          )}
          {selectedBankData.account_number && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[var(--color-foreground-muted-1)]">
                Account Number
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[var(--color-foreground-primary)]">
                  {selectedBankData.account_number}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('account', selectedBankData.account_number)
                  }
                  className="p-1 rounded text-[var(--color-foreground-primary)]"
                >
                  {copied.account ? <CheckCircle size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          )}
          {selectedBankData.ifsc_code && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[var(--color-foreground-muted-1)]">IFSC</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-[var(--color-foreground-primary)]">
                  {selectedBankData.ifsc_code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy('ifsc', selectedBankData.ifsc_code)}
                  className="p-1 rounded text-[var(--color-foreground-primary)]"
                >
                  {copied.ifsc ? <CheckCircle size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">
          Amount
        </label>
        <input
          type="number"
          placeholder={`Amount in ${selectedCoin}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm focus:outline-none focus:border-[var(--color-button-primary)]"
        />
      </div>

      {/* Fiat: manual form */}
      {isFiatCurrency(selectedCoin) && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPaymentMode('manual')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
              paymentMode === 'manual'
                ? 'bg-[var(--color-button-primary)] border-[var(--color-button-primary)] text-[var(--color-button-primary-foreground)]'
                : 'border-[var(--color-border)] text-[var(--color-foreground-primary)]'
            }`}
          >
            Manual
          </button>
        </div>
      )}

      {showTxForm && isFiatCurrency(selectedCoin) && (
        <div className="flex flex-col gap-3 p-4 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--color-foreground-muted-1)]">
              Transaction / UTR
            </label>
            <input
              type="text"
              placeholder="Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-3 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] text-sm text-[var(--color-foreground-primary)]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--color-foreground-muted-1)]">
              Screenshot
            </label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => document.getElementById('deposit-screenshot').click()}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('deposit-screenshot').click()}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-[var(--color-button-primary)] text-[var(--color-foreground-primary)] text-sm cursor-pointer"
            >
              {screenshot ? screenshot.name : 'Upload screenshot'}
            </div>
            <input
              id="deposit-screenshot"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full"
            disabled={manualMutation.isPending}
            onClick={handleManualSubmit}
          >
            {manualMutation.isPending ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      )}

      {/* Actions */}
      {!showTxForm && (
        <div className="flex flex-col gap-2">
          {isFiatCurrency(selectedCoin) ? (
            <Button
              type="button"
              variant="primary"
              className="w-full"
              disabled={isLoading || !amount || !selectedBank}
              onClick={() => setShowTxForm(true)}
            >
              Proceed to payment
            </Button>
          ) : !showDetails ? (
            <Button
              type="button"
              variant="primary"
              className="w-full"
              disabled={isLoading || !amount || !selectedNetwork}
              onClick={handleCryptoDeposit}
            >
              {isLoading ? 'Generating...' : 'Generate deposit address'}
            </Button>
          ) : null}
        </div>
      )}

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-surface-2)] border-l-4 border-[var(--color-button-primary)]">
        <Info size={18} className="shrink-0 mt-0.5 text-[var(--color-button-primary)]" />
        <p className="text-xs text-[var(--color-foreground-primary)]">
          Only send {selectedCoin} to this address. Sending other assets may result in loss.
        </p>
      </div>
    </div>
  );
}
