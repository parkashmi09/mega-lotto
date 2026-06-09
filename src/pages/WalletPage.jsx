import { useSearchParams } from 'react-router-dom';

const MODES = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  swap: 'Swap',
};

export function WalletPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'deposit';
  const title = MODES[mode] || MODES.deposit;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      <section className="rounded-lg bg-[var(--color-surface-1)] p-6 border border-[var(--color-border)]">
        <h1 className="text-xl font-semibold text-[var(--color-foreground-primary)] mb-2">
          Wallet — {title}
        </h1>
        <p className="text-sm text-[var(--color-foreground-muted-1)]">
          Wallet {title.toLowerCase()} flow will be available here.
        </p>
      </section>
    </div>
  );
}

export default WalletPage;
