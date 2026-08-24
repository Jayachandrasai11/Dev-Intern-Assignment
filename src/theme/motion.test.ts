import { describe, expect, it } from 'vitest';
import { VOLT_STATUS_TOKENS } from '../libraries/volt/tokens/status';
import { buildSemanticTokens } from '../tokens/brand';
import { GLOBAL_TOKENS } from '../tokens/global';
import { DEFAULT_PRESET } from './presets';
import { motionTransition, parseCubicBezier, parseSeconds } from './motion';

const layers = [GLOBAL_TOKENS, buildSemanticTokens(DEFAULT_PRESET, VOLT_STATUS_TOKENS)];

describe('motion token → Motion transition bridge', () => {
  it('parses cubic-bezier strings and durations', () => {
    expect(parseCubicBezier('cubic-bezier(0.34, 1.56, 0.64, 1)')).toEqual([
      0.34, 1.56, 0.64, 1,
    ]);
    expect(parseCubicBezier('linear')).toBeUndefined();
    expect(parseSeconds('120ms')).toBeCloseTo(0.12);
    expect(parseSeconds('0.5s')).toBeCloseTo(0.5);
  });

  it('resolves roles through the token chain', () => {
    expect(motionTransition(layers, 'interaction')).toEqual({
      duration: 0.12,
      ease: [0.2, 0, 0, 1],
    });
    expect(motionTransition(layers, 'entrance')).toEqual({
      duration: 0.5,
      ease: [0.32, 0.72, 0, 1], // iOS sheet curve
    });
    expect(motionTransition(layers, 'swap')).toEqual({
      duration: 0.2,
      ease: [0, 0, 0.2, 1],
    });
    expect(motionTransition(layers, 'emphasis')).toEqual({
      duration: 0.2,
      ease: [0.34, 1.56, 0.64, 1],
    });
  });
});
