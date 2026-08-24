import React from 'react';

export interface FilterChipProps {
  active?: boolean;
  count?: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export function FilterChip({
  active,
  count,
  icon,
  children,
  onClick,
}: FilterChipProps) {
  return (
    <button
      type="button"
      className={`ev-filter-chip${active ? ' ev-filter-chip--active' : ''}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span className="ev-filter-chip__count">{count}</span>
      )}
    </button>
  );
}
