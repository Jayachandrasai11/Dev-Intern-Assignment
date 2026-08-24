import type { ComposerDoc, ComposerScreen } from '../../../composer/schema';
import { createDoc, VIEWPORT_SIZES } from '../../../composer/schema';

/** First-run demo document: three canonical atlasmotors.com pages (desktop). */

let n = 0;
const mk = (type: string, props: Record<string, unknown>) => ({
  type,
  props: { id: `seed-${type}-${n++}`, ...props },
});

function screen(
  name: string,
  index: number,
  content: unknown[],
  rootProps: Record<string, unknown> = {},
): ComposerScreen {
  return {
    id: `seed-screen-${index}`,
    name,
    x: 80 + index * (VIEWPORT_SIZES.desktop.width + 120),
    y: 80,
    viewport: 'desktop',
    puckData: { content: content as never, root: { props: rootProps } },
  };
}

export function seedDoc(): ComposerDoc {
  n = 0;
  const doc = createDoc('atlas-web');
  doc.screens = [
    screen(
      'Home',
      0,
      [
        mk('SiteHeader', {
          links: 'Scooters, Charging, Ownership, About',
          activeIndex: 0,
          ctaLabel: 'Book test ride',
          phone: '1800 103 5005',
          variant: 'solid',
        }),
        mk('MastheadBanner', {
          eyebrow: 'The new Atlas V2 Pro',
          title: 'Ride the future',
          subtitle: '165 km certified range · removable batteries · 90 km/h',
          ctaLabel: 'Book test ride',
          linkLabel: 'Explore specs',
          media: 'image',
          align: 'left',
          inverse: true,
          headingSize: '3xl',
        }),
        mk('Group', {
          direction: 'horizontal',
          wrap: true,
          gapV: 4,
          gapH: 4,
          padding: 5,
          align: 'stretch',
          justify: 'center',
          items: [
            mk('AdvantageCard', {
              icon: 'battery',
              title: 'Removable batteries',
              body: 'Charge anywhere — both batteries pop out and plug into any household socket.',
            }),
            mk('AdvantageCard', {
              icon: 'gauge',
              title: '90 km/h top speed',
              body: 'City-quick acceleration with three ride modes and a boost throttle.',
            }),
            mk('AdvantageCard', {
              icon: 'map-pin',
              title: 'Charging everywhere',
              body: 'Access 3,500+ fast-charging points across 120 cities.',
            }),
          ],
        }),
        mk('CardGrid', {
          columns: 4,
          items: [
            mk('ModelCard', { model: 0, ctaLabel: 'Book test ride', linkLabel: 'Explore' }),
            mk('ModelCard', { model: 1, ctaLabel: 'Book test ride', linkLabel: 'Explore' }),
            mk('ModelCard', { model: 2, ctaLabel: 'Book test ride', linkLabel: 'Explore' }),
            mk('ModelCard', { model: 3, ctaLabel: 'Book test ride', linkLabel: 'Explore' }),
          ],
        }),
        mk('Group', {
          direction: 'horizontal',
          wrap: true,
          gapV: 4,
          gapH: 4,
          padding: 5,
          align: 'stretch',
          justify: 'center',
          items: [
            mk('AwardCard', { award: 0 }),
            mk('AwardCard', { award: 1 }),
            mk('AwardCard', { award: 2 }),
          ],
        }),
        mk('SiteFooter', {
          tagline: 'Electric that excites.',
          copyright: '© 2026 Atlas World. All rights reserved.',
        }),
      ],
      { sidePadding: 0, blockGap: 0 },
    ),
    screen(
      'Product — V2 Pro',
      1,
      [
        mk('SiteHeader', {
          links: 'Scooters, Charging, Ownership, About',
          activeIndex: 0,
          ctaLabel: 'Book test ride',
          phone: '1800 103 5005',
          variant: 'solid',
        }),
        mk('Breadcrumb', { path: 'Home, Scooters, V2 Pro' }),
        mk('MastheadBanner', {
          eyebrow: 'Flagship',
          title: 'Atlas V2 Pro',
          subtitle: 'The farthest-riding Atlas yet — 165 km on a single charge.',
          ctaLabel: 'Book test ride',
          linkLabel: 'Download brochure',
          media: 'video',
          align: 'center',
          inverse: true,
          headingSize: '2xl',
        }),
        mk('Group', {
          direction: 'horizontal',
          wrap: true,
          gapV: 4,
          gapH: 4,
          padding: 5,
          align: 'stretch',
          justify: 'center',
          items: [
            mk('SpecCard', { icon: 'gauge', value: '165', unit: 'km', label: 'Certified range' }),
            mk('SpecCard', { icon: 'bolt', value: '90', unit: 'km/h', label: 'Top speed' }),
            mk('SpecCard', { icon: 'battery', value: '3.94', unit: 'kWh', label: 'Battery' }),
          ],
        }),
        mk('SpecCompareTable', { modelCount: 4, highlight: 0 }),
        mk('Group', {
          direction: 'vertical',
          wrap: false,
          gapV: 2,
          gapH: 0,
          padding: 5,
          align: 'stretch',
          justify: 'start',
          items: [
            mk('PriceTag', {
              price: '₹1,35,000',
              comparePrice: '₹1,45,000',
              emiHint: 'EMI from ₹2,999/month',
              size: 'l',
            }),
            mk('EmiRow', { label: 'Down payment', value: '₹15,000', highlight: false }),
            mk('EmiRow', { label: 'Monthly EMI · 36 months', value: '₹2,999', highlight: true }),
          ],
        }),
        mk('Group', {
          direction: 'vertical',
          wrap: false,
          gapV: 2,
          gapH: 0,
          padding: 5,
          align: 'stretch',
          justify: 'start',
          items: [
            mk('AccordionItem', {
              question: 'What is the real-world range of the V2 Pro?',
              answer:
                'The V2 Pro delivers an IDC-certified 165 km; in mixed city riding expect roughly 120–130 km.',
              defaultOpen: true,
            }),
            mk('AccordionItem', {
              question: 'Can I charge at home?',
              answer:
                'Yes — the removable batteries charge from any 5A household socket in under 6 hours.',
              defaultOpen: false,
            }),
          ],
        }),
        mk('CtaSection', {
          tone: 'brand',
          title: 'Ready to ride electric?',
          body: 'Book a test ride and feel the Atlas difference in 15 minutes.',
          primaryLabel: 'Book test ride',
          secondaryLabel: 'Talk to us',
        }),
        mk('SiteFooter', {
          tagline: 'Electric that excites.',
          copyright: '© 2026 Atlas World. All rights reserved.',
        }),
      ],
      { sidePadding: 0, blockGap: 0 },
    ),
    screen(
      'Dealers',
      2,
      [
        mk('SiteHeader', {
          links: 'Scooters, Charging, Ownership, About',
          activeIndex: 3,
          ctaLabel: 'Book test ride',
          phone: '1800 103 5005',
          variant: 'solid',
        }),
        mk('Breadcrumb', { path: 'Home, Dealers' }),
        mk('NotificationBanner', {
          tone: 'info',
          message: 'New experience centre now open in Indiranagar, Bengaluru.',
          dismissible: true,
        }),
        mk('DealerLocatorSection', {
          title: 'Find your nearest Atlas hub',
          subtitle: 'Test rides, service, and fast charging across 120+ cities.',
        }),
        mk('CtaSection', {
          tone: 'ink',
          title: 'Can’t find a hub near you?',
          body: 'We deliver test rides to your doorstep in select cities.',
          primaryLabel: 'Request home test ride',
          secondaryLabel: '',
        }),
        mk('SiteFooter', {
          tagline: 'Electric that excites.',
          copyright: '© 2026 Atlas World. All rights reserved.',
        }),
      ],
      { sidePadding: 0, blockGap: 0 },
    ),
  ];
  return doc;
}
