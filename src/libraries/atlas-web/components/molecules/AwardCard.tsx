import { Icon } from '../atoms';

export interface AwardCardProps {
  title: string;
  outlet: string;
  year: string;
}

/** Press-strip unit — award title, outlet and year under a brand star. */
export function AwardCard({ title, outlet, year }: AwardCardProps) {
  return (
    <div className="atlas-awardcard">
      <span className="atlas-awardcard__icon">
        <Icon name="star" size={22} />
      </span>
      <span className="atlas-awardcard__title">{title}</span>
      <span className="atlas-awardcard__meta">
        {outlet} · {year}
      </span>
    </div>
  );
}
