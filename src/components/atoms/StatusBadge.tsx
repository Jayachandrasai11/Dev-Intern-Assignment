import type { ChargerStatus } from '../status';
import { STATUS_LABELS } from '../status';

export interface StatusBadgeProps {
  status: ChargerStatus;
  form?: 'dot' | 'pill' | 'count';
  /** Stall availability, shown by the 'count' form as free/total. */
  count?: { free: number; total: number };
  label?: string;
}

export function StatusBadge({
  status,
  form = 'pill',
  count,
  label,
}: StatusBadgeProps) {
  const text = label ?? STATUS_LABELS[status];
  if (form === 'dot') {
    return (
      <span
        className={`ev-status-dot ev-status--${status}`}
        role="img"
        aria-label={text}
      />
    );
  }
  return (
    <span className={`ev-status-badge ev-status--${status}`}>
      <span className="ev-status-dot" aria-hidden />
      {form === 'count' && count ? (
        <>
          <strong>
            {count.free}/{count.total}
          </strong>
          {text}
        </>
      ) : (
        text
      )}
    </span>
  );
}
