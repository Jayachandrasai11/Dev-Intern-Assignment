import type { TokenDef, TokenLayerDef } from '../../../tokens/types';

/**
 * Atlas Web — Layer 3 component tokens. The chain is always component →
 * semantic/global, never a raw hex in component CSS.
 *
 * Accent-driven slots alias the SEMANTIC accent scale (generated from the
 * active preset's accentHex; accent.9 is anchored to the exact brand hex,
 * so the default Atlas preset renders the literal #ff5310) — this is what
 * makes the brand panel retheme the library live. Fixed identity colors
 * (warm neutrals, the cyan map flourish, destructive red) alias the literal
 * global ramps and deliberately do NOT follow the accent.
 */

const g = (path: string) => ({ layer: 'global' as const, path });
const s = (path: string) => ({ layer: 'semantic' as const, path });

const color = (path: string, alias: { layer: 'global' | 'semantic'; path: string }): TokenDef => ({
  path,
  type: 'color',
  alias,
});
const dim = (path: string, px: number): TokenDef => ({
  path,
  type: 'dimension',
  value: px,
});
const dimAlias = (path: string, alias: { layer: 'global' | 'semantic'; path: string }): TokenDef => ({
  path,
  type: 'dimension',
  alias,
});
/** Documented literal: accent clamped toward a pole so it stays legible on a
 *  FIXED surface in every mode and for every preset — including the
 *  monochrome Atlas Ink accent, whose raw accent.9 matches one of the fixed
 *  surfaces in each mode. */
const accentOn = (path: string, pole: '#ffffff' | '#1d1b1b', description: string): TokenDef => ({
  path,
  type: 'color',
  value: `color-mix(in srgb, var(--ev-accent-9) 55%, ${pole})`,
  description,
});

export const ATLAS_COMPONENT_TOKENS: TokenLayerDef = {
  layer: 'component',
  tokens: [
    // ---------- button ----------
    color('button.primary.bg', s('accent.9')),
    color('button.primary.bg-hover', s('accent.10')),
    color('button.primary.bg-pressed', s('accent.11')),
    color('button.primary.text', s('accent.contrast')),
    color('button.secondary.border', g('neutral.900')),
    color('button.secondary.text', g('neutral.900')),
    color('button.secondary.bg-hover', g('neutral.100')),
    color('button.tertiary.bg', s('accent.3')),
    color('button.tertiary.text', s('accent.11')),
    color('button.destructive.bg', g('red.600')),
    color('button.destructive.text', s('accent.contrast')),
    dim('button.px-s', 12),
    dim('button.px-m', 16),
    dim('button.px-l', 24),
    dim('button.h-s', 32),
    dim('button.h-m', 44),
    dim('button.h-l', 56),
    dimAlias('button.radius', s('radius.interactive')),

    // ---------- shared surfaces ----------
    color('card.bg', s('color.bg')),
    color('card.border', g('neutral.200')),
    dimAlias('card.radius', s('radius.container')),
    dimAlias('card.padding', g('space.5')),
    color('ink.primary', g('neutral.900')),
    color('ink.secondary', g('neutral.600')),
    color('ink.inverse', g('fixed.paper')),
    color('surface.subtle', g('neutral.100')),

    // ---------- link ----------
    color('link.brand', s('accent.9')),

    // ---------- input / field ----------
    color('input.bg', s('color.bg')),
    color('input.border', g('neutral.300')),
    color('input.border-focus', g('neutral.900')),
    dimAlias('input.radius', s('radius.small')),

    // ---------- chip ----------
    color('chip.neutral-bg', g('neutral.100')),
    color('chip.neutral-text', g('neutral.700')),
    color('chip.brand-bg', s('accent.3')),
    color('chip.brand-text', s('accent.11')),

    // ---------- toggle / selection controls ----------
    color('toggle.on', s('accent.9')),
    color('toggle.off', g('neutral.300')),

    // ---------- spec card ----------
    color('spec-card.accent', s('accent.9')),
    color('spec-card.icon-bg', s('accent.3')),

    // ---------- advantage card ----------
    color('advantage-card.icon', s('accent.9')),
    color('advantage-card.icon-bg', s('accent.3')),

    // ---------- accordion ----------
    color('accordion.border', g('neutral.200')),

    // ---------- nav tabs ----------
    color('navtabs.border', g('neutral.200')),
    color('navtabs.text', g('neutral.600')),
    color('navtabs.text-active', g('neutral.900')),
    color('navtabs.underline', s('accent.9')),

    // ---------- dealer card ----------
    color('dealer-card.accent', s('accent.9')),

    // ---------- award card ----------
    color('award-card.accent', s('accent.9')),

    // ---------- price tag ----------
    color('price-tag.compare', g('neutral.500')),
    color('price-tag.emi', s('accent.11')),

    // ---------- emi row ----------
    color('emi-row.border', g('neutral.150')),
    color('emi-row.highlight', s('accent.11')),

    // ---------- site header ----------
    color('header.bg', s('color.bg')),
    color('header.border', g('neutral.200')),
    color('header.utility-bg', g('fixed.black')),
    color('header.utility-text', g('fixed.paper')),

    // ---------- masthead banner ----------
    color('masthead.media-from', g('fixed.black')),
    color('masthead.media-to', g('fixed.gray-soft')),
    color('masthead.play-bg', g('fixed.white')),
    accentOn(
      'masthead.play-icon',
      '#1d1b1b',
      'Accent darkened toward ink — sits on the fixed white play disc',
    ),

    // ---------- banner carousel ----------
    color('carousel.dot', g('neutral.300')),
    color('carousel.dot-active', s('accent.9')),
    color('carousel.control-bg', s('color.bg')),
    color('carousel.control-border', g('neutral.200')),

    // ---------- spec compare table ----------
    color('compare-table.border', g('neutral.200')),
    color('compare-table.stripe', g('neutral.100')),
    color('compare-table.highlight-bg', s('accent.3')),
    color('compare-table.highlight-text', s('accent.11')),

    // ---------- model card ----------
    color('model-card.media-from', g('neutral.150')),
    color('model-card.media-to', g('neutral.250')),
    color('model-card.media-icon', g('neutral.500')),

    // ---------- dealer locator ----------
    color('locator.map-from', g('neutral.100')),
    color('locator.map-to', g('cyan.100')),
    color('locator.map-border', g('neutral.200')),
    color('locator.map-pin', s('accent.9')),

    // ---------- cta band ----------
    color('cta-band.brand-bg', s('accent.9')),
    color('cta-band.brand-text', s('accent.contrast')),
    color('cta-band.ink-bg', g('fixed.black')),
    color('cta-band.ink-text', g('fixed.paper')),
    // The band button is the accent's inverse (contrast fill, accent text) so
    // it reads on the band whatever the accent — orange, cyan, or ink/paper.
    color('cta-band.btn-bg', s('accent.contrast')),
    color('cta-band.btn-text', s('accent.9')),

    // ---------- site footer ----------
    color('footer.bg', g('fixed.black')),
    color('footer.text', g('fixed.paper')),
    color('footer.text-muted', g('fixed.gray-mid')),
    color('footer.border', g('fixed.gray-dark')),
    accentOn(
      'footer.link-hover',
      '#ffffff',
      'Accent lightened toward paper — sits on the fixed dark footer',
    ),
    color('footer.social-bg', g('fixed.gray-deep')),
  ],
};
