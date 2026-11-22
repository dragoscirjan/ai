import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, copyFileSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./install-dev-skills.sh", import.meta.url));
const names = ["grilling", "unslop", "writing-for-agents", "code-review", "grill-me", "systematic-debugging", "tdd"];

function fixture(t, { parser = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), "repo skills "));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const manager = join(root, ".agents/skills/agentic-work/sync-my-skills");
  const bin = join(root, "bin");
  const log = join(root, "commands.jsonl");
  const catalog = join(root, "catalog.json");
  const installedScript = join(root, "scripts/install-dev-skills.sh");
  const put = (path, text) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  };
  mkdirSync(dirname(installedScript), { recursive: true });
  copyFileSync(script, installedScript);
  if (parser) put(join(manager, "node_modules/yaml/package.json"), "{}");
  const skills = names.map((name) => ({
    name,
    source: { type: "github", repository: "https://github.com/example/skills", revision: "a".repeat(40), path: `skills/${name}` },
  }));
  const saveCatalog = () => put(catalog, JSON.stringify({ skills }));
  saveCatalog();
  put(join(bin, "node"), `#!/usr/bin/env bash
set -euo pipefail
if [[ \${1:-} == "$FAKE_MANAGER" ]]; then
  if [[ \${FAIL_CATALOG:-} == 1 ]]; then exit 6; fi
  exec "$REAL_NODE" -e 'process.stdout.write(require("node:fs").readFileSync(process.env.FAKE_CATALOG))'
fi
exec "$REAL_NODE" "$@"
`);
  put(join(bin, "npm"), `#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
fs.appendFileSync(process.env.COMMAND_LOG, JSON.stringify({ command: "npm", args: process.argv.slice(2), cwd: process.cwd() }) + "\\n");
if (process.env.FAIL_NPM === "1") process.exit(7);
const output = path.join(process.argv[3], "node_modules/yaml");
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, "package.json"), "{}");
`);
  put(join(bin, "npx"), `#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const args = process.argv.slice(2);
fs.appendFileSync(process.env.COMMAND_LOG, JSON.stringify({ command: "npx", args, cwd: process.cwd() }) + "\\n");
if (process.env.FAIL_NPX === "1") process.exit(8);
if (process.env.NO_OUTPUT === "1") process.exit(0);
const name = args[args.indexOf("--skill") + 1];
const output = path.join(process.cwd(), ".agents/skills", name);
fs.mkdirSync(path.join(output, "agents"), { recursive: true });
fs.writeFileSync(path.join(output, "SKILL.md"), "installed " + name);
fs.writeFileSync(path.join(output, "agents/openai.yaml"), "provider metadata");
`);
  for (const name of ["node", "npm", "npx"]) chmodSync(join(bin, name), 0o755);
  const run = (args = [], extra = {}) => spawnSync("bash", [installedScript, ...args], {
    cwd: tmpdir(), encoding: "utf8", env: {
      ...process.env, PATH: `${bin}:${process.env.PATH}`, REAL_NODE: process.execPath,
      FAKE_MANAGER: join(manager, "scripts/sync-my-skills.mjs"), FAKE_CATALOG: catalog,
      COMMAND_LOG: log, ...extra,
    },
  });
  const commands = () => existsSync(log)
    ? readFileSync(log, "utf8").trim().split("\n").filter(Boolean).map((line) => JSON.parse(line)) : [];
  return { root, manager, put, run, commands, skills, saveCatalog };
}

test("installs seven pinned skills in this checkout without global flags", (t) => {
  const f = fixture(t);
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Run \/reload in Pi/);
  const commands = f.commands();
  assert.equal(commands.length, 7);
  for (const [i, command] of commands.entries()) {
    assert.equal(command.cwd, f.root);
    assert.deepEqual(command.args, ["-y", "skills@1.7.4", "add",
      `https://github.com/example/skills/tree/${"a".repeat(40)}/skills/${names[i]}`,
      "--skill", names[i], "--agent", "pi", "--yes"]);
    assert.equal(existsSync(join(f.root, ".agents/skills", names[i], "agents/openai.yaml")), false);
  }
});

test("reruns preserve existing local skills without reinstalling", (t) => {
  const f = fixture(t);
  assert.equal(f.run().status, 0);
  const path = join(f.root, ".agents/skills/tdd/SKILL.md");
  writeFileSync(path, "local edits");
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.commands().length, 7);
  assert.equal(readFileSync(path, "utf8"), "local edits");
});

test("preserves a categorized adaptation and uses upstream provenance", (t) => {
  const f = fixture(t);
  const entry = f.skills.find((skill) => skill.name === "code-review");
  entry.upstream = { ...entry.source, repository: "https://github.com/other/skills" };
  entry.source = { type: "local", path: ".agents/skills/coding/code-review" };
  f.saveCatalog();
  const path = join(f.root, entry.source.path, "SKILL.md");
  f.put(path, "adapted instructions");
  assert.equal(f.run().status, 0);
  assert.equal(f.commands().length, 6);
  assert.equal(readFileSync(path, "utf8"), "adapted instructions");
  assert.equal(existsSync(join(f.root, ".agents/skills/code-review")), false);
  rmSync(path);
  assert.equal(f.run().status, 0);
  assert.equal(f.commands().at(-1).args[3],
    `https://github.com/other/skills/tree/${"a".repeat(40)}/skills/code-review`);
});

test("bootstraps the pinned parser with lifecycle scripts disabled", (t) => {
  const f = fixture(t, { parser: false });
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(f.commands()[0], {
    command: "npm", args: ["--prefix", f.manager, "ci", "--ignore-scripts"], cwd: f.root,
  });
});

test("a parser setup failure prevents skill installation", (t) => {
  const f = fixture(t, { parser: false });
  assert.equal(f.run([], { FAIL_NPM: "1" }).status, 7);
  assert.equal(f.commands().length, 1);
});

test("catalog failures and missing entries prevent any installation", (t) => {
  const f = fixture(t);
  assert.equal(f.run([], { FAIL_CATALOG: "1" }).status, 6);
  assert.equal(f.commands().length, 0);
  f.skills.pop();
  f.saveCatalog();
  const result = f.run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Required catalog entry is missing: tdd/);
  assert.equal(f.commands().length, 0);
});

test("rejects unpinned sources and path traversal before installing", (t) => {
  const f = fixture(t);
  f.skills[6].source.revision = "main";
  f.saveCatalog();
  assert.notEqual(f.run().status, 0);
  f.skills[6].source.revision = "a".repeat(40);
  f.skills[6].source.path = "../outside";
  f.saveCatalog();
  assert.notEqual(f.run().status, 0);
  assert.equal(f.commands().length, 0);
});

test("stops on installation failure or missing project-local output", (t) => {
  const f = fixture(t);
  assert.equal(f.run([], { FAIL_NPX: "1" }).status, 8);
  assert.equal(f.commands().length, 1);
  const result = f.run([], { NO_OUTPUT: "1" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Expected a project-local skill directory/);
});

test("rejects a symlinked skill root before installing dependencies", (t) => {
  const f = fixture(t, { parser: false });
  rmSync(join(f.root, ".agents"), { recursive: true, force: true });
  const elsewhere = join(f.root, "elsewhere");
  mkdirSync(elsewhere);
  symlinkSync(elsewhere, join(f.root, ".agents"), "dir");
  const result = f.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must not be symlinks/);
  assert.equal(f.commands().length, 0);
});

test("help and invalid arguments never install dependencies", (t) => {
  const f = fixture(t, { parser: false });
  assert.equal(f.run(["--help"]).status, 0);
  assert.equal(f.run(["--global"]).status, 2);
  assert.equal(f.commands().length, 0);
});
