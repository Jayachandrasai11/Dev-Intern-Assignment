import type { LibraryId, UiLibraryMeta } from './types';

/** The UI library manifest. Packs are code-split behind dynamic imports so
 *  only the active library's components/CSS ever load. */
export const LIBRARIES: UiLibraryMeta[] = [
  {
    id: 'volt',
    name: 'Volt',
    load: () => import('./volt').then((m) => m.voltLibrary),
  },
  {
    id: 'atlas-web',
    name: 'Atlas Web',
    load: () => import('./atlas-web').then((m) => m.atlasWebLibrary),
  },
  {
    id: 'atlas-charge',
    name: 'Atlas Charge',
    load: () => import('./atlas-charge').then((m) => m.atlasChargeLibrary),
  },
];

export const DEFAULT_LIBRARY_ID: LibraryId = 'volt';

/** localStorage key for the active library id. */
export const ACTIVE_LIBRARY_KEY = 'prism-ui-active-library';

/** Keys from former app names, newest first — read-once, never written. */
export const LEGACY_ACTIVE_LIBRARY_KEYS = ['vector-active-library'];

export function libraryMeta(id: string | null): UiLibraryMeta {
  return LIBRARIES.find((l) => l.id === id) ?? LIBRARIES[0];
}
