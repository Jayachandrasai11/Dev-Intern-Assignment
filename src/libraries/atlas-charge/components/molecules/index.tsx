import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Slider from '@radix-ui/react-slider';
import { Button, Chip, IconButton, NamedProgress, StatusBadge, TextField, Toggle } from '../atoms';
import type { ChargeTone } from '../atoms';
import { ChargeIcon } from '../icons';

export function AppBar({ title, mode = 'back', scrolled = false, onBack, onClose, onAction }: { title: string; mode?: 'default' | 'back' | 'close' | 'title-only' | 'action'; scrolled?: boolean; onBack?: () => void; onClose?: () => void; onAction?: () => void }) {
  return <header className="ac-appbar" data-scrolled={scrolled}><span>{mode === 'back' ? <IconButton label="Back" onClick={onBack} /> : mode === 'close' ? <IconButton icon="close" label="Close" onClick={onClose} /> : null}</span><strong>{title}</strong><span>{mode === 'action' ? <button className="ac-text-action" type="button" onClick={onAction}>Edit</button> : null}</span></header>;
}

export function SearchFilter({ state = 'idle', query, defaultQuery = '', onChange, onFilter }: { state?: 'idle' | 'focused' | 'typing' | 'results' | 'no-results' | 'error' | 'offline'; query?: string; defaultQuery?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; onFilter?: () => void }) {
  const controlled = query !== undefined;
  const [internalQuery, setInternalQuery] = React.useState(defaultQuery);
  const statusId = React.useId();
  const hasStatus = state === 'offline' || state === 'no-results' || state === 'error';
  return <div className="ac-search" data-state={state}><ChargeIcon name="search" size={20} /><input value={controlled ? query : internalQuery} readOnly={controlled && !onChange} onChange={(event) => { if (!controlled) setInternalQuery(event.currentTarget.value); onChange?.(event); }} disabled={state === 'offline'} aria-label="Search" aria-invalid={state === 'error' || undefined} aria-describedby={hasStatus ? statusId : undefined} placeholder="Search chargers, sessions or help" /><IconButton icon="filter" label="Filters" onClick={onFilter} /><small id={statusId} aria-live="polite">{state === 'offline' ? 'Search is unavailable offline' : state === 'no-results' ? 'No matching results' : state === 'error' ? 'Could not load results. Try again.' : ''}</small></div>;
}

export function Alert({ tone = 'info', title, body, action, dismissible = false, onAction, onDismiss }: { tone?: Exclude<ChargeTone, 'neutral' | 'unknown'>; title: string; body?: string; action?: string; dismissible?: boolean; onAction?: () => void; onDismiss?: () => void }) {
  return <aside className={`ac-alert ac-tone--${tone}`} role={tone === 'danger' ? 'alert' : 'status'} aria-live={tone === 'danger' ? 'assertive' : 'polite'}><span className="ac-alert__icon" aria-hidden><ChargeIcon name={tone === 'success' ? 'check' : tone === 'warning' ? 'warning' : tone === 'danger' ? 'error' : 'info'} /></span><span><strong>{title}</strong>{body && <small>{body}</small>}</span>{action && <button type="button" onClick={onAction}>{action}</button>}{dismissible && <IconButton icon="close" label={`Dismiss ${title}`} onClick={onDismiss} />}</aside>;
}

export function EmptyState({ variant = 'first-use', title = 'Nothing here yet', body = 'Your activity will appear here.', action = 'Get started' }: { variant?: 'first-use' | 'filtered' | 'search' | 'offline' | 'failed'; title?: string; body?: string; action?: string }) {
  return <div className="ac-empty" data-variant={variant}><span className="ac-empty__symbol" aria-hidden><ChargeIcon name={variant === 'offline' ? 'offline' : variant === 'failed' ? 'error' : variant === 'search' || variant === 'filtered' ? 'search' : 'empty'} /></span><h4>{title}</h4><p>{body}</p><Button variant="secondary">{action}</Button></div>;
}

export function OrientationCard({ step = 1, state = 'active' }: { step?: 1 | 2 | 3; state?: 'active' | 'completed' }) {
  const content = [
    ['Find a charger with confidence', 'See availability and when it was last confirmed.'],
    ['Scan or enter the charger ID', 'You always have an equivalent manual path.'],
    ['Stay informed while charging', 'Every command shows its named stage and recovery.'],
  ][step - 1];
  return <article className="ac-orientation" data-state={state}><div className="ac-orientation__media" aria-hidden><span>Atlas<br />CHARGE</span><i /></div><span>{state === 'completed' ? 'Orientation complete' : `${step} of 3`}</span><h4>{state === 'completed' ? 'You are ready to charge' : content[0]}</h4><p>{state === 'completed' ? 'Find a charger or scan its code when you are ready.' : content[1]}</p><div className="ac-orientation__actions"><Button variant="tertiary" state={step === 1 ? 'disabled' : 'default'}>Back</Button><Button variant="tertiary">Skip</Button><Button>{step === 3 || state === 'completed' ? 'Done' : 'Next'}</Button></div></article>;
}

export function Coachmark({ state = 'first', text = 'Tap a charger to inspect availability.', onSkip, onNext }: { state?: 'first' | 'next' | 'dismissed' | 'completed' | 'target-unavailable'; text?: string; onSkip?: () => void; onNext?: () => void }) {
  if (state === 'dismissed' || state === 'completed') return null;
  return <aside className="ac-coachmark" data-state={state} role="status"><strong>{state === 'target-unavailable' ? 'This tip is unavailable. Skip this step or continue.' : text}</strong><div><button type="button" onClick={onSkip}>Skip</button><button type="button" onClick={onNext}>Next</button></div></aside>;
}

export type StatusPanelKind = 'permission' | 'account' | 'critical-notification' | 'freshness' | 'reconciliation' | 'payment' | 'ticket' | 'request';
export function StatusPanel({ kind, state, title, detail, tone = 'neutral', action }: { kind: StatusPanelKind; state: string; title: string; detail: string; tone?: ChargeTone; action?: string }) {
  return <article className={`ac-status-panel ac-tone--${tone}`} data-kind={kind}><div><StatusBadge tone={tone}>{state}</StatusBadge><h4>{title}</h4><p>{detail}</p></div>{action && <Button variant="secondary">{action}</Button>}</article>;
}

export function SettingRow({ title, detail, mode = 'chevron', state = 'default', onSelect }: { title: string; detail?: string; mode?: 'chevron' | 'toggle' | 'status'; state?: 'default' | 'granted' | 'denied' | 'blocked' | 'saving' | 'error'; onSelect?: () => void }) {
  const content = <><span><strong>{title}</strong>{detail && <small>{detail}</small>}</span>{mode === 'toggle' ? <Toggle defaultChecked={state === 'granted'} state={state === 'saving' ? 'saving' : state === 'error' ? 'failed' : 'default'} label={title} /> : mode === 'status' ? <StatusBadge tone={state === 'granted' ? 'success' : state === 'blocked' || state === 'denied' ? 'warning' : 'neutral'}>{state}</StatusBadge> : <ChargeIcon name="arrow-right" />}</>;
  return mode === 'chevron'
    ? <button className="ac-setting-row" data-state={state} type="button" onClick={onSelect}>{content}</button>
    : <div className="ac-setting-row" data-state={state}>{content}</div>;
}

export function StationCard({ state = 'available', stale = false, loading = false, onSelect }: { state?: 'available' | 'in-use' | 'offline' | 'maintenance' | 'unknown'; stale?: boolean; loading?: boolean; onSelect?: () => void }) {
  const tone: ChargeTone = loading ? 'unknown' : state === 'available' ? 'success' : state === 'in-use' ? 'info' : state === 'maintenance' ? 'warning' : state === 'offline' ? 'danger' : 'unknown';
  return <article className="ac-station-card" data-loading={loading} aria-busy={loading || undefined}><div className="ac-station-card__media" aria-hidden><ChargeIcon name="flash" /></div><div><StatusBadge tone={tone}>{loading ? 'Loading status' : state.replace('-', ' ')}</StatusBadge><h4>Atlas Community Charger</h4><p>Indiranagar · 1.2 km</p><small>{loading ? 'Availability and tariff are updating' : 'CCS2 · 60 kW · ₹18/kWh'}</small></div>{onSelect ? <button className="ac-station-card__distance" type="button" onClick={onSelect} aria-label="View Atlas Community Charger, 1.2 kilometres away">1.2 km</button> : <span className="ac-station-card__distance">1.2 km</span>}{stale && <Alert tone="warning" title="Status may be out of date" body="Updated 18 min ago" action="Refresh" />}</article>;
}

export function MapMarker({ state = 'available', selected = false, clustered = false, onSelect }: { state?: 'available' | 'unavailable' | 'unknown'; selected?: boolean; clustered?: boolean; onSelect?: () => void }) {
  const label = clustered ? `6 chargers, ${state}` : `60 kilowatt charger, ${state}`;
  return <button className="ac-map-marker" type="button" data-state={state} data-selected={selected} aria-pressed={selected} aria-label={label} onClick={onSelect}><strong>{clustered ? '6' : '3'}</strong><small>{clustered ? 'chargers' : '60 kW'}</small></button>;
}

export function RecordRow({ kind, state = 'default', title, meta, value, onSelect }: { kind: 'saved-location' | 'notification' | 'transaction' | 'session' | 'vehicle'; state?: string; title: string; meta: string; value?: string; onSelect?: () => void }) {
  const tone: ChargeTone = state.includes('fail') || state.includes('interrupt') ? 'danger' : state.includes('pending') || state.includes('confirm') || state.includes('incomplete') ? 'warning' : state.includes('saved') || state.includes('success') || state.includes('completed') || state === 'read' ? 'success' : 'neutral';
  const content = <><span className="ac-record-row__icon" aria-hidden><ChargeIcon name={kind === 'vehicle' ? 'car' : kind === 'notification' ? 'notification' : kind === 'transaction' ? 'payment' : kind === 'saved-location' ? 'location' : 'flash'} /></span><span><strong>{title}</strong><small>{meta}</small></span>{value ? <b>{value}</b> : state !== 'default' && <StatusBadge tone={tone}>{state}</StatusBadge>}{onSelect && <ChargeIcon name="arrow-right" />}</>;
  return onSelect ? <button className="ac-record-row" type="button" data-kind={kind} data-state={state} onClick={onSelect}>{content}</button> : <div className="ac-record-row" data-kind={kind} data-state={state}>{content}</div>;
}

export function LocationList({ state = 'expanded' }: { state?: 'expanded' | 'collapsed' | 'mixed' | 'unavailable' | 'stale' | 'empty' | 'failed' }) {
  const contentId = React.useId();
  const expanded = state !== 'collapsed';
  return <article className="ac-location-list"><header><span><h4>Indiranagar Hub</h4><small>4 chargers · 2 available</small></span><button type="button" aria-expanded={expanded} aria-controls={contentId}>{expanded ? 'Hide' : 'Show'}</button></header><div id={contentId}>{state === 'empty' ? <EmptyState variant="filtered" title="No chargers here" action="Clear filters" /> : state === 'failed' ? <Alert tone="danger" title="Could not load chargers" action="Retry" /> : expanded && <><RecordRow kind="saved-location" title="Charger A-01" meta="Available · 60 kW" /><RecordRow kind="saved-location" title="Charger A-02" meta={state === 'stale' ? 'Unknown · updated 24 min ago' : 'In use · 30 kW'} /></>}</div></article>;
}

export function DetailPanel({ variant, state = 'complete' }: { variant: 'station-header' | 'specification' | 'connector' | 'duration'; state?: string }) {
  if (variant === 'connector') {
    const selected = state === 'selected';
    const unavailable = state === 'offline' || state === 'unknown';
    return <div className="ac-option-list" data-state={state}><h4>Choose a connector</h4>{['CCS2 · 60 kW', 'Type 2 · 22 kW', 'CHAdeMO · incompatible'].map((label, index) => <button type="button" key={label} aria-pressed={selected && index === 0} data-selected={selected && index === 0} disabled={unavailable || index === 2 || (state === 'occupied' && index === 1)}><span>{label}<small>{state === 'offline' ? 'Charger is offline' : state === 'unknown' ? 'Status unavailable' : index === 2 ? 'Not compatible with your vehicle' : 'Cable status confirmed 2 min ago'}</small></span><StatusBadge tone={unavailable ? 'unknown' : index === 0 ? 'success' : index === 1 ? 'warning' : 'unknown'}>{unavailable ? state : index === 0 ? selected ? 'selected' : 'available' : index === 1 ? 'occupied' : 'incompatible'}</StatusBadge></button>)}</div>;
  }
  if (variant === 'duration') {
    const value = state === 'maximum' ? 13 : state === 'minimum' ? 1 : 4;
    return <div className="ac-duration"><header><h4>Planned duration</h4><strong>{state === 'maximum' ? '6 h 30 min' : state === 'minimum' ? '30 min' : '2 h'}</strong></header><Slider.Root className="ac-slider" aria-label="Planned duration" min={1} max={13} step={1} defaultValue={[value]}><Slider.Track className="ac-slider__track"><Slider.Range className="ac-slider__range" /></Slider.Track><Slider.Thumb className="ac-slider__thumb" /></Slider.Root><small>{state === 'price-unavailable' ? 'Estimated cost unavailable' : 'Estimated charging cost ₹144'}</small></div>;
  }
  return <article className="ac-detail-panel" data-state={state}><header><StatusBadge tone={state === 'unavailable' ? 'danger' : state === 'unknown' ? 'unknown' : 'success'}>{state}</StatusBadge><h4>{variant === 'station-header' ? 'Atlas Community Charger' : 'Charging details'}</h4><p>{variant === 'station-header' ? 'CHG-2048 · Indiranagar · 1.2 km' : 'CCS2 · 60 kW · Bring your own cable'}</p></header><dl><div><dt>Tariff</dt><dd>₹18/kWh + tax</dd></div><div><dt>Access</dt><dd>Open 24 hours</dd></div><div><dt>Updated</dt><dd>2 min ago</dd></div></dl></article>;
}

export function WalletCard({ variant = 'balance', state = 'sufficient' }: { variant?: 'readiness' | 'balance'; state?: 'sufficient' | 'low' | 'zero' | 'refreshing' | 'shortfall' | 'pending' | 'unavailable' }) {
  const balance = state === 'zero' ? '₹0' : state === 'unavailable' ? '—' : '₹420';
  return <article className="ac-wallet-card" data-state={state}><span>{variant === 'readiness' ? 'Wallet readiness' : 'Available balance'}</span><strong>{balance}</strong><p>{state === 'shortfall' || state === 'low' ? 'Estimated need ₹520 · short by ₹100' : state === 'pending' ? '₹200 top-up pending' : state === 'refreshing' ? 'Refreshing balance…' : 'Enough for the planned session'}</p><Button variant={state === 'shortfall' || state === 'zero' ? 'primary' : 'secondary'}>{variant === 'readiness' ? 'Top up' : 'Add funds'}</Button></article>;
}

export function CommandProgress({ stage = 1, state = 'active' }: { stage?: 1 | 2 | 3 | 4; state?: 'active' | 'delayed' | 'failed-retry' | 'failed-support' | 'cancelled' | 'unknown' }) {
  const stages = ['Checking charger', 'Command sent', 'Waiting for power', 'Charging active'];
  return <div className="ac-command-progress">{stages.map((label, index) => <NamedProgress key={label} label={label} state={index + 1 < stage ? 'completed' : index + 1 === stage ? state === 'active' ? 'in-progress' : state === 'delayed' ? 'delayed' : state.startsWith('failed') ? 'failed' : state === 'cancelled' ? 'cancelled' : 'unknown' : 'unknown'} />)}{state === 'failed-retry' && <Button variant="secondary">Try again</Button>}{state === 'failed-support' && <Button variant="secondary">Contact support</Button>}</div>;
}

export function AmountSelector({ state = 'preset' }: { state?: 'preset' | 'custom' | 'below-limit' | 'above-limit' | 'invalid' | 'ready' }) {
  return <div className="ac-amount"><h4>Add funds</h4><div>{['₹20', '₹30', '₹50'].map((v, i) => <Chip key={v} selected={state === 'preset' && i === 1}>{v}</Chip>)}</div><TextField label="Custom amount" value={state === 'custom' ? '120' : state === 'invalid' ? '-20' : ''} state={state === 'invalid' || state === 'below-limit' || state === 'above-limit' ? 'error' : 'empty'} message={state === 'below-limit' ? 'Minimum top-up is ₹20' : state === 'above-limit' ? 'Maximum top-up exceeded' : state === 'invalid' ? 'Enter a valid amount' : undefined} /></div>;
}

export function PaymentMethodSelector({ state = 'available' }: { state?: 'available' | 'selected' | 'unavailable' | 'loading' | 'redirecting' | 'verification' }) {
  const selected = state === 'selected' ? 'upi' : undefined;
  return <div className="ac-option-list" data-state={state} aria-busy={state === 'loading' || state === 'redirecting' || undefined}><h4>Payment method</h4><RadioGroup.Root className="ac-payment-methods" defaultValue={selected} aria-label="Payment method">{['UPI', 'Card', 'Net Banking'].map((method, index) => { const value = method.toLowerCase().replace(' ', '-'); return <RadioGroup.Item className="ac-option-list__option" value={value} key={method} disabled={state === 'loading' || state === 'redirecting' || (state === 'unavailable' && index === 2)}><span className="ac-option-list__icon" aria-hidden><ChargeIcon name={state === 'loading' && index === 0 ? 'loading' : index === 2 ? 'bank' : 'payment'} /></span><span><strong>{method}</strong><small>{index === 0 ? 'Fast and secure' : index === 1 ? 'Additional verification may apply' : 'Redirects to your bank'}</small></span><RadioGroup.Indicator className="ac-option-list__indicator"><ChargeIcon name="check" /></RadioGroup.Indicator></RadioGroup.Item>; })}</RadioGroup.Root>{state === 'loading' && <NamedProgress label="Loading payment methods" />}{state === 'redirecting' && <NamedProgress label="Opening your bank" state="in-progress" />}{state === 'verification' && <Alert tone="warning" title="Additional verification required" body="Your bank will ask you to confirm this payment." />}{state === 'unavailable' && <Alert tone="danger" title="Net Banking unavailable" body="Choose UPI or Card to continue." />}</div>;
}

export function Accordion({ title = 'How do I start charging?', state = 'collapsed' }: { title?: string; state?: 'collapsed' | 'expanded' | 'offline' | 'no-results' }) {
  const open = state !== 'collapsed';
  return <AccordionPrimitive.Root className="ac-accordion" type="single" collapsible defaultValue={open ? 'item' : undefined}><AccordionPrimitive.Item value="item"><AccordionPrimitive.Header><AccordionPrimitive.Trigger>{title}<ChargeIcon name="plus" /></AccordionPrimitive.Trigger></AccordionPrimitive.Header><AccordionPrimitive.Content><p>{state === 'offline' ? 'Help content is unavailable offline.' : state === 'no-results' ? 'No answer matched your search.' : 'Scan the QR code or enter the charger ID, review availability and tariff, then explicitly start charging.'}</p></AccordionPrimitive.Content></AccordionPrimitive.Item></AccordionPrimitive.Root>;
}

export function SupportTile({ method = 'chat', state = 'available', onSelect }: { method?: 'chat' | 'call' | 'email'; state?: 'available' | 'closed' | 'launching' | 'failed'; onSelect?: () => void }) {
  return <button className="ac-support-tile" type="button" data-state={state} aria-busy={state === 'launching' || undefined} disabled={state === 'closed' || state === 'launching'} onClick={onSelect}><span aria-hidden><ChargeIcon name={state === 'launching' ? 'loading' : method === 'call' ? 'phone' : method === 'email' ? 'email' : 'chat'} /></span><strong>{method === 'chat' ? 'Chat with support' : method === 'call' ? 'Call support' : 'Email support'}</strong><small>{state === 'closed' ? 'Available tomorrow at 8:00' : state === 'failed' ? 'Could not open this method. Try again.' : state === 'launching' ? 'Opening support…' : 'Usually responds within 5 minutes'}</small></button>;
}

export function StepGuide({ current = 1, completed = false }: { current?: number; completed?: boolean }) {
  return <ol className="ac-step-guide">{['Open the charger port', 'Connect the cable firmly', 'Scan or enter the charger ID'].map((step, index) => { const complete = completed || current > index + 1; return <li key={step} data-current={current === index + 1} data-complete={complete}><span>{complete ? <ChargeIcon name="check" /> : index + 1}</span><strong>{step}</strong></li>; })}</ol>;
}
