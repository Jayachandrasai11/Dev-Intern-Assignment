import type { ChargerStatus } from '../status';
import { STATUS_LABELS } from '../status';

export interface MapPinProps {
  status: ChargerStatus;
  /** Free-stall count badge. */
  count?: number;
  selected?: boolean;
  /** Cluster pin: renders a circle with the number of stations. */
  cluster?: number;
}

const BOLT = 'M20 8 L12.5 19.5 h5 L16 30 l7.5-11.5 H18 Z';

export function MapPin({ status, count, selected, cluster }: MapPinProps) {
  if (cluster !== undefined) {
    return (
      <span className="ev-map-pin ev-map-pin--cluster" role="img" aria-label={`${cluster} stations`}>
        {cluster}
      </span>
    );
  }
  return (
    <span
      className={`ev-map-pin ev-status--${status}${
        selected ? ' ev-map-pin--selected' : ''
      }`}
      role="img"
      aria-label={STATUS_LABELS[status]}
    >
      <svg viewBox="0 0 36 40" className="ev-map-pin__body">
        <path
          d="M18 1.5 C9.5 1.5 3 8 3 16.5 c0 9.5 12.4 20.5 15 22 2.6-1.5 15-12.5 15-22 C33 8 26.5 1.5 18 1.5 Z"
          className="ev-map-pin__shape"
        />
        <path d={BOLT} className="ev-map-pin__bolt" />
      </svg>
      {count !== undefined && (
        <span className="ev-map-pin__count">{count}</span>
      )}
    </span>
  );
}
