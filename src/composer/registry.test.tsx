import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Render } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import { composerConfig } from '../libraries/volt/composer/registry';

/** Every registered component must render under <Render> with its
 *  defaultProps — the same path board previews and production use. */
describe('composerConfig', () => {
  const names = Object.keys(composerConfig.components);

  it('registers the expected component inventory', () => {
    expect(names).toContain('Stack');
    expect(names).toContain('Button');
    expect(names).toContain('StationListCard');
    expect(names).toContain('ActiveChargingSession');
    expect(names).not.toContain('StationDetailSheet'); // portalled dialog, excluded by design
    expect(names.length).toBeGreaterThanOrEqual(24);
  });

  it('every component is categorized', () => {
    const categorized = Object.values(composerConfig.categories ?? {}).flatMap(
      (c) => c.components ?? [],
    );
    expect([...categorized].sort()).toEqual([...names].sort());
  });

  for (const name of Object.keys(composerConfig.components)) {
    it(`renders ${name} with defaultProps`, () => {
      const component = composerConfig.components[name];
      const props = { ...component.defaultProps } as Record<string, unknown>;
      // slot props are arrays of child nodes in Data form
      const data: Data = {
        content: [{ type: name, props: { id: `${name}-1`, ...props } }],
        root: { props: {} },
      };
      const html = renderToStaticMarkup(
        React.createElement(Render, { config: composerConfig, data }),
      );
      expect(html.length).toBeGreaterThan(0);
    });
  }
});

const renderData = (data: Data) =>
  renderToStaticMarkup(React.createElement(Render, { config: composerConfig, data }));

const buttonProps = (overrides: Record<string, unknown> = {}) => ({
  id: 'b1',
  ...composerConfig.components.Button.defaultProps,
  ...overrides,
});

describe('layout controls', () => {
  it('Group renders token gaps and flows in both directions', () => {
    const group = (direction: 'vertical' | 'horizontal') => ({
      content: [
        {
          type: 'Group',
          props: {
            id: 'g1',
            ...composerConfig.components.Group.defaultProps,
            direction,
            gapV: 3,
            gapH: 2,
            padding: 4,
            items: [{ type: 'Button', props: buttonProps() }],
          },
        },
      ],
      root: { props: {} },
    }) as Data;
    const vertical = renderData(group('vertical'));
    expect(vertical).toContain('flex-direction:column');
    expect(vertical).toContain('row-gap:var(--ev-space-3)');
    expect(vertical).toContain('column-gap:var(--ev-space-2)');
    expect(vertical).toContain('padding:var(--ev-space-4)');
    expect(renderData(group('horizontal'))).toContain('flex-direction:row');
  });

  it('default box adds no wrapper DOM', () => {
    const withDefaultBox = renderData({
      content: [{ type: 'Button', props: buttonProps() }],
      root: { props: {} },
    } as Data);
    const props = buttonProps();
    delete (props as Record<string, unknown>).box;
    const withoutBox = renderData({
      content: [{ type: 'Button', props }],
      root: { props: {} },
    } as Data);
    expect(withDefaultBox).toBe(withoutBox);
  });

  it('non-default box wraps with alignment', () => {
    const html = renderData({
      content: [{ type: 'Button', props: buttonProps({ box: { align: 'center', sticky: 'none', bleed: false } }) }],
      root: { props: {} },
    } as Data);
    expect(html).toContain('align-items:center');
  });

  it('sticky box gets position, offset, and z-index', () => {
    const html = renderData({
      content: [{ type: 'Button', props: buttonProps({ box: { align: 'stretch', sticky: 'bottom', bleed: false } }) }],
      root: { props: {} },
    } as Data);
    expect(html).toContain('position:sticky');
    expect(html).toContain('bottom:0');
    expect(html).toContain('z-index:10');
  });

  it('root renders side padding, block gap, and --ev-page-inset', () => {
    const html = renderData({
      content: [{ type: 'Button', props: buttonProps() }],
      root: { props: { sidePadding: 4, blockGap: 3 } },
    } as Data);
    expect(html).toContain('padding-left:var(--ev-space-4)');
    expect(html).toContain('padding-right:var(--ev-space-4)');
    expect(html).toContain('gap:var(--ev-space-3)');
    expect(html).toContain('--ev-page-inset:var(--ev-space-4)');
  });

  it('every component except Spacer exposes the box field with token-derived options', () => {
    for (const [name, component] of Object.entries(composerConfig.components)) {
      const fields = component.fields as Record<string, any>;
      if (name === 'Spacer') {
        expect(fields.box).toBeUndefined();
        continue;
      }
      expect(fields.box, `${name} is missing the box field`).toBeDefined();
      expect(fields.box.type).toBe('object');
    }
    const groupFields = composerConfig.components.Group.fields as Record<string, any>;
    // 9 space tokens + None
    expect(groupFields.gapV.options).toHaveLength(10);
    expect(groupFields.gapV.options[3].label).toBe('space.3 · 12px');
  });
});
