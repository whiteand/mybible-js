import { describe, expect, it } from "vitest";
import { BookNumber } from "./bookNumber.ts";
import { getVerseBy } from "./getVerseBy.ts";
import type { BibleModule, VerseRow } from "./types.ts";

const john11: VerseRow = {
  bookNumber: BookNumber.John,
  chapter: 1,
  verse: 1,
  text: "In the beginning",
};

const john12: VerseRow = {
  bookNumber: BookNumber.John,
  chapter: 1,
  verse: 2,
  text: "He was in the beginning",
};

function moduleWith(verses: VerseRow[]): BibleModule {
  return {
    id: "test",
    verses,
    books: [],
    info: {} as BibleModule["info"],
  };
}

describe("getVerseBy", () => {
  it("returns null when the module has no verses", () => {
    expect(getVerseBy(moduleWith([]), () => true)).toBeNull();
  });

  it("returns null when no verse matches", () => {
    expect(
      getVerseBy(moduleWith([john11]), (verse) => verse.chapter === 2),
    ).toBeNull();
  });

  it("returns the first verse that matches", () => {
    expect(
      getVerseBy(
        moduleWith([john11, john12]),
        (verse) => verse.bookNumber === BookNumber.John,
      ),
    ).toBe(john11);
  });
});
