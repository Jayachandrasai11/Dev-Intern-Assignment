import { Button, Icon } from '../atoms';
import type { IconName } from '../atoms';

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  body?: string;
  action?: { label: string; onClick?: () => void };
}

/** Empty surface with guidance — first-run home, empty history. */
export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="ev-empty">
      {icon && (
        <span className="ev-empty__icon">
          <Icon name={icon} size={26} />
        </span>
      )}
      <strong className="ev-empty__title">{title}</strong>
      {body && <p className="ev-empty__body">{body}</p>}
      {action && (
        <Button variant="soft" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
