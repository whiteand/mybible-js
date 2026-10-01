import { concat, iteratorOf } from "../utils/itertools.ts";
import { htmlToStream } from "./htmlToStream.ts";
import { takeElement } from "./takeElement.ts";
import type { BibleHtmlNode, BibleHtmlTag } from "./types.ts";

const PLAIN_ACTION_DICT: Partial<
  Record<`${BibleHtmlTag["action"]}:${BibleHtmlTag["tagName"]}`, null | string>
> = {
  "enter:emphasized": null,
  "leave:emphasized": null,
  "enter:jesus": null,
  "leave:jesus": null,
  "enter:small": null,
  "leave:small": null,
  "enter:paragraphBreak": "\n  ",
  "leave:paragraphBreak": "\n  ",
  "enter:indent": "\n  ",
  "leave:indent": "\n",
  "enter:br": "\n",
  "leave:br": "\n",
  "enter:inserted": "[",
  "leave:inserted": "]",
  "enter:subheading": "*",
  "leave:subheading": "*",
};

function* actionToPlain(
  action: BibleHtmlTag,
): Generator<string, void, unknown> {
  const key: `${BibleHtmlTag["action"]}:${BibleHtmlTag["tagName"]}` = `${action.action}:${action.tagName}`;
  const stringOrNull = PLAIN_ACTION_DICT[key];
  if (stringOrNull === undefined) {
    throw new Error(`Cannot handle tag: ${key}`);
  }
  if (stringOrNull === null) return;
  yield stringOrNull;
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
