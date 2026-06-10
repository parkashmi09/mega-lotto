import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function WalletPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'deposit';
  const MODES = {
    deposit: t('wallet.deposit', 'Deposit'),
    withdraw: t('wallet.withdraw', 'Withdraw'),
    swap: t('wallet.swap', 'Swap'),
  };
  const title = MODES[mode] || MODES.deposit;

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      <section className="rounded-lg bg-[var(--color-surface-1)] p-6 border border-[var(--color-border)]">
        <h1 className="text-xl font-semibold text-[var(--color-foreground-primary)] mb-2">
          {t('wallet.walletTitle', 'Wallet — {{title}}', { title })}
        </h1>
        <p className="text-sm text-[var(--color-foreground-muted-1)]">
          {t('wallet.walletFlowMessage', 'Wallet {{mode}} flow will be available here.', { mode: title.toLowerCase() })}
        </p>
      </section>
    </div>
  );
}

export default WalletPage;
