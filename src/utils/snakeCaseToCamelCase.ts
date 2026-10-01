export function snakeCaseToCamelCase(value: string): string {
  let res = "";
  let shouldUppercase = false;
  for (const x of value) {
    if (x === "_" || x === " ") {
      if (res.length > 0) shouldUppercase = true;
      continue;
    }
    res += shouldUppercase ? x.toUpperCase() : x;
    shouldUppercase = false;
  }
  return res;
}
