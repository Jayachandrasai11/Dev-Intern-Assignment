export interface NavTabItem {
  id: string;
  label: string;
}

export interface NavTabsProps {
  items: NavTabItem[];
  activeId: string;
  onChange?: (id: string) => void;
}

/** Horizontal tab strip — brand-orange underline marks the active tab. */
export function NavTabs({ items, activeId, onChange }: NavTabsProps) {
  return (
    <nav className="atlas-navtabs" role="tablist">
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`atlas-navtabs__tab${active ? ' atlas-navtabs__tab--active' : ''}`}
            onClick={() => onChange?.(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
