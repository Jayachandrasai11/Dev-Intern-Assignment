export interface SkeletonProps {
  shape?: 'text' | 'title' | 'row' | 'card' | 'circle';
  /** Width override (px number or any CSS width). */
  width?: number | string;
}

/** Loading placeholder — screen readiness is not operational state, so
 *  pending surfaces show shimmer instead of empty or stale content. */
export function Skeleton({ shape = 'text', width }: SkeletonProps) {
  return (
    <span
      className={`ev-skeleton ev-skeleton--${shape}`}
      style={width != null ? { width } : undefined}
      aria-hidden
    />
  );
}
