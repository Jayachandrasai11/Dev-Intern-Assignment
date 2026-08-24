import type { TokenDef } from '../../../tokens/types';

/**
 * Atlas Web's semantic status vocabulary — website feedback states
 * (success/warning/error/info), each with main/bg/text/contrast slots
 * mirroring the pattern atlas components consume (.atlas-status--* plumbing).
 * Appended to the shared semantic core via buildSemanticTokens(brand, …).
 */

const STATUS = [
  { status: 'success', scale: 'green', contrast: '#ffffff' },
  { status: 'warning', scale: 'yellow', contrast: '#332603' },
  { status: 'error', scale: 'red', contrast: '#ffffff' },
  { status: 'info', scale: 'blue', contrast: '#ffffff' },
] as const;

export const ATLAS_STATUS_TOKENS: TokenDef[] = STATUS.flatMap(
  ({ status, scale, contrast }): TokenDef[] => [
    {
      path: `status.${status}`,
      type: 'color',
      alias: { layer: 'global', path: `${scale}.500` },
    },
    {
      path: `status.${status}-bg`,
      type: 'color',
      alias: { layer: 'global', path: `${scale}.100` },
    },
    {
      path: `status.${status}-text`,
      type: 'color',
      alias: { layer: 'global', path: `${scale}.700` },
    },
    {
      path: `status.${status}-contrast`,
      type: 'color',
      value: contrast,
    },
  ],
);
