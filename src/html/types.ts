// E = emphasized
// F = footnote
// S = strong
// M = morphology
// N = note
// PB = paragraphBreak
// I = inserted
// T = indent (OT quotation / poetry: new line, indented left and right)
export type BibleHtmlTagName =
  | "emphasized"
  | "footnote"
  | "strong"
  | "morphology"
  | "note"
  | "paragraphBreak"
  | "inserted"
  | "subheading"
  | "jesus"
  | "small"
  | "br"
  | "indent";

export type BibleHtmlTag = {
  action: "enter" | "leave";
  tagName: BibleHtmlTagName;
};

export type BibleHtmlNode =
  | { action: "text"; textContent: string }
  | BibleHtmlTag;

export type TagConfig = {
  tagName: BibleHtmlTagName;
};
