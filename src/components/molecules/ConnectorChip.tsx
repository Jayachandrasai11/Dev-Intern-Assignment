import { ConnectorIcon, CONNECTOR_LABELS, PriceText, StatusBadge } from '../atoms';
import type { ConnectorType } from '../atoms';
import type { ChargerStatus } from '../status';

export interface ConnectorChipProps {
  type: ConnectorType;
  status: ChargerStatus;
  kw?: number;
  pricePerKwh?: number;
  form?: 'chip' | 'row';
  selected?: boolean;
  stallId?: string;
  onSelect?: () => void;
}

export function ConnectorChip({
  type,
  status,
  kw,
  pricePerKwh,
  form = 'chip',
  selected,
  stallId,
  onSelect,
}: ConnectorChipProps) {
  const unavailable =
    status === 'faulted' || status === 'offline' || status === 'occupied';

  if (form === 'chip') {
    return (
      <span
        className={`ev-connector-chip ev-status--${status}${
          selected ? ' ev-connector-chip--selected' : ''
        }`}
      >
        <ConnectorIcon type={type} size={18} muted={unavailable} />
        <span className="ev-connector-chip__label">
          {CONNECTOR_LABELS[type]}
        </span>
        {kw !== undefined && (
          <span className="ev-connector-chip__kw">{kw} kW</span>
        )}
        <span className="ev-status-dot" aria-label={status} />
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`ev-connector-row ev-status--${status}${
        selected ? ' ev-connector-row--selected' : ''
      }`}
      onClick={onSelect}
      disabled={unavailable}
    >
      <ConnectorIcon type={type} size={28} muted={unavailable} />
      <span className="ev-connector-row__main">
        <span className="ev-connector-row__title">
          {CONNECTOR_LABELS[type]}
          {stallId && (
            <span className="ev-connector-row__stall"> · Stall {stallId}</span>
          )}
        </span>
        {kw !== undefined && (
          <span className="ev-connector-row__kw">{kw} kW max</span>
        )}
      </span>
      <span className="ev-connector-row__side">
        {pricePerKwh !== undefined && (
          <PriceText amount={pricePerKwh} unit="kwh" />
        )}
        <StatusBadge status={status} />
      </span>
    </button>
  );
}
