import { concat, iteratorOf } from "../utils/itertools.ts";
import { htmlToStream } from "./htmlToStream.ts";
import { takeElement } from "./takeElement.ts";
import type { BibleHtmlNode, BibleHtmlTag } from "./types.ts";

function* actionToPlain(
  action: BibleHtmlTag,
): Generator<string, void, unknown> {
  const key: `${BibleHtmlTag["action"]}:${BibleHtmlTag["tagName"]}` = `${action.action}:${action.tagName}`;
  switch (key) {
    case "enter:emphasized":
    case "leave:emphasized":
    case "enter:jesus":
    case "leave:jesus":
    case "enter:small":
    case "leave:small":
      return;
    case "enter:paragraphBreak":
    case "leave:paragraphBreak":
    case "enter:indent":
      yield "\n  ";
      return;
    case "leave:indent":
    case "enter:br":
    case "leave:br":
      yield "\n";
      return;
    case "enter:inserted":
      yield "[";
      return;
    case "leave:inserted":
      yield "]";
      return;
    case "enter:subheading":
      yield "*";
      return;
    case "leave:subheading":
      yield "*";
      return;
    default:
      throw new Error(`Cannot handle tag: ${key}`);
  }
}

export function* streamToPlain(
  nodes: Iterable<BibleHtmlNode>,
): Generator<string, void, unknown> {
  let nodesIt: IteratorObject<BibleHtmlNode, void, unknown> =
    Iterator.from(nodes);

  while (true) {
    const entry = nodesIt.next();
    if (entry.done) break;
    const action = entry.value;
    if (action.action === "text") {
      yield action.textContent;
      continue;
    }
    if (
      action.action === "enter" &&
      ["footnote", "strong", "morphology", "note"].includes(action.tagName)
    ) {
      nodesIt = takeElement(concat(iteratorOf(action), nodesIt))[1];
      continue;
    }
    yield* actionToPlain(action);
  }
}

export function htmlToPlain(
  textHtml: string,
): Generator<string, void, unknown> {
  return streamToPlain(htmlToStream(textHtml));
}
