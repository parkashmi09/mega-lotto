import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown, Plus, ArrowUpFromLine, IndianRupee, Check } from 'lucide-react';
import { withdraw } from '@/store/walletSlice.js';
import { DepositModal } from './wallet/DepositModal.jsx';

const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n || 0);

export function WalletPopover() {
  const dispatch = useDispatch();
  const balance = useSelector((s) => s.wallet.balance);
  const [open, setOpen] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  return (
    <div className="flex items-center">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label="Balance"
            className="group rounded-24 py-[8px] pr-[14px] pl-[10px] int-hover-scale cursor-pointer text-[var(--color-foreground-primary)] flex items-center justify-between gap-[6px] bg-[var(--color-surface-2)] max-w-[calc(100dvw-190px)] min-w-[100px]"
          >
            <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[var(--color-green-1)] text-[var(--color-base-14)]">
              <IndianRupee size={14} strokeWidth={2.6} />
            </span>
            <div className="min-w-0">
              <span className="block truncate text-[15px] font-bold tabular-nums">{fmtINR(balance)}</span>
            </div>
            <ChevronDown className="size-[16px] shrink-0 transition-transform duration-300 group-data-[state=open]:-rotate-180" aria-hidden />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-[var(--z-index-popover-portal)] w-[280px] rounded-[var(--radius-lg)] bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-[0_4px_12px_rgba(0,0,0,0.2)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
            side="bottom"
            align="center"
            sideOffset={4}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {/* Total */}
            <div className="px-3 pt-3 pb-3 border-b border-[var(--color-border)]">
              <span className="text-sm font-medium text-[var(--color-foreground-muted-1)]">Wallet Balance</span>
              <div className="text-2xl font-extrabold text-[var(--color-button-primary)]">{fmtINR(balance)}</div>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-2 p-3 border-b border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => { setOpen(false); setShowDeposit(true); }}
                className="flex flex-1 flex-col items-center gap-1 rounded-[var(--radius-md)] p-2 bg-[var(--color-control-primary)] text-[var(--color-foreground-primary)] hover:bg-[var(--color-control-primary-active)] transition"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-[var(--color-surface-2)]"><Plus size={20} /></span>
                <span className="text-xs font-medium">Deposit</span>
              </button>
              <button
                type="button"
                onClick={() => dispatch(withdraw(500))}
                className="flex flex-1 flex-col items-center gap-1 rounded-[var(--radius-md)] p-2 bg-[var(--color-control-primary)] text-[var(--color-foreground-primary)] hover:bg-[var(--color-control-primary-active)] transition"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-[var(--color-surface-2)]"><ArrowUpFromLine size={20} /></span>
                <span className="text-xs font-medium">Withdraw</span>
              </button>
            </div>

            {/* Single currency: INR */}
            <div className="py-2">
              <div className="flex items-center gap-2 w-full px-3 py-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-button-primary)] text-[var(--color-button-primary-foreground)]">
                  <Check size={10} />
                </span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-green-1)] text-[var(--color-base-14)]">
                  <IndianRupee size={16} strokeWidth={2.5} />
                </span>
                <div className="flex flex-1 flex-col min-w-0">
                  <span className="text-sm font-medium text-[var(--color-foreground-primary)] truncate">Indian Rupees INR</span>
                  <span className="text-xs text-[var(--color-foreground-muted-1)]">{fmtINR(balance)}</span>
                </div>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* WALLET action button — icon-only on mobile, icon+text on sm+ */}
      <button
        type="button"
        aria-label="Wallet"
        onClick={() => setShowDeposit(true)}
        className="tActionButton tActionButton--with-text tActionButton--primary tActionButton--small ml-2 sm:ml-[12px] min-w-max grid grid-cols-1 grid-rows-1 place-items-center focusable cursor-pointer int-hover-scale"
      >
        <span className="tActionButton__container rounded-40 col-start-1 col-end-2 row-start-1 row-end-2 flex items-center justify-center max-sm:aspect-square max-sm:size-[40px]">
          <span className="tActionButton__content flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" className="tActionButton__icon">
              <path fillRule="evenodd" d="M18.097 1.617c.418.458.03 1.103-.585 1.18-2.632.333-6.444.642-9.262.703-.585.013-.723.365-.722.7 0 .17.074.314.19.422.11.103.269.129.42.128 3.674-.012 7.168-.248 9.395-.437a3.26 3.26 0 0 1 2.907 1.304 3.1 3.1 0 0 1 .585 1.604v.005q.05.66.094 1.467c-1.153.125-2.286.203-3.358.174-1.69-.045-3.632 1.13-3.732 3.33a29 29 0 0 0 .009 2.737c.096 1.669 1.342 3.056 3.06 3.253 1.319.151 2.73.094 4.03-.082A57 57 0 0 1 21 19.865c-.126 1.426-1.136 2.617-2.595 2.863-1.492.252-3.911.523-7.405.523-3.525 0-5.935-.276-7.404-.53-1.412-.244-2.4-1.384-2.546-2.768-.145-1.366-.3-3.503-.3-6.373 0-3.03.173-5.364.323-6.816.129-1.247.702-2.513 1.912-3.22C4.884 2.435 8.778.927 16.039.765c.828-.018 1.552.297 2.058.853m3.75 14.854c-1.443.272-3.1.396-4.579.226a1.95 1.95 0 0 1-1.733-1.849 26.973 26.973 0 0 1-.008-2.581c.055-1.196 1.119-1.928 2.194-1.9 1.193.032 2.429-.058 3.64-.19 1.044-.116 2.049.596 2.106 1.718a27 27 0 0 1-.007 2.778c-.057.92-.73 1.632-1.612 1.798M18.5 12.5c.483 0 .875.392.875.875v.5a.875.875 0 0 1-1.75 0v-.5c0-.483.392-.875.875-.875" clipRule="evenodd" fill="currentColor" stroke="transparent" />
            </svg>
            <span className="tActionButton__text hidden sm:inline whitespace-nowrap uppercase text-sm font-semibold">Wallet</span>
          </span>
        </span>
      </button>

      <DepositModal open={showDeposit} onClose={() => setShowDeposit(false)} />
    </div>
  );
}

export default WalletPopover;
