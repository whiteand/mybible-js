import { describe, expect, it } from "vitest";
import { BookNumber } from "./bookNumber.ts";
import { getBookByLongName } from "./getBookByLongName.ts";
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

describe("getBookByLongName", () => {
  it("returns null when no book has that long name", () => {
    expect(getBookByLongName(moduleWith([genesis]), "Matthew")).toBeNull();
  });

  it("returns the book with that long name", () => {
    expect(
      getBookByLongName(moduleWith([genesis, matthew]), "Matthew"),
    ).toBe(matthew);
  });

  it("does not match a partial long name", () => {
    expect(getBookByLongName(moduleWith([genesis]), "Gen")).toBeNull();
  });
});
