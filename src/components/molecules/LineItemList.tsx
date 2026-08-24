export interface LineItem {
  label: string;
  value: string;
  /** Total row: heavier type, separated by a rule. */
  emphasis?: boolean;
}

export interface LineItemListProps {
  items: LineItem[];
  /** Session metadata lines — id, charger code, timestamps. */
  meta?: string[];
}

/** Billing breakdown for session summary and receipt surfaces. */
export function LineItemList({ items, meta }: LineItemListProps) {
  return (
    <div className="ev-line-items">
      {items.map((item, i) => (
        <div
          key={i}
          className={`ev-line-items__row${item.emphasis ? ' ev-line-items__row--total' : ''}`}
        >
          <span className="ev-line-items__label">{item.label}</span>
          <span className="ev-line-items__value">{item.value}</span>
        </div>
      ))}
      {meta && meta.length > 0 && (
        <div className="ev-line-items__meta">
          {meta.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </div>
      )}
    </div>
  );
}
