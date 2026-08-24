import { describe, expect, it } from 'vitest';
import { buildDtcgFiles, buildLeverDtcgFiles } from '../export/dtcg';
import { ATLAS_COMPONENT_TOKENS } from '../libraries/atlas-web/tokens/component';
import { ATLAS_GLOBAL_TOKENS } from '../libraries/atlas-web/tokens/global';
import { ATLAS_LEVERS } from '../libraries/atlas-web/tokens/levers';
import { ATLAS_DEFAULT_PRESET } from '../libraries/atlas-web/tokens/presets';
import { ATLAS_STATUS_TOKENS } from '../libraries/atlas-web/tokens/status';
import { buildSemanticTokens } from './brand';
import {
  buildNeutralLever,
  MAX_LEVER_MODES,
  PILL_RADIUS,
} from './levers';
import type { LeverDef } from './levers';

const lever = (dim: string): LeverDef => {
  const found = ATLAS_LEVERS.levers.find((l) => l.dimension === dim);
  if (!found) throw new Error(`no ${dim} lever`);
  return found;
};

describe('lever option caps', () => {
  it('rejects levers beyond the Figma mode cap', () => {
    expect(() =>
      buildNeutralLever(
        ['gray', 'mauve', 'slate', 'sage', 'olive'],
        ATLAS_DEFAULT_PRESET,
      ),
    ).toThrow(/caps collections at 4 modes/);
  });

  it('every atlas lever stays within the cap', () => {
    for (const l of ATLAS_LEVERS.levers) {
      expect(l.options.length).toBeGreaterThan(0);
      expect(l.options.length).toBeLessThanOrEqual(MAX_LEVER_MODES);
    }
  });
});

describe('lever value completeness', () => {
  it('every token has a value for every option — no holes', () => {
    for (const l of ATLAS_LEVERS.levers) {
      for (const t of l.tokens) {
        for (const option of l.options) {
          expect(
            t.valuesByOption[option],
            `${l.dimension} ${t.path} [${option}]`,
          ).toBeDefined();
        }
      }
    }
  });

  it('accent lever carries the full twin slice (52 tokens)', () => {
    expect(lever('accent').tokens).toHaveLength(52);
  });

  it('neutral lever carries the full twin slice (48 tokens)', () => {
    expect(lever('neutral').tokens).toHaveLength(48);
  });
});

describe('accent lever fidelity (step 9 === preset hex)', () => {
  const acc = () => lever('accent');
  const token = (path: string) => {
    const t = acc().tokens.find((x) => x.path === path);
    if (!t) throw new Error(`missing ${path}`);
    return t;
  };

  it('Atlas light step 9 is the brand orange in both appearances', () => {
    expect(token('accent.light.9').valuesByOption['Atlas']).toBe('#ff5310');
    expect(token('accent.dark.9').valuesByOption['Atlas']).toBe('#ff5310');
  });

  it('Ink twins split per the darkAccentHex override', () => {
    expect(token('accent.light.9').valuesByOption['Atlas Ink']).toBe('#1d1b1b');
    expect(token('accent.dark.9').valuesByOption['Atlas Ink']).toBe('#f4f4f4');
  });
});

describe('radius lever role baking', () => {
  const values = (option: string) =>
    Object.fromEntries(
      lever('radius').tokens.map((t) => [t.path, t.valuesByOption[option]]),
    );

  it('bakes base × factor per mode at 100% scaling', () => {
    expect(values('None')).toEqual({
      'radius.small': 0,
      'radius.interactive': 0,
      'radius.container': 0,
      'radius.overlay': 0,
    });
    // Atlas global radius scale [2, 4, 8, 12, 16, 24] → roles 4/8/12/16.
    expect(values('Small')).toEqual({
      'radius.small': 3,
      'radius.interactive': 6,
      'radius.container': 9,
      'radius.overlay': 12,
    });
    expect(values('Medium')).toEqual({
      'radius.small': 4,
      'radius.interactive': 8,
      'radius.container': 12,
      'radius.overlay': 16,
    });
  });

  it('Full mode pills the interactive-class roles only', () => {
    expect(values('Full')).toEqual({
      'radius.small': PILL_RADIUS,
      'radius.interactive': PILL_RADIUS,
      'radius.container': 18,
      'radius.overlay': 24,
    });
  });
});

describe('typeface lever', () => {
  it('families are distinct and style names are per-family', () => {
    const t = lever('typeface');
    const family = t.tokens.find((x) => x.path === 'font.family');
    const semibold = t.tokens.find((x) => x.path === 'font.style.semibold');
    const families = Object.values(family?.valuesByOption ?? {});
    expect(new Set(families).size).toBe(t.options.length);
    // Spike-verified divergence: Inter spells it with a space.
    expect(semibold?.valuesByOption['Inter']).toBe('Semi Bold');
    expect(semibold?.valuesByOption['Poppins']).toBe('SemiBold');
  });
});

describe('semantic forks', () => {
  const semantic = buildSemanticTokens(ATLAS_DEFAULT_PRESET, ATLAS_STATUS_TOKENS);

  it('every fork path exists in the semantic layer', () => {
    for (const fork of ATLAS_LEVERS.forks) {
      expect(
        semantic.tokens.some((t) => t.path === fork.path),
        `semantic missing ${fork.path}`,
      ).toBe(true);
    }
  });

  it('every fork target exists in its lever collection', () => {
    for (const fork of ATLAS_LEVERS.forks) {
      const l = lever(fork.dimension);
      for (const target of [fork.light, fork.dark]) {
        expect(
          l.tokens.some((t) => t.path === target),
          `${fork.dimension} lever missing ${target}`,
        ).toBe(true);
      }
    }
  });

  it('covers all ramp slots, radius roles, and the family slot', () => {
    const paths = new Set(ATLAS_LEVERS.forks.map((f) => f.path));
    for (let i = 1; i <= 12; i++) {
      expect(paths.has(`accent.${i}`)).toBe(true);
      expect(paths.has(`accent.a${i}`)).toBe(true);
      expect(paths.has(`gray.${i}`)).toBe(true);
      expect(paths.has(`gray.a${i}`)).toBe(true);
    }
    for (const role of ['small', 'interactive', 'container', 'overlay']) {
      const fork = ATLAS_LEVERS.forks.find((f) => f.path === `radius.${role}`);
      expect(fork?.light).toBe(fork?.dark); // appearance-independent
    }
    expect(paths.has('font.family')).toBe(true);
  });
});

describe('DTCG export with levers', () => {
  const layers = [
    ATLAS_GLOBAL_TOKENS,
    buildSemanticTokens(ATLAS_DEFAULT_PRESET, ATLAS_STATUS_TOKENS),
    ATLAS_COMPONENT_TOKENS,
  ];

  const aliasData = (json: Record<string, unknown>, path: string[]) => {
    let node: any = json;
    for (const seg of path) node = node?.[seg];
    return node?.$extensions?.['com.figma']?.aliasData;
  };

  it('emits one file per lever option, values intact', () => {
    const files = buildLeverDtcgFiles(ATLAS_LEVERS);
    expect(files).toHaveLength(3 + 4 + 4 + 4);
    const atlas = files.find((f) => f.filename === 'lever-accent.atlas.tokens.json');
    expect(atlas?.collection).toBe('10 Lever · Accent');
    expect((atlas?.json as any).accent.light['9'].$value.hex).toBe('#ff5310');
    const full = files.find((f) => f.filename === 'lever-radius.full.tokens.json');
    expect((full?.json as any).radius.interactive.$value).toEqual({
      value: PILL_RADIUS,
      unit: 'px',
    });
  });

  it('semantic files fork per mode into the lever collections', () => {
    const files = buildDtcgFiles(layers, ATLAS_LEVERS);
    const light = files.find((f) => f.filename === 'semantic.light.tokens.json');
    const dark = files.find((f) => f.filename === 'semantic.dark.tokens.json');
    expect(aliasData(light!.json, ['accent', '9'])).toEqual({
      targetVariableSetName: '10 Lever · Accent',
      targetVariableName: 'accent/light/9',
    });
    expect(aliasData(dark!.json, ['accent', '9'])).toEqual({
      targetVariableSetName: '10 Lever · Accent',
      targetVariableName: 'accent/dark/9',
    });
    // Appearance-independent fork: same target both modes, lever collection
    // replaces the old Primitives alias.
    expect(aliasData(light!.json, ['radius', 'small'])).toEqual({
      targetVariableSetName: '12 Lever · Radius',
      targetVariableName: 'radius/small',
    });
    expect(aliasData(dark!.json, ['radius', 'small'])).toEqual(
      aliasData(light!.json, ['radius', 'small']),
    );
    expect(aliasData(light!.json, ['font', 'family'])).toEqual({
      targetVariableSetName: '13 Lever · Typeface',
      targetVariableName: 'font/family',
    });
    // Lever files ride along after the four collection files.
    expect(files).toHaveLength(4 + 15);
  });

  it('stays backwards-compatible without a lever set', () => {
    const files = buildDtcgFiles(layers);
    expect(files).toHaveLength(4);
    const light = files.find((f) => f.filename === 'semantic.light.tokens.json');
    expect(aliasData(light!.json, ['accent', '9'])).toBeUndefined();
  });
});
