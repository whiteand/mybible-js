import { htmlToStream } from "./htmlToStream.ts";

export function htmlToStrongIds(textHtml: string): string[] {
  const ids: string[] = [];
  let inStrong = 0;
  for (const action of htmlToStream(textHtml)) {
    if (action.action === "enter" && action.tagName === "strong") {
      inStrong += 1;
      continue;
    }
    if (action.action === "leave" && action.tagName === "strong") {
      inStrong -= 1;
      continue;
    }
    if (action.action === "text" && inStrong > 0) {
      const id = action.textContent.trim();
      if (id !== "") ids.push(id);
    }
  }
  return ids;
}
