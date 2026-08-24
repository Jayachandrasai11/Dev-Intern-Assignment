import type { ComponentConfig, Config } from '@puckeditor/core';
import {
  BatteryGlyph,
  Button,
  CodeInput,
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
} from '../../../components/atoms';
import type { ConnectorType, Freshness, PaymentStatus } from '../../../components/atoms';
import { Icon, ICON_NAMES } from '../../../components/atoms';
import {
  ActiveSessionCard,
  Alert,
  BatteryProgressBar,
  ChargerStatusRow,
  ConnectorChip,
  DurationSelector,
  EmptyState,
  FilterChip,
  LineItemList,
  ListRow,
  LocationStatusCard,
  MapPin,
  PaymentMethodRow,
  PricingTable,
  SegmentedControl,
  SessionStat,
  StationListCard,
  SupportContextCard,
  Toast,
  WalletBalanceCard,
} from '../../../components/molecules';
import type { ActiveSessionCardState, PaymentBrand } from '../../../components/molecules';
import {
  ActiveChargingSession,
  BottomNavBar,
  ScannerFrame,
  StartChargeStepper,
} from '../../../components/organisms';
import type { SessionState } from '../../../components/organisms';
import {
  SAMPLE_LOCATIONS,
  SAMPLE_PHASES,
  SAMPLE_PRICE_BANDS,
  SAMPLE_RECEIPT_ITEMS,
  SAMPLE_SESSION,
  SAMPLE_STATIONS,
} from '../../../components/data';
import { SAMPLE_TARIFF_NOTES } from '../../../components/tariffs';
import type { ChargerStatus } from '../../../components/status';
import { ALL_STATUSES, STATUS_LABELS } from '../../../components/status';
import { GLOBAL_TOKENS } from '../../../tokens/global';
import { ScreenHeader } from '../../../composer/primitives';
import {
  boolField,
  makeComposerConfig,
  makeLayoutComponents,
  makeSpaceOptions,
  opts,
} from '../../../composer/registryKit';

/**
 * The Puck adapter: the ONLY module (besides Editor.tsx / schema.ts) that
 * imports Puck APIs. Maps Volt DS's typed props onto Puck fields.
 *
 * StationDetailSheet is deliberately not registered: it renders a portalled
 * Radix Dialog with a fixed overlay, which fights an inline preview — its
 * content is composable from ConnectorChip rows + PricingTable in a Stack.
 */

const CONNECTOR_TYPES: ConnectorType[] = [
  'ccs1',
  'ccs2',
  'chademo',
  'type1',
  'type2',
  'nacs',
  'gbt',
];
const statusField = {
  type: 'select' as const,
  options: opts<ChargerStatus>(ALL_STATUSES, (s) => STATUS_LABELS[s]),
};
const stationField = {
  type: 'select' as const,
  label: 'Station (fixture)',
  options: SAMPLE_STATIONS.map((s, i) => ({ value: i, label: s.name })),
};

const space = makeSpaceOptions(GLOBAL_TOKENS);

const CATEGORIES: Config['categories'] = {
    layout: {
      title: 'Layout',
      components: ['Group', 'Stack', 'Row', 'Spacer', 'ScreenHeader'],
    },
    atoms: {
      title: 'Atoms',
      components: [
        'Button',
        'Icon',
        'StatusBadge',
        'Tag',
        'ConnectorIcon',
        'PowerText',
        'PriceText',
        'BatteryGlyph',
        'Input',
        'CodeInput',
        'Switch',
        'Spinner',
        'FreshnessIndicator',
        'PaymentStatusTag',
        'Skeleton',
      ],
    },
    molecules: {
      title: 'Molecules',
      components: [
        'Alert',
        'Toast',
        'ConnectorChip',
        'StationListCard',
        'MapPin',
        'FilterChip',
        'SessionStat',
        'BatteryProgressBar',
        'PricingTable',
        'PaymentMethodRow',
        'ListRow',
        'SegmentedControl',
        'LocationStatusCard',
        'ChargerStatusRow',
        'EmptyState',
        'ActiveSessionCard',
        'DurationSelector',
        'WalletBalanceCard',
        'LineItemList',
        'SupportContextCard',
      ],
    },
    organisms: {
      title: 'Organisms',
      components: [
        'ActiveChargingSession',
        'StartChargeStepper',
        'BottomNavBar',
        'ScannerFrame',
      ],
    },
};

const rawComponents: Record<string, ComponentConfig<any>> = {
    // ---------- layout primitives (generic, from the registry kit) ----------
    ...makeLayoutComponents(space),
    ScreenHeader: {
      fields: {
        title: { type: 'text' },
        subtitle: { type: 'text' },
        back: boolField('Back arrow'),
      },
      defaultProps: { title: 'Nearby stations', subtitle: '', back: false },
      render: ({ title, subtitle, back }) => (
        <ScreenHeader title={title} subtitle={subtitle} back={back} />
      ),
    },

    // ---------- atoms ----------
    Icon: {
      fields: {
        name: { type: 'select', options: ICON_NAMES.map((n) => ({ value: n, label: n })) },
        size: { type: 'number', min: 12, max: 64 },
      },
      defaultProps: { name: 'bolt', size: 24 },
      render: ({ name, size }) => <Icon name={name} size={size} />,
    },
    Button: {
      fields: {
        label: { type: 'text' },
        variant: {
          type: 'select',
          options: opts(['solid', 'soft', 'outline', 'ghost'] as const),
        },
        size: { type: 'select', options: opts(['sm', 'md', 'lg'] as const) },
        loading: boolField(),
        disabled: boolField(),
      },
      defaultProps: {
        label: 'Charge',
        variant: 'solid',
        size: 'md',
        loading: false,
        disabled: false,
      },
      render: ({ label, ...rest }) => <Button {...rest}>{label}</Button>,
    },
    StatusBadge: {
      fields: {
        status: statusField,
        form: {
          type: 'select',
          options: opts(['pill', 'dot', 'count'] as const),
        },
        free: { type: 'number', min: 0 },
        total: { type: 'number', min: 0 },
      },
      defaultProps: { status: 'available', form: 'pill', free: 4, total: 6 },
      render: ({ status, form, free, total }) => (
        <StatusBadge status={status} form={form} count={{ free, total }} />
      ),
    },
    Tag: {
      fields: {
        label: { type: 'text' },
        tone: { type: 'select', options: opts(['neutral', 'accent'] as const) },
      },
      defaultProps: { label: 'Restrooms', tone: 'neutral' },
      render: ({ label, tone }) => <Tag tone={tone}>{label}</Tag>,
    },
    ConnectorIcon: {
      fields: {
        type: { type: 'select', options: opts(CONNECTOR_TYPES) },
        muted: boolField(),
        size: { type: 'number', min: 16, max: 64 },
      },
      defaultProps: { type: 'ccs2', muted: false, size: 24 },
      render: ({ type, muted, size }) => (
        <ConnectorIcon type={type} muted={muted} size={size} />
      ),
    },
    PowerText: {
      fields: {
        kw: { type: 'number', min: 1 },
        tier: {
          type: 'select',
          options: [
            { value: 0, label: 'No bolts' },
            { value: 1, label: '1 · fast' },
            { value: 2, label: '2 · ultra' },
            { value: 3, label: '3 · hyper' },
          ],
        },
        emphasis: boolField(),
      },
      defaultProps: { kw: 150, tier: 2, emphasis: false },
      render: ({ kw, tier, emphasis }) => (
        <PowerText
          kw={kw}
          tier={tier === 0 ? undefined : (tier as 1 | 2 | 3)}
          emphasis={emphasis}
        />
      ),
    },
    PriceText: {
      fields: {
        amount: { type: 'number', min: 0 },
        unit: {
          type: 'select',
          options: opts(['kwh', 'min', 'session', 'idle', 'free'] as const),
        },
        emphasis: boolField(),
      },
      defaultProps: { amount: 0.48, unit: 'kwh', emphasis: false },
      render: ({ amount, unit, emphasis }) => (
        <PriceText amount={amount} unit={unit} emphasis={emphasis} />
      ),
    },
    BatteryGlyph: {
      fields: {
        percent: { type: 'number', min: 0, max: 100 },
        charging: boolField(),
      },
      defaultProps: { percent: 64, charging: true },
      render: ({ percent, charging }) => (
        <BatteryGlyph percent={percent} charging={charging} />
      ),
    },
    Input: {
      fields: {
        kind: { type: 'select', options: opts(['default', 'search'] as const) },
        placeholder: { type: 'text' },
        error: boolField(),
        disabled: boolField(),
      },
      defaultProps: {
        kind: 'search',
        placeholder: 'Search stations',
        error: false,
        disabled: false,
      },
      render: ({ kind, placeholder, error, disabled }) => (
        <Input kind={kind} placeholder={placeholder} error={error} disabled={disabled} />
      ),
    },
    Switch: {
      fields: { checked: boolField('Checked'), disabled: boolField() },
      defaultProps: { checked: true, disabled: false },
      render: ({ checked, disabled }) => (
        <Switch key={String(checked)} defaultChecked={checked} disabled={disabled} />
      ),
    },
    Spinner: {
      fields: {
        size: { type: 'select', options: opts(['sm', 'md', 'lg'] as const) },
      },
      defaultProps: { size: 'md' },
      render: ({ size }) => <Spinner size={size} />,
    },
    CodeInput: {
      fields: {
        length: { type: 'number', min: 4, max: 8 },
        mode: {
          type: 'select',
          options: opts(['numeric', 'alphanumeric'] as const),
        },
        value: { type: 'text' },
        error: boolField(),
        disabled: boolField(),
      },
      defaultProps: {
        length: 6,
        mode: 'numeric',
        value: '04',
        error: false,
        disabled: false,
      },
      render: ({ length, mode, value, error, disabled }) => (
        <CodeInput
          length={length}
          mode={mode}
          value={value}
          error={error}
          disabled={disabled}
        />
      ),
    },
    FreshnessIndicator: {
      fields: {
        state: {
          type: 'select',
          options: opts<Freshness>(['fresh', 'stale', 'unknown']),
        },
        label: { type: 'text' },
      },
      defaultProps: { state: 'fresh', label: 'Updated 2 min ago' },
      render: ({ state, label }) => (
        <FreshnessIndicator state={state} label={label} />
      ),
    },
    PaymentStatusTag: {
      fields: {
        status: {
          type: 'select',
          options: opts<PaymentStatus>(['paid', 'pending', 'failed', 'refunded']),
        },
      },
      defaultProps: { status: 'paid' },
      render: ({ status }) => <PaymentStatusTag status={status} />,
    },
    Skeleton: {
      fields: {
        shape: {
          type: 'select',
          options: opts(['text', 'title', 'row', 'card', 'circle'] as const),
        },
        width: { type: 'number', min: 0, label: 'Width px (0 = default)' },
      },
      defaultProps: { shape: 'row', width: 0 },
      render: ({ shape, width }) => (
        <Skeleton shape={shape} width={width > 0 ? width : undefined} />
      ),
    },

    // ---------- molecules ----------
    Alert: {
      fields: {
        tone: {
          type: 'select',
          options: opts([
            'info',
            'success',
            'warning',
            'danger',
            'guidance',
          ] as const),
        },
        title: { type: 'text' },
        description: { type: 'textarea' },
        actionLabel: { type: 'text', label: 'Action label (empty = none)' },
        dismissible: boolField('Dismiss button'),
      },
      defaultProps: {
        tone: 'warning',
        title: 'Idle fees apply soon',
        description: 'Your session finished — fees start in 8 minutes.',
        actionLabel: '',
        dismissible: false,
      },
      render: ({ tone, title, description, actionLabel, dismissible }) => (
        <Alert
          tone={tone}
          title={title}
          action={actionLabel ? { label: actionLabel } : undefined}
          onDismiss={dismissible ? () => {} : undefined}
        >
          {description || undefined}
        </Alert>
      ),
    },
    Toast: {
      fields: {
        tone: {
          type: 'select',
          options: opts(['neutral', 'success', 'error', 'loading'] as const),
        },
        message: { type: 'text' },
        description: { type: 'text' },
      },
      defaultProps: {
        tone: 'success',
        message: 'Charging started',
        description: 'Stall A2 · CCS2',
      },
      render: ({ tone, message, description }) => (
        <Toast tone={tone} message={message} description={description || undefined} />
      ),
    },
    ConnectorChip: {
      fields: {
        form: { type: 'select', options: opts(['chip', 'row'] as const) },
        type: { type: 'select', options: opts(CONNECTOR_TYPES) },
        status: statusField,
        kw: { type: 'number', min: 0 },
        pricePerKwh: { type: 'number', min: 0 },
        stallId: { type: 'text' },
        selected: boolField(),
      },
      defaultProps: {
        form: 'row',
        type: 'ccs2',
        status: 'available',
        kw: 300,
        pricePerKwh: 0.48,
        stallId: 'A1',
        selected: false,
      },
      render: ({ form, type, status, kw, pricePerKwh, stallId, selected }) => (
        <ConnectorChip
          form={form}
          type={type}
          status={status}
          kw={kw}
          pricePerKwh={pricePerKwh}
          stallId={stallId}
          selected={selected}
        />
      ),
    },
    StationListCard: {
      fields: {
        station: stationField,
        variant: {
          type: 'select',
          options: opts(['default', 'selected', 'compact'] as const),
        },
      },
      defaultProps: { station: 0, variant: 'default' },
      render: ({ station, variant }) => (
        <StationListCard
          station={SAMPLE_STATIONS[station] ?? SAMPLE_STATIONS[0]}
          variant={variant}
        />
      ),
    },
    MapPin: {
      fields: {
        status: statusField,
        count: { type: 'number', min: 0, label: 'Free stalls (0 = hidden)' },
        selected: boolField(),
        cluster: { type: 'number', min: 0, label: 'Cluster size (0 = pin)' },
      },
      defaultProps: { status: 'available', count: 4, selected: false, cluster: 0 },
      render: ({ status, count, selected, cluster }) => (
        <MapPin
          status={status}
          count={count > 0 ? count : undefined}
          selected={selected}
          cluster={cluster > 0 ? cluster : undefined}
        />
      ),
    },
    FilterChip: {
      fields: {
        label: { type: 'text' },
        active: boolField(),
        count: { type: 'number', min: 0, label: 'Count (0 = hidden)' },
      },
      defaultProps: { label: 'Rapid 50 kW+', active: false, count: 0 },
      render: ({ label, active, count }) => (
        <FilterChip active={active} count={count > 0 ? count : undefined}>
          {label}
        </FilterChip>
      ),
    },
    SessionStat: {
      fields: {
        form: { type: 'select', options: opts(['row', 'tile'] as const) },
        label: { type: 'text' },
        value: { type: 'text' },
        unit: { type: 'text' },
      },
      defaultProps: { form: 'tile', label: 'Power', value: '187', unit: 'kW' },
      render: ({ form, label, value, unit }) => (
        <SessionStat form={form} label={label} value={value} unit={unit} />
      ),
    },
    BatteryProgressBar: {
      fields: {
        percent: { type: 'number', min: 0, max: 100 },
        limit: { type: 'number', min: 0, max: 100, label: 'Limit (0 = none)' },
        charging: boolField(),
      },
      defaultProps: { percent: 64, limit: 80, charging: true },
      render: ({ percent, limit, charging }) => (
        <BatteryProgressBar
          percent={percent}
          limit={limit > 0 ? limit : undefined}
          charging={charging}
        />
      ),
    },
    PricingTable: {
      fields: {
        showMember: boolField('Member column'),
        idleFeePerMin: { type: 'number', min: 0, label: 'Idle fee (0 = none)' },
        notes: boolField('Tariff footnotes'),
      },
      defaultProps: { showMember: true, idleFeePerMin: 0.4, notes: false },
      render: ({ showMember, idleFeePerMin, notes }) => (
        <PricingTable
          bands={SAMPLE_PRICE_BANDS}
          showMember={showMember}
          idleFeePerMin={idleFeePerMin > 0 ? idleFeePerMin : undefined}
          notes={notes ? SAMPLE_TARIFF_NOTES : undefined}
        />
      ),
    },
    PaymentMethodRow: {
      fields: {
        brand: {
          type: 'select',
          options: opts<PaymentBrand>(['visa', 'mc', 'amex', 'applepay', 'add']),
        },
        last4: { type: 'text' },
        isDefault: boolField('Default badge'),
      },
      defaultProps: { brand: 'visa', last4: '4242', isDefault: true },
      render: ({ brand, last4, isDefault }) => (
        <PaymentMethodRow brand={brand} last4={last4} isDefault={isDefault} />
      ),
    },
    ListRow: {
      fields: {
        icon: {
          type: 'select',
          options: ICON_NAMES.map((n) => ({ value: n, label: n })),
        },
        label: { type: 'text' },
        description: { type: 'text' },
        trailing: {
          type: 'select',
          options: opts(['chevron', 'none'] as const),
        },
        destructive: boolField(),
      },
      defaultProps: {
        icon: 'receipt',
        label: 'Session history',
        description: '',
        trailing: 'chevron',
        destructive: false,
      },
      render: ({ icon, label, description, trailing, destructive }) => (
        <ListRow
          icon={icon}
          label={label}
          description={description || undefined}
          trailing={trailing}
          destructive={destructive}
          onClick={() => {}}
        />
      ),
    },
    SegmentedControl: {
      fields: {
        labels: { type: 'text', label: 'Options (comma-separated)' },
        activeIndex: { type: 'number', min: 0 },
      },
      defaultProps: { labels: 'All sessions, This month, Failed', activeIndex: 0 },
      render: ({ labels, activeIndex }) => {
        const options = String(labels)
          .split(',')
          .map((l: string) => l.trim())
          .filter(Boolean)
          .map((l: string) => ({ label: l, value: l }));
        return (
          <SegmentedControl
            options={options}
            value={options[activeIndex]?.value ?? options[0]?.value ?? ''}
          />
        );
      },
    },
    LocationStatusCard: {
      fields: {
        location: {
          type: 'select',
          label: 'Location (fixture)',
          options: SAMPLE_LOCATIONS.map((l, i) => ({ value: i, label: l.name })),
        },
      },
      defaultProps: { location: 0 },
      render: ({ location }) => (
        <LocationStatusCard
          location={SAMPLE_LOCATIONS[location] ?? SAMPLE_LOCATIONS[0]}
          onClick={() => {}}
        />
      ),
    },
    ChargerStatusRow: {
      fields: {
        code: { type: 'text' },
        status: statusField,
        kw: { type: 'number', min: 0, label: 'kW (0 = hidden)' },
        connector: { type: 'select', options: opts(CONNECTOR_TYPES) },
        freshness: {
          type: 'select',
          options: opts<Freshness>(['fresh', 'stale', 'unknown']),
        },
        freshnessLabel: { type: 'text', label: 'Freshness (empty = hidden)' },
      },
      defaultProps: {
        code: 'LKV-B2',
        status: 'available',
        kw: 7.4,
        connector: 'type2',
        freshness: 'fresh',
        freshnessLabel: '2 min ago',
      },
      render: ({ code, status, kw, connector, freshness, freshnessLabel }) => (
        <ChargerStatusRow
          code={code}
          status={status}
          kw={kw > 0 ? kw : undefined}
          connector={connector}
          freshness={freshness}
          freshnessLabel={freshnessLabel || undefined}
        />
      ),
    },
    EmptyState: {
      fields: {
        icon: {
          type: 'select',
          options: ICON_NAMES.map((n) => ({ value: n, label: n })),
        },
        title: { type: 'text' },
        body: { type: 'textarea' },
        actionLabel: { type: 'text', label: 'Action label (empty = none)' },
      },
      defaultProps: {
        icon: 'qr-code',
        title: 'No chargers yet',
        body: 'Scan the QR code on a community charger to see its status here.',
        actionLabel: 'Scan a charger',
      },
      render: ({ icon, title, body, actionLabel }) => (
        <EmptyState
          icon={icon}
          title={title}
          body={body || undefined}
          action={actionLabel ? { label: actionLabel } : undefined}
        />
      ),
    },
    ActiveSessionCard: {
      fields: {
        state: {
          type: 'select',
          options: opts<ActiveSessionCardState>([
            'charging',
            'suspended',
            'finishing',
          ]),
        },
      },
      defaultProps: { state: 'charging' },
      render: ({ state }) => (
        <ActiveSessionCard session={SAMPLE_SESSION} state={state} onClick={() => {}} />
      ),
    },
    DurationSelector: {
      fields: {
        value: { type: 'select', options: opts([30, 60, 120, 240]) },
        helper: { type: 'text' },
      },
      defaultProps: {
        value: 120,
        helper: 'Needs up to $4.74 in your wallet (7.4 kW max × $0.32/kWh)',
      },
      render: ({ value, helper }) => (
        <DurationSelector value={value} helper={helper || undefined} />
      ),
    },
    WalletBalanceCard: {
      fields: {
        balance: { type: 'number', min: 0 },
        required: { type: 'number', min: 0, label: 'Required (0 = hidden)' },
        state: {
          type: 'select',
          options: opts(['ready', 'insufficient', 'checking'] as const),
        },
      },
      defaultProps: { balance: 18.5, required: 12.6, state: 'ready' },
      render: ({ balance, required, state }) => (
        <WalletBalanceCard
          balance={balance}
          required={required > 0 ? required : undefined}
          state={state}
          onTopUp={() => {}}
        />
      ),
    },
    LineItemList: {
      fields: {
        showMeta: boolField('Session metadata'),
      },
      defaultProps: { showMeta: true },
      render: ({ showMeta }) => (
        <LineItemList
          items={SAMPLE_RECEIPT_ITEMS}
          meta={
            showMeta
              ? ['Session #VD-20260713-0412', 'Charger LKV-B2 · Lakeview Residency']
              : undefined
          }
        />
      ),
    },
    SupportContextCard: {
      fields: {
        title: { type: 'text' },
        actionLabel: { type: 'text' },
      },
      defaultProps: {
        title: 'Session ended unexpectedly',
        actionLabel: 'Contact support',
      },
      render: ({ title, actionLabel }) => (
        <SupportContextCard
          title={title}
          context={[
            { label: 'Session', value: 'VD-20260713-0412' },
            { label: 'Charger', value: 'LKV-B2' },
            { label: 'Time', value: '23:56' },
          ]}
          action={{ label: actionLabel }}
        />
      ),
    },

    // ---------- organisms ----------
    ActiveChargingSession: {
      fields: {
        archetype: { type: 'select', options: opts(['ring', 'linear'] as const) },
        state: {
          type: 'select',
          options: opts<SessionState>(['charging', 'suspended', 'finishing']),
        },
        telemetry: boolField('Vehicle telemetry'),
        soc: { type: 'number', min: 0, max: 100, label: 'State of charge %' },
        kw: { type: 'number', min: 0 },
      },
      defaultProps: {
        archetype: 'ring',
        state: 'charging',
        telemetry: true,
        soc: 64,
        kw: 187,
      },
      render: ({ archetype, state, telemetry, soc, kw }) => (
        <ActiveChargingSession
          archetype={archetype}
          state={state}
          telemetry={telemetry}
          session={{ ...SAMPLE_SESSION, soc, kw }}
        />
      ),
    },
    StartChargeStepper: {
      fields: {
        step: { type: 'select', options: opts([1, 2, 3, 4] as const) },
        vocabulary: {
          type: 'select',
          options: [
            { value: 'start-flow', label: 'Start flow (default)' },
            { value: 'handshake', label: 'Start handshake' },
          ],
        },
        failed: boolField('Current step failed'),
      },
      defaultProps: { step: 2, vocabulary: 'start-flow', failed: false },
      render: ({ step, vocabulary, failed }) => (
        <StartChargeStepper
          step={step}
          steps={vocabulary === 'handshake' ? SAMPLE_PHASES : undefined}
          failed={failed}
        />
      ),
    },
    BottomNavBar: {
      fields: {
        layout: {
          type: 'select',
          options: [
            { value: 'scan-center', label: 'Tabs + center scan' },
            { value: 'tabs', label: 'Plain tabs' },
          ],
        },
        activeId: {
          type: 'select',
          options: opts(['home', 'history', 'profile'] as const),
        },
      },
      defaultProps: { layout: 'scan-center', activeId: 'home' },
      render: ({ layout, activeId }) => (
        <BottomNavBar
          items={
            layout === 'scan-center'
              ? [
                  { id: 'home', icon: 'home', label: 'Home' },
                  { id: 'history', icon: 'receipt', label: 'Records' },
                ]
              : [
                  { id: 'home', icon: 'home', label: 'Home' },
                  { id: 'history', icon: 'receipt', label: 'Records' },
                  { id: 'profile', icon: 'user', label: 'Profile' },
                ]
          }
          activeId={activeId}
          centerAction={
            layout === 'scan-center'
              ? { icon: 'qr-code', label: 'Scan' }
              : undefined
          }
        />
      ),
    },
    ScannerFrame: {
      fields: {
        state: {
          type: 'select',
          options: opts(['scanning', 'success', 'error'] as const),
        },
        instruction: { type: 'text' },
        torch: boolField('Torch on'),
      },
      defaultProps: {
        state: 'scanning',
        instruction: 'Point at the QR code on the charger',
        torch: false,
      },
      render: ({ state, instruction, torch }) => (
        <ScannerFrame
          state={state}
          instruction={instruction}
          torchOn={torch}
          onTorchToggle={() => {}}
          onManualCode={() => {}}
        />
      ),
    },
};

export const composerConfig: Config = makeComposerConfig({
  categories: CATEGORIES,
  components: rawComponents,
  space,
});
