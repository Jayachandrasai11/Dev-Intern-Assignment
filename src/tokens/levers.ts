import { buildSemanticTokens } from './brand';
import type { BrandDefinition, GrayTint, RadiusChoice } from './brand';
import { RADIUS_FACTORS } from './brand';
import type { TokenLayerDef, TokenType } from './types';

/**
 * Lever collections — the Figma-side factoring of the playground's brand
 * levers (feasibility report 2026-07-16). Each lever is one Figma variable
 * collection whose modes are the lever's curated options; every variable
 * inside varies along exactly ONE dimension. The appearance (light/dark)
 * dimension is folded into twin token names (`accent.light.9` /
 * `accent.dark.9`) so the Semantic collection's Light/Dark modes can fork
 * per-mode aliases into the twins (the spike-proven pattern).
 *
 * This model feeds the Figma export/sync pipeline ONLY — runtime CSS
 * emission is untouched (the playground regenerates one brand at a time).
 * Builders run the same generators as the runtime (`buildSemanticTokens`)
 * once per option and slice the option-dependent paths, so lever values are
 * byte-identical with what the playground renders for that option.
 */

export type LeverDimension = 'accent' | 'neutral' | 'radius' | 'typeface';

/** Figma Pro/Org plans cap variable collections at 4 modes. */
export const MAX_LEVER_MODES = 4;

/** Baked pill radius for the Full mode's pill-able roles (Figma cannot
 *  express the CSS max(radius, radius-full) opt-in). */
export const PILL_RADIUS = 9999;

export const LEVER_COLLECTIONS: Record<LeverDimension, string> = {
  accent: '10 Lever · Accent',
  neutral: '11 Lever · Neutral',
  radius: '12 Lever · Radius',
  typeface: '13 Lever · Typeface',
};

export interface LeverTokenDef {
  /** Dot path within the lever collection, e.g. 'accent.light.9'. */
  path: string;
  type: TokenType;
  description?: string;
  /** Literal value per option (mode) — no holes allowed. */
  valuesByOption: Record<string, string | number>;
}

export interface LeverDef {
  dimension: LeverDimension;
  /** Figma collection name. */
  collection: string;
  /** Mode names, in mode order. ≤ MAX_LEVER_MODES. */
  options: string[];
  tokens: LeverTokenDef[];
}

/** How a Semantic-collection token back-references a lever collection:
 *  Light mode → alias `light` target, Dark mode → alias `dark` target.
 *  light === dark for appearance-independent levers (radius, typeface). */
export interface SemanticFork {
  /** Semantic token dot path, e.g. 'accent.9'. */
  path: string;
  dimension: LeverDimension;
  light: string;
  dark: string;
}

export interface TypefaceOption {
  /** Mode name shown in Figma, e.g. 'Geist'. */
  name: string;
  /** Figma font family name (must be loadable at sync time). */
  family: string;
  /** Exact per-family style names — these differ across families
   *  ('Semi Bold' for Inter vs 'SemiBold' for Roboto/Poppins). */
  styles: { regular: string; medium: string; semibold: string; bold: string };
  /** Operational note, e.g. a pending shared-font upload. */
  note?: string;
}

export interface LeverConfig {
  /** ≤4 brand presets — accent ramps generate per preset. */
  accents: BrandDefinition[];
  /** ≤4 curated gray tints. */
  neutrals: GrayTint[];
  /** ≤4 curated radius choices. */
  radii: RadiusChoice[];
  /** ≤4 curated typefaces. */
  typefaces: TypefaceOption[];
}

export interface LeverSet {
  levers: LeverDef[];
  forks: SemanticFork[];
}

function assertOptions(dimension: LeverDimension, names: string[]): void {
  if (names.length === 0) {
    throw new Error(`Lever ${dimension} has no options`);
  }
  if (names.length > MAX_LEVER_MODES) {
    throw new Error(
      `Lever ${dimension} has ${names.length} options — Figma caps collections at ${MAX_LEVER_MODES} modes`,
    );
  }
  if (new Set(names).size !== names.length) {
    throw new Error(`Lever ${dimension} has duplicate option names`);
  }
}

/** Semantic paths whose light/dark values are sliced into lever twins. */
const ACCENT_SLICE = [
  ...Array.from({ length: 12 }, (_, i) => `accent.${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `accent.a${i + 1}`),
  'accent.contrast',
  'accent.surface',
];
const NEUTRAL_SLICE = [
  ...Array.from({ length: 12 }, (_, i) => `gray.${i + 1}`),
  ...Array.from({ length: 12 }, (_, i) => `gray.a${i + 1}`),
];

/** 'accent.9' → 'accent.light.9'; 'gray.a3' → 'gray.dark.a3'. */
function twinPath(path: string, appearance: 'light' | 'dark'): string {
  const [head, ...rest] = path.split('.');
  return [head, appearance, ...rest].join('.');
}

function sliceLever(
  dimension: LeverDimension,
  slice: string[],
  brands: Array<{ name: string; brand: BrandDefinition }>,
): LeverDef {
  assertOptions(dimension, brands.map((b) => b.name));
  const generated = brands.map(({ name, brand }) => ({
    name,
    tokens: buildSemanticTokens(brand).tokens,
  }));

  const tokens: LeverTokenDef[] = [];
  for (const path of slice) {
    for (const appearance of ['light', 'dark'] as const) {
      const valuesByOption: Record<string, string | number> = {};
      for (const g of generated) {
        const def = g.tokens.find((t) => t.path === path);
        const value = def?.modes?.[appearance];
        if (value === undefined) {
          throw new Error(`Lever ${dimension}: no ${appearance} value for ${path} in option ${g.name}`);
        }
        valuesByOption[g.name] = value;
      }
      tokens.push({ path: twinPath(path, appearance), type: 'color', valuesByOption });
    }
  }
  return { dimension, collection: LEVER_COLLECTIONS[dimension], options: brands.map((b) => b.name), tokens };
}

export function buildAccentLever(presets: BrandDefinition[]): LeverDef {
  return sliceLever(
    'accent',
    ACCENT_SLICE,
    presets.map((p) => ({ name: p.name, brand: p })),
  );
}

/** Gray ramps depend only on the tint seed (+background), so any base brand
 *  yields identical grays per tint; the base carries the other fields. */
export function buildNeutralLever(
  tints: GrayTint[],
  base: BrandDefinition,
): LeverDef {
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  return sliceLever(
    'neutral',
    NEUTRAL_SLICE,
    tints.map((tint) => ({ name: cap(tint), brand: { ...base, grayTint: tint } })),
  );
}

/** Brand geometry roles (brand.ts) → global radius steps, with pill-ability.
 *  Pill-able roles bake PILL_RADIUS in the Full mode — role-level stand-in
 *  for the per-component max(radius, radius-full) opt-in. */
const RADIUS_ROLES: Array<{ role: string; globalPath: string; pill: boolean }> = [
  { role: 'small', globalPath: 'radius.2', pill: true },
  { role: 'interactive', globalPath: 'radius.3', pill: true },
  { role: 'container', globalPath: 'radius.4', pill: false },
  { role: 'overlay', globalPath: 'radius.5', pill: false },
];

export function buildRadiusLever(
  choices: RadiusChoice[],
  globalLayer: TokenLayerDef,
): LeverDef {
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  assertOptions('radius', choices.map(cap));
  const tokens: LeverTokenDef[] = RADIUS_ROLES.map(({ role, globalPath, pill }) => {
    const base = globalLayer.tokens.find((t) => t.path === globalPath)?.value;
    if (typeof base !== 'number') {
      throw new Error(`Radius lever: global ${globalPath} missing or not a number`);
    }
    const valuesByOption: Record<string, number> = {};
    for (const choice of choices) {
      valuesByOption[cap(choice)] =
        choice === 'full' && pill
          ? PILL_RADIUS
          : round2(base * RADIUS_FACTORS[choice]);
    }
    return {
      path: `radius.${role}`,
      type: 'dimension' as const,
      description: pill ? 'Pill-able role: Full mode bakes 9999' : undefined,
      valuesByOption,
    };
  });
  return {
    dimension: 'radius',
    collection: LEVER_COLLECTIONS.radius,
    options: choices.map(cap),
    tokens,
  };
}

export function buildTypefaceLever(options: TypefaceOption[]): LeverDef {
  assertOptions('typeface', options.map((o) => o.name));
  const weights = ['regular', 'medium', 'semibold', 'bold'] as const;
  const tokens: LeverTokenDef[] = [
    {
      path: 'font.family',
      type: 'string' as const,
      description: options.some((o) => o.note)
        ? options.filter((o) => o.note).map((o) => `${o.name}: ${o.note}`).join(' · ')
        : undefined,
      valuesByOption: Object.fromEntries(options.map((o) => [o.name, o.family])),
    },
    ...weights.map((w) => ({
      path: `font.style.${w}`,
      type: 'string' as const,
      valuesByOption: Object.fromEntries(options.map((o) => [o.name, o.styles[w]])),
    })),
  ];
  return {
    dimension: 'typeface',
    collection: LEVER_COLLECTIONS.typeface,
    options: options.map((o) => o.name),
    tokens,
  };
}

/** Derive the Semantic-collection rewiring map from the lever defs:
 *  ramp slots fork per appearance into the twins; radius roles and
 *  font.family alias mode-independently (light === dark). */
export function buildSemanticForks(levers: LeverDef[]): SemanticFork[] {
  const forks: SemanticFork[] = [];
  for (const lever of levers) {
    if (lever.dimension === 'accent' || lever.dimension === 'neutral') {
      const slice = lever.dimension === 'accent' ? ACCENT_SLICE : NEUTRAL_SLICE;
      for (const path of slice) {
        forks.push({
          path,
          dimension: lever.dimension,
          light: twinPath(path, 'light'),
          dark: twinPath(path, 'dark'),
        });
      }
    } else if (lever.dimension === 'radius') {
      for (const { role } of RADIUS_ROLES) {
        forks.push({
          path: `radius.${role}`,
          dimension: 'radius',
          light: `radius.${role}`,
          dark: `radius.${role}`,
        });
      }
    } else if (lever.dimension === 'typeface') {
      forks.push({
        path: 'font.family',
        dimension: 'typeface',
        light: 'font.family',
        dark: 'font.family',
      });
    }
  }
  return forks;
}

export function buildLeverSet(
  config: LeverConfig,
  globalLayer: TokenLayerDef,
  base: BrandDefinition,
): LeverSet {
  const levers = [
    buildAccentLever(config.accents),
    buildNeutralLever(config.neutrals, base),
    buildRadiusLever(config.radii, globalLayer),
    buildTypefaceLever(config.typefaces),
  ];
  return { levers, forks: buildSemanticForks(levers) };
}

const round2 = (n: number) => Math.round(n * 100) / 100;
