import { getBookBy } from "./getBookBy.ts";
import type { BibleModule, BookRow } from "./types.ts";

export function getBookByNumber(
  bibleModule: BibleModule,
  bookNumber: number,
): BookRow | null {
  return getBookBy(bibleModule, (book) => book.bookNumber === bookNumber);
}
