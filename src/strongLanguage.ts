export type StrongLanguage = "G" | "H";

/** MyBible: Matthew is 470, the first New Testament book. */
export const FIRST_NEW_TESTAMENT_BOOK_NUMBER = 470;

export function isNewTestamentBook(bookNumber: number): boolean {
  return bookNumber >= FIRST_NEW_TESTAMENT_BOOK_NUMBER;
}

export function strongLanguageForBook(bookNumber: number): StrongLanguage {
  return isNewTestamentBook(bookNumber) ? "G" : "H";
}
