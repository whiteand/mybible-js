import fs from "node:fs/promises";
import { e as v, type ValidatedBy } from "quartet";

const isValidManifest = v(v.arrayOf(v.string));

export async function readManifest(): Promise<
  ValidatedBy<typeof isValidManifest>
> {
  const x = await fs
    .readFile("./sources/manifest.json", "utf-8")
    .then((x) => JSON.parse(x));

  if (!isValidManifest(x)) {
    throw new Error(
      `Invalid manifest: ${JSON.stringify(isValidManifest.explanations)}`,
    );
  }

  return x;
}
