import React from 'react';

export interface TextProps {
  /** Atlas body ramp step. */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  weight?: 'regular' | 'medium' | 'semibold';
  muted?: boolean;
  inverse?: boolean;
  as?: 'p' | 'span' | 'div';
  className?: string;
  children: React.ReactNode;
}

export function Text({
  size = 'm',
  weight = 'regular',
  muted = false,
  inverse = false,
  as: Tag = 'p',
  className = '',
  children,
}: TextProps) {
  return (
    <Tag
      className={`atlas-text atlas-text--${size} atlas-text--${weight}${muted ? ' atlas-text--muted' : ''}${inverse ? ' atlas-text--inverse' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
