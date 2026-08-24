import type { TokenDef } from '../../../tokens/types';

/**
 * Volt's semantic status vocabulary — the EV charger-state color slots every
 * status-aware component consumes (.ev-status--* plumbing in atoms.css).
 * Extracted from the shared brand layer so other UI libraries can supply
 * their own domain slots via buildSemanticTokens(brand, extraTokens).
 */

const STATUS_HUES = [
  { status: 'available', scale: 'green', contrast: '#ffffff' },
  { status: 'in-use', scale: 'blue', contrast: '#ffffff' },
  { status: 'occupied', scale: 'amber', contrast: '#302008' },
  // Planned downtime (≈OCPI INOPERATIVE) shares the amber family with
  // occupied — only five hue scales exist; label/icon disambiguate.
  { status: 'maintenance', scale: 'amber', contrast: '#302008' },
  { status: 'faulted', scale: 'red', contrast: '#ffffff' },
] as const;

const hueTokens: TokenDef[] = STATUS_HUES.flatMap(
  ({ status, scale, contrast }): TokenDef[] => [
    {
      path: `status.${status}`,
      type: 'color',
      alias: { layer: 'global', path: `${scale}.9` },
    },
    {
      path: `status.${status}-bg`,
      type: 'color',
      alias: { layer: 'global', path: `${scale}.3` },
    },
    {
      path: `status.${status}-text`,
      type: 'color',
      alias: { layer: 'global', path: `${scale}.11` },
    },
    {
      path: `status.${status}-contrast`,
      type: 'color',
      value: contrast,
    },
  ],
);

export const VOLT_STATUS_TOKENS: TokenDef[] = [
  ...hueTokens,
  {
    path: 'status.charging',
    type: 'color',
    description: 'Charging / your-session uses the brand accent',
    alias: { layer: 'semantic', path: 'accent.9' },
  },
  {
    path: 'status.charging-bg',
    type: 'color',
    alias: { layer: 'semantic', path: 'accent.3' },
  },
  {
    path: 'status.charging-text',
    type: 'color',
    alias: { layer: 'semantic', path: 'accent.11' },
  },
  {
    path: 'status.charging-contrast',
    type: 'color',
    alias: { layer: 'semantic', path: 'accent.contrast' },
  },
  {
    path: 'status.offline',
    type: 'color',
    alias: { layer: 'semantic', path: 'gray.8' },
  },
  {
    path: 'status.offline-bg',
    type: 'color',
    alias: { layer: 'semantic', path: 'gray.3' },
  },
  {
    path: 'status.offline-text',
    type: 'color',
    alias: { layer: 'semantic', path: 'gray.11' },
  },
  { path: 'status.offline-contrast', type: 'color', value: '#ffffff' },
  {
    path: 'status.coming-soon',
    type: 'color',
    alias: { layer: 'semantic', path: 'gray.9' },
  },
  {
    path: 'status.coming-soon-bg',
    type: 'color',
    alias: { layer: 'semantic', path: 'gray.3' },
  },
  {
    path: 'status.coming-soon-text',
    type: 'color',
    alias: { layer: 'semantic', path: 'gray.11' },
  },
  { path: 'status.coming-soon-contrast', type: 'color', value: '#ffffff' },
  {
    path: 'status.unknown',
    type: 'color',
    description:
      'Stale/unreachable charger state (≈OCPI UNKNOWN) — distinct slots from offline so it can diverge; pair with freshness copy',
    alias: { layer: 'semantic', path: 'gray.8' },
  },
  {
    path: 'status.unknown-bg',
    type: 'color',
    alias: { layer: 'semantic', path: 'gray.3' },
  },
  {
    path: 'status.unknown-text',
    type: 'color',
    alias: { layer: 'semantic', path: 'gray.11' },
  },
  { path: 'status.unknown-contrast', type: 'color', value: '#ffffff' },
];
