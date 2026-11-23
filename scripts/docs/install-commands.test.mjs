import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { test } from "node:test";
import { parse } from "yaml";
import { catalog, groups, localInstructions, root, sourceUrl } from "./data.mjs";
import { generatedPages, installCommand } from "./generate.mjs";
import { notes } from "./skill-notes.mjs";
import { workflows } from "./workflows.mjs";

const read = (path) => readFileSync(join(root, path), "utf8");

test("every local install URL names the actual grouped source directory and declared skill", () => {
  const c = catalog();
  const local = c.skills.filter((entry) => entry.source.type === "local");
  assert.equal(local.length, 20);
  for (const entry of local) {
    const expected = `${c.repository}/tree/${c.ref}/${entry.source.path}`;
    assert.equal(entry.install.argv[4], expected, entry.name);
    assert.equal(basename(entry.source.path), entry.name);
    const metadata = parse(localInstructions(entry.name).match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
    assert.equal(metadata.name, entry.name);
    assert.ok(installCommand(entry).includes(expected));
  }
});

test("external install URLs retain their immutable source revisions and exact paths", () => {
  for (const entry of catalog().skills.filter((item) => item.source.type !== "local")) {
    const source = entry.source;
    assert.match(source.revision, /^[a-f0-9]{40}$/);
    assert.equal(
      entry.install.argv[4],
      `${source.repository}/tree/${source.revision}/${source.path}`,
    );
  }
});

test("published skill commands and source links match every catalog acquisition source", () => {
  const c = catalog();
  for (const entry of c.skills) {
    const page = read(`docs/skills/${entry.name}.md`);
    assert.ok(page.includes(installCommand(entry)), entry.name);
    assert.ok(page.includes(sourceUrl(entry)), entry.name);
  }
  for (const name of ["code-review", "grill-me", "tdd", "writing-for-agents"]) {
    const entry = c.byName.get(name);
    assert.equal(entry.source.type, "github", name);
    assert.equal(entry.source.repository, "https://github.com/mattpocock/skills", name);
    const page = read(`docs/skills/${name}.md`);
    assert.doesNotMatch(
      page,
      /https:\/\/github\.com\/dragoscirjan\/ai\/(?:tree|blob)\/[^\s)]+\/\.agents\/skills\//,
    );
  }
});
test("documentation categories and memberships come directly from the YAML", () => {
  const raw = parse(read(".agents/skills/agentic-work/sync-my-skills/assets/skill-catalog.yaml"));
  assert.equal(raw.schemaVersion, 3);
  assert.deepEqual(Object.keys(raw.categories), [
    "productivity",
    "coding",
    "documentation",
    "agentic-work",
    "utility",
    "unpolished",
  ]);
  const derived = Object.keys(raw.categories).map((id) => ({
    id,
    ...raw.categories[id],
    skills: Object.entries(raw.skills)
      .filter(([, entry]) => entry.category === id)
      .map(([name]) => name),
  }));
  assert.deepEqual(groups, derived);
});

test("the personal skill is command-driven with one runtime catalog pointer and no installer engine", () => {
  const base = ".agents/skills/agentic-work/sync-my-skills/";
  const instruction = localInstructions("sync-my-skills");
  assert.match(instruction, /Generate commands from each selected entry's `install.argv`/);
  assert.match(instruction, /Obtain approval, then run the commands directly/);
  assert.deepEqual(
    [...instruction.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]),
    ["assets/skill-catalog.yaml"],
  );
  for (const file of [
    "scripts/sync-core.mjs",
    "scripts/sync-my-skills.mjs",
    "package.json",
    "assets/selection.schema.json",
    "assets/ai-assets-lock.schema.json",
  ])
    assert.equal(existsSync(join(root, base, file)), false, file);
  for (const name of ["pi", "opencode"]) {
    const stub = read(base + "assets/commands/" + name + ".md");
    assert.match(stub, /Load the installed sync-my-skills skill and follow it/);
    assert.doesNotMatch(stub, /every remaining|planId|--bundled|grill/);
  }
});

test("single-skill selection and the personal manager scope remain unchanged", () => {
  for (const entry of catalog().skills) {
    const argv = entry.install.argv;
    assert.deepEqual(argv.slice(0, 4), ["npx", "-y", "skills@1.7.4", "add"]);
    assert.equal(argv.filter((part) => part === "--skill").length, 1);
    assert.equal(argv[argv.indexOf("--skill") + 1], entry.name);
    assert.equal(argv.includes("--all"), false);
    assert.equal(argv.includes("--global"), entry.name === "sync-my-skills");
  }
});

test("published direct-install examples use grouped URLs and npx consent flags", () => {
  for (const path of [
    "AGENTS.md",
    "README.md",
    "docs/guide/install.md",
    ".agents/skills/agentic-work/sync-my-skills/README.md",
    ".agents/skills/coding/coding-with-rules/README.md",
    ".agents/skills/coding/init-project/README.md",
  ]) {
    const text = read(path);
    assert.doesNotMatch(text, /npx(?: -y)? skills@1\.7\.4 add dragoscirjan\/ai(?:\s|$)/);
    for (const command of text.matchAll(/^npx[^\n]+/gm))
      assert.match(command[0], /^npx -y skills@1\.7\.4 add /, path);
  }
  const coding = read(".agents/skills/coding/coding-with-rules/README.md");
  for (const name of ["coding", "coding-with-rules"])
    assert.ok(
      coding.includes(`/tree/main/.agents/skills/coding/${name} --skill ${name} --agent pi`),
    );
});

test("no other skill depends on or hands off to the personal manager", () => {
  const pages = generatedPages();
  for (const entry of catalog().skills.filter((item) => item.name !== "sync-my-skills")) {
    assert.ok(!entry.prerequisites.includes("sync-my-skills"), entry.name);
    assert.ok(!notes[entry.name].companions.includes("sync-my-skills"), entry.name);
    assert.ok(!pages.get(`skills/${entry.name}.md`).includes("/skills/sync-my-skills"), entry.name);
  }
  for (const recipe of workflows)
    if (
      recipe.steps.some((step) => step.skill === "sync-my-skills") ||
      recipe.optional.includes("sync-my-skills")
    )
      assert.equal(
        recipe.id,
        "install-selected-skills",
        "Manager use belongs only to its explicitly requested standalone workflow",
      );
  assert.deepEqual(catalog().byName.get("coding-with-rules").prerequisites, ["coding"]);
});

test("startup and reader guidance hard-stop on missing instructions and require user installation", () => {
  const policy = read("AGENTS.md");
  assert.match(
    policy,
    /If a selected skill or one of its declared requirements is not installed, stop the task/,
  );
  assert.match(policy, /List the missing skills and ask the user to install them/);
  assert.match(
    policy,
    /Do not fetch, install, synchronize, substitute, or continue without those instructions/,
  );
  assert.match(
    policy,
    /Resume only after the user confirms installation and availability is verified/,
  );
  assert.match(
    policy,
    /Do not add `sync-my-skills` as another skill's prerequisite, companion, handoff, or recovery step/,
  );
  assert.match(policy, /Load or run it only when the user explicitly requests it/);
  assert.match(
    policy,
    /Before changing repository files for a new task, create a dedicated task branch/,
  );
  assert.match(policy, /Choose the current checkout or a separate workspace/);
  assert.doesNotMatch(policy, /isolated-workspace/);
  assert.doesNotMatch(read("CONTRIBUTING.md"), /isolated-workspace/);
  assert.doesNotMatch(policy, /With owner approval, install it/);
  for (const [path, text] of generatedPages())
    if (path.startsWith("skills/") && path !== "skills/index.md") {
      assert.match(text, /Missing instructions stop the task/, path);
      assert.match(text, /The agent must ask you to install them/, path);
    }
});
