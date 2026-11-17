import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { prepareSkills } from "../../.agents/skills/sync-my-skills/scripts/sync-core.mjs";
import { catalog, root } from "./data.mjs";

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
export function toolLocation() {
  const entry = catalog().byName.get("archify");
  const base = resolve(process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache"), "ai-skills-docs");
  const rel = relative(root, base);
  if (!rel || (!rel.startsWith(`..${sep}`) && rel !== ".."))
    throw new Error("The Archify cache must be outside the repository");
  return {
    entry,
    base,
    directory: join(base, `archify-${entry.source.revision}`),
    receipt: join(base, `archify-${entry.source.revision}.json`),
  };
}
export function verifiedTool() {
  const location = toolLocation();
  const { entry, directory, receipt } = location;
  if (existsSync(location.base) && realpathSync(location.base) !== location.base)
    throw new Error("The external tool cache must not use symlinked ancestors");
  if (!existsSync(receipt) || !existsSync(directory))
    throw new Error("Run mise run docs:diagrams:setup first");
  if (lstatSync(directory).isSymbolicLink() || lstatSync(receipt).isSymbolicLink())
    throw new Error("Symlinked Archify cache");
  const record = JSON.parse(readFileSync(receipt, "utf8"));
  if (record.revision !== entry.source.revision || record.repository !== entry.source.repository)
    throw new Error("Archify cache provenance changed");
  for (const [file, hash] of Object.entries(record.files)) {
    if (
      file.split("/").some((part) => !part || part === "." || part === "..") ||
      file.includes("\\") ||
      file.startsWith("/")
    )
      throw new Error("Unsafe cached file");
    const path = join(directory, file);
    let parent = path;
    while (parent !== dirname(directory)) {
      if (lstatSync(parent).isSymbolicLink()) throw new Error("Symlink in cached Archify package");
      if (parent === directory) break;
      parent = dirname(parent);
    }
    if (!lstatSync(path).isFile() || sha(readFileSync(path)) !== hash)
      throw new Error(`Archify cache changed: ${file}`);
  }
  return location;
}
export async function setupTool() {
  const location = toolLocation();
  if (existsSync(location.directory) || existsSync(location.receipt)) return verifiedTool();
  mkdirSync(location.base, { recursive: true });
  if (realpathSync(location.base) !== location.base)
    throw new Error("The external tool cache must not use symlinked ancestors");
  const stage = join(location.base, `stage-${randomUUID()}`);
  try {
    await prepareSkills({
      catalog: catalog(),
      names: ["archify"],
      stage,
      sourceRoot: root,
      allowFetch: true,
    });
    const manifest = JSON.parse(readFileSync(join(stage, "manifest.json"), "utf8"));
    const record = manifest.skills.archify;
    renameSync(join(stage, "skills/archify"), location.directory);
    writeFileSync(
      location.receipt,
      JSON.stringify(
        {
          repository: record.origin.repository,
          revision: record.origin.revision,
          files: record.sourceFiles,
        },
        null,
        2,
      ) + "\n",
      { flag: "wx" },
    );
    return verifiedTool();
  } finally {
    if (existsSync(stage)) rmSync(stage, { recursive: true, force: true });
  }
}
