import React, { useRef, useState } from 'react';

export interface CodeInputProps {
  /** Number of character cells (4–8 covers OTP and charger codes). */
  length?: number;
  /** numeric = OTP login; alphanumeric = manual charger codes (A–Z, 0–9, -). */
  mode?: 'numeric' | 'alphanumeric';
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  'aria-label'?: string;
}

/** Segmented code entry backed by ONE real input (native paste, OTP
 *  autofill, and focus handling stay intact); the cells are presentation. */
export function CodeInput({
  length = 6,
  mode = 'numeric',
  value,
  onChange,
  error,
  disabled,
  autoFocus,
  'aria-label': ariaLabel,
}: CodeInputProps) {
  const [inner, setInner] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const code = (value ?? inner).slice(0, length);
  const activeIndex = Math.min(code.length, length - 1);

  const sanitize = (raw: string) =>
    (mode === 'numeric'
      ? raw.replace(/\D/g, '')
      : raw.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase()
    ).slice(0, length);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = sanitize(e.target.value);
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  return (
    <span
      className={[
        'ev-code-input',
        error ? 'ev-code-input--error' : '',
        disabled ? 'ev-code-input--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        className="ev-code-input__field"
        value={code}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        autoFocus={autoFocus}
        inputMode={mode === 'numeric' ? 'numeric' : 'text'}
        autoComplete={mode === 'numeric' ? 'one-time-code' : 'off'}
        autoCapitalize="characters"
        spellCheck={false}
        aria-label={
          ariaLabel ?? (mode === 'numeric' ? 'One-time code' : 'Charger code')
        }
      />
      {Array.from({ length }, (_, i) => (
        <span
          key={i}
          className={[
            'ev-code-input__cell',
            focused && i === activeIndex ? 'ev-code-input__cell--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden
        >
          {code[i] ?? ''}
        </span>
      ))}
    </span>
  );
}
