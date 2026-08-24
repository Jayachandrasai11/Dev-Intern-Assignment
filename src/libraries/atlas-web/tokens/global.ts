import type { TokenDef, TokenLayerDef } from '../../../tokens/types';

/**
 * Atlas Web — Layer 1 global primitives, encoding the LITERAL production
 * ramps from atlasmotors.com's token source (atlas_web_ev ui.frontend
 * abstracts/tokens.scss): brand orange, electric cyan, warm neutrals, and
 * the status hues. Component tokens alias these literals — this pack is the
 * real Atlas design language, not a recolor of another library.
 *
 * The website DS is light-first; literal ramps are identical in both modes
 * (dark-mode chrome comes from the Radix-generated semantic scales).
 */

function ramp(name: string, steps: Record<string, string>): TokenDef[] {
  return Object.entries(steps).map(([step, hex]) => ({
    path: `${name}.${step}`,
    type: 'color' as const,
    modes: { light: hex, dark: hex },
  }));
}

/** Mode-aware ramp: dark mode mirrors the scale (50 ↔ 900, 100 ↔ 850, …) so
 *  ink/border/surface consumers invert coherently. Identity surfaces that
 *  must stay dark in both modes alias the `fixed.*` tokens instead. */
function flippedRamp(name: string, steps: Record<string, string>): TokenDef[] {
  const entries = Object.entries(steps);
  return entries.map(([step, hex], i) => ({
    path: `${name}.${step}`,
    type: 'color' as const,
    modes: { light: hex, dark: entries[entries.length - 1 - i][1] },
  }));
}

function dimensionScale(name: string, basesPx: number[]): TokenDef[] {
  return basesPx.map((px, i) => ({
    path: `${name}.${i + 1}`,
    type: 'dimension' as const,
    value: px,
  }));
}

/** Production brand ramp — brand-500 #ff5310 is THE Atlas orange. */
const BRAND = {
  100: '#ffddcf', 200: '#ffba9f', 300: '#ff9870', 400: '#ff7540',
  500: '#ff5310', 600: '#cc420d', 700: '#99320a', 800: '#662106', 900: '#331103',
};

/** Secondary "electric" cyan (anchors from production; midpoints interpolated). */
const CYAN = {
  100: '#ccfbff', 200: '#99f8ff', 300: '#66f4ff', 400: '#33f1ff',
  500: '#00edff', 600: '#00becc', 700: '#008e99', 800: '#005f66', 900: '#002f33',
};

/** 19-step warm neutral ramp — neutral-900 #1d1b1b is Atlas "solid black". */
const NEUTRAL = {
  50: '#ffffff', 100: '#f4f4f4', 150: '#eaeaea', 200: '#dfdfdf', 250: '#d4d4d4',
  300: '#c9c9c9', 350: '#bdbdbd', 400: '#a7a6a6', 450: '#9b9a9a', 500: '#8f8e8e',
  550: '#838282', 600: '#767575', 650: '#696767', 700: '#5c5a5a', 750: '#4e4c4c',
  800: '#3f3d3d', 850: '#2e2c2c', 900: '#1d1b1b',
};

/** Status hues (500 anchors from production; tints/shades interpolated). */
const GREEN = {
  100: '#d6fbe6', 200: '#adf7cd', 300: '#85f2b4', 400: '#42e987',
  500: '#00e05a', 600: '#00b348', 700: '#008636', 800: '#005a24', 900: '#002d12',
};
const YELLOW = {
  100: '#fff2cf', 200: '#ffe49f', 300: '#ffd770', 400: '#ffc940',
  500: '#ffbc10', 600: '#cc960d', 700: '#99710a', 800: '#664b06', 900: '#332603',
};
const RED = {
  100: '#ffcccc', 200: '#ff9999', 300: '#ff6666', 400: '#ff3333',
  500: '#ff0000', 600: '#cc0000', 700: '#990000', 800: '#660000', 900: '#330000',
};
const BLUE = {
  100: '#dde4f6', 200: '#bbc9ee', 300: '#98afe5', 400: '#7693dd',
  500: '#5377d4', 600: '#425fa9', 700: '#32477f', 800: '#213054', 900: '#11182a',
};

const SHADOWS: Array<[string, string]> = [
  ['0 2px 8px rgba(99, 99, 99, 0.2)', '0 2px 8px rgba(0, 0, 0, 0.45)'],
  ['0 5px 10px rgba(0, 0, 0, 0.1)', '0 5px 10px rgba(0, 0, 0, 0.5)'],
  ['0 0 10px rgba(0, 0, 0, 0.15)', '0 0 10px rgba(0, 0, 0, 0.55)'],
  ['0 6px 26px rgba(40, 40, 40, 0.08)', '0 6px 26px rgba(0, 0, 0, 0.6)'],
  ['0 -10px 10px rgba(0, 0, 0, 0.1)', '0 -10px 10px rgba(0, 0, 0, 0.55)'],
];

export const ATLAS_GLOBAL_TOKENS: TokenLayerDef = {
  layer: 'global',
  tokens: [
    ...ramp('brand', BRAND),
    ...ramp('cyan', CYAN),
    ...flippedRamp('neutral', NEUTRAL),
    ...ramp('green', GREEN),
    ...ramp('yellow', YELLOW),
    ...ramp('red', RED),
    ...ramp('blue', BLUE),

    // Mode-invariant identity colors — the Atlas solid-black surfaces (footer,
    // utility bar, masthead media, ink CTA band) and their fixed inks stay dark
    // in dark mode while the neutral ramp flips around them.
    { path: 'fixed.black', type: 'color', value: '#1d1b1b' },
    { path: 'fixed.white', type: 'color', value: '#ffffff' },
    { path: 'fixed.paper', type: 'color', value: '#f4f4f4' },
    { path: 'fixed.gray-soft', type: 'color', value: '#4e4c4c' },
    { path: 'fixed.gray-mid', type: 'color', value: '#9b9a9a' },
    { path: 'fixed.gray-dark', type: 'color', value: '#3f3d3d' },
    { path: 'fixed.gray-deep', type: 'color', value: '#2e2c2c' },

    // Production spacing scale (subset of 3xs…12xl, 1-indexed for the
    // composer's space pickers / --ev-space-N vars).
    ...dimensionScale('space', [4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 112]),
    // Radius: xxs 2 / xs 4 / s 8 / m 12 / l 16 (+24 for large surfaces).
    ...dimensionScale('radius', [2, 4, 8, 12, 16, 24]),
    // Type scale slice mapped to the shared text roles: caption 12 · body 16
    // · label 20 · title 24 · heading 40 · display 108 (heading-5xl).
    ...dimensionScale('font-size', [12, 16, 20, 24, 32, 40, 48, 60, 108]),
    ...dimensionScale('line-height', [16, 24, 28, 32, 40, 48, 56, 64, 112]),

    { path: 'font-weight.regular', type: 'number', value: 400 },
    { path: 'font-weight.medium', type: 'number', value: 500 },
    { path: 'font-weight.bold', type: 'number', value: 600 },

    ...SHADOWS.map(
      ([light, dark], i): TokenDef => ({
        path: `shadow.${i + 1}`,
        type: 'shadow',
        modes: { light, dark },
      }),
    ),

    // Motion + z primitives keep the shared vocabulary the semantic core
    // aliases (duration.fast/…, easing.standard/…).
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
      value: 'cubic-bezier(0.32, 0.72, 0, 1)',
    },
    {
      path: 'easing.spring',
      type: 'string',
      value: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },

    { path: 'z.sheet', type: 'number', value: 100 },
    { path: 'z.panel', type: 'number', value: 200 },
    { path: 'z.toast', type: 'number', value: 300 },
  ],
};
