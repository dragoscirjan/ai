import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "bun:test";

const script = join(dirname(fileURLToPath(import.meta.url)), "init.mjs");

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "init-project-test-"));
  execFileSync("git", ["init", "-q"], { cwd: root });
  return root;
}

function run(root, extra = []) {
  return spawnSync(
    process.execPath,
    [script, "--root", root, "--node", "24", "--pnpm", "10.33.0", ...extra],
    { encoding: "utf8" },
  );
}

test("help documents safeguards and exit codes", () => {
  assert.equal(typeof Bun.TOML.parse, "function");
  const result = spawnSync(process.execPath, [script, "--help"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /--apply --confirm/);
  assert.match(result.stdout, /Exit codes:/);
});

test("the executable hard-stops when Bun is unavailable", () => {
  const result = spawnSync(script, ["--help"], {
    encoding: "utf8",
    env: { ...process.env, PATH: "/bun-is-intentionally-unavailable" },
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /bun/i);
});

test("Bun TOML parsing accepts equivalent existing values", () => {
  const root = fixture();
  try {
    writeFileSync(
      join(root, "mise.toml"),
      "[settings]\nlockfile = true # preserve comment\n\n[tools]\nnode = '24'\npnpm = '10.33.0'\n",
    );
    const plan = run(root);
    assert.equal(plan.status, 0, plan.stderr);
    assert.equal(readFileSync(join(root, "mise.toml"), "utf8").includes("preserve comment"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("invalid TOML stops before mutation", () => {
  const root = fixture();
  try {
    const misePath = join(root, "mise.toml");
    writeFileSync(misePath, "[tools\nnode = '24'\n");
    const before = readFileSync(misePath, "utf8");
    const result = run(root, ["--apply", "--confirm"]);
    assert.equal(result.status, 3);
    assert.match(result.stderr, /Invalid TOML document/);
    assert.equal(readFileSync(misePath, "utf8"), before);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Node versions below 24 are rejected", () => {
  const root = fixture();
  try {
    const result = spawnSync(
      process.execPath,
      [script, "--root", root, "--node", "22.13.0", "--pnpm", "10.33.0"],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 2);
    assert.match(result.stderr, /Node 24 or newer/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("plan is non-mutating and apply is idempotent", () => {
  const root = fixture();
  try {
    const plan = run(root);
    assert.equal(plan.status, 0, plan.stderr);
    const planData = JSON.parse(plan.stdout);
    assert.equal(planData.mode, "plan");
    assert.equal(planData.selected.node, "24");
    assert.equal(planData.devDependencies.husky, "9.1.7");
    assert.match(planData.hooks["pre-commit"], /mise run format/);
    assert.equal(existsSync(join(root, "mise.toml")), false);

    const unconfirmed = run(root, ["--apply"]);
    assert.equal(unconfirmed.status, 2);
    assert.equal(existsSync(join(root, "mise.toml")), false);

    const first = run(root, ["--apply", "--confirm"]);
    assert.equal(first.status, 0, first.stderr);
    assert.equal(JSON.parse(first.stdout).mode, "apply");
    assert.equal(existsSync(join(root, "package.json")), true);
    assert.match(readFileSync(join(root, "mise.toml"), "utf8"), /deps:sync:pnpm/);
    assert.notEqual(statSync(join(root, ".husky", "pre-commit")).mode & 0o111, 0);

    const before = readFileSync(join(root, "mise.toml"), "utf8");
    const second = run(root, ["--apply", "--confirm"]);
    assert.equal(second.status, 0, second.stderr);
    assert.equal(readFileSync(join(root, "mise.toml"), "utf8"), before);
    assert.ok(JSON.parse(second.stdout).operations.every((operation) => operation.action === "unchanged"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("conflicting scripts stop before any file is changed", () => {
  const root = fixture();
  try {
    assert.equal(run(root, ["--apply", "--confirm"]).status, 0);
    const manifestPath = join(root, "package.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.scripts.lint = "custom-lint";
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const miseBefore = readFileSync(join(root, "mise.toml"), "utf8");

    const result = run(root, ["--apply", "--confirm"]);
    assert.equal(result.status, 3);
    assert.match(result.stderr, /Conflict at package\.json\.scripts\.lint/);
    assert.equal(readFileSync(join(root, "mise.toml"), "utf8"), miseBefore);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
