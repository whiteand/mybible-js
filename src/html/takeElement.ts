import type { BibleHtmlNode, BibleHtmlTag } from "./types.ts";

export function skipUntilElementEnd(
  firstNode: BibleHtmlTag,
  it: IteratorObject<BibleHtmlNode, void, unknown>,
): [
  elementStream: BibleHtmlNode[],
  restStream: IteratorObject<BibleHtmlNode, void, unknown>,
] {
  const stack = [firstNode.tagName];
  const prefix: BibleHtmlNode[] = [firstNode];

  while (stack.length > 0) {
    const nodeEntry = it.next();
    if (nodeEntry.done) {
      throw new Error(`Not closed tags: ${stack.join(", ")}`);
    }
    const node = nodeEntry.value;
    prefix.push(node);
    if (node.action === "enter") {
      stack.push(node.tagName);
      continue;
    }
    if (node.action === "leave") {
      if (stack.at(-1) !== node.tagName) {
        throw new Error(`Tag mismatch: ${node.tagName}`);
      }
      stack.pop();
    }
  }

  return [prefix, it];
}

export function takeElement(
  nodes: Iterable<BibleHtmlNode>,
): [
  prefix: BibleHtmlNode[],
  suffix: IteratorObject<BibleHtmlNode, void, unknown>,
] {
  const it = Iterator.from(nodes);
  const firstEntry = it.next();
  if (firstEntry.done) {
    return [[], it];
  }
  const firstNode = firstEntry.value;
  if (firstNode.action !== "enter") {
    throw new Error("Cannot take element");
  }
  return skipUntilElementEnd(firstNode, it);
}
