import { useState } from 'react';
import {
  ActiveSessionCard,
  Alert,
  AppHeader,
  BatteryProgressBar,
  ChargerStatusRow,
  ConnectorChip,
  DurationSelector,
  EmptyState,
  FilterChip,
  LineItemList,
  ListGroup,
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
} from '../../components/molecules';
import { Icon, Tag } from '../../components/atoms';
import {
  SAMPLE_LOCATIONS,
  SAMPLE_PRICE_BANDS,
  SAMPLE_RECEIPT_ITEMS,
  SAMPLE_SESSION,
  SAMPLE_STATIONS,
  SAMPLE_WALLET,
} from '../../components/data';
import { ALL_STATUSES, STATUS_LABELS } from '../../components/status';
import type { SectionDef } from '../Section';
import { VariantMatrix } from '../VariantMatrix';

const PIN_STATUSES = ALL_STATUSES.filter((s) => s !== 'coming-soon');

export const MOLECULE_SECTIONS: SectionDef[] = [
  {
    id: 'alert',
    title: 'Alert',
    description:
      'Inline banner feedback. Tones reuse the pinned status roles (info=blue, success=green, warning=amber, danger=red) via the same status plumbing as badges and pins.',
    render: () => (
      <div className="pg-stack pg-stack--narrow">
        <Alert tone="info" title="Firmware update available" onDismiss={() => {}}>
          Charger firmware 2.4 installs automatically tonight.
        </Alert>
        <Alert tone="success" title="Payment method verified" onDismiss={() => {}} />
        <Alert tone="warning" title="Idle fees apply soon">
          Your session finished 5 minutes ago — fees start in 8 minutes.
        </Alert>
        <Alert tone="danger" title="Charger fault detected">
          Stall B1 reported an isolation fault. Move to another stall.
        </Alert>
        <Alert
          tone="guidance"
          title="Bring your own cable"
          action={{ label: 'How community charging works' }}
        >
          Community chargers here use a standard socket — carry your portable
          charger or cable.
        </Alert>
      </div>
    ),
  },
  {
    id: 'toast',
    title: 'Toast',
    description:
      'Transient feedback on the inverse surface. Enter/exit uses the motion.swap role (200ms ease-out); loading tone embeds the Spinner.',
    render: () => (
      <div className="pg-stack pg-stack--narrow">
        <Toast tone="success" message="Charging started" description="Stall A2 · CCS2" />
        <Toast tone="error" message="Payment declined" action={{ label: 'Retry' }} />
        <Toast tone="loading" message="Contacting charger…" />
        <Toast message="Receipt sent to jordan@example.com" />
      </div>
    ),
  },
  {
    id: 'connector-chip',
    title: 'ConnectorChip',
    description: 'type × status, in chip and selectable-row densities.',
    render: () => (
      <div className="pg-stack">
        <div className="pg-row">
          <ConnectorChip type="ccs2" status="available" kw={300} />
          <ConnectorChip type="type2" status="occupied" kw={22} />
          <ConnectorChip type="chademo" status="faulted" kw={50} />
          <ConnectorChip type="nacs" status="charging" kw={250} />
          <ConnectorChip type="ccs2" status="available" kw={300} selected />
        </div>
        <div className="pg-stack pg-stack--narrow">
          <ConnectorChip form="row" type="ccs2" status="available" kw={300} pricePerKwh={0.48} stallId="A1" />
          <ConnectorChip form="row" type="type2" status="occupied" kw={22} pricePerKwh={0.29} stallId="C1" />
          <ConnectorChip form="row" type="ccs2" status="available" kw={300} pricePerKwh={0.48} stallId="A2" selected />
          <ConnectorChip form="row" type="chademo" status="faulted" kw={50} pricePerKwh={0.42} stallId="B1" />
        </div>
      </div>
    ),
  },
  {
    id: 'station-card',
    title: 'StationListCard',
    render: () => (
      <div className="pg-row pg-row--top">
        <StationListCard station={SAMPLE_STATIONS[0]} />
        <StationListCard station={SAMPLE_STATIONS[1]} variant="selected" />
        <StationListCard station={SAMPLE_STATIONS[2]} variant="compact" />
      </div>
    ),
  },
  {
    id: 'map-pin',
    title: 'MapPin',
    description:
      'Encoding budget: color = status, badge number = free stalls. Cluster pins take the brand accent.',
    render: () => (
      <div className="pg-stack">
        <VariantMatrix
          cols={PIN_STATUSES.map((s) => STATUS_LABELS[s])}
          rows={[
            {
              label: 'default',
              cells: PIN_STATUSES.map((s) => <MapPin status={s} />),
            },
            {
              label: 'count',
              cells: PIN_STATUSES.map((s) => (
                <MapPin status={s} count={s === 'available' ? 4 : 0} />
              )),
            },
            {
              label: 'selected',
              cells: PIN_STATUSES.map((s) => <MapPin status={s} selected />),
            },
          ]}
        />
        <div className="pg-row">
          <MapPin status="available" cluster={12} />
          <MapPin status="available" cluster={3} />
        </div>
      </div>
    ),
  },
  {
    id: 'filter-chip',
    title: 'FilterChip',
    render: () => (
      <div className="pg-row">
        <FilterChip>Available now</FilterChip>
        <FilterChip active>Rapid 50 kW+</FilterChip>
        <FilterChip count={3}>Connector</FilterChip>
        <FilterChip active count={2}>
          Network
        </FilterChip>
      </div>
    ),
  },
  {
    id: 'session-stat',
    title: 'SessionStat',
    render: () => (
      <div className="pg-row pg-row--top">
        <div className="pg-stack pg-stack--narrow">
          <SessionStat label="Power" value="187" unit="kW" />
          <SessionStat label="Delivered" value="32.4" unit="kWh" />
          <SessionStat label="Cost" value="$15.55" />
        </div>
        <div className="pg-row">
          <SessionStat form="tile" label="Power" value="187" unit="kW" />
          <SessionStat form="tile" label="Range added" value="210" unit="km" />
        </div>
      </div>
    ),
  },
  {
    id: 'battery-bar',
    title: 'BatteryProgressBar',
    description: 'Charge-limit tick — the domain-specific progress atom.',
    render: () => (
      <div className="pg-stack">
        <BatteryProgressBar percent={64} limit={80} charging />
        <BatteryProgressBar percent={80} limit={80} />
        <BatteryProgressBar percent={12} />
      </div>
    ),
  },
  {
    id: 'pricing-table',
    title: 'PricingTable',
    description: 'Pricing is a table, not a string: time bands, dual member/guest pricing, idle fees.',
    render: () => (
      <div className="pg-row pg-row--top">
        <PricingTable bands={SAMPLE_PRICE_BANDS} />
        <PricingTable bands={SAMPLE_PRICE_BANDS} showMember idleFeePerMin={0.4} />
      </div>
    ),
  },
  {
    id: 'payment-row',
    title: 'PaymentMethodRow',
    render: () => (
      <div className="pg-stack pg-stack--narrow">
        <PaymentMethodRow brand="visa" last4="4242" isDefault />
        <PaymentMethodRow brand="mc" last4="8210" />
        <PaymentMethodRow brand="applepay" />
        <PaymentMethodRow brand="add" />
      </div>
    ),
  },
  {
    id: 'app-header',
    title: 'AppHeader',
    description:
      'Top navigation for stacked mobile screens — back affordance, title/subtitle, trailing contextual actions (the composer ScreenHeader primitive now renders this component).',
    render: () => (
      <div className="pg-stack pg-stack--narrow" style={{ maxWidth: 375 }}>
        <AppHeader title="Lakeview Residency" subtitle="4 chargers · Tower B" onBack={() => {}} />
        <AppHeader
          title="Charging"
          trailing={
            <button
              type="button"
              className="ev-app-header__back"
              aria-label="Help"
              style={{ margin: 0 }}
            >
              <Icon name="help-circle" size={20} />
            </button>
          }
        />
      </div>
    ),
  },
  {
    id: 'list-row',
    title: 'ListRow / ListGroup',
    description:
      'Navigation rows for profile, support, records, and settings surfaces; group rows for a bordered container with dividers.',
    render: () => (
      <div className="pg-stack pg-stack--narrow" style={{ maxWidth: 375 }}>
        <ListGroup>
          <ListRow icon="receipt" label="Session history" onClick={() => {}} />
          <ListRow
            icon="ev-car"
            label="Vehicle profile"
            description="Optional — never required to charge"
            onClick={() => {}}
          />
          <ListRow
            icon="wallet"
            label="Wallet"
            trailing={<Tag tone="accent">$18.50</Tag>}
            onClick={() => {}}
          />
          <ListRow icon="help-circle" label="Help & support" onClick={() => {}} />
        </ListGroup>
        <ListRow icon="trash" label="Delete account" destructive onClick={() => {}} />
      </div>
    ),
  },
  {
    id: 'segmented',
    title: 'SegmentedControl',
    description: 'Inline view switcher — thumb swap on the motion.swap role.',
    render: () => <SegmentedDemo />,
  },
  {
    id: 'location-card',
    title: 'LocationStatusCard',
    description:
      'Home status surface for previously scanned community locations — availability + freshness only. Deliberately no start affordance: every new session begins with a fresh scan or manual code.',
    render: () => (
      <div className="pg-stack pg-stack--narrow" style={{ maxWidth: 375 }}>
        {SAMPLE_LOCATIONS.map((l) => (
          <LocationStatusCard key={l.id} location={l} onClick={() => {}} />
        ))}
      </div>
    ),
  },
  {
    id: 'charger-row',
    title: 'ChargerStatusRow',
    description:
      'Cluster-status view rows: the visible manual charger code, spec, pinned status, and per-charger freshness. Status-only.',
    render: () => (
      <div className="pg-stack pg-stack--narrow" style={{ maxWidth: 375 }}>
        <ChargerStatusRow code="LKV-B1" status="available" kw={7.4} connector="type2" freshnessLabel="2 min ago" />
        <ChargerStatusRow code="LKV-B3" status="in-use" kw={7.4} connector="type2" freshnessLabel="2 min ago" />
        <ChargerStatusRow code="LKV-B4" status="maintenance" kw={7.4} connector="type2" freshness="stale" freshnessLabel="40 min ago" />
        <ChargerStatusRow code="OWP-14" status="unknown" freshness="unknown" freshnessLabel="No signal" />
      </div>
    ),
  },
  {
    id: 'empty-state',
    title: 'EmptyState',
    render: () => (
      <div className="pg-grid-2" style={{ maxWidth: 760 }}>
        <EmptyState
          icon="qr-code"
          title="No chargers yet"
          body="Scan the QR code on a community charger to see its status here after your first session."
          action={{ label: 'Scan a charger' }}
        />
        <EmptyState
          icon="receipt"
          title="No sessions yet"
          body="Your charging history and receipts will appear here."
        />
      </div>
    ),
  },
  {
    id: 'active-session-card',
    title: 'ActiveSessionCard',
    description:
      'Compact home surface for a live session — state dot on the status plumbing, elapsed/energy/cost, tap-through to the full monitor.',
    render: () => (
      <div className="pg-stack pg-stack--narrow" style={{ maxWidth: 375 }}>
        <ActiveSessionCard session={SAMPLE_SESSION} onClick={() => {}} />
        <ActiveSessionCard session={SAMPLE_SESSION} state="suspended" onClick={() => {}} />
        <ActiveSessionCard session={SAMPLE_SESSION} state="finishing" onClick={() => {}} />
      </div>
    ),
  },
  {
    id: 'duration-selector',
    title: 'DurationSelector',
    description:
      'Duration selection feeds the conservative wallet upper-bound check before start.',
    render: () => <DurationDemo />,
  },
  {
    id: 'wallet-card',
    title: 'WalletBalanceCard',
    description:
      'Wallet readiness before start. The status line is the gate; the note keeps the conservative hold estimate from reading as the final bill.',
    render: () => (
      <div className="pg-stack pg-stack--narrow" style={{ maxWidth: 375 }}>
        <WalletBalanceCard
          balance={SAMPLE_WALLET.balance}
          required={SAMPLE_WALLET.required}
          currency={SAMPLE_WALLET.currency}
        />
        <WalletBalanceCard
          balance={4.2}
          required={SAMPLE_WALLET.required}
          state="insufficient"
          onTopUp={() => {}}
        />
        <WalletBalanceCard balance={SAMPLE_WALLET.balance} state="checking" />
      </div>
    ),
  },
  {
    id: 'line-items',
    title: 'LineItemList',
    description:
      'Session summary / receipt breakdown — billed on actual units consumed.',
    render: () => (
      <div style={{ maxWidth: 375 }}>
        <LineItemList
          items={SAMPLE_RECEIPT_ITEMS}
          meta={[
            'Session #VD-20260713-0412',
            'Charger LKV-B2 · Lakeview Residency',
            '13 Jul 2026, 21:14 – 23:56',
          ]}
        />
      </div>
    ),
  },
  {
    id: 'support-card',
    title: 'SupportContextCard',
    description:
      'Failures carry user/charger/session/payment/timestamp context — the user never re-describes what the app already knows.',
    render: () => (
      <div style={{ maxWidth: 375 }}>
        <SupportContextCard
          title="Session ended unexpectedly"
          context={[
            { label: 'Session', value: 'VD-20260713-0412' },
            { label: 'Charger', value: 'LKV-B2' },
            { label: 'Payment', value: 'Pending' },
            { label: 'Time', value: '23:56' },
          ]}
          action={{ label: 'Contact support' }}
        />
      </div>
    ),
  },
];

function DurationDemo() {
  const [minutes, setMinutes] = useState<number | undefined>(120);
  return (
    <DurationSelector
      value={minutes}
      onChange={setMinutes}
      helper={
        minutes
          ? `Needs up to $${((minutes / 60) * 7.4 * 0.32).toFixed(2)} in your wallet (7.4 kW max × $0.32/kWh)`
          : 'Select a duration to see the wallet estimate'
      }
    />
  );
}

function SegmentedDemo() {
  const [value, setValue] = useState('all');
  return (
    <SegmentedControl
      options={[
        { label: 'All sessions', value: 'all' },
        { label: 'This month', value: 'month' },
        { label: 'Failed', value: 'failed' },
      ]}
      value={value}
      onChange={setValue}
    />
  );
}
