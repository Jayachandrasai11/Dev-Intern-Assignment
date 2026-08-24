import React from 'react';
import { Button, Chip, Icon, LinkCta } from '../atoms';

export interface CardGridProps {
  /** Desktop column count; collapses responsively. */
  columns?: 2 | 3 | 4;
  children: React.ReactNode;
}

/** Responsive grid wrapper for card children (ModelCard, AdvantageCard, …). */
export function CardGrid({ columns = 3, children }: CardGridProps) {
  return (
    <div className={`atlas-cardgrid atlas-cardgrid--${columns}`}>{children}</div>
  );
}

export interface ModelCardModel {
  id?: string;
  name: string;
  price: string;
  tag?: string;
  rangeKm: number;
  topSpeedKmh: number;
}

export interface ModelCardProps {
  model: ModelCardModel;
  ctaLabel?: string;
  onCtaClick?: () => void;
  linkLabel?: string;
  linkHref?: string;
}

/** Range-grid model card — media placeholder, tag, name, price, spec chips,
 *  CTA row. */
export function ModelCard({
  model,
  ctaLabel = 'Book test ride',
  onCtaClick,
  linkLabel = 'Explore',
  linkHref = '#',
}: ModelCardProps) {
  return (
    <article className="atlas-modelcard">
      <div className="atlas-modelcard__media" aria-hidden>
        <Icon name="bolt" size={36} />
        {model.tag && (
          <span className="atlas-modelcard__tag">
            <Chip tone="brand">{model.tag}</Chip>
          </span>
        )}
      </div>
      <div className="atlas-modelcard__body">
        <h3 className="atlas-modelcard__name">{model.name}</h3>
        <span className="atlas-modelcard__price">From {model.price}</span>
        <div className="atlas-modelcard__specs">
          <Chip>{model.rangeKm} km range</Chip>
          <Chip>{model.topSpeedKmh} km/h</Chip>
        </div>
        <div className="atlas-modelcard__ctas">
          <Button size="s" onClick={onCtaClick}>
            {ctaLabel}
          </Button>
          <LinkCta size="s" tone="ink" href={linkHref}>
            {linkLabel}
          </LinkCta>
        </div>
      </div>
    </article>
  );
}
