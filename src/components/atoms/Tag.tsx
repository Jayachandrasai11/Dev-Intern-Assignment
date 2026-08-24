import React from 'react';

export interface TagProps {
  children: React.ReactNode;
  /** accent tints with the brand color; neutral stays gray */
  tone?: 'neutral' | 'accent';
  icon?: React.ReactNode;
}

export function Tag({ children, tone = 'neutral', icon }: TagProps) {
  return (
    <span className={`ev-tag ev-tag--${tone}`}>
      {icon}
      {children}
    </span>
  );
}
