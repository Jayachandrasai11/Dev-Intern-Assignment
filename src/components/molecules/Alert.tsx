import React from 'react';
import type { ChargerStatus } from '../status';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'guidance';

/** Tones reuse the pinned status roles (blue/green/amber/red); guidance
 *  rides the accent plumbing for warm, action-oriented first-run copy. */
const TONE_STATUS: Record<AlertTone, ChargerStatus> = {
  info: 'in-use',
  success: 'available',
  warning: 'occupied',
  danger: 'faulted',
  guidance: 'charging',
};

const ICONS: Record<AlertTone, React.ReactNode> = {
  info: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11 v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12.5 L11 15.5 L16 9.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3.5 L21.5 20 H2.5 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 10 v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  danger: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 9 L15 15 M15 9 L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  guidance: (
    <>
      <path d="M12 3.5 a5.5 5.5 0 0 1 3.2 10 c-0.7 0.5 -1.2 1.2 -1.2 2 h-4 c0 -0.8 -0.5 -1.5 -1.2 -2 a5.5 5.5 0 0 1 3.2 -10 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 19 h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export interface AlertProps {
  tone?: AlertTone;
  title: string;
  children?: React.ReactNode;
  action?: { label: string; onClick?: () => void };
  onDismiss?: () => void;
}

export function Alert({
  tone = 'info',
  title,
  children,
  action,
  onDismiss,
}: AlertProps) {
  return (
    <div className={`ev-alert ev-status--${TONE_STATUS[tone]}`} role="alert">
      <svg viewBox="0 0 24 24" className="ev-alert__icon" aria-hidden>
        {ICONS[tone]}
      </svg>
      <div className="ev-alert__body">
        <strong className="ev-alert__title">{title}</strong>
        {children && <div className="ev-alert__desc">{children}</div>}
        {action && (
          <button
            type="button"
            className="ev-alert__action"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
      </div>
      {onDismiss && (
        <button className="ev-alert__dismiss" onClick={onDismiss} aria-label="Dismiss">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
