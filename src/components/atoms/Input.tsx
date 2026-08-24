import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  kind?: 'default' | 'search';
  error?: boolean;
}

export function Input({ kind = 'default', error, ...rest }: InputProps) {
  return (
    <span
      className={`ev-input${error ? ' ev-input--error' : ''}${
        kind === 'search' ? ' ev-input--search' : ''
      }`}
    >
      {kind === 'search' && (
        <svg viewBox="0 0 24 24" className="ev-input__icon" aria-hidden>
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M15.5 15.5 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      <input type={kind === 'search' ? 'search' : 'text'} {...rest} />
    </span>
  );
}
