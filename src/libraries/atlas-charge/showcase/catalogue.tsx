import React from 'react';
import type { SectionDef } from '../../../playground/Section';
import { VariantMatrix } from '../../../playground/VariantMatrix';
import {
  Accordion,
  ActiveSession,
  Alert,
  AmountSelector,
  AppBar,
  BottomNav,
  Button,
  Chip,
  ChargeIcon,
  Coachmark,
  CommandProgress,
  DetailPanel,
  EmptyState,
  FilterSheet,
  IconButton,
  LaunchGate,
  LegalViewer,
  LocationList,
  MapMarker,
  ModalSheet,
  NamedProgress,
  OrientationCard,
  OtpInput,
  PaymentMethodSelector,
  ProfileForm,
  QrScanner,
  RecordRow,
  RequestChargerForm,
  SearchFilter,
  SelectionControl,
  SessionSummary,
  SettingRow,
  StartReadiness,
  StationCard,
  StatusBadge,
  StatusPanel,
  StepGuide,
  SupportTile,
  TextField,
  TicketForm,
  Toggle,
  WalletCard,
} from '../components';

type Tier = 'atoms' | 'molecules' | 'organisms';
type CatalogueEntry = { number: number; title: string; tier: Tier; section: SectionDef };
const entries: CatalogueEntry[] = [];

const add = (number: number, tier: Tier, title: string, description: string, render: () => React.ReactNode) => {
  entries.push({
    number,
    title,
    tier,
    section: { id: `atlas-charge-${number}`, title, description: `Catalogue ${number} · ${description}`, render, defer: true },
  });
};

const states = (labels: string[], render: (state: string, index: number) => React.ReactNode) => (
  <div className="ac-showcase-grid">{labels.map((state, index) => <div className="ac-showcase-cell" key={state}><small>{state}</small>{render(state, index)}</div>)}</div>
);

// Foundations and interaction primitives.
add(1, 'organisms', 'App bar / navbar', 'Navigation anatomy consolidated into AppBar modes.', () => states(['default', 'back', 'close', 'title-only', 'action', 'scrolled'], (s) => <AppBar title="Charger details" mode={(s === 'scrolled' ? 'back' : s) as never} scrolled={s === 'scrolled'} />));
add(2, 'organisms', 'Bottom navigation', 'Four destinations with active, badge, disabled and focused-task states.', () => states(['active', 'badge', 'disabled', 'hidden'], (s) => <BottomNav active="sessions" state={(s === 'active' ? 'visible' : s) as never} />));
add(3, 'atoms', 'Primary and secondary button', 'Shared Button variants preserve stable dimensions across async states.', () => <VariantMatrix cols={['enabled', 'pressed', 'loading', 'disabled']} rows={(['primary', 'secondary', 'tertiary', 'destructive'] as const).map((variant) => ({ label: variant, cells: ['default', 'pressed', 'loading', 'disabled'].map((state) => <Button variant={variant} state={state as never}>{variant === 'destructive' ? 'Delete account' : 'Continue'}</Button>) }))} />);
add(4, 'atoms', 'Icon button', 'Compact action states retain a 44px accessible target.', () => states(['default', 'pressed', 'selected', 'disabled', 'loading'], (s) => <IconButton icon="star" label={`Favourite ${s}`} state={s as never} />));
add(5, 'atoms', 'Text input', 'Persistent label and recovery copy across the complete field lifecycle.', () => states(['empty', 'focused', 'filled', 'valid', 'error', 'disabled', 'read-only', 'verified'], (s) => <TextField label="Charger ID" value={['filled', 'valid', 'read-only', 'verified'].includes(s) ? 'VC-2048' : ''} state={s as never} message={s === 'error' ? 'Enter the ID printed below the QR code' : undefined} />));
add(6, 'atoms', 'OTP input', 'Fixed-length verification with checking, incorrect, expiry and lock states.', () => states(['empty', 'partial', 'complete', 'checking', 'incorrect', 'expired', 'locked'], (s) => <OtpInput value={s === 'empty' ? '' : s === 'partial' ? '482' : '482915'} state={s as never} countdown={s === 'locked' ? 'Try again in 15 minutes' : undefined} />));
add(7, 'atoms', 'Checkbox / consent row', 'Consent remains independently readable and visibly recoverable.', () => states(['unchecked', 'checked', 'focused', 'error', 'disabled'], (s) => <SelectionControl label="I accept the privacy policy" checked={s === 'checked'} state={(s === 'unchecked' || s === 'checked' ? 'default' : s) as never} />));
add(8, 'atoms', 'Radio / single-selection row', 'The entire row represents one mutually exclusive choice.', () => states(['unselected', 'selected', 'disabled', 'error'], (s) => <SelectionControl type="radio" label="UPI" checked={s === 'selected'} state={(s === 'unselected' || s === 'selected' ? 'default' : s) as never} />));
add(9, 'atoms', 'Toggle', 'Immediate preference feedback includes saving and safe revert failure.', () => states(['off', 'on', 'disabled', 'saving', 'failed'], (s) => <Toggle checked={s === 'on' || s === 'saving'} state={(s === 'off' || s === 'on' ? 'default' : s) as never} label="Critical notifications" />));
add(10, 'atoms', 'Tabs and filter chips', 'One chip component covers selected, pressed, disabled and removable filters.', () => states(['unselected', 'selected', 'pressed', 'disabled', 'removable'], (s) => <Chip selected={s === 'selected' || s === 'pressed'} disabled={s === 'disabled'} removable={s === 'removable'}>Available</Chip>));
add(11, 'molecules', 'Search and filter control', 'Search keeps query, results and recovery context visible.', () => states(['idle', 'focused', 'typing', 'results', 'no-results', 'error', 'offline'], (s) => <SearchFilter state={s as never} query={['typing', 'results', 'no-results'].includes(s) ? 'Indiranagar' : ''} />));
add(12, 'atoms', 'Status tag / badge', 'Words and dots reinforce every semantic state.', () => states(['neutral', 'info', 'success', 'warning', 'danger', 'unknown'], (s) => <StatusBadge tone={s as never}>{s === 'unknown' ? 'Status unknown' : s}</StatusBadge>));
add(13, 'molecules', 'Alert / inline banner', 'Persistent operational feedback supports tone, action and dismissal.', () => states(['info', 'success', 'warning', 'danger'], (s) => <Alert tone={s as never} title={`${s} message`} body="The affected session remains identified." action="Review" dismissible={s === 'info'} />));
add(14, 'organisms', 'Modal / bottom sheet', 'One sheet anatomy covers information, selection, confirmation and destructive review.', () => states(['information', 'selection', 'confirmation', 'destructive', 'loading', 'error'], (s) => <ModalSheet manageFocus={false} variant={(s === 'loading' || s === 'error' ? 'confirmation' : s) as never} state={(s === 'loading' || s === 'error' ? s : 'default') as never} />));
add(15, 'molecules', 'Empty / no-results state', 'Absence is explained without treating every case as an error.', () => states(['first-use', 'filtered', 'search', 'offline', 'failed'], (s) => <EmptyState variant={s as never} title={s === 'first-use' ? 'No saved locations yet' : 'Nothing to show'} />));
add(16, 'atoms', 'Named progress indicator', 'A named step replaces ambiguous spinner-only waiting.', () => states(['in-progress', 'delayed', 'completed', 'failed', 'cancelled', 'unknown'], (s) => <NamedProgress label="Checking charger" state={s as never} />));

// Onboarding, identity, settings and account.
add(17, 'organisms', 'Splash and launch gate', 'Launch blockers retain a clear route forward.', () => states(['checking', 'offline', 'timeout', 'update-required', 'store-failure', 'resumable'], (s) => <LaunchGate state={s as never} />));
add(18, 'molecules', 'Orientation card / carousel', 'Exactly three concise orientation cards with navigation and completion.', () => states(['card 1', 'card 2', 'card 3', 'next', 'back', 'skip', 'completed'], (s, i) => <OrientationCard step={(Math.min(i + 1, 3)) as 1 | 2 | 3} state={s === 'completed' ? 'completed' : 'active'} />));
add(19, 'molecules', 'Coachmark', 'Anchored guidance has a durable dismissed/completed lifecycle.', () => states(['first', 'next', 'dismissed', 'completed', 'target-unavailable'], (s) => <Coachmark state={s as never} />));
add(20, 'molecules', 'Permission primer', 'Benefit precedes OS permission and blocked states lead to Settings.', () => states(['not requested', 'rationale', 'granted', 'denied', 'blocked'], (s) => <StatusPanel kind="permission" state={s} title="Allow location access" detail="Location helps find nearby chargers; manual search remains available." tone={s === 'granted' ? 'success' : s === 'denied' || s === 'blocked' ? 'warning' : 'info'} action={s === 'blocked' ? 'Open settings' : 'Continue'} />));
add(21, 'molecules', 'Account recognition and migration status card', 'Private-safe account recognition and recovery states.', () => states(['checking', 'new', 'recognised', 'migration needed', 'migration failed', 'support required'], (s) => <StatusPanel kind="account" state={s} title={s === 'new' ? 'Welcome to Atlas Charge' : 'Account check'} detail="We use only the verified mobile number to continue safely." tone={s.includes('failed') || s.includes('support') ? 'danger' : s === 'recognised' ? 'success' : 'info'} action={s.includes('failed') || s.includes('support') ? 'Contact support' : undefined} />));
add(22, 'organisms', 'Profile identity form', 'Verified identity stays separate from editable personal data.', () => states(['view', 'edit', 'validating', 'saving', 'saved', 'field-error', 'save-failed', 'verified'], (s) => <ProfileForm state={s as never} />));
add(23, 'molecules', 'Setting / permission row', 'Open rows support toggle, status and system shortcut modes.', () => states(['granted', 'denied', 'blocked', 'saving', 'error'], (s) => <SettingRow title="Camera access" detail="Needed only while scanning" mode={s === 'saving' || s === 'error' ? 'toggle' : 'status'} state={s as never} />));
add(24, 'molecules', 'Critical-notification confirmation', 'Operational consequences remain explicit before disabling.', () => states(['enable', 'disable warning', 'confirmed off', 'system blocked'], (s) => <StatusPanel kind="critical-notification" state={s} title="Charging and payment alerts" detail="These alerts can require immediate action during an active session." tone={s === 'confirmed off' || s === 'system blocked' ? 'warning' : 'info'} action={s === 'system blocked' ? 'Open settings' : 'Continue'} />));
add(25, 'organisms', 'Legal / about viewer', 'Versioned readable content supports cached and failed loads.', () => states(['current', 'updated', 'cached', 'failed', 'update-available'], (s) => <LegalViewer state={s as never} />));
add(26, 'organisms', 'Destructive action review', 'Logout and deletion share anatomy while blockers remain explicit.', () => states(['logout', 'delete eligible', 'blocked', 'verifying', 'processing', 'failed'], (s) => s === 'blocked' ? <StatusPanel kind="account" state="Blocked" title="Account cannot be deleted" detail="Resolve the active charge and pending payment first." tone="warning" action="Review blockers" /> : <ModalSheet manageFocus={false} variant={s === 'logout' ? 'confirmation' : 'destructive'} state={s === 'processing' || s === 'verifying' ? 'loading' : s === 'failed' ? 'error' : 'default'} />));

// Charger discovery and charging.
add(27, 'molecules', 'Station / location card', 'Availability, price and freshness stay in one scan path.', () => states(['available', 'in-use', 'offline', 'maintenance', 'unknown', 'stale', 'loading'], (s) => <StationCard state={(s === 'stale' || s === 'loading' ? 'available' : s) as never} stale={s === 'stale'} loading={s === 'loading'} />));
add(28, 'molecules', 'Map marker and selected-location preview', 'Marker encodes availability with color, count and text.', () => states(['default', 'selected', 'clustered', 'available', 'unavailable', 'unknown'], (s) => <MapMarker state={(s === 'unavailable' || s === 'unknown' ? s : 'available') as never} selected={s === 'selected'} clustered={s === 'clustered'} />));
add(29, 'molecules', 'Charger cluster / location list', 'Expandable grouping preserves mixed, stale and failed states.', () => states(['expanded', 'collapsed', 'mixed', 'unavailable', 'stale', 'empty', 'failed'], (s) => <LocationList state={s as never} />));
add(30, 'molecules', 'Station / charger detail header', 'Identity and freshness precede every start action.', () => states(['loading', 'ready', 'unavailable', 'unknown', 'failed'], (s) => <DetailPanel variant="station-header" state={s} />));
add(31, 'molecules', 'Favourite control and saved-location row', 'Save and Profile-only removal lifecycle.', () => states(['not saved', 'saving', 'saved', 'save failed', 'remove confirm', 'removing', 'removed', 'remove failed'], (s) => <RecordRow kind="saved-location" state={s} title="Indiranagar Hub" meta={s.includes('remove') ? 'Removal is available from Profile only' : '4 chargers · 2 available'} value={s === 'saved' ? 'Saved' : undefined} />));
add(32, 'organisms', 'QR scanner', 'Camera states always retain the manual-ID alternative.', () => states(['requesting', 'ready', 'checking', 'invalid', 'unreadable', 'denied', 'offline', 'timeout'], (s) => <QrScanner state={s as never} />));
add(33, 'molecules', 'Manual charger ID entry', 'Equivalent scan fallback confirms the matched charger.', () => states(['empty', 'typing', 'invalid', 'checking', 'matched', 'not found', 'unavailable', 'offline'], (s) => <div className="ac-manual-entry"><TextField label="Charger ID" value={['typing', 'checking', 'matched', 'unavailable'].includes(s) ? 'VC-2048' : ''} state={(s === 'invalid' || s === 'not found' ? 'error' : s === 'matched' ? 'valid' : s === 'checking' ? 'focused' : 'empty') as never} message={s === 'not found' ? 'No charger matched that ID' : s === 'offline' ? 'Connect to validate this charger' : undefined} />{s === 'matched' && <StationCard />}</div>));
add(34, 'molecules', 'Availability and freshness block', 'Operational status and trust age are inseparable.', () => states(['available fresh', 'in use ageing', 'offline stale', 'maintenance', 'unknown', 'refresh failed'], (s) => <StatusPanel kind="freshness" state={s} title="Charger availability" detail={s.includes('stale') ? 'Last confirmed 24 minutes ago' : 'Last confirmed 2 minutes ago'} tone={s.startsWith('available') ? 'success' : s.includes('offline') || s.includes('failed') ? 'danger' : 'warning'} action={s.includes('stale') || s.includes('failed') ? 'Refresh' : undefined} />));
add(35, 'molecules', 'Charger specification, access and tariff panel', 'Tariff, cable, access and essential amenities before commitment.', () => states(['complete', 'partial', 'price changed', 'unavailable connector', 'BYO cable', 'access unavailable'], (s) => <DetailPanel variant="specification" state={s} />));
add(36, 'molecules', 'Connector selector / list', 'Impossible choices remain disabled with an explanation.', () => states(['available', 'selected', 'occupied', 'incompatible', 'offline', 'unknown'], (s) => <DetailPanel variant="connector" state={s} />));
add(37, 'molecules', 'Duration selector', '30 minutes through 6.5 hours with cost impact.', () => states(['default', 'adjusted', 'minimum', 'maximum', 'price-unavailable', 'value changed'], (s) => <DetailPanel variant="duration" state={s} />));
add(38, 'molecules', 'Wallet readiness card', 'Balance is compared with the estimated requirement.', () => states(['sufficient', 'low', 'zero', 'refreshing', 'shortfall', 'pending', 'unavailable'], (s) => <WalletCard variant="readiness" state={s as never} />));
add(39, 'organisms', 'Start review / readiness gate', 'Explicit start follows a complete readiness review.', () => states(['ready', 'data-changed', 'unavailable', 'insufficient', 'stale', 'starting'], (s) => <StartReadiness state={s as never} />));
add(40, 'molecules', 'Charging command progress', 'The real command sequence identifies exactly where work stopped.', () => states(['checking', 'command sent', 'waiting', 'active', 'delayed', 'failed-retry', 'failed-support', 'cancelled', 'unknown'], (s, i) => <CommandProgress stage={(Math.min(i + 1, 4)) as 1 | 2 | 3 | 4} state={(s === 'checking' || s === 'command sent' || s === 'waiting' || s === 'active' ? 'active' : s) as never} />));
add(41, 'organisms', 'Active-session card and dashboard', 'Reliable metrics, freshness, Stop and Help remain reachable.', () => states(['starting', 'active', 'delayed', 'stale', 'interrupted', 'stopping', 'ending', 'unknown'], (s) => <ActiveSession state={s as never} />));
add(42, 'organisms', 'Stop-charging confirmation', 'Duplicate stop commands are prevented while unresolved.', () => states(['confirm', 'sending', 'acknowledged', 'pending', 'failed', 'already stopped', 'unknown'], (s) => s === 'confirm' ? <ModalSheet manageFocus={false} variant="confirmation" /> : <StatusPanel kind="reconciliation" state={s} title="Stopping charge" detail="The original stop request remains the only active command." tone={s === 'failed' ? 'danger' : s === 'already stopped' ? 'success' : 'info'} action={s === 'failed' ? 'Try again' : undefined} />));
add(43, 'molecules', 'Session end reason and reconciliation card', 'End cause and record finality are distinct.', () => states(['user stopped final', 'vehicle full pending', 'charger interruption corrected', 'network timeout failed'], (s) => <StatusPanel kind="reconciliation" state={s} title="Why charging ended" detail="Energy and payment records may continue reconciling after power stops." tone={s.includes('failed') ? 'danger' : s.includes('pending') ? 'warning' : 'info'} action={s.includes('pending') ? 'View session' : undefined} />));
add(44, 'organisms', 'Session summary, receipt and invoice', 'Provisional values stay visibly provisional.', () => states(['final', 'provisional', 'payment-pending', 'adjusted', 'invoice-unavailable', 'share-failed'], (s) => <SessionSummary state={s as never} />));
add(45, 'molecules', 'Rating and quick feedback', 'Structured feedback remains low effort and recoverable.', () => states(['unanswered', 'positive', 'negative', 'note', 'submitting', 'submitted', 'failed'], (s) => <div className="ac-rating"><h4>How was this charger?</h4><div>{[1,2,3,4,5].map((n) => <button type="button" aria-label={`${n} stars`} key={n} data-selected={(s === 'positive' && n <= 5) || (s === 'negative' && n <= 2)}><ChargeIcon name="star" /></button>)}</div>{s === 'note' && <TextField label="Optional detail" />}{s === 'submitting' && <NamedProgress label="Submitting feedback" />}{s === 'submitted' && <Alert tone="success" title="Thanks for your feedback" />}{s === 'failed' && <Alert tone="danger" title="Feedback not submitted" action="Retry" />}</div>));
add(46, 'molecules', 'Critical event notification and inbox row', 'Every event identifies the affected session, time and safe deep link.', () => states(['foreground', 'push', 'unread', 'read', 'permission blocked', 'stale', 'action failed'], (s) => <RecordRow kind="notification" state={s} title="Charging interrupted" meta="Session SES-842019 · 2 min ago" value={s === 'unread' ? 'New' : undefined} />));

// Wallet, history, vehicles, help and requests.
add(47, 'molecules', 'Wallet balance card', 'Available and pending money are visually distinct.', () => states(['sufficient', 'low', 'zero', 'pending', 'refreshing', 'unavailable'], (s) => <WalletCard state={s as never} />));
add(48, 'molecules', 'Top-up amount selector', 'Quick ₹20/₹30/₹50 values plus validated custom amount.', () => states(['preset', 'custom', 'below-limit', 'above-limit', 'invalid', 'ready'], (s) => <AmountSelector state={s as never} />));
add(49, 'molecules', 'Payment method selector', 'Cards, UPI and Net Banking expose redirects and verification.', () => states(['available', 'selected', 'unavailable', 'loading', 'redirecting', 'verification'], (s) => <PaymentMethodSelector state={s as never} />));
add(50, 'molecules', 'Transaction row', 'Type, time, amount, status and stable ID remain together.', () => states(['credit success', 'debit pending', 'failed', 'reversed', 'adjusted'], (s) => <RecordRow kind="transaction" state={s} title={s.startsWith('credit') ? 'Wallet top-up' : 'Charging payment'} meta={`TXN-20481 · Today, 4:32 pm · ${s}`} value={s.startsWith('credit') ? '+₹500' : '-₹248'} />));
add(51, 'molecules', 'Payment status and reconciliation card', 'Retry appears only when payment state is known to be safe.', () => states(['processing', 'pending', 'retryable failure', 'non-retryable failure', 'cancelled', 'reversed', 'reconciled'], (s) => <StatusPanel kind="payment" state={s} title="Payment status" detail="Transaction TXN-20481 remains attached to session SES-842019." tone={s === 'reconciled' ? 'success' : s.includes('failure') ? 'danger' : s === 'pending' ? 'warning' : 'info'} action={s === 'retryable failure' ? 'Retry payment' : undefined} />));
add(52, 'organisms', 'Filter and sort sheet', 'Active criteria remain visible with Reset and Apply.', () => states(['default', 'selected', 'applied', 'no-results', 'reset'], (s) => <FilterSheet manageFocus={false} state={s as never} />));
add(53, 'molecules', 'Session history row', 'Session and payment statuses remain distinct.', () => states(['completed', 'interrupted', 'payment pending', 'adjusted', 'provisional'], (s) => <RecordRow kind="session" state={s} title="Indiranagar Hub" meta={`12 Aug · 42 min · 13.2 kWh · ${s}`} value="₹248" />));
add(54, 'molecules', 'Vehicle card / list item', 'Optional vehicle setup exposes compatibility-relevant data only.', () => states(['default', 'incomplete', 'editing', 'save failed', 'delete confirm', 'empty'], (s) => s === 'empty' ? <EmptyState title="No vehicles added" body="Vehicle setup is optional." action="Add vehicle" /> : <RecordRow kind="vehicle" state={s} title="Atlas V2 Pro" meta={`CCS2 compatible · ${s}`} />));
add(55, 'molecules', 'FAQ search and accordion', 'Search never loses the current question during recovery.', () => states(['collapsed', 'expanded', 'suggestions', 'results', 'no-results', 'offline'], (s) => <div><SearchFilter state={s === 'offline' ? 'offline' : s === 'no-results' ? 'no-results' : 'results'} query={s === 'collapsed' ? '' : 'start charging'} /><Accordion state={(s === 'expanded' ? 'expanded' : s === 'offline' ? 'offline' : s === 'no-results' ? 'no-results' : 'collapsed') as never} /></div>));
add(56, 'molecules', 'Support method tile', 'Availability and expected response are explicit.', () => states(['available', 'closed', 'launching', 'failed'], (s) => <SupportTile state={s as never} />));
add(57, 'organisms', 'Complaint / ticket form', 'Context is prefilled and drafts survive submission failure.', () => states(['draft', 'validating', 'submitting', 'delayed', 'submitted', 'failed'], (s) => <TicketForm state={s as never} />));
add(58, 'molecules', 'Ticket confirmation and reference', 'Stable ticket identity survives delayed and duplicate responses.', () => states(['submitted', 'delayed', 'duplicate', 'failed', 'status update'], (s) => <StatusPanel kind="ticket" state={s} title="Ticket VC-20481" detail="Support has the session, charger and payment references." tone={s === 'submitted' || s === 'status update' ? 'success' : s === 'failed' ? 'danger' : 'info'} action="Back to session" />));
add(59, 'molecules', 'How-to guide step', 'Numbered task steps retain recovery links.', () => states(['step list', 'current', 'completed', 'action unavailable'], (s) => <div><StepGuide current={s === 'current' ? 2 : 1} completed={s === 'completed'} />{s === 'action unavailable' && <Alert tone="warning" title="This action is unavailable" body="Use manual charger ID entry or contact support." />}</div>));
add(60, 'organisms', 'Request-a-charger form', 'Manageable sections preserve drafts and manual location entry.', () => states(['draft', 'location-denied', 'validation-error', 'saving', 'ready', 'failed'], (s) => <RequestChargerForm state={s as never} />));
add(61, 'organisms', 'Request submission confirmation', 'Expression-of-interest language avoids an installation promise.', () => states(['submitting', 'submitted', 'delayed', 'duplicate', 'failed'], (s) => <RequestChargerForm state={s as never} />));

export const ATLAS_CHARGE_CATALOGUE = entries.map(({ number, title, tier }) => ({ number, title, tier }));
export const ATLAS_CHARGE_ATOM_SECTIONS = entries.filter((entry) => entry.tier === 'atoms').map((entry) => entry.section);
export const ATLAS_CHARGE_MOLECULE_SECTIONS = entries.filter((entry) => entry.tier === 'molecules').map((entry) => entry.section);
export const ATLAS_CHARGE_ORGANISM_SECTIONS = entries.filter((entry) => entry.tier === 'organisms').map((entry) => entry.section);
