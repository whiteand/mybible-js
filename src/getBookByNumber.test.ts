import { describe, expect, it } from "vitest";
import { BookNumber } from "./bookNumber.ts";
import { getBookByNumber } from "./getBookByNumber.ts";
import type { BibleModule, BookRow } from "./types.ts";

const genesis: BookRow = {
  bookNumber: BookNumber.Genesis,
  shortName: "Gen",
  longName: "Genesis",
  bookColor: "000000",
};

const matthew: BookRow = {
  bookNumber: BookNumber.Matthew,
  shortName: "Mat",
  longName: "Matthew",
  bookColor: "0000ff",
};

function moduleWith(books: BookRow[]): BibleModule {
  return {
    id: "test",
    verses: [],
    books,
    info: {} as BibleModule["info"],
  };
}

describe("getBookByNumber", () => {
  it("returns null when the module has no books", () => {
    expect(getBookByNumber(moduleWith([]), BookNumber.Genesis)).toBeNull();
  });

  it("returns null when no book has that number", () => {
    expect(
      getBookByNumber(moduleWith([matthew]), BookNumber.Genesis),
    ).toBeNull();
  });

  it("returns the book with that number", () => {
    expect(
      getBookByNumber(moduleWith([genesis, matthew]), BookNumber.Matthew),
    ).toBe(matthew);
  });
});
