import { Button, Icon } from '../atoms';

export interface SiteHeaderNavLink {
  label: string;
  href?: string;
  active?: boolean;
}

export interface SiteHeaderProps {
  navLinks: SiteHeaderNavLink[];
  /** Utility-bar dealer-locator link. */
  dealerLabel?: string;
  dealerHref?: string;
  /** Utility-bar phone number. */
  phone?: string;
  /** Primary booking CTA. */
  ctaLabel?: string;
  onCtaClick?: () => void;
  /** `transparent` sits over a dark masthead — inverse ink, no border. */
  variant?: 'solid' | 'transparent';
}

/** Site-wide header — top utility bar (dealer locator + phone) over the main
 *  nav row: Atlas wordmark, nav links, booking CTA. */
export function SiteHeader({
  navLinks,
  dealerLabel = 'Find a dealer',
  dealerHref = '#',
  phone,
  ctaLabel = 'Book test ride',
  onCtaClick,
  variant = 'solid',
}: SiteHeaderProps) {
  return (
    <header className={`atlas-header atlas-header--${variant}`}>
      <div className="atlas-header__utility">
        <a className="atlas-header__utility-link" href={dealerHref}>
          <Icon name="map-pin" size={14} />
          {dealerLabel}
        </a>
        {phone && (
          <a
            className="atlas-header__utility-link"
            href={`tel:${phone.replace(/\s/g, '')}`}
          >
            <Icon name="phone" size={14} />
            {phone}
          </a>
        )}
      </div>
      <div className="atlas-header__main">
        <a className="atlas-header__wordmark" href="#" aria-label="Atlas home">
          Atlas
        </a>
        <nav className="atlas-header__nav" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.label}
              className={`atlas-header__nav-link${
                link.active ? ' atlas-header__nav-link--active' : ''
              }`}
              aria-current={link.active ? 'page' : undefined}
              href={link.href ?? '#'}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <Button size="m" onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      </div>
    </header>
  );
}
