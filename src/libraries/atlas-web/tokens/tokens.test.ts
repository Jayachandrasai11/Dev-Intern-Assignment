import { describe, expect, it } from 'vitest';
import { buildSemanticTokens } from '../../../tokens/brand';
import { emitLayer, resolveTokenValue } from '../../../tokens/emit';
import { ATLAS_COMPONENT_TOKENS } from './component';
import { ATLAS_GLOBAL_TOKENS } from './global';
import { ATLAS_DEFAULT_PRESET, ATLAS_PRESETS } from './presets';
import { ATLAS_STATUS_TOKENS } from './status';

describe('ATLAS_GLOBAL_TOKENS', () => {
  const byPath = new Map(ATLAS_GLOBAL_TOKENS.tokens.map((t) => [t.path, t]));

  it('anchors the literal production values', () => {
    expect(byPath.get('brand.500')!.modes!.light).toBe('#ff5310');
    expect(byPath.get('cyan.500')!.modes!.light).toBe('#00edff');
    expect(byPath.get('neutral.900')!.modes!.light).toBe('#1d1b1b');
    expect(byPath.get('green.500')!.modes!.light).toBe('#00e05a');
    expect(byPath.get('yellow.500')!.modes!.light).toBe('#ffbc10');
  });

  it('provides every path the shared semantic core aliases', () => {
    // buildSemanticTokens aliases these global paths for its role tokens.
    const required = [
      'radius.2', 'radius.3', 'radius.4', 'radius.5',
      'font-size.1', 'font-size.2', 'font-size.3', 'font-size.4',
      'font-size.6', 'font-size.9',
      'duration.fast', 'duration.normal', 'duration.slow', 'duration.slower',
      'easing.standard', 'easing.enter', 'easing.exit', 'easing.sheet',
      'easing.spring',
    ];
    for (const path of required) {
      expect(byPath.has(path), `missing global primitive: ${path}`).toBe(true);
    }
  });

  it('has an ascending space scale for the composer pickers', () => {
    const space = ATLAS_GLOBAL_TOKENS.tokens
      .filter((t) => t.path.startsWith('space.'))
      .map((t) => t.value as number);
    expect(space.length).toBeGreaterThanOrEqual(9);
    for (let i = 1; i < space.length; i++) {
      expect(space[i]).toBeGreaterThan(space[i - 1]);
    }
  });

  it('emits without dangling references', () => {
    const emitted = emitLayer(ATLAS_GLOBAL_TOKENS);
    expect(Object.keys(emitted.base).length).toBeGreaterThan(50);
  });
});

describe('atlas semantic layer', () => {
  const semantic = buildSemanticTokens(ATLAS_DEFAULT_PRESET, ATLAS_STATUS_TOKENS);
  const layers = [ATLAS_GLOBAL_TOKENS, semantic, ATLAS_COMPONENT_TOKENS];

  it('appends the atlas status vocabulary', () => {
    const byPath = new Map(semantic.tokens.map((t) => [t.path, t]));
    for (const status of ['success', 'warning', 'error', 'info']) {
      expect(byPath.get(`status.${status}`)!.alias).toBeDefined();
      expect(byPath.has(`status.${status}-bg`)).toBe(true);
      expect(byPath.has(`status.${status}-text`)).toBe(true);
      expect(byPath.has(`status.${status}-contrast`)).toBe(true);
    }
  });

  it('anchors the accent to the Atlas orange', () => {
    const accent9 = semantic.tokens.find((t) => t.path === 'accent.9');
    expect(accent9!.modes!.light).toBe('#ff5310');
  });

  it('resolves every component token through the layer chain', () => {
    for (const def of ATLAS_COMPONENT_TOKENS.tokens) {
      const resolved = resolveTokenValue(def, layers, 'light');
      expect(
        resolved,
        `component token ${def.path} does not resolve`,
      ).not.toBeNull();
    }
  });

  // Regression: accent-driven slots must follow the active preset's accent —
  // aliasing the literal brand ramp froze the library on orange regardless
  // of the brand panel.
  it('accent-driven component slots retheme with the preset', () => {
    const resolveFor = (preset: (typeof ATLAS_PRESETS)[number], path: string) => {
      const presetLayers = [
        ATLAS_GLOBAL_TOKENS,
        buildSemanticTokens(preset, ATLAS_STATUS_TOKENS),
        ATLAS_COMPONENT_TOKENS,
      ];
      const def = ATLAS_COMPONENT_TOKENS.tokens.find((t) => t.path === path)!;
      return String(resolveTokenValue(def, presetLayers, 'light'));
    };
    const [atlas, cyan] = ATLAS_PRESETS;
    // accent.9 is anchored to the exact preset hex.
    expect(resolveFor(atlas, 'button.primary.bg')).toBe('#ff5310');
    expect(resolveFor(cyan, 'button.primary.bg')).toBe('#00edff');
    for (const path of [
      'link.brand',
      'toggle.on',
      'navtabs.underline',
      'cta-band.brand-bg',
      'chip.brand-bg',
    ]) {
      expect(
        resolveFor(atlas, path),
        `${path} ignores the preset accent`,
      ).not.toBe(resolveFor(cyan, path));
    }
    // Identity colors deliberately do NOT follow the accent.
    expect(resolveFor(atlas, 'ink.primary')).toBe(resolveFor(cyan, 'ink.primary'));
    expect(resolveFor(atlas, 'footer.bg')).toBe(resolveFor(cyan, 'footer.bg'));
  });

  // Atlas Ink is a monochrome preset: ink solids in light mode, paper solids
  // in dark mode — accent-driven components must stay legible in both.
  it('Atlas Ink anchors ink in light mode and paper in dark mode', () => {
    const ink = ATLAS_PRESETS.find((p) => p.name === 'Atlas Ink')!;
    const inkLayers = [
      ATLAS_GLOBAL_TOKENS,
      buildSemanticTokens(ink, ATLAS_STATUS_TOKENS),
      ATLAS_COMPONENT_TOKENS,
    ];
    const resolveMode = (path: string, mode: 'light' | 'dark') => {
      const def = ATLAS_COMPONENT_TOKENS.tokens.find((t) => t.path === path)!;
      return String(resolveTokenValue(def, inkLayers, mode));
    };
    // Primary solids flip with the mode, never matching the page background.
    expect(resolveMode('button.primary.bg', 'light')).toBe('#1d1b1b');
    expect(resolveMode('button.primary.bg', 'dark')).toBe('#f4f4f4');
    // Text on the solid is the accent's contrast in each mode.
    expect(resolveMode('button.primary.text', 'light')).not.toBe(
      resolveMode('button.primary.bg', 'light'),
    );
    expect(resolveMode('button.primary.text', 'dark')).not.toBe(
      resolveMode('button.primary.bg', 'dark'),
    );
    // The CTA band button is the accent's inverse — legible on the band in
    // both modes.
    expect(resolveMode('cta-band.btn-bg', 'dark')).not.toBe(
      resolveMode('cta-band.brand-bg', 'dark'),
    );
    // Accent-on-fixed-surface slots are clamped, never the raw accent.
    for (const path of ['footer.link-hover', 'masthead.play-icon']) {
      expect(resolveMode(path, 'light')).toContain('color-mix');
    }
  });

  // Regression: mode-invariant neutrals left ink near-black on the dark
  // background — text was unreadable in dark mode.
  it('ink flips in dark mode while identity surfaces stay dark', () => {
    const resolveMode = (path: string, mode: 'light' | 'dark') => {
      const def = ATLAS_COMPONENT_TOKENS.tokens.find((t) => t.path === path)!;
      return String(resolveTokenValue(def, layers, mode));
    };
    // Text/border/surface consumers invert with the flipped neutral ramp.
    expect(resolveMode('ink.primary', 'light')).toBe('#1d1b1b');
    expect(resolveMode('ink.primary', 'dark')).toBe('#ffffff');
    expect(resolveMode('surface.subtle', 'light')).not.toBe(
      resolveMode('surface.subtle', 'dark'),
    );
    expect(resolveMode('card.border', 'light')).not.toBe(
      resolveMode('card.border', 'dark'),
    );
    // Always-dark identity surfaces and their fixed inks do NOT flip.
    for (const path of [
      'footer.bg',
      'header.utility-bg',
      'masthead.media-from',
      'cta-band.ink-bg',
      'ink.inverse',
      'footer.text',
    ]) {
      expect(
        resolveMode(path, 'light'),
        `${path} must be mode-invariant`,
      ).toBe(resolveMode(path, 'dark'));
    }
  });
});
