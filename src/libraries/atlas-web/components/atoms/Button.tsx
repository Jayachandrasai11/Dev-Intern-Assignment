import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 's' | 'm' | 'l';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'm',
  iconLeft,
  iconRight,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`atlas-btn atlas-btn--${variant} atlas-btn--${size} ${className}`}
      {...rest}
    >
      {iconLeft && <span className="atlas-btn__icon">{iconLeft}</span>}
      <span className="atlas-btn__label">{children}</span>
      {iconRight && <span className="atlas-btn__icon">{iconRight}</span>}
    </button>
  );
}
