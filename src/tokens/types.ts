/**
 * Core token model shared by the CSS emitter (live theming) and the DTCG
 * serializer (Figma export). Three layers:
 *
 *   global    — brand-agnostic primitives (static scales, dimensions)
 *   semantic  — brand layer: generated accent/gray scales + semantic slots
 *   component — per-component tokens aliasing the layers below
 */

export type TokenType =
  | 'color'
  | 'dimension'
  | 'number'
  | 'fontFamily'
  | 'shadow'
  | 'duration'
  | 'string';

export type LayerName = 'global' | 'semantic' | 'component';

export interface TokenAlias {
  layer: LayerName;
  path: string;
}

export interface TokenDef {
  /** Dot path within the layer, e.g. 'green.9', 'color.bg', 'button.radius'. */
  path: string;
  type: TokenType;
  description?: string;
  /** Mode-independent literal. Dimension values are base px numbers,
   *  multiplied by --ev-scaling (and --ev-radius-factor for radius.*) at
   *  emission time. */
  value?: string | number;
  /** Mode-dependent literals (light/dark). */
  modes?: { light: string | number; dark: string | number };
  /** When set, CSS emits var(--ev-<alias path>); the target's value is
   *  resolved at export time for the DTCG literal fallback. */
  alias?: TokenAlias;
}

export interface TokenLayerDef {
  layer: LayerName;
  tokens: TokenDef[];
}

/** CSS custom properties bucketed by mode. */
export interface EmittedVars {
  base: Record<string, string>;
  light: Record<string, string>;
  dark: Record<string, string>;
}
