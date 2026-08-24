import React from 'react';

export type HeadingSize = '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

export interface HeadingProps {
  /** Atlas heading ramp step (heading-2xs … heading-5xl). */
  size?: HeadingSize;
  /** Semantic level, independent of visual size. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  inverse?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Heading({
  size = 'l',
  level = 2,
  inverse = false,
  className = '',
  children,
}: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={`atlas-heading atlas-heading--${size}${inverse ? ' atlas-heading--inverse' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
