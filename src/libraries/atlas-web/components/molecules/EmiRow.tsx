export interface EmiRowProps {
  label: string;
  value: string;
  /** Emphasize the row — totals / savings lines in the calculator. */
  highlight?: boolean;
}

/** Label + value row for the EMI / savings calculators. */
export function EmiRow({ label, value, highlight = false }: EmiRowProps) {
  return (
    <div className={`atlas-emirow${highlight ? ' atlas-emirow--highlight' : ''}`}>
      <span className="atlas-emirow__label">{label}</span>
      <span className="atlas-emirow__value">{value}</span>
    </div>
  );
}
