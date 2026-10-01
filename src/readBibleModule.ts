import sqlite3, { type Database } from "better-sqlite3";
import {
  parseBibleModuleInfo,
  type BibleModuleInfo,
} from "./bibleModuleInfo.ts";
import { getBibleModuleId, isBibleModuleFilePath } from "./bibleModulePath.ts";
import type { BibleModule, BookRow, VerseRow } from "./types.ts";
import { snakeCaseToCamelCase } from "./utils/snakeCaseToCamelCase.ts";

function readVerses(db: Database): VerseRow[] {
  const statement = db.prepare<[], VerseRow>(
    `SELECT
  book_number AS bookNumber, chapter, verse, text
FROM verses
ORDER BY bookNumber ASC, chapter ASC, verse ASC;
  `,
  );
  return statement.all();
}
function readBooks(db: Database): BookRow[] {
  const statement = db.prepare<[], BookRow>(
    `SELECT
book_number AS bookNumber, short_name AS shortName, long_name AS longName, book_color AS bookColor
FROM books
ORDER BY bookNumber ASC;
  `,
  );
  return statement.all();
}

function parseBoolean(value: string | undefined) {
  if (value == null) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Unexpected value for boolean: ${JSON.stringify(value)}`);
}

function readInfo(db: Database): BibleModuleInfo {
  const statement = db.prepare<[], { name: string; value: string }>(
    `SELECT
name, value
FROM info
ORDER BY name ASC;
  `,
  );
  const kvs = statement.all();
  const rawInfo = Object.fromEntries(
    kvs.map((row) => [snakeCaseToCamelCase(row.name), row.value]),
  );

  return parseBibleModuleInfo(rawInfo);
}

export function readBibleModule(sqlitePath: string): BibleModule {
  if (!isBibleModuleFilePath(sqlitePath)) {
    throw new Error(`Unexpected name for the bible module: ${sqlitePath}`);
  }

  const db = sqlite3(sqlitePath, {
    fileMustExist: true,
    readonly: true,
  });

  const verses = readVerses(db);
  const books = readBooks(db);
  const info = readInfo(db);

  return {
    id: getBibleModuleId(sqlitePath),
    info,
    books,
    verses,
  };
}
