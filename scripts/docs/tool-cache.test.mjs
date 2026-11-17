import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { catalog, root } from "./data.mjs";
import { hash } from "./verify.mjs";

function cacheFixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "ai-skills-cache-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const home = join(directory, "physical");
  const base = join(home, "ai-skills-docs");
  const entry = catalog().byName.get("archify");
  const packagePath = join(base, `archify-${entry.source.revision}`);
  mkdirSync(packagePath, { recursive: true });
  const bytes = "public cache-boundary fixture\n";
  writeFileSync(join(packagePath, "SKILL.md"), bytes);
  writeFileSync(
    join(base, `archify-${entry.source.revision}.json`),
    JSON.stringify({
      repository: entry.source.repository,
      revision: entry.source.revision,
      files: { "SKILL.md": hash(bytes) },
    }),
  );
  return { directory, home };
}
function reuse(method, home) {
  return spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `import {${method}} from './scripts/docs/archify-tool.mjs'; await ${method}();`,
    ],
    { cwd: root, env: { ...process.env, XDG_CACHE_HOME: home }, encoding: "utf8", timeout: 10000 },
  );
}
test("an ordinary external cache can be reused without setup or downloads", (t) => {
  const fixture = cacheFixture(t);
  for (const method of ["verifiedTool", "setupTool"]) {
    const result = reuse(method, fixture.home);
    assert.equal(result.status, 0, result.stderr);
  }
});
test("cache reuse and repeated setup reject a symlinked ancestor", (t) => {
  const fixture = cacheFixture(t);
  const alias = join(fixture.directory, "alias");
  symlinkSync(fixture.home, alias, "dir");
  for (const method of ["verifiedTool", "setupTool"]) {
    const result = reuse(method, alias);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /symlinked ancestors/);
  }
});
