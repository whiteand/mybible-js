import { describe, expect, it } from "vitest";
import { concat, iteratorOf } from "./itertools.ts";

describe("iteratorOf", () => {
  it("yields that single value", () => {
    expect(Array.from(iteratorOf("In"))).toEqual(["In"]);
  });
});

describe("concat", () => {
  it("yields nothing when given no iterables", () => {
    expect(Array.from(concat())).toEqual([]);
  });

  it("yields the items of one iterable", () => {
    expect(Array.from(concat(["a", "b"]))).toEqual(["a", "b"]);
  });

  it("yields later iterables after earlier ones", () => {
    expect(Array.from(concat(["a"], ["b", "c"]))).toEqual(["a", "b", "c"]);
  });

  it("keeps items that follow an empty iterable", () => {
    expect(Array.from(concat([], ["a"]))).toEqual(["a"]);
  });

  it("appends an iterator after a single value", () => {
    expect(Array.from(concat(iteratorOf("a"), ["b"]))).toEqual(["a", "b"]);
  });
});
