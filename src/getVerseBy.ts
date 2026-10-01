import type { BibleModule, VerseRow } from "./types.ts";

export function getVerseBy(
  bibleModule: BibleModule,
  pred: (verse: VerseRow) => boolean,
): VerseRow | null {
  return bibleModule.verses.find(pred) ?? null;
}
