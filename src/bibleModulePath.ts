export function isBibleModuleFilePath(filePath: string): boolean {
  if (!filePath.toLowerCase().endsWith("SQLite3".toLowerCase())) return false;
  if (filePath.toLowerCase().endsWith(".commentaries.SQLite3".toLowerCase()))
    return false;
  if (filePath.toLowerCase().endsWith(".dictionary.SQLite3".toLowerCase()))
    return false;
  return true;
}

export function getBibleModuleId(filePath: string) {
  if (!isBibleModuleFilePath(filePath)) {
    throw new Error(`Invalid path: ${filePath}`);
  }
  return filePath.split(".SQLite3")[0]?.split("/")?.at(-1)!;
}
