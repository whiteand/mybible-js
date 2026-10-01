import { describe, expect, it } from "vitest";
import { streamToHtml } from "./streamToHtml.ts";
import type { BibleHtmlNode, BibleHtmlTagName } from "./types.ts";

function html(nodes: BibleHtmlNode[]): string {
  return Array.from(streamToHtml(nodes)).join("");
}

describe("streamToHtml", () => {
  it("yields nothing for an empty stream", () => {
    expect(html([])).toBe("");
  });

  it("emits text unchanged", () => {
    expect(html([{ action: "text", textContent: "  In  " }])).toBe("  In  ");
  });

  it("writes a note as N", () => {
    expect(
      html([
        { action: "enter", tagName: "note" },
        { action: "text", textContent: "Tou" },
        { action: "leave", tagName: "note" },
      ]),
    ).toBe("<N>Tou</N>");
  });

  it("writes a footnote as F", () => {
    expect(
      html([
        { action: "enter", tagName: "footnote" },
        { action: "text", textContent: "[1]" },
        { action: "leave", tagName: "footnote" },
      ]),
    ).toBe("<F>[1]</F>");
  });

  it("writes emphasis as E", () => {
    expect(
      html([
        { action: "enter", tagName: "emphasized" },
        { action: "text", textContent: "word" },
        { action: "leave", tagName: "emphasized" },
      ]),
    ).toBe("<E>word</E>");
  });

  it("writes a Strong's number as S", () => {
    expect(
      html([
        { action: "enter", tagName: "strong" },
        { action: "text", textContent: "1722" },
        { action: "leave", tagName: "strong" },
      ]),
    ).toBe("<S>1722</S>");
  });

  it("writes a morphology code as M", () => {
    expect(
      html([
        { action: "enter", tagName: "morphology" },
        { action: "text", textContent: "PREP" },
        { action: "leave", tagName: "morphology" },
      ]),
    ).toBe("<M>PREP</M>");
  });

  it("writes an inserted word as I", () => {
    expect(
      html([
        { action: "enter", tagName: "inserted" },
        { action: "text", textContent: "was" },
        { action: "leave", tagName: "inserted" },
      ]),
    ).toBe("<I>was</I>");
  });

  it("writes an indent as T", () => {
    expect(
      html([
        { action: "enter", tagName: "indent" },
        { action: "text", textContent: "line" },
        { action: "leave", tagName: "indent" },
      ]),
    ).toBe("<T>line</T>");
  });

  it("writes the words of Jesus as J", () => {
    expect(
      html([
        { action: "enter", tagName: "jesus" },
        { action: "text", textContent: "Permit" },
        { action: "leave", tagName: "jesus" },
      ]),
    ).toBe("<J>Permit</J>");
  });

  it("writes small print as SMALL", () => {
    expect(
      html([
        { action: "enter", tagName: "small" },
        { action: "text", textContent: "5" },
        { action: "leave", tagName: "small" },
      ]),
    ).toBe("<SMALL>5</SMALL>");
  });

  it("writes a subheading as H", () => {
    expect(
      html([
        { action: "enter", tagName: "subheading" },
        { action: "text", textContent: "Title" },
        { action: "leave", tagName: "subheading" },
      ]),
    ).toBe("<H>Title</H>");
  });

  it("keeps a nested tag inside its parent", () => {
    expect(
      html([
        { action: "enter", tagName: "emphasized" },
        { action: "enter", tagName: "strong" },
        { action: "text", textContent: "1" },
        { action: "leave", tagName: "strong" },
        { action: "leave", tagName: "emphasized" },
      ]),
    ).toBe("<E><S>1</S></E>");
  });

  it("writes a closing tag that has no matching open tag", () => {
    expect(html([{ action: "leave", tagName: "footnote" }])).toBe("</F>");
  });

  it("does not pair an open tag with a different closing tag", () => {
    expect(
      html([
        { action: "enter", tagName: "emphasized" },
        { action: "leave", tagName: "strong" },
      ]),
    ).toBe("<E></S>");
  });

  it("drops an open tag that never closes", () => {
    expect(html([{ action: "enter", tagName: "strong" }])).toBe("<S>");
  });

  it("throws when the tag name is not defined", () => {
    const tagName = "missing" as BibleHtmlTagName;
    expect(() =>
      html([
        { action: "enter", tagName },
        { action: "leave", tagName },
      ]),
    ).toThrow("Failed to find defined tag for tag name: missing");
  });
});
