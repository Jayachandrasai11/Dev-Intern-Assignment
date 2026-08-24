import { Icon } from '../atoms';
import type { IconName } from '../atoms';

export interface BottomNavItem {
  id: string;
  icon: IconName;
  label: string;
  /** Notification dot on the item icon. */
  badge?: boolean;
}

export interface BottomNavBarProps {
  items: BottomNavItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  /** Prominent docked action — scan-to-charge is one tap from anywhere. */
  centerAction?: { icon: IconName; label: string; onSelect?: () => void };
}

/** Mobile bottom navigation. With a centerAction the items split around a
 *  raised circular primary action; without it, plain tabs. */
export function BottomNavBar({
  items,
  activeId,
  onSelect,
  centerAction,
}: BottomNavBarProps) {
  const mid = Math.ceil(items.length / 2);
  const before = centerAction ? items.slice(0, mid) : items;
  const after = centerAction ? items.slice(mid) : [];

  const renderItem = (item: BottomNavItem) => (
    <button
      key={item.id}
      type="button"
      className={`ev-bottom-nav__item${
        item.id === activeId ? ' ev-bottom-nav__item--active' : ''
      }`}
      aria-current={item.id === activeId ? 'page' : undefined}
      onClick={() => onSelect?.(item.id)}
    >
      <span className="ev-bottom-nav__icon">
        <Icon name={item.icon} size={22} />
        {item.badge && <span className="ev-bottom-nav__badge" />}
      </span>
      {item.label}
    </button>
  );

  return (
    <nav className="ev-bottom-nav">
      {before.map(renderItem)}
      {centerAction && (
        <button
          type="button"
          className="ev-bottom-nav__center"
          onClick={centerAction.onSelect}
        >
          <span className="ev-bottom-nav__center-circle">
            <Icon name={centerAction.icon} size={24} />
          </span>
          {centerAction.label}
        </button>
      )}
      {after.map(renderItem)}
    </nav>
  );
}
