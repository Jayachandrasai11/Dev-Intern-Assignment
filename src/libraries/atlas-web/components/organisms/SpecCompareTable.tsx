import { Chip } from '../atoms';

export interface SpecCompareModel {
  id: string;
  name: string;
  price?: string;
  tag?: string;
}

export interface SpecCompareRow {
  label: string;
  /** One value per model, aligned with the models order. */
  values: string[];
}

export interface SpecCompareTableProps {
  models: SpecCompareModel[];
  rows: SpecCompareRow[];
  /** Model id whose column gets the brand highlight. */
  highlightId?: string;
  caption?: string;
}

/** Model-compare table — model column headers, spec rows, optional brand
 *  highlight on one column. */
export function SpecCompareTable({
  models,
  rows,
  highlightId,
  caption,
}: SpecCompareTableProps) {
  const highlightIndex = models.findIndex((m) => m.id === highlightId);
  return (
    <div className="atlas-comparetable">
      <table className="atlas-comparetable__table">
        {caption && (
          <caption className="atlas-comparetable__caption">{caption}</caption>
        )}
        <thead>
          <tr>
            <th
              className="atlas-comparetable__corner"
              scope="col"
              aria-label="Specification"
            />
            {models.map((m, i) => (
              <th
                key={m.id}
                scope="col"
                className={`atlas-comparetable__head${
                  i === highlightIndex ? ' atlas-comparetable__head--highlight' : ''
                }`}
              >
                <span className="atlas-comparetable__model">
                  {m.name}
                  {m.tag && <Chip tone="brand">{m.tag}</Chip>}
                </span>
                {m.price && (
                  <span className="atlas-comparetable__price">
                    From {m.price}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="atlas-comparetable__row">
              <th scope="row" className="atlas-comparetable__label">
                {row.label}
              </th>
              {models.map((m, i) => (
                <td
                  key={m.id}
                  className={`atlas-comparetable__cell${
                    i === highlightIndex
                      ? ' atlas-comparetable__cell--highlight'
                      : ''
                  }`}
                >
                  {row.values[i] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
