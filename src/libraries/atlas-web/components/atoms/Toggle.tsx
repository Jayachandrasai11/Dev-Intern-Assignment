import { useState } from 'react';

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

export function Toggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  ...rest
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked ?? internal;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      className="atlas-toggle"
      data-state={on ? 'on' : 'off'}
      onClick={() => {
        const next = !on;
        setInternal(next);
        onCheckedChange?.(next);
      }}
      {...rest}
    >
      <span className="atlas-toggle__thumb" />
    </button>
  );
}
