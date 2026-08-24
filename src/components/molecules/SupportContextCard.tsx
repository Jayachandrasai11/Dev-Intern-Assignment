import { Button, Icon } from '../atoms';

export interface SupportContextCardProps {
  title?: string;
  /** Failure context carried into support — session, charger, payment, time. */
  context?: { label: string; value: string }[];
  action?: { label: string; onClick?: () => void };
}

/** Contextual support entry. Failures carry their context so the user
 *  never has to re-describe what the app already knows. */
export function SupportContextCard({
  title = 'Get help with this session',
  context,
  action = { label: 'Contact support' },
}: SupportContextCardProps) {
  return (
    <div className="ev-support">
      <div className="ev-support__header">
        <Icon name="help-circle" size={18} />
        <strong className="ev-support__title">{title}</strong>
      </div>
      {context && context.length > 0 && (
        <dl className="ev-support__context">
          {context.map((c) => (
            <div key={c.label} className="ev-support__context-row">
              <dt>{c.label}</dt>
              <dd>{c.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <Button variant="soft" size="sm" onClick={action.onClick}>
        {action.label}
      </Button>
    </div>
  );
}
