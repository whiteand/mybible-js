import { describe, expect, it } from "vitest";
import { BookNumber } from "./bookNumber.ts";

describe("BookNumber", () => {
  it("numbers Genesis as the first book", () => {
    expect(BookNumber.Genesis).toBe(10);
  });

  it("numbers Matthew as the first New Testament book", () => {
    expect(BookNumber.Matthew).toBe(470);
  });

  it("numbers Revelation as the last book", () => {
    expect(BookNumber.Revelation).toBe(730);
  });
});
