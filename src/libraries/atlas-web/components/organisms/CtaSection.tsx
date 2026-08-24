import React from 'react';
import { Button, Heading, Text } from '../atoms';

export interface CtaSectionProps {
  /** Band color — Atlas orange or solid ink. */
  tone?: 'brand' | 'ink';
  title: React.ReactNode;
  body?: React.ReactNode;
  primaryLabel?: string;
  onPrimaryClick?: () => void;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
}

/** Full-width conversion band — heading, copy and a button row on a brand or
 *  ink background. */
export function CtaSection({
  tone = 'brand',
  title,
  body,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
}: CtaSectionProps) {
  return (
    <section className={`atlas-ctasection atlas-ctasection--${tone}`}>
      <div className="atlas-ctasection__inner">
        <Heading size="xl" inverse>
          {title}
        </Heading>
        {body && (
          <Text size="l" inverse>
            {body}
          </Text>
        )}
        {(primaryLabel || secondaryLabel) && (
          <div className="atlas-ctasection__actions">
            {primaryLabel && (
              <Button size="l" onClick={onPrimaryClick}>
                {primaryLabel}
              </Button>
            )}
            {secondaryLabel && (
              <Button size="l" variant="secondary" onClick={onSecondaryClick}>
                {secondaryLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
