import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...rest }: InputProps) {
  const inputId = id ?? (label ? `atlas-in-${label.replace(/\W+/g, '-').toLowerCase()}` : undefined);
  return (
    <span className={`atlas-field ${className}`}>
      {label && (
        <label className="atlas-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`atlas-input${error ? ' atlas-input--error' : ''}`}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && <span className="atlas-field__error">{error}</span>}
    </span>
  );
}
