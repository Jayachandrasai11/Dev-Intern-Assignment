import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('theme panel shell', () => {
  it('keeps a constant corner radius while library radius settings change', () => {
    const css = readFileSync(
      join(process.cwd(), 'src/playground/themepanel.css'),
      'utf8',
    );
    const panelRule = css.match(/\.tp\s*\{[^}]+\}/)?.[0] ?? '';
    expect(panelRule).toContain('border-radius: 20px');
    expect(panelRule).not.toMatch(/border-radius:\s*var\(--ev-radius/);
  });
});
