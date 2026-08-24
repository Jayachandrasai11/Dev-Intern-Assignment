/**
 * Canonical charger status vocabulary (OCPP/OCPI-aligned) and the industry
 * color mapping baked into the semantic token layer:
 * available=green · charging/your-session=accent · in-use=blue ·
 * occupied & maintenance=amber · faulted=red ·
 * offline, coming-soon & unknown=gray.
 * maintenance ≈ OCPI INOPERATIVE (planned downtime, not a fault);
 * unknown ≈ OCPI UNKNOWN (stale/unreachable — pair with freshness copy).
 * Power tier is encoded separately (bolt count), never with status colors.
 */
export type ChargerStatus =
  | 'available'
  | 'charging'
  | 'in-use'
  | 'occupied'
  | 'faulted'
  | 'maintenance'
  | 'offline'
  | 'coming-soon'
  | 'unknown';

export const ALL_STATUSES: ChargerStatus[] = [
  'available',
  'charging',
  'in-use',
  'occupied',
  'faulted',
  'maintenance',
  'offline',
  'coming-soon',
  'unknown',
];

export const STATUS_LABELS: Record<ChargerStatus, string> = {
  available: 'Available',
  charging: 'Charging',
  'in-use': 'In use',
  occupied: 'Occupied',
  faulted: 'Faulted',
  maintenance: 'Under maintenance',
  offline: 'Offline',
  'coming-soon': 'Coming soon',
  unknown: 'Status unknown',
};
