import { CONNECTOR_LABELS, FreshnessIndicator, StatusBadge } from '../atoms';
import type { ConnectorType, Freshness } from '../atoms';
import type { ChargerStatus } from '../status';

export interface ChargerStatusRowProps {
  /** The visible manual charger code printed on the unit. */
  code: string;
  status: ChargerStatus;
  kw?: number;
  connector?: ConnectorType;
  freshness?: Freshness;
  freshnessLabel?: string;
}

/** Per-charger row for the cluster-status view. Status-only: identifying
 *  the charger to start still requires a fresh scan or code entry. */
export function ChargerStatusRow({
  code,
  status,
  kw,
  connector,
  freshness = 'fresh',
  freshnessLabel,
}: ChargerStatusRowProps) {
  const meta = [
    connector ? CONNECTOR_LABELS[connector] : null,
    kw != null ? `${kw} kW` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <div className="ev-charger-row">
      <span className="ev-charger-row__code">{code}</span>
      <span className="ev-charger-row__meta">{meta}</span>
      <span className="ev-charger-row__status">
        <StatusBadge status={status} />
        {freshnessLabel && (
          <FreshnessIndicator state={freshness} label={freshnessLabel} />
        )}
      </span>
    </div>
  );
}
