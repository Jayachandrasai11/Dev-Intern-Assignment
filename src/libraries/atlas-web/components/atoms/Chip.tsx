import React from 'react';

export type ChipTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface ChipProps {
  tone?: ChipTone;
  /** Outlined instead of tinted. */
  outline?: boolean;
  children: React.ReactNode;
}

/** Label chip — price tags, availability badges, section eyebrows. */
export function Chip({ tone = 'neutral', outline = false, children }: ChipProps) {
  return (
    <span
      className={`atlas-chip atlas-chip--${tone}${outline ? ' atlas-chip--outline' : ''}`}
    >
      {children}
    </span>
  );
}
