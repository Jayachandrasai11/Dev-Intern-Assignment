import type { UiLibrary } from '../types';
import { ATLAS_CHARGE_CODEGEN } from './composer/codegen';
import { composerConfig } from './composer/registry';
import { seedDoc } from './composer/seed';
import {
  ATLAS_CHARGE_ATOM_SECTIONS,
  ATLAS_CHARGE_MOLECULE_SECTIONS,
  ATLAS_CHARGE_ORGANISM_SECTIONS,
} from './showcase/catalogue';
import { ATLAS_CHARGE_COMPONENT_TOKENS } from './tokens/component';
import { ATLAS_CHARGE_GLOBAL_TOKENS } from './tokens/global';
import {
  ATLAS_CHARGE_DEFAULT_PRESET,
  ATLAS_CHARGE_PRESETS,
} from './tokens/presets';
import { buildAtlasChargeSemantic } from './tokens/semantic';
import './components/atlas-charge.css';

/** Atlas Charge is a mobile-first, operational charging system. Its 61-item
 * specification is expressed as reusable variant families in the component
 * layer, while the catalogue preserves every named state for inspection. */
export const atlasChargeLibrary: UiLibrary = {
  id: 'atlas-charge',
  name: 'Atlas Charge',
  tagline: 'Calm Utility for dependable EV charging — 61 specified families',
  globalTokens: ATLAS_CHARGE_GLOBAL_TOKENS,
  componentTokens: ATLAS_CHARGE_COMPONENT_TOKENS,
  buildSemantic: buildAtlasChargeSemantic,
  presets: ATLAS_CHARGE_PRESETS,
  defaultPreset: ATLAS_CHARGE_DEFAULT_PRESET,
  levers: null,
  cssFiles: ['src/libraries/atlas-charge/components/atlas-charge.css'],
  tiers: [
    {
      id: 'atoms',
      title: 'Atoms',
      blurb: 'Accessible controls and status primitives with complete interaction states.',
      sections: ATLAS_CHARGE_ATOM_SECTIONS,
    },
    {
      id: 'molecules',
      title: 'Molecules',
      blurb: 'Charging, wallet, discovery, support, and account compositions.',
      sections: ATLAS_CHARGE_MOLECULE_SECTIONS,
    },
    {
      id: 'organisms',
      title: 'Organisms',
      blurb: 'Mobile task flows and high-stakes operational surfaces.',
      sections: ATLAS_CHARGE_ORGANISM_SECTIONS,
    },
  ],
  composerConfig,
  codegen: ATLAS_CHARGE_CODEGEN,
  figma: null,
  seed: seedDoc,
  defaultViewport: 'phone',
};
