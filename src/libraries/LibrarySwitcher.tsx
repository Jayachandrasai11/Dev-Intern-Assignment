import { useLibrary } from './useLibrary';
import type { LibraryId } from './types';

/** Header dropdown for switching the active UI library. */
export function LibrarySwitcher() {
  const { libraries, meta, switchLibrary } = useLibrary();
  return (
    <label className="lib-switcher">
      <span className="lib-switcher__label">UI library</span>
      <select
        className="lib-switcher__select"
        value={meta.id}
        onChange={(e) => switchLibrary(e.target.value as LibraryId)}
        aria-label="Active UI library"
      >
        {libraries.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
    </label>
  );
}
