import React from 'react';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, options, className = '', id, ...rest }: SelectProps) {
  const selectId = id ?? (label ? `atlas-sel-${label.replace(/\W+/g, '-').toLowerCase()}` : undefined);
  return (
    <span className={`atlas-field ${className}`}>
      {label && (
        <label className="atlas-field__label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select id={selectId} className="atlas-select" {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </span>
  );
}
