import { useEffect, useState } from 'react';
import { Switch } from '../components/atoms';
import { useTheme } from '../theme/useTheme';
import { PRESETS } from '../theme/presets';
import type { BrandDefinition as Preset } from '../tokens/brand';
import type {
  BrandDefinition,
  GrayTint,
  RadiusChoice,
  ScalingChoice,
} from '../tokens/brand';
import { isValidHex, normalizeHex } from '../tokens/brand';

const GRAY_TINTS: GrayTint[] = ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand'];
const RADII: RadiusChoice[] = ['none', 'small', 'medium', 'large', 'full'];
const SCALES: ScalingChoice[] = [0.9, 0.95, 1, 1.05, 1.1];
const FONTS: Array<{ label: string; stack: string }> = [
  { label: 'System', stack: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
  { label: 'Humanist', stack: "'Helvetica Neue', Arial, sans-serif" },
  { label: 'Geometric', stack: "'Avenir Next', 'Trebuchet MS', sans-serif" },
];

export function ThemePanel({
  onExport,
  presets = PRESETS,
}: {
  onExport?: () => void;
  /** Brand presets of the active UI library. */
  presets?: Preset[];
}) {
  const { brand, setBrand, appearance, setAppearance, layers, emitted } =
    useTheme();
  const [open, setOpen] = useState(true);
  const [hexInput, setHexInput] = useState(brand.accentHex);
  const [copied, setCopied] = useState(false);

  useEffect(() => setHexInput(brand.accentHex), [brand.accentHex]);

  const hexValid = isValidHex(hexInput);

  const patch = (p: Partial<BrandDefinition>) =>
    setBrand({ ...brand, name: 'Custom', ...p });

  const onHexChange = (v: string) => {
    setHexInput(v);
    // A custom accent applies to both modes — drop any preset-carried
    // dark-mode override so the picked color is what renders everywhere.
    if (isValidHex(v))
      patch({ accentHex: normalizeHex(v), darkAccentHex: undefined });
  };

  const semantic = layers.find((l) => l.layer === 'semantic');
  const scale = Array.from({ length: 12 }, (_, i) => {
    const def = semantic?.tokens.find((t) => t.path === `accent.${i + 1}`);
    return String(def?.modes?.[appearance] ?? '');
  });

  const copyCss = async () => {
    const block = (vars: Record<string, string>, indent = '  ') =>
      Object.entries(vars)
        .map(([k, v]) => `${indent}${k}: ${v};`)
        .join('\n');
    const css = [
      `:root {\n${block({ ...emitted.base, ...emitted.light })}\n}`,
      `.dark {\n${block(emitted.dark)}\n}`,
    ].join('\n\n');
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!open) {
    return (
      <button
        className="tp-fab"
        onClick={() => setOpen(true)}
        aria-label="Open theme panel"
      >
        <PaletteIcon />
      </button>
    );
  }

  return (
    <aside className="tp" aria-label="Theme panel">
      <header className="tp__header">
        <h2>Brand layer</h2>
        <button
          className="tp__collapse"
          onClick={() => setOpen(false)}
          aria-label="Collapse theme panel"
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M9 6 l6 6 -6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="tp__field tp__field--row">
        <label>Appearance</label>
        <div className="tp__appearance">
          <span>Light</span>
          <Switch
            checked={appearance === 'dark'}
            onCheckedChange={(c) => setAppearance(c ? 'dark' : 'light')}
            aria-label="Dark mode"
          />
          <span>Dark</span>
        </div>
      </div>

      <div className="tp__field">
        <label>Brand preset</label>
        <div className="tp__presets">
          {presets.map((p) => (
            <button
              key={p.name}
              className={`tp__preset${brand.name === p.name ? ' tp__preset--active' : ''}`}
              onClick={() => setBrand(p)}
            >
              <span
                className="tp__preset-swatch"
                style={{ background: p.accentHex }}
              />
              {p.name}
            </button>
          ))}
          {brand.name === 'Custom' && (
            <span className="tp__preset tp__preset--custom">Custom</span>
          )}
        </div>
      </div>

      <div className="tp__field">
        <label htmlFor="tp-hex">Accent color</label>
        <div className="tp__hex-row">
          <input
            type="color"
            className="tp__color-well"
            value={hexValid ? normalizeHex(hexInput) : brand.accentHex}
            onChange={(e) => onHexChange(e.target.value)}
            aria-label="Pick accent color"
          />
          <input
            id="tp-hex"
            className={`tp__hex${hexValid ? '' : ' tp__hex--invalid'}`}
            value={hexInput}
            onChange={(e) => onHexChange(e.target.value)}
            spellCheck={false}
          />
        </div>
        {!hexValid && (
          <p className="tp__error">Invalid hex — keeping last valid color</p>
        )}
        <div className="tp__scale" aria-label="Generated 12-step scale">
          {scale.map((c, i) => (
            <span key={i} title={`accent.${i + 1} = ${c}`} style={{ background: c }} />
          ))}
        </div>
      </div>

      <div className="tp__field">
        <label>Gray tint</label>
        <div className="tp__segment">
          {GRAY_TINTS.map((g) => (
            <button
              key={g}
              className={brand.grayTint === g ? 'active' : ''}
              onClick={() => patch({ grayTint: g })}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="tp__field">
        <label>Radius</label>
        <div className="tp__segment">
          {RADII.map((r) => (
            <button
              key={r}
              className={brand.radius === r ? 'active' : ''}
              onClick={() => patch({ radius: r })}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="tp__field">
        <label>Scaling</label>
        <div className="tp__segment">
          {SCALES.map((s) => (
            <button
              key={s}
              className={brand.scaling === s ? 'active' : ''}
              onClick={() => patch({ scaling: s })}
            >
              {Math.round(s * 100)}%
            </button>
          ))}
        </div>
      </div>

      <div className="tp__field">
        <label>Typeface</label>
        <div className="tp__segment">
          {FONTS.map((f) => (
            <button
              key={f.label}
              className={brand.fontFamily === f.stack ? 'active' : ''}
              style={{ fontFamily: f.stack }}
              onClick={() => patch({ fontFamily: f.stack })}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tp__field">
        <label>Panels</label>
        <div className="tp__segment">
          {(['solid', 'translucent'] as const).map((p) => (
            <button
              key={p}
              className={brand.panelStyle === p ? 'active' : ''}
              onClick={() => patch({ panelStyle: p })}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <footer className="tp__footer">
        <button className="tp__action" onClick={copyCss}>
          {copied ? 'Copied ✓' : 'Copy CSS'}
        </button>
        {onExport && (
          <button className="tp__action tp__action--primary" onClick={onExport}>
            Export for Figma
          </button>
        )}
      </footer>
    </aside>
  );
}

function PaletteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 3 a9 9 0 1 0 0 18 c1.5 0 2-1 1.5-2 -0.6-1.2 0-2.5 1.5-2.5 h2 A2.5 2.5 0 0 0 19.5 14 C19.5 8 16 3 12 3 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8" cy="10" r="1.3" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1.3" fill="currentColor" />
      <circle cx="16" cy="10" r="1.3" fill="currentColor" />
    </svg>
  );
}
