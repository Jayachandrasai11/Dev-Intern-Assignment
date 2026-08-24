import type { EmittedVars, TokenDef, TokenLayerDef } from './types';

export const VAR_PREFIX = '--ev-';

/** 'button.radius' -> '--ev-button-radius'; 'gray.a3' -> '--ev-gray-a3' */
export function cssVarName(path: string): string {
  return VAR_PREFIX + path.replace(/\./g, '-');
}

function cssValue(def: TokenDef, raw: string | number): string {
  if (def.type === 'dimension' && typeof raw === 'number') {
    // Radius tokens respond to the brand radius factor as well as density.
    if (def.path.startsWith('radius.')) {
      return `calc(${raw}px * var(--ev-scaling) * var(--ev-radius-factor))`;
    }
    return `calc(${raw}px * var(--ev-scaling))`;
  }
  return String(raw);
}

export function emitLayer(layer: TokenLayerDef): EmittedVars {
  const out: EmittedVars = { base: {}, light: {}, dark: {} };
  for (const def of layer.tokens) {
    const name = cssVarName(def.path);
    if (def.alias) {
      // var() references resolve per-mode automatically, so aliases are
      // always mode-independent.
      out.base[name] = `var(${cssVarName(def.alias.path)})`;
    } else if (def.modes) {
      out.light[name] = cssValue(def, def.modes.light);
      out.dark[name] = cssValue(def, def.modes.dark);
    } else if (def.value !== undefined) {
      out.base[name] = cssValue(def, def.value);
    }
  }
  return out;
}

export function mergeEmitted(...emitted: EmittedVars[]): EmittedVars {
  const out: EmittedVars = { base: {}, light: {}, dark: {} };
  for (const e of emitted) {
    Object.assign(out.base, e.base);
    Object.assign(out.light, e.light);
    Object.assign(out.dark, e.dark);
  }
  return out;
}

/**
 * Resolve a token to its literal value for a given mode, following alias
 * chains across layers. Used by the DTCG exporter (Figma needs literal
 * fallback values) and the token inspector.
 */
export function resolveTokenValue(
  def: TokenDef,
  layers: TokenLayerDef[],
  mode: 'light' | 'dark',
  seen: Set<string> = new Set(),
): string | number {
  if (def.alias) {
    const key = `${def.alias.layer}:${def.alias.path}`;
    if (seen.has(key)) {
      throw new Error(`Alias cycle detected at ${key}`);
    }
    seen.add(key);
    const layer = layers.find((l) => l.layer === def.alias!.layer);
    const target = layer?.tokens.find((t) => t.path === def.alias!.path);
    if (!target) {
      throw new Error(`Alias target not found: ${key}`);
    }
    return resolveTokenValue(target, layers, mode, seen);
  }
  if (def.modes) return def.modes[mode];
  if (def.value !== undefined) return def.value;
  throw new Error(`Token ${def.path} has no value`);
}

export function applyVars(
  el: HTMLElement,
  vars: Record<string, string>,
): void {
  for (const [name, value] of Object.entries(vars)) {
    el.style.setProperty(name, value);
  }
}
