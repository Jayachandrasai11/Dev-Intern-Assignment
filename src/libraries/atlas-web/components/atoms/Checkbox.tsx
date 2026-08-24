import React from 'react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Checkbox({ label, className = '', ...rest }: CheckboxProps) {
  return (
    <label className={`atlas-check ${className}`}>
      <input type="checkbox" className="atlas-check__input" {...rest} />
      <span className="atlas-check__box" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 13 4 4L19 7" />
        </svg>
      </span>
      {label && <span className="atlas-check__label">{label}</span>}
    </label>
  );
}
