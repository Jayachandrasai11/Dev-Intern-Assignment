import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  ACTIVE_LIBRARY_KEY,
  LEGACY_ACTIVE_LIBRARY_KEYS,
  LIBRARIES,
  libraryMeta,
} from './index';
import type { LibraryId, UiLibrary, UiLibraryMeta } from './types';

export interface LibraryContextValue {
  /** Manifest entries, for the switcher dropdown. */
  libraries: UiLibraryMeta[];
  meta: UiLibraryMeta;
  /** The loaded pack — always set when children render (provider gates). */
  library: UiLibrary;
  switchLibrary: (id: LibraryId) => void;
}

export const LibraryContext = createContext<LibraryContextValue | null>(null);

function loadActiveId(): string | null {
  try {
    for (const key of [ACTIVE_LIBRARY_KEY, ...LEGACY_ACTIVE_LIBRARY_KEYS]) {
      const id = localStorage.getItem(key);
      if (id) return id;
    }
    return null;
  } catch {
    return null;
  }
}

function persistActiveId(id: LibraryId): void {
  try {
    localStorage.setItem(ACTIVE_LIBRARY_KEY, id);
  } catch {
    // best-effort persistence
  }
}

/**
 * Loads the active UI library pack and gates the app on it: children render
 * only once the pack (and its code-split CSS) is live, so the Puck preview
 * iframe never misses a stylesheet.
 */
export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMeta] = useState<UiLibraryMeta>(() =>
    libraryMeta(loadActiveId()),
  );
  const [library, setLibrary] = useState<UiLibrary | null>(null);

  useEffect(() => {
    let cancelled = false;
    meta.load().then((pack) => {
      if (!cancelled) setLibrary(pack);
    });
    return () => {
      cancelled = true;
    };
  }, [meta]);

  const switchLibrary = useCallback(
    (id: LibraryId) => {
      if (id === meta.id) return;
      persistActiveId(id);
      setLibrary(null);
      setMeta(libraryMeta(id));
    },
    [meta.id],
  );

  if (!library) {
    return <div className="lib-loading" aria-busy="true" />;
  }

  return (
    <LibraryContext.Provider
      value={{ libraries: LIBRARIES, meta, library, switchLibrary }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
