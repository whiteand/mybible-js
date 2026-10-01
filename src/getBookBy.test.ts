import { describe, expect, it } from "vitest";
import { BookNumber } from "./bookNumber.ts";
import { getBookBy } from "./getBookBy.ts";
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

describe("getBookBy", () => {
  it("returns null when the module has no books", () => {
    expect(getBookBy(moduleWith([]), () => true)).toBeNull();
  });

  it("returns null when no book matches", () => {
    expect(
      getBookBy(moduleWith([genesis]), (book) => book.shortName === "Mat"),
    ).toBeNull();
  });

  it("returns the first book that matches", () => {
    expect(
      getBookBy(
        moduleWith([genesis, matthew]),
        (book) => book.bookNumber >= BookNumber.Matthew,
      ),
    ).toBe(matthew);
  });
});
