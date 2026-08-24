export interface BatteryProgressBarProps {
  percent: number;
  /** Charge-limit target (e.g. 80) — rendered as a tick on the track. */
  limit?: number;
  charging?: boolean;
}

export function BatteryProgressBar({
  percent,
  limit,
  charging,
}: BatteryProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className={`ev-battery-bar${charging ? ' ev-battery-bar--charging' : ''}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Battery ${clamped}%${limit ? `, limit ${limit}%` : ''}`}
    >
      <div className="ev-battery-bar__track">
        <div
          className="ev-battery-bar__fill"
          style={{ width: `${clamped}%` }}
        />
        {limit !== undefined && (
          <div
            className="ev-battery-bar__limit"
            style={{ left: `${limit}%` }}
            title={`Charge limit ${limit}%`}
          />
        )}
      </div>
      <span className="ev-battery-bar__label">{clamped}%</span>
    </div>
  );
}
