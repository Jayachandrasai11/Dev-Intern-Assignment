import React from 'react';
import { Icon } from '../atoms';
import type { IconName } from '../atoms';

export interface ListRowProps {
  label: string;
  description?: string;
  icon?: IconName;
  /** 'chevron' = disclosure arrow; pass a node for value/badge trailing. */
  trailing?: 'chevron' | 'none' | React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}

/** Navigation/list row — profile, support hub, settings, history entries. */
export function ListRow({
  label,
  description,
  icon,
  trailing = 'chevron',
  onClick,
  destructive,
}: ListRowProps) {
  const className = `ev-list-row${destructive ? ' ev-list-row--destructive' : ''}`;
  const content = (
    <>
      {icon && (
        <span className="ev-list-row__icon">
          <Icon name={icon} size={18} />
        </span>
      )}
      <span className="ev-list-row__body">
        <span className="ev-list-row__label">{label}</span>
        {description && (
          <span className="ev-list-row__desc">{description}</span>
        )}
      </span>
      {trailing === 'chevron' ? (
        <svg viewBox="0 0 24 24" className="ev-list-row__chevron" aria-hidden>
          <path
            d="M9 5 L16 12 L9 19"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : trailing === 'none' ? null : (
        <span className="ev-list-row__trailing">{trailing}</span>
      )}
    </>
  );
  return onClick ? (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}

/** Groups rows into one bordered container with dividers. */
export function ListGroup({ children }: { children: React.ReactNode }) {
  return <div className="ev-list-group">{children}</div>;
}
