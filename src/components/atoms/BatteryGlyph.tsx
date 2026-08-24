export interface BatteryGlyphProps {
  percent: number;
  charging?: boolean;
}

export function BatteryGlyph({ percent, charging }: BatteryGlyphProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const fillClass = charging
    ? 'ev-battery--charging'
    : clamped <= 15
      ? 'ev-battery--low'
      : 'ev-battery--ok';
  return (
    <svg
      viewBox="0 0 32 16"
      className={`ev-battery ${fillClass}`}
      role="img"
      aria-label={`Battery ${clamped}%${charging ? ', charging' : ''}`}
      style={{ width: 'calc(32px * var(--ev-scaling))' }}
    >
      <rect x="1" y="2" width="26" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" className="ev-battery__shell" />
      <rect x="28.5" y="6" width="2.5" height="4" rx="1" fill="currentColor" className="ev-battery__nub" />
      <rect x="3" y="4" width={Math.max(0.5, (clamped / 100) * 22)} height="8" rx="1.5" className="ev-battery__fill" />
      {charging && (
        <path
          d="M15.5 3 L11 9 h3 l-1 4 4.5-6 h-3 Z"
          className="ev-battery__bolt"
        />
      )}
    </svg>
  );
}
