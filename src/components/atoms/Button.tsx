import React from 'react';
import { Spinner } from './Spinner';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'solid',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`ev-button ev-button--${variant} ev-button--${size} ${className}`}
      disabled={disabled || loading}
      data-loading={loading || undefined}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      <span className="ev-button__label">{children}</span>
    </button>
  );
}
