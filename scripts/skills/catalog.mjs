import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";

export const PACKAGE_ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const CATALOG_PATH = join(PACKAGE_ROOT, "catalog/skill-catalog.yaml");
export const HARNESSES = ["pi", "opencode", "claude-code"];
export const GROUPS = [
  "productivity",
  "coding",
  "documentation",
  "agentic-work",
  "utility",
  "unpolished",
];
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const keys = (value, allowed, label) => {
  check(object(value), `${label} must be a mapping`);
  check(
    Object.keys(value).every((key) => allowed.includes(key)),
    `Unknown field in ${label}`,
  );
};
function strings(value, label, names = false) {
  check(
    Array.isArray(value) &&
      value.every(
        (item) =>
          typeof item === "string" &&
          item.length > 0 &&
          (!names || (item.length <= 64 && NAME.test(item))),
      ),
    `Invalid ${label}`,
  );
  check(new Set(value).size === value.length, `Duplicate value in ${label}`);
  return value;
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
export function parseYaml(text, label = "YAML") {
  check(Buffer.byteLength(text) <= 1024 * 1024, `${label} exceeds the size limit`);
  const document = parseDocument(text, {
    version: "1.2",
    strict: true,
    uniqueKeys: true,
    merge: false,
    customTags: [],
  });
  check(
    !document.errors.length && !document.warnings.length,
    `Invalid ${label}: ${document.errors[0]?.code ?? document.warnings[0]?.code ?? "parse error"}`,
  );
  let value;
  try {
    value = document.toJS({ maxAliasCount: 0 });
  } catch {
    throw new Error(`Aliases are not supported in ${label}`);
  }
  const visit = (node, depth = 0) => {
    check(depth <= 40, `${label} is too deeply nested`);
    if (!object(node) && !Array.isArray(node)) return;
    for (const [key, child] of Object.entries(node)) {
      check(
        !["__proto__", "constructor", "prototype", "<<"].includes(key),
        `Unsafe key in ${label}`,
      );
      visit(child, depth + 1);
    }
  };
  visit(value);
  return value;
}
export function safeRelative(path, allowDot = false) {
  check(
    typeof path === "string" && path && !isAbsolute(path) && !/[\\\0\r\n:]/.test(path),
    "Unsafe relative path",
  );
  if (allowDot && path === ".") return path;
  check(
    path.split("/").every((part) => part && part !== "." && part !== ".."),
    "Unsafe relative path",
  );
  return path;
}
export function noLinks(root, path) {
  root = resolve(root);
  path = resolve(path);
  const rel = relative(root, path);
  check(!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`), "Path escapes its root");
  let current = root;
  for (const part of ["", ...rel.split(sep).filter(Boolean)]) {
    if (part) current = join(current, part);
    try {
      check(!lstatSync(current).isSymbolicLink(), "Symlink traversal is not permitted");
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}
export function github(repository) {
  let url;
  try {
    url = new URL(repository);
  } catch {
    throw new Error("Invalid GitHub repository URL");
  }
  check(
    url.protocol === "https:" &&
      url.hostname === "github.com" &&
      !url.port &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      /^\/[\w.-]+\/[\w.-]+\/?$/.test(url.pathname),
    "Use a credential-free HTTPS GitHub repository URL",
  );
  return url.href.replace(/\/$/, "");
}
function source(source, external = false) {
  keys(source, ["type", "path", "repository", "revision"], "source");
  check(["local", "github"].includes(source.type), "Unsupported source type");
  safeRelative(source.path, true);
  check(!/[?#%\s]/.test(source.path), "Source paths must be unambiguous URL paths");
  if (source.type === "github" || external) {
    check(source.type === "github", "Upstream provenance must use GitHub");
    github(source.repository);
    check(
      /^[a-f0-9]{40}$/.test(source.revision ?? ""),
      "Upstream revisions must be immutable full commit IDs",
    );
  }
}
export function frontmatter(text, expectedName) {
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
  check(meta.require === undefined, "Obsolete require declaration");
  if (meta.requires !== undefined) {
    strings(meta.requires, "requires", true);
    check(meta.requires.length > 0, "Empty requires declaration");
    const declaration = match[1].match(/^requires: (\[[^\r\n]+\])$/m);
    check(
      declaration && JSON.stringify(JSON.parse(declaration[1])) === JSON.stringify(meta.requires),
      "requires must be one inline JSON array",
    );
  }
  return meta;
}
export function closure(names, catalog) {
  strings(names, "selected skills", true);
  const visiting = new Set(),
    done = new Set();
  function visit(name) {
    check(catalog.byName.has(name), `Unknown selected skill: ${name}`);
    check(!visiting.has(name), `Skill dependency cycle at ${name}`);
    if (done.has(name)) return;
    visiting.add(name);
    catalog.byName.get(name).prerequisites.forEach(visit);
    visiting.delete(name);
    done.add(name);
  }
  names.forEach(visit);
  return [...done];
}
function localSkillPaths(root) {
  const result = new Map();
  const git = spawnSync(
    "git",
    [
      "-c",
      "core.fsmonitor=false",
      "-C",
      root,
      "ls-files",
      "--cached",
      "--others",
      "--exclude-standard",
      "-z",
      "--",
      ".agents/skills",
    ],
    { encoding: "utf8", timeout: 30000, maxBuffer: 4 * 1024 * 1024 },
  );
  if (git.status === 0) {
    for (const path of git.stdout.split("\0")) {
      if (!path.endsWith("/SKILL.md") || !existsSync(join(root, path))) continue;
      noLinks(root, join(root, path));
      const name = basename(dirname(path));
      check(!result.has(name), `Duplicate local skill name: ${name}`);
      frontmatter(readFileSync(join(root, path), "utf8"), name);
      result.set(name, dirname(path).split(sep).join("/"));
    }
  } else {
    let count = 0;
    function visit(path, depth = 0) {
      check(depth <= 40 && ++count <= 20000, "Skill inventory exceeds limits");
      noLinks(root, path);
      if (existsSync(join(path, "SKILL.md"))) {
        const name = basename(path);
        check(!result.has(name), `Duplicate local skill name: ${name}`);
        frontmatter(readFileSync(join(path, "SKILL.md"), "utf8"), name);
        result.set(name, relative(root, path).split(sep).join("/"));
        return;
      }
      for (const entry of readdirSync(path, { withFileTypes: true })) {
        if ([".git", "node_modules"].includes(entry.name)) continue;
        check(!entry.isSymbolicLink(), "Symlink in skill inventory");
        if (entry.isDirectory()) visit(join(path, entry.name), depth + 1);
      }
    }
    visit(join(root, ".agents/skills"));
  }
  return result;
}
export function supportsScope(entry, scope) {
  return entry.scope === "both" || entry.scope === scope;
}
export function loadCatalog(path = CATALOG_PATH, sourceRoot) {
  const data = parseYaml(readFileSync(path, "utf8"), "skill catalog");
  keys(
    data,
    ["schemaVersion", "repository", "ref", "defaults", "skills", "groups", "deprecations"],
    "catalog",
  );
  check(data.schemaVersion === 2, "Catalog schemaVersion must be 2");
  github(data.repository);
  check(
    typeof data.ref === "string" &&
      /^[\w./-]+$/.test(data.ref) &&
      !data.ref.startsWith("-") &&
      !data.ref.includes(".."),
    "Invalid owner source ref",
  );
  keys(data.defaults ?? {}, ["exclude"], "defaults");
  strings(data.defaults?.exclude ?? [], "defaults.exclude").forEach((pattern) =>
    safeRelative(pattern),
  );
  check(
    object(data.skills) &&
      Object.keys(data.skills).length > 0 &&
      Object.keys(data.skills).length <= 1000,
    "Catalog skills must be a bounded mapping",
  );
  const skills = Object.entries(data.skills).map(([name, definition]) => {
    check(name.length <= 64 && NAME.test(name), "Invalid skill name");
    keys(
      definition,
      [
        "kind",
        "source",
        "upstream",
        "scope",
        "description",
        "category",
        "selection",
        "safety",
        "signals",
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
    source(definition.source);
    if (definition.upstream) source(definition.upstream, true);
    check(
      definition.kind !== "upstream" || definition.source.type === "github",
      `Upstream source required: ${name}`,
    );
    check(
      !["sync-my-skills", "sync-agent-assets"].includes(name),
      "The combined manager is retired",
    );
    check(
      definition.scope === undefined || ["project", "personal", "both"].includes(definition.scope),
      "Invalid scope",
    );
    check(
      typeof definition.description === "string" && definition.description.trim(),
      `Missing description: ${name}`,
    );
    for (const key of ["category", "safety"])
      check(definition[key] === undefined || typeof definition[key] === "string", `Invalid ${key}`);
    check(
      definition.selection === undefined ||
        ["optional", "recommended", "detected", "wrapper", "initializer"].includes(
          definition.selection,
        ),
      "Invalid selection",
    );
    if (definition.signals !== undefined) {
      keys(definition.signals, ["files", "extensions", "askWithoutSignals"], "signals");
      strings(definition.signals.files ?? [], "signals.files");
      strings(definition.signals.extensions ?? [], "signals.extensions");
      check(
        definition.signals.askWithoutSignals === undefined ||
          typeof definition.signals.askWithoutSignals === "boolean",
        "Invalid signal hint",
      );
    }
    strings(definition.harnesses, "harnesses");
    check(
      definition.harnesses.length &&
        definition.harnesses.every((agent) => HARNESSES.includes(agent)),
      "Unsupported harness",
    );
    const prerequisites = strings(definition.prerequisites ?? [], "prerequisites", true);
    for (const key of ["runtime", "capabilities"]) strings(definition[key] ?? [], key);
    for (const key of ["include", "exclude"])
      strings(definition[key] ?? [], key).forEach((pattern) => safeRelative(pattern));
    keys(definition.install, ["argv"], "install");
    const argv = definition.install.argv;
    check(
      Array.isArray(argv) &&
        argv.every((arg) => typeof arg === "string" && arg && !/[\0\r\n]/.test(arg)) &&
        argv[0] === "npx" &&
        argv[1] === "-y" &&
        argv[2] === "skills@1.7.4" &&
        argv[3] === "add",
      "Installation must use the pinned Skills CLI and npx -y",
    );
    const expectedUrl =
      definition.source.type === "local"
        ? `${data.repository}/tree/${data.ref}/${definition.source.path}`
        : `${definition.source.repository}/tree/${definition.source.revision}/${definition.source.path}`;
    check(
      argv[4] === expectedUrl &&
        argv[5] === "--skill" &&
        argv[6] === name &&
        (definition.scope === "personal"
          ? argv.length === 8 && argv[7] === "--global"
          : argv.length === 7),
      `Invalid catalogued source/command: ${name}`,
    );
    check(Array.isArray(definition.legal ?? []), "Invalid legal files");
    for (const legal of definition.legal ?? []) {
      keys(legal, ["path", "target", "spdx"], "legal");
      safeRelative(legal.path);
      safeRelative(legal.target);
      check(typeof legal.spdx === "string" && legal.spdx, "Missing legal license identifier");
    }
    if (definition.kind === "adapted")
      check(definition.adaptation?.instructions?.trim(), `Missing adaptation intent: ${name}`);
    if (definition.adaptation) {
      keys(definition.adaptation, ["instructions", "review"], "adaptation");
      check(
        typeof definition.adaptation.instructions === "string" &&
          definition.adaptation.instructions.trim(),
        "Invalid adaptation",
      );
      strings(definition.adaptation.review ?? [], "adaptation.review");
    }
    if (sourceRoot && definition.source.type === "local") {
      const folder = join(sourceRoot, definition.source.path);
      noLinks(sourceRoot, join(folder, "SKILL.md"));
      const meta = frontmatter(readFileSync(join(folder, "SKILL.md"), "utf8"), name);
      for (const requirement of meta.requires ?? [])
        check(
          prerequisites.includes(requirement),
          `Catalog is missing ${name}'s declared prerequisite ${requirement}`,
        );
    }
    return { ...definition, name, scope: definition.scope ?? "project", prerequisites };
  });
  const result = {
    ...data,
    skills,
    byName: new Map(skills.map((entry) => [entry.name, entry])),
    path: resolve(path),
    hash: digest(data),
  };
  skills.forEach((entry) => closure([entry.name], result));
  keys(data.groups, GROUPS, "groups");
  check(
    GROUPS.every((id) => Object.hasOwn(data.groups, id)),
    "Catalog must define all six groups",
  );
  const members = [];
  for (const [id, group] of Object.entries(data.groups)) {
    keys(group, ["title", "summary", "skills"], `group ${id}`);
    check(
      typeof group.title === "string" &&
        group.title &&
        typeof group.summary === "string" &&
        group.summary,
      "Invalid group description",
    );
    strings(group.skills, `group ${id} skills`, true);
    check(
      group.skills.length && group.skills.every((name) => result.byName.has(name)),
      "Unknown group member",
    );
    members.push(...group.skills);
  }
  check(
    members.length === skills.length && new Set(members).size === skills.length,
    "Groups must contain every skill exactly once",
  );
  keys(data.deprecations ?? {}, Object.keys(data.deprecations ?? {}), "deprecations");
  for (const [name, record] of Object.entries(data.deprecations ?? {})) {
    check(NAME.test(name) && !result.byName.has(name), "Invalid deprecation name");
    keys(record, ["replacements", "reason"], "deprecation");
    strings(record.replacements, "deprecation replacements", true);
    check(
      record.replacements.every((replacement) => result.byName.has(replacement)) &&
        typeof record.reason === "string" &&
        record.reason,
      "Invalid deprecation",
    );
  }
  if (sourceRoot) {
    const inventory = Object.fromEntries(localSkillPaths(resolve(sourceRoot)));
    const expected = Object.fromEntries(
      skills
        .filter((entry) => entry.source.type === "local")
        .map((entry) => [entry.name, entry.source.path]),
    );
    check(
      JSON.stringify(canonical(inventory)) === JSON.stringify(canonical(expected)),
      "Catalog coverage differs from local skill directories",
    );
  }
  return result;
}
