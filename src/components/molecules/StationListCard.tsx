import { Button, PowerText, PriceText, StatusBadge, Tag } from '../atoms';
import type { StationData } from '../data';
import { ConnectorChip } from './ConnectorChip';

export interface StationListCardProps {
  station: StationData;
  variant?: 'default' | 'compact' | 'selected';
}

export function StationListCard({
  station,
  variant = 'default',
}: StationListCardProps) {
  const s = station;
  return (
    <article
      className={`ev-station-card ev-station-card--${variant}`}
      aria-label={s.name}
    >
      <header className="ev-station-card__header">
        <div>
          <h3 className="ev-station-card__name">{s.name}</h3>
          <p className="ev-station-card__meta">
            {s.network} · {s.distanceKm.toFixed(1)} km · {s.address}
          </p>
        </div>
        <StatusBadge
          status={s.status}
          form={s.status === 'available' ? 'count' : 'pill'}
          count={{ free: s.free, total: s.total }}
        />
      </header>

      {variant !== 'compact' && (
        <div className="ev-station-card__connectors">
          {dedupeTypes(s).map((c) => (
            <ConnectorChip
              key={c.type}
              type={c.type}
              status={c.status}
              kw={c.kw}
            />
          ))}
        </div>
      )}

      <footer className="ev-station-card__footer">
        <div className="ev-station-card__facts">
          <PowerText kw={s.maxKw} tier={s.tier} />
          <PriceText amount={s.pricePerKwh} unit="kwh" />
          {variant !== 'compact' &&
            s.amenities.slice(0, 2).map((a) => <Tag key={a}>{a}</Tag>)}
        </div>
        <Button size="sm" variant="soft">
          Navigate
        </Button>
      </footer>
    </article>
  );
}

function dedupeTypes(s: StationData) {
  const seen = new Set<string>();
  return s.connectors.filter((c) =>
    seen.has(c.type) ? false : (seen.add(c.type), true),
  );
}
