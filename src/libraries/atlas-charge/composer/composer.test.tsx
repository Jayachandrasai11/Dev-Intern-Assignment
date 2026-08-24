import type { Data } from '@puckeditor/core';
import { Render } from '@puckeditor/core';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { puckDataToJsx } from '../../../composer/codegen';
import { ATLAS_CHARGE_CATALOGUE } from '../showcase/catalogue';
import {
  ATLAS_CHARGE_ATOM_SECTIONS,
  ATLAS_CHARGE_MOLECULE_SECTIONS,
  ATLAS_CHARGE_ORGANISM_SECTIONS,
} from '../showcase/catalogue';
import { Section } from '../../../playground/Section';
import {
  ActiveSession,
  Accordion,
  BottomNav,
  Button,
  ChargeIcon,
  Coachmark,
  MapMarker,
  ModalSheet,
  OtpInput,
  PaymentMethodSelector,
  DetailPanel,
  RecordRow,
  SelectionControl,
  SettingRow,
  StationCard,
  TextField,
  Toggle,
} from '../components';
import { ATLAS_CHARGE_CODEGEN } from './codegen';
import { composerConfig } from './registry';
import { seedDoc } from './seed';

describe('Atlas Charge catalogue and composer', () => {
  it('uses native fields and Radix headless controls for selection and toggles', () => {
    const html = renderToStaticMarkup(<><TextField label="Charger ID" /><OtpInput /><SelectionControl label="Consent" /><Toggle label="Notifications" /></>);
    expect(html.match(/<input/g)?.length).toBe(4);
    expect(html).toContain('autoComplete="one-time-code"');
    expect(html).toContain('role="checkbox"');
    expect(html).toContain('role="switch"');
    expect(html).not.toContain('readonly=""');
  });

  it('ports composite interaction patterns to Radix primitives', () => {
    const html = renderToStaticMarkup(<><DetailPanel variant="duration" /><PaymentMethodSelector state="selected" /><Accordion state="expanded" /></>);
    expect(html).toContain('role="slider"');
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('data-radix-collection-item');
    expect(html).toContain('aria-expanded="true"');
  });

  it('renders the curated Hugeicons vocabulary with decorative and labelled semantics', () => {
    const decorative = renderToStaticMarkup(<ChargeIcon name="flash" />);
    const labelled = renderToStaticMarkup(<ChargeIcon name="qr" label="QR code" />);
    expect(decorative).toContain('aria-hidden="true"');
    expect(decorative).toContain('<svg');
    expect(labelled).toContain('role="img"');
    expect(labelled).toContain('aria-label="QR code"');
  });

  it('does not use character glyphs as component icon stand-ins', () => {
    const source = [
      'src/libraries/atlas-charge/components/atoms/index.tsx',
      'src/libraries/atlas-charge/components/molecules/index.tsx',
      'src/libraries/atlas-charge/components/organisms/index.tsx',
      'src/libraries/atlas-charge/showcase/catalogue.tsx',
      'src/libraries/atlas-charge/components/atlas-charge.css',
    ].map((path) => readFileSync(path, 'utf8')).join('\n');
    expect(source).not.toMatch(/[⌕≡⌂⚡◇☎✉▦✦★]/);
    expect(source).not.toMatch(/content:'(?:✓|●|×)'/);
  });

  it('mirrors the Volt atomic hierarchy with explicit tier barrels', () => {
    const tierSources = ['atoms', 'molecules', 'organisms'].map((tier) =>
      readFileSync(`src/libraries/atlas-charge/components/${tier}/index.tsx`, 'utf8'),
    );
    expect(tierSources.every((source) => source.includes('export function'))).toBe(true);
    expect(readFileSync('src/libraries/atlas-charge/components/index.ts', 'utf8')).toContain("export * from './atoms'");
  });

  it('exposes native navigation, dialog, marker, and row semantics', () => {
    const nav = renderToStaticMarkup(<BottomNav active="sessions" state="badge" />);
    expect(nav).toContain('aria-current="page"');
    expect(nav).toContain('aria-label="1 new session update"');
    expect(nav).toContain('<small>Sessions</small>');

    const dialog = renderToStaticMarkup(<ModalSheet />);
    expect(dialog).toContain('role="dialog"');
    expect(dialog).toContain('aria-modal="true"');
    expect(dialog).toContain('aria-labelledby=');

    expect(renderToStaticMarkup(<MapMarker />)).toMatch(/^<button/);
    expect(renderToStaticMarkup(<RecordRow kind="session" title="Session" meta="Today" />)).toMatch(/^<div/);
    expect(renderToStaticMarkup(<RecordRow kind="session" title="Session" meta="Today" onSelect={() => undefined} />)).toMatch(/^<button/);
    expect(renderToStaticMarkup(<SettingRow title="Account" />)).toMatch(/^<button/);
  });

  it('keeps loading station content legible without presenting unverified availability', () => {
    const html = renderToStaticMarkup(<StationCard loading />);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('Loading status');
    expect(html).toContain('Availability and tariff are updating');
    expect(html).not.toContain('CCS2 · 60 kW · ₹18/kWh');
  });

  it('removes completed guidance and withholds untrusted telemetry', () => {
    expect(renderToStaticMarkup(<Coachmark state="dismissed" />)).toBe('');
    expect(renderToStaticMarkup(<Coachmark state="completed" />)).toBe('');
    const unknown = renderToStaticMarkup(<ActiveSession state="unknown" />);
    expect(unknown).not.toContain('12.4 kWh');
    expect(unknown).not.toContain('₹224');
    expect(unknown).toContain('Energy unavailable');
    expect(unknown).toContain('Live session data is unavailable');
  });

  it('keeps rich loading labels intact without string coercion', () => {
    const html = renderToStaticMarkup(<Button state="loading"><><strong>Start</strong> charging</></Button>);
    expect(html).toContain('<strong>Start</strong> charging');
    expect(html).not.toContain('[object Object]');
    expect(html).toContain('aria-busy="true"');
  });
  it('preserves all 61 unique catalogue families in specification order', () => {
    expect(ATLAS_CHARGE_CATALOGUE).toHaveLength(61);
    expect(ATLAS_CHARGE_CATALOGUE.map((entry) => entry.number)).toEqual(
      Array.from({ length: 61 }, (_, index) => index + 1),
    );
    expect(new Set(ATLAS_CHARGE_CATALOGUE.map((entry) => entry.title)).size).toBe(61);
  });

  it('keeps all catalogue families discoverable while deferring offscreen examples', () => {
    const sections = [
      ...ATLAS_CHARGE_ATOM_SECTIONS,
      ...ATLAS_CHARGE_MOLECULE_SECTIONS,
      ...ATLAS_CHARGE_ORGANISM_SECTIONS,
    ];
    expect(sections).toHaveLength(61);
    expect(sections.every((section) => section.defer)).toBe(true);
    const html = renderToStaticMarkup(<>{sections.map((section) => <Section key={section.id} def={section} />)}</>);
    expect((html.match(/class="pg-section"/g) ?? [])).toHaveLength(61);
    expect((html.match(/class="pg-section__load"/g) ?? [])).toHaveLength(61);
    expect(html).not.toContain('ac-showcase-cell');

    // Regression guard against the measured 5,098-node / 606-control eager baseline.
    const initialElementCount = (html.match(/<(?!!|\/)[a-z][^>]*>/gi) ?? []).length;
    const initialControlCount = (html.match(/<(?:a|button|input|select|textarea)\b/gi) ?? []).length;
    expect(initialElementCount).toBeLessThan(500);
    expect(initialControlCount).toBe(61);
  });

  it('encodes the supported mobile contexts without introducing a desktop product layout', () => {
    const css = readFileSync('src/libraries/atlas-charge/components/atlas-charge.css', 'utf8');
    expect(css).toContain('@media (max-width:420px)');
    expect(css).toContain('@media (orientation:landscape) and (max-height:520px)');
    expect(css).toContain('@container (max-width:420px)');
    expect(css).toContain('env(safe-area-inset-top)');
    expect(css).toContain('env(safe-area-inset-bottom)');
    expect(css).toContain('100dvh');
    expect(css).not.toMatch(/@media \(min-width:[^)]+\).*ac-(?:screen|launch|scanner|session|readiness|summary|form|legal)/s);
  });

  it('categorizes every reusable component exactly once', () => {
    const names = Object.keys(composerConfig.components);
    const categorized = Object.values(composerConfig.categories ?? {}).flatMap(
      (category) => category.components ?? [],
    );
    expect([...categorized].sort()).toEqual([...names].sort());
  });

  for (const name of Object.keys(composerConfig.components)) {
    it(`renders ${name} with its default variant`, () => {
      const component = composerConfig.components[name];
      const data: Data = {
        content: [{ type: name, props: { id: `${name}-test`, ...component.defaultProps } }],
        root: { props: {} },
      };
      expect(
        renderToStaticMarkup(React.createElement(Render, { config: composerConfig, data })).length,
      ).toBeGreaterThan(0);
    });
  }

  it('keeps code emitters aligned with the registry', () => {
    expect(Object.keys(ATLAS_CHARGE_CODEGEN.emitters).sort()).toEqual(
      Object.keys(composerConfig.components).sort(),
    );
  });

  it('provides four phone seeds that render and generate JSX', () => {
    const doc = seedDoc();
    expect(doc.library).toBe('atlas-charge');
    expect(doc.brand.name).toBe('Calm Ink');
    expect(doc.screens).toHaveLength(4);
    for (const screen of doc.screens) {
      expect(screen.viewport).toBe('phone');
      expect(
        renderToStaticMarkup(
          React.createElement(Render, { config: composerConfig, data: screen.puckData }),
        ).length,
      ).toBeGreaterThan(100);
      expect(puckDataToJsx(screen.puckData, screen.name, ATLAS_CHARGE_CODEGEN)).toContain(
        'export function',
      );
    }
  });
});
