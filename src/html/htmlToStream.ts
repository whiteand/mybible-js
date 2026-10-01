import { DEFINED_TAGS } from "./tags.ts";
import type { BibleHtmlNode } from "./types.ts";

class Tokenizer {
  private startTagRegex: RegExp;
  private closingTagRegex: RegExp;
  private selfClosingTagRegex: RegExp;
  constructor(private text: string) {
    const options = Object.keys(DEFINED_TAGS).join("|");
    const attributesPattern = `(\\s+(\\S+)=".*?")*`;
    this.startTagRegex = new RegExp(`^<(${options})${attributesPattern}>`, "i");
    this.closingTagRegex = new RegExp(`^</(${options})>`, "i");
    this.selfClosingTagRegex = new RegExp(`^<(${options})\s*/>`, "i");
  }
  take(length: number): string {
    const res = this.text.slice(0, length);
    this.text = this.text.slice(length);
    return res;
  }
  nextToken(): BibleHtmlNode | null {
    if (!this.text) return null;
    const ind = this.text.indexOf("<");
    if (ind !== 0) {
      return {
        action: "text",
        textContent: this.take(ind < 0 ? this.text.length : ind),
      };
    }
    return this.nextElementToken();
  }

  nextElementToken(): BibleHtmlNode {
    for (const [regex, action] of [
      [this.startTagRegex, "enter"],
      [this.closingTagRegex, "leave"],
      [this.selfClosingTagRegex, "self-closed"],
    ] as const) {
      let match = regex.exec(this.text);
      if (match) {
        const key = match[1]!.toUpperCase() as keyof typeof DEFINED_TAGS;
        this.take(match[0].length);

        return {
          action: action,
          tagName: DEFINED_TAGS[key]!.tagName,
        };
      }
    }

    const unknownTagNameMatch = /^<\/?(.*?)\/?>/.exec(this.text);
    if (unknownTagNameMatch) {
      throw new Error(
        `Failed to element: ${unknownTagNameMatch[1]?.toUpperCase()}`,
      );
    }

    throw new Error(`Failed to parse:\n${JSON.stringify(this.text)}`);
  }
}

export function* htmlToStream(
  textHtml: string,
): Generator<BibleHtmlNode, void, unknown> {
  const tokenizer = new Tokenizer(textHtml);
  let token: BibleHtmlNode | null = null;
  while ((token = tokenizer.nextToken())) {
    yield token;
  }
}
