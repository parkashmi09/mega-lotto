import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronDown, Search, Info, ArrowUpDown } from 'lucide-react';
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
} from '@/utils';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/Button';
import { getSwapEstimate, performSwap } from '@/services/swap/swapService';

function getCoinImagePath(coin) {
  if (!coin || !coin.image) return '/assets/images/coins/BTC.webp';
  const map = { USDT: 'USDT.webp', TRX: 'TRON.webp' };
  let name = map[coin.preffix] || coin.image;
  name = name.replace(/^coins\//, '').replace(/^assets\/images\//, '');
  return `/assets/images/coins/${name}`;
}

export default function SwapTab() {
  const { showSuccess, showError } = useToast();
  const socket = getSocket();
  const [fromCoin, setFromCoin] = useState(storage.getKey('fromCoin') || 'BTC');
  const [toCoin, setToCoin] = useState(storage.getKey('toCoin') || 'ETH');
  const [amount, setAmount] = useState('');
  const [toAmount, setToAmount] = useState('0');
  const [baseRate, setBaseRate] = useState('0');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
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

  const fromCoinData = coinsData.find((c) => c.preffix === fromCoin);
  const toCoinData = coinsData.find((c) => c.preffix === toCoin);

  const { data: estimateData } = useQuery({
    queryKey: ['swapEstimate', fromCoin, toCoin, amount],
    queryFn: () => {
      const a = amount && parseFloat(amount) > 0 ? amount : '1';
      return getSwapEstimate(fromCoin, toCoin, a);
    },
    enabled: !!fromCoin && !!toCoin && fromCoin !== toCoin,
    staleTime: 30000,
  });

  useEffect(() => {
    if (estimateData?.success) {
      if (amount && parseFloat(amount) > 0) {
        const input = parseFloat(amount);
        const feePct = fromCoin.toLowerCase() === 'inr' ? 0.15 : fromCoin.toLowerCase() === 'bjt' ? 0 : 0.01;
        const afterFee = input * (1 - feePct);
        const est = estimateData.data?.estimatedAmount ?? 0;
        const ratio = input > 0 ? est / input : 0;
        setToAmount((afterFee * ratio).toFixed(8));
      } else setToAmount('0');
      if (estimateData.data?.exchangeRates != null) {
        const rate = estimateData.data.estimatedAmount / (amount && parseFloat(amount) > 0 ? parseFloat(amount) : 1);
        setBaseRate(rate.toFixed(8));
      }
    }
  }, [estimateData, amount, fromCoin, toCoin]);

  useEffect(() => {
    const token = storage.getKey('token');
    if (!token || !socket) return;
    socket.emit(C.CREDIT, encode({ token, coin: fromCoin }));
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
  }, [fromCoin]);

  useEffect(() => {
    Event.on('from_coin_changed', setFromCoin);
    Event.on('to_coin_changed', setToCoin);
    return () => {
      Event.off('from_coin_changed', setFromCoin);
      Event.off('to_coin_changed', setToCoin);
    };
  }, []);

  const swapMutation = useMutation({
    mutationFn: performSwap,
    onSuccess: (data) => {
      if (data?.success) {
        showSuccess('Swap completed');
        setAmount('');
        setToAmount('0');
        const token = storage.getKey('token');
        if (token && socket) {
          socket.emit(C.CREDIT, encode({ token, coin: fromCoin }));
          socket.emit(C.CREDIT, encode({ token, coin: toCoin }));
        }
      } else showError(data?.message || 'Swap failed');
    },
    onError: (e) => showError(e?.message || 'Swap failed'),
  });

  const handleFromSelect = (name) => {
    if (name === toCoin) {
      setToCoin(fromCoin);
      storage.setKey('toCoin', fromCoin);
    }
    storage.setKey('fromCoin', name);
    setFromCoin(name);
    setFromOpen(false);
    wait(200).then(() => Event.emit('from_coin_changed', name));
  };

  const handleToSelect = (name) => {
    if (name === fromCoin) {
      setFromCoin(toCoin);
      storage.setKey('fromCoin', toCoin);
    }
    storage.setKey('toCoin', name);
    setToCoin(name);
    setToOpen(false);
    wait(200).then(() => Event.emit('to_coin_changed', name));
  };

  const handleSwapCoins = () => {
    const tFrom = fromCoin;
    const tAmt = amount;
    setFromCoin(toCoin);
    setToCoin(tFrom);
    setAmount(toAmount);
    setToAmount(tAmt);
    storage.setKey('fromCoin', toCoin);
    storage.setKey('toCoin', tFrom);
    Event.emit('from_coin_changed', toCoin);
    Event.emit('to_coin_changed', tFrom);
  };

  const handleAmountChange = (e) => {
    const v = e.target.value;
    if (/^\d*\.?\d*$/.test(v)) setAmount(v);
  };

  const handleSwapNow = () => {
    if (!amount || parseFloat(amount) <= 0) {
      showError('Enter a valid amount');
      return;
    }
    if (fromCoin === toCoin) {
      showError('Select different currencies');
      return;
    }
    swapMutation.mutate({
      fromCurrency: fromCoin,
      toCurrency: toCoin,
      amount: parseFloat(amount),
    });
  };

  const feePct = fromCoin.toLowerCase() === 'bjt' ? 0 : fromCoin.toLowerCase() === 'inr' ? 0.15 : 0.01;
  const feeText = fromCoin.toLowerCase() === 'bjt' ? 'No Fee' : `${feePct * 100}%`;

  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFromOpen(false);
        setToOpen(false);
      }
    };
    document.addEventListener('click', fn);
    return () => document.removeEventListener('click', fn);
  }, []);

  const renderDropdown = (open, currentData, onSelect) => {
    if (!open) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-1 p-2 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] shadow-lg z-50 max-h-56 overflow-y-auto">
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
        {filteredCoins.map((coin) => (
          <button
            key={coin.id}
            type="button"
            onClick={() => onSelect(coin.preffix)}
            className={`w-full flex items-center gap-2 p-2 rounded text-sm text-left ${
              currentData?.preffix === coin.preffix ? 'bg-[var(--color-control-primary)]' : ''
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
    );
  };

  const isLoading = swapMutation.isPending;

  return (
    <div ref={dropdownRef} className="flex flex-col gap-4 p-4">
      {/* From */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">From</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={handleAmountChange}
            className="flex-1 p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm font-medium text-right focus:outline-none focus:border-[var(--color-button-primary)]"
          />
          <div className="relative w-[140px] shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFromOpen(!fromOpen);
                setToOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {fromCoinData && (
                  <img
                    src={getCoinImagePath(fromCoinData)}
                    alt={fromCoin}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                    onError={(e) => (e.target.src = '/assets/images/coins/BTC.webp')}
                  />
                )}
                <span className="truncate">{fromCoin}</span>
              </div>
              <ChevronDown size={16} className="shrink-0" />
            </button>
            {renderDropdown(fromOpen, fromCoinData, handleFromSelect)}
          </div>
        </div>
      </div>

      {/* Swap button */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-[var(--color-border)]" />
        <button
          type="button"
          onClick={handleSwapCoins}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] hover:bg-[var(--color-control-primary)]"
          aria-label="Swap"
        >
          <ArrowUpDown size={20} />
        </button>
        <div className="flex-1 h-px bg-[var(--color-border)]" />
      </div>

      {/* To */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-[var(--color-foreground-muted-1)]">To</label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            readOnly
            placeholder="0.00"
            value={toAmount}
            className="flex-1 p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm font-medium text-right opacity-90"
          />
          <div className="relative w-[140px] shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setToOpen(!toOpen);
                setFromOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-foreground-primary)] text-sm"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                {toCoinData && (
                  <img
                    src={getCoinImagePath(toCoinData)}
                    alt={toCoin}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                    onError={(e) => (e.target.src = '/assets/images/coins/BTC.webp')}
                  />
                )}
                <span className="truncate">{toCoin}</span>
              </div>
              <ChevronDown size={16} className="shrink-0" />
            </button>
            {renderDropdown(toOpen, toCoinData, handleToSelect)}
          </div>
        </div>
      </div>

      {/* Summary */}
      {amount && parseFloat(amount) > 0 && (
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm">
          <div className="flex justify-between text-[var(--color-foreground-muted-1)]">
            <span>Rate</span>
            <span className="text-[var(--color-foreground-primary)]">
              1 {fromCoin} ≈ {baseRate} {toCoin}
            </span>
          </div>
          {fromCoin.toLowerCase() !== 'bjt' && (
            <div className="flex justify-between text-[var(--color-foreground-muted-1)]">
              <span>Fee</span>
              <span className="text-[var(--color-foreground-primary)]">{feeText}</span>
            </div>
          )}
          {parseFloat(toAmount) > 0 && (
            <div className="flex justify-between font-medium text-[var(--color-foreground-primary)]">
              <span>You receive</span>
              <span className="text-[var(--color-button-primary)]">
                {toAmount} {toCoin}
              </span>
            </div>
          )}
        </div>
      )}

      <Button
        type="button"
        variant="primary"
        className="w-full"
        disabled={isLoading || !amount || parseFloat(amount) <= 0 || fromCoin === toCoin}
        onClick={handleSwapNow}
      >
        {isLoading ? 'Processing...' : 'Swap Now'}
      </Button>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--color-surface-2)] border-l-4 border-[var(--color-button-primary)]">
        <Info size={18} className="shrink-0 mt-0.5 text-[var(--color-button-primary)]" />
        <p className="text-xs text-[var(--color-foreground-primary)]">
          Fiat can only be converted to USDT.
        </p>
      </div>
    </div>
  );
}
