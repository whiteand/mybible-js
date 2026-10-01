import { DEFINED_TAGS } from "./tags.ts";
import type { BibleHtmlNode, BibleHtmlTag, BibleHtmlTagName } from "./types.ts";

function getRealTag(tagName: BibleHtmlTagName): string {
  const definedTag = Object.entries(DEFINED_TAGS).find(
    (x) => x[1].tagName === tagName,
  );
  if (!definedTag)
    throw new Error("Failed to find defined tag for tag name: " + tagName);
  return definedTag[0];
}

function* collapseSelfClosing(
  nodes: Iterable<BibleHtmlNode>,
): Generator<
  BibleHtmlNode | { action: "self-closing"; tagName: BibleHtmlTagName },
  void,
  unknown
> {
  let lastNode: BibleHtmlTag[] = [];
  for (const x of nodes) {
    if (x.action === "text") {
      yield* lastNode;
      lastNode.length = 0;
      yield x;
      continue;
    }
    if (x.action === "enter") {
      yield* lastNode;
      lastNode.length = 0;
      lastNode.push(x);
      continue;
    }
    if (x.action === "leave") {
      if (lastNode.length === 0) {
        yield x;
        continue;
      }
      const y = lastNode.at(-1)!;
      if (y.tagName === x.tagName) {
        lastNode.length = 0;
        yield {
          action: "self-closing",
          tagName: y.tagName,
        };
      } else {
        yield* lastNode;
        lastNode.length = 0;
        yield x;
      }
    }
  }
}

export function streamToHtml(
  nodes: Iterable<BibleHtmlNode>,
): IteratorObject<string, void, unknown> {
  return collapseSelfClosing(nodes).map((x) => {
    if (x.action === "text") {
      return x.textContent;
    }
    const tag = getRealTag(x.tagName);
    if (x.action === "self-closing") {
      return `<${tag}/>`;
    } else if (x.action === "enter") {
      return `<${tag}>`;
    } else {
      return `</${tag}>`;
    }
  });
}
