import {
  amber,
  amberDark,
  blue,
  blueDark,
  gray,
  grayA,
  grayDark,
  grayDarkA,
  green,
  greenDark,
  red,
  redDark,
} from '@radix-ui/colors';
import type { TokenDef, TokenLayerDef } from './types';

/**
 * Layer 1 — global primitives. Brand-agnostic: the status hues (green =
 * available, blue = in-use, amber = occupied, red = faulted) must NOT shift
 * with the brand accent, so they are fixed Radix scales rather than
 * generated ones.
 */

function scaleTokens(
  name: string,
  light: Record<string, string>,
  dark: Record<string, string>,
  alpha = false,
): TokenDef[] {
  const lightSteps = Object.values(light);
  const darkSteps = Object.values(dark);
  return lightSteps.map((lightValue, i) => ({
    path: `${name}.${alpha ? 'a' : ''}${i + 1}`,
    type: 'color' as const,
    modes: { light: lightValue, dark: darkSteps[i] },
  }));
}

function dimensionScale(name: string, basesPx: number[]): TokenDef[] {
  return basesPx.map((px, i) => ({
    path: `${name}.${i + 1}`,
    type: 'dimension' as const,
    value: px,
  }));
}

const SHADOWS: Array<[string, string]> = [
  ['0 1px 2px rgba(0, 0, 0, 0.08)', '0 1px 2px rgba(0, 0, 0, 0.45)'],
  ['0 2px 6px rgba(0, 0, 0, 0.10)', '0 2px 6px rgba(0, 0, 0, 0.50)'],
  ['0 4px 12px rgba(0, 0, 0, 0.12)', '0 4px 12px rgba(0, 0, 0, 0.55)'],
  ['0 8px 24px rgba(0, 0, 0, 0.14)', '0 8px 24px rgba(0, 0, 0, 0.60)'],
  ['0 16px 48px rgba(0, 0, 0, 0.18)', '0 16px 48px rgba(0, 0, 0, 0.65)'],
];

export const GLOBAL_TOKENS: TokenLayerDef = {
  layer: 'global',
  tokens: [
    ...scaleTokens('gray', gray, grayDark),
    ...scaleTokens('gray', grayA, grayDarkA, true),
    ...scaleTokens('green', green, greenDark),
    ...scaleTokens('blue', blue, blueDark),
    ...scaleTokens('amber', amber, amberDark),
    ...scaleTokens('red', red, redDark),

    ...dimensionScale('space', [4, 8, 12, 16, 24, 32, 40, 48, 64]),
    ...dimensionScale('radius', [3, 4, 6, 8, 12, 16]),
    ...dimensionScale('font-size', [12, 13, 14, 16, 18, 20, 24, 30, 38]),
    ...dimensionScale('line-height', [16, 18, 20, 24, 26, 28, 32, 38, 46]),

    { path: 'font-weight.regular', type: 'number', value: 400 },
    { path: 'font-weight.medium', type: 'number', value: 500 },
    { path: 'font-weight.bold', type: 'number', value: 700 },

    ...SHADOWS.map(
      ([light, dark], i): TokenDef => ({
        path: `shadow.${i + 1}`,
        type: 'shadow',
        modes: { light, dark },
      }),
    ),

    { path: 'duration.instant', type: 'duration', value: '50ms' },
    { path: 'duration.fast', type: 'duration', value: '120ms' },
    { path: 'duration.normal', type: 'duration', value: '200ms' },
    { path: 'duration.slow', type: 'duration', value: '320ms' },
    { path: 'duration.slower', type: 'duration', value: '500ms' },
    {
      path: 'easing.standard',
      type: 'string',
      value: 'cubic-bezier(0.2, 0, 0, 1)',
    },
    {
      path: 'easing.enter',
      type: 'string',
      value: 'cubic-bezier(0, 0, 0.2, 1)',
    },
    {
      path: 'easing.exit',
      type: 'string',
      value: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    {
      path: 'easing.sheet',
      type: 'string',
      description: 'iOS sheet curve (Emil Kowalski / Vaul) — drawers and sheets',
      value: 'cubic-bezier(0.32, 0.72, 0, 1)',
    },
    {
      path: 'easing.spring',
      type: 'string',
      description: 'Overshoot for playful emphasis (selection pops, pin bounce)',
      value: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },

    { path: 'z.sheet', type: 'number', value: 100 },
    { path: 'z.panel', type: 'number', value: 200 },
    { path: 'z.toast', type: 'number', value: 300 },
  ],
};
