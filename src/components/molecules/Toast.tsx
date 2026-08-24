import React from 'react';
import { Spinner } from '../atoms';

export type ToastTone = 'neutral' | 'success' | 'error' | 'loading';

const ICONS: Record<Exclude<ToastTone, 'loading' | 'neutral'>, React.ReactNode> = {
  success: (
    <path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  error: (
    <path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  ),
};

export interface ToastProps {
  tone?: ToastTone;
  message: string;
  description?: string;
  action?: { label: string; onClick?: () => void };
}

/** Presentational toast (Sonner-style inverse surface). Enter/exit
 *  choreography is owned by the host (AnimatePresence + motion.swap role). */
export function Toast({ tone = 'neutral', message, description, action }: ToastProps) {
  return (
    <div className={`ev-toast ev-toast--${tone}`} role="status">
      {tone === 'loading' && <Spinner size="sm" />}
      {(tone === 'success' || tone === 'error') && (
        <svg viewBox="0 0 24 24" className="ev-toast__icon" aria-hidden>
          {ICONS[tone]}
        </svg>
      )}
      <div className="ev-toast__body">
        <span className="ev-toast__message">{message}</span>
        {description && <span className="ev-toast__desc">{description}</span>}
      </div>
      {action && (
        <button className="ev-toast__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
