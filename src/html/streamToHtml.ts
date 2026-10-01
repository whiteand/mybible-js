import { DEFINED_TAGS } from "./tags.ts";
import type { BibleHtmlNode, BibleHtmlTagName } from "./types.ts";

function getRealTag(tagName: BibleHtmlTagName): string {
  const definedTag = Object.entries(DEFINED_TAGS).find(
    (x) => x[1].tagName === tagName,
  );
  if (!definedTag)
    throw new Error("Failed to find defined tag for tag name: " + tagName);
  return definedTag[0];
}

export function streamToHtml(
  nodes: Iterable<BibleHtmlNode>,
): IteratorObject<string, void, unknown> {
  return Iterator.from(nodes).map((x) => {
    if (x.action === "text") {
      return x.textContent;
    }
    const tag = getRealTag(x.tagName);
    if (x.action === "self-closed") {
      return `<${tag}/>`;
    } else if (x.action === "enter") {
      return `<${tag}>`;
    } else {
      return `</${tag}>`;
    }
  });
}
