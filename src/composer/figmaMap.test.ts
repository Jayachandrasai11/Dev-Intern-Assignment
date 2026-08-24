import { describe, expect, it } from 'vitest';
import { VOLT_FIGMA } from '../libraries/volt/composer/figmaMap';
import { GLOBAL_TOKENS } from '../tokens/global';
import { addScreen, createDoc } from './schema';
import { docToFigmaSync } from './figmaMap';
import type { FigmaNode } from './figmaMap';

function docWith(content: any[]) {
  const doc = addScreen(createDoc('volt'), 'Test');
  doc.screens[0].puckData.content = content;
  return doc;
}
const first = (content: any[]): FigmaNode =>
  docToFigmaSync(docWith(content), VOLT_FIGMA, GLOBAL_TOKENS).screens[0].nodes[0];

describe('docToFigmaSync', () => {
  it('translates variant enums to the Figma library vocabulary', () => {
    expect(
      first([{ type: 'Button', props: { variant: 'soft', size: 'lg', disabled: true, loading: false, label: 'Go' } }]),
    ).toEqual({
      kind: 'instance',
      component: 'Button',
      variant: { Variant: 'Soft', Size: 'lg', State: 'Disabled' },
      textProps: { Label: 'Go' },
      booleanProps: { Loading: false },
    });
    expect(
      first([{ type: 'ConnectorIcon', props: { type: 'chademo', muted: true } }]),
    ).toMatchObject({ variant: { Type: 'CHAdeMO', Tone: 'Muted' } });
    expect(
      first([{ type: 'StatusBadge', props: { status: 'in-use', form: 'pill' } }]),
    ).toMatchObject({ variant: { Form: 'Pill', Status: 'In use' } });
    expect(
      first([{ type: 'PriceText', props: { unit: 'kwh', amount: 0.5, emphasis: false } }]),
    ).toMatchObject({ variant: { Unit: 'kWh' }, textProps: { Amount: '$0.50' } });
  });

  it('maps layout primitives to frames with recursion', () => {
    const node = first([
      {
        type: 'Stack',
        props: {
          gap: 12,
          padding: 16,
          items: [{ type: 'Spinner', props: { size: 'md' } }],
        },
      },
    ]);
    expect(node).toEqual({
      kind: 'frame',
      name: 'Stack',
      layout: { direction: 'vertical', gap: 12, padding: 16 },
      children: [
        { kind: 'instance', component: 'Spinner', variant: { Size: 'md' } },
      ],
    });
  });

  it('annotates lossy status mappings instead of failing', () => {
    const chip = first([
      { type: 'ConnectorChip', props: { form: 'chip', status: 'offline', selected: false } },
    ]);
    expect(chip).toMatchObject({
      variant: { Status: 'Available' },
      notes: expect.stringContaining('offline'),
    });
  });

  it('maps session view axis including the no-telemetry fallback', () => {
    expect(
      first([{ type: 'ActiveChargingSession', props: { archetype: 'ring', state: 'suspended', telemetry: false } }]),
    ).toMatchObject({ variant: { View: 'NoTelemetry', State: 'Suspended' } });
  });

  it('throws on unmapped types', () => {
    expect(() => first([{ type: 'Mystery', props: {} }])).toThrow(/No Figma mapping/);
  });
});
