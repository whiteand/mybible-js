import { describe, expect, it } from "vitest";
import {
  getBibleModuleId,
  getBookBy,
  getBookByLongName,
  getBookByNumber,
  getVerse,
  getVerseBy,
  htmlToPlain,
  htmlToStream,
  htmlToStrongIds,
  readBibleModule,
  streamToHtml,
  strongLanguageForBook,
} from "./index.ts";

describe("package entry", () => {
  it("exports the public API", () => {
    expect(getBibleModuleId).toBeTypeOf("function");
    expect(getBookBy).toBeTypeOf("function");
    expect(getBookByLongName).toBeTypeOf("function");
    expect(getBookByNumber).toBeTypeOf("function");
    expect(getVerse).toBeTypeOf("function");
    expect(getVerseBy).toBeTypeOf("function");
    expect(htmlToPlain).toBeTypeOf("function");
    expect(htmlToStream).toBeTypeOf("function");
    expect(htmlToStrongIds).toBeTypeOf("function");
    expect(readBibleModule).toBeTypeOf("function");
    expect(streamToHtml).toBeTypeOf("function");
    expect(strongLanguageForBook).toBeTypeOf("function");
  });
});
