import type { BrandDefinition } from '../../../tokens/brand';

export const ATLAS_CHARGE_PRESETS: BrandDefinition[] = [
  {
    name: 'Calm Ink',
    accentHex: '#111111',
    darkAccentHex: '#f7f7f4',
    grayTint: 'olive',
    radius: 'medium',
    scaling: 1,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
    panelStyle: 'solid',
  },
  {
    name: 'Atlas Blue',
    accentHex: '#315f86',
    grayTint: 'olive',
    radius: 'medium',
    scaling: 1,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
    panelStyle: 'solid',
  },
];

export const ATLAS_CHARGE_DEFAULT_PRESET = ATLAS_CHARGE_PRESETS[0];
