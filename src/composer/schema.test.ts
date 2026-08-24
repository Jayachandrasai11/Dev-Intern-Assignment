import { describe, expect, it } from 'vitest';
import {
  addScreen,
  createDoc,
  deleteScreen,
  duplicateScreen,
  loadDoc,
  parseDoc,
  patchScreen,
  renameScreen,
  saveDoc,
  screenPosition,
  storageKeyFor,
} from './schema';

function fakeStorage(initial: Record<string, string> = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

describe('screen operations', () => {
  it('adds screens with cascading positions and empty puck data', () => {
    let doc = createDoc('volt');
    doc = addScreen(doc, 'Discovery');
    doc = addScreen(doc, 'Session');
    expect(doc.screens).toHaveLength(2);
    expect(doc.screens[0].x).toBe(screenPosition(0).x);
    expect(doc.screens[1].x).toBeGreaterThan(doc.screens[0].x);
    expect(doc.screens[0].puckData).toEqual({ content: [], root: { props: {} } });
    expect(doc.screens[0].viewport).toBe('phone');
  });

  it('duplicates with new id, offset position, and deep-copied data', () => {
    let doc = addScreen(createDoc('volt'), 'Discovery');
    doc.screens[0].puckData.content.push({
      type: 'Button',
      props: { id: 'b1' },
    });
    const dup = duplicateScreen(doc, doc.screens[0].id);
    expect(dup.screens).toHaveLength(2);
    const [a, b] = dup.screens;
    expect(b.id).not.toBe(a.id);
    expect(b.name).toBe('Discovery copy');
    expect(b.puckData).toEqual(a.puckData);
    expect(b.puckData).not.toBe(a.puckData);
  });

  it('renames, patches, and deletes immutably', () => {
    const doc = addScreen(createDoc('volt'), 'A');
    const id = doc.screens[0].id;
    expect(renameScreen(doc, id, 'B').screens[0].name).toBe('B');
    expect(patchScreen(doc, id, { x: 999 }).screens[0].x).toBe(999);
    expect(deleteScreen(doc, id).screens).toHaveLength(0);
    expect(doc.screens[0].name).toBe('A'); // original untouched
  });
});

describe('persistence', () => {
  it('round-trips through storage', () => {
    const storage = fakeStorage();
    const doc = addScreen(createDoc('volt'), 'Discovery');
    saveDoc(doc, storage);
    expect(loadDoc('volt', storage)).toEqual(doc);
  });

  it('returns null for missing, corrupt, or wrong-shape state', () => {
    expect(loadDoc('volt', fakeStorage())).toBeNull();
    expect(loadDoc('volt', fakeStorage({ [storageKeyFor('volt')]: 'not json{' }))).toBeNull();
    expect(
      loadDoc(
        'volt',
        fakeStorage({
          [storageKeyFor('volt')]: JSON.stringify({ version: 2 }),
        }),
      ),
    ).toBeNull();
    expect(
      loadDoc(
        'volt',
        fakeStorage({
          [storageKeyFor('volt')]: JSON.stringify({ version: 1, screens: 'nope' }),
        }),
      ),
    ).toBeNull();
  });

  it('saves under the per-library key', () => {
    const storage = fakeStorage();
    const doc = createDoc('volt');
    saveDoc(doc, storage);
    expect(storage.getItem('prism-ui-composer-doc:volt')).toBeTruthy();
    expect(storage.getItem('volt-composer-doc')).toBeNull();
  });

  it('migrates v1 docs to v2 with library volt', () => {
    const v1 = {
      version: 1,
      brand: { accentHex: '#00c16a' },
      screens: [],
    };
    const parsed = parseDoc(JSON.stringify(v1));
    expect(parsed).toMatchObject({ version: 2, library: 'volt' });
  });

  it('falls back to the legacy volt key read-only', () => {
    const legacy = {
      version: 1,
      brand: { accentHex: '#00c16a' },
      screens: [],
    };
    const storage = fakeStorage({
      'volt-composer-doc': JSON.stringify(legacy),
    });
    const doc = loadDoc('volt', storage);
    expect(doc).toMatchObject({ version: 2, library: 'volt' });
    // legacy key untouched until the next save writes the new key
    expect(storage.getItem('prism-ui-composer-doc:volt')).toBeNull();
  });

  it('falls back to docs saved under the former vector name', () => {
    const saved = createDoc('atlas-web');
    const storage = fakeStorage({
      'vector-composer-doc:atlas-web': JSON.stringify(saved),
    });
    expect(loadDoc('atlas-web', storage)).toMatchObject({
      version: 2,
      library: 'atlas-web',
    });
  });

  it('never loads a doc from another library', () => {
    const other = createDoc('atlas-web');
    const storage = fakeStorage({
      [storageKeyFor('volt')]: JSON.stringify(other),
    });
    expect(loadDoc('volt', storage)).toBeNull();
  });
});
