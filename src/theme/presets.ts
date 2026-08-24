import type { BrandDefinition } from '../tokens/brand';

export const PRESETS: BrandDefinition[] = [
  {
    name: 'Volt',
    accentHex: '#00c16a',
    grayTint: 'sand',
    radius: 'large',
    scaling: 1,
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
    panelStyle: 'translucent',
  },
  {
    name: 'Polar',
    accentHex: '#4c9eeb',
    grayTint: 'slate',
    radius: 'medium',
    scaling: 1,
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    panelStyle: 'solid',
  },
  {
    name: 'Amp',
    accentHex: '#e93d82',
    grayTint: 'mauve',
    radius: 'full',
    scaling: 1.05,
    fontFamily: "'Avenir Next', 'Trebuchet MS', sans-serif",
    panelStyle: 'translucent',
  },
];

export const DEFAULT_PRESET = PRESETS[0];
