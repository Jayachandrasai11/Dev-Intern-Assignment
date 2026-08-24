import type { PriceBand } from '../data';

export interface PricingTableProps {
  bands: PriceBand[];
  /** Show a member price column (dual-price pattern). */
  showMember?: boolean;
  idleFeePerMin?: number;
  currency?: string;
  /** Footnotes rendered under the table (tariff small print). */
  notes?: string[];
}

export function PricingTable({
  bands,
  showMember,
  idleFeePerMin,
  currency = '$',
  notes,
}: PricingTableProps) {
  return (
    <div className="ev-pricing-table">
      <table>
        <thead>
          <tr>
            <th>Time band</th>
            <th>{showMember ? 'Guest' : 'Price'}</th>
            {showMember && <th>Member</th>}
          </tr>
        </thead>
        <tbody>
          {bands.map((b) => (
            <tr key={b.label}>
              <td>
                <span className="ev-pricing-table__band">{b.label}</span>
                {b.window && (
                  <span className="ev-pricing-table__window">{b.window}</span>
                )}
              </td>
              <td>
                {currency}
                {b.perKwh.toFixed(2)}
                <span className="ev-pricing-table__unit">/kWh</span>
              </td>
              {showMember && (
                <td className="ev-pricing-table__member">
                  {b.memberPerKwh !== undefined ? (
                    <>
                      {currency}
                      {b.memberPerKwh.toFixed(2)}
                      <span className="ev-pricing-table__unit">/kWh</span>
                    </>
                  ) : (
                    '—'
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {idleFeePerMin !== undefined && (
        <p className="ev-pricing-table__idle">
          Idle fee {currency}
          {idleFeePerMin.toFixed(2)}/min after a 10 min grace period
        </p>
      )}
      {notes && notes.length > 0 && (
        <ul className="ev-pricing-table__notes">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
