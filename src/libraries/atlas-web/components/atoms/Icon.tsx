import React from 'react';

/** Curated inline icon set for the website surfaces (nav, CTAs, spec cards,
 *  dealer locator). Stroke icons inherit currentColor. */
const PATHS: Record<string, React.ReactNode> = {
  'arrow-right': <path d="M5 12h14m0 0-6-6m6 6-6 6" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  'map-pin': (
    <>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <path d="M6 3h4l1.5 5-2.5 1.5a12 12 0 0 0 5.5 5.5L16 12.5l5 1.5v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />
  ),
  bolt: <path d="M13 2 5.5 13.5h4.5L9 22l7.5-11.5H12L13 2Z" />,
  battery: (
    <>
      <rect x="2" y="8" width="17" height="8" rx="2" />
      <path d="M22 11v2" />
      <path d="M6 11h6" />
    </>
  ),
  star: (
    <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8L12 3Z" />
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  check: <path d="m5 13 4 4L19 7" />,
  gauge: (
    <>
      <path d="M4 14a8 8 0 1 1 16 0" />
      <path d="m12 14 4-4" />
    </>
  ),
};

export const ATLAS_ICON_NAMES = Object.keys(PATHS) as Array<keyof typeof PATHS>;
export type AtlasIconName = (typeof ATLAS_ICON_NAMES)[number];

export interface IconProps {
  name: AtlasIconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className = '' }: IconProps) {
  return (
    <svg
      className={`atlas-icon ${className}`}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name] ?? PATHS['bolt']}
    </svg>
  );
}
