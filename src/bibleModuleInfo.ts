import { e as v, type ValidatedBy } from "quartet";

const optionalBooleanString = ["true", "false", undefined] as const;

const isValidRawInfo = v({
  addSpaceBeforeFootnoteMarker: optionalBooleanString,
  associatedBundle: [v.string, undefined],
  associatedTheme: [v.string, undefined],
  chapterString: [v.string, undefined],
  chapterStringNt: [v.string, undefined],
  chapterStringOt: [v.string, undefined],
  chapterStringPs: [v.string, undefined],
  containsAccents: optionalBooleanString,
  description: v.string,
  detailedInfo: [v.string, undefined],
  historyOfChanges: v.string,
  htmlStyle: [v.string, undefined],
  hyperlinkLanguages: ["el/en", undefined],
  introductionString: [v.string, undefined],
  language: ["uk", "en", "grc", "ru", "Original"],
  localizedBookAbbreviations: optionalBooleanString,
  origin: [v.string, undefined],
  rightToLeft: optionalBooleanString,
  rightToLeftNt: optionalBooleanString,
  rightToLeftOt: optionalBooleanString,
  russianNumbering: optionalBooleanString,
  strongNumbers: optionalBooleanString,
  strongNumbersPrefix: ["G", undefined],
  swapsNonLocalizedWordsInMixedLanguageLine: optionalBooleanString,
  [v.rest]: v.never,
});

type ReplaceBooleans<T> = {
  [k in keyof T]: T[k] extends "true" | "false" | undefined
    ? boolean | undefined
    : T[k];
};

export type BibleModuleInfo = ReplaceBooleans<
  ValidatedBy<typeof isValidRawInfo>
>;

export function parseBibleModuleInfo(
  rawInfo: Record<string, string>,
): BibleModuleInfo {
  if (!isValidRawInfo(rawInfo)) {
    throw new Error(
      `Invalid info in ${rawInfo.description}: \n${JSON.stringify(isValidRawInfo.explanations)}`,
    );
  }
  return Object.fromEntries(
    Object.entries(rawInfo)
      .toSorted((a, b) => a[0].localeCompare(b[0]))
      .map((x) => [
        x[0],
        x[1] === "true" ? true : x[1] === "false" ? false : x[1],
      ]),
  ) as BibleModuleInfo;
}
