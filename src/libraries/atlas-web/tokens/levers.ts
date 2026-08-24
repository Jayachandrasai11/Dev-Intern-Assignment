import { buildLeverSet } from '../../../tokens/levers';
import type { LeverConfig, LeverSet } from '../../../tokens/levers';
import { ATLAS_GLOBAL_TOKENS } from './global';
import { ATLAS_DEFAULT_PRESET, ATLAS_PRESETS } from './presets';

/**
 * Atlas Web curated lever options (feasibility report 2026-07-16 §2/§4;
 * ≤4 per lever — the Figma Pro/Org mode cap). Accent presets are the shipped
 * brands; the 4th Accent mode slot stays open as headroom. Typeface style
 * names were verified against the Figma font catalog in spike ds-test-4lp
 * (Inter is 'Semi Bold'; Google-Fonts families are 'SemiBold').
 */
export const ATLAS_LEVER_CONFIG: LeverConfig = {
  accents: ATLAS_PRESETS,
  neutrals: ['gray', 'slate', 'sage', 'sand'],
  radii: ['none', 'small', 'medium', 'full'],
  typefaces: [
    {
      name: 'Geist',
      family: 'Geist',
      styles: { regular: 'Regular', medium: 'Medium', semibold: 'SemiBold', bold: 'Bold' },
    },
    {
      name: 'Inter',
      family: 'Inter',
      styles: { regular: 'Regular', medium: 'Medium', semibold: 'Semi Bold', bold: 'Bold' },
    },
    {
      name: 'Poppins',
      family: 'Poppins',
      styles: { regular: 'Regular', medium: 'Medium', semibold: 'SemiBold', bold: 'Bold' },
    },
    {
      name: 'DM Sans',
      family: 'DM Sans',
      styles: { regular: 'Regular', medium: 'Medium', semibold: 'SemiBold', bold: 'Bold' },
    },
  ],
};

export const ATLAS_LEVERS: LeverSet = buildLeverSet(
  ATLAS_LEVER_CONFIG,
  ATLAS_GLOBAL_TOKENS,
  ATLAS_DEFAULT_PRESET,
);
