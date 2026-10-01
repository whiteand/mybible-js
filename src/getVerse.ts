import { getVerseBy } from "./getVerseBy.ts";
import type { BibleModule, VerseRow } from "./types.ts";

export function getVerse(
  bibleModule: BibleModule,
  bookNumber: number,
  chapter: number,
  verse: number,
): VerseRow | null {
  return getVerseBy(
    bibleModule,
    (v) =>
      v.bookNumber === bookNumber && v.chapter === chapter && v.verse === verse,
  );
}
