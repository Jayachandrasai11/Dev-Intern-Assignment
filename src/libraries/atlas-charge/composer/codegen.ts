import type { CodegenPack, JsxEmitter } from '../../../composer/codegen';
import { expr, LAYOUT_EMITTERS, LAYOUT_PRIMITIVE_NAMES, num, str } from '../../../composer/codegen';

const names = [
  'Button','IconButton','TextField','OtpInput','SelectionControl','Toggle','Chip','StatusBadge','NamedProgress',
  'AppBar','SearchFilter','Alert','EmptyState','OrientationCard','Coachmark','StatusPanel','SettingRow','StationCard','MapMarker','RecordRow','LocationList','DetailPanel','WalletCard','CommandProgress','AmountSelector','PaymentMethodSelector','Accordion','SupportTile','StepGuide',
  'BottomNav','ModalSheet','LaunchGate','ProfileForm','LegalViewer','QrScanner','ChargerDetail','StartReadiness','ActiveSession','SessionSummary','FilterSheet','TicketForm','RequestChargerForm',
];

const generic = (name: string, childKey?: string): JsxEmitter => (props) => {
  const attrs: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (key === 'id' || key === 'box' || key === childKey || value === '' || value === undefined) continue;
    if (typeof value === 'boolean') attrs.push(value ? key : expr(key, 'false'));
    else if (typeof value === 'number') attrs.push(num(key, value));
    else attrs.push(str(key, value));
  }
  return { name, attrs, children: childKey ? [String(props[childKey] ?? '')] : [] };
};

const childKeys: Record<string, string> = { Button:'label', Chip:'label', StatusBadge:'label' };
const emitters: Record<string, JsxEmitter> = { ...LAYOUT_EMITTERS };
for (const name of names) emitters[name] = generic(name, childKeys[name]);

export const ATLAS_CHARGE_CODEGEN: CodegenPack = {
  emitters,
  importSources: {
    '../components': names,
    './primitives': [...LAYOUT_PRIMITIVE_NAMES].sort(),
  },
  fixtures: {},
};
