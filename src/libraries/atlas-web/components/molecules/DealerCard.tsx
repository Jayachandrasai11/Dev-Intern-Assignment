import { Chip, Icon, LinkCta } from '../atoms';

export interface DealerCardProps {
  name: string;
  address: string;
  city: string;
  distanceKm: number;
  open: boolean;
  phone: string;
}

/** Dealer-locator result card — name, address, distance, open state, call CTA. */
export function DealerCard({
  name,
  address,
  city,
  distanceKm,
  open,
  phone,
}: DealerCardProps) {
  return (
    <div className="atlas-dealercard">
      <div className="atlas-dealercard__head">
        <span className="atlas-dealercard__name">{name}</span>
        <Chip tone={open ? 'success' : 'neutral'}>{open ? 'Open now' : 'Closed'}</Chip>
      </div>
      <p className="atlas-dealercard__address">
        {address}, {city}
      </p>
      <div className="atlas-dealercard__meta">
        <span className="atlas-dealercard__pin">
          <Icon name="map-pin" size={16} />
        </span>
        <span className="atlas-dealercard__distance">{distanceKm} km away</span>
      </div>
      <div className="atlas-dealercard__foot">
        <LinkCta size="s" tone="brand" arrow={false} href={`tel:${phone.replace(/\s/g, '')}`}>
          <span className="atlas-dealercard__call">
            <Icon name="phone" size={14} /> {phone}
          </span>
        </LinkCta>
        <LinkCta size="s" tone="ink" href="#">
          Directions
        </LinkCta>
      </div>
    </div>
  );
}
