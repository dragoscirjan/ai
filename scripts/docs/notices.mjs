import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { root } from "./data.mjs";

function licenseFiles(directory, base = directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink() || entry.name === "node_modules" || entry.name === ".git") continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...licenseFiles(path, base));
    else if (entry.isFile() && /^(?:licen[cs]e|notice|copying|ofl)(?:[._-].*)?$/i.test(entry.name))
      result.push({ path, label: relative(base, path).replaceAll("\\", "/") });
  }
  return result.sort((a, b) => a.label.localeCompare(b.label));
}
export function writeNotices() {
  const store = join(root, "node_modules/.pnpm");
  if (!existsSync(store))
    throw new Error("Install frozen pnpm dependencies before building notices");
  const packages = new Map();
  for (const version of readdirSync(store, { withFileTypes: true })) {
    const modules = join(store, version.name, "node_modules");
    if (!version.isDirectory() || !existsSync(modules)) continue;
    for (const entry of readdirSync(modules, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const path = join(modules, entry.name);
      const candidates = entry.name.startsWith("@")
        ? readdirSync(path, { withFileTypes: true })
            .filter((item) => item.isDirectory())
            .map((item) => join(path, item.name))
        : [path];
      for (const directory of candidates) {
        const file = join(directory, "package.json");
        if (!existsSync(file)) continue;
        const metadata = JSON.parse(readFileSync(file, "utf8"));
        packages.set(`${metadata.name}@${metadata.version}`, { directory, metadata });
      }
    }
  }
  const sections = [];
  for (const [name, { directory, metadata }] of [...packages].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const files = licenseFiles(directory);
    sections.push(
      `===== ${name} =====\nDeclared license: ${typeof metadata.license === "string" ? metadata.license : JSON.stringify(metadata.license ?? "not specified")}\n` +
        files
          .map(({ path, label }) => `\n--- ${label} ---\n${readFileSync(path, "utf8").trimEnd()}\n`)
          .join(""),
    );
  }
  const output = join(root, "docs/public/notices");
  mkdirSync(output, { recursive: true });
  writeFileSync(
    join(output, "site-dependencies.txt"),
    "License and notice texts from the locked installed packages. Includes development tools; not every package is bundled for the browser.\n\n" +
      sections.join("\n"),
  );
  writeFileSync(join(output, "collection-LICENSE.txt"), readFileSync(join(root, "LICENSE")));
  return packages.size;
}
