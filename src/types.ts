import type { BibleModuleInfo } from "./bibleModuleInfo.ts";

export interface VerseRow {
  bookNumber: number;
  chapter: number;
  verse: number;
  text: string | null;
}

export interface BookRow {
  bookNumber: number;
  shortName: string;
  longName: string;
  bookColor: string;
}

export interface BibleModule {
  id: string;
  verses: VerseRow[];
  books: BookRow[];
  info: BibleModuleInfo;
}
