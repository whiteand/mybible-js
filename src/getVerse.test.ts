import { describe, expect, it } from "vitest";
import { BookNumber } from "./bookNumber.ts";
import { getVerse } from "./getVerse.ts";
import type { BibleModule, VerseRow } from "./types.ts";

const genesis11: VerseRow = {
  bookNumber: BookNumber.Genesis,
  chapter: 1,
  verse: 1,
  text: "In the beginning",
};

const john11: VerseRow = {
  bookNumber: BookNumber.John,
  chapter: 1,
  verse: 1,
  text: "In the beginning was the Word",
};

function moduleWith(verses: VerseRow[]): BibleModule {
  return {
    id: "test",
    verses,
    books: [],
    info: {} as BibleModule["info"],
  };
}

describe("getVerse", () => {
  it("returns null when the module has no verses", () => {
    expect(getVerse(moduleWith([]), BookNumber.John, 1, 1)).toBeNull();
  });

  it("returns the verse for that book, chapter, and verse", () => {
    expect(getVerse(moduleWith([genesis11, john11]), BookNumber.John, 1, 1)).toBe(
      john11,
    );
  });

  it("returns null when the book number differs", () => {
    expect(getVerse(moduleWith([john11]), BookNumber.Genesis, 1, 1)).toBeNull();
  });

  it("returns null when the chapter differs", () => {
    expect(getVerse(moduleWith([john11]), BookNumber.John, 2, 1)).toBeNull();
  });

  it("returns null when the verse number differs", () => {
    expect(getVerse(moduleWith([john11]), BookNumber.John, 1, 2)).toBeNull();
  });
});
