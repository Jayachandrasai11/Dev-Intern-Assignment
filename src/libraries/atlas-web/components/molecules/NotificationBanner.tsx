import React from 'react';
import { Icon } from '../atoms';

export type BannerTone = 'info' | 'success' | 'warning' | 'error';

/** Tone glyphs drawn inline (the curated website Icon set has no status
 *  circles) — stroke currentColor to ride the banner's status text color. */
const TONE_ICONS: Record<BannerTone, React.ReactNode> = {
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8v.1" />
    </>
  ),
  success: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4 2.7 19.5h18.6L12 4Z" />
      <path d="M12 10v4" />
      <path d="M12 16.5v.1" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6m0-6-6 6" />
    </>
  ),
};

export interface NotificationBannerProps {
  tone?: BannerTone;
  children: React.ReactNode;
  /** Renders a close affordance when provided. */
  onDismiss?: () => void;
}

/** Full-width status banner — offer strips, booking confirmations, outage notices. */
export function NotificationBanner({
  tone = 'info',
  children,
  onDismiss,
}: NotificationBannerProps) {
  return (
    <div className={`atlas-banner atlas-status--${tone}`} role="status">
      <svg
        className="atlas-banner__icon"
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {TONE_ICONS[tone]}
      </svg>
      <span className="atlas-banner__message">{children}</span>
      {onDismiss && (
        <button
          type="button"
          className="atlas-banner__dismiss"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
