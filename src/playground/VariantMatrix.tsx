import React from 'react';

export interface MatrixRow {
  label: string;
  cells: React.ReactNode[];
}

/** Variant × state grid — the Radix playground showcase pattern. Token
 *  regressions show up instantly when every variant/state combination is
 *  visible at once. */
export function VariantMatrix({
  cols,
  rows,
}: {
  cols: string[];
  rows: MatrixRow[];
}) {
  return (
    <div className="pg-matrix-scroll" role="region" aria-label="Component variants and states" tabIndex={0}>
      <table className="pg-matrix">
        <thead>
          <tr>
            <th />
            {cols.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {r.cells.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
