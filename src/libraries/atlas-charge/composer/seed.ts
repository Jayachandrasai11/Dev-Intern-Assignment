import type { ComposerDoc, ComposerScreen } from '../../../composer/schema';
import { createDoc, VIEWPORT_SIZES } from '../../../composer/schema';
import { ATLAS_CHARGE_DEFAULT_PRESET } from '../tokens/presets';

let sequence = 0;
const item = (type: string, props: Record<string, unknown> = {}) => ({ type, props:{ id:`ac-seed-${sequence++}`, ...props } });
const screen = (name: string, index: number, content: unknown[]): ComposerScreen => ({ id:`ac-screen-${index}`, name, x:80 + index * (VIEWPORT_SIZES.phone.width + 96), y:80, viewport:'phone', puckData:{ content:content as never, root:{ props:{} } } });

export function seedDoc(): ComposerDoc {
  sequence = 0;
  const doc = createDoc('atlas-charge', ATLAS_CHARGE_DEFAULT_PRESET);
  doc.screens = [
    screen('Find a charger', 0, [
      item('AppBar',{title:'Nearby chargers',mode:'action'}),
      item('SearchFilter',{query:'',state:'idle'}),
      item('StationCard',{state:'available',stale:false,loading:false}),
      item('StationCard',{state:'in-use',stale:false,loading:false}),
      item('BottomNav',{active:'home',state:'badge'}),
    ]),
    screen('Review and start', 1, [
      item('AppBar',{title:'Review charging',mode:'back'}),
      item('DetailPanel',{variant:'station-header',state:'ready'}),
      item('DetailPanel',{variant:'connector',state:'complete'}),
      item('DetailPanel',{variant:'duration',state:'default'}),
      item('WalletCard',{variant:'readiness',state:'sufficient'}),
      item('Button',{label:'Start charging',variant:'primary',width:'full',state:'default'}),
    ]),
    screen('Active session', 2, [item('ActiveSession',{state:'active'})]),
    screen('Recovery', 3, [
      item('StatusPanel',{kind:'reconciliation',state:'Pending',title:'Charging has stopped',detail:'Final energy and payment records are still reconciling.',tone:'warning',action:'View session'}),
      item('TicketForm',{state:'draft'}),
    ]),
  ];
  return doc;
}
