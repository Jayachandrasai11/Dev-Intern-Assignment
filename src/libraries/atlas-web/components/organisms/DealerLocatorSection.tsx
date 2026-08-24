import { Heading, Icon, Input, Select, Text } from '../atoms';
import { DealerCard } from '../molecules';

export interface DealerLocatorDealer {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  distanceKm: number;
  open: boolean;
}

export interface DealerLocatorSectionProps {
  title?: string;
  subtitle?: string;
  dealers: DealerLocatorDealer[];
  /** City filter options; derived from the dealers when omitted. */
  cities?: string[];
  searchPlaceholder?: string;
}

/** Dealer-locator section — heading, search + city filters, dealer-card list
 *  on the left, map placeholder panel on the right. */
export function DealerLocatorSection({
  title = 'Find a Atlas dealer near you',
  subtitle,
  dealers,
  cities,
  searchPlaceholder = 'Search by area or pincode',
}: DealerLocatorSectionProps) {
  const cityOptions = (
    cities ?? Array.from(new Set(dealers.map((d) => d.city)))
  ).map((city) => ({ value: city, label: city }));
  return (
    <section className="atlas-locator">
      <div className="atlas-locator__head">
        <Heading size="m">{title}</Heading>
        {subtitle && <Text muted>{subtitle}</Text>}
      </div>
      <div className="atlas-locator__filters">
        <Input aria-label="Search dealers" placeholder={searchPlaceholder} />
        <Select aria-label="City" options={cityOptions} />
      </div>
      <div className="atlas-locator__body">
        <div className="atlas-locator__list">
          {dealers.map((d) => (
            <DealerCard
              key={d.id}
              name={d.name}
              address={d.address}
              city={d.city}
              distanceKm={d.distanceKm}
              open={d.open}
              phone={d.phone}
            />
          ))}
        </div>
        <div className="atlas-locator__map" aria-hidden>
          <span className="atlas-locator__map-pin">
            <Icon name="map-pin" size={36} />
          </span>
          <span className="atlas-locator__map-label">Map view</span>
        </div>
      </div>
    </section>
  );
}
