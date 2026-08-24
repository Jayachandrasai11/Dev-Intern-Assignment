import type { ComponentConfig, Config } from '@puckeditor/core';
import type { ComponentType, ReactNode } from 'react';
import React from 'react';
import type { TokenLayerDef } from '../tokens/types';
import { Group, LayoutBox, Page, Row, Spacer, Stack } from './primitives';

/**
 * The generic registry kit: everything a UI library needs to assemble its
 * Puck config — field factories, token-derived spacing options, the shared
 * per-block layout controls, the library-agnostic layout-primitive configs,
 * and the config assembler (withLayout wrapping + Page root).
 *
 * Library packs own only their component configs and categories.
 */

export const opts = <T extends string | number | boolean>(
  values: readonly T[],
  labeler: (v: T) => string = String,
) => values.map((value) => ({ value, label: labeler(value) }));

export const boolField = (label?: string) => ({
  type: 'radio' as const,
  label,
  options: [
    { value: false, label: 'Off' },
    { value: true, label: 'On' },
  ],
});

export interface SpaceOptions {
  /** Base px per token index (1-based); reused by figma mapping. */
  spacePx: number[];
  /** value = token index (0 = none) — fields render var(--ev-space-N). */
  spaceIndexOptions: Array<{ value: number; label: string }>;
  /** value = px (0 = none) — legacy Stack/Row/Spacer props keep px storage. */
  spacePxOptions: Array<{ value: number; label: string }>;
}

/** All composer spacing pickers derive from the library's global space
 *  scale — never hardcoded px lists. */
export function makeSpaceOptions(globalTokens: TokenLayerDef): SpaceOptions {
  const spaceTokens = globalTokens.tokens.filter((t) =>
    t.path.startsWith('space.'),
  );
  return {
    spacePx: spaceTokens.map((t) => t.value as number),
    spaceIndexOptions: [
      { value: 0, label: 'None' },
      ...spaceTokens.map((t, i) => ({
        value: i + 1,
        label: `${t.path} · ${t.value}px`,
      })),
    ],
    spacePxOptions: [
      { value: 0, label: 'None' },
      ...spaceTokens.map((t) => ({
        value: t.value as number,
        label: `${t.path} · ${t.value}px`,
      })),
    ],
  };
}

// ---------- shared per-block layout controls ----------
export const DEFAULT_BOX = {
  align: 'stretch',
  sticky: 'none',
  bleed: false,
} as const;

// Named `box`, not `layout` — component prop names like BottomNavBar's
// `layout` must stay collision-free.
export const boxField = {
  type: 'object' as const,
  label: 'Layout',
  objectFields: {
    align: {
      type: 'radio' as const,
      label: 'Align',
      options: opts(['left', 'center', 'right', 'stretch'] as const),
    },
    sticky: {
      type: 'radio' as const,
      label: 'Sticky',
      options: opts(['none', 'top', 'bottom'] as const),
    },
    bleed: boolField('Full bleed'),
  },
};

/** Adds the shared `box` field and LayoutBox wrapper to a component config. */
export function withLayout(config: ComponentConfig<any>): ComponentConfig<any> {
  const Inner = config.render as ComponentType<any>;
  return {
    ...config,
    fields: { ...config.fields, box: boxField },
    defaultProps: { ...(config.defaultProps ?? {}), box: { ...DEFAULT_BOX } },
    render: ({ box, ...rest }: any) =>
      // Strip `box` so it never leaks onto the inner component's DOM;
      // pre-feature items carry no box prop at all.
      React.createElement(
        LayoutBox,
        box ?? {},
        React.createElement(Inner, rest),
      ),
  };
}

/** Library-agnostic layout-primitive configs (Group/Stack/Row/Spacer),
 *  parameterized by the library's space scale. */
export function makeLayoutComponents(
  space: SpaceOptions,
): Record<string, ComponentConfig<any>> {
  return {
    Group: {
      fields: {
        direction: {
          type: 'radio',
          label: 'Flow',
          options: opts(['vertical', 'horizontal'] as const),
        },
        wrap: boolField('Wrap'),
        gapV: {
          type: 'select',
          label: 'Vertical gap',
          options: space.spaceIndexOptions,
        },
        gapH: {
          type: 'select',
          label: 'Horizontal gap',
          options: space.spaceIndexOptions,
        },
        padding: {
          type: 'select',
          label: 'Padding',
          options: space.spaceIndexOptions,
        },
        align: {
          type: 'radio',
          label: 'Align children',
          options: opts(['left', 'center', 'right', 'stretch'] as const),
        },
        justify: {
          type: 'select',
          label: 'Justify',
          options: opts(['start', 'center', 'end', 'space-between'] as const),
        },
        items: { type: 'slot' },
      },
      defaultProps: {
        direction: 'vertical',
        wrap: false,
        gapV: 3,
        gapH: 3,
        padding: 0,
        align: 'stretch',
        justify: 'start',
        items: [],
      },
      render: ({
        direction,
        wrap,
        gapV,
        gapH,
        padding,
        align,
        justify,
        items: Items,
      }: any) =>
        React.createElement(
          Group,
          { direction, wrap, gapV, gapH, padding, align, justify },
          React.createElement(Items),
        ),
    },
    Stack: {
      fields: {
        gap: { type: 'select', options: space.spacePxOptions },
        padding: { type: 'select', options: space.spacePxOptions },
        items: { type: 'slot' },
      },
      defaultProps: { gap: 12, padding: 16, items: [] },
      render: ({ gap, padding, items: Items }: any) =>
        React.createElement(
          Stack,
          { gap, padding },
          React.createElement(Items),
        ),
    },
    Row: {
      fields: {
        gap: { type: 'select', options: space.spacePxOptions },
        align: {
          type: 'select',
          options: opts(['start', 'center', 'end', 'space-between'] as const),
        },
        wrap: boolField(),
        items: { type: 'slot' },
      },
      defaultProps: { gap: 8, align: 'center', wrap: false, items: [] },
      render: ({ gap, align, wrap, items: Items }: any) =>
        React.createElement(
          Row,
          { gap, align, wrap },
          React.createElement(Items),
        ),
    },
    Spacer: {
      // Legacy freeform heights still render (prop passes through); they just
      // won't match a select option until edited.
      fields: { height: { type: 'select', options: space.spacePxOptions } },
      defaultProps: { height: 24 },
      render: ({ height }: any) => React.createElement(Spacer, { height }),
    },
  };
}

/** Blocks that must NOT get the shared layout wrapper (Spacer IS spacing). */
const DEFAULT_NO_LAYOUT = ['Spacer'];

/** Assemble a library's Puck config: withLayout-wrap every component and
 *  install the shared Page root (side padding + block gap from the library's
 *  space scale). */
export function makeComposerConfig({
  categories,
  components,
  space,
  noLayout = DEFAULT_NO_LAYOUT,
}: {
  categories: Config['categories'];
  components: Record<string, ComponentConfig<any>>;
  space: SpaceOptions;
  noLayout?: string[];
}): Config {
  const skip = new Set(noLayout);
  return {
    categories,
    components: Object.fromEntries(
      Object.entries(components).map(([name, cfg]) => [
        name,
        skip.has(name) ? cfg : withLayout(cfg),
      ]),
    ) as Config['components'],
    root: {
      fields: {
        // Overriding root.fields drops Puck's built-in title — re-declare it.
        title: { type: 'text' },
        sidePadding: {
          type: 'select',
          label: 'Side padding',
          options: space.spaceIndexOptions,
        },
        blockGap: {
          type: 'select',
          label: 'Block gap',
          options: space.spaceIndexOptions,
        },
      },
      defaultProps: { title: '', sidePadding: 0, blockGap: 0 },
      // Destructured defaults: pre-feature docs carry no root props.
      render: ({
        children,
        sidePadding = 0,
        blockGap = 0,
      }: {
        children?: ReactNode;
        sidePadding?: number;
        blockGap?: number;
      }) =>
        React.createElement(Page, { sidePadding, blockGap }, children),
    },
  };
}
