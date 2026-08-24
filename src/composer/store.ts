import { useCallback, useEffect, useState } from 'react';
import type { LibraryId } from '../libraries/types';
import type { ComposerDoc } from './schema';
import { createDoc, loadDoc, saveDoc } from './schema';

/** Per-library composer document state with localStorage autosave. */
export function useComposerDoc(library: LibraryId, seed?: () => ComposerDoc) {
  const [doc, setDoc] = useState<ComposerDoc>(
    () => loadDoc(library) ?? (seed ? seed() : createDoc(library)),
  );

  useEffect(() => {
    saveDoc(doc);
  }, [doc]);

  const update = useCallback(
    (fn: (doc: ComposerDoc) => ComposerDoc) => setDoc((d) => fn(d)),
    [],
  );

  return { doc, update, replace: setDoc };
}
