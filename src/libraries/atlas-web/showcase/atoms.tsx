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
import type { ChipTone } from '../components/atoms';
import type { SectionDef } from '../../../playground/Section';
import { VariantMatrix } from '../../../playground/VariantMatrix';

const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive'] as const;
const CHIP_TONES: ChipTone[] = ['neutral', 'brand', 'success', 'warning', 'error', 'info'];

export const ATLAS_ATOM_SECTIONS: SectionDef[] = [
  {
    id: 'button',
    title: 'Button',
    description: 'variant × size/state — CTAs run on the Atlas orange ramp.',
    render: () => (
      <VariantMatrix
        cols={['s', 'm', 'l', 'disabled']}
        rows={BUTTON_VARIANTS.map((v) => ({
          label: v,
          cells: [
            <Button variant={v} size="s">Book test ride</Button>,
            <Button variant={v} size="m">Book test ride</Button>,
            <Button variant={v} size="l">Book test ride</Button>,
            <Button variant={v} disabled>Book test ride</Button>,
          ],
        }))}
      />
    ),
  },
  {
    id: 'link-cta',
    title: 'LinkCta',
    description: 'Text CTAs from the link-*-cta type roles.',
    render: () => (
      <VariantMatrix
        cols={['s', 'm', 'l']}
        rows={[
          {
            label: 'brand',
            cells: (['s', 'm', 'l'] as const).map((s) => (
              <LinkCta tone="brand" size={s} href="#">
                Explore V2 Pro
              </LinkCta>
            )),
          },
          {
            label: 'ink',
            cells: (['s', 'm', 'l'] as const).map((s) => (
              <LinkCta tone="ink" size={s} href="#">
                Compare models
              </LinkCta>
            )),
          },
        ]}
      />
    ),
  },
  {
    id: 'icon',
    title: 'Icon',
    description: 'Curated website icon set — stroke, currentColor.',
    render: () => (
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {ATLAS_ICON_NAMES.map((n) => (
          <span key={n} title={n} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <Icon name={n} size={22} />
            <Text size="xs" muted as="span">{n}</Text>
          </span>
        ))}
      </div>
    ),
  },
  {
    id: 'chip',
    title: 'Chip',
    description: 'Price tags, availability badges, eyebrows — status tones from the semantic slots.',
    render: () => (
      <VariantMatrix
        cols={['tinted', 'outline']}
        rows={CHIP_TONES.map((tone) => ({
          label: tone,
          cells: [
            <Chip tone={tone}>From ₹96,000</Chip>,
            <Chip tone={tone} outline>In stock</Chip>,
          ],
        }))}
      />
    ),
  },
  {
    id: 'fields',
    title: 'Input · Select',
    description: 'Booking + dealer-locator form fields.',
    render: () => (
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <Input label="Full name" placeholder="Aarav Sharma" />
        <Input label="Phone" placeholder="+91" error="Enter a 10-digit number" />
        <Input label="Pincode" placeholder="560038" disabled />
        <Select
          label="Preferred model"
          options={[
            { value: 'v2-pro', label: 'Atlas V2 Pro' },
            { value: 'v2-plus', label: 'Atlas V2 Plus' },
            { value: 'v2-lite', label: 'Atlas V2 Lite' },
            { value: 'vx2', label: 'Atlas VX2' },
          ]}
        />
      </div>
    ),
  },
  {
    id: 'selection',
    title: 'Checkbox · Radio · Toggle',
    description: 'Consent rows, plan pickers, comparison switches.',
    render: () => (
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <Checkbox label="Notify me about offers" defaultChecked />
        <Checkbox label="Share ride analytics" />
        <Radio name="plan" label="Buy outright" defaultChecked />
        <Radio name="plan" label="EMI plan" />
        <Toggle defaultChecked aria-label="Compare mode" />
        <Toggle aria-label="Compare mode off" />
      </div>
    ),
  },
  {
    id: 'type',
    title: 'Heading · Text',
    description: 'The Geist ramp — headings are semibold with tight tracking.',
    render: () => (
      <div style={{ display: 'grid', gap: 12 }}>
        <Heading size="2xl" level={1}>Ride the future</Heading>
        <Heading size="l">Engineered for every day</Heading>
        <Heading size="s">Removable batteries</Heading>
        <Text size="l">
          The Atlas V2 Pro pairs a 3.94 kWh removable battery with a 90 km/h top
          speed — and charges from any household socket.
        </Text>
        <Text size="m" muted>
          IDC-certified figures. Real-world range varies with riding mode.
        </Text>
        <Text size="s" weight="semibold">From ₹1,35,000 ex-showroom</Text>
      </div>
    ),
  },
];
