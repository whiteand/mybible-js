import {
  type HTMLElement,
  type Node,
  NodeType,
  parse,
  type TextNode,
} from "node-html-parser";
import { DEFINED_TAGS } from "./tags.ts";
import type { BibleHtmlNode, BibleHtmlTagName } from "./types.ts";

type Task =
  | {
      type: "visit";
      node: Node;
    }
  | {
      type: "close";
      tagName: BibleHtmlTagName;
    };

function visitChildAndClose(
  tasks: Task[],
  tagName: BibleHtmlTagName,
  childNodes: Node[],
) {
  tasks.unshift({
    type: "close",
    tagName,
  });
  tasks.unshift(
    ...childNodes.map(
      (node): Task => ({
        type: "visit",
        node,
      }),
    ),
  );
}

function* htmlElementToBibleHtmlNodeStream(
  parsed: HTMLElement,
): Generator<BibleHtmlNode, void, unknown> {
  const tasks = [{ type: "visit", node: parsed }] as Task[];
  while (tasks.length > 0) {
    const task = tasks.shift()!;

    if (task.type === "close") {
      yield {
        action: "leave",
        tagName: task.tagName,
      };
      continue;
    }
    if (task.type === "visit") {
      const { node } = task;

      if (node.nodeType === NodeType.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.tagName == null) {
          tasks.unshift(
            ...node.childNodes.map(
              (node): Task => ({
                type: "visit",
                node,
              }),
            ),
          );
          continue;
        }
        const tagConfig = DEFINED_TAGS[element.tagName];
        if (tagConfig != null) {
          yield {
            action: "enter",
            tagName: tagConfig.tagName,
          };
          visitChildAndClose(tasks, tagConfig.tagName, element.childNodes);
          continue;
        }
        console.log(node);
        throw new Error(`Failed to element: ${element.tagName}`);
      }
      if (node.nodeType === NodeType.TEXT_NODE) {
        const textNode = node as TextNode;
        yield {
          action: "text",
          textContent: textNode.textContent,
        };
        continue;
      }
    }
  }
}

export function htmlToStream(
  textHtml: string,
): Generator<BibleHtmlNode, void, unknown> {
  return htmlElementToBibleHtmlNodeStream(parse(textHtml));
}
