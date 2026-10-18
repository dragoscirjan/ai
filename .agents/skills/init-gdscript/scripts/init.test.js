import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "bun:test";

const scripts = dirname(fileURLToPath(import.meta.url));
const script = join(scripts, "init.mjs");
const projectScript = resolve(scripts, "../../init-project/scripts/init.mjs");

function fixture({ godot = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "init-gdscript-test-"));
  execFileSync("git", ["init", "-q"], { cwd: root });
  const result = spawnSync(
    process.execPath,
    [projectScript, "--root", root, "--node", "24", "--pnpm", "10.33.0", "--apply", "--confirm"],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
  if (godot) writeFileSync(join(root, "project.godot"), '[application]\nconfig/name="Fixture"\n');
  return root;
}

function run(root, extra = []) {
  return spawnSync(
    process.execPath,
    [
      script,
      "--root",
      root,
      "--godot",
      "4.7.2-stable",
      "--python",
      "3.13.13",
      "--uv",
      "0.11.25",
      "--source",
      "game",
      ...extra,
    ],
    { encoding: "utf8" },
  );
}

test("plan is non-mutating and rejects a non-Godot root", () => {
  const invalidRoot = fixture({ godot: false });
  try {
    const invalid = run(invalidRoot);
    assert.equal(invalid.status, 4);
    assert.match(invalid.stderr, /project\.godot is missing/);
  } finally {
    rmSync(invalidRoot, { recursive: true, force: true });
  }

  const root = fixture();
  try {
    const plan = run(root);
    assert.equal(plan.status, 0, plan.stderr);
    const planData = JSON.parse(plan.stdout);
    assert.equal(planData.selected.godot, "4.7.2-stable");
    assert.deepEqual(planData.pythonDependencies.dev, ["gdtoolkit==4.5.0"]);
    assert.match(planData.scripts["typecheck:gdscript"], /check-gdscript/);
    const plannedFiles = Object.fromEntries(planData.files.map((file) => [file.path, file.content]));
    assert.match(plannedFiles["scripts/check-gdscript.mjs"], /skippedDirectories/);
    assert.match(plannedFiles["scripts/check-gdscript.mjs"], /'node_modules'/);
    assert.match(plannedFiles["scripts/check-gdscript.mjs"], /collect\(sourceReal\)/);
    assert.equal(existsSync(join(root, "pyproject.toml")), false);
    const unconfirmed = run(root, ["--apply"]);
    assert.equal(unconfirmed.status, 2);
    assert.equal(existsSync(join(root, "pyproject.toml")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("apply is idempotent and synchronizes locked uv dependencies", () => {
  const root = fixture();
  try {
    const first = run(root, ["--apply", "--confirm"]);
    assert.equal(first.status, 0, first.stderr);
    assert.match(readFileSync(join(root, "pyproject.toml"), "utf8"), /gdtoolkit==4\.5\.0/);
    const mise = readFileSync(join(root, "mise.toml"), "utf8");
    assert.match(mise, /tasks\."deps:sync:gdscript"/);
    assert.match(mise, /uv sync --locked/);
    assert.match(mise, /"deps:sync:gdscript"/);
    const checkScript = join(root, "scripts", "check-gdscript.mjs");
    assert.match(readFileSync(checkScript, "utf8"), /--check-only/);
    assert.notEqual(statSync(checkScript).mode & 0o111, 0);

    const second = run(root, ["--apply", "--confirm"]);
    assert.equal(second.status, 0, second.stderr);
    assert.ok(JSON.parse(second.stdout).operations.every((operation) => operation.action === "unchanged"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("conflicting Godot versions stop before writes", () => {
  const root = fixture();
  try {
    assert.equal(run(root, ["--apply", "--confirm"]).status, 0);
    const packageBefore = readFileSync(join(root, "package.json"), "utf8");
    const result = spawnSync(
      process.execPath,
      [
        script,
        "--root",
        root,
        "--godot",
        "4.6.3-stable",
        "--python",
        "3.13.13",
        "--uv",
        "0.11.25",
        "--source",
        "game",
        "--apply",
        "--confirm",
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 3);
    assert.match(result.stderr, /Conflict at tools\.godot/);
    assert.equal(readFileSync(join(root, "package.json"), "utf8"), packageBefore);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
