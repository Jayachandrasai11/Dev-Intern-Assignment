import type { DtcgFile } from './dtcg';

export function fileJson(file: DtcgFile): string {
  return JSON.stringify(file.json, null, 2);
}

export function downloadFile(file: DtcgFile): void {
  const blob = new Blob([fileJson(file)], {
    type: 'application/design-tokens+json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function copyFile(file: DtcgFile): Promise<void> {
  await navigator.clipboard.writeText(fileJson(file));
}
