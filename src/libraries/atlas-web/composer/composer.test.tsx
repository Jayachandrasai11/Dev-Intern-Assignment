import { describe, expect, it } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Render } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import { puckDataToJsx } from '../../../composer/codegen';
import { ATLAS_WEB_CODEGEN } from './codegen';
import { composerConfig } from './registry';
import { seedDoc } from './seed';

/** The atlas-web composer pack: every registered component renders under
 *  <Render> with defaultProps, emitters mirror the registry, and the seed
 *  document resolves + round-trips through codegen. */
describe('atlas-web composerConfig', () => {
  const names = Object.keys(composerConfig.components);

  it('registers the website inventory', () => {
    expect(names).toContain('MastheadBanner');
    expect(names).toContain('SiteFooter');
    expect(names).toContain('SpecCompareTable');
    expect(names.length).toBeGreaterThanOrEqual(30);
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

describe('atlas-web codegen', () => {
  it('emitters cover exactly the registered components', () => {
    const registered = Object.keys(composerConfig.components).sort();
    const emitted = Object.keys(ATLAS_WEB_CODEGEN.emitters).sort();
    expect(emitted).toEqual(registered);
  });

  it('emits a model card screen with fixtures and imports', () => {
    const data: Data = {
      content: [
        {
          type: 'ModelCard',
          props: { id: 'm1', model: 1, ctaLabel: 'Book', linkLabel: 'Explore' },
        },
      ],
      root: { props: {} },
    };
    const jsx = puckDataToJsx(data, 'Models', ATLAS_WEB_CODEGEN);
    expect(jsx).toContain('<ModelCard model={SAMPLE_MODELS[1]} ctaLabel="Book" linkLabel="Explore" />');
    expect(jsx).toContain("import { ModelCard } from '../components/organisms';");
    expect(jsx).toContain("import { SAMPLE_MODELS } from '../components/data';");
  });

  it('emits the dealer spread and nav-link mapping', () => {
    const data: Data = {
      content: [
        { type: 'DealerCard', props: { id: 'd1', dealer: 2 } },
        {
          type: 'SiteHeader',
          props: {
            id: 'h1',
            links: 'Scooters, About',
            activeIndex: 1,
            ctaLabel: 'Book',
            phone: '1800',
            variant: 'solid',
          },
        },
      ],
      root: { props: {} },
    };
    const jsx = puckDataToJsx(data, 'Dealers', ATLAS_WEB_CODEGEN);
    expect(jsx).toContain('<DealerCard {...SAMPLE_DEALERS[2]} />');
    expect(jsx).toContain('active: i === 1');
  });

  it('round-trips every seed screen through codegen without errors', () => {
    for (const screen of seedDoc().screens) {
      const jsx = puckDataToJsx(screen.puckData, screen.name, ATLAS_WEB_CODEGEN);
      expect(jsx).toContain('export function');
    }
  });
});

describe('atlas-web seed', () => {
  it('is a desktop atlas-web document whose types are all registered', () => {
    const doc = seedDoc();
    expect(doc.library).toBe('atlas-web');
    const registered = new Set(Object.keys(composerConfig.components));
    const walk = (entries: Array<{ type: string; props: any }>) => {
      for (const entry of entries) {
        expect(registered.has(entry.type), `unknown: ${entry.type}`).toBe(true);
        for (const value of Object.values(entry.props ?? {})) {
          if (
            Array.isArray(value) &&
            value.every((v) => v && typeof v === 'object' && 'type' in v)
          ) {
            walk(value as never);
          }
        }
      }
    };
    for (const screen of doc.screens) {
      expect(screen.viewport).toBe('desktop');
      walk(screen.puckData.content as never);
    }
  });

  it('seed screens render under <Render>', () => {
    for (const screen of seedDoc().screens) {
      const html = renderToStaticMarkup(
        React.createElement(Render, {
          config: composerConfig,
          data: screen.puckData,
        }),
      );
      expect(html.length).toBeGreaterThan(500);
    }
  });
});
