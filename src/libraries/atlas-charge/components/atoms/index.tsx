import React from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Switch from '@radix-ui/react-switch';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { ChargeIcon } from '../icons';
import type { ChargeIconName } from '../icons';

export type ChargeActionState = 'default' | 'pressed' | 'loading' | 'disabled';
export type ChargeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'unknown';

export function Button({
  children,
  variant = 'primary',
  width = 'compact',
  state = 'default',
  type = 'button',
  onClick,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  width?: 'compact' | 'full';
  state?: ChargeActionState;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      aria-busy={state === 'loading' || undefined}
      className={`ac-button ac-button--${variant} ac-button--${width}`}
      disabled={state === 'disabled' || state === 'loading'}
      data-state={state}
      type={type}
      onClick={onClick}
    >
      {state === 'loading' && <span className="ac-spinner" aria-hidden />}
      <span>{children}</span>
      {state === 'loading' && <span className="ac-visually-hidden">Loading</span>}
    </button>
  );
}

export function IconButton({
  icon = 'arrow-left',
  label,
  state = 'default',
  onClick,
}: {
  icon?: ChargeIconName;
  label: string;
  state?: ChargeActionState | 'selected';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      className="ac-icon-button"
      data-state={state}
      disabled={state === 'disabled' || state === 'loading'}
      aria-label={label}
      aria-busy={state === 'loading' || undefined}
      aria-pressed={state === 'selected' || undefined}
      title={label}
      type="button"
      onClick={onClick}
    >
      {state === 'loading' ? <span className="ac-spinner" aria-hidden /> : <ChargeIcon name={icon} />}
    </button>
  );
}

export type FieldState = 'empty' | 'focused' | 'filled' | 'valid' | 'error' | 'disabled' | 'read-only' | 'verified';

export function TextField({
  label,
  value,
  defaultValue = '',
  placeholder = 'Enter value',
  message,
  state = 'empty',
  onChange,
  inputMode,
  autoComplete,
}: {
  label: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  message?: string;
  state?: FieldState;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
}) {
  const readOnly = state === 'read-only' || state === 'verified';
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const inputId = React.useId();
  const messageId = `${inputId}-message`;
  return (
    <label className="ac-field" data-state={state}>
      <span className="ac-field__label">{label}</span>
      <span className="ac-field__control">
        <input
          id={inputId}
          value={controlled ? value : internalValue}
          placeholder={placeholder}
          readOnly={readOnly || (controlled && !onChange)}
          disabled={state === 'disabled'}
          aria-invalid={state === 'error'}
          aria-describedby={message ? messageId : undefined}
          data-simulated-focus={state === 'focused' || undefined}
          inputMode={inputMode}
          autoComplete={autoComplete}
          onChange={(event) => {
            if (!controlled) setInternalValue(event.currentTarget.value);
            onChange?.(event);
          }}
        />
        {(state === 'verified' || state === 'valid') && <span className="ac-field__mark"><ChargeIcon name="check" label="Verified" /></span>}
        {readOnly && state === 'read-only' && <span className="ac-field__mark"><ChargeIcon name="lock" label="Read only" /></span>}
      </span>
      {message && <span id={messageId} className="ac-field__message" role={state === 'error' ? 'alert' : undefined}>{message}</span>}
    </label>
  );
}

export function OtpInput({
  value,
  defaultValue = '',
  length = 6,
  state = 'empty',
  countdown,
  onChange,
}: {
  value?: string;
  defaultValue?: string;
  length?: number;
  state?: 'empty' | 'partial' | 'complete' | 'checking' | 'incorrect' | 'expired' | 'locked';
  countdown?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const helpId = React.useId();
  const safeLength = Math.min(8, Math.max(1, Math.trunc(length)));
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = controlled ? value : internalValue;
  return (
    <div className="ac-otp" data-state={state}>
      <input
        className="ac-otp__input"
        aria-label="Verification code"
        aria-describedby={helpId}
        aria-invalid={state === 'incorrect' || state === 'expired'}
        autoComplete="one-time-code"
        inputMode="numeric"
        maxLength={safeLength}
        value={currentValue}
        readOnly={controlled && !onChange}
        disabled={state === 'locked' || state === 'checking'}
        onChange={(event) => {
          const nextValue = event.currentTarget.value.replace(/\D/g, '').slice(0, safeLength);
          event.currentTarget.value = nextValue;
          if (!controlled) setInternalValue(nextValue);
          onChange?.(event);
        }}
      />
      <div className="ac-otp__cells" aria-hidden>
        {Array.from({ length: safeLength }, (_, index) => <span key={index}>{currentValue[index] ?? ''}</span>)}
      </div>
      <small id={helpId} aria-live="polite">{state === 'incorrect' ? 'That code is incorrect. Try again.' : state === 'expired' ? 'Code expired. Request a new one.' : state === 'checking' ? 'Checking code…' : countdown ?? 'Paste or enter the verification code'}</small>
    </div>
  );
}

export function SelectionControl({
  type = 'checkbox',
  label,
  checked,
  defaultChecked = false,
  state = 'default',
  name,
  onCheckedChange,
}: {
  type?: 'checkbox' | 'radio';
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  state?: 'default' | 'focused' | 'error' | 'disabled';
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const controlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const currentChecked = controlled ? checked : internalChecked;
  const updateChecked = (next: boolean) => {
    if (!controlled) setInternalChecked(next);
    onCheckedChange?.(next);
  };
  if (type === 'radio') {
    return (
      <RadioGroup.Root className="ac-selection-group" name={name} value={currentChecked ? 'selected' : ''} onValueChange={(value) => updateChecked(value === 'selected')} disabled={state === 'disabled'}>
        <label className="ac-selection" data-status={state}>
          <RadioGroup.Item className="ac-selection__mark" value="selected" aria-invalid={state === 'error' || undefined}>
            <RadioGroup.Indicator className="ac-selection__indicator"><ChargeIcon name="circle" strokeWidth={3} /></RadioGroup.Indicator>
          </RadioGroup.Item>
          <span>{label}</span>
        </label>
      </RadioGroup.Root>
    );
  }
  return (
    <label className="ac-selection" data-status={state}>
      <Checkbox.Root className="ac-selection__mark" checked={currentChecked} disabled={state === 'disabled'} aria-invalid={state === 'error' || undefined} onCheckedChange={(next) => updateChecked(next === true)}>
        <Checkbox.Indicator className="ac-selection__indicator"><ChargeIcon name="check" /></Checkbox.Indicator>
      </Checkbox.Root>
      <span>{label}</span>
    </label>
  );
}

export function Toggle({
  checked,
  defaultChecked = false,
  state = 'default',
  label = 'Setting',
  onChange,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  state?: 'default' | 'saving' | 'failed' | 'disabled';
  label?: string;
  onChange?: (checked: boolean) => void;
}) {
  const controlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const currentChecked = controlled ? checked : internalChecked;
  return (
    <Switch.Root className="ac-toggle" checked={currentChecked} aria-busy={state === 'saving' || undefined} aria-label={label} data-status={state} disabled={state === 'disabled' || state === 'saving'} onCheckedChange={(next) => { if (!controlled) setInternalChecked(next); onChange?.(next); }}>
      <Switch.Thumb className="ac-toggle__thumb" />
    </Switch.Root>
  );
}

export function Chip({
  children,
  selected = false,
  removable = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  selected?: boolean;
  removable?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return <TogglePrimitive.Root className="ac-chip" pressed={selected} data-selected={selected} disabled={disabled} onClick={onClick}>{children}{removable && <ChargeIcon name="close" />}</TogglePrimitive.Root>;
}

export function StatusBadge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: ChargeTone;
}) {
  return <span className={`ac-status ac-tone--${tone}`}><ChargeIcon name="circle" />{children}</span>;
}

export function NamedProgress({
  label,
  state = 'in-progress',
}: {
  label: string;
  state?: 'in-progress' | 'delayed' | 'completed' | 'failed' | 'cancelled' | 'unknown';
}) {
  const icon: ChargeIconName = state === 'completed' ? 'check' : state === 'failed' ? 'error' : state === 'cancelled' ? 'close' : state === 'delayed' ? 'clock' : state === 'unknown' ? 'help' : 'loading';
  return (
    <div className="ac-named-progress" data-state={state} role="status" aria-live="polite">
      <span className="ac-named-progress__icon" aria-hidden><ChargeIcon name={icon} /></span>
      <span><strong>{label}</strong><small>{state.replace('-', ' ')}</small></span>
    </div>
  );
}
