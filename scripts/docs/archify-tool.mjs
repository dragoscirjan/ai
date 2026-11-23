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
// This cache is only for the repository's diagram renderer, not project skill installation.
function safeFile(path) {
  if (
    typeof path !== "string" ||
    path.startsWith("/") ||
    path.includes("\\") ||
    path.split("/").some((part) => !part || part === "." || part === "..")
  )
    throw new Error("Unsafe renderer source path");
  return path;
}
function excluded(path, patterns) {
  return patterns.some((pattern) => {
    const expression = pattern
      .split(/(\*\*\/|\*\*|\*|\?)/)
      .map((part) => {
        if (part === "**/") return "(?:.*/)?";
        if (part === "**") return ".*";
        if (part === "*") return "[^/]*";
        if (part === "?") return "[^/]";
        return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("");
    return new RegExp("^" + expression + "$").test(path);
  });
}
async function download(url, fetcher) {
  const response = await fetcher(url, { signal: globalThis.AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error("Renderer source download failed: " + response.status);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 20 * 1024 * 1024) throw new Error("Renderer source exceeds size limit");
  return bytes;
}
export async function setupTool({ fetcher = fetch } = {}) {
  const location = toolLocation();
  if (existsSync(location.directory) || existsSync(location.receipt)) return verifiedTool();
  mkdirSync(location.base, { recursive: true });
  if (realpathSync(location.base) !== location.base)
    throw new Error("The external tool cache must not use symlinked ancestors");
  const { entry } = location;
  const repository = entry.source.repository.replace("https://github.com/", "");
  const revision = entry.source.revision;
  const source = safeFile(entry.source.path);
  if (entry.source.type !== "github" || entry.include?.length)
    throw new Error("Unsupported renderer source recipe");
  const tree = JSON.parse(
    (
      await download(
        "https://api.github.com/repos/" + repository + "/git/trees/" + revision + "?recursive=1",
        fetcher,
      )
    ).toString(),
  );
  if (tree.truncated || !Array.isArray(tree.tree) || tree.tree.length > 20000)
    throw new Error("Incomplete or oversized renderer source tree");
  const files = new Map();
  const patterns = [...(catalog().defaults?.exclude ?? []), ...(entry.exclude ?? [])];
  for (const item of tree.tree) {
    if (!item.path.startsWith(source + "/") || item.type === "tree") continue;
    const target = safeFile(item.path.slice(source.length + 1));
    if (excluded(target, patterns)) continue;
    files.set(target, item);
  }
  for (const legal of entry.legal ?? []) {
    const item = tree.tree.find((file) => file.path === legal.path);
    if (!item) throw new Error("Missing renderer legal file");
    files.set(safeFile(legal.target), item);
  }
  if (!files.has("SKILL.md")) throw new Error("Missing renderer package");
  for (const item of files.values()) {
    safeFile(item.path);
    if (
      item.type !== "blob" ||
      !["100644", "100755"].includes(item.mode) ||
      !/^[a-f0-9]{40}$/.test(item.sha ?? "")
    )
      throw new Error("Linked or unsupported renderer source");
  }
  const stage = join(location.base, "stage-" + randomUUID());
  mkdirSync(stage);
  const hashes = Object.create(null);
  let total = 0;
  try {
    for (const [target, item] of files) {
      const path = item.path.split("/").map(encodeURIComponent).join("/");
      const bytes = await download(
        "https://raw.githubusercontent.com/" + repository + "/" + revision + "/" + path,
        fetcher,
      );
      total += bytes.length;
      if (total > 64 * 1024 * 1024) throw new Error("Renderer package exceeds size limit");
      if (
        item.sha &&
        createHash("sha1")
          .update("blob " + bytes.length + "\0")
          .update(bytes)
          .digest("hex") !== item.sha
      )
        throw new Error("Renderer source digest mismatch");
      mkdirSync(dirname(join(stage, target)), { recursive: true });
      writeFileSync(join(stage, target), bytes, {
        flag: "wx",
        mode: item.mode === "100755" ? 0o755 : 0o644,
      });
      hashes[target] = sha(bytes);
    }
    renameSync(stage, location.directory);
    writeFileSync(
      location.receipt,
      JSON.stringify(
        {
          repository: entry.source.repository,
          revision,
          files: hashes,
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
