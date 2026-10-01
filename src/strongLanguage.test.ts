import { describe, expect, it } from "vitest";
import { BookNumber } from "./bookNumber.ts";
import {
  FIRST_NEW_TESTAMENT_BOOK_NUMBER,
  isNewTestamentBook,
  strongLanguageForBook,
} from "./strongLanguage.ts";

describe("isNewTestamentBook", () => {
  it("treats Matthew as the first New Testament book", () => {
    expect(FIRST_NEW_TESTAMENT_BOOK_NUMBER).toBe(BookNumber.Matthew);
    expect(isNewTestamentBook(BookNumber.Matthew)).toBe(true);
  });

  it("treats the book before Matthew as Old Testament", () => {
    expect(isNewTestamentBook(BookNumber.Malachi)).toBe(false);
  });

  it("treats a later book as New Testament", () => {
    expect(isNewTestamentBook(BookNumber.Revelation)).toBe(true);
  });
});

describe("strongLanguageForBook", () => {
  it("uses Hebrew for an Old Testament book", () => {
    expect(strongLanguageForBook(BookNumber.Genesis)).toBe("H");
  });

  it("uses Greek for a New Testament book", () => {
    expect(strongLanguageForBook(BookNumber.John)).toBe("G");
  });

  it("uses Greek from Matthew onward", () => {
    expect(strongLanguageForBook(BookNumber.Matthew)).toBe("G");
  });
});
