import { useContext } from 'react';
import { LibraryContext } from './LibraryProvider';
import type { LibraryContextValue } from './LibraryProvider';

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used inside <LibraryProvider>');
  }
  return ctx;
}
