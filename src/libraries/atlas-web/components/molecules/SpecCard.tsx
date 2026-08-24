import { Icon } from '../atoms';
import type { AtlasIconName } from '../atoms';

export interface SpecCardProps {
  icon?: AtlasIconName;
  /** The big stat, e.g. "165". */
  value: string;
  /** Unit rendered beside the value, e.g. "km". */
  unit?: string;
  /** Caption under the stat, e.g. "Certified range". */
  label: string;
}

/** Product spec stat — the "165 km · Certified range" units on model pages. */
export function SpecCard({ icon, value, unit, label }: SpecCardProps) {
  return (
    <div className="atlas-speccard">
      {icon && (
        <span className="atlas-speccard__icon">
          <Icon name={icon} size={20} />
        </span>
      )}
      <div className="atlas-speccard__stat">
        <span className="atlas-speccard__value">{value}</span>
        {unit && <span className="atlas-speccard__unit">{unit}</span>}
      </div>
      <span className="atlas-speccard__label">{label}</span>
    </div>
  );
}
