<!-- fallow:agent-install v1 authored sha256=770133bbbc5e745c5b852acb327f7190f83f309ce98f302e9c220cb194532117 -->
# AGENTS.md

`@whiteand/mybible` is a Node library that reads [MyBible](https://mybible.zone) bible modules (`.SQLite3`) and the small HTML dialect used in verse text. It is not an app. Published API is the `src/index.ts` barrel, built to `dist/` as ESM plus declarations.

## Layout

- `src/index.ts` — package entry. Re-export anything consumers should call, and add it to the export check in `src/index.test.ts`.
- `src/readBibleModule.ts` — opens the database read-only (`fileMustExist: true`) and loads `info`, `books`, and `verses`.
- `src/bibleModulePath.ts` — accepts `*.SQLite3` and rejects `*.commentaries.SQLite3` and `*.dictionary.SQLite3`.
- `src/bibleModuleInfo.ts` — validates the `info` table with quartet. Not a package entry.
- `src/bookNumber.ts` — MyBible book numbers taken from `ESV.SQLite3` (Matthew is `470`). Numbers have gaps. Do not renumber or invent missing books.
- `src/strongLanguage.ts` — `"H"` before Matthew, `"G"` from `BookNumber.Matthew` up.
- `src/getBookBy*.ts`, `src/getVerse*.ts` — in-memory lookups. Return `null` when nothing matches. `longName` is case-sensitive.
- `src/html/` — verse HTML. Public helpers are `htmlToPlain`, `htmlToStrongIds`, `htmlToStream`, and `streamToHtml` (`src/html/index.ts`). `tags.ts`, `types.ts`, and `takeElement.ts` stay internal.
- `src/types.ts`, `src/utils/` — internal. `utils/` is not part of the package API.
- `sources/` — local `.SQLite3` files. Gitignored. Tests must not read it.

SQLite columns are `snake_case`. Map them to `camelCase` in SQL aliases or `snakeCaseToCamelCase`. Schema the reader expects: `info(name, value)`, `books(book_number, short_name, long_name, book_color)`, `verses(book_number, chapter, verse, text)`.

Verse HTML uses the short tags in `DEFINED_TAGS` (`E`, `F`, `S`, `M`, `N`, `PB`, `I`, `T`, `J`, `SMALL`, `BR`, `H`). Unknown tags throw. `htmlToPlain` drops footnote, Strong's, morphology, and note contents. `htmlToStream` and `streamToHtml` are inverses.

`better-sqlite3` is a peer dependency (native addon). `node-html-parser` and `quartet` are direct dependencies.

## Commands

Package manager is [nub](https://github.com/nubjs/nub) (`packageManager` in `package.json`). Use `nub`, not npm or pnpm, inside this repo.

- Install: `nub install`
- Typecheck: `nub run typecheck` (`tsc --noEmit`)
- Test: `nub run test` (Vitest, colocated `*.test.ts`)
- Coverage: `nub run test:coverage`
- Build: `nub run build` (Vite library build, ESM, `vite-plugin-dts`)
- Mutation tests: `nub run stryker`
- `prepublish` runs typecheck, test, then build

There is no ESLint or Prettier script. Typecheck and tests are the checks.

## Working on the code

- ESM with `.ts` import specifiers. Use `import type` for types (`verbatimModuleSyntax`).
- `tsconfig.json` is strict, including `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- One module, one job. Colocate the Vitest file next to the source.
- Database tests build a temporary SQLite file and delete it in `afterEach`. Do not commit module files.
- Lookups return `null`. Invalid module paths, failed info validation, and unknown HTML tags throw.
- Keep the database open read-only.

Ask before changing any of these:

- Public exports, or the signatures of anything `src/index.ts` re-exports
- `BookNumber` values or the New Testament cutoff
- The quartet schema in `bibleModuleInfo.ts` (unknown `info` keys already fail)
- Accepted file suffixes
- Dependencies, version bumps, or publishing

Do not edit `dist/`, `coverage/`, `reports/`, `.stryker-tmp/`, or `sources/`.

## Fallow

Before a commit or a PR, follow the local gate and task map below. Use `fallow` with `--format json --quiet` and parse stdout as JSON.

<!-- generated:task-matrix:start -->
| When the agent is about to...                                     | Run                                                                                                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delete an "unused" export or file                                 | `fallow dead-code --trace <file>:<export>`                                                                                                              |
| prove a TypeScript symbol's exact consumers before refactoring    | `fallow dead-code --type-aware --symbol-impact <file>:<export-or-class.method>`                                                                         |
| find how one module reaches another                               | `fallow trace --path <from> <to>` (Reports `reachable: false` instead of failing when no import path exists; type-only hops are reported, not skipped.) |
| delete an "unused" dependency                                     | `fallow dead-code --trace-dependency <name>`                                                                                                            |
| commit or open a PR                                               | `fallow audit --base <ref>`                                                                                                                             |
| read a diff before approving it                                   | `fallow review --base <ref> --brief` (orientation, never gates: deterministic and always exit 0, unlike the audit row)                                  |
| prioritize refactoring                                            | `fallow health --hotspots --targets`                                                                                                                    |
| ask who owns code                                                 | `fallow health --ownership`                                                                                                                             |
| check untested-but-reachable code                                 | `fallow health --coverage-gaps`                                                                                                                         |
| consolidate duplication                                           | `fallow dupes --trace dup:<fingerprint>`                                                                                                                |
| find feature flags                                                | `fallow flags`                                                                                                                                          |
| check which architecture rules apply to a file before changing it | `fallow guard <files>`                                                                                                                                  |
| surface security candidates                                       | `fallow security`                                                                                                                                       |
| understand a finding                                              | `fallow explain <issue-type>`                                                                                                                           |
| scope a monorepo                                                  | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command)                                                                    |
<!-- generated:task-matrix:end -->

<!-- fallow:setup-hooks:start -->
## Fallow local gate

Before any `git commit` or `git push`, run `fallow audit --format json --quiet --explain --gate-marker agent`. If the verdict is `fail`, fix the reported findings before retrying. Treat JSON runtime errors like `{ "error": true, ... }` as non-blocking.

Audit defaults to `gate=new-only`: only findings introduced by the current changeset affect the verdict. Inherited findings on touched files are reported under `attribution` and annotated with `introduced: false`, but do not block the commit. Set `[audit] gate = "all"` in `fallow.toml` to gate every finding in changed files.

For non-skill agents, treat the task map below as the local onboarding source: run the listed fallow command before destructive edits, before commits, and before pull request handoff.

## Fallow task map

| When the agent is about to...                                     | Run                                                                                                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delete an "unused" export or file                                 | `fallow dead-code --trace <file>:<export>`                                                                                                              |
| prove a TypeScript symbol's exact consumers before refactoring    | `fallow dead-code --type-aware --symbol-impact <file>:<export-or-class.method>`                                                                         |
| find how one module reaches another                               | `fallow trace --path <from> <to>` (Reports `reachable: false` instead of failing when no import path exists; type-only hops are reported, not skipped.) |
| delete an "unused" dependency                                     | `fallow dead-code --trace-dependency <name>`                                                                                                            |
| commit or open a PR                                               | `fallow audit --base <ref>`                                                                                                                             |
| read a diff before approving it                                   | `fallow review --base <ref> --brief` (orientation, never gates: deterministic and always exit 0, unlike the audit row)                                  |
| prioritize refactoring                                            | `fallow health --hotspots --targets`                                                                                                                    |
| ask who owns code                                                 | `fallow health --ownership`                                                                                                                             |
| check untested-but-reachable code                                 | `fallow health --coverage-gaps`                                                                                                                         |
| consolidate duplication                                           | `fallow dupes --trace dup:<fingerprint>`                                                                                                                |
| find feature flags                                                | `fallow flags`                                                                                                                                          |
| check which architecture rules apply to a file before changing it | `fallow guard <files>`                                                                                                                                  |
| surface security candidates                                       | `fallow security`                                                                                                                                       |
| understand a finding                                              | `fallow explain <issue-type>`                                                                                                                           |
| scope a monorepo                                                  | `--workspace <glob> / --changed-workspaces <ref>` (global flags, prefix any command)                                                                    |
<!-- fallow:setup-hooks:end -->
