import { buildSemanticTokens } from '../../../tokens/brand';
import type { BrandDefinition } from '../../../tokens/brand';
import type { TokenDef, TokenLayerDef } from '../../../tokens/types';

const replacements: Record<string, TokenDef> = {
  'color.bg': { path: 'color.bg', type: 'color', alias: { layer: 'global', path: 'calm.canvas' } },
  'color.surface': { path: 'color.surface', type: 'color', alias: { layer: 'global', path: 'calm.surface' } },
  'color.surface-muted': { path: 'color.surface-muted', type: 'color', alias: { layer: 'global', path: 'calm.surface-muted' } },
  'color.panel': { path: 'color.panel', type: 'color', alias: { layer: 'global', path: 'calm.surface' } },
  'color.overlay': { path: 'color.overlay', type: 'color', alias: { layer: 'global', path: 'calm.scrim' } },
  'color.text': { path: 'color.text', type: 'color', alias: { layer: 'global', path: 'calm.ink' } },
  'color.text-secondary': { path: 'color.text-secondary', type: 'color', alias: { layer: 'global', path: 'calm.ink-muted' } },
  'color.border': { path: 'color.border', type: 'color', alias: { layer: 'global', path: 'calm.border' } },
  'color.border-strong': { path: 'color.border-strong', type: 'color', alias: { layer: 'global', path: 'calm.border-strong' } },
};

const statuses: TokenDef[] = [
  ['success', 'success', 'success-bg', 'success-text'],
  ['warning', 'warning', 'warning-bg', 'warning-text'],
  ['danger', 'danger', 'danger-bg', 'danger-text'],
  ['error', 'danger', 'danger-bg', 'danger-text'],
  ['info', 'ink-muted', 'surface-muted', 'ink-muted'],
].flatMap(([name, source, background, text]): TokenDef[] => [
  { path: `status.${name}`, type: 'color', alias: { layer: 'global', path: `calm.${source}` } },
  { path: `status.${name}-bg`, type: 'color', alias: { layer: 'global', path: `calm.${background}` } },
  { path: `status.${name}-text`, type: 'color', alias: { layer: 'global', path: `calm.${text}` } },
  { path: `status.${name}-contrast`, type: 'color', value: '#ffffff' },
]);

const foundationRoles: TokenDef[] = [
  ...[2, 3, 4, 5, 6].map((step): TokenDef => ({
    path: `layout.space-${step}`,
    type: 'dimension',
    alias: { layer: 'global', path: `space.${step}` },
  })),
  { path: 'radius.pill', type: 'dimension', alias: { layer: 'global', path: 'radius.5' } },
  { path: 'font.weight-regular', type: 'number', alias: { layer: 'global', path: 'font-weight.regular' } },
  { path: 'font.weight-medium', type: 'number', alias: { layer: 'global', path: 'font-weight.medium' } },
  { path: 'font.weight-semibold', type: 'number', alias: { layer: 'global', path: 'font-weight.semibold' } },
  { path: 'font.weight-bold', type: 'number', alias: { layer: 'global', path: 'font-weight.bold' } },
  { path: 'elevation.floating', type: 'shadow', alias: { layer: 'global', path: 'shadow.floating' } },
  { path: 'elevation.sheet', type: 'shadow', alias: { layer: 'global', path: 'shadow.sheet' } },
  { path: 'elevation.transient', type: 'shadow', alias: { layer: 'global', path: 'shadow.transient' } },
  { path: 'motion.spinner.duration', type: 'duration', alias: { layer: 'global', path: 'duration.spinner' } },
  { path: 'motion.scanner.duration', type: 'duration', alias: { layer: 'global', path: 'duration.scanner' } },
];

export function buildAtlasChargeSemantic(brand: BrandDefinition): TokenLayerDef {
  const base = buildSemanticTokens(brand);
  return {
    layer: 'semantic',
    tokens: [
      ...base.tokens.map((token) => replacements[token.path] ?? token),
      replacements['color.surface-muted'],
      ...foundationRoles,
      ...statuses,
    ],
  };
}
