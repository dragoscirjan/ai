import { createHash } from "node:crypto";
import { lstatSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const gates = ["validate", "deliver", "check", "browser-check"];
export const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
export function passingGates(record) {
  return Boolean(
    record &&
    Object.keys(record).length === gates.length &&
    gates.every((gate) => record[gate] === "pass"),
  );
}
export function publicText(bytes) {
  const text = bytes.toString("utf8");
  if (/\/(?:home|Users)\/[^\s"'<>]+|[A-Za-z]:\\Users\\|file:\/\/|\/(?:private\/)?tmp\//.test(text))
    throw new Error("Public artifact contains a local filesystem path");
  if (/github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,}/.test(text))
    throw new Error("Public artifact contains a credential-shaped value");
}
export function regularFiles(directory, prefix = "") {
  if (!lstatSync(directory).isDirectory() || lstatSync(directory).isSymbolicLink())
    throw new Error("Artifact root must be a real directory");
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (
      entry.isSymbolicLink() ||
      [...entry.name].some(
        (character) => character.codePointAt(0) < 32 || character.codePointAt(0) === 127,
      ) ||
      (entry.name.startsWith(".") && entry.name !== ".nojekyll")
    )
      throw new Error("Artifact contains an unsafe entry");
    const relative = prefix + entry.name;
    if (entry.isDirectory())
      files.push(...regularFiles(join(directory, entry.name), relative + "/"));
    else if (entry.isFile()) files.push(relative);
    else throw new Error("Artifact contains a non-regular file");
  }
  return files;
}
export function verifyDiagrams(
  directory,
  sourceDirectory,
  expectedRevision,
  manifestPath = join(directory, "manifest.json"),
) {
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (
    manifest.schemaVersion !== 1 ||
    !/^[a-f0-9]{40}$/.test(manifest.tool?.revision) ||
    (expectedRevision && manifest.tool.revision !== expectedRevision)
  )
    throw new Error("Invalid diagram provenance");
  const artifacts = Object.entries(manifest.artifacts ?? {});
  if (!artifacts.length) throw new Error("Diagram manifest is empty");
  for (const [id, record] of artifacts) {
    if (
      !/^[a-z][a-z0-9-]*$/.test(id) ||
      record.quality !== "showcase" ||
      !passingGates(record.gates)
    )
      throw new Error("Invalid diagram identity or gate result");
    for (const [file, expected] of [
      [join(sourceDirectory, `${id}.json`), record.candidateSha256],
      [join(directory, `${id}.html`), record.htmlSha256],
      [join(directory, `${id}.svg`), record.svgSha256],
    ]) {
      if (
        !/^[a-f0-9]{64}$/.test(expected) ||
        !lstatSync(file).isFile() ||
        lstatSync(file).isSymbolicLink()
      )
        throw new Error("Invalid diagram file or digest");
      const bytes = readFileSync(file);
      if (hash(bytes) !== expected) throw new Error(`Diagram hash mismatch: ${id}`);
      publicText(bytes);
    }
  }
  return manifest;
}
export function verifySite(directory) {
  const files = regularFiles(directory);
  if (!files.includes("index.html")) throw new Error("Missing site entry page");
  const requiredNotices = [
    "LICENSE",
    "LICENSE-MIT",
    "NOTICE",
    "THIRD_PARTY_NOTICES.md",
    "assets/JetBrainsMono-OFL.txt",
    "explainer/vendor/pele/LICENSE",
  ];
  for (const file of requiredNotices)
    if (!files.includes(`notices/archify/${file}`)) throw new Error("Missing Archify notice");
  for (const file of ["notices/site-dependencies.txt", "notices/collection-LICENSE.txt"])
    if (!files.includes(file)) throw new Error("Missing site license bundle");
  for (const file of files)
    if (/\.(?:html|svg|json|js|css)$/.test(file)) publicText(readFileSync(join(directory, file)));
  const manifest = verifyDiagrams(join(directory, "diagrams"), join(directory, "diagram-sources"));
  return { files: files.length, diagrams: Object.keys(manifest.artifacts).length };
}
