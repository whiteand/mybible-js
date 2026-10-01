import Database from "better-sqlite3";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { readBibleModule } from "./readBibleModule.ts";

const directories: string[] = [];

afterEach(() => {
  for (const dir of directories.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function createModule(fileName: string): string {
  const dir = mkdtempSync(path.join(tmpdir(), "mybible-"));
  directories.push(dir);
  const filePath = path.join(dir, fileName);
  const db = new Database(filePath);
  db.exec(`
    CREATE TABLE info (
      name TEXT NOT NULL,
      value TEXT NOT NULL,
      PRIMARY KEY (name)
    );
    CREATE TABLE books (
      book_number NUMERIC NOT NULL,
      short_name TEXT NOT NULL,
      long_name TEXT NOT NULL,
      book_color TEXT NOT NULL,
      PRIMARY KEY (book_number)
    );
    CREATE TABLE verses (
      book_number NUMERIC,
      chapter NUMERIC,
      verse NUMERIC,
      text TEXT
    );
  `);
  const insertInfo = db.prepare(
    "INSERT INTO info (name, value) VALUES (?, ?)",
  );
  insertInfo.run("language", "en");
  insertInfo.run("description", "Test module");
  insertInfo.run("history_of_changes", "Initial");
  insertInfo.run("strong_numbers", "true");

  const insertBook = db.prepare(
    "INSERT INTO books (book_number, short_name, long_name, book_color) VALUES (?, ?, ?, ?)",
  );
  insertBook.run(470, "Mat", "Matthew", "0000ff");
  insertBook.run(10, "Gen", "Genesis", "000000");

  const insertVerse = db.prepare(
    "INSERT INTO verses (book_number, chapter, verse, text) VALUES (?, ?, ?, ?)",
  );
  insertVerse.run(20, 1, 1, "Exodus");
  insertVerse.run(10, 2, 1, "chapter two");
  insertVerse.run(10, 1, 2, "second");
  insertVerse.run(10, 1, 1, null);
  db.close();
  return filePath;
}

describe("readBibleModule", () => {
  it("throws when the path is not a bible module", () => {
    expect(() => readBibleModule("ESV.commentaries.SQLite3")).toThrow(
      "Unexpected name for the bible module: ESV.commentaries.SQLite3",
    );
  });

  it("throws when the file does not exist", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "mybible-"));
    directories.push(dir);
    const filePath = path.join(dir, "Missing.SQLite3");
    expect(() => readBibleModule(filePath)).toThrow();
  });

  it("uses the file name as the module id", () => {
    const filePath = createModule("ESV.SQLite3");
    expect(readBibleModule(filePath).id).toBe("ESV");
  });

  it("returns books in book-number order", () => {
    const filePath = createModule("ESV.SQLite3");
    expect(readBibleModule(filePath).books.map((book) => book.bookNumber)).toEqual([
      10, 470,
    ]);
  });

  it("returns verses in book, chapter, and verse order", () => {
    const filePath = createModule("ESV.SQLite3");
    expect(
      readBibleModule(filePath).verses.map((verse) => [
        verse.bookNumber,
        verse.chapter,
        verse.verse,
        verse.text,
      ]),
    ).toEqual([
      [10, 1, 1, null],
      [10, 1, 2, "second"],
      [10, 2, 1, "chapter two"],
      [20, 1, 1, "Exodus"],
    ]);
  });

  it("converts info keys to camel case and flags to booleans", () => {
    const filePath = createModule("ESV.SQLite3");
    expect(readBibleModule(filePath).info).toEqual({
      description: "Test module",
      historyOfChanges: "Initial",
      language: "en",
      strongNumbers: true,
    });
  });
});
