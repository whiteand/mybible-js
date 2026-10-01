import { describe, expect, it } from "vitest";
import { getBibleModuleId, isBibleModuleFilePath } from "./bibleModulePath.ts";

describe("isBibleModuleFilePath", () => {
  it("accepts a bible module path", () => {
    expect(isBibleModuleFilePath("sources/ESV.SQLite3")).toBe(true);
  });

  it("rejects a path that does not end in SQLite3", () => {
    expect(isBibleModuleFilePath("sources/ESV.txt")).toBe(false);
  });
  it("works for NA", () => {
    expect(isBibleModuleFilePath("sources/NA27ca.SQLite3")).toBe(true);
  });

  it("rejects a commentary module", () => {
    expect(isBibleModuleFilePath("sources/ESV.commentaries.SQLite3")).toBe(
      false,
    );
  });

  it("rejects a dictionary module", () => {
    expect(isBibleModuleFilePath("sources/Lexicon.dictionary.SQLite3")).toBe(
      false,
    );
  });

  it("ignores letter case in the extension", () => {
    expect(isBibleModuleFilePath("sources/ESV.sqlite3")).toBe(true);
  });

  it("ignores letter case when rejecting a commentary module", () => {
    expect(isBibleModuleFilePath("sources/ESV.Commentaries.sqlite3")).toBe(
      false,
    );
  });
});

describe("getBibleModuleId", () => {
  it("returns the file name without the extension", () => {
    expect(getBibleModuleId("UBIO_88.SQLite3")).toBe("UBIO_88");
  });

  it("uses the last path segment", () => {
    expect(getBibleModuleId("sources/modules/ESV.SQLite3")).toBe("ESV");
  });

  it("throws for a commentary path", () => {
    expect(() => getBibleModuleId("ESV.commentaries.SQLite3")).toThrow(
      "Invalid path: ESV.commentaries.SQLite3",
    );
  });

  it("throws for a path that is not a bible module", () => {
    expect(() => getBibleModuleId("ESV.txt")).toThrow("Invalid path: ESV.txt");
  });
});
