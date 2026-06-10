import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useSelector, useDispatch } from 'react-redux';
import { QRCode } from 'react-qrcode-logo';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, X, Copy, Check, IndianRupee, Landmark, Smartphone, Upload } from 'lucide-react';
import { deposit } from '@/store/walletSlice.js';

const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n || 0);

const QUICK = [100, 500, 1000, 2000, 5000, 10000];
const MIN = 100;

// Static demo payment details (manual deposit)
const UPI_ID = 'megalotto@okaxis';
const BANK = {
  name: 'Mega Lotto Payments',
  account: '5021 7788 1290',
  ifsc: 'HDFC0001234',
  bank: 'HDFC Bank',
};

function CopyRow({ label, value }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] bg-[var(--color-surface-2)] px-4 py-3">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-foreground-muted-2)]">{label}</p>
        <p className="truncate text-[14px] font-bold text-[var(--color-foreground-primary)]">{value}</p>
      </div>
      <button type="button" onClick={copy} aria-label={t('wallet.copyLabel', 'Copy {{label}}', { label })} className="shrink-0 text-[var(--color-foreground-muted-1)] hover:text-[var(--color-green-1)] cursor-pointer">
        {copied ? <Check size={18} className="text-[var(--color-green-1)]" /> : <Copy size={18} />}
      </button>
    </div>
  );
}

export function DepositModal({ open, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const balance = useSelector((s) => s.wallet.balance);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi'); // 'upi' | 'bank'
  const [reference, setReference] = useState('');
  const [screenshot, setScreenshot] = useState(null); // payment proof (File)

  const amt = parseInt(amount || '0', 10);
  const valid = amt >= MIN && reference.trim().length >= 6;

  const onFile = (e) => { const f = e.target.files?.[0]; if (f) setScreenshot(f); };

  const reset = () => { setAmount(''); setReference(''); setMethod('upi'); setScreenshot(null); };
  const close = () => { reset(); onClose(); };

  const confirm = () => {
    if (amt < MIN) { toast.error(t('wallet.minDepositError', 'Minimum deposit is ₹{{min}}', { min: MIN })); return; }
    if (reference.trim().length < 6) { toast.error(t('wallet.invalidUtrError', 'Enter a valid UTR / Reference number')); return; }
    dispatch(deposit(amt));
    toast.success(t('wallet.depositAddedToast', '{{amount}} added to your wallet', { amount: fmtINR(amt) }));
    close();
  };

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Mega%20Lotto&am=${amt || ''}&cu=INR`;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-index-drawer-portal)] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[var(--z-index-drawer-portal)] flex max-h-[92dvh] w-[min(380px,calc(100vw-16px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[28px] bg-[var(--color-background-overlay,var(--color-surface-1))] border border-[var(--color-foreground-muted-1)]/10 shadow-2xl outline-none"
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center gap-2 p-4 pb-2">
            <Dialog.Close asChild>
              <button type="button" aria-label={t('wallet.back', 'Back')} className="flex size-9 items-center justify-center rounded-full text-[var(--color-foreground-muted-1)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground-primary)] cursor-pointer">
                <ArrowLeft size={18} />
              </button>
            </Dialog.Close>
            <Dialog.Title className="flex-1 text-center text-[15px] font-extrabold uppercase tracking-wide text-[var(--color-foreground-primary)]">
              {t('wallet.deposit', 'Deposit')}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label={t('wallet.close', 'Close')} className="flex size-9 items-center justify-center rounded-full text-[var(--color-foreground-muted-1)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground-primary)] cursor-pointer">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          <p className="-mt-1 pb-2 text-center text-xs text-[var(--color-foreground-muted-2)]">{t('wallet.balance', 'Balance {{amount}}', { amount: fmtINR(balance) })}</p>

          {/* Body */}
          <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-5">
            {/* Amount */}
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-wide text-[var(--color-foreground-primary)]">{t('wallet.amount', 'Amount')}</label>
            <div className="flex items-center gap-2 rounded-[14px] bg-[var(--color-surface-2)] px-4 py-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-green-1)] text-[var(--color-base-14)]"><IndianRupee size={15} strokeWidth={2.6} /></span>
              <input
                type="number"
                inputMode="numeric"
                min={MIN}
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                placeholder={t('wallet.enterAmountMin', 'Enter amount (min ₹{{min}})', { min: MIN })}
                className="min-w-0 flex-1 bg-transparent text-[18px] font-bold text-[var(--color-foreground-primary)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className={`rounded-full py-2 text-[13px] font-bold transition-colors cursor-pointer ${amt === q ? 'bg-[var(--color-green-1)] text-[var(--color-base-14)]' : 'bg-[var(--color-surface-2)] text-[var(--color-foreground-primary)] hover:bg-[var(--color-surface-3)]'}`}
                >
                  ₹{q.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Method tabs */}
            <div className="mt-5 flex gap-2 rounded-full bg-[var(--color-surface-2)] p-1">
              {[{ k: 'upi', label: t('wallet.upi', 'UPI'), Icon: Smartphone }, { k: 'bank', label: t('wallet.bankTransfer', 'Bank Transfer'), Icon: Landmark }].map(({ k, label, Icon }) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMethod(k)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-bold uppercase tracking-wide transition-colors cursor-pointer ${method === k ? 'bg-[var(--color-green-1)] text-[var(--color-base-14)]' : 'text-[var(--color-foreground-muted-1)] hover:text-[var(--color-foreground-primary)]'}`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>

            {/* UPI */}
            {method === 'upi' && (
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="rounded-[20px] bg-white p-3">
                  <QRCode value={upiLink} size={150} qrStyle="dots" eyeRadius={6} />
                </div>
                <p className="text-center text-xs text-[var(--color-foreground-muted-2)]">{t('wallet.scanUpiHint', 'Scan with any UPI app, or pay to the UPI ID below')}</p>
                <div className="w-full"><CopyRow label={t('wallet.upiId', 'UPI ID')} value={UPI_ID} /></div>
              </div>
            )}

            {/* Bank */}
            {method === 'bank' && (
              <div className="mt-4 flex flex-col gap-2">
                <CopyRow label={t('wallet.accountHolder', 'Account Holder')} value={BANK.name} />
                <CopyRow label={t('wallet.accountNumber', 'Account Number')} value={BANK.account} />
                <CopyRow label={t('wallet.ifscCode', 'IFSC Code')} value={BANK.ifsc} />
                <CopyRow label={t('wallet.bank', 'Bank')} value={BANK.bank} />
              </div>
            )}

            {/* Manual deposit: reference */}
            <label className="mb-2 mt-5 block text-[12px] font-bold uppercase tracking-wide text-[var(--color-foreground-primary)]">{t('wallet.utrReferenceNo', 'UTR / Reference No.')}</label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={t('wallet.enterTransactionReference', 'Enter your transaction reference')}
              className="w-full rounded-[14px] bg-[var(--color-surface-2)] px-4 py-3 text-[15px] font-semibold text-[var(--color-foreground-primary)] outline-none placeholder:text-[var(--color-foreground-muted-2)]"
            />

            {/* Payment screenshot upload (optional proof) */}
            <label className="mb-2 mt-5 block text-[12px] font-bold uppercase tracking-wide text-[var(--color-foreground-primary)]">
              {t('wallet.paymentScreenshot', 'Payment Screenshot')} <span className="font-medium normal-case text-[var(--color-foreground-muted-2)]">{t('wallet.optional', '(optional)')}</span>
            </label>
            {screenshot ? (
              <div className="flex items-center gap-3 rounded-[14px] bg-[var(--color-surface-2)] p-3">
                <img src={URL.createObjectURL(screenshot)} alt={t('wallet.proofAlt', 'proof')} className="size-12 shrink-0 rounded-[10px] object-cover" />
                <span className="flex-1 truncate text-[13px] font-semibold text-[var(--color-foreground-primary)]">{screenshot.name}</span>
                <button type="button" onClick={() => setScreenshot(null)} aria-label={t('wallet.removeScreenshot', 'Remove screenshot')} className="shrink-0 text-[var(--color-foreground-muted-1)] hover:text-[var(--color-danger)] cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-2 border-dashed border-[var(--color-foreground-muted-1)]/20 py-5 text-[var(--color-foreground-muted-2)] transition-colors hover:border-[var(--color-green-1)]/50 hover:text-[var(--color-foreground-muted-1)]">
                <Upload size={20} />
                <span className="text-[13px] font-semibold">{t('wallet.uploadPaymentScreenshot', 'Upload payment screenshot')}</span>
                <span className="text-[11px]">{t('wallet.pngJpg', 'PNG / JPG')}</span>
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
            )}

            <div className="mt-3 rounded-[14px] bg-[var(--color-surface-2)]/60 px-4 py-3 text-[12px] leading-relaxed text-[var(--color-foreground-muted-2)]">
              {t('wallet.payInstructions', 'Pay the amount via {{method}}, then enter the UTR / reference number and confirm. Your balance updates instantly.', { method: method === 'upi' ? t('wallet.upi', 'UPI') : t('wallet.bankTransferLower', 'bank transfer') })}
            </div>

            <button
              type="button"
              onClick={confirm}
              disabled={!valid}
              className={`mt-4 w-full rounded-full py-3.5 text-[15px] font-bold uppercase tracking-wide transition ${valid ? 'cursor-pointer bg-[var(--color-green-1)] text-[var(--color-base-14)] hover:brightness-110 active:scale-[0.98]' : 'cursor-not-allowed bg-[var(--color-surface-3)] text-[var(--color-foreground-muted-2)]'}`}
            >
              {t('wallet.confirmDeposit', 'Confirm Deposit')}{amt >= MIN ? ` · ${fmtINR(amt)}` : ''}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default DepositModal;
