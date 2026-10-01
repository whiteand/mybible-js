import { describe, expect, it } from "vitest";
import { parseBibleModuleInfo } from "./bibleModuleInfo.ts";

function validInfo(
  extra: Record<string, string> = {},
): Record<string, string> {
  return {
    description: "English Standard Version",
    historyOfChanges: "Initial",
    language: "en",
    ...extra,
  };
}

describe("parseBibleModuleInfo", () => {
  it("parses the required text fields", () => {
    expect(parseBibleModuleInfo(validInfo())).toEqual({
      description: "English Standard Version",
      historyOfChanges: "Initial",
      language: "en",
    });
  });

  it("accepts Original as a language", () => {
    expect(parseBibleModuleInfo(validInfo({ language: "Original" })).language).toBe(
      "Original",
    );
  });

  it("converts a true flag into a boolean", () => {
    expect(
      parseBibleModuleInfo(validInfo({ strongNumbers: "true" })).strongNumbers,
    ).toBe(true);
  });

  it("converts a false flag into a boolean", () => {
    expect(
      parseBibleModuleInfo(validInfo({ containsAccents: "false" }))
        .containsAccents,
    ).toBe(false);
  });

  it("keeps an optional text field as a string", () => {
    expect(
      parseBibleModuleInfo(validInfo({ chapterString: "Chapter" })).chapterString,
    ).toBe("Chapter");
  });

  it("accepts the Greek Strong's prefix", () => {
    expect(
      parseBibleModuleInfo(validInfo({ strongNumbersPrefix: "G" }))
        .strongNumbersPrefix,
    ).toBe("G");
  });

  it("returns fields in sorted order", () => {
    expect(
      Object.keys(
        parseBibleModuleInfo(
          validInfo({ strongNumbers: "true", chapterString: "Chapter" }),
        ),
      ),
    ).toEqual([
      "chapterString",
      "description",
      "historyOfChanges",
      "language",
      "strongNumbers",
    ]);
  });

  it("throws when a required field is missing", () => {
    const { description: _description, ...withoutDescription } = validInfo();
    expect(() => parseBibleModuleInfo(withoutDescription)).toThrow(
      /Invalid info/,
    );
  });

  it("throws when the language is not allowed", () => {
    expect(() =>
      parseBibleModuleInfo(validInfo({ language: "de" })),
    ).toThrow(/Invalid info/);
  });

  it("throws when an unknown field is present", () => {
    expect(() =>
      parseBibleModuleInfo(validInfo({ publisher: "Crossway" })),
    ).toThrow(/Invalid info/);
  });

  it("throws when a flag is not true or false", () => {
    expect(() =>
      parseBibleModuleInfo(validInfo({ rightToLeft: "yes" })),
    ).toThrow(/Invalid info/);
  });
});
