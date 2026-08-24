import type { CodegenPack, JsxEmitter } from '../../../composer/codegen';
import {
  expr,
  flag,
  LAYOUT_EMITTERS,
  LAYOUT_PRIMITIVE_NAMES,
  num,
  str,
} from '../../../composer/codegen';

/**
 * Atlas Web's JSX codegen pack. Emitters mirror the atlas registry render
 * mappings (fixture indices → fixture imports, ''/false → omitted optionals);
 * layout-primitive emitters come from the shared engine.
 */

const IMPORT_SOURCES: Record<string, string[]> = {
  '../components/atoms': [
    'Button', 'Checkbox', 'Chip', 'Heading', 'Icon', 'Input', 'LinkCta',
    'Radio', 'Select', 'Text', 'Toggle',
  ],
  '../components/molecules': [
    'AccordionItem', 'AdvantageCard', 'AwardCard', 'Breadcrumb', 'DealerCard',
    'EmiRow', 'NavTabs', 'NotificationBanner', 'PriceTag', 'SpecCard',
  ],
  '../components/organisms': [
    'BannerCarousel', 'CardGrid', 'CtaSection', 'DealerLocatorSection',
    'MastheadBanner', 'ModelCard', 'SiteFooter', 'SiteHeader', 'SpecCompareTable',
  ],
  './primitives': [...LAYOUT_PRIMITIVE_NAMES].sort(),
};

const FIXTURES: Record<string, string> = {
  SAMPLE_MODELS: '../components/data',
  SAMPLE_DEALERS: '../components/data',
  SAMPLE_AWARDS: '../components/data',
  SAMPLE_SPECS: '../components/data',
};

const labelsExpr = (raw: string) =>
  JSON.stringify(
    String(raw ?? '')
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean),
  );

const ATLAS_EMITTERS: Record<string, JsxEmitter> = {
  // ---------- atoms ----------
  Button: (p) => ({
    name: 'Button',
    attrs: [
      str('variant', p.variant),
      str('size', p.size),
      ...flag('disabled', p.disabled),
    ],
    children: [String(p.label ?? '')],
  }),
  LinkCta: (p) => ({
    name: 'LinkCta',
    attrs: [
      str('tone', p.tone),
      str('size', p.size),
      ...(p.arrow ? [] : [expr('arrow', 'false')]),
    ],
    children: [String(p.label ?? '')],
  }),
  Icon: (p) => ({
    name: 'Icon',
    attrs: [str('name', p.name), num('size', p.size)],
    children: [],
  }),
  Chip: (p) => ({
    name: 'Chip',
    attrs: [str('tone', p.tone), ...flag('outline', p.outline)],
    children: [String(p.label ?? '')],
  }),
  Input: (p) => ({
    name: 'Input',
    attrs: [
      str('label', p.label),
      str('placeholder', p.placeholder),
      ...(p.error ? [str('error', p.error)] : []),
      ...flag('disabled', p.disabled),
    ],
    children: [],
  }),
  Select: (p) => ({
    name: 'Select',
    attrs: [
      str('label', p.label),
      expr(
        'options',
        `${labelsExpr(p.labels)}.map((l) => ({ value: l, label: l }))`,
      ),
    ],
    children: [],
  }),
  Checkbox: (p) => ({
    name: 'Checkbox',
    attrs: [
      str('label', p.label),
      ...flag('defaultChecked', p.checked),
      ...flag('disabled', p.disabled),
    ],
    children: [],
  }),
  Radio: (p) => ({
    name: 'Radio',
    attrs: [
      str('label', p.label),
      ...flag('defaultChecked', p.checked),
      ...flag('disabled', p.disabled),
    ],
    children: [],
  }),
  Toggle: (p) => ({
    name: 'Toggle',
    attrs: [...flag('defaultChecked', p.checked), ...flag('disabled', p.disabled)],
    children: [],
  }),
  Heading: (p) => ({
    name: 'Heading',
    attrs: [
      str('size', p.size),
      num('level', p.level),
      ...flag('inverse', p.inverse),
    ],
    children: [String(p.text ?? '')],
  }),
  Text: (p) => ({
    name: 'Text',
    attrs: [
      str('size', p.size),
      str('weight', p.weight),
      ...flag('muted', p.muted),
    ],
    children: [String(p.text ?? '')],
  }),

  // ---------- molecules ----------
  SpecCard: (p) => ({
    name: 'SpecCard',
    attrs: [
      str('icon', p.icon),
      str('value', p.value),
      ...(p.unit ? [str('unit', p.unit)] : []),
      str('label', p.label),
    ],
    children: [],
  }),
  AdvantageCard: (p) => ({
    name: 'AdvantageCard',
    attrs: [str('icon', p.icon), str('title', p.title)],
    children: [String(p.body ?? '')],
  }),
  AccordionItem: (p) => ({
    name: 'AccordionItem',
    attrs: [
      str('question', p.question),
      str('answer', p.answer),
      ...flag('defaultOpen', p.defaultOpen),
    ],
    children: [],
  }),
  NavTabs: (p) => ({
    name: 'NavTabs',
    attrs: [
      expr('items', `${labelsExpr(p.labels)}.map((l) => ({ id: l, label: l }))`),
      expr('activeId', `${labelsExpr(p.labels)}[${Number(p.activeIndex) || 0}]`),
    ],
    children: [],
  }),
  DealerCard: (p, ctx) => {
    ctx.fixtures.add('SAMPLE_DEALERS');
    // Attrs are raw strings — a spread expression is a valid JSX attribute.
    return {
      name: 'DealerCard',
      attrs: [`{...SAMPLE_DEALERS[${Number(p.dealer) || 0}]}`],
      children: [],
    };
  },
  Breadcrumb: (p) => ({
    name: 'Breadcrumb',
    attrs: [
      expr('items', `${labelsExpr(p.path)}.map((label) => ({ label }))`),
    ],
    children: [],
  }),
  NotificationBanner: (p) => ({
    name: 'NotificationBanner',
    attrs: [
      str('tone', p.tone),
      ...(p.dismissible ? [expr('onDismiss', '() => {}')] : []),
    ],
    children: [String(p.message ?? '')],
  }),
  AwardCard: (p, ctx) => {
    ctx.fixtures.add('SAMPLE_AWARDS');
    const i = Number(p.award) || 0;
    return {
      name: 'AwardCard',
      attrs: [
        expr('title', `SAMPLE_AWARDS[${i}].title`),
        expr('outlet', `SAMPLE_AWARDS[${i}].outlet`),
        expr('year', `SAMPLE_AWARDS[${i}].year`),
      ],
      children: [],
    };
  },
  PriceTag: (p) => ({
    name: 'PriceTag',
    attrs: [
      str('price', p.price),
      ...(p.comparePrice ? [str('comparePrice', p.comparePrice)] : []),
      ...(p.emiHint ? [str('emiHint', p.emiHint)] : []),
      str('size', p.size),
    ],
    children: [],
  }),
  EmiRow: (p) => ({
    name: 'EmiRow',
    attrs: [
      str('label', p.label),
      str('value', p.value),
      ...flag('highlight', p.highlight),
    ],
    children: [],
  }),

  // ---------- organisms ----------
  SiteHeader: (p) => ({
    name: 'SiteHeader',
    attrs: [
      expr(
        'navLinks',
        `${labelsExpr(p.links)}.map((label, i) => ({ label, active: i === ${Number(p.activeIndex) || 0} }))`,
      ),
      str('ctaLabel', p.ctaLabel),
      str('phone', p.phone),
      str('variant', p.variant),
    ],
    children: [],
  }),
  MastheadBanner: (p) => ({
    name: 'MastheadBanner',
    attrs: [
      ...(p.eyebrow ? [str('eyebrow', p.eyebrow)] : []),
      str('title', p.title),
      ...(p.subtitle ? [str('subtitle', p.subtitle)] : []),
      ...(p.ctaLabel ? [str('ctaLabel', p.ctaLabel)] : []),
      ...(p.linkLabel ? [str('linkLabel', p.linkLabel)] : []),
      str('media', p.media),
      str('align', p.align),
      ...flag('inverse', p.inverse),
      str('headingSize', p.headingSize),
    ],
    children: [],
  }),
  BannerCarousel: (p, _ctx, kids) => ({
    name: 'BannerCarousel',
    attrs: [...(p.label ? [str('label', p.label)] : [])],
    children: kids,
  }),
  SpecCompareTable: (p, ctx) => {
    ctx.fixtures.add('SAMPLE_MODELS');
    ctx.fixtures.add('SAMPLE_SPECS');
    const count = Number(p.modelCount) || 4;
    const highlight = Number(p.highlight);
    return {
      name: 'SpecCompareTable',
      attrs: [
        expr('models', `SAMPLE_MODELS.slice(0, ${count})`),
        expr(
          'rows',
          `SAMPLE_SPECS.map((r) => ({ label: r.label, values: r.values.slice(0, ${count}) }))`,
        ),
        ...(highlight >= 0
          ? [expr('highlightId', `SAMPLE_MODELS[${highlight}].id`)]
          : []),
      ],
      children: [],
    };
  },
  CardGrid: (p, _ctx, kids) => ({
    name: 'CardGrid',
    attrs: [num('columns', p.columns)],
    children: kids,
  }),
  ModelCard: (p, ctx) => {
    ctx.fixtures.add('SAMPLE_MODELS');
    return {
      name: 'ModelCard',
      attrs: [
        expr('model', `SAMPLE_MODELS[${Number(p.model) || 0}]`),
        str('ctaLabel', p.ctaLabel),
        str('linkLabel', p.linkLabel),
      ],
      children: [],
    };
  },
  DealerLocatorSection: (p, ctx) => {
    ctx.fixtures.add('SAMPLE_DEALERS');
    return {
      name: 'DealerLocatorSection',
      attrs: [
        str('title', p.title),
        str('subtitle', p.subtitle),
        expr('dealers', 'SAMPLE_DEALERS'),
      ],
      children: [],
    };
  },
  CtaSection: (p) => ({
    name: 'CtaSection',
    attrs: [
      str('tone', p.tone),
      str('title', p.title),
      ...(p.body ? [str('body', p.body)] : []),
      str('primaryLabel', p.primaryLabel),
      ...(p.secondaryLabel ? [str('secondaryLabel', p.secondaryLabel)] : []),
    ],
    children: [],
  }),
  SiteFooter: (p) => ({
    name: 'SiteFooter',
    attrs: [
      str('tagline', p.tagline),
      expr('columns', '[]'),
      str('copyright', p.copyright),
    ],
    children: [],
  }),
};

export const ATLAS_WEB_CODEGEN: CodegenPack = {
  emitters: { ...LAYOUT_EMITTERS, ...ATLAS_EMITTERS },
  importSources: IMPORT_SOURCES,
  fixtures: FIXTURES,
};
