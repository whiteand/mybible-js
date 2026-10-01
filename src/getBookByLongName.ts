import { getBookBy } from "./getBookBy.ts";
import type { BibleModule, BookRow } from "./types.ts";

export function getBookByLongName(
  bibleModule: BibleModule,
  longName: string,
): BookRow | null {
  return getBookBy(bibleModule, (book) => book.longName === longName);
}
