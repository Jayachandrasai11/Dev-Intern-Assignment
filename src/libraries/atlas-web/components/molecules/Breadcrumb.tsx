import { Icon } from '../atoms';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  /** Trail in order; the last item renders as the current page. */
  items: BreadcrumbItem[];
}

/** Breadcrumb trail — chevron separators, last item marked current. */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="atlas-breadcrumb" aria-label="Breadcrumb">
      <ol className="atlas-breadcrumb__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="atlas-breadcrumb__item">
              {last ? (
                <span className="atlas-breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a className="atlas-breadcrumb__link" href={item.href ?? '#'}>
                  {item.label}
                </a>
              )}
              {!last && (
                <span className="atlas-breadcrumb__sep" aria-hidden>
                  <Icon name="chevron-right" size={13} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
