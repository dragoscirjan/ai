import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readlinkSync, rmSync,
  statSync, symlinkSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { stringify } from "yaml";
import {
  PACKAGE_ROOT, LOCK_PATH, digest, parseYaml, safeRelative, loadCatalog, closure,
  inspectProject, prepareSkills, reviewSkill, planSync, applySync, projectStatus,
  planSetup, applySetup,
} from "./sync-core.mjs";

const script = join(PACKAGE_ROOT, "scripts/sync-my-skills.mjs");
const repository = resolve(PACKAGE_ROOT, "../../..");
function git(root, ...args) {
  return execFileSync("git", ["-C", root, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}
function put(root, path, text) { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), text); }
function init(root) {
  mkdirSync(root, { recursive: true }); git(root, "init", "-q", "--initial-branch=main");
  git(root, "config", "user.name", "Sync Fixture"); git(root, "config", "user.email", "sync@example.invalid");
  git(root, "config", "commit.gpgsign", "false");
}
function commit(root) { git(root, "add", "."); return git(root, "commit", "-qm", "Fixture"); }
function skill(name, text = "Keep the useful workflow.", requirements = []) {
  return `---\nname: ${name}\ndescription: Fixture ${name}.\n${requirements.length ? `requires: ${JSON.stringify(requirements)}\n` : ""}---\n\n${text}\n`;
}
function fixture(t, change = () => {}) {
  const base = mkdtempSync(join(tmpdir(), "sync-my-skills-test-"));
  // Only this test's disposable repositories are removed. Never touch real workspaces.
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const source = join(base, "source"); const primary = join(base, "project"); const root = join(base, "worktree");
  init(source); init(primary);
  git(source, "remote", "add", "origin", "https://github.com/example/skills");
  put(source, "LICENSE", "MIT License\nCopyright Fixture\n");
  for (const name of ["alpha", "beta"]) put(source, `.agents/skills/${name}/SKILL.md`, skill(name));
  put(source, ".agents/skills/alpha/reference.md", "Supporting reference.\n");
  const definition = (name) => ({
    kind: "authored", description: `Fixture ${name}.`, source: { type: "local", path: `.agents/skills/${name}` },
    harnesses: ["pi", "opencode", "claude-code"], prerequisites: [], selection: "optional",
    install: { argv: ["npx", "-y", "skills@1.7.4", "add", "example/skills", "--skill", name] },
    legal: [{ path: "LICENSE", target: "LICENSE", spdx: "MIT" }],
  });
  const data = { schemaVersion: 2, repository: "https://github.com/example/skills", ref: "main", defaults: { exclude: ["agents/openai.yaml"] }, skills: { alpha: definition("alpha"), beta: definition("beta") }, deprecations: { "coding-ts": { replacements: ["alpha"], reason: "Explicit legacy mapping." } }, instructionTemplates: { enabled: false, issue: 68 } };
  put(primary, "README.md", "# Documentation collection\nNo application runtime.\n");
  put(primary, "AGENTS.md", "Respect existing project authority.\n");
  put(primary, "CONTRIBUTING.md", "Project-specific contributions.\n");
  put(primary, "VALIDATION.md", "Project-specific checks.\n");
  put(primary, "CLAUDE.md", "Existing Claude instructions.\n");
  change({ source, primary, data, base });
  const catalogPath = join(source, "catalog.yaml"); put(source, "catalog.yaml", stringify(data));
  commit(source); commit(primary);
  git(primary, "worktree", "add", "-q", "-b", "change/fixture", root, "HEAD");
  const catalog = loadCatalog(catalogPath, source);
  const stage = join(base, "stage");
  function selection(names = ["alpha"], extra = {}) {
    const selected = closure(names, catalog);
    return { selectedSkills: names, declinedSkills: catalog.skills.filter((s) => s.scope === "project" && !selected.includes(s.name)).map((s) => ({ name: s.name, reason: "User chose not to install now." })), harnesses: ["pi"], removeSkills: [], ...extra };
  }
  async function prepare(names = ["alpha"], extra = {}) { return prepareSkills({ catalog, names, stage, sourceRoot: source, root, ...extra }); }
  function plan(input = selection(), extra = {}) { return planSync({ root, stage, catalog, selection: input, ...extra }); }
  function apply(input = selection(), extra = {}) { const p = plan(input, extra); return applySync({ root, stage, catalog, selection: input, apply: true, confirm: true, planId: p.planId, ...extra }); }
  return { base, source, primary, root, stage, data, catalog, catalogPath, selection, prepare, plan, apply };
}

test("strict YAML rejects duplicates, aliases, tags, multiple documents and unsafe keys", () => {
  for (const text of ["a: 1\na: 2", "a: &x [1]\nb: *x", "a: !unknown text", "---\na: 1\n---\nb: 2", "__proto__: x", "a:\n  constructor: x"]) {
    assert.throws(() => parseYaml(text));
  }
  assert.equal(parseYaml("instructions: |\n  Preserve behavior.\n  Explain changes.\n").instructions, "Preserve behavior.\nExplain changes.\n");
});

test("static Git inspection never executes a repository fsmonitor hook", (t) => {
  const f = fixture(t);
  const marker = join(f.base, "hook-ran");
  const hook = join(f.primary, ".git/hooks/fsmonitor-fixture");
  writeFileSync(hook, `#!/usr/bin/env node\nrequire('node:fs').writeFileSync(process.env.SYNC_TEST_MARKER, 'ran');\nprocess.stdout.write('token\\0');\n`);
  chmodSync(hook, 0o755);
  const old = process.env.SYNC_TEST_MARKER;
  process.env.SYNC_TEST_MARKER = marker;
  t.after(() => { if (old === undefined) delete process.env.SYNC_TEST_MARKER; else process.env.SYNC_TEST_MARKER = old; });
  git(f.primary, "config", "core.fsmonitor", hook);
  inspectProject({ root: f.root, catalog: f.catalog });
  assert.equal(existsSync(marker), false);
});

test("paths reject traversal, absolute paths, backslashes and ambiguous segments", () => {
  for (const path of ["../x", "/tmp/x", "x/../y", "x//y", "x/./y", "x\\y", "C:/x", "x\ny"]) assert.throws(() => safeRelative(path));
  assert.equal(safeRelative("references/test.md"), "references/test.md");
});

test("catalog rejects unknown sources, cycles, invalid commands and missing local declarations", (t) => {
  const f = fixture(t);
  const check = (change) => {
    const data = structuredClone(f.data); change(data); put(f.source, "invalid.yaml", stringify(data));
    assert.throws(() => loadCatalog(join(f.source, "invalid.yaml"), f.source));
  };
  check((d) => { d.skills.alpha.install.argv.splice(1, 1); });
  check((d) => { d.skills.alpha.install.argv = ["bash", "-c", "anything"]; });
  check((d) => { d.skills.alpha.install.argv.push("--global"); });
  check((d) => { d.skills.alpha.install.argv.push("--global=true"); });
  check((d) => { d.skills.alpha.prerequisites = ["missing"]; });
  check((d) => { d.skills.alpha.prerequisites = ["beta"]; d.skills.beta.prerequisites = ["alpha"]; });
  check((d) => { d.skills.alpha.source.path = "../outside"; });
  check((d) => { d.skills.alpha.unknown = true; });
  check((d) => { d.skills.alpha.selection = "silently-install"; });
  check((d) => { d.skills.alpha.signals = { files: "package.json" }; });
  check((d) => { d.skills.alpha.install.argv.push("/private/machine/path"); });
  check((d) => { d.deprecations = []; });
  check((d) => { d.instructionTemplates.enabled = true; });
  check((d) => { d.skills.alpha.source = { type: "github", repository: "https://user:token@github.com/example/skills", revision: "a".repeat(40), path: "alpha" }; });
  check((d) => { d.skills.alpha.source = { type: "github", repository: "https://github.com/example/skills", revision: "main", path: "alpha" }; });
  put(f.source, ".agents/skills/alpha/SKILL.md", skill("alpha", "Body", ["beta"]));
  assert.throws(() => loadCatalog(f.catalogPath, f.source), /declared prerequisite/);
});

test("installation argv may repeat flags without becoming a shell command", (t) => {
  const f = fixture(t, ({ data }) => { data.skills.alpha.install.argv.push("--agent", "pi", "--agent", "opencode"); });
  assert.equal(f.catalog.byName.get("alpha").install.argv.filter((v) => v === "--agent").length, 2);
});

test("non-coding inspection offers every remaining skill and does not force coding policy", (t) => {
  const f = fixture(t, ({ source, primary, data }) => {
    put(source, ".agents/skills/alpha/scripts/tool.mjs", "// Managed helper, not target application evidence.\n");
    put(primary, ".github/scripts/release.py", "# CI support is not the primary project purpose.\n");
    data.skills.alpha.selection = "detected"; data.skills.alpha.signals = { extensions: [".mjs", ".py"] };
  });
  const before = git(f.root, "status", "--porcelain");
  const result = inspectProject({ root: f.root, catalog: f.catalog });
  assert.deepEqual(result.recommendedSkills, []);
  assert.deepEqual(result.remainingSkills.map((s) => s.name), ["alpha", "beta"]);
  assert.deepEqual(result.detectedHarnesses, []);
  assert.equal(git(f.root, "status", "--porcelain"), before);
  assert.equal(existsSync(join(f.root, LOCK_PATH)), false);
});

test("inventory skips unrelated project links, reports known deprecations, and preserves custom names", (t) => {
  const f = fixture(t, ({ primary, base }) => {
    put(primary, ".agents/skills/coding-ts/SKILL.md", skill("coding-ts"));
    put(primary, ".agents/skills/coding-custom/SKILL.md", skill("coding-custom"));
    put(primary, "outside.txt", "Keep.\n");
    symlinkSync(join(base, "not-present"), join(primary, "unrelated-link"));
    put(primary, ".opencode/.keep", "Harness configuration directory.\n");
  });
  const result = inspectProject({ root: f.root, catalog: f.catalog });
  assert.deepEqual(result.deprecatedSkills.map((s) => s.name), ["coding-ts"]);
  assert.equal(result.deprecatedSkills[0].changedFiles, null);
  assert.ok(result.installedSkills.some((s) => s.name === "coding-custom" && !s.deprecated));
  assert.deepEqual(result.installedSkills.find((s) => s.name === "coding-custom").locations[0].state, { type: "directory" });
  assert.deepEqual(result.detectedHarnesses, ["opencode"]);
});

test("preparation keeps supporting/legal files, excludes OpenAI metadata, and leaves target untouched", async (t) => {
  const f = fixture(t, ({ source }) => put(source, ".agents/skills/alpha/agents/openai.yaml", "interface: {}\n"));
  const before = git(f.root, "status", "--porcelain");
  await f.prepare();
  assert.ok(existsSync(join(f.stage, "skills/alpha/reference.md")));
  assert.equal(readFileSync(join(f.stage, "skills/alpha/LICENSE"), "utf8"), "MIT License\nCopyright Fixture\n");
  assert.equal(existsSync(join(f.stage, "skills/alpha/agents/openai.yaml")), false);
  assert.equal(git(f.root, "status", "--porcelain"), before);
  await assert.rejects(() => f.prepare(), /fresh stage/);
  await assert.rejects(() => prepareSkills({ catalog: f.catalog, names: ["alpha"], stage: join(f.root, "stage"), sourceRoot: f.source, root: f.root }), /outside the target/);
});

test("project source declarations cannot escape through a linked skill directory", (t) => {
  const f = fixture(t);
  rmSync(join(f.source, ".agents/skills/alpha"), { recursive: true });
  symlinkSync(join(f.source, ".agents/skills/beta"), join(f.source, ".agents/skills/alpha"));
  assert.throws(() => loadCatalog(f.catalogPath, f.source), /Symlink/);
});

test("selection requires a decision for every remaining entry and confirms harness compatibility", async (t) => {
  const f = fixture(t); await f.prepare();
  assert.throws(() => f.plan({ selectedSkills: ["alpha"], declinedSkills: [], harnesses: ["pi"] }), /remaining catalog skills: beta/);
  assert.throws(() => f.plan(f.selection(["alpha"], { harnesses: [] })), /at least one/);
  assert.throws(() => f.plan(f.selection(["alpha"], { harnesses: ["unknown"] })), /supported harness/);
  assert.throws(() => f.plan(f.selection(["alpha"], { rootFiles: ["AGENTS.md"] })), /outside skill synchronization/);
  assert.throws(() => f.plan(f.selection(["alpha"], { removeSkills: ["alpha"] })), /not a catalogued deprecation/);
});

test("prerequisites are installed by closure and unsupported harness selections stop", async (t) => {
  const f = fixture(t, ({ data, source }) => {
    data.skills.alpha.prerequisites = ["beta"];
    data.skills.beta.harnesses = ["pi"];
    put(source, ".agents/skills/alpha/SKILL.md", skill("alpha", "Body", ["beta"]));
  });
  assert.deepEqual(closure(["alpha"], f.catalog), ["alpha", "beta"]);
  await f.prepare();
  assert.deepEqual(f.plan().selection.selectedSkills, ["alpha", "beta"]);
  assert.throws(() => f.plan(f.selection(["alpha"], { harnesses: ["claude-code"] })), /Incompatible/);
});

test("a valid plan is read-only and apply needs flags, an exact plan, and a worktree", async (t) => {
  const f = fixture(t); await f.prepare();
  const input = f.selection(); const plan = f.plan(input);
  assert.equal(existsSync(join(f.root, ".agents")), false);
  assert.throws(() => applySync({ root: f.root, stage: f.stage, selection: input, catalog: f.catalog }), /--apply --confirm/);
  assert.throws(() => f.apply(input, { planId: "0".repeat(64) }), /stale/);
  const primaryPlan = f.plan(input, { root: f.primary });
  assert.throws(() => applySync({ root: f.primary, stage: f.stage, selection: input, catalog: f.catalog, apply: true, confirm: true, planId: primaryPlan.planId }), /primary checkout/);
  assert.equal(existsSync(join(f.primary, ".agents")), false);
  const instructions = Object.fromEntries(["AGENTS.md", "CLAUDE.md", "CONTRIBUTING.md", "VALIDATION.md", "README.md"].map((p) => [p, readFileSync(join(f.root, p), "utf8")]));
  const applied = applySync({ root: f.root, stage: f.stage, selection: input, catalog: f.catalog, apply: true, confirm: true, planId: plan.planId });
  assert.equal(applied.mode, "applied");
  assert.ok(existsSync(join(f.root, ".agents/skills/alpha/reference.md")));
  assert.equal(existsSync(join(f.root, ".claude")), false);
  for (const [path, text] of Object.entries(instructions)) assert.equal(readFileSync(join(f.root, path), "utf8"), text);
  assert.ok(projectStatus(f.root).files.every((file) => file.state === "clean"));
  const lock = readFileSync(join(f.root, LOCK_PATH), "utf8");
  assert.equal(lock.includes(f.base), false);
  assert.equal(JSON.parse(lock).schemaVersion, 2);
  assert.equal(existsSync(join(f.root, "skills-lock.json")), false);
});

test("Claude projections are exact relative links and are not forced for Pi/OpenCode", async (t) => {
  const f = fixture(t); await f.prepare();
  f.apply(f.selection(["alpha"], { harnesses: ["opencode", "claude-code"] }));
  assert.equal(readlinkSync(join(f.root, ".claude/skills/alpha")), "../../.agents/skills/alpha");
  assert.equal(existsSync(join(f.root, ".pi")), false);
  assert.equal(projectStatus(f.root).projections[0].state, "clean");
});

test("projection conflicts require exact notes and cannot be overwritten silently", async (t) => {
  const f = fixture(t, ({ primary }) => put(primary, ".claude/skills/alpha/custom.txt", "Preserve until approved.\n"));
  await f.prepare();
  const selection = f.selection(["alpha"], { harnesses: ["claude-code"] });
  assert.throws(() => f.plan(selection), /Projection conflict/);
  selection.resolutions = { ".claude/skills/alpha": "Owner chose replacement of this exact directory after reviewing its contents." };
  f.apply(selection);
  assert.equal(readlinkSync(join(f.root, ".claude/skills/alpha")), "../../.agents/skills/alpha");
});

test("local/unmanaged edits require reviewed resolutions; stale target state is never adopted", async (t) => {
  const f = fixture(t); await f.prepare(); f.apply();
  const path = ".agents/skills/alpha/SKILL.md";
  put(f.root, path, skill("alpha", "Locally edited."));
  assert.throws(() => f.plan(), /Local\/unmanaged change/);
  const input = f.selection(["alpha"], { resolutions: { [path]: "Owner chose the staged version after reviewing the local diff." } });
  const plan = f.plan(input);
  put(f.root, path, skill("alpha", "Another edit after approval."));
  assert.throws(() => applySync({ root: f.root, stage: f.stage, selection: input, catalog: f.catalog, apply: true, confirm: true, planId: plan.planId }), /stale/);
  assert.match(readFileSync(join(f.root, path), "utf8"), /Another edit/);
});

test("adapted skills require output-bound review and preserve legal notices", async (t) => {
  const f = fixture(t, ({ data }) => { data.skills.alpha.kind = "adapted"; data.skills.alpha.adaptation = { instructions: "Preserve behavior; use portable tool instructions." }; });
  const prep = await f.prepare(); assert.deepEqual(prep.needsReview, ["alpha"]);
  assert.throws(() => f.plan(), /Adaptation review required/);
  put(f.stage, "skills/alpha/SKILL.md", skill("alpha", "Portable adapted instructions."));
  reviewSkill({ stage: f.stage, name: "alpha", note: "Replaced a provider-specific call while preserving the workflow." });
  const plan = f.plan(); assert.ok(plan.lock.skills.alpha.review.note.includes("preserving"));
  put(f.stage, "skills/alpha/SKILL.md", skill("alpha", "An unreviewed further edit."));
  assert.throws(() => f.plan(), /Adaptation review required/);
  reviewSkill({ stage: f.stage, name: "alpha", note: "Reviewed the further edit." });
  put(f.stage, "skills/alpha/LICENSE", "Changed legal notice.\n");
  reviewSkill({ stage: f.stage, name: "alpha", note: "Cannot waive legal checks." });
  assert.throws(() => f.plan(), /Legal notice changed/);
});

test("raw source tampering and excluded output files invalidate preparation/review", async (t) => {
  const f = fixture(t); await f.prepare();
  put(f.stage, "skills/alpha/agents/openai.yaml", "interface: {}\n");
  assert.throws(() => f.plan(), /Forbidden\/excluded/);
  rmSync(join(f.stage, "skills/alpha/agents/openai.yaml"));
  put(f.stage, "raw/alpha/SKILL.md", skill("alpha", "Tampered raw input."));
  assert.throws(() => reviewSkill({ stage: f.stage, name: "alpha", note: "Review" }), /Raw source changed/);
  assert.throws(() => f.plan(), /Raw source changed/);
});

test("unchanged approved adaptation is reused; target context changes require a fresh review", async (t) => {
  const f = fixture(t, ({ data }) => { data.skills.alpha.kind = "adapted"; data.skills.alpha.adaptation = { instructions: "Keep a portable workflow." }; });
  await f.prepare();
  put(f.stage, "skills/alpha/SKILL.md", skill("alpha", "Reviewed portable variant."));
  reviewSkill({ stage: f.stage, name: "alpha", note: "Preserved the intended behavior." });
  f.apply();
  const stage2 = join(f.base, "stage2");
  const reused = await f.prepare(["alpha"], { stage: stage2 });
  assert.deepEqual(reused.needsReview, []);
  assert.match(readFileSync(join(stage2, "skills/alpha/SKILL.md"), "utf8"), /portable variant/);
  put(f.root, "AGENTS.md", "New project instructions.\n");
  assert.throws(() => f.plan(f.selection(), { stage: stage2 }), /Target requirements changed/);
  const fresh = await f.prepare(["alpha"], { stage: join(f.base, "stage3") });
  assert.deepEqual(fresh.needsReview, ["alpha"]);
});

test("known deprecated removals bind full trees; custom similarly named skills remain", async (t) => {
  const f = fixture(t, ({ primary }) => {
    put(primary, ".agents/skills/coding-ts/SKILL.md", skill("coding-ts"));
    put(primary, ".agents/skills/coding-ts/local-notes.md", "Unmanaged notes to disclose.\n");
    put(primary, ".agents/skills/coding-custom/SKILL.md", skill("coding-custom"));
    mkdirSync(join(primary, ".claude/skills"), { recursive: true });
    symlinkSync("../../.agents/skills/coding-ts", join(primary, ".claude/skills/coding-ts"));
  });
  await f.prepare();
  assert.equal(f.plan().actions.some((a) => a.op === "remove-skill"), false);
  assert.throws(() => f.plan(f.selection(["alpha"], { removeSkills: ["coding-custom"] })), /not a catalogued deprecation/);
  const input = f.selection(["alpha"], { removeSkills: ["coding-ts"] });
  const plan = f.plan(input);
  put(f.root, ".agents/skills/coding-ts/new-file.md", "Added after review.\n");
  assert.throws(() => applySync({ root: f.root, stage: f.stage, selection: input, catalog: f.catalog, apply: true, confirm: true, planId: plan.planId }), /stale/);
  f.apply(input);
  assert.equal(existsSync(join(f.root, ".agents/skills/coding-ts")), false);
  assert.equal(existsSync(join(f.root, ".claude/skills/coding-ts")), false);
  assert.ok(existsSync(join(f.root, ".agents/skills/coding-custom/SKILL.md")));
});

test("legacy instruction records migrate without managing or changing their documents", async (t) => {
  const f = fixture(t, ({ primary }) => {
    const hash = digest(readFileSync(join(primary, "AGENTS.md")));
    put(primary, LOCK_PATH, JSON.stringify({ schemaVersion: 1, files: { "AGENTS.md": { kind: "instruction", sourcePath: "AGENTS.md", sourceSha256: hash, installedSha256: hash } }, selection: { selectedSkills: [] }, projections: {} }));
  });
  await f.prepare(); const plan = f.plan();
  assert.equal(plan.legacyLockMigration, true);
  assert.equal(plan.lock.files["AGENTS.md"], undefined);
  assert.equal(plan.lock.legacyInstructions["AGENTS.md"].kind, "instruction");
  f.apply();
  assert.equal(readFileSync(join(f.root, "AGENTS.md"), "utf8"), "Respect existing project authority.\n");
});

test("declining an installed managed skill preserves its files and prior local-change baseline", async (t) => {
  const f = fixture(t); await f.prepare(["alpha", "beta"]); f.apply(f.selection(["alpha", "beta"]));
  put(f.root, ".agents/skills/beta/SKILL.md", skill("beta", "Local beta edit."));
  const stage2 = join(f.base, "stage2"); await f.prepare(["alpha"], { stage: stage2 });
  f.apply(f.selection(), { stage: stage2 });
  assert.match(readFileSync(join(f.root, ".agents/skills/beta/SKILL.md"), "utf8"), /Local beta edit/);
  assert.equal(projectStatus(f.root).files.find((f) => f.path === ".agents/skills/beta/SKILL.md").state, "modified-or-missing");
});

test("public GitHub acquisition fetches only selected files, records commit, and filters metadata", async (t) => {
  const f = fixture(t, ({ data, source }) => {
    data.skills.beta.kind = "upstream";
    data.skills.beta.source = { type: "github", repository: "https://github.com/example/upstream", revision: "a".repeat(40), path: "skills/beta" };
    rmSync(join(source, ".agents/skills/beta"), { recursive: true });
  });
  const requests = [];
  const fetcher = async (url) => {
    requests.push(url);
    if (url.includes("/git/trees/")) return new Response(JSON.stringify({ tree: [{ path: "skills/beta/SKILL.md", type: "blob", mode: "100644" }, { path: "skills/beta/agents/openai.yaml", type: "blob", mode: "100644" }, { path: "other/huge.bin", type: "blob", mode: "100644" }] }));
    if (url.endsWith("/skills/beta/SKILL.md")) return new Response(skill("beta"));
    if (url.endsWith("/LICENSE")) return new Response("MIT License\n");
    throw new Error("Unexpected source content request");
  };
  await assert.rejects(() => f.prepare(["beta"], { fetcher }), /--fetch permission/);
  await f.prepare(["beta"], { fetcher, allowFetch: true });
  assert.equal(requests.some((url) => url.includes("openai") || url.includes("huge.bin")), false);
  const manifest = JSON.parse(readFileSync(join(f.stage, "manifest.json"), "utf8"));
  assert.equal(manifest.skills.beta.origin.revision, "a".repeat(40));
  assert.equal(existsSync(join(f.stage, "skills/beta/agents/openai.yaml")), false);
  f.apply(f.selection(["beta"]));
});

test("source truncation and symbolic links stop before target activation", async (t) => {
  for (const mode of ["truncated", "symlink"]) {
    const f = fixture(t, ({ data, source }) => {
      data.skills.beta.kind = "upstream"; data.skills.beta.source = { type: "github", repository: "https://github.com/example/upstream", revision: "b".repeat(40), path: "skills/beta" };
      rmSync(join(source, ".agents/skills/beta"), { recursive: true });
    });
    const fetcher = async () => new Response(JSON.stringify({ truncated: mode === "truncated", tree: [{ path: "skills/beta/SKILL.md", type: "blob", mode: mode === "symlink" ? "120000" : "100644" }] }));
    await assert.rejects(() => f.prepare(["beta"], { fetcher, allowFetch: true }), /Incomplete|Symlink/);
    assert.equal(existsSync(join(f.root, ".agents")), false);
  }
});

test("selected updates explicitly remove unmanaged OpenAI metadata", async (t) => {
  const f = fixture(t, ({ primary }) => {
    put(primary, ".agents/skills/alpha/SKILL.md", skill("alpha"));
    put(primary, ".agents/skills/alpha/agents/openai.yaml", "interface: {display_name: Custom}\n");
  });
  await f.prepare();
  const plan = f.plan();
  assert.ok(plan.actions.some((a) => a.op === "remove-file" && a.path.endsWith("agents/openai.yaml")));
  f.apply();
  assert.equal(existsSync(join(f.root, ".agents/skills/alpha/agents/openai.yaml")), false);
});

test("legal files already in a local package cannot be rewritten by adaptation", async (t) => {
  const f = fixture(t, ({ source, data }) => {
    put(source, ".agents/skills/alpha/LICENSE", "Specific upstream copyright.\n");
    data.skills.alpha.legal = [];
    data.skills.alpha.kind = "adapted";
    data.skills.alpha.adaptation = { instructions: "Keep the maintained variant." };
  });
  await f.prepare();
  put(f.stage, "skills/alpha/LICENSE", "Incorrect replacement notice.\n");
  reviewSkill({ stage: f.stage, name: "alpha", note: "Review cannot waive legal preservation." });
  assert.throws(() => f.plan(), /Legal notice changed/);
});

test("personal setup is a separate approved plan with no model/provider overrides", (t) => {
  const f = fixture(t); const home = join(f.base, "home"); mkdirSync(home);
  const input = { home, managerRoot: PACKAGE_ROOT, harnesses: ["pi", "opencode", "claude-code"] };
  const plan = planSetup(input);
  assert.equal(existsSync(join(home, ".pi")), false);
  assert.throws(() => applySetup(input), /--apply --confirm/);
  applySetup({ ...input, apply: true, confirm: true, planId: plan.planId });
  for (const path of [".pi/agent/prompts/sync-my-skills.md", ".config/opencode/commands/sync-my-skills.md"]) {
    const text = readFileSync(join(home, path), "utf8"); assert.match(text, /\$ARGUMENTS/); assert.doesNotMatch(text, /^(model|agent):/m);
  }
  assert.ok(readlinkSync(join(home, ".claude/skills/sync-my-skills")));
  assert.deepEqual(planSetup(input).actions, []);
  put(home, ".pi/agent/prompts/sync-my-skills.md", "User's own command.\n");
  assert.throws(() => planSetup(input), /conflicts/);
});

test("a local checkout cannot be mislabeled as another upstream repository", async (t) => {
  const f = fixture(t);
  git(f.source, "remote", "set-url", "origin", "https://github.com/unrelated/source");
  await assert.rejects(() => f.prepare(), /origin does not match/);
  assert.equal(existsSync(f.stage), false);
});

test("source executable bits survive staging and installation", async (t) => {
  const f = fixture(t, ({ source }) => {
    put(source, ".agents/skills/alpha/scripts/run.sh", "#!/bin/sh\nexit 0\n");
    chmodSync(join(source, ".agents/skills/alpha/scripts/run.sh"), 0o755);
  });
  await f.prepare();
  assert.ok(statSync(join(f.stage, "skills/alpha/scripts/run.sh")).mode & 0o111);
  f.apply();
  assert.ok(statSync(join(f.root, ".agents/skills/alpha/scripts/run.sh")).mode & 0o111);
});

test("metadata removal does not duplicate a legacy managed-file removal", async (t) => {
  const f = fixture(t, ({ primary }) => {
    const path = ".agents/skills/alpha/agents/openai.yaml";
    put(primary, ".agents/skills/alpha/SKILL.md", skill("alpha"));
    put(primary, path, "interface: {}\n");
    const hash = digest(readFileSync(join(primary, path)));
    put(primary, LOCK_PATH, JSON.stringify({ schemaVersion: 1, files: { [path]: { kind: "skill", skill: "alpha", sourcePath: path, sourceSha256: hash, installedSha256: hash } }, projections: {} }));
  });
  await f.prepare();
  assert.equal(f.plan().actions.filter((a) => a.path.endsWith("agents/openai.yaml")).length, 1);
  f.apply();
});

test("CLI supports a deprecated-removal-only plan with no selected skills", (t) => {
  const f = fixture(t, ({ primary }) => put(primary, ".agents/skills/coding-ts/SKILL.md", skill("coding-ts")));
  const run = (args) => spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
  const prepared = run(["prepare", "--root", f.root, "--stage", f.stage, "--source-root", f.source, "--catalog", f.catalogPath]);
  assert.equal(prepared.status, 0, prepared.stderr);
  const file = join(f.base, "selection.json");
  put(f.base, "selection.json", JSON.stringify(f.selection([], { removeSkills: ["coding-ts"] })));
  const planned = run(["plan", "--root", f.root, "--stage", f.stage, "--catalog", f.catalogPath, "--selection", file]);
  assert.equal(planned.status, 0, planned.stderr);
  const plan = JSON.parse(planned.stdout);
  const applied = run(["apply", "--root", f.root, "--stage", f.stage, "--catalog", f.catalogPath, "--selection", file, "--apply", "--confirm", "--plan-id", plan.planId]);
  assert.equal(applied.status, 0, applied.stderr);
  assert.equal(existsSync(join(f.root, ".agents/skills/coding-ts")), false);
  assert.equal(existsSync(join(f.root, ".agents/skills/alpha")), false);
});

test("unsupported locks, catalog changes, and target HEAD changes stop safely", async (t) => {
  const f = fixture(t); await f.prepare();
  put(f.root, LOCK_PATH, JSON.stringify({ schemaVersion: 99, files: {} }));
  assert.throws(() => f.plan(), /Unsupported/);
  rmSync(join(f.root, LOCK_PATH));
  const changed = structuredClone(f.data); changed.skills.alpha.description = "Changed selection guidance.";
  put(f.source, "changed.yaml", stringify(changed));
  assert.throws(() => f.plan(f.selection(), { catalog: loadCatalog(join(f.source, "changed.yaml")) }), /Catalog changed/);
  const plan = f.plan();
  git(f.root, "commit", "--allow-empty", "-qm", "Moved target HEAD");
  assert.throws(() => applySync({ root: f.root, stage: f.stage, catalog: f.catalog, selection: f.selection(), apply: true, confirm: true, planId: plan.planId }), /stale/);
  assert.equal(existsSync(join(f.root, ".agents/skills/alpha")), false);
});

test("malformed lock containers cannot be silently normalized into valid state", (t) => {
  const f = fixture(t);
  put(f.root, LOCK_PATH, JSON.stringify({ schemaVersion: 2, files: {}, skills: [] }));
  assert.throws(() => inspectProject({ root: f.root, catalog: f.catalog }), /lock/i);
});

test("a symlinked destination parent cannot redirect installation outside the project", async (t) => {
  const f = fixture(t); await f.prepare();
  const outside = join(f.base, "outside"); mkdirSync(outside);
  mkdirSync(join(f.root, ".agents")); symlinkSync(outside, join(f.root, ".agents/skills"));
  assert.throws(() => f.plan(), /Symlink/);
  assert.equal(existsSync(join(outside, "alpha")), false);
});

test("review notes cannot leak credentials or absolute machine paths into locks", async (t) => {
  const f = fixture(t, ({ data }) => { data.skills.alpha.kind = "adapted"; data.skills.alpha.adaptation = { instructions: "Preserve the workflow." }; });
  await f.prepare();
  reviewSkill({ stage: f.stage, name: "alpha", note: "/private/personal/path" });
  assert.throws(() => f.plan(), /absolute machine paths/);
  reviewSkill({ stage: f.stage, name: "alpha", note: "token ghp_abcdefghijklmnopqrstuvwxyz" });
  assert.throws(() => f.plan(), /credential material/);
});

test("CLI reports usage failures and real catalog includes every local skill exactly once", () => {
  const help = spawnSync(process.execPath, [script, "--help"], { encoding: "utf8" });
  assert.equal(help.status, 0); assert.match(help.stdout, /skills-only/);
  for (const args of [["unknown"], ["inspect"], ["catalog", "--wat"], ["catalog", "--catalog", "a", "--catalog", "b"]]) {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: "utf8" }); assert.notEqual(result.status, 0);
  }
  const catalog = loadCatalog(join(PACKAGE_ROOT, "assets/skill-catalog.yaml"), repository);
  assert.ok(catalog.skills.length > 0);
  for (const name of ["grilling", "unslop", "wait-what"]) {
    assert.equal(catalog.byName.get(name).kind, "upstream");
    assert.equal(existsSync(join(repository, ".agents/skills", name)), false);
    assert.equal(existsSync(join(repository, ".claude/skills", name)), false);
  }
  for (const name of ["grill-me", "tdd", "code-review", "systematic-debugging"]) {
    assert.equal(catalog.byName.get(name).kind, "adapted");
    assert.ok(existsSync(join(repository, ".agents/skills", name, "SKILL.md")));
  }
  for (const name of ["grill-me", "code-review"]) assert.equal(existsSync(join(repository, ".agents/skills", name, "agents/openai.yaml")), false);
  assert.equal(existsSync(join(repository, ".agents/skills/sync-agent-assets")), false);
  assert.equal(readlinkSync(join(repository, ".claude/skills/sync-my-skills")), "../../.agents/skills/sync-my-skills");
  assert.equal(catalog.byName.get("unslop").legal[0].path, "pstack/LICENSE");
  assert.equal(catalog.byName.get("sync-agent-assets"), undefined);
  assert.equal(catalog.byName.get("sync-my-skills").scope, "personal");
  assert.ok(catalog.byName.get("sync-my-skills").install.argv.includes("--global"));
  assert.ok(catalog.skills.every((s) => s.install.argv[0] !== "npx" || s.install.argv[1] === "-y"));
  assert.ok(!catalog.deprecations["coding-with-rules"]);
});
