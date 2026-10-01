import {
  type HTMLElement,
  type Node,
  NodeType,
  parse,
  type TextNode,
} from "node-html-parser";
import { DEFINED_TAGS } from "./tags.ts";
import type { BibleHtmlNode } from "./types.ts";

function* htmlElementToBibleHtmlNodeStream(
  node: Node,
): Generator<BibleHtmlNode, void, unknown> {
  if (node.nodeType === NodeType.TEXT_NODE) {
    yield {
      action: "text",
      textContent: (node as TextNode).textContent,
    };
    return;
  }
  if (node.nodeType !== NodeType.ELEMENT_NODE) return;

  const element = node as HTMLElement;
  if (element.tagName == null) {
    for (const child of element.childNodes) {
      yield* htmlElementToBibleHtmlNodeStream(child);
    }
    return;
  }

  const tagConfig = DEFINED_TAGS[element.tagName];
  if (tagConfig == null) {
    console.log(node);
    throw new Error(`Failed to element: ${element.tagName}`);
  }

  yield { action: "enter", tagName: tagConfig.tagName };
  for (const child of element.childNodes) {
    yield* htmlElementToBibleHtmlNodeStream(child);
  }
  yield { action: "leave", tagName: tagConfig.tagName };
}

export function htmlToStream(
  textHtml: string,
): Generator<BibleHtmlNode, void, unknown> {
  return htmlElementToBibleHtmlNodeStream(parse(textHtml));
}
