export type ConnectorType =
  | 'ccs1'
  | 'ccs2'
  | 'chademo'
  | 'type1'
  | 'type2'
  | 'nacs'
  | 'gbt';

export const CONNECTOR_LABELS: Record<ConnectorType, string> = {
  ccs1: 'CCS1',
  ccs2: 'CCS2',
  chademo: 'CHAdeMO',
  type1: 'J1772',
  type2: 'Type 2',
  nacs: 'NACS',
  gbt: 'GB/T',
};

export interface ConnectorIconProps {
  type: ConnectorType;
  muted?: boolean;
  size?: number;
}

/** Stylized plug-face glyphs, drawn with currentColor so they inherit any
 *  status/text color from the surrounding component. */
export function ConnectorIcon({ type, muted, size = 24 }: ConnectorIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`ev-connector-icon${muted ? ' ev-connector-icon--muted' : ''}`}
      style={{ width: `calc(${size}px * var(--ev-scaling))` }}
      role="img"
      aria-label={CONNECTOR_LABELS[type]}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {GLYPHS[type]}
    </svg>
  );
}

const dot = (cx: number, cy: number, r = 1.4) => (
  <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
);

const GLYPHS: Record<ConnectorType, JSX.Element> = {
  // J1772 — round face, five pins
  type1: (
    <>
      <circle cx="12" cy="12" r="9" />
      {dot(8.5, 8.5)} {dot(15.5, 8.5)}
      {dot(7.5, 13.5)} {dot(16.5, 13.5)}
      {dot(12, 16.5)}
    </>
  ),
  // Mennekes — flat-topped circle, seven pins
  type2: (
    <>
      <path d="M6.2 4.5 h11.6 A9 9 0 1 1 6.2 4.5 Z" />
      {dot(9.5, 7.5, 1.1)} {dot(14.5, 7.5, 1.1)}
      {dot(6.5, 12)} {dot(12, 11.5)} {dot(17.5, 12)}
      {dot(9, 16.5)} {dot(15, 16.5)}
    </>
  ),
  // CCS1 — J1772 face on top + two DC pins below
  ccs1: (
    <>
      <circle cx="12" cy="8" r="6" />
      {dot(9.5, 6.5, 1.1)} {dot(14.5, 6.5, 1.1)} {dot(12, 10.5, 1.1)}
      <path d="M6.5 16.5 h11 a2.5 2.5 0 0 1 0 5 h-11 a2.5 2.5 0 0 1 0 -5 Z" />
      {dot(9.5, 19, 1.6)} {dot(14.5, 19, 1.6)}
    </>
  ),
  // CCS2 — flat-top face + two DC pins below
  ccs2: (
    <>
      <path d="M8 2.5 h8 A6 6 0 1 1 8 2.5 Z" />
      {dot(10, 5.5, 1)} {dot(14, 5.5, 1)}
      {dot(8.5, 9)} {dot(12, 8.5, 1)} {dot(15.5, 9)}
      <path d="M6.5 16.5 h11 a2.5 2.5 0 0 1 0 5 h-11 a2.5 2.5 0 0 1 0 -5 Z" />
      {dot(9.5, 19, 1.6)} {dot(14.5, 19, 1.6)}
    </>
  ),
  // CHAdeMO — large face, two big side pins, small top/bottom keys
  chademo: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="7.5" cy="12" r="2.4" />
      <circle cx="16.5" cy="12" r="2.4" />
      {dot(12, 6.5, 1.2)} {dot(12, 17.5, 1.2)}
    </>
  ),
  // NACS — compact rounded face, three contacts
  nacs: (
    <>
      <path d="M7 5.5 Q12 2.5 17 5.5 L19 14 A7.5 7.5 0 0 1 5 14 Z" />
      {dot(9, 9.5, 1.7)} {dot(15, 9.5, 1.7)}
      {dot(12, 15, 1.2)}
    </>
  ),
  // GB/T — round face, seven pins in GB arrangement
  gbt: (
    <>
      <circle cx="12" cy="12" r="9" />
      {dot(12, 6.5, 1.1)}
      {dot(7.5, 9.5, 1.1)} {dot(16.5, 9.5, 1.1)}
      {dot(7.5, 14.5)} {dot(16.5, 14.5)}
      {dot(10.5, 17.5, 1.1)} {dot(13.5, 17.5, 1.1)}
    </>
  ),
};
