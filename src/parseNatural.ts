export type NaturalNode =
  | {
      type: "spaces" | "word";
      textContent: string;
    }
  | {
      type: "separator";
      textContent: (typeof SEPARATORS)[number];
    };

const SEPARATORS = [",", ".", "—", ":", "?", ";", "!"] as const;

export function* parseNatural(
  text: string,
): Generator<NaturalNode, void, unknown> {
  nextToken: while (text.length > 0) {
    let match = /^(\s+)(.*)/.exec(text);
    if (match) {
      const textContent = match[1]!;
      yield {
        type: "spaces",
        textContent,
      };
      text = match[2]!;
      continue;
    }
    match = /^([а-яА-Яa-zA-Z0-9іІєЄїЇ][а-яА-Яa-zA-Z0-9іІєЄїЇ'’-]*)(.*)/.exec(
      text,
    );
    if (match) {
      const textContent = match[1]!;
      yield {
        type: "word",
        textContent,
      };
      text = match[2]!;
      continue;
    }
    for (const sep of SEPARATORS) {
      if (!text.startsWith(sep)) continue;
      yield {
        type: "separator",
        textContent: sep,
      };
      text = text.slice(1);
      continue nextToken;
    }
    throw new Error(`Cannot proceed parsing: ${JSON.stringify({ text })}`);
  }
}

export function naturalNodesToPlain(nodes: Iterable<NaturalNode>): string {
  return Iterator.from(nodes)
    .map((node) => {
      if (node.type === "spaces") return node.textContent;
      if (node.type === "separator") return node.textContent;
      if (node.type === "word") return node.textContent;
      throw new Error(`Unknown node: ${JSON.stringify(node)}`);
    })
    .join("");
}
