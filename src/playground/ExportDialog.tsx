import * as Dialog from '@radix-ui/react-dialog';
import { useMemo, useState } from 'react';
import { buildDtcgFiles } from '../export/dtcg';
import type { DtcgFile } from '../export/dtcg';
import { copyFile, downloadFile } from '../export/figmaFiles';
import { useLibrary } from '../libraries/useLibrary';
import { useTheme } from '../theme/useTheme';

export function ExportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { layers, brand } = useTheme();
  const { library } = useLibrary();
  const files = useMemo(
    () => (open ? buildDtcgFiles(layers, library.levers) : []),
    [open, layers, library],
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="ev-sheet__overlay" />
        <Dialog.Content className="xd" aria-describedby="xd-desc">
          <Dialog.Title className="xd__title">
            Export tokens for Figma
          </Dialog.Title>
          <p className="xd__desc" id="xd-desc">
            W3C DTCG files for Figma&apos;s native variables import
            (Professional plan or higher), resolved for the current brand
            (<strong>{brand.name}</strong>). One file per collection mode —
            colors, dimensions, aliases and Figma&apos;s cross-collection
            alias extension included. Shadows are excluded (they are effect
            styles, not variables).
          </p>
          <ol className="xd__steps">
            <li>
              In Figma: <em>Variables panel → drag in</em>{' '}
              <code>primitives.value.tokens.json</code>, rename the new
              collection to <strong>Primitives</strong>.
            </li>
            <li>
              Drag both <code>semantic.*.tokens.json</code> files into one new
              collection (two modes), rename it <strong>Semantic</strong>.
            </li>
            <li>
              Drag <code>component.default.tokens.json</code> in last, rename
              it <strong>Component</strong>. Cross-collection aliases resolve
              by collection name — the renames matter.
            </li>
          </ol>
          <ul className="xd__files">
            {files.map((f) => (
              <FileRow key={f.filename} file={f} />
            ))}
          </ul>
          <Dialog.Close asChild>
            <button className="tp__action">Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FileRow({ file }: { file: DtcgFile }) {
  const [copied, setCopied] = useState(false);
  const tokenCount = countLeaves(file.json);
  return (
    <li className="xd__file">
      <div className="xd__file-info">
        <code>{file.filename}</code>
        <span>
          {file.collection} · mode “{file.mode}” · {tokenCount} tokens
        </span>
      </div>
      <div className="xd__file-actions">
        <button
          className="tp__action"
          onClick={async () => {
            await copyFile(file);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
        <button
          className="tp__action tp__action--primary"
          onClick={() => downloadFile(file)}
        >
          Download
        </button>
      </div>
    </li>
  );
}

function countLeaves(node: unknown): number {
  if (!node || typeof node !== 'object') return 0;
  const obj = node as Record<string, unknown>;
  if ('$value' in obj) return 1;
  return Object.values(obj).reduce<number>((n, v) => n + countLeaves(v), 0);
}
