import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parse, stringify } from "yaml";
import {
  CATALOG_PATH,
  PACKAGE_ROOT,
  closure,
  frontmatter,
  loadCatalog,
  parseYaml,
  safeRelative,
} from "./catalog.mjs";

function changed(t, mutate) {
  const directory = mkdtempSync(join(tmpdir(), "skill-catalog-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const data = parse(readFileSync(CATALOG_PATH, "utf8"));
  mutate(data);
  const path = join(directory, "catalog.yaml");
  writeFileSync(path, stringify(data));
  return path;
}
test("catalog covers every tracked/local skill and six shared groups", () => {
  const c = loadCatalog(CATALOG_PATH, PACKAGE_ROOT);
  assert.equal(c.skills.length, 28);
  assert.equal(Object.keys(c.groups).length, 6);
  assert.equal(c.byName.has("sync-my-skills"), false);
  assert.equal(c.byName.get("sync-my-agents").scope, "personal");
  assert.deepEqual(c.byName.get("sync-my-agents").prerequisites, []);
  assert.deepEqual(closure(["coding-with-rules"], c), ["coding", "coding-with-rules"]);
});
for (const [label, text] of [
  ["duplicates", "key: 1\nkey: 2"],
  ["aliases", "one: &a [1]\ntwo: *a"],
  ["tags", "key: !unknown value"],
  ["merge", "key: {<<: {other: 1}}"],
  ["unsafe keys", '"__proto__": value'],
])
  test(`YAML rejects ${label}`, () => assert.throws(() => parseYaml(text)));
test("instruction maintenance remains user-only with no skill prerequisites", () => {
  const text = readFileSync(
    join(PACKAGE_ROOT, ".agents/skills/agentic-work/sync-my-agents/SKILL.md"),
    "utf8",
  );
  const meta = frontmatter(text, "sync-my-agents");
  assert.equal(meta["disable-model-invocation"], true);
  assert.equal(meta.requires, undefined);
  assert.match(text, /Dependencies in this workflow are instruction documents/);
  assert.match(text, /Do not install skills or resolve their installation prerequisites/);
  assert.match(text, /Show every affected path and its exact diff/);
  assert.match(text, /Obtain explicit approval/);
  assert.match(text, /Do not impose a fixed document bundle/);
});
test("YAML size and nesting are bounded", () => {
  assert.throws(() => parseYaml("x".repeat(1024 * 1024 + 1)), /size/);
  assert.throws(() => parseYaml("[".repeat(45) + "0" + "]".repeat(45)), /nested/);
});
for (const path of [
  "../secret",
  "/absolute",
  "C:/private",
  "foo\\bar",
  "one//two",
  "./one",
  "one/../two",
  "a\nfile",
])
  test(`relative paths reject ${JSON.stringify(path)}`, () =>
    assert.throws(() => safeRelative(path)));
for (const [label, mutate] of [
  [
    "schema",
    (c) => {
      c.schemaVersion = 99;
    },
  ],
  [
    "unknown field",
    (c) => {
      c.installEverything = true;
    },
  ],
  [
    "credential URL",
    (c) => {
      c.repository = "https://token@github.com/owner/repo";
    },
  ],
  [
    "unpinned source",
    (c) => {
      c.skills.archify.source.revision = "main";
    },
  ],
  [
    "unsafe source",
    (c) => {
      c.skills.coding.source.path = "../../bad";
    },
  ],
  [
    "shell recipe",
    (c) => {
      c.skills.coding.install.argv[0] = "sh";
    },
  ],
  [
    "missing npx consent",
    (c) => {
      c.skills.coding.install.argv.splice(1, 1);
    },
  ],
  [
    "incorrect recipe source",
    (c) => {
      c.skills.coding.install.argv[4] = "https://github.com/elsewhere/other";
    },
  ],
  [
    "project global install",
    (c) => {
      c.skills.coding.install.argv.push("--global");
    },
  ],
  [
    "unknown prerequisite",
    (c) => {
      c.skills.coding.prerequisites = ["missing"];
    },
  ],
  [
    "dependency cycle",
    (c) => {
      c.skills.coding.prerequisites = ["coding-with-rules"];
    },
  ],
  [
    "group omission",
    (c) => {
      c.groups.coding.skills.pop();
    },
  ],
  [
    "duplicate group member",
    (c) => {
      c.groups.utility.skills.push("coding");
    },
  ],
  [
    "unknown group",
    (c) => {
      c.groups.another = c.groups.coding;
    },
  ],
  [
    "unknown group member",
    (c) => {
      c.groups.coding.skills.push("missing");
    },
  ],
  [
    "invalid replacement",
    (c) => {
      c.deprecations["sync-my-skills"].replacements = ["missing"];
    },
  ],
  [
    "removed bundle configuration",
    (c) => {
      c.instructionTemplates = { enabled: true };
    },
  ],
])
  test(`catalog rejects ${label}`, (t) => assert.throws(() => loadCatalog(changed(t, mutate))));
test("ambiguous source URLs and missing personal global scope are rejected", (t) => {
  assert.throws(
    () =>
      loadCatalog(
        changed(t, (c) => {
          c.skills.coding.source.path = "skill#other";
        }),
      ),
    /unambiguous/,
  );
  assert.throws(
    () =>
      loadCatalog(
        changed(t, (c) => {
          c.skills["sync-my-agents"].install.argv.pop();
        }),
      ),
    /catalogued source/,
  );
});
test("source coverage rejects undeclared frontmatter prerequisites", (t) => {
  const path = changed(t, (c) => {
    c.skills["coding-with-rules"].prerequisites = [];
  });
  assert.throws(() => loadCatalog(path, PACKAGE_ROOT), /declared prerequisite/);
});
for (const requires of [
  "requires: []",
  "requires: [coding]",
  "requires:\n  - coding",
  'require: ["coding"]',
])
  test(`frontmatter rejects ${JSON.stringify(requires)}`, () =>
    assert.throws(() =>
      frontmatter(`---\nname: example\ndescription: Example.\n${requires}\n---\n`, "example"),
    ));
test("frontmatter accepts one inline JSON requirement array", () => {
  assert.deepEqual(
    frontmatter('---\nname: example\ndescription: Example.\nrequires: ["coding"]\n---\n', "example")
      .requires,
    ["coding"],
  );
});
