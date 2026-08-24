import { describe, expect, it } from 'vitest';
import type { BrandDefinition } from '../tokens/brand';
import { VOLT_STATUS_TOKENS } from '../libraries/volt/tokens/status';
import { buildSemanticTokens } from '../tokens/brand';
import { COMPONENT_TOKENS } from '../tokens/component';
import { GLOBAL_TOKENS } from '../tokens/global';
import { buildDtcgFiles, parseColor } from './dtcg';

const BRAND: BrandDefinition = {
  name: 'Amp',
  accentHex: '#e93d82',
  grayTint: 'mauve',
  radius: 'large',
  scaling: 1.05,
  fontFamily: "'Avenir Next', sans-serif",
  panelStyle: 'solid',
};

const layers = [GLOBAL_TOKENS, buildSemanticTokens(BRAND, VOLT_STATUS_TOKENS), COMPONENT_TOKENS];
const files = buildDtcgFiles(layers);
const byName = new Map(files.map((f) => [f.filename, f]));

function leafAt(json: unknown, path: string): Record<string, unknown> {
  let node = json as Record<string, unknown>;
  for (const seg of path.split('.')) {
    node = node[seg] as Record<string, unknown>;
  }
  return node;
}

function walkLeaves(
  node: Record<string, unknown>,
  visit: (leaf: Record<string, unknown>) => void,
) {
  if ('$value' in node) {
    visit(node);
    return;
  }
  for (const v of Object.values(node)) {
    if (v && typeof v === 'object') {
      walkLeaves(v as Record<string, unknown>, visit);
    }
  }
}

describe('buildDtcgFiles', () => {
  it('produces one file per collection+mode', () => {
    expect(files.map((f) => f.filename)).toEqual([
      'primitives.value.tokens.json',
      'semantic.light.tokens.json',
      'semantic.dark.tokens.json',
      'component.default.tokens.json',
    ]);
    expect(files.map((f) => `${f.collection}/${f.mode}`)).toEqual([
      'Primitives/Value',
      'Semantic/Light',
      'Semantic/Dark',
      'Component/Default',
    ]);
  });

  it('emits DTCG 2025.10 color objects with srgb components and hex', () => {
    const accent9 = leafAt(byName.get('semantic.light.tokens.json')!.json, 'accent.9');
    expect(accent9.$type).toBe('color');
    const v = accent9.$value as Record<string, unknown>;
    expect(v.colorSpace).toBe('srgb');
    expect(v.hex).toBe('#e93d82');
    expect(v.components).toHaveLength(3);
    expect(v.alpha).toBe(1);
  });

  it('light and dark semantic files share the same tree with different values', () => {
    const light = leafAt(byName.get('semantic.light.tokens.json')!.json, 'accent.1');
    const dark = leafAt(byName.get('semantic.dark.tokens.json')!.json, 'accent.1');
    expect((light.$value as { hex: string }).hex).not.toBe(
      (dark.$value as { hex: string }).hex,
    );
  });

  it('uses {dot.path} for same-collection aliases', () => {
    const charging = leafAt(
      byName.get('semantic.light.tokens.json')!.json,
      'status.charging',
    );
    expect(charging.$value).toBe('{accent.9}');
  });

  it('emits literal fallback + com.figma aliasData for cross-collection aliases', () => {
    const available = leafAt(
      byName.get('semantic.light.tokens.json')!.json,
      'status.available',
    );
    expect(available.$type).toBe('color');
    expect((available.$value as { hex: string }).hex).toMatch(/^#/);
    const ext = available.$extensions as Record<string, any>;
    expect(ext['com.figma'].aliasData).toEqual({
      targetVariableSetName: 'Primitives',
      targetVariableName: 'green/9',
    });
  });

  it('resolves dimensions to px with brand scaling and radius factor applied', () => {
    const space3 = leafAt(byName.get('primitives.value.tokens.json')!.json, 'space.3');
    expect(space3.$value).toEqual({ value: 12.6, unit: 'px' }); // 12 × 1.05
    const radius3 = leafAt(byName.get('primitives.value.tokens.json')!.json, 'radius.3');
    expect(radius3.$value).toEqual({ value: 9.45, unit: 'px' }); // 6 × 1.05 × 1.5
  });

  it('keeps aliased dimension fallbacks consistent with their targets', () => {
    // button.radius aliases global radius.3 — its literal fallback must equal
    // the exported primitives radius.3 value (scaling × radius factor applied).
    const buttonRadius = leafAt(
      byName.get('component.default.tokens.json')!.json,
      'button.radius',
    );
    const radius3 = leafAt(
      byName.get('primitives.value.tokens.json')!.json,
      'radius.3',
    );
    expect(buttonRadius.$value).toEqual(radius3.$value);
  });

  it('excludes shadows and only emits Figma-compatible token types', () => {
    const allowed = new Set([
      'color',
      'dimension',
      'number',
      'fontFamily',
      'duration',
      'string',
    ]);
    for (const f of files) {
      expect(leafExists(f.json, 'shadow')).toBe(false);
      walkLeaves(f.json as Record<string, unknown>, (leaf) => {
        expect(allowed.has(leaf.$type as string)).toBe(true);
      });
    }
  });

  it('exports fontFamily as a single family name', () => {
    const font = leafAt(byName.get('semantic.light.tokens.json')!.json, 'font.family');
    expect(font.$value).toBe('Avenir Next');
  });
});

function leafExists(json: unknown, key: string): boolean {
  return key in (json as Record<string, unknown>);
}

describe('parseColor', () => {
  it('parses 6-digit hex', () => {
    expect(parseColor('#00c16a')).toEqual({
      colorSpace: 'srgb',
      components: [0, 0.7569, 0.4157],
      alpha: 1,
      hex: '#00c16a',
    });
  });
  it('parses 8-digit hex alpha', () => {
    expect(parseColor('#ffffffcc')!.alpha).toBeCloseTo(0.8, 2);
  });
  it('parses rgba()', () => {
    const c = parseColor('rgba(0, 0, 0, 0.4)')!;
    expect(c.components).toEqual([0, 0, 0]);
    expect(c.alpha).toBe(0.4);
  });
  it('rejects unsupported formats', () => {
    expect(parseColor('color(display-p3 1 0 0)')).toBeNull();
  });
});
