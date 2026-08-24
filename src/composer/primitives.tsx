import React from 'react';
import { AppHeader } from '../components/molecules';

/** Minimal flow-layout vocabulary for composing screens. These are the only
 *  composer-specific visual components — everything else comes from the
 *  active UI library's catalog. */

/** Space-token index (1..9) → the density-aware token var; 0/undefined = none. */
const spaceVar = (i?: number) => (i ? `var(--ev-space-${i})` : undefined);

const ALIGN_ITEMS = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  stretch: 'stretch',
} as const;
const JUSTIFY = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
} as const;

export type BoxAlign = keyof typeof ALIGN_ITEMS;
export type BoxSticky = 'none' | 'top' | 'bottom';
export type GroupDirection = 'vertical' | 'horizontal';
export type GroupJustify = keyof typeof JUSTIFY;

/** User-facing grouping container: flex flow in either direction with
 *  per-axis gaps. gapV/gapH/padding are space-token indices (0 = none). */
export function Group({
  direction = 'vertical',
  wrap = false,
  gapV,
  gapH,
  padding,
  align = 'stretch',
  justify = 'start',
  children,
}: {
  direction?: GroupDirection;
  wrap?: boolean;
  gapV?: number;
  gapH?: number;
  padding?: number;
  align?: BoxAlign;
  justify?: GroupJustify;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        flexWrap: wrap ? 'wrap' : 'nowrap',
        rowGap: spaceVar(gapV),
        columnGap: spaceVar(gapH),
        padding: spaceVar(padding),
        alignItems: ALIGN_ITEMS[align],
        justifyContent: JUSTIFY[justify],
      }}
    >
      {children}
    </div>
  );
}

/** Shared per-block wrapper (align / sticky / full-bleed). Renders a bare
 *  fragment when everything is default so existing docs get zero extra DOM.
 *  A flex column (not alignSelf) so alignment behaves identically in the
 *  Puck editor — which interposes its own flex-item wrapper — and <Render>. */
export function LayoutBox({
  align = 'stretch',
  sticky = 'none',
  bleed = false,
  children,
}: {
  align?: BoxAlign;
  sticky?: BoxSticky;
  bleed?: boolean;
  children?: React.ReactNode;
}) {
  if (align === 'stretch' && sticky === 'none' && !bleed) return <>{children}</>;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: ALIGN_ITEMS[align],
        ...(bleed && {
          marginLeft: 'calc(-1 * var(--ev-page-inset, 0px))',
          marginRight: 'calc(-1 * var(--ev-page-inset, 0px))',
        }),
        // Sticky can't visibly travel inside the Puck editor canvas (each item
        // sits in a wrapper exactly its own height); it behaves correctly in
        // <Render> output and exported JSX.
        ...(sticky !== 'none' && {
          position: 'sticky' as const,
          [sticky]: 0,
          zIndex: 10,
          background: 'var(--ev-color-bg)',
        }),
      }}
    >
      {children}
    </div>
  );
}

/** Screen root: side padding + vertical rhythm between top-level blocks.
 *  Publishes --ev-page-inset so LayoutBox `bleed` can escape the padding.
 *  sidePadding/blockGap are space-token indices (0 = none). */
export function Page({
  sidePadding = 0,
  blockGap = 0,
  children,
}: {
  sidePadding?: number;
  blockGap?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: '100%',
        background: 'var(--ev-color-bg)',
        fontFamily: 'var(--ev-font-family)',
        display: 'flex',
        flexDirection: 'column',
        gap: spaceVar(blockGap),
        paddingLeft: spaceVar(sidePadding),
        paddingRight: spaceVar(sidePadding),
        ['--ev-page-inset' as never]: spaceVar(sidePadding) ?? '0px',
      }}
    >
      {children}
    </div>
  );
}

export function Stack({
  gap,
  padding,
  children,
}: {
  gap: number;
  padding: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `calc(${gap}px * var(--ev-scaling))`,
        padding: `calc(${padding}px * var(--ev-scaling))`,
      }}
    >
      {children}
    </div>
  );
}

export function Row({
  gap,
  align,
  wrap,
  children,
}: {
  gap: number;
  align: 'start' | 'center' | 'end' | 'space-between';
  wrap: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: align === 'space-between' ? 'center' : align,
        justifyContent: align === 'space-between' ? 'space-between' : undefined,
        gap: `calc(${gap}px * var(--ev-scaling))`,
        flexWrap: wrap ? 'wrap' : 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

export function Spacer({ height }: { height: number }) {
  return <div style={{ height: `calc(${height}px * var(--ev-scaling))` }} />;
}

/** Thin adapter over the DS AppHeader — kept for existing composer docs
 *  whose screens reference the ScreenHeader primitive. */
export function ScreenHeader({
  title,
  subtitle,
  back,
}: {
  title: string;
  subtitle?: string;
  back: boolean;
}) {
  return (
    <AppHeader
      title={title}
      subtitle={subtitle}
      onBack={back ? () => {} : undefined}
    />
  );
}
