import React from 'react';

export interface SessionStatProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  form?: 'row' | 'tile';
}

export function SessionStat({
  icon,
  label,
  value,
  unit,
  form = 'row',
}: SessionStatProps) {
  if (form === 'tile') {
    return (
      <div className="ev-session-stat-tile">
        <span className="ev-session-stat-tile__value">
          {value}
          {unit && <span className="ev-session-stat-tile__unit"> {unit}</span>}
        </span>
        <span className="ev-session-stat-tile__label">{label}</span>
      </div>
    );
  }
  return (
    <div className="ev-session-stat-row">
      <span className="ev-session-stat-row__label">
        {icon}
        {label}
      </span>
      <span className="ev-session-stat-row__value">
        {value}
        {unit && <span className="ev-session-stat-row__unit"> {unit}</span>}
      </span>
    </div>
  );
}
