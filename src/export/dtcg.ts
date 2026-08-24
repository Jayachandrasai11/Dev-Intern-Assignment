import { resolveTokenValue } from '../tokens/emit';
import type { LeverSet, LeverTokenDef, SemanticFork } from '../tokens/levers';
import type {
  LayerName,
  TokenDef,
  TokenLayerDef,
} from '../tokens/types';

/**
 * Serializes the token layers to Figma-ready DTCG (Design Tokens Format
 * Module 2025.10) JSON — one file per (collection, mode), matching Figma's
 * native variables import:
 *
 *   - colors as color objects (srgb components + hex), dimensions as
 *     {value, unit:'px'} — resolved against the CURRENT brand (scaling and
 *     radius factor are multiplied in, since Figma variables cannot calc())
 *   - same-collection aliases as "{dot.path}"
 *   - cross-collection aliases as a resolved literal $value plus
 *     $extensions["com.figma"].aliasData → {targetVariableSetName,
 *     targetVariableName} (slash-normalized), which Figma resolves on import
 *   - shadows are excluded: Figma variables are COLOR/FLOAT/STRING/BOOLEAN
 *     only; shadows belong in effect styles.
 */

export interface DtcgFile {
  filename: string;
  collection: string;
  mode: string;
  json: Record<string, unknown>;
}

const COLLECTION_NAMES: Record<LayerName, string> = {
  global: 'Primitives',
  semantic: 'Semantic',
  component: 'Component',
};

export function buildDtcgFiles(
  layers: TokenLayerDef[],
  leverSet?: LeverSet | null,
): DtcgFile[] {
  const global = layers.find((l) => l.layer === 'global');
  const semantic = layers.find((l) => l.layer === 'semantic');
  const component = layers.find((l) => l.layer === 'component');
  if (!global || !semantic) {
    throw new Error('buildDtcgFiles needs at least global + semantic layers');
  }
  const forks = leverSet ? forkIndex(leverSet) : undefined;

  const files: DtcgFile[] = [
    {
      filename: 'primitives.value.tokens.json',
      collection: COLLECTION_NAMES.global,
      mode: 'Value',
      json: layerToTree(global, layers, 'light'),
    },
    {
      filename: 'semantic.light.tokens.json',
      collection: COLLECTION_NAMES.semantic,
      mode: 'Light',
      json: layerToTree(semantic, layers, 'light', forks),
    },
    {
      filename: 'semantic.dark.tokens.json',
      collection: COLLECTION_NAMES.semantic,
      mode: 'Dark',
      json: layerToTree(semantic, layers, 'dark', forks),
    },
  ];
  if (component) {
    files.push({
      filename: 'component.default.tokens.json',
      collection: COLLECTION_NAMES.component,
      mode: 'Default',
      json: layerToTree(component, layers, 'light'),
    });
  }
  if (leverSet) files.push(...buildLeverDtcgFiles(leverSet));
  return files;
}

interface ForkTarget {
  collection: string;
  fork: SemanticFork;
}

/** semantic path → lever back-reference (per-mode alias fork). */
function forkIndex(leverSet: LeverSet): Map<string, ForkTarget> {
  const collectionByDim = new Map(
    leverSet.levers.map((l) => [l.dimension, l.collection]),
  );
  const index = new Map<string, ForkTarget>();
  for (const fork of leverSet.forks) {
    const collection = collectionByDim.get(fork.dimension);
    if (collection) index.set(fork.path, { collection, fork });
  }
  return index;
}

/** One file per (lever collection, option-mode) — literal values only;
 *  the Semantic collection carries all the back-references. */
export function buildLeverDtcgFiles(leverSet: LeverSet): DtcgFile[] {
  const files: DtcgFile[] = [];
  for (const lever of leverSet.levers) {
    for (const option of lever.options) {
      const root: Record<string, unknown> = {};
      for (const token of lever.tokens) {
        const dtcg = leverTokenToDtcg(token, option);
        if (dtcg) insertAtPath(root, token.path, dtcg);
      }
      files.push({
        filename: `lever-${lever.dimension}.${slug(option)}.tokens.json`,
        collection: lever.collection,
        mode: option,
        json: root,
      });
    }
  }
  return files;
}

function leverTokenToDtcg(
  token: LeverTokenDef,
  option: string,
): Record<string, unknown> | null {
  const raw = token.valuesByOption[option];
  if (raw === undefined) return null;
  const out: Record<string, unknown> = {};
  if (token.description) out.$description = token.description;
  switch (token.type) {
    case 'color': {
      const color = parseColor(String(raw));
      if (!color) return null;
      out.$type = 'color';
      out.$value = color;
      break;
    }
    case 'dimension':
      out.$type = 'dimension';
      out.$value = { value: Number(raw), unit: 'px' };
      break;
    case 'number':
      out.$type = 'number';
      out.$value = Number(raw);
      break;
    default:
      out.$type = 'string';
      out.$value = String(raw);
  }
  return out;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function layerToTree(
  layer: TokenLayerDef,
  layers: TokenLayerDef[],
  mode: 'light' | 'dark',
  forks?: Map<string, ForkTarget>,
): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  for (const def of layer.tokens) {
    if (def.type === 'shadow') continue; // effect styles, not variables
    const token = tokenToDtcg(def, layer.layer, layers, mode, forks?.get(def.path));
    if (!token) continue;
    insertAtPath(root, def.path, token);
  }
  return root;
}

function insertAtPath(
  root: Record<string, unknown>,
  path: string,
  token: Record<string, unknown>,
) {
  const segments = path.split('.');
  let node = root;
  for (const seg of segments.slice(0, -1)) {
    node = (node[seg] ??= {}) as Record<string, unknown>;
  }
  node[segments[segments.length - 1]] = token;
}

function tokenToDtcg(
  def: TokenDef,
  layer: LayerName,
  layers: TokenLayerDef[],
  mode: 'light' | 'dark',
  forkTarget?: ForkTarget,
): Record<string, unknown> | null {
  const token: Record<string, unknown> = {};
  if (def.description) token.$description = def.description;

  if (def.alias && def.alias.layer === layer && !forkTarget) {
    // Same-collection alias — Figma understands "{dot.path}" natively.
    token.$type = dtcgType(def);
    token.$value = `{${def.alias.path}}`;
    return token;
  }

  let raw: string | number;
  try {
    raw = resolveTokenValue(def, layers, mode);
  } catch {
    return null;
  }

  switch (def.type) {
    case 'color': {
      const color = parseColor(String(raw));
      if (!color) return null;
      token.$type = 'color';
      token.$value = color;
      break;
    }
    case 'dimension': {
      token.$type = 'dimension';
      token.$value = {
        value: resolveDimensionPx(finalTarget(def, layers), raw, layers),
        unit: 'px',
      };
      break;
    }
    case 'number':
      token.$type = 'number';
      token.$value = raw;
      break;
    case 'fontFamily':
      token.$type = 'fontFamily';
      // Figma maps fontFamily → String and needs a single name.
      token.$value = String(raw).split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      break;
    case 'duration': {
      const ms = /^([\d.]+)ms$/.exec(String(raw));
      token.$type = 'duration';
      token.$value = ms
        ? { value: Number(ms[1]), unit: 'ms' }
        : { value: Number.parseFloat(String(raw)) || 0, unit: 's' };
      break;
    }
    case 'string':
      token.$type = 'string'; // non-standard; Figma imports as String
      token.$value = String(raw);
      break;
    default:
      return null;
  }

  if (forkTarget) {
    // Lever back-reference: this semantic token's value for THIS mode is an
    // alias into the lever collection (the per-mode fork). The literal
    // $value above stays as the current-brand fallback.
    const target =
      mode === 'light' ? forkTarget.fork.light : forkTarget.fork.dark;
    token.$extensions = {
      'com.figma': {
        aliasData: {
          targetVariableSetName: forkTarget.collection,
          targetVariableName: target.replace(/\./g, '/'),
        },
      },
    };
  } else if (def.alias && def.alias.layer !== layer) {
    token.$extensions = {
      'com.figma': {
        aliasData: {
          targetVariableSetName: COLLECTION_NAMES[def.alias.layer],
          targetVariableName: def.alias.path.replace(/\./g, '/'),
        },
      },
    };
  }
  return token;
}

function dtcgType(def: TokenDef): string {
  return def.type === 'string' ? 'string' : def.type;
}

/** Follow an alias chain to its terminal definition, so dimension scaling
 *  rules (radius factor) key off the real target, not the alias path. */
function finalTarget(def: TokenDef, layers: TokenLayerDef[]): TokenDef {
  let current = def;
  const seen = new Set<string>();
  while (current.alias) {
    const key = `${current.alias.layer}:${current.alias.path}`;
    if (seen.has(key)) break;
    seen.add(key);
    const layer = layers.find((l) => l.layer === current.alias!.layer);
    const target = layer?.tokens.find((t) => t.path === current.alias!.path);
    if (!target) break;
    current = target;
  }
  return current;
}

/** Multiply base px by the brand scaling (and radius factor for radius.*),
 *  since Figma variables cannot express calc(). */
function resolveDimensionPx(
  def: TokenDef,
  raw: string | number,
  layers: TokenLayerDef[],
): number {
  const px =
    typeof raw === 'number' ? raw : Number.parseFloat(String(raw)) || 0;
  if (typeof raw === 'string') return px; // pre-resolved strings like '9999px'
  const scaling = numberToken(layers, 'scaling', 1);
  const factor = def.path.startsWith('radius.')
    ? numberToken(layers, 'radius-factor', 1)
    : 1;
  return round2(px * scaling * factor);
}

function numberToken(
  layers: TokenLayerDef[],
  path: string,
  fallback: number,
): number {
  const semantic = layers.find((l) => l.layer === 'semantic');
  const def = semantic?.tokens.find((t) => t.path === path);
  return typeof def?.value === 'number' ? def.value : fallback;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export interface DtcgColor {
  colorSpace: 'srgb';
  components: [number, number, number];
  alpha: number;
  hex: string;
}

/** Parse #rgb / #rrggbb / #rrggbbaa / rgb()/rgba() into a DTCG color object. */
export function parseColor(input: string): DtcgColor | null {
  const s = input.trim();

  let m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(s);
  if (m) {
    const [r, g, b] = [0, 2, 4].map((i) =>
      Number.parseInt(m![1].slice(i, i + 2), 16),
    );
    const alpha = m[2] !== undefined ? Number.parseInt(m[2], 16) / 255 : 1;
    return {
      colorSpace: 'srgb',
      components: [round4(r / 255), round4(g / 255), round4(b / 255)],
      alpha: round4(alpha),
      hex: `#${m[1].toLowerCase()}`,
    };
  }

  m = /^#([0-9a-f]{3})$/i.exec(s);
  if (m) {
    const full = m[1]
      .split('')
      .map((c) => c + c)
      .join('');
    return parseColor(`#${full}`);
  }

  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(
    s,
  );
  if (m) {
    const [r, g, b] = [m[1], m[2], m[3]].map(Number);
    const alpha = m[4] !== undefined ? Number(m[4]) : 1;
    const hex = `#${[r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')}`;
    return {
      colorSpace: 'srgb',
      components: [round4(r / 255), round4(g / 255), round4(b / 255)],
      alpha: round4(alpha),
      hex,
    };
  }

  return null;
}

const round4 = (n: number) => Math.round(n * 10000) / 10000;
