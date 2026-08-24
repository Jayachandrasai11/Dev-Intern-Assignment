import React from 'react';
import { Icon } from './Icon';

export interface LinkCtaProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: 'brand' | 'ink' | 'inverse';
  size?: 's' | 'm' | 'l';
  arrow?: boolean;
}

/** Text CTA link — the `link-*-cta` role from the Atlas type ramp. */
export function LinkCta({
  tone = 'brand',
  size = 'm',
  arrow = true,
  className = '',
  children,
  ...rest
}: LinkCtaProps) {
  return (
    <a
      className={`atlas-link atlas-link--${tone} atlas-link--${size} ${className}`}
      {...rest}
    >
      <span className="atlas-link__label">{children}</span>
      {arrow && <Icon name="arrow-right" size={size === 'l' ? 20 : 16} />}
    </a>
  );
}
