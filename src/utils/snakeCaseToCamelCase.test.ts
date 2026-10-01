import { describe, expect, it } from "vitest";
import { snakeCaseToCamelCase } from "./snakeCaseToCamelCase.ts";

describe("snakeCaseToCamelCase", () => {
  it("returns an empty string unchanged", () => {
    expect(snakeCaseToCamelCase("")).toBe("");
  });

  it("leaves a single word unchanged", () => {
    expect(snakeCaseToCamelCase("description")).toBe("description");
  });

  it("capitalizes the word after an underscore", () => {
    expect(snakeCaseToCamelCase("strong_numbers")).toBe("strongNumbers");
  });

  it("capitalizes each word in a longer snake_case name", () => {
    expect(snakeCaseToCamelCase("add_space_before_footnote_marker")).toBe(
      "addSpaceBeforeFootnoteMarker",
    );
  });

  it("treats a space as a word separator", () => {
    expect(snakeCaseToCamelCase("history of changes")).toBe(
      "historyOfChanges",
    );
  });

  it("treats repeated separators as one break", () => {
    expect(snakeCaseToCamelCase("chapter__string")).toBe("chapterString");
  });

  it("does not capitalize a name that starts with a separator", () => {
    expect(snakeCaseToCamelCase("_language")).toBe("language");
  });

  it("still capitalizes words after a leading separator", () => {
    expect(snakeCaseToCamelCase("_language_code")).toBe("languageCode");
  });

  it("drops a trailing separator", () => {
    expect(snakeCaseToCamelCase("description_")).toBe("description");
  });

  it("keeps the case of letters that do not follow a separator", () => {
    expect(snakeCaseToCamelCase("HTML_style")).toBe("HTMLStyle");
  });
});
