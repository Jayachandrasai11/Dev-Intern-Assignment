import { Button, StatusBadge } from '../atoms';
import type { SessionData } from '../data';
import { BatteryProgressBar, SessionStat } from '../molecules';

export type SessionState = 'charging' | 'suspended' | 'finishing';

export interface ActiveChargingSessionProps {
  archetype?: 'ring' | 'linear';
  session: SessionData;
  state?: SessionState;
  /** False when the vehicle reports no state of charge — SOC visuals are
   *  hidden and only meter-side stats show (industry fallback pattern). */
  telemetry?: boolean;
}

const STATE_STATUS = {
  charging: 'charging',
  suspended: 'occupied',
  finishing: 'available',
} as const;

const STATE_LABELS: Record<SessionState, string> = {
  charging: 'Charging',
  suspended: 'Paused by vehicle',
  finishing: 'Finished — unplug soon',
};

export function ActiveChargingSession({
  archetype = 'ring',
  session,
  state = 'charging',
  telemetry = true,
}: ActiveChargingSessionProps) {
  const s = session;
  const soc = telemetry ? (s.soc ?? 0) : undefined;

  return (
    <div className={`ev-session ev-session--${state}`}>
      <header className="ev-session__header">
        <div>
          <h3 className="ev-session__station">{s.stationName}</h3>
          <p className="ev-session__meta">Stall {s.stallId}</p>
        </div>
        <StatusBadge
          status={STATE_STATUS[state]}
          label={STATE_LABELS[state]}
        />
      </header>

      {telemetry && soc !== undefined ? (
        archetype === 'ring' ? (
          <SocRing soc={soc} kw={s.kw} state={state} />
        ) : (
          <div className="ev-session__linear">
            <BatteryProgressBar
              percent={soc}
              limit={s.targetSoc}
              charging={state === 'charging'}
            />
            {s.targetSoc && (
              <p className="ev-session__target">
                Charging to {s.targetSoc}%
                {s.minutesToTarget !== undefined &&
                  state === 'charging' &&
                  ` · ${s.minutesToTarget} min remaining`}
              </p>
            )}
          </div>
        )
      ) : (
        <p className="ev-session__no-telemetry">
          Vehicle state of charge unavailable — showing meter data only.
        </p>
      )}

      {state === 'finishing' && (
        <p className="ev-session__idle-warning">
          Idle fees start in 8 min — please move your vehicle.
        </p>
      )}

      <div className="ev-session__stats">
        <SessionStat form="tile" label="Power" value={`${s.kw}`} unit="kW" />
        <SessionStat
          form="tile"
          label="Delivered"
          value={s.kwhDelivered.toFixed(1)}
          unit="kWh"
        />
        <SessionStat
          form="tile"
          label="Cost"
          value={`$${s.costAccrued.toFixed(2)}`}
        />
        <SessionStat
          form="tile"
          label="Elapsed"
          value={`${s.minutesElapsed}`}
          unit="min"
        />
      </div>

      <div className="ev-session__actions">
        <Button variant="solid" size="lg" className="ev-session__stop">
          Stop charging
        </Button>
      </div>
    </div>
  );
}

function SocRing({
  soc,
  kw,
  state,
}: {
  soc: number;
  kw: number;
  state: SessionState;
}) {
  const R = 84;
  const C = 2 * Math.PI * R;
  return (
    <div className="ev-session__ring-wrap">
      <svg viewBox="0 0 200 200" className="ev-soc-ring">
        <circle cx="100" cy="100" r={R} className="ev-soc-ring__track" />
        <circle
          cx="100"
          cy="100"
          r={R}
          className={`ev-soc-ring__progress${
            state === 'charging' ? ' ev-soc-ring__progress--live' : ''
          }`}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - soc / 100)}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div className="ev-soc-ring__center">
        <span className="ev-soc-ring__soc">{soc}%</span>
        <span className="ev-soc-ring__kw">{kw} kW</span>
      </div>
    </div>
  );
}
