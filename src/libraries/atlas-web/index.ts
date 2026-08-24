import { buildSemanticTokens } from '../../tokens/brand';
import type { UiLibrary } from '../types';
import { ATLAS_WEB_CODEGEN } from './composer/codegen';
import { composerConfig } from './composer/registry';
import { seedDoc } from './composer/seed';
import { ATLAS_ATOM_SECTIONS } from './showcase/atoms';
import { ATLAS_MOLECULE_SECTIONS } from './showcase/molecules';
import { ATLAS_ORGANISM_SECTIONS } from './showcase/organisms';
import { ATLAS_COMPONENT_TOKENS } from './tokens/component';
import { ATLAS_GLOBAL_TOKENS } from './tokens/global';
import { ATLAS_LEVERS } from './tokens/levers';
import { ATLAS_DEFAULT_PRESET, ATLAS_PRESETS } from './tokens/presets';
import { ATLAS_STATUS_TOKENS } from './tokens/status';
import './fonts.css';
import './components/atoms/atoms.css';
import './components/molecules/molecules.css';
import './components/organisms/organisms.css';

/**
 * The Atlas Web pack: the atlasmotors.com website design system — literal
 * production token ramps, Geist, and a website component catalog.
 * CSS side-effect imports above ride this pack's code-split chunk.
 * No Figma library is mapped yet (figma: null).
 */
export const atlasWebLibrary: UiLibrary = {
  id: 'atlas-web',
  name: 'Atlas Web',
  tagline: 'atlasmotors.com website design system — global · brand · component',
  globalTokens: ATLAS_GLOBAL_TOKENS,
  componentTokens: ATLAS_COMPONENT_TOKENS,
  buildSemantic: (brand) => buildSemanticTokens(brand, ATLAS_STATUS_TOKENS),
  presets: ATLAS_PRESETS,
  defaultPreset: ATLAS_DEFAULT_PRESET,
  levers: ATLAS_LEVERS,
  cssFiles: [
    'src/libraries/atlas-web/components/atoms/atoms.css',
    'src/libraries/atlas-web/components/molecules/molecules.css',
    'src/libraries/atlas-web/components/organisms/organisms.css',
  ],
  tiers: [
    {
      id: 'atoms',
      title: 'Atoms',
      blurb: 'The primitives: buttons, CTAs, chips, form fields, type ramp.',
      sections: ATLAS_ATOM_SECTIONS,
    },
    {
      id: 'molecules',
      title: 'Molecules',
      blurb:
        'Website compositions: spec cards, FAQs, dealer cards, price tags.',
      sections: ATLAS_MOLECULE_SECTIONS,
    },
    {
      id: 'organisms',
      title: 'Organisms',
      blurb:
        'Full page sections: header, masthead, model compare, dealer locator, footer.',
      sections: ATLAS_ORGANISM_SECTIONS,
    },
  ],
  composerConfig,
  codegen: ATLAS_WEB_CODEGEN,
  figma: null,
  seed: seedDoc,
  defaultViewport: 'desktop',
};
