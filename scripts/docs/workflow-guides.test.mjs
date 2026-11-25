import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import siteConfig from "../../docs/.vitepress/config.mjs";
import { root } from "./data.mjs";
import { generatedPages } from "./generate.mjs";
import { workflowGuides, workflows } from "./workflows.mjs";

const ids = [
  "plan-a-project",
  "implement-a-task",
  "debug-a-problem",
  "document-a-project",
  "debloat-a-project",
];
const guideText = (id) => readFileSync(join(root, "docs/workflows", `${id}.md`), "utf8");

test("the workflow entry point leads to five goals rather than the recipe catalog", () => {
  assert.deepEqual(
    workflowGuides.map((guide) => guide.id),
    ids,
  );
  const index = generatedPages().get("workflows/index.md");
  for (const guide of workflowGuides) {
    assert.match(index, new RegExp(`\\[${guide.title}\\]\\(/workflows/${guide.id}\\)`));
    assert.match(guideText(guide.id), /^# /m);
    assert.ok(guide.recipes.length > 0);
    for (const id of guide.recipes) assert.ok(workflows.some((recipe) => recipe.id === id));
  }
  assert.doesNotMatch(index, /25 recipes|## Productivity|## Utility|## Unpolished/);
  assert.match(index, /\/workflows\/supporting-tools/);
});

test("primary navigation exposes the five guides and keeps utilities separate", () => {
  const sidebar = siteConfig.themeConfig.sidebar;
  const primary = sidebar.find((group) => group.link === "/workflows/");
  assert.deepEqual(
    primary.items.map((item) => item.link),
    [...ids.map((id) => `/workflows/${id}`), "/workflows/supporting-tools"],
  );
  assert.ok(
    sidebar.indexOf(primary) < sidebar.findIndex((group) => group.link === "/groups/coding"),
  );
});

test("generation preserves standalone journeys and recipe URLs without adding profile handoffs", () => {
  const pages = generatedPages();
  for (const id of [...ids, "supporting-tools"])
    assert.equal(pages.has(`workflows/${id}.md`), false);
  for (const recipe of workflows) {
    const page = pages.get(`workflows/${recipe.id}.md`);
    assert.match(page, /This is a focused procedure/);
    const guide = workflowGuides.find((item) => item.recipes.includes(recipe.id));
    assert.ok(page.includes(`/workflows/${guide?.id ?? "supporting-tools"}`));
  }
  assert.doesNotMatch(pages.get("skills/research.md"), /\/workflows\//);
  assert.doesNotMatch(pages.get("skills/debloat.md"), /\/workflows\//);
});

test("guides explain examples and handoffs without putting utilities in product flows", () => {
  for (const id of ids) {
    const text = guideText(id);
    assert.match(text, /## Example:/);
    assert.match(text, /illustrative/i);
    assert.match(text, /```text\n/);
    const prerequisites = text.indexOf(
      id === "plan-a-project" ? "## Choose your entry point" : "## Before you start",
    );
    const flowHeading = text.indexOf("## Workflow");
    assert.ok(flowHeading >= 0 && flowHeading < prerequisites, `${id}: show the flow first`);
    assert.ok(prerequisites < text.indexOf("## Steps"), `${id}: prerequisites precede actions`);
    for (const [, flow] of text.matchAll(/```text\n([\s\S]*?)```/g))
      assert.doesNotMatch(flow, /isolated-workspace|cleanup-workspaces|subagent-orchestration/);
  }
  assert.match(guideText("plan-a-project"), /declare `grilling` as required instructions/);
  assert.match(guideText("implement-a-task"), /separate explicit instruction before implementing/);
  assert.match(guideText("debug-a-problem"), /Regression evidence before the fix/);
  assert.match(guideText("document-a-project"), /passing build does not prove/);
  assert.match(guideText("debloat-a-project"), /Keep\s+\|[\s\S]*Simplify\s+\|[\s\S]*Defer\s+\|/);
});
