export interface PriceTagProps {
  /** Display price, e.g. "₹1,35,000". */
  price: string;
  /** Strikethrough compare-at price. */
  comparePrice?: string;
  /** EMI hint line, e.g. "EMI from ₹2,999/month". */
  emiHint?: string;
  size?: 'm' | 'l';
}

/** Price display — big price, optional strikethrough compare, EMI hint line. */
export function PriceTag({ price, comparePrice, emiHint, size = 'm' }: PriceTagProps) {
  return (
    <div className={`atlas-pricetag atlas-pricetag--${size}`}>
      <div className="atlas-pricetag__row">
        <span className="atlas-pricetag__price">{price}</span>
        {comparePrice && (
          <s className="atlas-pricetag__compare">{comparePrice}</s>
        )}
      </div>
      {emiHint && <span className="atlas-pricetag__emi">{emiHint}</span>}
    </div>
  );
}
