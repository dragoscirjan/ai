import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadCatalog } from "../skills/catalog.mjs";

export const root = fileURLToPath(new URL("../../", import.meta.url));
export const catalogRelativePath = "catalog/skill-catalog.yaml";
export const catalogPath = join(root, catalogRelativePath);
export function catalog() {
  return loadCatalog(catalogPath, root);
}
export function docsBase(value = process.env.DOCS_BASE ?? "/") {
  if (value !== "/" && !/^\/(?:[a-zA-Z0-9][a-zA-Z0-9_-]*\/)+$/.test(value)) {
    throw new Error(
      "DOCS_BASE must be / or a slash-delimited site path such as /projects/ai-skills/",
    );
  }
  return value;
}
export const groups = Object.entries(catalog().groups).map(([id, group]) => ({ id, ...group }));
export function sourceUrl(entry, file = "SKILL.md") {
  const c = catalog();
  const repository = entry.source.repository ?? c.repository;
  const revision = entry.source.revision ?? c.ref;
  // Raw immutable upstream files avoid making instruction access depend on GitHub\u0027s blob UI.
  const prefix =
    entry.source.type === "local"
      ? `${repository}/blob/${revision}`
      : `${repository.replace("https://github.com/", "https://raw.githubusercontent.com/")}/${revision}`;
  return `${prefix}/${entry.source.path}/${file}`;
}
export function localInstructions(name) {
  const entry = catalog().byName.get(name);
  if (!entry || entry.source.type !== "local") throw new Error(`No local instructions: ${name}`);
  return readFileSync(join(root, entry.source.path, "SKILL.md"), "utf8");
}
