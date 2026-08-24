import type { BrandDefinition } from '../../../tokens/brand';

/** Atlas Web brand presets. The accent drives the Radix-generated chrome
 *  scales; atlas component tokens alias the literal production ramps. */
export const ATLAS_PRESETS: BrandDefinition[] = [
  {
    name: 'Atlas',
    accentHex: '#ff5310',
    grayTint: 'gray',
    radius: 'small',
    scaling: 1,
    fontFamily: "Geist, system-ui, -apple-system, sans-serif",
    panelStyle: 'solid',
  },
  {
    name: 'Atlas Cyan',
    accentHex: '#00edff',
    grayTint: 'gray',
    radius: 'small',
    scaling: 1,
    fontFamily: "Geist, system-ui, -apple-system, sans-serif",
    panelStyle: 'solid',
  },
  {
    // Monochrome preset on the Atlas solid black: ink solids in light mode,
    // paper solids in dark mode (darkAccentHex) so accent-driven components
    // stay legible on the dark background.
    name: 'Atlas Ink',
    accentHex: '#1d1b1b',
    darkAccentHex: '#f4f4f4',
    grayTint: 'gray',
    radius: 'small',
    scaling: 1,
    fontFamily: "Geist, system-ui, -apple-system, sans-serif",
    panelStyle: 'solid',
  },
];

export const ATLAS_DEFAULT_PRESET = ATLAS_PRESETS[0];
