import { describe, expect, it, vi } from "vitest";
import { htmlToStream } from "./htmlToStream.ts";
import type { BibleHtmlNode } from "./types.ts";

function stream(textHtml: string): BibleHtmlNode[] {
  return Array.from(htmlToStream(textHtml));
}

describe("htmlToStream", () => {
  it("yields nothing for an empty string", () => {
    expect(stream("")).toEqual([]);
  });

  it("yields plain text without a document wrapper", () => {
    expect(stream("In the beginning")).toEqual([
      { action: "text", textContent: "In the beginning" },
    ]);
  });

  it("keeps whitespace inside text", () => {
    expect(stream("  a  ")).toEqual([{ action: "text", textContent: "  a  " }]);
  });

  it("maps a note", () => {
    expect(stream("<n>Tou</n>")).toEqual([
      { action: "enter", tagName: "note" },
      { action: "text", textContent: "Tou" },
      { action: "leave", tagName: "note" },
    ]);
  });
  it("in the absence of closed tag the leave is not returned", () => {
    expect(stream("<n>Tou")).toEqual([
      { action: "enter", tagName: "note" },
      { action: "text", textContent: "Tou" },
    ]);
  });

  it("maps a footnote", () => {
    expect(stream("<f>[1]</f>")).toEqual([
      { action: "enter", tagName: "footnote" },
      { action: "text", textContent: "[1]" },
      { action: "leave", tagName: "footnote" },
    ]);
  });

  it("maps emphasis", () => {
    expect(stream("<e>word</e>")).toEqual([
      { action: "enter", tagName: "emphasized" },
      { action: "text", textContent: "word" },
      { action: "leave", tagName: "emphasized" },
    ]);
  });

  it("maps a Strong's number", () => {
    expect(stream("<S>1722</S>")).toEqual([
      { action: "enter", tagName: "strong" },
      { action: "text", textContent: "1722" },
      { action: "leave", tagName: "strong" },
    ]);
  });

  it("maps a morphology code", () => {
    expect(stream("<m>PREP</m>")).toEqual([
      { action: "enter", tagName: "morphology" },
      { action: "text", textContent: "PREP" },
      { action: "leave", tagName: "morphology" },
    ]);
  });

  it("maps a paragraph break", () => {
    expect(stream("<pb/>")).toEqual([
      { action: "self-closed", tagName: "paragraphBreak" },
    ]);
  });

  it("maps an inserted word", () => {
    expect(stream("<i>was</i>")).toEqual([
      { action: "enter", tagName: "inserted" },
      { action: "text", textContent: "was" },
      { action: "leave", tagName: "inserted" },
    ]);
  });

  it("maps an indent", () => {
    expect(stream("<t>line</t>")).toEqual([
      { action: "enter", tagName: "indent" },
      { action: "text", textContent: "line" },
      { action: "leave", tagName: "indent" },
    ]);
  });

  it("maps the words of Jesus", () => {
    expect(stream("<J>Permit</J>")).toEqual([
      { action: "enter", tagName: "jesus" },
      { action: "text", textContent: "Permit" },
      { action: "leave", tagName: "jesus" },
    ]);
  });

  it("maps small print and ignores its attributes", () => {
    expect(stream('<small class="far">5</small>')).toEqual([
      { action: "enter", tagName: "small" },
      { action: "text", textContent: "5" },
      { action: "leave", tagName: "small" },
    ]);
  });

  it("maps a line break", () => {
    expect(stream("<br/>")).toEqual([{ action: "self-closed", tagName: "br" }]);
  });

  it("maps a subheading", () => {
    expect(stream("<h>Title</h>")).toEqual([
      { action: "enter", tagName: "subheading" },
      { action: "text", textContent: "Title" },
      { action: "leave", tagName: "subheading" },
    ]);
  });

  it("places a nested tag between its parent's enter and leave", () => {
    expect(stream("<e>a<S>1</S>b</e>")).toEqual([
      { action: "enter", tagName: "emphasized" },
      { action: "text", textContent: "a" },
      { action: "enter", tagName: "strong" },
      { action: "text", textContent: "1" },
      { action: "leave", tagName: "strong" },
      { action: "text", textContent: "b" },
      { action: "leave", tagName: "emphasized" },
    ]);
  });

  it("keeps a following sibling after the previous tag closes", () => {
    expect(stream("<f>[1]</f> tail")).toEqual([
      { action: "enter", tagName: "footnote" },
      { action: "text", textContent: "[1]" },
      { action: "leave", tagName: "footnote" },
      { action: "text", textContent: " tail" },
    ]);
  });

  it("throws when the tag is not part of the verse HTML subset", () => {
    expect(() => stream("<div>x</div>")).toThrow("Failed to element: DIV");
  });
});
