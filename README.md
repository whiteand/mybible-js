![fallow health](.github/badges/health.svg)

# @whiteand/mybible

Read [MyBible](https://mybible.zone) `.SQLite3` modules in Node.js: books, verses, module info, and the HTML used in verse text.

Requires Node and [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) (native addon, peer dependency).

## Install

```bash
npm install @whiteand/mybible better-sqlite3
```

## Usage

```ts
import { readBibleModule, getVerse, htmlToPlain } from "@whiteand/mybible";

const module = readBibleModule("./UBIO.SQLite3");

const verse = getVerse(module, 10, 1, 1); // Genesis 1:1
if (verse?.text) {
  console.log(htmlToPlain(verse.text));
}
```

`readBibleModule` opens the file read-only and returns `{ id, info, books, verses }`. The path must end in `.SQLite3`. Commentary (`.commentaries.SQLite3`) and dictionary (`.dictionary.SQLite3`) files are rejected.

Book numbers follow the MyBible scheme (Matthew is `470`). `strongLanguageForBook` returns `"H"` for the Old Testament and `"G"` for the New Testament.

## Verse HTML

Verse `text` is a small HTML subset (emphasis, footnotes, Strong's numbers, and similar). Helpers:

| Function                        | Result                        |
| ------------------------------- | ----------------------------- |
| `htmlToPlain`                   | Plain text                    |
| `htmlToStrongIds`               | Strong's numbers in the verse |
| `htmlToStream` / `streamToHtml` | Token stream and the reverse  |

## Lookup

- `getBookByNumber`, `getBookByLongName`, `getBookBy`
- `getVerse`, `getVerseBy`

Lookups return `null` when nothing matches.
