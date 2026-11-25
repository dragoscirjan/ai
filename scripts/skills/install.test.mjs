import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { test } from "node:test";
import { parse } from "yaml";
import { CATALOG_PATH, PACKAGE_ROOT, loadCatalog } from "./catalog.mjs";
import { buildPlan, destinations, executePlan, printPlan, quote } from "./install.mjs";

const catalog = loadCatalog();
function unpreparedCatalog(t, name) {
  const folder = mkdtempSync(join(tmpdir(), "unprepared-catalog-"));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  const data = parse(readFileSync(CATALOG_PATH, "utf8"));
  const entry = data.skills[name];
  entry.source = entry.upstream;
  entry.adaptation.instructions = "Unprepared upstream content requires a reviewed variant.";
  entry.install.argv = [
    "npx",
    "-y",
    "skills@1.7.4",
    "add",
    `${entry.source.repository}/tree/${entry.source.revision}/${entry.source.path}`,
    "--skill",
    name,
  ];
  entry.legal = [{ path: "LICENSE", target: "LICENSE", spdx: "MIT" }];
  const path = join(folder, "catalog.json");
  writeFileSync(path, JSON.stringify(data));
  return loadCatalog(path);
}
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
function nativeInstaller(plan, roots, setup) {
  return async (argv) => {
    for (const root of roots) {
      const nativePlan = {
        ...plan,
        entries: plan.entries.map((entry) => ({
          ...entry,
          destinations: [join(root, entry.name)],
        })),
      };
      const name = argv[argv.indexOf("--skill") + 1];
      rmSync(join(root, name), { recursive: true, force: true });
      await installer(nativePlan, setup)(argv);
    }
  };
}
for (const [agent, scope, root] of [
  ["claude-code", "project", (f) => join(f.target, ".claude/skills")],
  ["claude-code", "personal", (f) => join(f.home, ".claude/skills")],
  ["opencode", "personal", (f) => join(f.home, ".agents/skills")],
])
  for (const stale of [false, true])
    test(`native ${agent} ${scope} output normalizes safely with stale canonical=${stale}`, async (t) => {
      const f = fixture(t),
        name = scope === "personal" ? "sync-my-agents" : "coding";
      const plan = buildPlan(
        options(f.target, { skills: [name], agents: [agent], scope, overwrite: stale }),
        catalog,
        f.context,
      );
      const canonical = plan.entries[0].destinations[0],
        projection = plan.entries[0].destinations[1];
      if (stale) {
        mkdirSync(canonical, { recursive: true });
        writeFileSync(
          join(canonical, "SKILL.md"),
          `---\nname: ${name}\ndescription: Stale canonical.\n---\nOld content.\n`,
        );
        writeFileSync(join(canonical, "stale-only.txt"), "Remove this selected old file.");
      }
      await executePlan(plan, { confirmed: true, run: nativeInstaller(plan, [root(f)]), fetcher });
      assert.match(readFileSync(join(canonical, "SKILL.md"), "utf8"), /Fixture skill/);
      assert.equal(existsSync(join(canonical, "stale-only.txt")), false);
      assert.equal(readlinkSync(projection), relative(dirname(projection), canonical));
      assert.equal(
        readFileSync(join(projection, "SKILL.md"), "utf8"),
        readFileSync(join(canonical, "SKILL.md"), "utf8"),
      );
    });
test("mixed personal agents distinguish universal output from customized final projections", async (t) => {
  const f = fixture(t),
    env = {
      CLAUDE_CONFIG_DIR: join(f.home, "custom-claude"),
      XDG_CONFIG_HOME: join(f.home, "custom-config"),
    };
  const plan = buildPlan(
    options(f.target, {
      skills: ["sync-my-agents"],
      scope: "personal",
      agents: ["opencode", "claude-code"],
    }),
    catalog,
    { home: f.home, env },
  );
  const canonical = join(f.home, ".agents/skills/sync-my-agents"),
    claude = join(env.CLAUDE_CONFIG_DIR, "skills/sync-my-agents"),
    opencode = join(env.XDG_CONFIG_HOME, "opencode/skills/sync-my-agents");
  assert.deepEqual(plan.entries[0].nativeDestinations, [canonical, claude]);
  await executePlan(plan, {
    confirmed: true,
    run: nativeInstaller(plan, [
      join(f.home, ".agents/skills"),
      join(env.CLAUDE_CONFIG_DIR, "skills"),
    ]),
    fetcher,
  });
  for (const path of [claude, opencode])
    assert.equal(readlinkSync(path), relative(dirname(path), canonical));
});
test("a native projection inside the canonical folder is blocked before any installation", (t) => {
  const f = fixture(t),
    env = { CLAUDE_CONFIG_DIR: join(f.home, ".agents/skills/sync-my-agents") };
  assert.throws(
    () =>
      buildPlan(
        options(f.target, {
          skills: ["sync-my-agents"],
          scope: "personal",
          agents: ["claude-code"],
          overwrite: true,
        }),
        catalog,
        { home: f.home, env },
      ),
    /projection overlaps/,
  );
  assert.equal(existsSync(join(f.home, ".agents")), false);
});
test("a custom Claude directory equal to the canonical root needs no self-projection", async (t) => {
  const f = fixture(t),
    env = { CLAUDE_CONFIG_DIR: join(f.home, ".agents") };
  const plan = buildPlan(
    options(f.target, { skills: ["sync-my-agents"], scope: "personal", agents: ["claude-code"] }),
    catalog,
    { home: f.home, env },
  );
  assert.equal(plan.entries[0].destinations.length, 1);
  await executePlan(plan, {
    confirmed: true,
    run: nativeInstaller(plan, [join(f.home, ".agents/skills")]),
    fetcher,
  });
  assert.match(
    readFileSync(join(plan.entries[0].destinations[0], "SKILL.md"), "utf8"),
    /Fixture skill/,
  );
});
test("multiple native copies become exact relative projections of the verified canonical folder", async (t) => {
  const f = fixture(t),
    plan = buildPlan(
      options(f.target, { skills: ["coding"], agents: ["pi", "claude-code"] }),
      catalog,
      f.context,
    );
  await executePlan(plan, {
    confirmed: true,
    run: nativeInstaller(plan, [
      join(f.target, ".agents/skills"),
      join(f.target, ".claude/skills"),
    ]),
    fetcher,
  });
  const [canonical, projection] = plan.entries[0].destinations;
  assert.equal(readlinkSync(projection), relative(dirname(projection), canonical));
});
test("unsafe native Claude output cannot fall back to an old canonical copy", async (t) => {
  const f = fixture(t),
    plan = buildPlan(
      options(f.target, { skills: ["coding"], agents: ["claude-code"], overwrite: true }),
      catalog,
      f.context,
    );
  const canonical = plan.entries[0].destinations[0];
  mkdirSync(canonical, { recursive: true });
  writeFileSync(join(canonical, "keep.txt"), "Old canonical survives rejection.");
  await assert.rejects(
    executePlan(plan, {
      confirmed: true,
      run: nativeInstaller(plan, [join(f.target, ".claude/skills")], { symlink: true }),
      fetcher,
    }),
    /Symlink in installed/,
  );
  assert.equal(
    readFileSync(join(canonical, "keep.txt"), "utf8"),
    "Old canonical survives rejection.",
  );
});
test("flattened installation rebases cross-category Markdown links without editing source instructions", async (t) => {
  const f = fixture(t),
    plan = buildPlan(
      options(f.target, { skills: ["cleanup-workspaces", "subagent-orchestration"] }),
      catalog,
      f.context,
    );
  await executePlan(plan, {
    confirmed: true,
    fetcher,
    run: async (argv) => {
      await installer(plan)(argv);
      if (argv[argv.indexOf("--skill") + 1] === "cleanup-workspaces")
        writeFileSync(
          join(f.target, ".agents/skills/cleanup-workspaces/README.md"),
          "[Orchestration](../../unpolished/subagent-orchestration/SKILL.md#lanes)\n",
        );
    },
  });
  assert.equal(
    readFileSync(join(f.target, ".agents/skills/cleanup-workspaces/README.md"), "utf8"),
    "[Orchestration](../subagent-orchestration/SKILL.md#lanes)\n",
  );
});
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
test("category expansion includes project-compatible dual-scope instruction maintenance", (t) => {
  const f = fixture(t),
    plan = buildPlan(
      { target: f.target, categories: ["agentic-work"], agents: ["pi"] },
      catalog,
      f.context,
    );
  assert.deepEqual(plan.excludedByScope, []);
  assert.deepEqual(plan.selected, ["writing-for-agents", "sync-my-agents"]);
  assert.equal(
    plan.entries.find((entry) => entry.name === "sync-my-agents").argv.includes("--global"),
    false,
  );
  assert.deepEqual(plan.blocked, []);
});
test("personal scope explicitly adds global installation without changing default project scope", (t) => {
  const f = fixture(t),
    plan = buildPlan(
      { target: f.target, skills: ["sync-my-agents"], scope: "personal", agents: ["pi"] },
      catalog,
      f.context,
    );
  assert.ok(plan.entries[0].argv.includes("--global"));
  assert.deepEqual(plan.entries[0].destinations, [join(f.home, ".agents/skills/sync-my-agents")]);
  assert.throws(
    () =>
      buildPlan(options(f.target, { skills: ["coding"], scope: "personal" }), catalog, f.context),
    /project scope/,
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
  const blocked = buildPlan(
    options(f.target, { skills: ["tdd"], overwrite: true }),
    unpreparedCatalog(t, "tdd"),
    f.context,
  );
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
    plan = buildPlan(
      options(f.target, { skills: ["grill-me"] }),
      unpreparedCatalog(t, "grill-me"),
      f.context,
    ),
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
