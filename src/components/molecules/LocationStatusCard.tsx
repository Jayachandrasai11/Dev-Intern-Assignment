import { FreshnessIndicator, StatusBadge } from '../atoms';
import type { LocationData } from '../data';

export interface LocationStatusCardProps {
  location: LocationData;
  /** Opens the cluster-status view. Deliberately NOT a charging start —
   *  every new session begins with a fresh scan or manual code. */
  onClick?: () => void;
}

/** Home status surface for a previously scanned community location. */
export function LocationStatusCard({
  location,
  onClick,
}: LocationStatusCardProps) {
  const l = location;
  const badge =
    l.freshness === 'unknown' ? (
      <StatusBadge status="unknown" />
    ) : (
      <StatusBadge
        status={l.free > 0 ? 'available' : 'in-use'}
        form="count"
        count={{ free: l.free, total: l.total }}
        label={l.free > 0 ? 'free' : 'in use'}
      />
    );
  const body = (
    <>
      <span className="ev-location-card__main">
        <span className="ev-location-card__name">{l.name}</span>
        {l.address && (
          <span className="ev-location-card__address">{l.address}</span>
        )}
        <span className="ev-location-card__status">
          {badge}
          <FreshnessIndicator state={l.freshness} label={l.updatedLabel} />
        </span>
      </span>
      <svg viewBox="0 0 24 24" className="ev-location-card__chevron" aria-hidden>
        <path
          d="M9 5 L16 12 L9 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
  return onClick ? (
    <button type="button" className="ev-location-card" onClick={onClick}>
      {body}
    </button>
  ) : (
    <div className="ev-location-card">{body}</div>
  );
}
