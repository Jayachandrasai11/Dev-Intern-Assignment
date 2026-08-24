export interface SiteFooterLink {
  label: string;
  href?: string;
}

export interface SiteFooterColumn {
  title: string;
  links: SiteFooterLink[];
}

export interface SiteFooterProps {
  tagline?: string;
  columns: SiteFooterColumn[];
  socials?: SiteFooterLink[];
  legalLinks?: SiteFooterLink[];
  copyright?: string;
}

/** Dark site footer — brand block, link columns, social row and the legal
 *  strip with copyright + policy links. */
export function SiteFooter({
  tagline,
  columns,
  socials,
  legalLinks,
  copyright = `© ${new Date().getFullYear()} Atlas Motors Ltd. All rights reserved.`,
}: SiteFooterProps) {
  return (
    <footer className="atlas-footer">
      <div className="atlas-footer__top">
        <div className="atlas-footer__brand">
          <span className="atlas-footer__wordmark">Atlas</span>
          {tagline && <p className="atlas-footer__tagline">{tagline}</p>}
          {socials && socials.length > 0 && (
            <div className="atlas-footer__social">
              {socials.map((s) => (
                <a
                  key={s.label}
                  className="atlas-footer__social-link"
                  href={s.href ?? '#'}
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="atlas-footer__columns">
          {columns.map((col) => (
            <div className="atlas-footer__col" key={col.title}>
              <span className="atlas-footer__col-title">{col.title}</span>
              <ul className="atlas-footer__links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a className="atlas-footer__link" href={link.href ?? '#'}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="atlas-footer__legal">
        <span className="atlas-footer__copyright">{copyright}</span>
        {legalLinks && legalLinks.length > 0 && (
          <div className="atlas-footer__legal-links">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                className="atlas-footer__legal-link"
                href={link.href ?? '#'}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
