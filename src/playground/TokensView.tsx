import { resolveTokenValue, cssVarName } from '../tokens/emit';
import type { TokenDef, TokenLayerDef } from '../tokens/types';
import { useTheme } from '../theme/useTheme';

const LAYER_TITLES: Record<string, string> = {
  global: '01 · Global (primitives)',
  semantic: '02 · Brand (semantic)',
  component: '03 · Component',
};

export function TokensView() {
  const { layers } = useTheme();
  return (
    <div className="pg-tokens">
      {layers.map((layer) => (
        <section key={layer.layer} className="pg-tokens__layer">
          <h3>{LAYER_TITLES[layer.layer]}</h3>
          <p className="pg-tokens__count">{layer.tokens.length} tokens</p>
          <div className="pg-matrix-scroll">
            <table className="pg-tokens__table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>CSS variable</th>
                  <th>Light</th>
                  <th>Dark</th>
                  <th>Aliases</th>
                </tr>
              </thead>
              <tbody>
                {layer.tokens.map((t) => (
                  <TokenRow key={t.path} def={t} layers={layers} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

function TokenRow({
  def,
  layers,
}: {
  def: TokenDef;
  layers: TokenLayerDef[];
}) {
  let light = '';
  let dark = '';
  try {
    light = String(resolveTokenValue(def, layers, 'light'));
    dark = String(resolveTokenValue(def, layers, 'dark'));
  } catch {
    light = dark = '(unresolved)';
  }
  const isColor = def.type === 'color';
  return (
    <tr>
      <td className="pg-tokens__path">{def.path}</td>
      <td className="pg-tokens__var">{cssVarName(def.path)}</td>
      <td>
        {isColor && <span className="pg-swatch" style={{ background: light }} />}
        <code>{shorten(light)}</code>
      </td>
      <td>
        {isColor && <span className="pg-swatch" style={{ background: dark }} />}
        <code>{shorten(dark)}</code>
      </td>
      <td className="pg-tokens__alias">
        {def.alias ? `→ ${def.alias.layer}:${def.alias.path}` : ''}
      </td>
    </tr>
  );
}

function shorten(v: string) {
  return v.length > 28 ? `${v.slice(0, 26)}…` : v;
}
