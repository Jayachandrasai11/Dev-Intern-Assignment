import { Tag } from '../atoms';

export type PaymentBrand = 'visa' | 'mc' | 'amex' | 'applepay' | 'add';

export interface PaymentMethodRowProps {
  brand: PaymentBrand;
  last4?: string;
  isDefault?: boolean;
  onClick?: () => void;
}

const BRAND_LABELS: Record<PaymentBrand, string> = {
  visa: 'Visa',
  mc: 'Mastercard',
  amex: 'Amex',
  applepay: 'Apple Pay',
  add: 'Add payment method',
};

const BRAND_MARKS: Record<Exclude<PaymentBrand, 'add'>, string> = {
  visa: 'VISA',
  mc: 'MC',
  amex: 'AMEX',
  applepay: 'Pay',
};

export function PaymentMethodRow({
  brand,
  last4,
  isDefault,
  onClick,
}: PaymentMethodRowProps) {
  if (brand === 'add') {
    return (
      <button type="button" className="ev-payment-row ev-payment-row--add" onClick={onClick}>
        <span className="ev-payment-row__mark" aria-hidden>
          +
        </span>
        {BRAND_LABELS.add}
      </button>
    );
  }
  return (
    <button type="button" className="ev-payment-row" onClick={onClick}>
      <span className={`ev-payment-row__mark ev-payment-row__mark--${brand}`}>
        {BRAND_MARKS[brand]}
      </span>
      <span className="ev-payment-row__label">
        {BRAND_LABELS[brand]}
        {last4 && <span className="ev-payment-row__last4"> ···· {last4}</span>}
      </span>
      {isDefault && <Tag tone="accent">Default</Tag>}
      <svg viewBox="0 0 24 24" className="ev-payment-row__chevron" aria-hidden>
        <path d="M9 6 l6 6 -6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
