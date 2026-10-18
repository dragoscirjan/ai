import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const scripts = dirname(fileURLToPath(import.meta.url));
const script = join(scripts, "init.mjs");
const projectScript = resolve(scripts, "../../init-project/scripts/init.mjs");

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "init-typescript-test-"));
  execFileSync("git", ["init", "-q"], { cwd: root });
  const result = spawnSync(
    process.execPath,
    [projectScript, "--root", root, "--node", "24", "--pnpm", "10.33.0", "--apply", "--confirm"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  return root;
}

function run(root, extra = []) {
  return spawnSync(
    process.execPath,
    [
      script,
      "--root",
      root,
      "--runtime",
      "node",
      "--module",
      "esm",
      "--kind",
      "app",
      "--node-types",
      "24.19.2",
      ...extra,
    ],
    { encoding: "utf8" },
  );
}

test("plan is non-mutating and apply requires confirmation", () => {
  const root = fixture();
  try {
    const plan = run(root);
    assert.equal(plan.status, 0, plan.stderr);
    const planData = JSON.parse(plan.stdout);
    assert.equal(planData.selected.runtime, "node");
    assert.equal(planData.devDependencies.vitest, "4.1.11");
    assert.equal(planData.scripts.typecheck, "tsc --noEmit");
    assert.equal(existsSync(join(root, "tsconfig.json")), false);

    const unconfirmed = run(root, ["--apply"]);
    assert.equal(unconfirmed.status, 2);
    assert.equal(existsSync(join(root, "tsconfig.json")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("apply is idempotent and registers TypeScript tasks", () => {
  const root = fixture();
  try {
    const first = run(root, ["--apply", "--confirm"]);
    assert.equal(first.status, 0, first.stderr);
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    assert.equal(manifest.devDependencies.typescript, "5.9.3");
    assert.equal(manifest.scripts.typecheck, "tsc --noEmit");
    const mise = readFileSync(join(root, "mise.toml"), "utf8");
    assert.match(mise, /tasks\."typecheck:typescript"/);
    assert.match(mise, /"typecheck", "test", "build"/);

    const second = run(root, ["--apply", "--confirm"]);
    assert.equal(second.status, 0, second.stderr);
    assert.ok(JSON.parse(second.stdout).operations.every((operation) => operation.action === "unchanged"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("existing compiler configuration is never overwritten", () => {
  const root = fixture();
  try {
    writeFileSync(join(root, "tsconfig.json"), '{"compilerOptions":{"strict":false}}\n');
    const packageBefore = readFileSync(join(root, "package.json"), "utf8");
    const result = run(root, ["--apply", "--confirm"]);
    assert.equal(result.status, 3);
    assert.match(result.stderr, /tsconfig\.json differs/);
    assert.equal(readFileSync(join(root, "package.json"), "utf8"), packageBefore);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
