export interface DurationSelectorProps {
  /** Options in minutes. */
  options?: number[];
  value?: number;
  onChange?: (minutes: number) => void;
  /** e.g. the conservative wallet estimate for the selection. */
  helper?: string;
}

function formatMinutes(m: number): string {
  if (m < 60) return `${m} min`;
  return m % 60 === 0 ? `${m / 60} h` : `${Math.floor(m / 60)} h ${m % 60}`;
}

/** Duration chips feeding the conservative wallet readiness check. */
export function DurationSelector({
  options = [30, 60, 120, 240],
  value,
  onChange,
  helper,
}: DurationSelectorProps) {
  return (
    <div className="ev-duration">
      <div className="ev-duration__chips" role="group" aria-label="Charging duration">
        {options.map((m) => (
          <button
            key={m}
            type="button"
            className={`ev-duration__chip${m === value ? ' ev-duration__chip--selected' : ''}`}
            aria-pressed={m === value}
            onClick={() => onChange?.(m)}
          >
            {formatMinutes(m)}
          </button>
        ))}
      </div>
      {helper && <p className="ev-duration__helper">{helper}</p>}
    </div>
  );
}
