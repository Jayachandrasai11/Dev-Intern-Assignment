export interface SegmentedOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange?: (value: string) => void;
}

/** Inline view switcher — history filters, summary sections. */
export function SegmentedControl({
  options,
  value,
  onChange,
}: SegmentedControlProps) {
  return (
    <div className="ev-segmented" role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`ev-segmented__option${
            o.value === value ? ' ev-segmented__option--active' : ''
          }`}
          aria-pressed={o.value === value}
          onClick={() => onChange?.(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
