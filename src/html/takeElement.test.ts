import { describe, expect, it } from "vitest";
import { takeElement } from "./takeElement.ts";
import type { BibleHtmlNode } from "./types.ts";

function taken(nodes: BibleHtmlNode[]): {
  element: BibleHtmlNode[];
  rest: BibleHtmlNode[];
} {
  const [element, rest] = takeElement(nodes);
  return { element, rest: Array.from(rest) };
}

describe("takeElement", () => {
  it("returns an empty element when the stream is empty", () => {
    expect(taken([])).toEqual({ element: [], rest: [] });
  });

  it("throws when the stream starts with text", () => {
    expect(() =>
      takeElement([{ action: "text", textContent: "In" }]),
    ).toThrow("Cannot take element");
  });

  it("throws when the stream starts with a closing tag", () => {
    expect(() => takeElement([{ action: "leave", tagName: "strong" }])).toThrow(
      "Cannot take element",
    );
  });

  it("takes an empty element", () => {
    expect(
      taken([
        { action: "enter", tagName: "paragraphBreak" },
        { action: "leave", tagName: "paragraphBreak" },
      ]),
    ).toEqual({
      element: [
        { action: "enter", tagName: "paragraphBreak" },
        { action: "leave", tagName: "paragraphBreak" },
      ],
      rest: [],
    });
  });

  it("takes an element and the text inside it", () => {
    expect(
      taken([
        { action: "enter", tagName: "strong" },
        { action: "text", textContent: "1722" },
        { action: "leave", tagName: "strong" },
      ]),
    ).toEqual({
      element: [
        { action: "enter", tagName: "strong" },
        { action: "text", textContent: "1722" },
        { action: "leave", tagName: "strong" },
      ],
      rest: [],
    });
  });

  it("leaves the nodes after the element in the rest of the stream", () => {
    expect(
      taken([
        { action: "enter", tagName: "footnote" },
        { action: "text", textContent: "[1]" },
        { action: "leave", tagName: "footnote" },
        { action: "text", textContent: " tail" },
      ]),
    ).toEqual({
      element: [
        { action: "enter", tagName: "footnote" },
        { action: "text", textContent: "[1]" },
        { action: "leave", tagName: "footnote" },
      ],
      rest: [{ action: "text", textContent: " tail" }],
    });
  });

  it("includes a nested element in the taken element", () => {
    expect(
      taken([
        { action: "enter", tagName: "emphasized" },
        { action: "text", textContent: "a" },
        { action: "enter", tagName: "strong" },
        { action: "text", textContent: "1" },
        { action: "leave", tagName: "strong" },
        { action: "text", textContent: "b" },
        { action: "leave", tagName: "emphasized" },
        { action: "text", textContent: " after" },
      ]),
    ).toEqual({
      element: [
        { action: "enter", tagName: "emphasized" },
        { action: "text", textContent: "a" },
        { action: "enter", tagName: "strong" },
        { action: "text", textContent: "1" },
        { action: "leave", tagName: "strong" },
        { action: "text", textContent: "b" },
        { action: "leave", tagName: "emphasized" },
      ],
      rest: [{ action: "text", textContent: " after" }],
    });
  });

  it("throws when a closing tag does not match the open tag", () => {
    expect(() =>
      takeElement([
        { action: "enter", tagName: "footnote" },
        { action: "leave", tagName: "strong" },
      ]),
    ).toThrow("Tag mismatch: strong");
  });

  it("throws when a nested closing tag does not match the inner open tag", () => {
    expect(() =>
      takeElement([
        { action: "enter", tagName: "emphasized" },
        { action: "enter", tagName: "strong" },
        { action: "leave", tagName: "emphasized" },
      ]),
    ).toThrow("Tag mismatch: emphasized");
  });

  it("throws when a tag is never closed", () => {
    expect(() =>
      takeElement([
        { action: "enter", tagName: "footnote" },
        { action: "enter", tagName: "strong" },
        { action: "text", textContent: "1" },
      ]),
    ).toThrow("Not closed tags: footnote, strong");
  });
});
