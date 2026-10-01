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
  while (true) {
    const nodeEntry = it.next();
    if (nodeEntry.done) {
      break;
    }
    const node = nodeEntry.value;
    if (node.action === "leave") {
      prefix.push(node);
      const lastStack = stack.at(-1);
      if (lastStack !== node.tagName)
        throw new Error(`Tag mismatch: ${node.tagName}`);
      stack.pop();
      if (stack.length === 0) {
        return [prefix, it];
      }
      continue;
    }
    if (node.action === "enter") {
      prefix.push(node);
      stack.push(node.tagName);
      continue;
    }
    if (node.action === "text") {
      prefix.push(node);
      continue;
    }
  }
  if (stack.length > 0) {
    throw new Error(`Not closed tags: ${stack.join(", ")}`);
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
