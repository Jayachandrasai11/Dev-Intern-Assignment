export interface PriceTextProps {
  amount?: number;
  unit: 'kwh' | 'min' | 'session' | 'idle' | 'free';
  currency?: string;
  emphasis?: boolean;
}

const UNIT_SUFFIX: Record<Exclude<PriceTextProps['unit'], 'free'>, string> = {
  kwh: '/kWh',
  min: '/min',
  session: ' session',
  idle: '/min idle',
};

export function PriceText({
  amount,
  unit,
  currency = '$',
  emphasis,
}: PriceTextProps) {
  if (unit === 'free') {
    return <span className="ev-price-text ev-price-text--free">Free</span>;
  }
  return (
    <span
      className={`ev-price-text${emphasis ? ' ev-price-text--emphasis' : ''}`}
    >
      {currency}
      {(amount ?? 0).toFixed(2)}
      <span className="ev-price-text__unit">{UNIT_SUFFIX[unit]}</span>
    </span>
  );
}
