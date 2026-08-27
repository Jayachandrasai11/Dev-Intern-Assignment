import { describe, expect, it } from 'vitest';
import { VOLT_CODEGEN } from '../libraries/volt/composer/codegen';
import { puckDataToJsx } from './codegen';
import type { Data } from '@puckeditor/core';

describe('puckDataToJsx - multi-fixture import', () => {
  it('imports fixtures from their correct source modules', () => {
    const data: Data = {
      content: [
        { type: 'ScreenHeader', props: { id: 'h', title: 'Riverside Supercharge Hub', subtitle: 'VoltGrid · 1.2 km', back: true } },
        { type: 'Stack', props: {
          id: 's', gap: 12, padding: 16,
          items: [
            { type: 'PricingTable', props: { id: 'pt', showMember: true, idleFeePerMin: 0.4, notes: true } },
          ],
        }},
      ],
      root: { props: {} },
    };
    const jsx = puckDataToJsx(data, 'Station detail', VOLT_CODEGEN);
    // SAMPLE_PRICE_BANDS comes from '../components/data'
    expect(jsx).toContain("import { SAMPLE_PRICE_BANDS } from '../components/data';");
    // SAMPLE_TARIFF_NOTES comes from '../components/tariffs'
    expect(jsx).toContain("import { SAMPLE_TARIFF_NOTES } from '../components/tariffs';");
    // They must NOT be imported from the same module
    expect(jsx).not.toContain("import { SAMPLE_PRICE_BANDS, SAMPLE_TARIFF_NOTES } from '../components/data';");
  });
});