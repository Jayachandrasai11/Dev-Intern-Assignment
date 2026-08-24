export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <span className={`ev-spinner ev-spinner--${size}`} aria-label="Loading" role="status" />;
}
