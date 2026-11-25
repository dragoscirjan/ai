import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { test } from "node:test";
import { PACKAGE_ROOT, loadCatalog } from "./catalog.mjs";
import { buildPlan, executePlan, printPlan } from "./install.mjs";
import { copySkill, projectSkill, skillsDirectory } from "./output.mjs";

const catalog = loadCatalog();
function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "plugin-output-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const target = join(directory, "plugin"),
    home = join(directory, "home");
  mkdirSync(target);
  mkdirSync(home);
  mkdirSync(join(target, ".claude-plugin"));
  writeFileSync(
    join(target, ".claude-plugin/plugin.json"),
    '{"name":"fixture","version":"1.0.0"}\n',
  );
  writeFileSync(
    join(target, "AGENTS.md"),
    "# Preserve project rules\n[Policy](CONTRIBUTING.md)\n[Selected skill](skills/coding/SKILL.md)\n",
  );
  writeFileSync(join(target, "CONTRIBUTING.md"), "Existing policy.\n");
  writeFileSync(join(target, "skills-lock.json"), "Existing CLI lock.\n");
  mkdirSync(join(target, "skills/custom"), { recursive: true });
  writeFileSync(join(target, "skills/custom/SKILL.md"), "Custom skill, not selected.\n");
  return { directory, target, home };
}
function planFor(f, extra = {}) {
  return buildPlan(
    {
      target: f.target,
      skills: ["coding-with-rules"],
      agents: ["claude-code"],
      skillsDir: "skills",
      ...extra,
    },
    catalog,
    { home: f.home, env: {} },
  );
}
const fetcher = async () => new Response("MIT fixture legal notice.\n");
function installer(
  plan,
  workspaces,
  { failAt, symlink = false, omit = false, alterManifest = false } = {},
) {
  return async (argv, cwd) => {
    workspaces.push(cwd);
    assert.notEqual(cwd, plan.target);
    assert.equal(argv.includes("--global"), false);
    const name = argv[argv.indexOf("--skill") + 1],
      entry = plan.entries.find((entry) => entry.name === name);
    if (name === failAt) throw new Error("Acquisition failed");
    if (omit) return;
    const folder = join(
      cwd,
      argv.includes("pi") || argv.includes("opencode") ? ".agents/skills" : ".claude/skills",
      name,
    );
    mkdirSync(folder, { recursive: true });
    writeFileSync(
      join(folder, "SKILL.md"),
      `---\nname: ${name}\ndescription: Fixture skill.\n${entry.prerequisites.length ? `requires: ${JSON.stringify(entry.prerequisites)}\n` : ""}---\nNew content.\n`,
    );
    writeFileSync(join(folder, "helper.mjs"), "#!/usr/bin/env node\n", { mode: 0o755 });
    mkdirSync(join(folder, "agents"));
    writeFileSync(join(folder, "agents/openai.yaml"), "Excluded metadata.\n");
    const projection = join(cwd, ".claude/skills", name);
    if (argv.includes("claude-code") && projection !== folder) {
      mkdirSync(dirname(projection), { recursive: true });
      cpSync(folder, projection, { recursive: true });
    }
    writeFileSync(join(cwd, "skills-lock.json"), "Disposable acquisition lock.\n");
    if (symlink) symlinkSync(join(plan.target, "CONTRIBUTING.md"), join(folder, "unsafe.md"));
    if (alterManifest)
      writeFileSync(join(plan.target, ".claude-plugin/plugin.json"), "Changed unexpectedly.\n");
  };
}
test("native projection replacement uses exact relative links and retains the canonical data", (t) => {
  const f = fixture(t),
    source = join(f.target, ".agents/skills/example"),
    destination = join(f.target, ".claude/skills/example");
  mkdirSync(source, { recursive: true });
  writeFileSync(join(source, "SKILL.md"), "Verified canonical.");
  mkdirSync(destination, { recursive: true });
  writeFileSync(join(destination, "old.txt"), "Native copy.");
  projectSkill(source, destination, { overwrite: true });
  assert.equal(readlinkSync(destination), relative(dirname(destination), source));
  assert.equal(readFileSync(join(destination, "SKILL.md"), "utf8"), "Verified canonical.");
  projectSkill(source, destination, { overwrite: true });
  assert.equal(readFileSync(join(source, "SKILL.md"), "utf8"), "Verified canonical.");
});
test("failed projection publication restores the original native folder", (t) => {
  const f = fixture(t),
    source = join(f.target, ".agents/skills/example"),
    destination = join(f.target, ".claude/skills/example");
  mkdirSync(source, { recursive: true });
  writeFileSync(join(source, "SKILL.md"), "Verified canonical.");
  mkdirSync(destination, { recursive: true });
  writeFileSync(join(destination, "old.txt"), "Preserve native output.");
  let calls = 0;
  assert.throws(
    () =>
      projectSkill(source, destination, {
        overwrite: true,
        rename: (from, to) => {
          if (++calls === 2) throw new Error("Projection publication failed");
          renameSync(from, to);
        },
      }),
    /Projection publication failed/,
  );
  assert.equal(readFileSync(join(destination, "old.txt"), "utf8"), "Preserve native output.");
  assert.equal(readFileSync(join(source, "SKILL.md"), "utf8"), "Verified canonical.");
});
test("projection publication cannot replace its own ancestor or add a recursive child", (t) => {
  const f = fixture(t),
    source = join(f.target, "canonical");
  mkdirSync(source);
  writeFileSync(join(source, "SKILL.md"), "Keep canonical bytes.");
  for (const destination of [f.target, join(source, "nested/projection")])
    assert.throws(
      () => projectSkill(source, destination, { overwrite: true }),
      /projection overlaps/,
    );
  assert.equal(readFileSync(join(source, "SKILL.md"), "utf8"), "Keep canonical bytes.");
});
test("projection replacement never follows an unapproved link", (t) => {
  const f = fixture(t),
    source = join(f.target, ".agents/skills/example"),
    destination = join(f.target, ".claude/skills/example");
  mkdirSync(source, { recursive: true });
  writeFileSync(join(source, "SKILL.md"), "Verified canonical.");
  mkdirSync(dirname(destination), { recursive: true });
  symlinkSync(f.home, destination, "dir");
  assert.throws(
    () => projectSkill(source, destination, { overwrite: true }),
    /Unsafe skill projection/,
  );
  assert.equal(readlinkSync(destination), f.home);
});
test("custom output rebases acquired Markdown for its final flat layout without target metadata changes", async (t) => {
  const f = fixture(t),
    plan = planFor(f, { skills: ["cleanup-workspaces", "subagent-orchestration"] });
  const run = installer(plan, []);
  await executePlan(plan, {
    confirmed: true,
    fetcher,
    run: async (argv, cwd) => {
      await run(argv, cwd);
      if (argv[argv.indexOf("--skill") + 1] === "cleanup-workspaces")
        writeFileSync(
          join(cwd, ".claude/skills/cleanup-workspaces/README.md"),
          "[Delegate](../../unpolished/subagent-orchestration/SKILL.md)",
        );
    },
  });
  assert.equal(
    readFileSync(join(f.target, "skills/cleanup-workspaces/README.md"), "utf8"),
    "[Delegate](../subagent-orchestration/SKILL.md)",
  );
  assert.equal(existsSync(join(f.target, ".claude")), false);
  assert.equal(existsSync(join(f.target, ".agents")), false);
});
test("custom output paths are exact and are resolved relative to --target", (t) => {
  const f = fixture(t),
    plan = planFor(f);
  assert.equal(plan.skillsDir, join(f.target, "skills"));
  for (const entry of plan.entries)
    assert.deepEqual(entry.destinations, [join(f.target, "skills", entry.name)]);
  assert.deepEqual(
    plan.entries.map((entry) => entry.name),
    ["coding", "coding-with-rules"],
  );
  assert.deepEqual(
    planFor(f, { skillsDir: join(f.target, "skills") }).entries.map((entry) => entry.destinations),
    plan.entries.map((entry) => entry.destinations),
  );
  assert.equal(existsSync(join(f.target, ".agents")), false);
});
for (const path of [
  "",
  ".",
  "../outside",
  "skills/../../outside",
  ".git/skills",
  "nested/.git/skills",
  "skills\\bad",
  "skills\ninvalid",
])
  test(`custom output rejects ${JSON.stringify(path)}`, (t) => {
    const f = fixture(t);
    assert.throws(() => planFor(f, { skillsDir: path }));
  });
test("control characters cannot inject terminal output through custom paths", (t) => {
  const f = fixture(t);
  for (const path of ["skills\u001b[1m", "skills\tinvalid"])
    assert.throws(() => planFor(f, { skillsDir: path }), /Invalid skills directory/);
});
test("absolute paths outside --target are rejected", (t) => {
  const f = fixture(t);
  assert.throws(
    () => planFor(f, { skillsDir: join(f.directory, "outside") }),
    /subdirectory of --target/,
  );
});
test("custom output rejects symlinked paths and non-directory roots", (t) => {
  const f = fixture(t);
  symlinkSync(f.home, join(f.target, "alias"), "dir");
  assert.throws(() => planFor(f, { skillsDir: "alias/skills" }), /Symlink/);
  writeFileSync(join(f.target, "file"), "Not a directory");
  assert.throws(() => planFor(f, { skillsDir: "file" }), /not a directory/);
  writeFileSync(join(f.target, "skills/coding"), "Not a skill directory");
  assert.throws(() => planFor(f, { overwrite: true }), /not a directory/);
});
test("personal catalogue entries can be copied without global installation", async (t) => {
  const f = fixture(t),
    plan = planFor(f, { scope: "personal", skills: ["sync-my-agents"] }),
    workspaces = [];
  assert.equal(plan.entries[0].argv.includes("--global"), false);
  assert.deepEqual(plan.entries[0].destinations, [join(f.target, "skills/sync-my-agents")]);
  await executePlan(plan, { confirmed: true, fetcher, run: installer(plan, workspaces) });
  assert.equal(existsSync(join(f.home, ".agents")), false);
  assert.equal(existsSync(join(f.target, "skills/sync-my-agents/SKILL.md")), true);
});
test("verified plugin output contains flat portable skill folders and preserves metadata", async (t) => {
  const f = fixture(t),
    plan = planFor(f),
    workspaces = [];
  const protectedPaths = [
    "AGENTS.md",
    "CONTRIBUTING.md",
    ".claude-plugin/plugin.json",
    "skills-lock.json",
    "skills/custom/SKILL.md",
  ];
  const before = protectedPaths.map((path) => readFileSync(join(f.target, path), "utf8"));
  assert.deepEqual(
    await executePlan(plan, { confirmed: true, fetcher, run: installer(plan, workspaces) }),
    ["coding", "coding-with-rules"],
  );
  assert.deepEqual(
    protectedPaths.map((path) => readFileSync(join(f.target, path), "utf8")),
    before,
  );
  for (const entry of plan.entries) {
    const folder = entry.destinations[0];
    assert.match(readFileSync(join(folder, "SKILL.md"), "utf8"), /New content/);
    assert.equal(readFileSync(join(folder, "LICENSE"), "utf8"), "MIT fixture legal notice.\n");
    assert.equal(existsSync(join(folder, "agents/openai.yaml")), false);
    assert.ok(statSync(join(folder, "helper.mjs")).mode & 0o111);
  }
  assert.equal(existsSync(join(f.target, ".agents")), false);
  assert.equal(existsSync(join(f.target, ".claude")), false);
  assert.ok(workspaces.every((path) => !existsSync(path)));
  assert.ok(readdirSync(f.target).every((name) => !name.startsWith(".sync-skills-")));
});
test("missing instruction and manifest paths cannot become output directories", async (t) => {
  const f = fixture(t),
    never = () => assert.fail("Protected document conflict must fail before acquisition");
  rmSync(join(f.target, "AGENTS.md"));
  await assert.rejects(
    executePlan(planFor(f, { skillsDir: "AGENTS.md/skills" }), {
      confirmed: true,
      fetcher: never,
      run: never,
    }),
    /overlaps protected document/,
  );
  assert.equal(existsSync(join(f.target, "AGENTS.md")), false);
  writeFileSync(join(f.target, "AGENTS.md"), "[Rules](RULES.md)\n");
  await assert.rejects(
    executePlan(planFor(f, { skillsDir: "RULES.md/skills" }), {
      confirmed: true,
      fetcher: never,
      run: never,
    }),
    /overlaps protected document/,
  );
  assert.equal(existsSync(join(f.target, "RULES.md")), false);
  rmSync(join(f.target, ".claude-plugin/plugin.json"));
  await assert.rejects(
    executePlan(planFor(f, { skillsDir: ".claude-plugin/plugin.json/skills" }), {
      confirmed: true,
      fetcher: never,
      run: never,
    }),
    /overlaps protected document/,
  );
  assert.equal(existsSync(join(f.target, ".claude-plugin/plugin.json")), false);
});
test("output is not created before explicit confirmation", async (t) => {
  const f = fixture(t),
    plan = planFor(f, { skillsDir: "bundle/skills" }),
    never = () => assert.fail("Unconfirmed operation");
  await assert.rejects(executePlan(plan, { run: never, fetcher: never }), /confirmation/);
  assert.equal(existsSync(join(f.target, "bundle")), false);
});
test("existing custom output still requires overwrite approval", async (t) => {
  const f = fixture(t);
  mkdirSync(join(f.target, "skills/coding"));
  writeFileSync(join(f.target, "skills/coding/SKILL.md"), "Local edits\n");
  const plan = planFor(f);
  assert.match(plan.blocked.join("\n"), /--overwrite/);
  await assert.rejects(
    executePlan(plan, { confirmed: true, fetcher: () => assert.fail() }),
    /blocked/,
  );
  assert.equal(readFileSync(join(f.target, "skills/coding/SKILL.md"), "utf8"), "Local edits\n");
});
test("approved replacement removes obsolete selected files but preserves unselected siblings", async (t) => {
  const f = fixture(t);
  mkdirSync(join(f.target, "skills/coding"));
  writeFileSync(join(f.target, "skills/coding/SKILL.md"), "Old content\n");
  writeFileSync(join(f.target, "skills/coding/obsolete"), "Old extra\n");
  const plan = planFor(f, { overwrite: true });
  await executePlan(plan, { confirmed: true, fetcher, run: installer(plan, []) });
  assert.equal(existsSync(join(f.target, "skills/coding/obsolete")), false);
  assert.equal(
    readFileSync(join(f.target, "skills/custom/SKILL.md"), "utf8"),
    "Custom skill, not selected.\n",
  );
});
test("all sources are acquired before changing any selected output", async (t) => {
  const f = fixture(t);
  mkdirSync(join(f.target, "skills/coding"));
  writeFileSync(join(f.target, "skills/coding/SKILL.md"), "Original\n");
  const plan = planFor(f, { overwrite: true }),
    workspaces = [];
  await assert.rejects(
    executePlan(plan, {
      confirmed: true,
      fetcher,
      run: installer(plan, workspaces, { failAt: "coding-with-rules" }),
    }),
    /completed: none.*Acquisition failed/,
  );
  assert.equal(readFileSync(join(f.target, "skills/coding/SKILL.md"), "utf8"), "Original\n");
  assert.equal(existsSync(join(f.target, "skills/coding-with-rules")), false);
  assert.ok(workspaces.every((path) => !existsSync(path)));
});
for (const [label, settings, pattern] of [
  ["symlinked acquired files", { symlink: true }, /Symlink in installed/],
  ["missing acquired output", { omit: true }, /did not create/],
  [
    "unexpected plugin manifest edits",
    { alterManifest: true },
    /Instruction document changed unexpectedly/,
  ],
])
  test(`custom output rejects ${label} before publishing`, async (t) => {
    const f = fixture(t),
      plan = planFor(f, { skillsDir: "bundle/skills" }),
      workspaces = [];
    await assert.rejects(
      executePlan(plan, { confirmed: true, fetcher, run: installer(plan, workspaces, settings) }),
      pattern,
    );
    assert.equal(existsSync(join(f.target, "bundle")), false);
    assert.ok(workspaces.every((path) => !existsSync(path)));
  });
test("late destination and path symlink conflicts are not overwritten", async (t) => {
  const f = fixture(t),
    plan = planFor(f);
  mkdirSync(plan.entries[0].destinations[0]);
  await assert.rejects(
    executePlan(plan, { confirmed: true, fetcher, run: () => assert.fail() }),
    /appeared after preview/,
  );
  const other = planFor(f, { skillsDir: "later/skills" });
  symlinkSync(f.home, join(f.target, "later"), "dir");
  await assert.rejects(
    executePlan(other, { confirmed: true, fetcher, run: () => assert.fail() }),
    /Symlink/,
  );
});
test("failed copying preserves the original selected folder and cleans temporary work", (t) => {
  const f = fixture(t),
    destination = join(f.target, "skills/coding");
  mkdirSync(destination);
  writeFileSync(join(destination, "SKILL.md"), "Original\n");
  assert.throws(() =>
    copySkill(join(f.directory, "missing-source"), destination, { overwrite: true }),
  );
  assert.equal(readFileSync(join(destination, "SKILL.md"), "utf8"), "Original\n");
  assert.ok(readdirSync(f.target).every((name) => !name.startsWith(".sync-skills-")));
});
test("failed final rename restores the original selected folder", (t) => {
  const f = fixture(t),
    source = join(f.directory, "prepared"),
    destination = join(f.target, "skills/coding");
  mkdirSync(source);
  writeFileSync(join(source, "SKILL.md"), "New content");
  mkdirSync(destination);
  writeFileSync(join(destination, "SKILL.md"), "Original");
  assert.throws(
    () =>
      copySkill(source, destination, {
        overwrite: true,
        rename: (from, to) => {
          if (basename(from) === "ready") throw new Error("Rename failed");
          renameSync(from, to);
        },
      }),
    /Rename failed/,
  );
  assert.equal(readFileSync(join(destination, "SKILL.md"), "utf8"), "Original");
  assert.ok(readdirSync(f.target).every((name) => !name.startsWith(".sync-skills-")));
});
test("failed restoration preserves both the original backup and unexpected concurrent content", (t) => {
  const f = fixture(t),
    source = join(f.directory, "prepared"),
    destination = join(f.target, "skills/coding");
  mkdirSync(source);
  writeFileSync(join(source, "SKILL.md"), "New content");
  mkdirSync(destination);
  writeFileSync(join(destination, "SKILL.md"), "Original");
  assert.throws(
    () =>
      copySkill(source, destination, {
        overwrite: true,
        rename: (from, to) => {
          if (basename(from) === "ready") {
            mkdirSync(destination);
            writeFileSync(join(destination, "concurrent"), "Keep concurrent work");
            throw new Error("Concurrent destination");
          }
          renameSync(from, to);
        },
      }),
    /original content is preserved/,
  );
  const recovery = readdirSync(f.target).find((name) => name.startsWith(".sync-skills-"));
  assert.ok(recovery);
  assert.equal(readFileSync(join(f.target, recovery, "previous/SKILL.md"), "utf8"), "Original");
  assert.equal(readFileSync(join(destination, "concurrent"), "utf8"), "Keep concurrent work");
});
test("custom previews explain disposable acquisition and final paths", (t) => {
  const f = fixture(t),
    output = [];
  printPlan(planFor(f), (line) => output.push(line));
  assert.match(output.join("\n"), /Custom output only/);
  assert.match(output.join("\n"), /disposable workspace/);
  assert.match(output.join("\n"), /plugin metadata/);
});
for (const args of [
  ["--skills-dir", "skills"],
  ["--skills-dir", ""],
])
  test(`list rejects custom output options ${JSON.stringify(args)}`, (t) => {
    const f = fixture(t),
      r = spawnSync(
        process.execPath,
        [join(PACKAGE_ROOT, "scripts/skills/sync.mjs"), "list", ...args],
        { cwd: f.target, encoding: "utf8", timeout: 10000 },
      );
    assert.equal(r.status, 1);
    assert.match(r.stderr, /not accepted by list/);
  });
test("GitHub-compatible CLI dry runs expose only the custom destination", (t) => {
  const f = fixture(t),
    r = spawnSync(
      process.execPath,
      [
        join(PACKAGE_ROOT, "scripts/skills/sync.mjs"),
        "--target",
        f.target,
        "--skills-dir",
        "skills",
        "--skill",
        "coding",
        "--agent",
        "claude-code",
        "--dry-run",
        "--json",
      ],
      { cwd: f.directory, encoding: "utf8", timeout: 10000 },
    );
  assert.equal(r.status, 0, r.stderr);
  const plan = JSON.parse(r.stdout);
  assert.deepEqual(plan.entries[0].destinations, [join(f.target, "skills/coding")]);
  assert.equal(existsSync(join(f.target, "skills/coding")), false);
  assert.equal(skillsDirectory(f.target, undefined), null);
});
