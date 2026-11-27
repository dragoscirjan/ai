import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { catalog, groups, localInstructions, root } from "./data.mjs";
import { availability, generatedPages, installCommand } from "./generate.mjs";
import { workflowGuides, workflows } from "./workflows.mjs";
import { verifyMarkdownIndependence } from "../skills/independence.mjs";
import { notes } from "./skill-notes.mjs";

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
  "agentic-work": ["writing-for-agents", "sync-my-agents"],
  utility: ["init-project", "isolated-workspace", "cleanup-workspaces", "background-agents"],
  unpolished: ["instruction-maintenance"],
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

test("background workers replace orchestration routing without requiring specialist definitions", () => {
  const text = localInstructions("background-agents");
  assert.match(text, /launch asynchronously/i);
  assert.match(text, /yield the turn/i);
  assert.match(text, /general-purpose workers/i);
  assert.match(text, /at most three workers and two reviewers/);
  assert.match(text, /Prohibit child delegation/);
  assert.match(text, /durable task/);
  assert.match(text, /inspection/);
  assert.match(text, /failed launch is a blocker/i);
  assert.match(text, /final acceptance/);
  assert.doesNotMatch(text, /^requires:/m);
  const routing = readFileSync(join(root, "AGENTS.md"), "utf8");
  assert.match(routing, /\.agents\/skills\/utility\/background-agents\/SKILL\.md/);
  assert.doesNotMatch(routing, /subagent-orchestration/);
  assert.equal(catalog().byName.has("subagent-orchestration"), false);
  const page = generatedPages().get("skills/background-agents.md");
  assert.match(page, /asynchronous runtime support/);
  assert.match(page, /unsupported inspection or steering/);
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
    assert.ok(page.includes(`This command selects only \`${entry.name}\``));
  }
});

test("instruction review is explicit, evidence-based, and separate from installation", () => {
  const page = generatedPages().get("skills/sync-my-agents.md");
  assert.match(page, /Inspect project evidence/);
  assert.match(page, /show exact diffs before editing/);
  assert.match(page, /Do not install skills or impose a template bundle/);
  assert.match(page, /Missing required skills stop the affected phase/);
});

test("every individual profile contains only self and declared required-skill references", () => {
  const c = catalog(),
    pages = generatedPages(),
    plan = { repository: c.repository, ref: c.ref, linkSources: c.skills };
  for (const entry of c.skills) {
    const page = pages.get(`skills/${entry.name}.md`);
    assert.equal(Object.hasOwn(notes[entry.name], "companions"), false);
    assert.doesNotMatch(page, /Useful combinations|optional companions|\/workflows\//);
    verifyMarkdownIndependence(page, entry, plan, `skills/${entry.name}.md`, { profile: true });
  }
});
test("required instructions have separate install links instead of widening the selected command", () => {
  const pages = generatedPages();
  assert.match(pages.get("skills/coding-with-rules.md"), /\/skills\/coding#install-this-skill/);
  assert.match(pages.get("skills/research.md"), /\/skills\/grilling#install-this-skill/);
  assert.match(pages.get("skills/sync-my-agents.md"), /personal installation/);
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

test("reviewed variants identify maintained files while unchanged interview and writing guidance stay upstream", () => {
  const c = catalog(),
    pages = generatedPages();
  for (const name of ["code-review", "tdd"]) {
    const entry = c.byName.get(name),
      page = pages.get(`skills/${name}.md`);
    assert.equal(entry.source.type, "local");
    assert.match(entry.upstream.revision, /^[a-f0-9]{40}$/);
    assert.match(page, /Upstream-derived; maintained here/);
    assert.match(page, /Read the authoritative skill instructions/);
    assert.match(page, /maintained local copy/);
    assert.doesNotMatch(page, /not a reviewed installed adaptation/);
    assert.match(localInstructions(name), new RegExp("^name: " + name + "$", "m"));
  }
  const grill = c.byName.get("grill-me");
  assert.equal(grill.kind, "upstream");
  assert.equal(grill.source.type, "github");
  assert.equal(grill.adaptation, undefined);
  assert.match(pages.get("skills/grill-me.md"), /Upstream-only; approved external setup/);
  assert.match(
    pages.get("skills/grill-me.md"),
    /fcf0071560d32913c9d4f820e0d7ca467c881619\/skills\/productivity\/grill-me --skill grill-me/,
  );
  assert.throws(() => localInstructions("grill-me"), /No local instructions/);
  const writing = c.byName.get("writing-for-agents");
  assert.equal(writing.kind, "upstream");
  assert.equal(writing.source.type, "github");
  assert.equal(writing.adaptation, undefined);
  assert.match(pages.get("skills/writing-for-agents.md"), /Upstream-only; approved external setup/);
  assert.throws(() => localInstructions("writing-for-agents"), /No local instructions/);
});
test("future unprepared remote variants still show a review-required warning", () => {
  assert.equal(
    availability({ kind: "adapted", source: { type: "github" } }),
    "Pinned upstream input; adaptation required",
  );
});

test("native recipe labels fit the pinned renderer node budget", () => {
  // Conservative ASCII budget for native workflow nodes capped at 200px.
  for (const recipe of workflows) {
    for (const step of recipe.steps) {
      assert.match(step.label, /^[\x20-\x7E]+$/);
      assert.ok(step.label.length <= 28, recipe.id + ": " + step.label);
    }
  }
});

test("source inspection follows grouped catalog paths even when the documentation group differs", () => {
  assert.match(localInstructions("coding"), /^name: coding$/m);
  assert.match(localInstructions("init-project"), /^name: init-project$/m);
  assert.throws(() => localInstructions("grilling"), /No local instructions/);
});
