import { describe, expect, it } from "vitest";
import { htmlToStrongIds } from "./htmlToStrongIds.ts";

describe("htmlToStrongIds", () => {
  it("returns nothing for an empty string", () => {
    expect(htmlToStrongIds("")).toEqual([]);
  });

  it("returns nothing when the verse has no Strong's numbers", () => {
    expect(htmlToStrongIds("In the beginning")).toEqual([]);
  });

  it("returns one Strong's number", () => {
    expect(htmlToStrongIds("<S>1722</S>")).toEqual(["1722"]);
  });

  it("returns Strong's numbers in source order", () => {
    expect(htmlToStrongIds("<S>746</S><S>1510</S>")).toEqual(["746", "1510"]);
  });

  it("ignores text outside a Strong's number", () => {
    expect(htmlToStrongIds("In<S>1722</S> the beginning")).toEqual(["1722"]);
  });

  it("trims whitespace around a Strong's number", () => {
    expect(htmlToStrongIds("<S> 1722 </S>")).toEqual(["1722"]);
  });

  it("skips a Strong's tag that has no number", () => {
    expect(htmlToStrongIds("<S>   </S>")).toEqual([]);
  });

  it("keeps a number nested inside another Strong's tag", () => {
    expect(htmlToStrongIds("<S>1<S>2</S></S>")).toEqual(["1", "2"]);
  });

  it("stops collecting after a Strong's tag closes", () => {
    expect(htmlToStrongIds("<S>1</S>tail")).toEqual(["1"]);
  });

  it("collects a Strong's number wrapped by another tag", () => {
    expect(htmlToStrongIds("<e>word<S>312</S></e>")).toEqual(["312"]);
  });
});
