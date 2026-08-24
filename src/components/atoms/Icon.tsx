import { HugeiconsIcon } from '@hugeicons/react';
import {
  Alert01Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowUp01Icon,
  BatteryCharging01Icon,
  BatteryFullIcon,
  BatteryLowIcon,
  Calendar03Icon,
  Cancel01Icon,
  Car01Icon,
  Clock01Icon,
  CreditCardIcon,
  Delete02Icon,
  Edit02Icon,
  FilterIcon,
  FlashIcon,
  FuelStationIcon,
  Gps01Icon,
  HelpCircleIcon,
  Home01Icon,
  InformationCircleIcon,
  Location01Icon,
  MapPinIcon,
  Menu01Icon,
  MinusSignIcon,
  MoreHorizontalIcon,
  Navigation03Icon,
  Notification01Icon,
  PlugSocketIcon,
  PlusSignIcon,
  QrCodeIcon,
  ReceiptDollarIcon,
  RefreshIcon,
  Route01Icon,
  Search01Icon,
  Settings01Icon,
  Share01Icon,
  SquareLock01Icon,
  StarIcon,
  Tick02Icon,
  User02Icon,
  ViewIcon,
  Wallet01Icon,
} from '@hugeicons/core-free-icons';

/**
 * The Volt DS icon system: a curated EV-relevant subset of Hugeicons Free
 * (MIT). Names mirror the Figma `icon/*` components 1:1 — keep this map and
 * the Figma Foundations · Icons page in sync (scripts/hugeicons-dump.mjs is
 * the single source for the set).
 */
export const ICONS = {
  bolt: FlashIcon,
  search: Search01Icon,
  close: Cancel01Icon,
  check: Tick02Icon,
  'chevron-left': ArrowLeft01Icon,
  'chevron-right': ArrowRight01Icon,
  'chevron-up': ArrowUp01Icon,
  'chevron-down': ArrowDown01Icon,
  'arrow-right': ArrowRight02Icon,
  'arrow-left': ArrowLeft02Icon,
  plus: PlusSignIcon,
  minus: MinusSignIcon,
  'battery-charging': BatteryCharging01Icon,
  'battery-full': BatteryFullIcon,
  'battery-low': BatteryLowIcon,
  'charging-station': FuelStationIcon,
  plug: PlugSocketIcon,
  'ev-car': Car01Icon,
  'map-pin': MapPinIcon,
  location: Location01Icon,
  navigation: Navigation03Icon,
  route: Route01Icon,
  gps: Gps01Icon,
  clock: Clock01Icon,
  calendar: Calendar03Icon,
  wallet: Wallet01Icon,
  'credit-card': CreditCardIcon,
  receipt: ReceiptDollarIcon,
  'qr-code': QrCodeIcon,
  settings: Settings01Icon,
  filter: FilterIcon,
  user: User02Icon,
  home: Home01Icon,
  star: StarIcon,
  share: Share01Icon,
  'info-circle': InformationCircleIcon,
  'alert-triangle': Alert01Icon,
  'alert-circle': AlertCircleIcon,
  'help-circle': HelpCircleIcon,
  refresh: RefreshIcon,
  bell: Notification01Icon,
  lock: SquareLock01Icon,
  eye: ViewIcon,
  trash: Delete02Icon,
  edit: Edit02Icon,
  menu: Menu01Icon,
  more: MoreHorizontalIcon,
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export interface IconProps {
  name: IconName;
  /** Base px size — multiplied by --ev-scaling like all DS dimensions. */
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function Icon({ name, size = 24, strokeWidth = 1.8, className = '' }: IconProps) {
  return (
    <span
      className={`ev-icon ${className}`}
      style={{
        width: `calc(${size}px * var(--ev-scaling))`,
        height: `calc(${size}px * var(--ev-scaling))`,
      }}
      role="img"
      aria-label={name}
    >
      <HugeiconsIcon icon={ICONS[name]} size="100%" color="currentColor" strokeWidth={strokeWidth} />
    </span>
  );
}
