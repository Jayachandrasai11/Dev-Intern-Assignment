import type { ChargerStatus } from '../status';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

/** Payment vocabulary stays separate from the charger vocabulary but maps
 *  onto the same pinned status plumbing (the Alert tone pattern). */
const PAYMENT_STATUS: Record<PaymentStatus, ChargerStatus> = {
  paid: 'available',
  pending: 'occupied',
  failed: 'faulted',
  refunded: 'in-use',
};

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  paid: 'Paid',
  pending: 'Payment pending',
  failed: 'Payment failed',
  refunded: 'Refunded',
};

export interface PaymentStatusTagProps {
  status: PaymentStatus;
  /** Override the default label copy. */
  label?: string;
}

export function PaymentStatusTag({ status, label }: PaymentStatusTagProps) {
  return (
    <span className={`ev-payment-tag ev-status--${PAYMENT_STATUS[status]}`}>
      {label ?? PAYMENT_LABELS[status]}
    </span>
  );
}
