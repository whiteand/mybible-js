import type { BibleModule, BookRow } from "./types.ts";

export function getBookBy(
  bibleModule: BibleModule,
  pred: (book: BookRow) => boolean,
): BookRow | null {
  return bibleModule.books.find(pred) ?? null;
}
