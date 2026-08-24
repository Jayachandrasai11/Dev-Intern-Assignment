import React from 'react';
import { Button, Chip, Heading, Icon, LinkCta, Text } from '../atoms';
import type { HeadingSize } from '../atoms';

export type MastheadMedia = 'image' | 'video' | 'plain';

export interface MastheadBannerProps {
  /** Eyebrow chip above the headline. */
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Primary CTA button. */
  ctaLabel?: string;
  onCtaClick?: () => void;
  /** Secondary text CTA. */
  linkLabel?: string;
  linkHref?: string;
  /** image/video render a placeholder media panel behind the content. */
  media?: MastheadMedia;
  align?: 'left' | 'center';
  /** Inverse ink for dark media. */
  inverse?: boolean;
  /** Headline ramp step. */
  headingSize?: Extract<HeadingSize, '2xl' | '3xl' | '4xl'>;
}

/** Full-width masthead — eyebrow chip, huge headline, sub copy, CTA row over an
 *  optional media placeholder panel. */
export function MastheadBanner({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  onCtaClick,
  linkLabel,
  linkHref = '#',
  media = 'plain',
  align = 'left',
  inverse = false,
  headingSize = '3xl',
}: MastheadBannerProps) {
  return (
    <section
      className={`atlas-masthead atlas-masthead--${media} atlas-masthead--${align}${
        inverse ? ' atlas-masthead--inverse' : ''
      }`}
    >
      {media !== 'plain' && (
        <div className="atlas-masthead__media" aria-hidden>
          {media === 'video' && (
            <span className="atlas-masthead__play">
              <Icon name="play" size={26} />
            </span>
          )}
        </div>
      )}
      <div className="atlas-masthead__content">
        {eyebrow && <Chip tone="brand">{eyebrow}</Chip>}
        <Heading size={headingSize} level={1} inverse={inverse}>
          {title}
        </Heading>
        {subtitle && (
          <Text size="l" inverse={inverse} muted={!inverse}>
            {subtitle}
          </Text>
        )}
        {(ctaLabel || linkLabel) && (
          <div className="atlas-masthead__ctas">
            {ctaLabel && (
              <Button size="l" onClick={onCtaClick}>
                {ctaLabel}
              </Button>
            )}
            {linkLabel && (
              <LinkCta
                size="l"
                tone={inverse ? 'inverse' : 'ink'}
                href={linkHref}
              >
                {linkLabel}
              </LinkCta>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
