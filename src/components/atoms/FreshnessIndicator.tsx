/** Confidence in a status reading. Stale/unknown must read as reduced
 *  trust — availability is only as good as its last update. */
export type Freshness = 'fresh' | 'stale' | 'unknown';

export interface FreshnessIndicatorProps {
  /** Rendered verbatim, e.g. "Updated 2 min ago" or "Status unavailable". */
  label: string;
  state?: Freshness;
}

export function FreshnessIndicator({
  label,
  state = 'fresh',
}: FreshnessIndicatorProps) {
  return (
    <span className={`ev-freshness ev-freshness--${state}`}>
      <svg viewBox="0 0 24 24" className="ev-freshness__icon" aria-hidden>
        {state === 'unknown' ? (
          <>
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M9.8 9.5 a2.2 2.2 0 1 1 3.2 2.4 c-0.8 0.5 -1 1 -1 1.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16.6" r="1.1" fill="currentColor" stroke="none" />
          </>
        ) : (
          <>
            <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7.5 V12 L15 14.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
      </svg>
      {label}
    </span>
  );
}
