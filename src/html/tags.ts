import type { TagConfig } from "./types.ts";

export const DEFINED_TAGS: Record<string, TagConfig> = {
  N: {
    tagName: "note",
  },
  F: {
    tagName: "footnote",
  },
  E: {
    tagName: "emphasized",
  },
  S: {
    tagName: "strong",
  },
  M: {
    tagName: "morphology",
  },
  PB: {
    tagName: "paragraphBreak",
  },
  I: {
    tagName: "inserted",
  },
  T: {
    tagName: "indent",
  },
  J: {
    tagName: "jesus",
  },
  SMALL: {
    tagName: "small",
  },
  BR: {
    tagName: "br",
  },
  H: {
    tagName: "subheading",
  },
};
