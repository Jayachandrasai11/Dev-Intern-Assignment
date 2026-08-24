import type { ComposerDoc, ComposerScreen } from '../../../composer/schema';
import { createDoc, screenPosition } from '../../../composer/schema';

/** First-run demo document: the three canonical EV app screens. */

let n = 0;
const mk = (type: string, props: Record<string, unknown>) => ({
  type,
  props: { id: `seed-${type}-${n++}`, ...props },
});

const stack = (gap: number, padding: number, items: unknown[]) =>
  mk('Stack', { gap, padding, items });
const row = (
  gap: number,
  align: string,
  wrap: boolean,
  items: unknown[],
) => mk('Row', { gap, align, wrap, items });

function screen(
  name: string,
  index: number,
  content: unknown[],
): ComposerScreen {
  return {
    id: `seed-screen-${index}`,
    name,
    ...screenPosition(index),
    viewport: 'phone',
    puckData: { content: content as never, root: { props: {} } },
  };
}

export function seedDoc(): ComposerDoc {
  n = 0;
  const doc = createDoc('volt');
  doc.screens = [
    screen('Discovery', 0, [
      mk('ScreenHeader', {
        title: 'Nearby stations',
        subtitle: '4 of 6 stalls free',
        back: false,
      }),
      stack(12, 16, [
        mk('Input', {
          kind: 'search',
          placeholder: 'Search stations',
          error: false,
          disabled: false,
        }),
        row(8, 'center', true, [
          mk('FilterChip', { label: 'Available now', active: true, count: 0 }),
          mk('FilterChip', { label: 'Rapid 50 kW+', active: false, count: 0 }),
          mk('FilterChip', { label: 'Connector', active: false, count: 3 }),
        ]),
        mk('StationListCard', { station: 0, variant: 'default' }),
        mk('StationListCard', { station: 1, variant: 'compact' }),
        row(24, 'center', false, [
          mk('MapPin', { status: 'available', count: 4, selected: false, cluster: 0 }),
          mk('MapPin', { status: 'charging', count: 0, selected: true, cluster: 0 }),
          mk('MapPin', { status: 'faulted', count: 0, selected: false, cluster: 0 }),
          mk('MapPin', { status: 'available', count: 0, selected: false, cluster: 12 }),
        ]),
      ]),
    ]),
    screen('Station detail', 1, [
      mk('ScreenHeader', {
        title: 'Riverside Supercharge Hub',
        subtitle: 'VoltGrid · 1.2 km',
        back: true,
      }),
      stack(12, 16, [
        row(14, 'space-between', false, [
          mk('StatusBadge', { status: 'available', form: 'count', free: 4, total: 6 }),
          mk('PowerText', { kw: 300, tier: 3, emphasis: false }),
        ]),
        mk('ConnectorChip', {
          form: 'row', type: 'ccs2', status: 'available',
          kw: 300, pricePerKwh: 0.48, stallId: 'A1', selected: false,
        }),
        mk('ConnectorChip', {
          form: 'row', type: 'ccs2', status: 'charging',
          kw: 300, pricePerKwh: 0.48, stallId: 'A2', selected: false,
        }),
        mk('ConnectorChip', {
          form: 'row', type: 'chademo', status: 'faulted',
          kw: 50, pricePerKwh: 0.42, stallId: 'B1', selected: false,
        }),
        mk('PricingTable', { showMember: true, idleFeePerMin: 0.4, notes: true }),
        row(6, 'start', true, [
          mk('Tag', { label: 'Restrooms', tone: 'neutral' }),
          mk('Tag', { label: 'Coffee', tone: 'neutral' }),
          mk('Tag', { label: 'Plug & Charge', tone: 'accent' }),
        ]),
        mk('Button', {
          label: 'Navigate', variant: 'solid', size: 'lg',
          loading: false, disabled: false,
        }),
      ]),
    ]),
    screen('Active session', 2, [
      mk('ScreenHeader', { title: 'Charging', subtitle: 'Stall A2', back: true }),
      stack(16, 16, [
        mk('ActiveChargingSession', {
          archetype: 'ring', state: 'charging', telemetry: true, soc: 64, kw: 187,
        }),
        mk('Button', {
          label: 'View receipt', variant: 'ghost', size: 'md',
          loading: false, disabled: false,
        }),
      ]),
    ]),
  ];
  return doc;
}
