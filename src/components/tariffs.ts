/**
 * Tariff footnotes — the regulatory/commercial small print that sits under a
 * pricing table. Kept out of `data.ts` because these are copy, not domain
 * fixtures, and product edits them independently of the station data.
 */
export const SAMPLE_TARIFF_NOTES: string[] = [
  'Prices include GST. Member rates require an active subscription.',
  'Idle fees begin 10 minutes after the session reaches 100%.',
  'Tariffs are locked at session start and shown on the receipt.',
];
