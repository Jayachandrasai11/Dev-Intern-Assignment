import type { ComponentConfig, Config } from '@puckeditor/core';
import {
  Button,
  Checkbox,
  Chip,
  Heading,
  Icon,
  Input,
  LinkCta,
  Radio,
  Select,
  Text,
  Toggle,
  ATLAS_ICON_NAMES,
} from '../components/atoms';
import {
  AccordionItem,
  AdvantageCard,
  AwardCard,
  Breadcrumb,
  DealerCard,
  EmiRow,
  NavTabs,
  NotificationBanner,
  PriceTag,
  SpecCard,
} from '../components/molecules';
import {
  BannerCarousel,
  CardGrid,
  CtaSection,
  DealerLocatorSection,
  MastheadBanner,
  ModelCard,
  SiteFooter,
  SiteHeader,
  SpecCompareTable,
} from '../components/organisms';
import {
  SAMPLE_AWARDS,
  SAMPLE_DEALERS,
  SAMPLE_MODELS,
  SAMPLE_SPECS,
} from '../components/data';
import {
  boolField,
  makeComposerConfig,
  makeLayoutComponents,
  makeSpaceOptions,
  opts,
} from '../../../composer/registryKit';
import { ATLAS_GLOBAL_TOKENS } from '../tokens/global';

/** The Atlas Web Puck adapter — website blocks over the atlas space scale. */

const space = makeSpaceOptions(ATLAS_GLOBAL_TOKENS);

const iconField = {
  type: 'select' as const,
  options: opts(ATLAS_ICON_NAMES as readonly string[]),
};
const modelField = {
  type: 'select' as const,
  label: 'Model (fixture)',
  options: SAMPLE_MODELS.map((m, i) => ({ value: i, label: m.name })),
};
const dealerField = {
  type: 'select' as const,
  label: 'Dealer (fixture)',
  options: SAMPLE_DEALERS.map((d, i) => ({ value: i, label: d.name })),
};

const splitLabels = (raw: string) =>
  String(raw ?? '')
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean);

const FOOTER_COLUMNS = [
  {
    title: 'Scooters',
    links: [
      { label: 'V2 Pro' },
      { label: 'V2 Plus' },
      { label: 'V2 Lite' },
      { label: 'VX2' },
    ],
  },
  {
    title: 'Ownership',
    links: [
      { label: 'Charging' },
      { label: 'Service' },
      { label: 'Warranty' },
      { label: 'EMI plans' },
    ],
  },
  {
    title: 'Company',
    links: [{ label: 'About' }, { label: 'News' }, { label: 'Careers' }],
  },
];
const FOOTER_SOCIALS = [
  { label: 'Instagram' },
  { label: 'YouTube' },
  { label: 'X' },
];
const FOOTER_LEGAL = [{ label: 'Privacy' }, { label: 'Terms' }];

const CATEGORIES: Config['categories'] = {
  layout: {
    title: 'Layout',
    components: ['Group', 'Stack', 'Row', 'Spacer'],
  },
  atoms: {
    title: 'Atoms',
    components: [
      'Button',
      'LinkCta',
      'Icon',
      'Chip',
      'Input',
      'Select',
      'Checkbox',
      'Radio',
      'Toggle',
      'Heading',
      'Text',
    ],
  },
  molecules: {
    title: 'Molecules',
    components: [
      'SpecCard',
      'AdvantageCard',
      'AccordionItem',
      'NavTabs',
      'DealerCard',
      'Breadcrumb',
      'NotificationBanner',
      'AwardCard',
      'PriceTag',
      'EmiRow',
    ],
  },
  organisms: {
    title: 'Organisms',
    components: [
      'SiteHeader',
      'MastheadBanner',
      'BannerCarousel',
      'SpecCompareTable',
      'CardGrid',
      'ModelCard',
      'DealerLocatorSection',
      'CtaSection',
      'SiteFooter',
    ],
  },
};

const rawComponents: Record<string, ComponentConfig<any>> = {
  // ---------- layout primitives (generic, from the registry kit) ----------
  ...makeLayoutComponents(space),

  // ---------- atoms ----------
  Button: {
    fields: {
      label: { type: 'text' },
      variant: {
        type: 'select',
        options: opts(['primary', 'secondary', 'tertiary', 'destructive'] as const),
      },
      size: { type: 'select', options: opts(['s', 'm', 'l'] as const) },
      disabled: boolField(),
    },
    defaultProps: {
      label: 'Book test ride',
      variant: 'primary',
      size: 'm',
      disabled: false,
    },
    render: ({ label, variant, size, disabled }) => (
      <Button variant={variant} size={size} disabled={disabled}>
        {label}
      </Button>
    ),
  },
  LinkCta: {
    fields: {
      label: { type: 'text' },
      tone: { type: 'select', options: opts(['brand', 'ink', 'inverse'] as const) },
      size: { type: 'select', options: opts(['s', 'm', 'l'] as const) },
      arrow: boolField('Arrow'),
    },
    defaultProps: { label: 'Explore V2 Pro', tone: 'brand', size: 'm', arrow: true },
    render: ({ label, tone, size, arrow }) => (
      <LinkCta tone={tone} size={size} arrow={arrow}>
        {label}
      </LinkCta>
    ),
  },
  Icon: {
    fields: {
      name: iconField,
      size: { type: 'number', min: 12, max: 64 },
    },
    defaultProps: { name: 'bolt', size: 24 },
    render: ({ name, size }) => <Icon name={name} size={size} />,
  },
  Chip: {
    fields: {
      label: { type: 'text' },
      tone: {
        type: 'select',
        options: opts(['neutral', 'brand', 'success', 'warning', 'error', 'info'] as const),
      },
      outline: boolField('Outline'),
    },
    defaultProps: { label: 'From ₹96,000', tone: 'brand', outline: false },
    render: ({ label, tone, outline }) => (
      <Chip tone={tone} outline={outline}>
        {label}
      </Chip>
    ),
  },
  Input: {
    fields: {
      label: { type: 'text' },
      placeholder: { type: 'text' },
      error: { type: 'text', label: 'Error (empty = none)' },
      disabled: boolField(),
    },
    defaultProps: { label: 'Full name', placeholder: 'Aarav Sharma', error: '', disabled: false },
    render: ({ label, placeholder, error, disabled }) => (
      <Input
        label={label}
        placeholder={placeholder}
        error={error || undefined}
        disabled={disabled}
      />
    ),
  },
  Select: {
    fields: {
      label: { type: 'text' },
      labels: { type: 'text', label: 'Options (comma-separated)' },
    },
    defaultProps: {
      label: 'Preferred model',
      labels: 'Atlas V2 Pro, Atlas V2 Plus, Atlas V2 Lite, Atlas VX2',
    },
    render: ({ label, labels }) => (
      <Select
        label={label}
        options={splitLabels(labels).map((l) => ({ value: l, label: l }))}
      />
    ),
  },
  Checkbox: {
    fields: {
      label: { type: 'text' },
      checked: boolField('Checked'),
      disabled: boolField(),
    },
    defaultProps: { label: 'Notify me about offers', checked: true, disabled: false },
    render: ({ label, checked, disabled }) => (
      <Checkbox label={label} defaultChecked={checked} disabled={disabled} />
    ),
  },
  Radio: {
    fields: {
      label: { type: 'text' },
      checked: boolField('Checked'),
      disabled: boolField(),
    },
    defaultProps: { label: 'EMI plan', checked: false, disabled: false },
    render: ({ label, checked, disabled }) => (
      <Radio label={label} defaultChecked={checked} disabled={disabled} />
    ),
  },
  Toggle: {
    fields: {
      checked: boolField('On'),
      disabled: boolField(),
    },
    defaultProps: { checked: true, disabled: false },
    render: ({ checked, disabled }) => (
      <Toggle defaultChecked={checked} disabled={disabled} aria-label="toggle" />
    ),
  },
  Heading: {
    fields: {
      text: { type: 'text' },
      size: {
        type: 'select',
        options: opts(['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'] as const),
      },
      level: { type: 'select', options: opts([1, 2, 3, 4] as const) },
      inverse: boolField('Inverse'),
    },
    defaultProps: { text: 'Ride the future', size: 'l', level: 2, inverse: false },
    render: ({ text, size, level, inverse }) => (
      <Heading size={size} level={level} inverse={inverse}>
        {text}
      </Heading>
    ),
  },
  Text: {
    fields: {
      text: { type: 'textarea' },
      size: { type: 'select', options: opts(['xs', 's', 'm', 'l', 'xl'] as const) },
      weight: {
        type: 'select',
        options: opts(['regular', 'medium', 'semibold'] as const),
      },
      muted: boolField('Muted'),
    },
    defaultProps: {
      text: 'The Atlas V2 Pro pairs a 3.94 kWh removable battery with a 90 km/h top speed.',
      size: 'm',
      weight: 'regular',
      muted: false,
    },
    render: ({ text, size, weight, muted }) => (
      <Text size={size} weight={weight} muted={muted}>
        {text}
      </Text>
    ),
  },

  // ---------- molecules ----------
  SpecCard: {
    fields: {
      icon: iconField,
      value: { type: 'text' },
      unit: { type: 'text' },
      label: { type: 'text' },
    },
    defaultProps: { icon: 'gauge', value: '165', unit: 'km', label: 'Certified range' },
    render: ({ icon, value, unit, label }) => (
      <SpecCard icon={icon} value={value} unit={unit} label={label} />
    ),
  },
  AdvantageCard: {
    fields: {
      icon: iconField,
      title: { type: 'text' },
      body: { type: 'textarea' },
    },
    defaultProps: {
      icon: 'battery',
      title: 'Removable batteries',
      body: 'Charge anywhere — both batteries pop out and plug into any household socket.',
    },
    render: ({ icon, title, body }) => (
      <AdvantageCard icon={icon} title={title}>
        {body}
      </AdvantageCard>
    ),
  },
  AccordionItem: {
    fields: {
      question: { type: 'text' },
      answer: { type: 'textarea' },
      defaultOpen: boolField('Open'),
    },
    defaultProps: {
      question: 'What is the real-world range of the V2 Pro?',
      answer:
        'The V2 Pro delivers an IDC-certified 165 km; in mixed city riding expect roughly 120–130 km.',
      defaultOpen: false,
    },
    render: ({ question, answer, defaultOpen }) => (
      <AccordionItem question={question} answer={answer} defaultOpen={defaultOpen} />
    ),
  },
  NavTabs: {
    fields: {
      labels: { type: 'text', label: 'Tabs (comma-separated)' },
      activeIndex: { type: 'number', min: 0, max: 8 },
    },
    defaultProps: { labels: 'Overview, Specs, Price, Reviews', activeIndex: 0 },
    render: ({ labels, activeIndex }) => {
      const items = splitLabels(labels).map((label) => ({ id: label, label }));
      return <NavTabs items={items} activeId={items[activeIndex]?.id ?? items[0]?.id ?? ''} />;
    },
  },
  DealerCard: {
    fields: { dealer: dealerField },
    defaultProps: { dealer: 0 },
    render: ({ dealer }) => {
      const d = SAMPLE_DEALERS[dealer] ?? SAMPLE_DEALERS[0];
      return (
        <DealerCard
          name={d.name}
          address={d.address}
          city={d.city}
          distanceKm={d.distanceKm}
          open={d.open}
          phone={d.phone}
        />
      );
    },
  },
  Breadcrumb: {
    fields: {
      path: { type: 'text', label: 'Trail (comma-separated)' },
    },
    defaultProps: { path: 'Home, Scooters, V2 Pro' },
    render: ({ path }) => (
      <Breadcrumb items={splitLabels(path).map((label) => ({ label }))} />
    ),
  },
  NotificationBanner: {
    fields: {
      tone: {
        type: 'select',
        options: opts(['info', 'success', 'warning', 'error'] as const),
      },
      message: { type: 'text' },
      dismissible: boolField('Dismissible'),
    },
    defaultProps: {
      tone: 'info',
      message: 'Introductory prices end June 30 — book a test ride today.',
      dismissible: true,
    },
    render: ({ tone, message, dismissible }) => (
      <NotificationBanner tone={tone} onDismiss={dismissible ? () => {} : undefined}>
        {message}
      </NotificationBanner>
    ),
  },
  AwardCard: {
    fields: {
      award: {
        type: 'select',
        label: 'Award (fixture)',
        options: SAMPLE_AWARDS.map((a, i) => ({ value: i, label: a.title })),
      },
    },
    defaultProps: { award: 0 },
    render: ({ award }) => {
      const a = SAMPLE_AWARDS[award] ?? SAMPLE_AWARDS[0];
      return <AwardCard title={a.title} outlet={a.outlet} year={a.year} />;
    },
  },
  PriceTag: {
    fields: {
      price: { type: 'text' },
      comparePrice: { type: 'text', label: 'Compare price (empty = none)' },
      emiHint: { type: 'text', label: 'EMI hint (empty = none)' },
      size: { type: 'select', options: opts(['m', 'l'] as const) },
    },
    defaultProps: {
      price: '₹1,35,000',
      comparePrice: '₹1,45,000',
      emiHint: 'EMI from ₹2,999/month',
      size: 'l',
    },
    render: ({ price, comparePrice, emiHint, size }) => (
      <PriceTag
        price={price}
        comparePrice={comparePrice || undefined}
        emiHint={emiHint || undefined}
        size={size}
      />
    ),
  },
  EmiRow: {
    fields: {
      label: { type: 'text' },
      value: { type: 'text' },
      highlight: boolField('Highlight'),
    },
    defaultProps: { label: 'Monthly EMI', value: '₹2,999', highlight: true },
    render: ({ label, value, highlight }) => (
      <EmiRow label={label} value={value} highlight={highlight} />
    ),
  },

  // ---------- organisms ----------
  SiteHeader: {
    fields: {
      links: { type: 'text', label: 'Nav links (comma-separated)' },
      activeIndex: { type: 'number', min: 0, max: 8 },
      ctaLabel: { type: 'text' },
      phone: { type: 'text' },
      variant: { type: 'select', options: opts(['solid', 'transparent'] as const) },
    },
    defaultProps: {
      links: 'Scooters, Charging, Ownership, About',
      activeIndex: 0,
      ctaLabel: 'Book test ride',
      phone: '1800 103 5005',
      variant: 'solid',
    },
    render: ({ links, activeIndex, ctaLabel, phone, variant }) => (
      <SiteHeader
        navLinks={splitLabels(links).map((label, i) => ({
          label,
          active: i === activeIndex,
        }))}
        ctaLabel={ctaLabel}
        phone={phone}
        variant={variant}
      />
    ),
  },
  MastheadBanner: {
    fields: {
      eyebrow: { type: 'text' },
      title: { type: 'text' },
      subtitle: { type: 'textarea' },
      ctaLabel: { type: 'text' },
      linkLabel: { type: 'text' },
      media: { type: 'select', options: opts(['image', 'video', 'plain'] as const) },
      align: { type: 'radio', options: opts(['left', 'center'] as const) },
      inverse: boolField('Inverse'),
      headingSize: { type: 'select', options: opts(['2xl', '3xl', '4xl'] as const) },
    },
    defaultProps: {
      eyebrow: 'The new Atlas V2 Pro',
      title: 'Ride the future',
      subtitle: '165 km certified range · removable batteries · 90 km/h',
      ctaLabel: 'Book test ride',
      linkLabel: 'Explore specs',
      media: 'image',
      align: 'left',
      inverse: true,
      headingSize: '3xl',
    },
    render: ({ eyebrow, title, subtitle, ctaLabel, linkLabel, media, align, inverse, headingSize }) => (
      <MastheadBanner
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        ctaLabel={ctaLabel}
        linkLabel={linkLabel}
        media={media}
        align={align}
        inverse={inverse}
        headingSize={headingSize}
      />
    ),
  },
  BannerCarousel: {
    fields: {
      label: { type: 'text' },
      items: { type: 'slot' },
    },
    defaultProps: { label: 'Highlights', items: [] },
    render: ({ label, items: Items }) => (
      <BannerCarousel label={label}>
        <Items />
      </BannerCarousel>
    ),
  },
  SpecCompareTable: {
    fields: {
      modelCount: { type: 'number', min: 2, max: 4 },
      highlight: {
        type: 'select',
        label: 'Highlight column',
        options: [
          { value: -1, label: 'None' },
          ...SAMPLE_MODELS.map((m, i) => ({ value: i, label: m.name })),
        ],
      },
    },
    defaultProps: { modelCount: 4, highlight: 0 },
    render: ({ modelCount, highlight }) => {
      const models = SAMPLE_MODELS.slice(0, modelCount).map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        tag: m.tag,
      }));
      const rows = SAMPLE_SPECS.map((r) => ({
        label: r.label,
        values: r.values.slice(0, modelCount),
      }));
      return (
        <SpecCompareTable
          models={models}
          rows={rows}
          highlightId={highlight >= 0 ? SAMPLE_MODELS[highlight]?.id : undefined}
        />
      );
    },
  },
  CardGrid: {
    fields: {
      columns: { type: 'select', options: opts([2, 3, 4] as const) },
      items: { type: 'slot' },
    },
    defaultProps: { columns: 3, items: [] },
    render: ({ columns, items: Items }) => (
      <CardGrid columns={columns}>
        <Items />
      </CardGrid>
    ),
  },
  ModelCard: {
    fields: {
      model: modelField,
      ctaLabel: { type: 'text' },
      linkLabel: { type: 'text' },
    },
    defaultProps: { model: 0, ctaLabel: 'Book test ride', linkLabel: 'Explore' },
    render: ({ model, ctaLabel, linkLabel }) => {
      const m = SAMPLE_MODELS[model] ?? SAMPLE_MODELS[0];
      return <ModelCard model={m} ctaLabel={ctaLabel} linkLabel={linkLabel} />;
    },
  },
  DealerLocatorSection: {
    fields: {
      title: { type: 'text' },
      subtitle: { type: 'text' },
    },
    defaultProps: {
      title: 'Find your nearest Atlas hub',
      subtitle: 'Test rides, service, and fast charging across 120+ cities.',
    },
    render: ({ title, subtitle }) => (
      <DealerLocatorSection title={title} subtitle={subtitle} dealers={SAMPLE_DEALERS} />
    ),
  },
  CtaSection: {
    fields: {
      tone: { type: 'radio', options: opts(['brand', 'ink'] as const) },
      title: { type: 'text' },
      body: { type: 'textarea' },
      primaryLabel: { type: 'text' },
      secondaryLabel: { type: 'text' },
    },
    defaultProps: {
      tone: 'brand',
      title: 'Ready to ride electric?',
      body: 'Book a test ride and feel the Atlas difference in 15 minutes.',
      primaryLabel: 'Book test ride',
      secondaryLabel: 'Talk to us',
    },
    render: ({ tone, title, body, primaryLabel, secondaryLabel }) => (
      <CtaSection
        tone={tone}
        title={title}
        body={body}
        primaryLabel={primaryLabel}
        secondaryLabel={secondaryLabel}
      />
    ),
  },
  SiteFooter: {
    fields: {
      tagline: { type: 'text' },
      copyright: { type: 'text' },
    },
    defaultProps: {
      tagline: 'Electric that excites.',
      copyright: '© 2026 Atlas World. All rights reserved.',
    },
    render: ({ tagline, copyright }) => (
      <SiteFooter
        tagline={tagline}
        columns={FOOTER_COLUMNS}
        socials={FOOTER_SOCIALS}
        legalLinks={FOOTER_LEGAL}
        copyright={copyright}
      />
    ),
  },
};

export const composerConfig: Config = makeComposerConfig({
  categories: CATEGORIES,
  components: rawComponents,
  space,
});
