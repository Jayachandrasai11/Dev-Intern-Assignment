import { STATUS_LABELS } from '../../../components/status';
import type { ChargerStatus } from '../../../components/status';
import type { FigmaNode, FigmaPack } from '../../../composer/figmaMap';

/**
 * Volt's Figma pack — maps onto the Volt DS Figma library (built 2026-07-09,
 * Atlas R1 components + 9-status vocabulary synced 2026-07-13): exact
 * component-set names, `Prop=Value` variant strings, and text properties.
 */

const CONNECTOR_TYPE_MAP: Record<string, string> = {
  ccs1: 'CCS1', ccs2: 'CCS2', chademo: 'CHAdeMO', type1: 'J1772',
  type2: 'Type2', nacs: 'NACS', gbt: 'GBT',
};
const CHIP_STATUSES = new Set(['available', 'charging', 'occupied', 'faulted']);
const PIN_STATUSES = new Set([
  'available', 'charging', 'in-use', 'occupied', 'faulted', 'offline',
]);
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const statusLabel = (s: ChargerStatus) => STATUS_LABELS[s];

const MAPPERS: Record<string, (p: Record<string, any>) => FigmaNode> = {
  // ScreenHeader is the composer primitive; the Figma set is AppHeader.
  ScreenHeader: (p) => ({
    kind: 'instance',
    component: 'AppHeader',
    variant: { Back: p.back ? 'On' : 'Off', Subtitle: p.subtitle ? 'On' : 'Off' },
    textProps: { Title: p.title, ...(p.subtitle ? { Subtitle: p.subtitle } : {}) },
  }),
  Icon: (p) => ({
    kind: 'instance',
    component: 'icon/' + p.name,
    variant: {},
  }),
  Alert: (p) => ({
    kind: 'instance',
    component: 'Alert',
    variant: {
      Tone: cap(p.tone),
      Description: p.description ? 'On' : 'Off',
    },
    textProps: { Title: p.title, ...(p.description ? { Description: p.description } : {}) },
  }),
  Toast: (p) => ({
    kind: 'instance',
    component: 'Toast',
    variant: { Tone: cap(p.tone) },
    textProps: { Message: p.message, ...(p.description ? { Description: p.description } : {}) },
  }),
  Button: (p) => ({
    kind: 'instance',
    component: 'Button',
    variant: {
      Variant: cap(p.variant),
      Size: p.size,
      State: p.disabled ? 'Disabled' : 'Default',
    },
    textProps: { Label: p.label },
    booleanProps: { Loading: Boolean(p.loading) },
  }),
  StatusBadge: (p) => ({
    kind: 'instance',
    component: 'StatusBadge',
    variant: { Form: cap(p.form), Status: statusLabel(p.status) },
  }),
  Tag: (p) => ({
    kind: 'instance',
    component: 'Tag',
    variant: { Tone: cap(p.tone) },
    textProps: { Label: p.label },
  }),
  ConnectorIcon: (p) => ({
    kind: 'instance',
    component: 'ConnectorIcon',
    variant: {
      Type: CONNECTOR_TYPE_MAP[p.type],
      Tone: p.muted ? 'Muted' : 'Default',
    },
  }),
  PowerText: (p) => ({
    kind: 'instance',
    component: 'PowerText',
    variant: {
      Tier: p.tier > 0 ? String(p.tier) : 'None',
      Style: p.emphasis ? 'Emphasis' : 'Default',
    },
    textProps: { kW: String(p.kw) },
  }),
  PriceText: (p) => ({
    kind: 'instance',
    component: 'PriceText',
    variant: {
      Unit: { kwh: 'kWh', min: 'Min', session: 'Session', idle: 'Idle', free: 'Free' }[
        p.unit as string
      ]!,
      Style: p.emphasis ? 'Emphasis' : 'Default',
    },
    ...(p.unit !== 'free'
      ? { textProps: { Amount: `$${Number(p.amount).toFixed(2)}` } }
      : {}),
  }),
  BatteryGlyph: (p) => ({
    kind: 'instance',
    component: 'BatteryGlyph',
    variant: {
      Level: p.percent <= 15 ? 'Low' : p.percent <= 70 ? 'Mid' : 'High',
      Charging: p.charging ? 'On' : 'Off',
    },
  }),
  Input: (p) => ({
    kind: 'instance',
    component: 'Input',
    variant: {
      Kind: cap(p.kind),
      State: p.disabled ? 'Disabled' : p.error ? 'Error' : 'Default',
    },
    textProps: { Placeholder: p.placeholder },
  }),
  Switch: (p) => ({
    kind: 'instance',
    component: 'Switch',
    variant: {
      Checked: p.checked ? 'On' : 'Off',
      State: p.disabled ? 'Disabled' : 'Default',
    },
  }),
  Spinner: (p) => ({
    kind: 'instance',
    component: 'Spinner',
    variant: { Size: p.size },
  }),
  ConnectorChip: (p) => {
    const supported = CHIP_STATUSES.has(p.status);
    return {
      kind: 'instance',
      component: 'ConnectorChip',
      variant: {
        Form: cap(p.form),
        Status: statusLabel(supported ? p.status : 'available'),
        Selected: p.selected ? 'On' : 'Off',
      },
      ...(supported
        ? {}
        : { notes: `status "${p.status}" not in Figma set; used Available` }),
    };
  },
  StationListCard: (p) => ({
    kind: 'instance',
    component: 'StationListCard',
    variant: { Variant: cap(p.variant) },
  }),
  MapPin: (p) => {
    if (p.cluster > 0) {
      return {
        kind: 'instance',
        component: 'MapPin',
        variant: { Status: 'Available', Style: 'Cluster' },
      };
    }
    const supported = PIN_STATUSES.has(p.status);
    return {
      kind: 'instance',
      component: 'MapPin',
      variant: {
        Status: statusLabel(supported ? p.status : 'offline'),
        Style: p.selected ? 'Selected' : p.count > 0 ? 'Count' : 'Default',
      },
      ...(supported ? {} : { notes: `status "${p.status}" mapped to Offline` }),
    };
  },
  FilterChip: (p) => ({
    kind: 'instance',
    component: 'FilterChip',
    variant: {
      State: p.active ? 'Active' : 'Default',
      Count: p.count > 0 ? 'On' : 'Off',
    },
    textProps: { Label: p.label },
  }),
  SessionStat: (p) => ({
    kind: 'instance',
    component: 'SessionStat',
    variant: { Form: cap(p.form) },
    textProps: { 'Stat label': p.label, Value: p.value, Unit: p.unit ?? '' },
  }),
  BatteryProgressBar: (p) => ({
    kind: 'instance',
    component: 'BatteryProgressBar',
    variant: {
      State: p.charging ? 'Charging' : 'Idle',
      Limit: p.limit > 0 ? 'On' : 'Off',
    },
    textProps: { Percent: `${p.percent}%` },
  }),
  PricingTable: (p) => ({
    kind: 'instance',
    component: 'PricingTable',
    variant: { Layout: p.showMember ? 'Member + idle fee' : 'Simple' },
  }),
  PaymentMethodRow: (p) => ({
    kind: 'instance',
    component: 'PaymentMethodRow',
    variant: {
      Brand: { visa: 'Visa', mc: 'Mastercard', amex: 'Amex', applepay: 'ApplePay', add: 'Add' }[
        p.brand as string
      ]!,
      Default: p.isDefault ? 'On' : 'Off',
    },
  }),
  ActiveChargingSession: (p) => ({
    kind: 'instance',
    component: 'ActiveChargingSession',
    variant: {
      View: p.telemetry ? cap(p.archetype) : 'NoTelemetry',
      State: cap(p.state),
    },
  }),
  StartChargeStepper: (p) => ({
    kind: 'instance',
    component: 'StartChargeStepper',
    variant: { Step: String(p.step) },
    ...(p.vocabulary === 'handshake' || p.failed
      ? {
          notes: [
            p.vocabulary === 'handshake'
              ? 'handshake step labels not in Figma set'
              : null,
            p.failed ? 'failed state not in Figma set' : null,
          ]
            .filter(Boolean)
            .join('; '),
        }
      : {}),
  }),

  // ---------- Atlas R1 additions (synced to the library 2026-07-13) ----------
  CodeInput: (p) => ({
    kind: 'instance',
    component: 'CodeInput',
    variant: {
      Mode: cap(p.mode),
      State: p.disabled ? 'Disabled' : p.error ? 'Error' : 'Default',
    },
  }),
  FreshnessIndicator: (p) => ({
    kind: 'instance',
    component: 'FreshnessIndicator',
    variant: { State: cap(p.state) },
    textProps: { Label: p.label },
  }),
  PaymentStatusTag: (p) => ({
    kind: 'instance',
    component: 'PaymentStatusTag',
    variant: { Status: cap(p.status) },
  }),
  Skeleton: (p) => ({
    kind: 'instance',
    component: 'Skeleton',
    variant: { Shape: cap(p.shape) },
  }),
  ListRow: (p) => ({
    kind: 'instance',
    component: 'ListRow',
    variant: {
      Trailing: cap(p.trailing ?? 'chevron'),
      Description: p.description ? 'On' : 'Off',
      Tone: p.destructive ? 'Destructive' : 'Default',
    },
    textProps: {
      Label: p.label,
      ...(p.description ? { Description: p.description } : {}),
    },
  }),
  SegmentedControl: (p) => {
    const count = String(p.labels ?? '').split(',').filter((l: string) => l.trim()).length;
    const clamped = Math.min(4, Math.max(2, count));
    return {
      kind: 'instance',
      component: 'SegmentedControl',
      variant: { Options: String(clamped) },
      ...(count === clamped
        ? {}
        : { notes: `${count} options clamped to ${clamped} (Figma set covers 2–4)` }),
    };
  },
  LocationStatusCard: () => ({
    kind: 'instance',
    component: 'LocationStatusCard',
    variant: { Availability: 'Free' },
  }),
  ChargerStatusRow: (p) => ({
    kind: 'instance',
    component: 'ChargerStatusRow',
    variant: { Status: statusLabel(p.status) },
    textProps: {
      Code: p.code,
      ...(p.connector || p.kw
        ? { Meta: [p.connector, p.kw ? `${p.kw} kW` : null].filter(Boolean).join(' · ') }
        : {}),
    },
  }),
  EmptyState: (p) => ({
    kind: 'instance',
    component: 'EmptyState',
    variant: { Action: p.actionLabel ? 'On' : 'Off' },
    textProps: {
      Title: p.title,
      ...(p.body ? { Body: p.body } : {}),
    },
  }),
  ActiveSessionCard: (p) => ({
    kind: 'instance',
    component: 'ActiveSessionCard',
    // Figma variant vocabulary uses Paused for the suspended session state
    variant: { State: p.state === 'suspended' ? 'Paused' : cap(p.state) },
  }),
  DurationSelector: (p) => ({
    kind: 'instance',
    component: 'DurationSelector',
    variant: { Selected: String(p.value) },
  }),
  WalletBalanceCard: (p) => ({
    kind: 'instance',
    component: 'WalletBalanceCard',
    variant: { State: cap(p.state) },
    textProps: {
      Balance: `$${Number(p.balance).toFixed(2)}`,
      Message:
        p.state === 'insufficient'
          ? `Add $${Math.max(0, p.required - p.balance).toFixed(2)} to start`
          : p.state === 'checking'
            ? 'Checking charging cost…'
            : 'Ready to start charging',
      ...(p.required > 0 && p.state !== 'checking'
        ? { Required: `Needs up to $${Number(p.required).toFixed(2)}` }
        : {}),
    },
  }),
  LineItemList: (p) => ({
    kind: 'instance',
    component: 'LineItemList',
    variant: { Meta: p.showMeta ? 'On' : 'Off' },
  }),
  SupportContextCard: (p) => ({
    kind: 'instance',
    component: 'SupportContextCard',
    variant: { Context: 'On' },
    textProps: { Title: p.title },
  }),
  BottomNavBar: (p) => ({
    kind: 'instance',
    component: 'BottomNavBar',
    variant: {
      Layout: p.layout === 'scan-center' ? 'Center scan' : 'Tabs',
    },
  }),
  ScannerFrame: (p) => ({
    kind: 'instance',
    component: 'ScannerFrame',
    variant: { State: cap(p.state) },
    textProps: { Instruction: p.instruction },
  }),
};

export const VOLT_FIGMA: FigmaPack = {
  library: 'Volt DS',
  fileKey: '2iFEHdVzaAcYO1RhNS44Ne',
  mappers: MAPPERS,
};
