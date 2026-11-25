import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { CATALOG_PATH, PACKAGE_ROOT, loadCatalog } from "./catalog.mjs";
import { buildPlan } from "./install.mjs";
import { verifyMarkdownIndependence, verifySkillIndependence } from "./independence.mjs";

const catalog = loadCatalog(CATALOG_PATH, PACKAGE_ROOT);
function fixture(t, name = "coding") {
  const target = mkdtempSync(join(tmpdir(), "skill-independence-"));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  const plan = buildPlan({ target, skills: [name], agents: ["pi"] }, catalog);
  return { target, plan, entry: plan.entries.find((entry) => entry.name === name) };
}
for (const [label, body] of [
  ["reverse caller link", "[Router](../coding-with-rules/SKILL.md)"],
  ["optional companion", "Optionally use `code-review`."],
  ["negated peer", "`scaffold` is not a dependency."],
  ["plain negated peer", "This does not require scaffold."],
  ["sync skill handoff", "Next run `sync-my-agents`."],
  ["Pi invocation", "/skill:code-review Inspect the changes."],
  ["Skill tool invocation", '`Skill("scaffold")`'],
  ["example helper import", '```js\nimport helper from "../coding-with-rules/helper.mjs";\n```'],
  ["side-effect helper import", '```js\nimport "../coding-with-rules/helper.mjs";\n```'],
  ["install example", "```sh\nnpx -y skills@1.7.4 add source --skill code-review\n```"],
  ["unknown skill invocation", "Use unknown-helper skill before continuing."],
  [
    "unknown external skill",
    "[Advice](https://github.com/cursor/plugins/blob/commit/pstack/skills/technical-writing/SKILL.md)",
  ],
  ["unknown relative skill", "[Missing](../unknown-helper/SKILL.md)"],
  ["hidden HTML pointer", '<a href="../coding-with-rules/SKILL.md">Router</a>'],
  ["second invocation", "Use this skill, then invoke code-review skill."],
])
  test(`independence rejects ${label}`, (t) => {
    const f = fixture(t);
    assert.throws(
      () => verifyMarkdownIndependence(body, f.entry, f.plan, "README.md"),
      /Undeclared skill reference/,
    );
  });
for (const [label, body] of [
  ["sync CLI", "Use sync-skills to prepare this skill."],
  ["legacy manager", "The old sync-my-skills manager supplies setup."],
  ["catalog file", "[Setup](../../../../catalog/skill-catalog.yaml)"],
  ["collection setup guide", "[Install](../../../../docs/guide/install.md)"],
  ["collection source policy", "[Rules](../../../../CONTRIBUTING.md)"],
  ["GitHub CLI shortcut", "```sh\nnpx -y github:dragoscirjan/ai#main\n```"],
])
  test(`portable packages reject ${label}`, (t) => {
    const f = fixture(t);
    assert.throws(
      () => verifyMarkdownIndependence(body, f.entry, f.plan, "README.md"),
      /Collection guidance/,
    );
  });
for (const body of [
  "Use this skill for the task. Follow project coding standards and inspect research findings.",
  "Use coding standards from the project. Review the existing scaffold as input.",
  "Invoke the Excalidraw CLI with the `@excalidraw/cli` package and a `.excalidraw` file.",
  "[Runtime docs](https://docs.excalidraw.com/docs/codebase) and [Own instructions](SKILL.md).",
  "The local [code-review.js](scripts/code-review.js) module is a same-package file, not another skill.",
  "The harness syntax is `/skill:name`. Example: `/skill:coding`.",
  "A task may specify its own scope. No initiative document is needed as input.",
])
  test(`ordinary technical wording is not a skill dependency: ${body.slice(0, 35)}`, (t) => {
    const f = fixture(t);
    verifyMarkdownIndependence(body, f.entry, f.plan, "notes.md");
  });
test("frontmatter compatibility cannot hide a skill invocation", (t) => {
  const f = fixture(t);
  assert.throws(
    () =>
      verifyMarkdownIndependence(
        "---\nname: coding\ndescription: Fixture skill.\ncompatibility: Load scaffold skill before continuing.\n---\n# Fixture\n",
        f.entry,
        f.plan,
        "SKILL.md",
      ),
    /Undeclared skill reference/,
  );
});
test("declared dependencies are permitted in names, instruction links, and install examples", (t) => {
  const f = fixture(t, "coding-with-rules");
  verifyMarkdownIndependence(
    "Load `coding`. [Base](../coding/SKILL.md)\n\n```sh\nnpx -y skills@1.7.4 add source --skill coding\n```",
    f.entry,
    f.plan,
    "usage.md",
  );
});
test("source category names do not create a coding dependency", (t) => {
  const f = fixture(t, "init-project");
  verifyMarkdownIndependence(
    "[Own source](https://github.com/dragoscirjan/ai/tree/main/.agents/skills/coding/init-project)\n\n```sh\nnpx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/coding/init-project --skill init-project\n```",
    f.entry,
    f.plan,
    "usage.md",
  );
});
test("self upstream provenance does not become an external prerequisite", (t) => {
  const f = fixture(t, "code-review");
  verifyMarkdownIndependence(
    "[Pinned source](https://github.com/mattpocock/skills/tree/59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/code-review)",
    f.entry,
    f.plan,
    "README.md",
  );
});
test("individual profiles link only to self and declared skill requirements", (t) => {
  const f = fixture(t, "coding-with-rules");
  verifyMarkdownIndependence(
    "[Coding group](/groups/coding) [Base](/skills/coding#install-this-skill) [Self](/skills/coding-with-rules)",
    f.entry,
    f.plan,
    "profile.md",
    { profile: true },
  );
  assert.throws(
    () =>
      verifyMarkdownIndependence("[Optional](/skills/code-review)", f.entry, f.plan, "profile.md", {
        profile: true,
      }),
    /Undeclared skill reference/,
  );
});
test("helper imports may cross packages only through a declared dependency", (t) => {
  const f = fixture(t, "cleanup-workspaces"),
    root = join(f.target, "acquired");
  mkdirSync(join(root, "scripts"), { recursive: true });
  writeFileSync(
    join(root, "scripts/helper.ts"),
    'import { helper } from "../../isolated-workspace/scripts/lib.ts";\n',
  );
  verifySkillIndependence(root, f.entry, f.plan);
  writeFileSync(
    join(root, "scripts/helper.ts"),
    'import { helper } from "../../../coding/coding-with-rules/helper.mjs";\n',
  );
  assert.throws(() => verifySkillIndependence(root, f.entry, f.plan), /Undeclared skill reference/);
});
test("NUL-containing executable text is inspected, while binary data and legal bytes are preserved", (t) => {
  const f = fixture(t),
    root = join(f.target, "acquired");
  mkdirSync(root);
  const notice = "[Prior work](../code-review/SKILL.md)";
  writeFileSync(join(root, "LICENSE"), notice);
  const binary = Buffer.from([255, 0, 254]);
  writeFileSync(join(root, "image.bin"), binary);
  verifySkillIndependence(root, f.entry, f.plan);
  assert.equal(readFileSync(join(root, "LICENSE"), "utf8"), notice);
  assert.deepEqual(readFileSync(join(root, "image.bin")), binary);
  writeFileSync(
    join(root, "helper.mjs"),
    '//\u0000\nimport helper from "../coding-with-rules/helper.mjs";\n',
  );
  assert.throws(() => verifySkillIndependence(root, f.entry, f.plan), /Undeclared skill reference/);
});
test("invalid instruction text and symlinks stop validation", (t) => {
  const f = fixture(t),
    root = join(f.target, "acquired");
  mkdirSync(root);
  writeFileSync(join(root, "README.md"), Buffer.from([255]));
  assert.throws(() => verifySkillIndependence(root, f.entry, f.plan), /Invalid text encoding/);
  rmSync(join(root, "README.md"));
  symlinkSync(join(f.target, "private"), join(root, "outside.md"));
  assert.throws(() => verifySkillIndependence(root, f.entry, f.plan), /Symlink/);
});
for (const [label, body] of [
  ["Claude deployment", "# coding\n\nClaude Code uses `.claude/skills/coding`."],
  ["installation command", "# coding\n\n```sh\nnpx -y skills@1.7.4 add source --skill coding\n```"],
  ["usage section", "# coding\n\n## Usage\n\nDescribe the task to the agent."],
  ["workflow steps", "# coding\n\n1. Review the input.\n2. Make the change."],
  ["license reference", "# coding\n\nSee [LICENSE](LICENSE)."],
  ["encoded legal-file reference", "# coding\n\nSee [source](LICEN%53E)."],
  [
    "procedural attribution",
    "# coding\n\n## Origin\n\nInspired by [scaffold](../scaffold/SKILL.md). Use it before starting.",
  ],
])
  test(`overview rejects ${label}`, (t) => {
    const f = fixture(t);
    assert.throws(
      () => verifyMarkdownIndependence(body, f.entry, f.plan, "README.md"),
      /overview/i,
    );
  });
test("overview permits factual inspiration without adding a dependency", (t) => {
  const f = fixture(t);
  verifyMarkdownIndependence(
    "# coding\n\nDevelop code under project conventions.\n\n## Inspiration\n\nInspired by [scaffold](../scaffold/SKILL.md) and [an external source](https://example.com/skills/other-skill/SKILL.md).",
    f.entry,
    f.plan,
    "README.md",
  );
  assert.deepEqual(f.entry.prerequisites, []);
  assert.deepEqual(
    f.plan.entries.map((entry) => entry.name),
    ["coding"],
  );
});
test("factual attribution does not require a fixed heading template", (t) => {
  const f = fixture(t);
  verifyMarkdownIndependence(
    "# coding\n\nDevelop code.\n\nInspired by [scaffold](../scaffold/SKILL.md).",
    f.entry,
    f.plan,
    "README.md",
  );
});
test("attribution reference definitions cannot hide an operational reference", (t) => {
  const f = fixture(t);
  verifyMarkdownIndependence(
    "# coding\n\nDevelop code.\n\n## Origin\n\nInspired by [scaffold][origin].\n\n[origin]: ../scaffold/SKILL.md",
    f.entry,
    f.plan,
    "README.md",
  );
  assert.throws(
    () =>
      verifyMarkdownIndependence(
        "# coding\n\nLoad [scaffold][origin].\n\n## Origin\n\nInspired by [scaffold][origin].\n\n[origin]: ../scaffold/SKILL.md",
        f.entry,
        f.plan,
        "README.md",
      ),
    /Undeclared skill reference/,
  );
});
test("attribution permission does not leak into supporting documents or dependency sections", (t) => {
  const f = fixture(t),
    body = "## Origin\n\nInspired by [scaffold](../scaffold/SKILL.md).";
  assert.throws(
    () => verifyMarkdownIndependence(body, f.entry, f.plan, "references.md"),
    /Undeclared skill reference/,
  );
  assert.throws(
    () =>
      verifyMarkdownIndependence(
        "## Dependencies\n\n[scaffold](../scaffold/SKILL.md)",
        f.entry,
        f.plan,
        "README.md",
      ),
    /Undeclared skill reference/,
  );
});
test("overview rule leaves nested technical READMEs unchanged", (t) => {
  const f = fixture(t);
  verifyMarkdownIndependence(
    "# Renderer\n\n## Usage\n\n```js\nrender(scene);\n```",
    f.entry,
    f.plan,
    "renderers/README.md",
  );
});
test("all 23 local packages are independent with exactly the six approved requirement edges", (t) => {
  const f = fixture(t),
    plan = buildPlan(
      { target: f.target, categories: Object.keys(catalog.groups), agents: ["pi"] },
      catalog,
    );
  assert.deepEqual(
    catalog.skills
      .filter((entry) => entry.prerequisites.length)
      .map((entry) => [entry.name, entry.prerequisites])
      .sort((a, b) => a[0].localeCompare(b[0])),
    [
      ["cleanup-workspaces", ["isolated-workspace"]],
      ["coding-with-rules", ["coding"]],
      ["grill-me", ["grilling"]],
      ["initiative", ["grilling"]],
      ["research", ["grilling"]],
      ["specify", ["grilling"]],
    ],
  );
  const local = plan.entries.filter((entry) => entry.source.type === "local");
  assert.equal(local.length, 23);
  for (const entry of local)
    verifySkillIndependence(join(PACKAGE_ROOT, entry.source.path), entry, plan);
});
