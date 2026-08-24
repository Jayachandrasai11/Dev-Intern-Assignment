import React from 'react';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  /** Renders the back affordance when provided. */
  onBack?: () => void;
  /** Trailing icon actions — e.g. the contextual help/support entry. */
  trailing?: React.ReactNode;
}

/** Top navigation bar for stacked mobile screens. */
export function AppHeader({ title, subtitle, onBack, trailing }: AppHeaderProps) {
  return (
    <header className="ev-app-header">
      {onBack && (
        <button
          type="button"
          className="ev-app-header__back"
          onClick={onBack}
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M15 5 L8 12 L15 19"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <div className="ev-app-header__titles">
        <div className="ev-app-header__title">{title}</div>
        {subtitle && <div className="ev-app-header__subtitle">{subtitle}</div>}
      </div>
      {trailing && <div className="ev-app-header__trailing">{trailing}</div>}
    </header>
  );
}
