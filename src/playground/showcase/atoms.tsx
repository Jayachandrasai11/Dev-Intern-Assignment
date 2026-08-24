import {
  BatteryGlyph,
  CodeInput,
  Icon,
  ICON_NAMES,
  Button,
  ConnectorIcon,
  FreshnessIndicator,
  Input,
  PaymentStatusTag,
  PowerText,
  PriceText,
  Skeleton,
  Spinner,
  StatusBadge,
  Switch,
  Tag,
} from '../../components/atoms';
import type { ConnectorType } from '../../components/atoms';
import { ALL_STATUSES, STATUS_LABELS } from '../../components/status';
import type { SectionDef } from '../Section';
import { VariantMatrix } from '../VariantMatrix';

const BUTTON_VARIANTS = ['solid', 'soft', 'outline', 'ghost'] as const;
const CONNECTORS: ConnectorType[] = [
  'ccs1',
  'ccs2',
  'chademo',
  'type1',
  'type2',
  'nacs',
  'gbt',
];

export const ATOM_SECTIONS: SectionDef[] = [
  {
    id: 'button',
    title: 'Button',
    description: 'variant × size/state — all colors from the accent scale.',
    render: () => (
      <VariantMatrix
        cols={['sm', 'md', 'lg', 'disabled', 'loading']}
        rows={BUTTON_VARIANTS.map((v) => ({
          label: v,
          cells: [
            <Button variant={v} size="sm">Charge</Button>,
            <Button variant={v} size="md">Charge</Button>,
            <Button variant={v} size="lg">Charge</Button>,
            <Button variant={v} disabled>Charge</Button>,
            <Button variant={v} loading>Charge</Button>,
          ],
        }))}
      />
    ),
  },
  {
    id: 'status-badge',
    title: 'StatusBadge',
    description:
      'OCPP-aligned vocabulary. Status hues are pinned in the global layer — only “charging” follows the brand accent.',
    render: () => (
      <VariantMatrix
        cols={ALL_STATUSES.map((s) => STATUS_LABELS[s])}
        rows={[
          {
            label: 'dot',
            cells: ALL_STATUSES.map((s) => (
              <StatusBadge status={s} form="dot" />
            )),
          },
          {
            label: 'pill',
            cells: ALL_STATUSES.map((s) => <StatusBadge status={s} />),
          },
          {
            label: 'count',
            cells: ALL_STATUSES.map((s) => (
              <StatusBadge
                status={s}
                form="count"
                count={{ free: 4, total: 6 }}
              />
            )),
          },
        ]}
      />
    ),
  },
  {
    id: 'tag',
    title: 'Tag',
    render: () => (
      <div className="pg-row">
        <Tag>Restrooms</Tag>
        <Tag>Coffee</Tag>
        <Tag tone="accent">Plug &amp; Charge</Tag>
        <Tag tone="accent">Member price</Tag>
      </div>
    ),
  },
  {
    id: 'icon',
    title: 'Icon',
    description:
      'Curated Hugeicons Free set (MIT) — 47 EV-relevant glyphs, 24px base × --ev-scaling, currentColor via the color/text role. Names mirror the Figma icon/* components.',
    render: () => (
      <div className="pg-row" style={{ gap: 18 }}>
        {ICON_NAMES.map((n) => (
          <span key={n} title={n} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 72 }}>
            <Icon name={n} />
            <span style={{ fontSize: 10, color: 'var(--ev-color-text-secondary)', fontFamily: 'ui-monospace, monospace' }}>{n}</span>
          </span>
        ))}
      </div>
    ),
  },
  {
    id: 'connector-icon',
    title: 'ConnectorIcon',
    description: 'Stylized plug faces for every major connector standard.',
    render: () => (
      <VariantMatrix
        cols={CONNECTORS.map((c) => c.toUpperCase())}
        rows={[
          {
            label: 'default',
            cells: CONNECTORS.map((c) => <ConnectorIcon type={c} />),
          },
          {
            label: 'muted',
            cells: CONNECTORS.map((c) => <ConnectorIcon type={c} muted />),
          },
        ]}
      />
    ),
  },
  {
    id: 'power-text',
    title: 'PowerText',
    description: 'Speed tier = bolt count, never a status color.',
    render: () => (
      <div className="pg-row">
        <PowerText kw={22} />
        <PowerText kw={50} tier={1} />
        <PowerText kw={150} tier={2} />
        <PowerText kw={350} tier={3} />
        <PowerText kw={187} emphasis />
      </div>
    ),
  },
  {
    id: 'price-text',
    title: 'PriceText',
    render: () => (
      <div className="pg-row">
        <PriceText amount={0.48} unit="kwh" />
        <PriceText amount={0.4} unit="min" />
        <PriceText amount={2} unit="session" />
        <PriceText amount={0.4} unit="idle" />
        <PriceText unit="free" />
        <PriceText amount={15.55} unit="kwh" emphasis />
      </div>
    ),
  },
  {
    id: 'battery-glyph',
    title: 'BatteryGlyph',
    render: () => (
      <VariantMatrix
        cols={['8%', '45%', '80%']}
        rows={[
          {
            label: 'idle',
            cells: [8, 45, 80].map((p) => <BatteryGlyph percent={p} />),
          },
          {
            label: 'charging',
            cells: [8, 45, 80].map((p) => (
              <BatteryGlyph percent={p} charging />
            )),
          },
        ]}
      />
    ),
  },
  {
    id: 'freshness',
    title: 'FreshnessIndicator',
    description:
      'Status trust surface — availability is only as good as its last update. Stale and unknown read as reduced confidence.',
    render: () => (
      <div className="pg-row">
        <FreshnessIndicator label="Updated 2 min ago" />
        <FreshnessIndicator state="stale" label="Updated 40 min ago" />
        <FreshnessIndicator state="unknown" label="Status unavailable" />
      </div>
    ),
  },
  {
    id: 'payment-status-tag',
    title: 'PaymentStatusTag',
    description:
      'Payment vocabulary (paid/pending/failed/refunded) mapped onto the pinned status plumbing — separate from the charger vocabulary.',
    render: () => (
      <div className="pg-row">
        <PaymentStatusTag status="paid" />
        <PaymentStatusTag status="pending" />
        <PaymentStatusTag status="failed" />
        <PaymentStatusTag status="refunded" />
      </div>
    ),
  },
  {
    id: 'skeleton',
    title: 'Skeleton',
    description:
      'Loading placeholders — screen readiness is not operational state.',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
        <div className="pg-row">
          <Skeleton shape="circle" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            <Skeleton shape="title" width="70%" />
            <Skeleton shape="text" width="45%" />
          </div>
        </div>
        <Skeleton shape="row" />
        <Skeleton shape="card" />
      </div>
    ),
  },
  {
    id: 'code-input',
    title: 'CodeInput',
    description:
      'One real input behind segmented cells — OTP login (numeric, one-time-code autofill) and manual charger-code entry (alphanumeric fallback for every identification flow).',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <CodeInput length={6} />
        <CodeInput length={6} mode="alphanumeric" value="LKV-B2" />
        <CodeInput length={4} value="12" error />
        <CodeInput length={4} value="0417" disabled />
      </div>
    ),
  },
  {
    id: 'input',
    title: 'Input',
    render: () => (
      <div className="pg-row">
        <Input placeholder="Station ID" />
        <Input kind="search" placeholder="Search stations" />
        <Input placeholder="Invalid code" error defaultValue="XX-99" />
        <Input placeholder="Disabled" disabled />
      </div>
    ),
  },
  {
    id: 'switch',
    title: 'Switch',
    render: () => (
      <div className="pg-row">
        <Switch />
        <Switch defaultChecked />
        <Switch disabled />
        <Switch disabled defaultChecked />
      </div>
    ),
  },
  {
    id: 'spinner',
    title: 'Spinner',
    render: () => (
      <div className="pg-row">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    ),
  },
];
