// Read-only catalog validation for repository documentation, not a skill installer.
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  closeSync,
  constants,
  existsSync,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import { basename, isAbsolute, join, relative, resolve, sep } from "node:path";
import { parseDocument } from "yaml";

export const root = fileURLToPath(new URL("../../", import.meta.url));
export const catalogRelativePath =
  ".agents/skills/agentic-work/sync-my-skills/assets/skill-catalog.yaml";
export const catalogPath = join(root, catalogRelativePath);
const schema = JSON.parse(
  readFileSync(join(root, catalogRelativePath.replace(".yaml", ".schema.json")), "utf8"),
);
const categoryIdsInSchema = Object.keys(schema.properties.categories.properties);
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HARNESSES = ["pi", "opencode", "claude-code"];
const SKILLS = ".agents/skills";
const SKIP = new Set([".git", "node_modules"]);
const MAX_FILES = 20000;
function check(condition, message) {
  if (!condition) throw new Error(message);
}
function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function equal(left, right) {
  return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
}

export function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (!object(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, canonical(value[key])]),
  );
}

export function digest(value) {
  return createHash("sha256")
    .update(
      typeof value === "string" || Buffer.isBuffer(value)
        ? value
        : JSON.stringify(canonical(value)),
    )
    .digest("hex");
}

function plain(value, depth = 0, seen = new Set()) {
  check(depth <= 40, "Configuration nesting is too deep");
  if (value === null || typeof value !== "object") return;
  check(!seen.has(value), "Configuration aliases/cycles are not supported");
  seen.add(value);
  for (const [key, child] of Object.entries(value)) {
    check(!["__proto__", "constructor", "prototype"].includes(key), "Unsafe configuration key");
    plain(child, depth + 1, seen);
  }
  seen.delete(value);
}

export function parseYaml(text, label = "YAML") {
  check(Buffer.byteLength(text) <= 1024 * 1024, `${label} exceeds the size limit`);
  const doc = parseDocument(text, {
    version: "1.2",
    strict: true,
    uniqueKeys: true,
    merge: false,
    customTags: [],
  });
  check(
    doc.errors.length === 0 && doc.warnings.length === 0,
    `Invalid ${label}: ${doc.errors[0]?.code ?? doc.warnings[0]?.code ?? "parse error"}`,
  );
  let result;
  try {
    result = doc.toJS({ maxAliasCount: 0 });
  } catch {
    throw new Error(`Aliases are not supported in ${label}`);
  }
  plain(result);
  return result;
}

export function safeRelative(path, allowDot = false) {
  check(
    typeof path === "string" &&
      path.length > 0 &&
      !isAbsolute(path) &&
      !path.includes("\\") &&
      !/[\0\r\n:]/.test(path),
    "Unsafe relative path",
  );
  if (allowDot && path === ".") return path;
  check(
    path.split("/").every((part) => part !== "" && part !== "." && part !== ".."),
    "Unsafe relative path",
  );
  return path;
}

function safePath(root, rel) {
  return join(root, safeRelative(rel));
}

function inside(root, path) {
  const rel = relative(root, path);
  return rel === "" || (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`));
}

function noLinks(root, path) {
  check(inside(root, path), "Path escapes its root");
  let current = root;
  for (const part of ["", ...relative(root, path).split(sep).filter(Boolean)]) {
    if (part) current = join(current, part);
    try {
      check(!lstatSync(current).isSymbolicLink(), "Symlink traversal is not permitted");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}

function readBytes(root, rel) {
  const path = safePath(root, rel);
  noLinks(root, path);
  const before = lstatSync(path);
  check(before.isFile(), `Not a regular file: ${rel}`);
  const fd = openSync(
    path,
    constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0),
  );
  try {
    noLinks(root, path);
    const opened = fstatSync(fd);
    const current = lstatSync(path);
    check(
      opened.isFile() &&
        current.isFile() &&
        opened.dev === before.dev &&
        opened.ino === before.ino &&
        opened.dev === current.dev &&
        opened.ino === current.ino,
      `File changed while opening: ${rel}`,
    );
    return readFileSync(fd);
  } finally {
    closeSync(fd);
  }
}

function runGit(root, args) {
  // Status refresh can run fsmonitor hooks and clean/process filters. Disable
  // those commands for helper reads, not for the owner's publication commands.
  const base = [
    "-c",
    "core.fsmonitor=false",
    "-c",
    `core.hooksPath=${process.execPath}`,
    "-C",
    root,
  ];
  const options = { encoding: "utf8", maxBuffer: 4 * 1024 * 1024, timeout: 30000 };
  const config = spawnSync(
    "git",
    [
      ...base,
      "config",
      "--null",
      "--name-only",
      "--get-regexp",
      "^filter\\..*\\.(clean|smudge|process|required)$",
    ],
    options,
  );
  check([0, 1].includes(config.status), "Cannot inspect Git filter configuration", 4);
  const filters = new Set();
  for (const key of config.stdout.split("\0").filter(Boolean)) {
    check(
      /^filter\.[\w.-]+\.(?:clean|smudge|process|required)$/i.test(key),
      "Unsupported Git filter configuration; inspect it before continuing",
      4,
    );
    filters.add(key.slice(0, key.lastIndexOf(".")));
  }
  const overrides = [...filters].flatMap((name) => [
    "-c",
    `${name}.clean=`,
    "-c",
    `${name}.smudge=`,
    "-c",
    `${name}.process=`,
    "-c",
    `${name}.required=false`,
  ]);
  const result = spawnSync("git", [...base, ...overrides, ...args], options);
  check(result.status === 0, `Git command failed: ${args[0]}`, 4);
  return result.stdout.trim();
}

function strings(value, label, { names = false } = {}) {
  check(
    Array.isArray(value) && value.every((item) => typeof item === "string" && item.length > 0),
    `${label} must be a string array`,
  );
  check(new Set(value).size === value.length, `Duplicate value in ${label}`);
  if (names)
    check(
      value.every((item) => item.length <= 64 && NAME.test(item)),
      `Invalid skill name in ${label}`,
    );
  return value;
}

function knownKeys(value, keys, label) {
  check(
    Object.keys(value).every((key) => keys.includes(key)),
    `Unknown field in ${label}`,
  );
}

function github(repository) {
  let url;
  try {
    url = new URL(repository);
  } catch {
    throw new Error("Invalid GitHub repository URL");
  }
  check(
    url.protocol === "https:" &&
      url.hostname === "github.com" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash,
    "Use a credential-free HTTPS GitHub repository URL",
  );
  const match = url.pathname.replace(/\.git$/, "").match(/^\/([\w.-]+)\/([\w.-]+)\/?$/);
  check(match, "Use a GitHub repository URL, not a tree/blob URL");
  return { owner: match[1], repo: match[2], url: `https://github.com/${match[1]}/${match[2]}` };
}

function sourceDescriptor(source, external = false) {
  check(object(source), "Skill source must be an object");
  knownKeys(source, ["type", "path", "repository", "revision"], "source");
  check(["local", "github"].includes(source.type), "Unsupported source type");
  safeRelative(source.path, true);
  if (source.type === "github" || external) {
    check(source.type === "github", "Upstream provenance must use a GitHub source");
    github(source.repository);
    check(
      /^[a-f0-9]{40}$/.test(source.revision ?? ""),
      "Upstream revisions must be full immutable commit IDs",
    );
  }
}

function installation(install, scope) {
  check(object(install), "Missing installation command");
  knownKeys(install, ["argv"], "install");
  const argv = install.argv;
  check(
    Array.isArray(argv) &&
      argv.length > 0 &&
      argv.every((arg) => typeof arg === "string" && arg.length > 0) &&
      /^[\w.-]+$/.test(argv[0]),
    "Use an executable name and an argument array",
  );
  check(
    !["sh", "bash", "zsh", "cmd", "powershell", "pwsh"].includes(argv[0]),
    "Shell programs are not installation recipes",
  );
  check(
    argv.every((arg) => !/[\0\r\n]/.test(arg)),
    "Invalid installation argument",
  );
  if (argv[0] === "npx")
    check(argv[1] === "-y", "Every npx command must put -y immediately after npx");
  if (scope !== "personal")
    check(
      !argv.some(
        (arg) =>
          arg === "--global" ||
          arg.startsWith("--global=") ||
          arg === "-g" ||
          arg.startsWith("-g=") ||
          arg === "--location=global",
      ),
      "Project recipes must not install globally",
    );
  portable(install);
}

function localSkillPaths(root) {
  const found = new Map();
  const ignored = existsSync(join(root, ".git"))
    ? new Set(
        runGit(root, [
          "ls-files",
          "--others",
          "--ignored",
          "--exclude-standard",
          "--directory",
          "-z",
          "--",
          SKILLS,
        ])
          .split("\0")
          .filter(Boolean)
          .map((path) => path.replace(/\/$/, "")),
      )
    : new Set();
  let entries = 0;
  function visit(path, depth) {
    check(depth <= 40, "Skill inventory nesting is too deep");
    const folder = safePath(root, path);
    noLinks(root, folder);
    if (existsSync(join(folder, "SKILL.md"))) {
      const name = basename(folder);
      frontmatter(readBytes(root, `${path}/SKILL.md`).toString(), name);
      check(!found.has(name), `Duplicate local skill name: ${name}`);
      found.set(name, path);
      return;
    }
    for (const entry of readdirSync(folder, { withFileTypes: true }).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      if (SKIP.has(entry.name)) continue;
      check(++entries <= MAX_FILES, "Skill inventory exceeds the safety limit");
      const child = `${path}/${entry.name}`;
      safeRelative(child);
      check(!entry.isSymbolicLink(), `Symlink in skill inventory: ${child}`);
      if (entry.isDirectory() && !ignored.has(child)) visit(child, depth + 1);
    }
  }
  visit(SKILLS, 0);
  return found;
}

export function closure(names, catalog) {
  strings(names, "selectedSkills", { names: true });
  const visiting = new Set();
  const done = new Set();
  function visit(name) {
    check(catalog.byName.has(name), `Unknown selected skill: ${name}`);
    check(!visiting.has(name), `Skill dependency cycle at ${name}`);
    if (done.has(name)) return;
    visiting.add(name);
    for (const dependency of catalog.byName.get(name).prerequisites) visit(dependency);
    visiting.delete(name);
    done.add(name);
  }
  names.forEach(visit);
  return [...done].sort();
}

function frontmatter(text, expectedName) {
  const match = text.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  check(match, `Missing skill frontmatter: ${expectedName}`);
  const meta = parseYaml(match[1], `frontmatter for ${expectedName}`);
  check(
    object(meta) &&
      meta.name === expectedName &&
      typeof meta.description === "string" &&
      meta.description.trim() &&
      meta.description.length <= 1024,
    `Invalid skill metadata: ${expectedName}`,
  );
  if (meta.requires !== undefined)
    check(
      strings(meta.requires, "requires", { names: true }).length > 0,
      "Empty requires declaration",
    );
  check(meta.require === undefined, "Obsolete require declaration");
  return meta;
}

function portable(value) {
  const text = JSON.stringify(value);
  check(
    !/-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(?:ghp_|github_pat_|sk-|AKIA)[A-Za-z0-9_-]{12,}/.test(
      text,
    ),
    "Do not record credential material",
  );
  function visit(item) {
    if (typeof item === "string")
      check(
        !isAbsolute(item) && !/^[A-Za-z]:[\\/]/.test(item),
        "Do not record absolute machine paths",
      );
    else if (item && typeof item === "object") Object.values(item).forEach(visit);
  }
  visit(value);
}

export function loadCatalog(path = catalogPath, sourceRoot) {
  const text = readFileSync(path, "utf8");
  const data = parseYaml(text, "skill catalog");
  check(object(data), "Catalog must be a mapping");
  knownKeys(
    data,
    ["schemaVersion", "repository", "ref", "defaults", "categories", "skills", "deprecations"],
    "catalog",
  );
  check(data.schemaVersion === 3, "Catalog schemaVersion must be 3");
  check(object(data.categories), "Catalog categories must be a mapping");
  const categoryIds = Object.keys(data.categories);
  check(
    equal([...categoryIds].sort(), [...categoryIdsInSchema].sort()),
    "Use the six documented categories",
  );
  for (const category of Object.values(data.categories)) {
    check(object(category), "Invalid category");
    knownKeys(category, ["title", "summary"], "category");
    check(
      ["title", "summary"].every(
        (key) => typeof category[key] === "string" && category[key].trim(),
      ),
      "Missing category title or summary",
    );
  }
  github(data.repository);
  check(
    typeof data.ref === "string" &&
      /^[\w./-]+$/.test(data.ref) &&
      !data.ref.startsWith("-") &&
      !data.ref.includes(".."),
    "Invalid owner source ref",
  );
  check(
    object(data.skills) && Object.keys(data.skills).length <= 1000,
    "Catalog skills must be a bounded mapping",
  );
  check(object(data.defaults ?? {}), "Invalid catalog defaults");
  knownKeys(data.defaults ?? {}, ["exclude"], "defaults");
  strings(data.defaults?.exclude ?? [], "defaults.exclude").forEach((pattern) =>
    safeRelative(pattern),
  );
  const skills = Object.entries(data.skills).map(([name, definition]) => {
    check(name.length <= 64 && NAME.test(name) && object(definition), "Invalid catalog skill");
    knownKeys(
      definition,
      [
        "kind",
        "source",
        "upstream",
        "scope",
        "description",
        "category",
        "safety",
        "harnesses",
        "capabilities",
        "runtime",
        "prerequisites",
        "install",
        "include",
        "exclude",
        "legal",
        "adaptation",
      ],
      name,
    );
    check(
      ["authored", "upstream", "adapted"].includes(definition.kind),
      `Invalid skill kind: ${name}`,
    );
    check(categoryIds.includes(definition.category), `Unknown category: ${name}`);
    sourceDescriptor(definition.source);
    if (definition.upstream) sourceDescriptor(definition.upstream, true);
    check(
      definition.kind !== "upstream" || definition.source.type === "github",
      `Upstream source required: ${name}`,
    );
    check(
      definition.scope === undefined || ["personal", "project"].includes(definition.scope),
      "Invalid skill scope",
    );
    check(
      name !== "sync-my-skills" || definition.scope === "personal",
      "The manager must remain personal tooling",
    );
    check(name !== "sync-agent-assets", "The retired manager cannot be an active catalog entry");
    check(
      typeof definition.description === "string" && definition.description.length > 0,
      `Missing description: ${name}`,
    );
    for (const field of ["category", "safety"])
      check(
        definition[field] === undefined || typeof definition[field] === "string",
        `Invalid ${field}: ${name}`,
      );
    strings(definition.harnesses, `${name}.harnesses`);
    check(
      definition.harnesses.length > 0 && definition.harnesses.every((h) => HARNESSES.includes(h)),
      `Unsupported harness: ${name}`,
    );
    const prerequisites = strings(definition.prerequisites ?? [], `${name}.prerequisites`, {
      names: true,
    });
    strings(definition.capabilities ?? [], `${name}.capabilities`);
    strings(definition.runtime ?? [], `${name}.runtime`);
    installation(definition.install, definition.scope);
    for (const key of ["include", "exclude"])
      strings(definition[key] ?? [], `${name}.${key}`).forEach((pattern) => safeRelative(pattern));
    check(Array.isArray(definition.legal ?? []), `Invalid legal files: ${name}`);
    for (const legal of definition.legal ?? []) {
      check(object(legal), "Invalid legal file");
      knownKeys(legal, ["path", "target", "spdx"], "legal");
      safeRelative(legal.path);
      safeRelative(legal.target);
      check(
        typeof legal.spdx === "string" && legal.spdx.length > 0,
        "Missing legal license identifier",
      );
    }
    if (definition.kind === "adapted")
      check(
        typeof definition.adaptation?.instructions === "string" &&
          definition.adaptation.instructions.trim(),
        `Missing adaptation intent: ${name}`,
      );
    if (definition.adaptation) {
      check(
        object(definition.adaptation) &&
          typeof definition.adaptation.instructions === "string" &&
          definition.adaptation.instructions.trim(),
        "Invalid adaptation intent",
      );
      knownKeys(definition.adaptation, ["instructions", "review"], "adaptation");
      strings(definition.adaptation.review ?? [], `${name}.adaptation.review`);
    }
    if (sourceRoot && definition.source.type === "local") {
      const folder = safePath(sourceRoot, definition.source.path);
      noLinks(sourceRoot, folder);
      const meta = frontmatter(readBytes(folder, "SKILL.md").toString(), name);
      for (const requirement of meta.requires ?? [])
        check(
          prerequisites.includes(requirement),
          `Catalog is missing ${name}'s declared prerequisite ${requirement}`,
        );
    }
    return { ...definition, name, scope: definition.scope ?? "project", prerequisites };
  });
  const byName = new Map(skills.map((entry) => [entry.name, entry]));
  for (const entry of skills)
    for (const name of entry.prerequisites)
      check(byName.has(name), `Unknown prerequisite ${name} for ${entry.name}`);
  const result = { ...data, skills, byName, hash: digest(data), path: resolve(path) };
  for (const entry of skills) closure([entry.name], result);
  check(
    data.deprecations === undefined || object(data.deprecations),
    "Deprecations must be a mapping",
  );
  for (const [name, record] of Object.entries(data.deprecations ?? {})) {
    check(
      name.length <= 64 && NAME.test(name) && !byName.has(name) && object(record),
      `Invalid deprecation: ${name}`,
    );
    knownKeys(record, ["replacements", "reason"], "deprecation");
    strings(record.replacements, `${name}.replacements`, { names: true });
    check(
      record.replacements.every((replacement) => byName.has(replacement)),
      `Unknown replacement: ${name}`,
    );
    check(
      typeof record.reason === "string" && record.reason,
      `Missing deprecation reason: ${name}`,
    );
  }
  if (sourceRoot) {
    const directories = Object.fromEntries(localSkillPaths(sourceRoot));
    const local = Object.fromEntries(
      skills
        .filter((entry) => entry.source.type === "local")
        .map((entry) => [entry.name, entry.source.path]),
    );
    check(equal(directories, local), "Catalog coverage differs from local skill directories");
  }
  portable(data);
  return result;
}

export function catalog() {
  return loadCatalog(catalogPath, root);
}

const inventory = catalog();
export const groups = Object.entries(inventory.categories).map(([id, definition]) => ({
  id,
  ...definition,
  skills: inventory.skills.filter((entry) => entry.category === id).map((entry) => entry.name),
}));

export function docsBase(value = process.env.DOCS_BASE ?? "/") {
  if (value !== "/" && !/^\/(?:[a-zA-Z0-9][a-zA-Z0-9_-]*\/)+$/.test(value)) {
    throw new Error(
      "DOCS_BASE must be / or a slash-delimited site path such as /projects/ai-skills/",
    );
  }
  return value;
}

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
