import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import {
  dirname,
  isAbsolute,
  join,
  matchesGlob,
  parse as parsePath,
  relative,
  resolve,
} from "node:path";
import {
  CATALOG_PATH,
  HARNESSES,
  check,
  closure,
  digest,
  frontmatter,
  loadCatalog,
  noLinks,
  safeRelative,
} from "./catalog.mjs";
import { fetchBytes } from "./source.mjs";

const absolute = (value, label) => {
  const path = resolve(value);
  check(
    existsSync(path) && lstatSync(path).isDirectory() && realpathSync(path) === path,
    `${label} must be an existing directory without symlinked ancestors`,
  );
  return path;
};
export function destinations(target, name, agents, scope, home = homedir(), env = process.env) {
  if (scope === "personal") {
    for (const key of ["CLAUDE_CONFIG_DIR", "XDG_CONFIG_HOME"])
      check(!env[key] || isAbsolute(env[key]), `${key} must be absolute for personal installation`);
  }
  const canonical = join(scope === "personal" ? home : target, ".agents/skills", name);
  return [
    ...new Set([
      canonical,
      ...agents.map((agent) => {
        if (scope === "project")
          return agent === "claude-code" ? join(target, ".claude/skills", name) : canonical;
        if (agent === "claude-code")
          return join(env.CLAUDE_CONFIG_DIR ?? join(home, ".claude"), "skills", name);
        if (agent === "opencode")
          return join(env.XDG_CONFIG_HOME ?? join(home, ".config"), "opencode/skills", name);
        return canonical;
      }),
    ]),
  ];
}
function existing(path) {
  try {
    lstatSync(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
function assertDestination(path, canonical) {
  noLinks(parsePath(resolve(path)).root, dirname(path));
  if (existing(path) && lstatSync(path).isSymbolicLink()) {
    check(
      path !== canonical && resolve(dirname(path), readlinkSync(path)) === canonical,
      `Unsafe skill projection: ${path}`,
    );
    noLinks(dirname(canonical), canonical);
  } else noLinks(dirname(path), path);
}
export function buildPlan(options, catalog = loadCatalog(CATALOG_PATH), context = {}) {
  const target = absolute(options.target ?? process.cwd(), "Target");
  const scope = options.scope ?? "project";
  check(["project", "personal"].includes(scope), "Scope must be project or personal");
  const agents = [...new Set(options.agents ?? [])];
  check(
    agents.length && agents.every((agent) => HARNESSES.includes(agent)),
    "Choose supported agents: pi, opencode, claude-code",
  );
  check(
    options.categories?.length || options.skills?.length,
    "Select at least one category or skill",
  );
  const requested = [...(options.skills ?? [])];
  const excludedByScope = [];
  for (const category of options.categories ?? []) {
    check(Object.hasOwn(catalog.groups, category), `Unknown category: ${category}`);
    for (const name of catalog.groups[category].skills) {
      if (catalog.byName.get(name).scope === scope) requested.push(name);
      else excludedByScope.push(name);
    }
  }
  const names = closure([...new Set(requested)], catalog);
  check(names.length, `No ${scope}-scoped skills selected`);
  const ref = options.ref ?? catalog.ref;
  check(
    typeof ref === "string" &&
      /^[\w./-]+$/.test(ref) &&
      !ref.startsWith("-") &&
      !ref.includes(".."),
    "Invalid source ref",
  );
  const home = context.home ?? homedir(),
    env = context.env ?? process.env;
  const blocked = [];
  const entries = names.map((name) => {
    const entry = catalog.byName.get(name);
    check(
      entry.scope === scope,
      `Skill ${name} needs ${entry.scope} scope; select it in a separate run`,
    );
    check(
      agents.every((agent) => entry.harnesses.includes(agent)),
      `Selected agents are unsupported for ${name}`,
    );
    if (entry.kind === "adapted" && entry.source.type !== "local")
      blocked.push(
        `${name}: requires reviewed semantic adaptation; deterministic upstream installation would discard the maintained workflow`,
      );
    if (entry.include?.length) blocked.push(`${name}: custom include rules are not supported`);
    const paths = destinations(target, name, agents, scope, home, env);
    const canonical = paths[0];
    for (const path of paths) {
      assertDestination(path, canonical);
      if (existing(path) && !options.overwrite)
        blocked.push(
          `${name}: existing destination ${path}; review it and explicitly pass --overwrite to replace this selected skill`,
        );
    }
    const argv = [...entry.install.argv];
    if (entry.source.type === "local")
      argv[4] = `${catalog.repository}/tree/${ref}/${entry.source.path}`;
    argv.push("--agent", ...agents, "--yes");
    const exclude = [...(catalog.defaults?.exclude ?? []), ...(entry.exclude ?? [])];
    for (const legal of entry.legal ?? [])
      check(
        !exclude.some((pattern) => matchesGlob(legal.target, pattern)),
        `Excluded required legal file: ${name}/${legal.target}`,
      );
    return {
      name,
      argv,
      destinations: paths,
      source: entry.source,
      runtime: entry.runtime ?? [],
      prerequisites: entry.prerequisites,
      legal: entry.legal ?? [],
      exclude,
    };
  });
  return {
    target,
    scope,
    agents,
    categories: options.categories ?? [],
    selected: [...new Set(requested)],
    prerequisites: names.filter((name) => !requested.includes(name)),
    excludedByScope: [...new Set(excludedByScope)],
    overwrite: !!options.overwrite,
    ref,
    catalogHash: catalog.hash,
    repository: catalog.repository,
    blocked,
    entries,
  };
}
export function quote(argument) {
  return /^[A-Za-z0-9_./:@=-]+$/.test(argument)
    ? argument
    : `'${argument.replaceAll("'", "'\\''")}'`;
}
export function printPlan(plan, output = console.log) {
  output(`Target: ${plan.target}\nScope: ${plan.scope}\nAgents: ${plan.agents.join(", ")}`);
  if (plan.prerequisites.length) output(`Required skills added: ${plan.prerequisites.join(", ")}`);
  if (plan.excludedByScope.length)
    output(`Outside ${plan.scope} scope, unchanged: ${plan.excludedByScope.join(", ")}`);
  for (const entry of plan.entries) {
    output(
      `\n${entry.name}\n  ${entry.argv.map(quote).join(" ")}\n  destinations: ${entry.destinations.join(", ")}`,
    );
    if (entry.runtime.length)
      output(`  Runtime requirements, not installed: ${entry.runtime.join("; ")}`);
    output(
      `  Preserve legal files: ${entry.legal.map((file) => file.target).join(", ") || "none declared"}; apply catalog exclusions`,
    );
  }
  if (plan.overwrite)
    output(
      "WARNING: --overwrite permits replacement of existing content only for these selected skills.",
    );
  if (plan.blocked.length)
    output(
      `\nBlocked before installation:\n${plan.blocked.map((message) => `- ${message}`).join("\n")}`,
    );
  output(
    "\nProject instructions, skipped skills, and legacy locks are not managed by this command. Follow the target project's branch/workspace rules before confirming.",
  );
}
function legalUrl(plan, entry, file) {
  const repository = entry.source.type === "local" ? plan.repository : entry.source.repository;
  const ref = entry.source.type === "local" ? plan.ref : entry.source.revision;
  const [owner, repo] = new URL(repository).pathname.slice(1).split("/");
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref.split("/").map(encodeURIComponent).join("/")}/${file.path.split("/").map(encodeURIComponent).join("/")}`;
}
function instructionSnapshot(target) {
  const result = new Map(),
    pending = ["AGENTS.md", "CONTRIBUTING.md", "DOCUMENTATION.md", "VALIDATION.md", "CLAUDE.md"];
  while (pending.length) {
    const name = pending.shift();
    if (result.has(name) || name.includes("/skills/")) continue;
    safeRelative(name);
    const path = join(target, name);
    noLinks(target, path);
    if (!existsSync(path)) {
      result.set(name, null);
      continue;
    }
    check(result.size < 500 && lstatSync(path).isFile(), "Unsupported instruction reference graph");
    const bytes = readFileSync(path);
    result.set(name, digest(bytes));
    for (const match of bytes.toString().matchAll(/\[[^\]]*\]\(([^)#]+\.md)(?:#[^)]*)?\)/g)) {
      if (/^[a-z]+:/i.test(match[1]) || match[1].startsWith("/")) continue;
      const dependency = relative(target, resolve(dirname(path), match[1]))
        .split("\\")
        .join("/");
      safeRelative(dependency);
      pending.push(dependency);
    }
  }
  return result;
}
function verifySnapshot(target, snapshot) {
  for (const [name, hash] of snapshot) {
    const path = join(target, name);
    noLinks(target, path);
    check(
      (existsSync(path) ? digest(readFileSync(path)) : null) === hash,
      `Instruction document changed unexpectedly: ${name}; stop and inspect the installer result`,
    );
  }
}
function filterAndVerify(root, entry) {
  let count = 0;
  function visit(folder) {
    for (const child of readdirSync(folder, { withFileTypes: true })) {
      check(++count <= 20000, "Installed skill exceeds the file limit");
      const path = join(folder, child.name),
        rel = relative(root, path).split("\\").join("/");
      check(!child.isSymbolicLink(), `Symlink in installed skill: ${entry.name}/${rel}`);
      if (
        entry.exclude.some(
          (pattern) => matchesGlob(rel, pattern) || matchesGlob(`${rel}/`, pattern),
        )
      )
        rmSync(path, { recursive: true });
      else if (child.isDirectory()) visit(path);
      else check(child.isFile(), `Unsupported installed file: ${entry.name}/${rel}`);
    }
  }
  noLinks(dirname(root), root);
  check(lstatSync(root).isDirectory(), `Missing installed skill: ${entry.name}`);
  visit(root);
  const meta = frontmatter(readFileSync(join(root, "SKILL.md"), "utf8"), entry.name);
  for (const requirement of meta.requires ?? [])
    check(
      entry.prerequisites.includes(requirement),
      `Undeclared prerequisite ${requirement} in installed ${entry.name}`,
    );
  for (const legal of entry.legal) {
    noLinks(root, join(root, legal.target));
    check(lstatSync(join(root, legal.target)).isFile(), `Missing legal file: ${legal.target}`);
  }
}
export async function executePlan(
  plan,
  { confirmed = false, run, fetcher = globalThis.fetch } = {},
) {
  check(confirmed, "Explicit confirmation is required");
  check(!plan.blocked.length, `Installation blocked:\n${plan.blocked.join("\n")}`);
  const instructions = instructionSnapshot(plan.target);
  const licenses = new Map();
  // Fail source acquisition before any selected destination can be changed.
  for (const entry of plan.entries)
    for (const file of entry.legal) {
      const url = legalUrl(plan, entry, file);
      if (!licenses.has(url)) licenses.set(url, await fetchBytes(url, fetcher));
    }
  const invoke =
    run ??
    ((argv, cwd) => {
      const result = spawnSync(argv[0], argv.slice(1), {
        cwd,
        stdio: "inherit",
        shell: false,
        timeout: 300000,
        env: { ...process.env, DISABLE_TELEMETRY: "1" },
      });
      if (result.error) throw result.error;
      check(result.status === 0, `Skills CLI failed with status ${result.status ?? result.signal}`);
    });
  const completed = [];
  for (const entry of plan.entries) {
    for (const path of entry.destinations) {
      assertDestination(path, entry.destinations[0]);
      check(
        plan.overwrite || !existing(path),
        `Destination appeared after preview: ${entry.name}; review before retrying`,
      );
    }
    try {
      await invoke(entry.argv, plan.target);
      verifySnapshot(plan.target, instructions);
      const canonical = entry.destinations[0];
      for (const destination of entry.destinations) {
        assertDestination(destination, canonical);
        check(existing(destination), `Skills CLI did not create ${destination}`);
        const folder = realpathSync(destination);
        check(
          folder === canonical || folder === destination,
          `Unexpected installed location: ${entry.name}`,
        );
        for (const file of entry.legal) {
          const path = join(folder, file.target);
          noLinks(folder, path);
          mkdirSync(dirname(path), { recursive: true });
          writeFileSync(path, licenses.get(legalUrl(plan, entry, file)));
        }
        filterAndVerify(folder, entry);
      }
      completed.push(entry.name);
    } catch (error) {
      throw new Error(
        `Stopped at ${entry.name}; completed: ${completed.join(", ") || "none"}. Inspect partial installation before retrying. ${error.message}`,
        { cause: error },
      );
    }
  }
  verifySnapshot(plan.target, instructions);
  return completed;
}
