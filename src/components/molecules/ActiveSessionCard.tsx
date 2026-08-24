import type { SessionData } from '../data';
import type { ChargerStatus } from '../status';

export type ActiveSessionCardState = 'charging' | 'suspended' | 'finishing';

const STATE_STATUS: Record<ActiveSessionCardState, ChargerStatus> = {
  charging: 'charging',
  suspended: 'occupied',
  finishing: 'available',
};

const STATE_LABELS: Record<ActiveSessionCardState, string> = {
  charging: 'Charging',
  suspended: 'Paused',
  finishing: 'Finishing',
};

export interface ActiveSessionCardProps {
  session: SessionData;
  state?: ActiveSessionCardState;
  /** Opens the full session monitor. */
  onClick?: () => void;
}

/** Compact live-session surface for home — the answer to "is my car still
 *  charging?" without opening the full monitor. */
export function ActiveSessionCard({
  session,
  state = 'charging',
  onClick,
}: ActiveSessionCardProps) {
  const s = session;
  const body = (
    <>
      <span className={`ev-session-card__state ev-status--${STATE_STATUS[state]}`}>
        <span className="ev-status-dot" aria-hidden />
      </span>
      <span className="ev-session-card__main">
        <span className="ev-session-card__title">
          {STATE_LABELS[state]} at {s.stationName}
        </span>
        <span className="ev-session-card__meta">
          {s.minutesElapsed} min · {s.kwhDelivered.toFixed(1)} kWh · $
          {s.costAccrued.toFixed(2)}
        </span>
      </span>
      <svg viewBox="0 0 24 24" className="ev-session-card__chevron" aria-hidden>
        <path
          d="M9 5 L16 12 L9 19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
  return onClick ? (
    <button type="button" className="ev-session-card" onClick={onClick}>
      {body}
    </button>
  ) : (
    <div className="ev-session-card">{body}</div>
  );
}
