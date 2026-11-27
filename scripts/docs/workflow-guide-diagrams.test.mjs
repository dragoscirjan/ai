import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { catalog, root } from "./data.mjs";
import { diagramSpecs, identity, workflowGuideSpec } from "./diagram-specs.mjs";
import { workflowGuides } from "./workflows.mjs";
import { generatedPages } from "./generate.mjs";

const repository = identity();
const spec = (id) =>
  workflowGuideSpec(
    workflowGuides.find((guide) => guide.id === id),
    repository,
  );
const relation = (diagram, from, to) => {
  const found = diagram.edges.find((item) => item.from === from && item.to === to);
  assert.ok(found, `Missing ${from} → ${to}`);
  return found;
};
const reachable = (diagram, from, removed) => {
  const reached = new Set([from]);
  for (const id of reached)
    for (const item of diagram.edges)
      if (item.from === id && item.to !== removed) reached.add(item.to);
  return reached;
};

test("five primary journeys join the native diagram set with cited skill nodes", () => {
  const diagrams = diagramSpecs(repository);
  assert.equal(diagrams.size, 32);
  for (const guide of workflowGuides) {
    const diagram = diagrams.get(guide.id);
    assert.equal(diagram.diagram_type, "workflow");
    assert.equal(diagram.schema_version, 2);
    assert.equal(diagram.meta.quality_profile, "showcase");
    assert.deepEqual(diagram.meta.repository, repository);
    assert.ok(!Object.hasOwn(diagram.meta, "viewBox"));
    for (const node of diagram.nodes) {
      assert.ok(node.sources.length > 0, node.id);
      assert.doesNotMatch(
        JSON.stringify(node),
        /isolated-workspace|cleanup-workspaces|background-agents/,
      );
    }
    for (const item of diagram.edges.filter((item) => item.role === "return"))
      assert.ok(
        diagram.semanticChecks.requiredEdges.some(
          (edge) => edge.from === item.from && edge.to === item.to,
        ),
      );
  }
});

test("actual skill nodes use slash labels without renaming conceptual stages", () => {
  const names = new Set(catalog().skills.map((entry) => entry.name));
  for (const guide of workflowGuides) {
    const diagram = spec(guide.id);
    assert.ok(diagram.nodes.some((node) => node.label.startsWith("/")));
    for (const node of diagram.nodes) {
      assert.ok(!names.has(node.label), `Unmarked skill label: ${node.label}`);
      if (node.label.startsWith("/")) assert.ok(names.has(node.label.slice(1)), node.label);
    }
  }
});

test("all generated standalone viewers bypass SPA routing without losing base rewriting", () => {
  let links = 0;
  for (const [path, text] of generatedPages())
    for (const match of text.matchAll(/\[Open interactive diagram\]\(([^)]+)\)([^\n]*)/g)) {
      assert.ok(match[1].startsWith("/diagrams/"), path);
      assert.ok(match[2].startsWith('{class="vp-raw"}'), path);
      links++;
    }
  assert.equal(links, diagramSpecs(repository).size - workflowGuides.length);
});

test("planning retains shorter entry points and scope or criteria rework", () => {
  const diagram = spec("plan-a-project");
  for (const [from, to] of [
    ["facts", "research"],
    ["idea", "initiative"],
    ["direction", "specify"],
    ["scope", "tasks"],
  ])
    relation(diagram, from, to);
  assert.match(relation(diagram, "research", "initiative").label, /if requested/);
  assert.equal(relation(diagram, "specify", "initiative").role, "return");
  assert.equal(relation(diagram, "tasks", "specify").role, "return");
});

test("implementation preserves scaffold stops, optional TDD, and review corrections", () => {
  const diagram = spec("implement-a-task");
  relation(diagram, "task", "coding");
  relation(diagram, "scaffold", "handoff");
  assert.match(relation(diagram, "handoff", "coding").label, /new instruction/);
  assert.equal(
    diagram.edges.some((item) => item.from === "scaffold" && item.to === "coding"),
    false,
  );
  assert.match(relation(diagram, "task", "tdd").label, /selected/);
  assert.equal(relation(diagram, "coding", "tdd").role, "return");
  assert.match(relation(diagram, "checks", "review").label, /if requested/);
  assert.equal(relation(diagram, "review", "coding").role, "return");
  assert.equal(relation(diagram, "review", "planning").role, "return");
});

test("debugging requires regression evidence and provides diagnosis-only and failed-fix exits", () => {
  const diagram = spec("debug-a-problem");
  assert.equal(reachable(diagram, "investigate", "regression").has("fix"), false);
  relation(diagram, "hypothesis", "diagnosis");
  assert.match(relation(diagram, "hypothesis", "regression").label, /approval/);
  assert.equal(relation(diagram, "verify", "investigate").role, "return");
  assert.match(relation(diagram, "verify", "reassess").label, /3 failed fixes/);
});

test("documentation and debloating keep approval on the operation it protects", () => {
  const docs = spec("document-a-project");
  assert.match(relation(docs, "site", "write").label, /existing site/);
  assert.match(relation(docs, "baseline", "write").label, /if approved/);
  relation(docs, "baseline", "pause");
  assert.equal(relation(docs, "verify", "write").role, "return");
  const debloat = spec("debloat-a-project");
  assert.match(relation(debloat, "decision", "report").label, /keep or defer/);
  assert.match(relation(debloat, "approve", "coverage").label, /if approved/);
  relation(debloat, "coverage", "simplify");
  relation(debloat, "verify", "reassess");
});

test("each main guide embeds its SVG and links the matching native viewer and source", () => {
  for (const guide of workflowGuides) {
    const text = readFileSync(join(root, "docs/workflows", `${guide.id}.md`), "utf8");
    for (const link of [
      `/diagrams/${guide.id}.svg`,
      `/diagrams/${guide.id}.html`,
      `/diagram-sources/${guide.id}.json`,
    ])
      assert.ok(text.includes(link), `${guide.id}: ${link}`);
    assert.ok(
      text.includes(`[Open interactive diagram](/diagrams/${guide.id}.html){class="vp-raw"}`),
      `${guide.id}: standalone viewer must bypass SPA routing`,
    );
    assert.match(text, /<summary>Read the flow as text<\/summary>/);
  }
});
