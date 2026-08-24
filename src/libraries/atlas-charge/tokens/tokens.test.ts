import { describe, expect, it } from 'vitest';
import { emitLayer, resolveTokenValue } from '../../../tokens/emit';
import { ATLAS_CHARGE_COMPONENT_TOKENS } from './component';
import { ATLAS_CHARGE_GLOBAL_TOKENS } from './global';
import {
  ATLAS_CHARGE_DEFAULT_PRESET,
  ATLAS_CHARGE_PRESETS,
} from './presets';
import { buildAtlasChargeSemantic } from './semantic';

function contrastRatio(foreground: string, background: string) {
  const luminance = (hex: string) => {
    const channels = hex.match(/[a-f\d]{2}/gi)!.map((channel) => parseInt(channel, 16) / 255);
    const [red, green, blue] = channels.map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  };
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

describe('Atlas Charge token architecture', () => {
  const semantic = buildAtlasChargeSemantic(ATLAS_CHARGE_DEFAULT_PRESET);
  const layers = [
    ATLAS_CHARGE_GLOBAL_TOKENS,
    semantic,
    ATLAS_CHARGE_COMPONENT_TOKENS,
  ];

  it('keeps primitive and component namespaces distinct', () => {
    const globalPaths = new Set(ATLAS_CHARGE_GLOBAL_TOKENS.tokens.map((token) => token.path));
    const componentPaths = new Set(ATLAS_CHARGE_COMPONENT_TOKENS.tokens.map((token) => token.path));
    expect([...globalPaths].filter((path) => componentPaths.has(path))).toEqual([]);
    expect([...globalPaths].filter((path) => path.startsWith('calm.')).length).toBeGreaterThan(10);
  });

  it('uses component and slot namespaces instead of a shared charge utility namespace', () => {
    const paths = ATLAS_CHARGE_COMPONENT_TOKENS.tokens.map((token) => token.path);
    expect(paths.filter((path) => path.startsWith('charge.'))).toEqual([]);
    for (const family of [
      'button',
      'field',
      'toggle',
      'station-card',
      'bottom-nav',
      'sheet',
      'scanner',
      'session',
    ]) {
      expect(paths.some((path) => path.startsWith(`${family}.`)), family).toBe(true);
    }
  });

  it('keeps component geometry independently addressable', () => {
    const byPath = new Map(ATLAS_CHARGE_COMPONENT_TOKENS.tokens.map((token) => [token.path, token]));
    expect(byPath.get('button.radius')).toMatchObject({ value: 999 });
    expect(byPath.get('chip.radius')).toMatchObject({ value: 999 });
    expect(byPath.get('field.radius')?.alias).toEqual({ layer: 'semantic', path: 'radius.interactive' });
    expect(byPath.get('station-card.radius')?.alias).toEqual({ layer: 'semantic', path: 'radius.container' });
    expect(byPath.get('sheet.radius')?.alias).toEqual({ layer: 'semantic', path: 'radius.overlay' });
    expect(byPath.get('field.gap')?.value).toBe(6);
    expect(byPath.get('panel.gap')?.value).toBe(14);
    expect(byPath.get('sheet.gap')?.value).toBe(16);
  });

  it('keeps anatomical pills stable while semantic container radii remain themeable', () => {
    const emitted = emitLayer(ATLAS_CHARGE_COMPONENT_TOKENS).base;
    expect(emitted['--ev-button-radius']).toBe('calc(999px * var(--ev-scaling))');
    expect(emitted['--ev-chip-radius']).toBe('calc(999px * var(--ev-scaling))');
    expect(emitted['--ev-field-radius']).toBe('var(--ev-radius-interactive)');
    expect(emitted['--ev-station-card-radius']).toBe('var(--ev-radius-container)');
    expect(emitted['--ev-sheet-radius']).toBe('var(--ev-radius-overlay)');
  });

  it('keeps interactive catalogue targets at least 44px tall', () => {
    const byPath = new Map(ATLAS_CHARGE_COMPONENT_TOKENS.tokens.map((token) => [token.path, token]));
    for (const path of ['icon-button.size', 'selection.min-height', 'chip.height', 'map-marker.min-height']) {
      expect(byPath.get(path)?.value, path).toBeGreaterThanOrEqual(44);
    }
  });

  it('meets WCAG AA contrast for status badge text in both modes', () => {
    const byPath = new Map(ATLAS_CHARGE_COMPONENT_TOKENS.tokens.map((token) => [token.path, token]));
    for (const mode of ['light', 'dark'] as const) {
      for (const tone of ['info', 'success', 'warning', 'danger']) {
        const text = String(resolveTokenValue(byPath.get(`status-badge.${tone}.text`)!, layers, mode));
        const background = String(resolveTokenValue(byPath.get(`status-badge.${tone}.bg`)!, layers, mode));
        expect(contrastRatio(text, background), `${tone} ${mode}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('provides deliberate light and dark Calm Utility surfaces', () => {
    const byPath = new Map(ATLAS_CHARGE_GLOBAL_TOKENS.tokens.map((token) => [token.path, token]));
    expect(byPath.get('calm.canvas')?.modes).toEqual({ light: '#f7f7f4', dark: '#151513' });
    expect(byPath.get('calm.ink')?.modes).toEqual({ light: '#111111', dark: '#f7f7f4' });
    expect(byPath.get('shadow.sheet')?.type).toBe('shadow');
  });

  it('resolves every component slot in both modes', () => {
    for (const token of ATLAS_CHARGE_COMPONENT_TOKENS.tokens) {
      expect(resolveTokenValue(token, layers, 'light'), `${token.path} light`).not.toBeNull();
      expect(resolveTokenValue(token, layers, 'dark'), `${token.path} dark`).not.toBeNull();
    }
  });

  it('routes every component colour through semantic intent', () => {
    const direct = ATLAS_CHARGE_COMPONENT_TOKENS.tokens
      .filter((token) => token.type === 'color')
      .filter((token) => token.alias?.layer !== 'semantic')
      .map((token) => token.path);
    expect(direct).toEqual([]);
  });

  it('routes every aliased component slot through the semantic layer', () => {
    const direct = ATLAS_CHARGE_COMPONENT_TOKENS.tokens
      .filter((token) => token.alias)
      .filter((token) => token.alias?.layer !== 'semantic')
      .map((token) => token.path);
    expect(direct).toEqual([]);
  });

  it('changes Charging Ink with accent but leaves operational colours fixed', () => {
    const resolve = (preset: (typeof ATLAS_CHARGE_PRESETS)[number], path: string) => {
      const presetLayers = [
        ATLAS_CHARGE_GLOBAL_TOKENS,
        buildAtlasChargeSemantic(preset),
        ATLAS_CHARGE_COMPONENT_TOKENS,
      ];
      const token = ATLAS_CHARGE_COMPONENT_TOKENS.tokens.find((item) => item.path === path)!;
      return resolveTokenValue(token, presetLayers, 'light');
    };
    const [ink, blue] = ATLAS_CHARGE_PRESETS;
    expect(resolve(ink, 'button.primary.bg')).toBe('#111');
    expect(resolve(blue, 'button.primary.bg')).toBe('#315f86');
    for (const path of [
      'status-badge.success.text',
      'status-badge.warning.text',
      'status-badge.danger.text',
      'status-badge.info.text',
    ]) {
      expect(resolve(ink, path), path).toBe(resolve(blue, path));
    }
  });
});
