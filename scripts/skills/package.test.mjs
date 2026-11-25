import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  statSync,
  symlinkSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { PACKAGE_ROOT } from "./catalog.mjs";

function copyProductionDependencies(packageRoot) {
  const copied = new Map();
  function copy(fromManifest, name, parentDestination) {
    const lookup = createRequire(fromManifest);
    const manifest = lookup.resolve
      .paths(name)
      .map((folder) => join(folder, name, "package.json"))
      .find(existsSync);
    assert.ok(manifest, `Missing already-installed production dependency: ${name}`);
    const source = dirname(realpathSync(manifest));
    if (copied.get(name) === source) return;
    const destination = join(
      copied.has(name) ? parentDestination : packageRoot,
      "node_modules",
      name,
    );
    copied.set(name, source);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination, { recursive: true });
    const metadata = JSON.parse(readFileSync(join(source, "package.json"), "utf8"));
    for (const dependency of Object.keys(metadata.dependencies ?? {}))
      copy(join(source, "package.json"), dependency, destination);
  }
  const manifest = join(PACKAGE_ROOT, "package.json");
  for (const name of Object.keys(JSON.parse(readFileSync(manifest, "utf8")).dependencies))
    copy(manifest, name, packageRoot);
  assert.equal(existsSync(join(packageRoot, "node_modules/vitepress")), false);
  assert.equal(existsSync(join(packageRoot, "node_modules/eslint")), false);
}
test("GitHub package has exactly one executable and pinned production dependencies", () => {
  const manifest = JSON.parse(readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8"));
  assert.deepEqual(manifest.bin, { "sync-skills": "scripts/skills/sync.mjs" });
  assert.equal(manifest.private, true);
  assert.deepEqual(manifest.dependencies, { "@inquirer/prompts": "8.8.1", yaml: "2.9.1" });
  assert.equal(manifest.scripts.prepare, undefined);
  assert.ok(statSync(join(PACKAGE_ROOT, manifest.bin["sync-skills"])).mode & 0o111);
});
test("packed runtime executes its bin outside the checkout without development dependencies", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "skill-pack-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const packed = spawnSync(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", directory],
    { cwd: PACKAGE_ROOT, encoding: "utf8", timeout: 30000 },
  );
  assert.equal(packed.status, 0, packed.stderr);
  const record = JSON.parse(packed.stdout)[0],
    files = record.files.map((file) => file.path);
  assert.ok(files.includes("scripts/skills/sync.mjs"));
  assert.ok(files.includes("catalog/skill-catalog.yaml"));
  assert.ok(files.includes("LICENSE"));
  assert.ok(
    files.every(
      (path) =>
        !path.startsWith("docs/") &&
        !path.endsWith(".test.mjs") &&
        !path.includes("sync-my-skills/"),
    ),
  );
  const extracted = spawnSync("tar", ["-xzf", join(directory, record.filename), "-C", directory], {
    encoding: "utf8",
    timeout: 10000,
  });
  assert.equal(extracted.status, 0, extracted.stderr);
  const packageRoot = join(directory, "package");
  // Copy only the already-installed production closure; never download packages in tests.
  copyProductionDependencies(packageRoot);
  const bin = join(directory, "sync-skills");
  symlinkSync(join(packageRoot, "scripts/skills/sync.mjs"), bin);
  const result = spawnSync(bin, ["list", "--json"], {
    cwd: directory,
    encoding: "utf8",
    timeout: 10000,
  });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).skills.length, 28);
  const npx = spawnSync(
    "npx",
    ["-y", "--offline", "--cache", join(directory, "npm-cache"), packageRoot, "list", "--json"],
    { cwd: directory, encoding: "utf8", timeout: 30000 },
  );
  assert.equal(npx.status, 0, npx.stderr);
  assert.equal(JSON.parse(npx.stdout).skills.length, 28);
  const preview = spawnSync(
    bin,
    ["--skill", "coding-with-rules", "--agent", "pi", "--target", directory, "--dry-run", "--json"],
    { cwd: directory, encoding: "utf8", timeout: 10000 },
  );
  assert.equal(preview.status, 0, preview.stderr);
  assert.deepEqual(
    JSON.parse(preview.stdout).entries.map((entry) => entry.name),
    ["coding", "coding-with-rules"],
  );
});
