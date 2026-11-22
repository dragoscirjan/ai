import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { catalog, groups, localInstructions, root } from "./data.mjs";
import { generatedPages, installCommand } from "./generate.mjs";
import { workflowGuides, workflows } from "./workflows.mjs";

const expected = {
  productivity: [
    "initiative",
    "research",
    "specify",
    "plan-tasks",
    "retro",
    "grill-me",
    "grilling",
    "wait-what",
  ],
  coding: [
    "coding",
    "coding-with-rules",
    "scaffold",
    "code-review",
    "systematic-debugging",
    "tdd",
    "debloat",
  ],
  documentation: [
    "asd-ste100-technical",
    "caveman",
    "document-project",
    "unslop",
    "excalidraw",
    "archify",
  ],
  "agentic-work": ["writing-for-agents", "sync-my-skills"],
  utility: ["init-project", "isolated-workspace", "cleanup-workspaces"],
  unpolished: ["instruction-maintenance", "subagent-orchestration"],
};

test("documentation uses the owner's six groups, external memberships and utility initializer", () => {
  assert.deepEqual(
    groups.map((group) => group.id),
    Object.keys(expected),
  );
  for (const group of groups) {
    assert.deepEqual([...group.skills].sort(), [...expected[group.id]].sort(), group.id);
  }
  const documented = groups.flatMap((group) => group.skills);
  assert.equal(documented.length, new Set(documented).size);
  assert.deepEqual(new Set(documented), new Set(catalog().skills.map((entry) => entry.name)));
});

test("goal-based navigation keeps every existing recipe reachable without changing its URL", () => {
  const pages = generatedPages();
  for (const id of [...workflowGuides.map((guide) => guide.id), "supporting-tools"])
    pages.set(`workflows/${id}.md`, readFileSync(join(root, "docs/workflows", `${id}.md`), "utf8"));
  const reachable = new Set(["index"]);
  for (const id of reachable) {
    const page = pages.get(`workflows/${id}.md`);
    assert.ok(page, `Missing reachable workflow: ${id}`);
    for (const [, target] of page.matchAll(/\]\(\/workflows\/([a-z-]+)(?:#[^)]*)?\)/g))
      reachable.add(target);
  }
  assert.equal(workflows.length, 25);
  for (const recipe of workflows) {
    assert.ok(groups.some((group) => group.id === recipe.group));
    assert.ok(reachable.has(recipe.id), recipe.id);
    assert.ok(pages.has(`workflows/${recipe.id}.md`), recipe.id);
    assert.ok(
      pages.get(`groups/${recipe.group}.md`).includes(`/workflows/${recipe.id}`),
      recipe.id,
    );
  }
});

test("each skill page has exactly one command selecting only its own catalog skill", () => {
  const pages = generatedPages();
  for (const entry of catalog().skills) {
    const page = pages.get(`skills/${entry.name}.md`);
    const commands = [...page.matchAll(/```sh\n([^]*?)\n```/g)].map((match) => match[1]);
    assert.equal(commands.length, 1, entry.name);
    assert.equal(commands[0], entry.install.argv.join(" "), entry.name);
    const argv = commands[0].split(/\s+/);
    assert.deepEqual(argv.slice(0, 2), ["npx", "-y"]);
    assert.equal(argv.filter((arg) => arg === "--skill").length, 1);
    const selector = argv.indexOf("--skill");
    assert.equal(argv[selector + 1], entry.name);
    assert.ok(!argv[selector + 2] || argv[selector + 2].startsWith("--"));
    assert.equal(argv.includes("--all"), false);
    assert.match(page, /## Install this skill/);
    assert.match(page, /does not install the rest of the collection/);
  }
});

test("required instructions have separate install links instead of widening the selected command", () => {
  const pages = generatedPages();
  assert.match(pages.get("skills/coding-with-rules.md"), /\/skills\/coding#install-this-skill/);
  assert.match(pages.get("skills/research.md"), /\/skills\/grilling#install-this-skill/);
  assert.match(pages.get("skills/sync-my-skills.md"), /personal installation/);
});

test("installation commands reject broadened selection and quote source arguments", () => {
  const entry = {
    name: "example",
    install: { argv: ["npx", "-y", "skills@1.7.4", "add", "owner/repo", "--skill", "example"] },
  };
  for (const argv of [
    entry.install.argv.slice(0, 5),
    [...entry.install.argv, "second-skill"],
    [...entry.install.argv, "--all"],
    [...entry.install.argv.slice(0, 4), "--all", ...entry.install.argv.slice(5)],
    [...entry.install.argv.slice(0, 4), "owner/repo\n--all", ...entry.install.argv.slice(5)],
    [...entry.install.argv.slice(0, 6), "different"],
  ])
    assert.throws(() => installCommand({ ...entry, install: { argv } }), /select only example/);
  const quoted = [...entry.install.argv];
  quoted[4] = "owner's source";
  assert.equal(
    installCommand({ ...entry, install: { argv: quoted } }),
    "npx -y skills@1.7.4 add 'owner'\"'\"'s source' --skill example",
  );
});

test("remote adaptations identify pinned inputs and require review rather than claiming a vendored copy", () => {
  const pages = generatedPages();
  for (const name of ["code-review", "grill-me", "tdd", "writing-for-agents"]) {
    const entry = catalog().byName.get(name);
    const page = pages.get(`skills/${name}.md`);
    assert.match(page, /Pinned upstream input; adaptation required/);
    assert.match(page, /not a reviewed installed adaptation/);
    assert.match(page, /review the output and legal notices before use/);
    assert.match(page, /Read the pinned upstream input/);
    assert.ok(page.includes(entry.source.revision));
    assert.doesNotMatch(page, /maintained local copy/);
    assert.throws(() => localInstructions(name), /No local instructions/);
  }
});

test("source inspection follows grouped catalog paths even when the documentation group differs", () => {
  assert.match(localInstructions("coding"), /^name: coding$/m);
  assert.match(localInstructions("init-project"), /^name: init-project$/m);
  assert.throws(() => localInstructions("grilling"), /No local instructions/);
});
