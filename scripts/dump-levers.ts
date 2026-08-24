/**
 * Dump a library's LeverSet as compact JSON for the Figma sync scripts
 * (P2+ of the lever-mode architecture). Usage:
 *
 *   npx vite-node scripts/dump-levers.ts [outPath]
 */
import { writeFileSync } from 'node:fs';
import { ATLAS_LEVERS } from '../src/libraries/atlas-web/tokens/levers';

const out = process.argv[2] ?? 'levers-dump.json';
writeFileSync(out, JSON.stringify(ATLAS_LEVERS));
console.log(
  `wrote ${out}:`,
  ATLAS_LEVERS.levers
    .map((l) => `${l.dimension} ${l.tokens.length}vars×${l.options.length}modes`)
    .join(' · '),
  `· ${ATLAS_LEVERS.forks.length} forks`,
);
