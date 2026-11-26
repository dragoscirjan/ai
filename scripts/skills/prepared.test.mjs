import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { CATALOG_PATH, PACKAGE_ROOT, digest, loadCatalog } from "./catalog.mjs";
import { buildPlan } from "./install.mjs";

const catalog = loadCatalog(CATALOG_PATH, PACKAGE_ROOT);
const reviewed = {
  ".agents/skills/coding/code-review/SKILL.md":
    "1ba39478807f2a0bb73e93cfe7728b3dba2f36ea8aba9e57931ec20d970b853e",
  ".agents/skills/coding/tdd/SKILL.md":
    "fe3d44d8cc29830dc7d6aa4fd9896f3e5e4ff00756fdd4c7de087e260e015d7b",
  ".agents/skills/coding/tdd/mocking.md":
    "3ceb807fdf4a47d6a93d4d9a891e5ba6d362a6247bd08adc451feebfc17361ef",
  ".agents/skills/coding/tdd/tests.md":
    "859f9e592c188fda4fc7277dd180e4ce9c7a2e13f6efe1f6f29eccc9d28c106a",
};
for (const [path, sha] of Object.entries(reviewed))
  test(`prepared bytes match the approved source snapshot: ${path}`, () => {
    assert.equal(digest(readFileSync(join(PACKAGE_ROOT, path))), sha);
  });
test("every current catalogue entry has a concrete installable source, with no runtime semantic adaptation", () => {
  assert.equal(catalog.skills.filter((entry) => entry.source.type === "local").length, 22);
  assert.equal(catalog.skills.filter((entry) => entry.source.type !== "local").length, 6);
  assert.deepEqual(
    catalog.skills.filter((entry) => entry.kind === "adapted" && entry.source.type !== "local"),
    [],
  );
  assert.equal(
    catalog.skills.some((entry) => entry.include?.length),
    false,
  );
});
test("prepared variants preserve upstream provenance and both original and project licenses", () => {
  for (const name of ["code-review", "tdd"]) {
    const entry = catalog.byName.get(name),
      directory = join(PACKAGE_ROOT, entry.source.path);
    assert.equal(entry.kind, "adapted");
    assert.equal(entry.source.type, "local");
    assert.match(entry.upstream.revision, /^[a-f0-9]{40}$/);
    assert.equal(entry.upstream.repository, "https://github.com/mattpocock/skills");
    assert.equal(
      digest(readFileSync(join(directory, "LICENSE.upstream"))),
      "0e7ac423bf2c6e223b7c5b156f8cf72da49d748e56a1641402c31f22ad07dbb5",
    );
    assert.equal(
      readFileSync(join(directory, "LICENSE"), "utf8"),
      readFileSync(join(PACKAGE_ROOT, "LICENSE"), "utf8"),
    );
    assert.deepEqual(
      entry.legal.map((file) => file.target),
      ["LICENSE.upstream", "LICENSE"],
    );
    assert.equal(existsSync(join(directory, "agents/openai.yaml")), false);
    assert.ok(readFileSync(join(directory, "README.md"), "utf8").includes(entry.upstream.revision));
  }
});
test("grill-me uses unchanged pinned upstream input and retains grilling installation closure", () => {
  const entry = catalog.byName.get("grill-me");
  assert.equal(entry.kind, "upstream");
  assert.deepEqual(entry.source, {
    type: "github",
    repository: "https://github.com/mattpocock/skills",
    revision: "fcf0071560d32913c9d4f820e0d7ca467c881619",
    path: "skills/productivity/grill-me",
  });
  assert.equal(entry.upstream, undefined);
  assert.equal(entry.adaptation, undefined);
  assert.deepEqual(entry.prerequisites, ["grilling"]);
  assert.deepEqual(entry.legal, [{ path: "LICENSE", target: "LICENSE", spdx: "MIT" }]);
  assert.ok(
    entry.runtime.some((item) => item.includes("Skill tool") && item.includes("unverified")),
  );
  assert.equal(existsSync(join(PACKAGE_ROOT, ".agents/skills/productivity/grill-me")), false);
});
test("tdd is self-contained and preserves its test and mocking references", () => {
  const entry = catalog.byName.get("tdd"),
    text = readFileSync(join(PACKAGE_ROOT, entry.source.path, "SKILL.md"), "utf8");
  assert.doesNotMatch(text, /codebase-design|Skill tool/);
  assert.match(text, /A module groups code around one responsibility/);
  assert.match(text, /Red before green/);
  assert.match(text, /Refactoring is not part of the loop/);
  assert.match(text, /\[tests\.md\]\(tests\.md\)/);
  assert.match(text, /\[mocking\.md\]\(mocking\.md\)/);
});
test("code-review preserves read-only reviewers and immutable safe Git endpoints without forced setup", () => {
  const entry = catalog.byName.get("code-review"),
    text = readFileSync(join(PACKAGE_ROOT, entry.source.path, "SKILL.md"), "utf8");
  assert.match(text, /Reviewers are read-only/);
  assert.match(text, /fresh contexts/);
  assert.match(
    text,
    /Neither reviewer may edit files, change Git state, install tools, commit, publish, or delegate further/,
  );
  assert.match(text, /--verify --end-of-options/);
  assert.match(text, /immutable IDs/);
  assert.doesNotMatch(text, /setup-matt-pocock-skills/);
});
test("writing-for-agents remains an unchanged pinned upstream source with no adaptation step", () => {
  const entry = catalog.byName.get("writing-for-agents");
  assert.equal(entry.kind, "upstream");
  assert.equal(entry.source.type, "github");
  assert.equal(entry.source.revision, "5863806dd4e15c63174bee4e7515a4256792ecfa");
  assert.equal(entry.adaptation, undefined);
});
test("selecting all categories no longer rejects reviewed sources, while overwrite protection remains", (t) => {
  const target = mkdtempSync(join(tmpdir(), "prepared-plan-"));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  const options = { target, categories: Object.keys(catalog.groups), agents: ["pi"] };
  const fresh = buildPlan(options, catalog);
  assert.deepEqual(fresh.blocked, []);
  for (const entry of fresh.entries) mkdirSync(entry.destinations[0], { recursive: true });
  assert.equal(buildPlan(options, catalog).blocked.length, fresh.entries.length);
  assert.deepEqual(buildPlan({ ...options, overwrite: true }, catalog).blocked, []);
});
test("prepared-source previews run without any model-provider API credentials", (t) => {
  const target = mkdtempSync(join(tmpdir(), "prepared-no-model-"));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([name]) => !/API_KEY|ANTHROPIC_AUTH_TOKEN|CLAUDE_CODE_OAUTH_TOKEN/i.test(name),
    ),
  );
  const result = spawnSync(
    process.execPath,
    [
      join(PACKAGE_ROOT, "scripts/skills/sync.mjs"),
      "--target",
      target,
      "--category",
      "coding,agentic-work,productivity",
      "--agent",
      "pi",
      "--overwrite",
      "--dry-run",
      "--json",
    ],
    { env, encoding: "utf8", timeout: 10000 },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).blocked, []);
  assert.equal(existsSync(join(target, ".agents")), false);
});
