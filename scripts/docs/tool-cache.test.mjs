import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { catalog, root } from "./data.mjs";
import { hash } from "./verify.mjs";
import { setupTool, verifiedTool } from "./archify-tool.mjs";

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

function downloadFixture(t) {
  const directory = mkdtempSync(join(tmpdir(), "ai-skills-download-test-"));
  const previous = process.env.XDG_CACHE_HOME;
  process.env.XDG_CACHE_HOME = directory;
  t.after(() => {
    if (previous === undefined) delete process.env.XDG_CACHE_HOME;
    else process.env.XDG_CACHE_HOME = previous;
    rmSync(directory, { recursive: true, force: true });
  });
  const entry = catalog().byName.get("archify");
  const files = new Map([
    [entry.source.path + "/SKILL.md", "---\nname: archify\ndescription: Fixture.\n---\n"],
    [entry.source.path + "/bin/archify.mjs", "throw new Error('must never run during setup');\n"],
    [entry.source.path + "/agents/openai.yaml", "excluded: true\n"],
  ]);
  for (const legal of entry.legal) files.set(legal.path, "Fixture notice: " + legal.spdx + "\n");
  const tree = {
    truncated: false,
    tree: [...files].map(([path, text]) => ({
      path,
      type: "blob",
      mode: "100644",
      sha: createHash("sha1")
        .update("blob " + Buffer.byteLength(text) + "\0")
        .update(text)
        .digest("hex"),
    })),
  };
  const requests = [];
  const fetcher = async (url) => {
    requests.push(url);
    const text = url.startsWith("https://api.github.com/")
      ? JSON.stringify(tree)
      : files.get(decodeURIComponent(url.split("/" + entry.source.revision + "/")[1]));
    assert.notEqual(text, undefined, url);
    const bytes = Buffer.from(text);
    return { ok: true, status: 200, arrayBuffer: async () => Uint8Array.from(bytes).buffer };
  };
  return { directory, entry, files, tree, fetcher, requests };
}

test("renderer setup copies only pinned filtered files and notices without executing code", async (t) => {
  const f = downloadFixture(t);
  const location = await setupTool({ fetcher: f.fetcher });
  assert.ok(existsSync(join(location.directory, "bin/archify.mjs")));
  assert.ok(!existsSync(join(location.directory, "agents/openai.yaml")));
  for (const legal of f.entry.legal) assert.ok(existsSync(join(location.directory, legal.target)));
  assert.ok(f.requests.every((url) => url.includes(f.entry.source.revision)));
  assert.equal(verifiedTool().directory, location.directory);
});

test("renderer setup rejects truncated trees, path escapes, and linked source files", async (t) => {
  const f = downloadFixture(t);
  f.tree.truncated = true;
  await assert.rejects(() => setupTool({ fetcher: f.fetcher }), /Incomplete/);
  f.tree.truncated = false;
  const source = f.tree.tree.find((file) => file.path.endsWith("/SKILL.md"));
  source.mode = "120000";
  await assert.rejects(() => setupTool({ fetcher: f.fetcher }), /Linked/);
  source.mode = "100644";
  source.path = f.entry.source.path + "/../escape";
  await assert.rejects(() => setupTool({ fetcher: f.fetcher }), /Unsafe/);
});

test("renderer setup rejects downloaded bytes that disagree with the pinned tree", async (t) => {
  const f = downloadFixture(t);
  f.files.set(f.entry.source.path + "/SKILL.md", "tampered\n");
  await assert.rejects(() => setupTool({ fetcher: f.fetcher }), /digest mismatch/);
});
