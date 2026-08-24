import type { TokenLayerDef } from '../tokens/types';
import type { ComposerDoc } from './schema';

/**
 * ComposerDoc → Figma-sync mapping: the generic engine. A UI library with a
 * published Figma library supplies a FigmaPack (per-component mappers + the
 * library/file identity); layout primitives map to auto-layout frames here.
 * The output is the input for the agent-run sync flow documented in
 * scripts/figma-sync.md.
 */

export type FigmaNode =
  | {
      kind: 'instance';
      component: string;
      variant: Record<string, string>;
      textProps?: Record<string, string>;
      booleanProps?: Record<string, boolean>;
      notes?: string;
    }
  | {
      kind: 'frame';
      name: string;
      layout: { direction: 'vertical' | 'horizontal'; gap: number; padding: number };
      children: FigmaNode[];
    }
  | { kind: 'text'; name: string; text: string; role: 'header' };

export interface FigmaPack {
  /** Published Figma library name, e.g. 'Volt DS'. */
  library: string;
  fileKey: string;
  mappers: Record<string, (p: Record<string, any>) => FigmaNode>;
}

export interface FigmaSyncScreen {
  name: string;
  width: number;
  nodes: FigmaNode[];
}

export interface FigmaSyncDoc {
  fileKey: string;
  library: string;
  screens: FigmaSyncScreen[];
}

type Entry = { type: string; props: Record<string, any> };

/** Space-token index (1..9) → base px for Figma's absolute layout values. */
function makeSpacePx(globalTokens: TokenLayerDef) {
  const scale = globalTokens.tokens
    .filter((t) => t.path.startsWith('space.'))
    .map((t) => t.value as number);
  return (i?: number) => (i ? (scale[i - 1] ?? 0) : 0);
}

function slotChildren(props: Record<string, any>): Entry[] {
  for (const value of Object.values(props)) {
    if (Array.isArray(value) && value.every((v) => v && typeof v === 'object' && 'type' in v)) {
      return value as Entry[];
    }
  }
  return [];
}

function mapEntry(
  entry: Entry,
  pack: FigmaPack,
  spacePx: (i?: number) => number,
): FigmaNode {
  // Group: auto-layout frame with the main-axis gap; the cross-axis (wrap)
  // gap and per-item `box` layout (align/sticky/bleed) have no frame
  // equivalent in this sync format yet — deferred.
  if (entry.type === 'Group') {
    const direction = entry.props.direction === 'horizontal' ? 'horizontal' : 'vertical';
    return {
      kind: 'frame',
      name: 'Group',
      layout: {
        direction,
        gap: spacePx(direction === 'horizontal' ? entry.props.gapH : entry.props.gapV),
        padding: spacePx(entry.props.padding),
      },
      children: slotChildren(entry.props).map((e) => mapEntry(e, pack, spacePx)),
    };
  }
  if (entry.type === 'Stack' || entry.type === 'Row') {
    return {
      kind: 'frame',
      name: entry.type,
      layout: {
        direction: entry.type === 'Stack' ? 'vertical' : 'horizontal',
        gap: entry.props.gap ?? 0,
        padding: entry.props.padding ?? 0,
      },
      children: slotChildren(entry.props).map((e) => mapEntry(e, pack, spacePx)),
    };
  }
  if (entry.type === 'Spacer') {
    return {
      kind: 'frame',
      name: 'Spacer',
      layout: { direction: 'vertical', gap: 0, padding: entry.props.height / 2 },
      children: [],
    };
  }
  const mapper = pack.mappers[entry.type];
  if (!mapper) throw new Error(`No Figma mapping for component type "${entry.type}"`);
  return mapper(entry.props ?? {});
}

export function docToFigmaSync(
  doc: ComposerDoc,
  pack: FigmaPack,
  globalTokens: TokenLayerDef,
): FigmaSyncDoc {
  const spacePx = makeSpacePx(globalTokens);
  return {
    fileKey: pack.fileKey,
    library: pack.library,
    screens: doc.screens.map((s) => {
      let nodes = (s.puckData.content as Entry[]).map((e) =>
        mapEntry(e, pack, spacePx),
      );
      // Page panel layout: wrap the screen in a frame carrying the side
      // padding (approximated as uniform padding) and block gap.
      const rootProps = (s.puckData.root?.props ?? {}) as Record<string, any>;
      if (rootProps.sidePadding || rootProps.blockGap) {
        nodes = [
          {
            kind: 'frame',
            name: 'Page',
            layout: {
              direction: 'vertical',
              gap: spacePx(rootProps.blockGap),
              padding: spacePx(rootProps.sidePadding),
            },
            children: nodes,
          },
        ];
      }
      return {
        name: s.name,
        width: s.viewport === 'phone' ? 390 : s.viewport === 'tablet' ? 768 : 1280,
        nodes,
      };
    }),
  };
}
