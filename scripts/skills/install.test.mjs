import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { test } from "node:test";
import { PACKAGE_ROOT, loadCatalog } from "./catalog.mjs";
import { buildPlan, destinations, executePlan, printPlan, quote } from "./install.mjs";

const catalog = loadCatalog();
function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "skill-install-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const target = join(directory, "target"),
    home = join(directory, "home");
  mkdirSync(target);
  mkdirSync(home);
  writeFileSync(join(target, "AGENTS.md"), "# Existing policy\n\n[Rules](RULES.md)\n");
  writeFileSync(join(target, "RULES.md"), "Do not change my rules.\n");
  mkdirSync(join(target, ".agents"));
  writeFileSync(join(target, ".agents/ai-assets.lock.json"), "legacy bytes\n");
  return { target, home, context: { home, env: {} } };
}
const options = (target, extra = {}) => ({
  target,
  skills: ["coding-with-rules"],
  agents: ["pi"],
  ...extra,
});
const fetcher = async () => new Response("MIT legal fixture\n");
function installer(plan, { symlink = false, undeclared = false, omit = false } = {}) {
  return async (argv) => {
    const name = argv[argv.indexOf("--skill") + 1],
      entry = plan.entries.find((entry) => entry.name === name);
    const folder = entry.destinations[0];
    if (omit) return;
    mkdirSync(folder, { recursive: true });
    const requires = undeclared ? ["unlisted"] : entry.prerequisites;
    writeFileSync(
      join(folder, "SKILL.md"),
      `---\nname: ${name}\ndescription: Fixture skill.\n${requires.length ? `requires: ${JSON.stringify(requires)}\n` : ""}---\n`,
    );
    mkdirSync(join(folder, "agents"), { recursive: true });
    writeFileSync(join(folder, "agents/openai.yaml"), "remove this metadata");
    writeFileSync(join(folder, "supporting.md"), "Keep supporting files.");
    if (symlink) symlinkSync(join(plan.target, "RULES.md"), join(folder, "unsafe.md"));
    for (const projection of entry.destinations.slice(1)) {
      mkdirSync(dirname(projection), { recursive: true });
      symlinkSync(relative(dirname(projection), folder), projection, "dir");
    }
  };
}
test("planning resolves prerequisite order and explicit agent commands without writes", (t) => {
  const f = fixture(t),
    plan = buildPlan(options(f.target), catalog, f.context);
  assert.deepEqual(
    plan.entries.map((entry) => entry.name),
    ["coding", "coding-with-rules"],
  );
  assert.deepEqual(plan.prerequisites, ["coding"]);
  assert.equal(plan.blocked.length, 0);
  assert.deepEqual(plan.entries[0].argv.slice(-3), ["--agent", "pi", "--yes"]);
  assert.equal(existsSync(join(f.target, ".agents/skills")), false);
});
test("category expansion includes all scoped members and reports excluded personal entries", (t) => {
  const f = fixture(t),
    plan = buildPlan(
      { target: f.target, categories: ["agentic-work"], agents: ["pi"] },
      catalog,
      f.context,
    );
  assert.deepEqual(plan.excludedByScope, ["sync-my-agents"]);
  assert.deepEqual(plan.selected, ["writing-for-agents"]);
  assert.match(plan.blocked.join("\n"), /semantic adaptation/);
});
test("personal scope is explicit and preserves the catalogued global argument", (t) => {
  const f = fixture(t),
    plan = buildPlan(
      { target: f.target, skills: ["sync-my-agents"], scope: "personal", agents: ["pi"] },
      catalog,
      f.context,
    );
  assert.ok(plan.entries[0].argv.includes("--global"));
  assert.deepEqual(plan.entries[0].destinations, [join(f.home, ".agents/skills/sync-my-agents")]);
  assert.throws(
    () => buildPlan(options(f.target, { skills: ["sync-my-agents"] }), catalog, f.context),
    /personal scope/,
  );
});
for (const [label, extra] of [
  ["unknown agent", { agents: ["unknown"] }],
  ["unknown skill", { skills: ["unknown"] }],
  ["unknown category", { categories: ["unknown"] }],
  ["invalid scope", { scope: "global" }],
  ["unsafe ref", { ref: "../../bad" }],
  ["no selection", { skills: [] }],
])
  test(`planning rejects ${label}`, (t) => {
    const f = fixture(t);
    assert.throws(() => buildPlan(options(f.target, extra), catalog, f.context));
  });
test("authored source ref can be pinned without changing upstream source pins", (t) => {
  const f = fixture(t),
    ref = "a".repeat(40);
  const plan = buildPlan(
    options(f.target, { ref, skills: ["coding", "grilling"] }),
    catalog,
    f.context,
  );
  assert.match(plan.entries.find((entry) => entry.name === "coding").argv[4], new RegExp(ref));
  assert.equal(
    plan.entries.find((entry) => entry.name === "grilling").argv[4],
    catalog.byName.get("grilling").install.argv[4],
  );
});
test("existing destinations block by default and require explicit overwrite", (t) => {
  const f = fixture(t),
    folder = join(f.target, ".agents/skills/coding");
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, "custom"), "mine");
  assert.match(buildPlan(options(f.target), catalog, f.context).blocked.join("\n"), /--overwrite/);
  assert.equal(
    buildPlan(options(f.target, { overwrite: true }), catalog, f.context).blocked.length,
    0,
  );
  assert.equal(readFileSync(join(folder, "custom"), "utf8"), "mine");
});
test("symlinked target ancestors and unsafe skill projections are rejected", (t) => {
  const f = fixture(t),
    alias = join(f.home, "alias");
  symlinkSync(f.target, alias, "dir");
  assert.throws(() => buildPlan(options(alias), catalog, f.context), /symlinked ancestors/);
  mkdirSync(join(f.target, ".claude/skills"), { recursive: true });
  symlinkSync(f.home, join(f.target, ".claude/skills/coding"), "dir");
  assert.throws(
    () => buildPlan(options(f.target, { agents: ["claude-code"] }), catalog, f.context),
    /Unsafe skill projection/,
  );
});
test("execution preserves instructions, legacy locks, custom skills, legal and supporting files", async (t) => {
  const f = fixture(t),
    custom = join(f.target, ".agents/skills/custom");
  mkdirSync(custom, { recursive: true });
  writeFileSync(join(custom, "private.md"), "mine");
  const plan = buildPlan(options(f.target, { agents: ["pi", "claude-code"] }), catalog, f.context);
  let downloads = 0;
  const completed = await executePlan(plan, {
    confirmed: true,
    run: installer(plan),
    fetcher: async () => {
      downloads++;
      return fetcher();
    },
  });
  assert.deepEqual(completed, ["coding", "coding-with-rules"]);
  assert.equal(downloads, 1);
  assert.equal(readFileSync(join(f.target, "RULES.md"), "utf8"), "Do not change my rules.\n");
  assert.equal(
    readFileSync(join(f.target, ".agents/ai-assets.lock.json"), "utf8"),
    "legacy bytes\n",
  );
  assert.equal(readFileSync(join(custom, "private.md"), "utf8"), "mine");
  for (const entry of plan.entries) {
    assert.equal(existsSync(join(entry.destinations[0], "agents/openai.yaml")), false);
    assert.equal(
      readFileSync(join(entry.destinations[0], "LICENSE"), "utf8"),
      "MIT legal fixture\n",
    );
    assert.equal(existsSync(join(entry.destinations[0], "supporting.md")), true);
  }
});
test("unconfirmed or blocked operations never run commands or download sources", async (t) => {
  const f = fixture(t),
    plan = buildPlan(options(f.target), catalog, f.context);
  const never = () => {
    assert.fail("unexpected external action");
  };
  await assert.rejects(executePlan(plan, { run: never, fetcher: never }), /confirmation/);
  const blocked = buildPlan(options(f.target, { skills: ["tdd"] }), catalog, f.context);
  await assert.rejects(
    executePlan(blocked, { confirmed: true, run: never, fetcher: never }),
    /blocked/,
  );
});
test("failed legal acquisition stops before any target writes", async (t) => {
  const f = fixture(t),
    plan = buildPlan(options(f.target), catalog, f.context);
  await assert.rejects(
    executePlan(plan, {
      confirmed: true,
      run: () => assert.fail(),
      fetcher: async () => new Response("missing", { status: 404 }),
    }),
    /required source file/,
  );
  assert.equal(existsSync(join(f.target, ".agents/skills")), false);
});
test("a destination created after preview is not overwritten", async (t) => {
  const f = fixture(t),
    plan = buildPlan(options(f.target), catalog, f.context);
  mkdirSync(plan.entries[0].destinations[0], { recursive: true });
  await assert.rejects(
    executePlan(plan, { confirmed: true, run: () => assert.fail(), fetcher }),
    /appeared after preview/,
  );
});
for (const [label, setup, pattern] of [
  ["missing output", { omit: true }, /did not create/],
  ["unsafe output symlinks", { symlink: true }, /Symlink in installed/],
  ["undeclared installed prerequisites", { undeclared: true }, /Undeclared prerequisite/],
])
  test(`execution rejects ${label}`, async (t) => {
    const f = fixture(t),
      plan = buildPlan(options(f.target), catalog, f.context);
    await assert.rejects(
      executePlan(plan, { confirmed: true, run: installer(plan, setup), fetcher }),
      pattern,
    );
  });
test("a command failure stops subsequent installations and reports partial progress", async (t) => {
  const f = fixture(t),
    plan = buildPlan(options(f.target), catalog, f.context);
  let count = 0;
  await assert.rejects(
    executePlan(plan, {
      confirmed: true,
      fetcher,
      run: async (argv) => {
        if (++count === 2) throw new Error("failed fixture");
        await installer(plan)(argv);
      },
    }),
    /completed: coding.*failed fixture/,
  );
  assert.equal(count, 2);
});
test("unexpected instruction edits from an installer are detected", async (t) => {
  const f = fixture(t),
    plan = buildPlan(options(f.target), catalog, f.context);
  await assert.rejects(
    executePlan(plan, {
      confirmed: true,
      fetcher,
      run: async (argv) => {
        await installer(plan)(argv);
        writeFileSync(join(f.target, "RULES.md"), "changed");
      },
    }),
    /Instruction document changed unexpectedly/,
  );
});
test("display quotes arguments and reports prerequisites and blocked adaptations", (t) => {
  const f = fixture(t),
    plan = buildPlan(options(f.target, { skills: ["grill-me"] }), catalog, f.context),
    lines = [];
  printPlan(plan, (line) => lines.push(line));
  assert.match(lines.join("\n"), /Required skills added: grilling/);
  assert.match(lines.join("\n"), /semantic adaptation/);
  assert.equal(quote("a'b"), "'a'\\''b'");
});
test("personal destinations reject relative config and symlinked home ancestors", (t) => {
  const f = fixture(t);
  assert.throws(
    () =>
      destinations(f.target, "example", ["claude-code"], "personal", f.home, {
        CLAUDE_CONFIG_DIR: "relative",
      }),
    /must be absolute/,
  );
  const alias = join(f.target, "home-alias");
  symlinkSync(f.home, alias, "dir");
  assert.throws(
    () =>
      buildPlan(options(f.target, { skills: ["sync-my-agents"], scope: "personal" }), catalog, {
        home: alias,
        env: {},
      }),
    /Symlink/,
  );
});
test("destination mapping honors explicit global agent configuration", (t) => {
  const f = fixture(t);
  assert.deepEqual(
    destinations(f.target, "example", ["pi", "opencode", "claude-code"], "personal", f.home, {
      XDG_CONFIG_HOME: join(f.home, "config"),
      CLAUDE_CONFIG_DIR: join(f.home, "claude"),
    }),
    [
      join(f.home, ".agents/skills/example"),
      join(f.home, "config/opencode/skills/example"),
      join(f.home, "claude/skills/example"),
    ],
  );
});
for (const [label, args, success] of [
  ["help", ["--help"], true],
  ["listing", ["list", "--json"], true],
  ["dry run", ["--skill", "coding-with-rules", "--agent", "pi", "--dry-run", "--json"], true],
  ["unknown arguments", ["--bogus"], false],
  ["missing selection", ["--agent", "pi", "--yes"], false],
  ["missing agents", ["--skill", "coding", "--yes"], false],
  ["missing confirmation", ["--skill", "coding", "--agent", "pi"], false],
])
  test(`CLI ${label}`, (t) => {
    const f = fixture(t),
      result = spawnSync(
        process.execPath,
        [join(PACKAGE_ROOT, "scripts/skills/sync.mjs"), ...args],
        { cwd: f.target, encoding: "utf8", timeout: 10000 },
      );
    assert.equal(result.status === 0, success, result.stderr);
    assert.equal(existsSync(join(f.target, ".agents/skills")), false);
  });
