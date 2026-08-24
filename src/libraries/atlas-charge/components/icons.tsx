import { HugeiconsIcon } from '@hugeicons/react';
import {
  Alert01Icon,
  AlertCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BankIcon,
  BubbleChatIcon,
  Call02Icon,
  Cancel01Icon,
  Car01Icon,
  CircleIcon,
  Clock01Icon,
  CreditCardIcon,
  FilterIcon,
  FlashIcon,
  FlashlightIcon,
  HelpCircleIcon,
  Home01Icon,
  InboxIcon,
  InformationCircleIcon,
  Loading03Icon,
  Mail01Icon,
  MapPinIcon,
  Notification01Icon,
  PlusSignIcon,
  QrCodeIcon,
  Search01Icon,
  SquareLock01Icon,
  StarIcon,
  Tick02Icon,
  User02Icon,
  Wallet01Icon,
  WifiDisconnected01Icon,
} from '@hugeicons/core-free-icons';

const CHARGE_ICONS = {
  'arrow-left': ArrowLeft01Icon,
  'arrow-right': ArrowRight01Icon,
  bank: BankIcon,
  car: Car01Icon,
  chat: BubbleChatIcon,
  check: Tick02Icon,
  circle: CircleIcon,
  clock: Clock01Icon,
  close: Cancel01Icon,
  email: Mail01Icon,
  empty: InboxIcon,
  error: AlertCircleIcon,
  filter: FilterIcon,
  flash: FlashIcon,
  flashlight: FlashlightIcon,
  help: HelpCircleIcon,
  home: Home01Icon,
  info: InformationCircleIcon,
  loading: Loading03Icon,
  lock: SquareLock01Icon,
  location: MapPinIcon,
  notification: Notification01Icon,
  offline: WifiDisconnected01Icon,
  payment: CreditCardIcon,
  phone: Call02Icon,
  plus: PlusSignIcon,
  qr: QrCodeIcon,
  search: Search01Icon,
  star: StarIcon,
  user: User02Icon,
  wallet: Wallet01Icon,
  warning: Alert01Icon,
} as const;

export type ChargeIconName = keyof typeof CHARGE_ICONS;
export const CHARGE_ICON_NAMES = Object.keys(CHARGE_ICONS) as ChargeIconName[];

export function ChargeIcon({
  name,
  size = '1em',
  strokeWidth = 1.8,
  label,
  className = '',
}: {
  name: ChargeIconName;
  size?: number | string;
  strokeWidth?: number;
  label?: string;
  className?: string;
}) {
  const dimension = typeof size === 'number' ? `calc(${size}px * var(--ev-scaling))` : size;
  return (
    <span
      className={`ac-icon ${name === 'loading' ? 'ac-icon--loading' : ''} ${className}`.trim()}
      style={{ width: dimension, height: dimension }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <HugeiconsIcon
        icon={CHARGE_ICONS[name]}
        size="100%"
        color="currentColor"
        strokeWidth={strokeWidth}
      />
    </span>
  );
}
