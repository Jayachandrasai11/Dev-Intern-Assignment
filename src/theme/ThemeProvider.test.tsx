import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import type { BrandDefinition } from '../tokens/brand';
import { DEFAULT_PRESET } from './presets';
import { loadPersisted } from './ThemeProvider';

// Mock localStorage for testing
let store: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  clear: () => {
    store = {};
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

describe('ThemeProvider loadPersisted isolation (Issue #4)', () => {
  beforeEach(() => {
    store = {};
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('returns default when no persisted state exists', () => {
    const result = loadPersisted('nonexistent', [], DEFAULT_PRESET);
    expect(result).toEqual({ brand: DEFAULT_PRESET, appearance: 'light' });
  });

  it('loads persisted state for a single storageKey', () => {
    const saved = { brand: { ...DEFAULT_PRESET, accentHex: '#ff0000' }, appearance: 'dark' as const };
    localStorageMock.setItem('mystored', JSON.stringify(saved));

    const result = loadPersisted('mystored', [], DEFAULT_PRESET);
    expect(result).toEqual(saved);
  });

  it('isolates theme state between different storageKeys (Issue #4 core)', () => {
    const voltSaved = { brand: { name: 'Volt', accentHex: '#ff0000' }, appearance: 'dark' as const };
    const atlasSaved = { brand: { name: 'Atlas Web', accentHex: '#0066ff' }, appearance: 'light' as const };

    localStorageMock.setItem('prism-ui-theme:volt', JSON.stringify(voltSaved));
    localStorageMock.setItem('prism-ui-theme:atlas-web', JSON.stringify(atlasSaved));

    const voltResult = loadPersisted('prism-ui-theme:volt', [], DEFAULT_PRESET);
    const atlasResult = loadPersisted('prism-ui-theme:atlas-web', [], DEFAULT_PRESET);

    expect(voltResult.brand.accentHex).toBe('#ff0000');
    expect(atlasResult.brand.accentHex).toBe('#0066ff');
    expect(voltResult.appearance).toBe('dark');
    expect(atlasResult.appearance).toBe('light');
  });

  it('falls through corrupted JSON to next legacy key', () => {
    localStorageMock.setItem('current', 'invalid json');
    localStorageMock.setItem('legacy', JSON.stringify({ brand: { ...DEFAULT_PRESET, accentHex: '#00aa00' }, appearance: 'dark' as const }));

    const result = loadPersisted('current', ['legacy'], DEFAULT_PRESET);
    expect(result).toEqual({ brand: { ...DEFAULT_PRESET, accentHex: '#00aa00' }, appearance: 'dark' });
  });

  it('falls through to default when brand.accentHex is missing', () => {
    localStorageMock.setItem('current', JSON.stringify({ brand: { name: 'Custom' }, appearance: 'dark' }));

    const result = loadPersisted('current', [], DEFAULT_PRESET);
    expect(result).toEqual({ brand: DEFAULT_PRESET, appearance: 'light' });
  });

  it('falls through to default when appearance is missing', () => {
    localStorageMock.setItem('current', JSON.stringify({ brand: { ...DEFAULT_PRESET, accentHex: '#ff0000' } }));

    const result = loadPersisted('current', [], DEFAULT_PRESET);
    expect(result).toEqual({ brand: DEFAULT_PRESET, appearance: 'light' });
  });

  it('tries legacy keys when current key is missing', () => {
    localStorageMock.setItem('vector-theme:atlas-web', JSON.stringify({ brand: { ...DEFAULT_PRESET, accentHex: '#112233' }, appearance: 'dark' as const }));

    const result = loadPersisted('prism-ui-theme:atlas-web', ['vector-theme:atlas-web'], DEFAULT_PRESET);
    expect(result).toEqual({ brand: { ...DEFAULT_PRESET, accentHex: '#112233' }, appearance: 'dark' });
  });

  it('isolates defaults between libraries with no persisted state', () => {
    const voltDefault = { name: 'Volt', accentHex: '#00c16a' } as BrandDefinition;
    const atlasDefault = { name: 'Atlas', accentHex: '#ff5310' } as BrandDefinition;

    // No persisted state
    const voltResult = loadPersisted('prism-ui-theme:volt', [], voltDefault);
    const atlasResult = loadPersisted('prism-ui-theme:atlas-web', [], atlasDefault);

    expect(voltResult.brand.accentHex).toBe('#00c16a');
    expect(atlasResult.brand.accentHex).toBe('#ff5310');
    expect(voltResult).not.toEqual(atlasResult);
  });
});