import React from 'react';
import { Icon } from '../atoms';
import type { AtlasIconName } from '../atoms';

export interface AdvantageCardProps {
  icon: AtlasIconName;
  title: string;
  /** Body copy. */
  children: React.ReactNode;
}

/** Icon + title + body copy — the "advantage" grid units on the homepage. */
export function AdvantageCard({ icon, title, children }: AdvantageCardProps) {
  return (
    <div className="atlas-advantage">
      <span className="atlas-advantage__icon">
        <Icon name={icon} size={22} />
      </span>
      <h3 className="atlas-advantage__title">{title}</h3>
      <p className="atlas-advantage__body">{children}</p>
    </div>
  );
}
