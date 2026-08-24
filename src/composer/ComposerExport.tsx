import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import type { TokenLayerDef } from '../tokens/types';
import type { CodegenPack } from './codegen';
import { puckDataToJsx, pascalCase } from './codegen';
import type { FigmaPack } from './figmaMap';
import { docToFigmaSync } from './figmaMap';
import type { ComposerDoc } from './schema';
import { parseDoc } from './schema';

function download(filename: string, content: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ComposerExport({
  doc,
  codegen,
  figma,
  globalTokens,
  open,
  onOpenChange,
  onImport,
}: {
  doc: ComposerDoc;
  /** The active UI library's codegen pack. */
  codegen: CodegenPack;
  /** The active UI library's Figma pack — null when none is mapped. */
  figma: FigmaPack | null;
  globalTokens: TokenLayerDef;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (doc: ComposerDoc) => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const jsxFor = (screenId: string) => {
    const screen = doc.screens.find((s) => s.id === screenId)!;
    return puckDataToJsx(screen.puckData, screen.name, codegen);
  };
  const copy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };
  const importFile = (file: File) => {
    file.text().then((raw) => {
      const parsed = parseDoc(raw);
      if (!parsed) {
        setImportError('Not a valid composer document.');
        return;
      }
      if (parsed.library !== doc.library) {
        setImportError(
          `That document belongs to the "${parsed.library}" UI library — switch to it first.`,
        );
        return;
      }
      setImportError(null);
      onImport(parsed);
      onOpenChange(false);
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="ev-sheet__overlay" />
        <Dialog.Content className="xd" aria-describedby={undefined}>
          <Dialog.Title className="xd__title">Export screens</Dialog.Title>
          <ul className="xd__files">
            {doc.screens.map((s) => (
              <li key={s.id} className="xd__file">
                <div className="xd__file-info">
                  <code>{pascalCase(s.name)}Screen.tsx</code>
                  <span>
                    {s.name} · {s.puckData.content.length} top-level block(s)
                  </span>
                </div>
                <div className="xd__file-actions">
                  <button className="tp__action" onClick={() => copy(s.id, jsxFor(s.id))}>
                    {copied === s.id ? 'Copied ✓' : 'Copy JSX'}
                  </button>
                  <button
                    className="tp__action tp__action--primary"
                    onClick={() => download(`${pascalCase(s.name)}Screen.tsx`, jsxFor(s.id))}
                  >
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="xd__file">
            <div className="xd__file-info">
              <code>{`prism-ui-composer-doc-${doc.library}.json`}</code>
              <span>Whole document · {doc.screens.length} screen(s)</span>
            </div>
            <div className="xd__file-actions">
              <label className="tp__action" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                Import…
                <input
                  type="file"
                  accept="application/json"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])}
                />
              </label>
              <button
                className="tp__action tp__action--primary"
                onClick={() =>
                  download(
                    `prism-ui-composer-doc-${doc.library}.json`,
                    JSON.stringify(doc, null, 2),
                    'application/json',
                  )
                }
              >
                Download
              </button>
            </div>
          </div>
          {figma ? (
            <div className="xd__file">
              <div className="xd__file-info">
                <code>figma-sync.json</code>
                <span>
                  {figma.library} mapping · see scripts/figma-sync.md
                </span>
              </div>
              <div className="xd__file-actions">
                <button
                  className="tp__action tp__action--primary"
                  onClick={() =>
                    download(
                      'figma-sync.json',
                      JSON.stringify(docToFigmaSync(doc, figma, globalTokens), null, 2),
                      'application/json',
                    )
                  }
                >
                  Download
                </button>
              </div>
            </div>
          ) : (
            <div className="xd__file">
              <div className="xd__file-info">
                <code>figma-sync.json</code>
                <span>No Figma library is mapped for this UI library yet.</span>
              </div>
            </div>
          )}
          {importError && <p className="tp__error">{importError}</p>}
          <Dialog.Close asChild>
            <button className="tp__action">Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
