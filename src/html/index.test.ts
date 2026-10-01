import { describe, expect, it } from "vitest";
import {
  htmlToPlain,
  htmlToStream,
  htmlToStrongIds,
  streamToHtml,
} from "./index.ts";

describe("html entry", () => {
  it("exports the verse HTML helpers", () => {
    expect(htmlToPlain).toBeTypeOf("function");
    expect(htmlToStream).toBeTypeOf("function");
    expect(htmlToStrongIds).toBeTypeOf("function");
    expect(streamToHtml).toBeTypeOf("function");
  });
});
