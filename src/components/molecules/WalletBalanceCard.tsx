import { Button, Spinner } from '../atoms';

export interface WalletBalanceCardProps {
  balance: number;
  /** Conservative upper-bound for the selected duration × charger max kW. */
  required?: number;
  currency?: string;
  state?: 'ready' | 'insufficient' | 'checking';
  onTopUp?: () => void;
  note?: string;
}

/** Wallet readiness before start. The check is a conservative estimate —
 *  the note keeps it from reading as the final bill. */
export function WalletBalanceCard({
  balance,
  required,
  currency = '$',
  state = 'ready',
  onTopUp,
  note = 'Upper-bound estimate for your selected duration — you are billed on actual units used.',
}: WalletBalanceCardProps) {
  const shortfall =
    required != null ? Math.max(0, required - balance) : undefined;
  return (
    <div className="ev-wallet">
      <div className="ev-wallet__top">
        <div className="ev-wallet__balances">
          <span className="ev-wallet__label">Wallet balance</span>
          <span className="ev-wallet__balance">
            {currency}
            {balance.toFixed(2)}
          </span>
          {required != null && state !== 'checking' && (
            <span className="ev-wallet__label">
              Needs up to {currency}
              {required.toFixed(2)}
            </span>
          )}
        </div>
        {state === 'insufficient' && onTopUp && (
          <Button variant="solid" size="sm" onClick={onTopUp}>
            Top up
          </Button>
        )}
      </div>
      <div
        className={`ev-wallet__status ev-status--${
          state === 'ready'
            ? 'available'
            : state === 'insufficient'
              ? 'faulted'
              : 'unknown'
        }`}
        role="status"
      >
        {state === 'checking' ? (
          <Spinner size="sm" />
        ) : (
          <span className="ev-status-dot" aria-hidden />
        )}
        {state === 'ready' && 'Ready to start charging'}
        {state === 'insufficient' &&
          shortfall != null &&
          `Add ${currency}${shortfall.toFixed(2)} to start`}
        {state === 'insufficient' && shortfall == null && 'Balance too low to start'}
        {/* The balance is already on the card — what's pending is the
            conservative cost estimate for the selected duration. */}
        {state === 'checking' && 'Checking charging cost…'}
      </div>
      <p className="ev-wallet__note">{note}</p>
    </div>
  );
}
