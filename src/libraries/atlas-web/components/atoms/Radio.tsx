import React from 'react';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Radio({ label, className = '', ...rest }: RadioProps) {
  return (
    <label className={`atlas-radio ${className}`}>
      <input type="radio" className="atlas-radio__input" {...rest} />
      <span className="atlas-radio__dot" aria-hidden />
      {label && <span className="atlas-radio__label">{label}</span>}
    </label>
  );
}
