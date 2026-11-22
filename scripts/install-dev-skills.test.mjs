import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./install-dev-skills.sh", import.meta.url));
const groups = [
  ["https://github.com/mattpocock/skills/tree/main/skills", ["grilling", "writing-for-agents", "code-review", "grill-me", "tdd"]],
  ["https://github.com/cursor/plugins/tree/main/pstack/skills", ["unslop"]],
];
const names = groups.flatMap(([, skills]) => skills);
const sources = new Map(groups.flatMap(([url, skills]) => skills.map((name) => [name, url])));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "repo skills "));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const bin = join(root, "bin");
  const log = join(root, "commands.jsonl");
  const installedScript = join(root, "scripts/install-dev-skills.sh");
  const put = (path, text) => {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  };
  mkdirSync(dirname(installedScript), { recursive: true });
  copyFileSync(script, installedScript);
  put(join(bin, "npx"), `#!${process.execPath}
const fs = require("node:fs");
const path = require("node:path");
const args = process.argv.slice(2);
fs.appendFileSync(process.env.COMMAND_LOG, JSON.stringify({ args, cwd: process.cwd() }) + "\\n");
if (process.env.FAIL_NPX === "1") process.exit(8);
if (process.env.NO_OUTPUT === "1") process.exit(0);
const name = args[args.indexOf("--skill") + 1];
if (process.env.FAIL_SKILL === name) process.exit(8);
const output = path.join(process.cwd(), ".agents/skills", name);
fs.mkdirSync(path.join(output, "agents"), { recursive: true });
fs.writeFileSync(path.join(output, "SKILL.md"), "installed " + name);
fs.writeFileSync(path.join(output, "agents/openai.yaml"), "provider metadata");
`);
  for (const name of ["node", "npm"]) {
    put(join(bin, name), "#!/usr/bin/env bash\nprintf 'Unexpected runtime dependency\\n' >&2\nexit 99\n");
  }
  for (const name of ["node", "npm", "npx"]) chmodSync(join(bin, name), 0o755);
  const run = (args = [], extra = {}) => spawnSync("bash", [installedScript, ...args], {
    cwd: tmpdir(), encoding: "utf8", env: {
      ...process.env, PATH: `${bin}:${process.env.PATH}`, COMMAND_LOG: log, ...extra,
    },
  });
  const commands = () => existsSync(log)
    ? readFileSync(log, "utf8").trim().split("\n").filter(Boolean).map((line) => JSON.parse(line)) : [];
  return { root, put, run, commands };
}

test("installs skills from main in source groups and moves them into external", (t) => {
  const f = fixture(t);
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Run \/reload in Pi/);
  const commands = f.commands();
  assert.equal(commands.length, names.length);
  for (const [i, command] of commands.entries()) {
    assert.equal(command.cwd, f.root);
    assert.deepEqual(command.args.slice(0, 3), ["-y", "skills@1.7.4", "add"]);
    assert.equal(command.args[3], sources.get(names[i]));
    assert.deepEqual(command.args.slice(4), ["--skill", names[i], "--agent", "pi", "--yes"]);
    assert.equal(readFileSync(join(f.root, ".agents/skills/external", names[i], "SKILL.md"), "utf8"), "installed " + names[i]);
    assert.equal(existsSync(join(f.root, ".agents/skills", names[i])), false);
    assert.equal(existsSync(join(f.root, ".agents/skills/external", names[i], "agents/openai.yaml")), false);
  }
});

test("reruns preserve existing external skills without reinstalling", (t) => {
  const f = fixture(t);
  assert.equal(f.run().status, 0);
  const path = join(f.root, ".agents/skills/external/tdd/SKILL.md");
  writeFileSync(path, "local edits");
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.commands().length, names.length);
  assert.equal(readFileSync(path, "utf8"), "local edits");
});

test("preserves categorized adaptations without installing duplicate names", (t) => {
  const f = fixture(t);
  const path = join(f.root, ".agents/skills/coding/code-review/SKILL.md");
  f.put(path, "adapted instructions");
  assert.equal(f.run().status, 0);
  assert.equal(f.commands().length, names.length - 1);
  assert.equal(readFileSync(path, "utf8"), "adapted instructions");
  assert.equal(existsSync(join(f.root, ".agents/skills/external/code-review")), false);
});

test("moves an existing flat installation without changing its instructions", (t) => {
  const f = fixture(t);
  f.put(join(f.root, ".agents/skills/unslop/SKILL.md"), "local unslop edits");
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.commands().length, names.length - 1);
  assert.equal(readFileSync(join(f.root, ".agents/skills/external/unslop/SKILL.md"), "utf8"), "local unslop edits");
  assert.equal(existsSync(join(f.root, ".agents/skills/unslop")), false);
});

test("stops on installation failure or missing local output", (t) => {
  const f = fixture(t);
  assert.equal(f.run([], { FAIL_NPX: "1" }).status, 8);
  assert.equal(f.commands().length, 1);
  const result = f.run([], { NO_OUTPUT: "1" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Expected a project-local skill directory/);
});

test("rejects symlinked skill roots and external directories before installing", (t) => {
  const f = fixture(t);
  const elsewhere = join(f.root, "elsewhere");
  mkdirSync(elsewhere);
  symlinkSync(elsewhere, join(f.root, ".agents"), "dir");
  assert.equal(f.run().status, 1);
  rmSync(join(f.root, ".agents"));
  mkdirSync(join(f.root, ".agents/skills"), { recursive: true });
  symlinkSync(elsewhere, join(f.root, ".agents/skills/external"), "dir");
  assert.equal(f.run().status, 1);
  assert.equal(f.commands().length, 0);
});

test("help and invalid arguments never install packages", (t) => {
  const f = fixture(t);
  assert.equal(f.run(["--help"]).status, 0);
  assert.equal(f.run(["--global"]).status, 2);
  assert.equal(f.commands().length, 0);
});

test("a source failure preserves earlier installs and stops the next group", (t) => {
  const f = fixture(t);
  const result = f.run([], { FAIL_SKILL: "code-review" });
  assert.equal(result.status, 8);
  assert.equal(f.commands().length, 3);
  for (const name of groups[0][1].slice(0, 2)) {
    assert.equal(existsSync(join(f.root, ".agents/skills/external", name, "SKILL.md")), true);
  }
  assert.equal(existsSync(join(f.root, ".agents/skills/external/code-review")), false);
  assert.equal(existsSync(join(f.root, ".agents/skills/external/unslop")), false);
});
