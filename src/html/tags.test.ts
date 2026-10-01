import { describe, expect, it } from "vitest";
import { DEFINED_TAGS } from "./tags.ts";

describe("DEFINED_TAGS", () => {
  it("maps each verse HTML tag to its role", () => {
    expect(DEFINED_TAGS).toEqual({
      N: { tagName: "note" },
      F: { tagName: "footnote" },
      E: { tagName: "emphasized" },
      S: { tagName: "strong" },
      M: { tagName: "morphology" },
      PB: { tagName: "paragraphBreak" },
      I: { tagName: "inserted" },
      T: { tagName: "indent" },
      J: { tagName: "jesus" },
      SMALL: { tagName: "small" },
      BR: { tagName: "br" },
      H: { tagName: "subheading" },
    });
  });
});
