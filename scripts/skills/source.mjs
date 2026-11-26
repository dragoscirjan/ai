import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, matchesGlob, resolve } from "node:path";
import { check, digest, github, noLinks, safeRelative } from "./catalog.mjs";

export async function fetchBytes(url, fetcher = globalThis.fetch) {
  const response = await fetcher(url, { signal: AbortSignal.timeout(30000), redirect: "error" });
  check(response.ok, `Cannot acquire required source file (${response.status})`);
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    check(size <= 12 * 1024 * 1024, "Source file exceeds the size limit");
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// Source acquisition only. This does not install a skill or execute downloaded code.
export async function downloadSource({
  source,
  directory,
  legal = [],
  exclude = [],
  fetcher = globalThis.fetch,
}) {
  const repository = github(source.repository);
  check(
    source.type === "github" && /^[a-f0-9]{40}$/.test(source.revision),
    "Source acquisition requires a pinned GitHub source",
  );
  safeRelative(source.path, true);
  directory = resolve(directory);
  noLinks(dirname(directory), directory);
  check(!existsSync(directory), "Source destination already exists");
  const [owner, repo] = new URL(repository).pathname.slice(1).split("/");
  const raw = `https://raw.githubusercontent.com/${owner}/${repo}/${source.revision}/`;
  const tree = JSON.parse(
    (
      await fetchBytes(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${source.revision}?recursive=1`,
        fetcher,
      )
    ).toString(),
  );
  check(
    tree && tree.truncated === false && Array.isArray(tree.tree) && tree.tree.length <= 20000,
    "Incomplete or oversized source tree",
  );
  const prefix = source.path === "." ? "" : `${source.path}/`;
  const selected = new Map();
  const byPath = new Map();
  for (const entry of tree.tree) {
    safeRelative(entry.path);
    check(!byPath.has(entry.path), "Duplicate source path");
    byPath.set(entry.path, entry);
    if (!entry.path.startsWith(prefix) || entry.type === "tree") continue;
    const rel = entry.path.slice(prefix.length);
    safeRelative(rel);
    if (exclude.some((pattern) => matchesGlob(rel, pattern))) continue;
    selected.set(rel, entry);
  }
  for (const file of legal) {
    safeRelative(file.path);
    safeRelative(file.target);
    const entry = byPath.get(file.path);
    check(entry, `Missing required source file: ${file.path}`);
    check(
      !selected.has(file.target) || selected.get(file.target).path === file.path,
      "Conflicting source/legal target",
    );
    selected.set(file.target, entry);
  }
  check(selected.has("SKILL.md") && selected.size <= 20000, "Incomplete source skill");
  for (const entry of selected.values())
    check(
      entry.type === "blob" &&
        ["100644", "100755"].includes(entry.mode) &&
        /^[a-f0-9]{40}$/.test(entry.sha),
      "Symlinks, submodules, or unsupported source entries are not permitted",
    );
  const files = Object.create(null);
  let total = 0;
  // Acquire and verify everything before making a cache directory visible.
  const contents = [];
  for (const [rel, entry] of selected) {
    const bytes = await fetchBytes(
      raw + entry.path.split("/").map(encodeURIComponent).join("/"),
      fetcher,
    );
    total += bytes.length;
    check(total <= 64 * 1024 * 1024, "Source package exceeds the size limit");
    const blob = createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
    check(blob === entry.sha, `Source blob hash mismatch: ${rel}`);
    files[rel] = digest(bytes);
    contents.push([rel, bytes, entry.mode === "100755" ? 0o755 : 0o644]);
  }
  mkdirSync(directory, { recursive: false });
  for (const [rel, bytes, mode] of contents) {
    const path = join(directory, rel);
    noLinks(directory, path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, bytes, { flag: "wx", mode });
  }
  return { repository, revision: source.revision, files };
}
