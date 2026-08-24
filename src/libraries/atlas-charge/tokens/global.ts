import type { TokenDef, TokenLayerDef } from '../../../tokens/types';

const modes = (path: string, light: string, dark: string): TokenDef => ({
  path,
  type: 'color',
  modes: { light, dark },
});

const shadowModes = (path: string, light: string, dark: string): TokenDef => ({
  path,
  type: 'shadow',
  modes: { light, dark },
});

const dims = (name: string, values: number[]): TokenDef[] =>
  values.map((value, index) => ({
    path: `${name}.${index + 1}`,
    type: 'dimension',
    value,
  }));

/** Calm Utility primitives. Values are taken from the supplied design.json;
 * dark counterparts are deliberately designed tonal translations rather
 * than a mechanical inversion. */
export const ATLAS_CHARGE_GLOBAL_TOKENS: TokenLayerDef = {
  layer: 'global',
  tokens: [
    modes('calm.ink', '#111111', '#f7f7f4'),
    modes('calm.ink-muted', '#666661', '#b7b7b0'),
    modes('calm.canvas', '#f7f7f4', '#151513'),
    modes('calm.surface', '#ffffff', '#222220'),
    modes('calm.surface-muted', '#f0f0ec', '#2d2d29'),
    modes('calm.border', '#e2e2dd', '#3b3b37'),
    modes('calm.border-strong', '#c7c7c2', '#55554e'),
    modes('calm.success', '#208a4e', '#62c98d'),
    modes('calm.success-bg', '#d8f0e1', '#173c29'),
    modes('calm.success-text', '#166534', '#62c98d'),
    modes('calm.warning', '#e97832', '#f2a16f'),
    modes('calm.warning-bg', '#fde8d8', '#4a2a18'),
    modes('calm.warning-text', '#8a3b0b', '#f2a16f'),
    modes('calm.danger', '#d92d36', '#f06d74'),
    modes('calm.danger-bg', '#fadadd', '#4a1e22'),
    modes('calm.danger-text', '#a71923', '#f06d74'),
    modes('calm.scrim', 'rgba(17,17,17,0.48)', 'rgba(0,0,0,0.68)'),

    ...dims('space', [4, 8, 12, 16, 20, 24, 32]),
    ...dims('radius', [8, 12, 20, 28, 999]),
    ...dims('font-size', [11, 15, 13, 17, 20, 24, 32, 36, 44]),
    ...dims('line-height', [15, 21, 17, 22, 25, 29, 38, 42, 46]),

    { path: 'font-weight.regular', type: 'number', value: 400 },
    { path: 'font-weight.medium', type: 'number', value: 500 },
    { path: 'font-weight.semibold', type: 'number', value: 600 },
    { path: 'font-weight.bold', type: 'number', value: 700 },

    shadowModes(
      'shadow.floating',
      '0 4px 16px rgba(17,17,17,0.08)',
      '0 4px 18px rgba(0,0,0,0.34)',
    ),
    shadowModes(
      'shadow.sheet',
      '0 -8px 32px rgba(17,17,17,0.10)',
      '0 -8px 32px rgba(0,0,0,0.42)',
    ),
    shadowModes(
      'shadow.transient',
      '0 8px 24px rgba(17,17,17,0.18)',
      '0 8px 26px rgba(0,0,0,0.5)',
    ),

    { path: 'duration.instant', type: 'duration', value: '0ms' },
    { path: 'duration.fast', type: 'duration', value: '120ms' },
    { path: 'duration.normal', type: 'duration', value: '160ms' },
    { path: 'duration.slow', type: 'duration', value: '240ms' },
    { path: 'duration.slower', type: 'duration', value: '320ms' },
    { path: 'duration.spinner', type: 'duration', value: '800ms' },
    { path: 'duration.scanner', type: 'duration', value: '2400ms' },
    { path: 'easing.standard', type: 'string', value: 'cubic-bezier(0.2,0.8,0.2,1)' },
    { path: 'easing.enter', type: 'string', value: 'cubic-bezier(0.2,0.8,0.2,1)' },
    { path: 'easing.exit', type: 'string', value: 'cubic-bezier(0.4,0,1,1)' },
    { path: 'easing.sheet', type: 'string', value: 'cubic-bezier(0.32,0.72,0,1)' },
    { path: 'easing.spring', type: 'string', value: 'cubic-bezier(0.2,0.8,0.2,1)' },
    { path: 'z.sheet', type: 'number', value: 100 },
    { path: 'z.panel', type: 'number', value: 200 },
    { path: 'z.toast', type: 'number', value: 300 },
  ],
};
