export interface PowerTextProps {
  kw: number;
  /** Speed tier bolts (1=fast, 2=ultra, 3=hyper) — separate encoding from
   *  status color, per industry convention. */
  tier?: 1 | 2 | 3;
  emphasis?: boolean;
}

const BOLT = 'M13 2 L5.5 13.5 h4.5 L9 22 l7.5-11.5 H12 Z';

export function PowerText({ kw, tier, emphasis }: PowerTextProps) {
  return (
    <span
      className={`ev-power-text${emphasis ? ' ev-power-text--emphasis' : ''}`}
    >
      {tier && (
        <span className="ev-power-text__bolts" aria-label={`tier ${tier}`}>
          {Array.from({ length: tier }, (_, i) => (
            <svg key={i} viewBox="0 0 24 24" aria-hidden>
              <path d={BOLT} fill="currentColor" />
            </svg>
          ))}
        </span>
      )}
      <span className="ev-power-text__value">
        {kw}
        <span className="ev-power-text__unit"> kW</span>
      </span>
    </span>
  );
}
