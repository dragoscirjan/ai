import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const directory = dirname(fileURLToPath(import.meta.url));
const script = join(directory, "sync-agent-assets.mjs");
const repositoryRoot = resolve(directory, "../../../..");

function git(root, args) {
  return execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
}

function initializeGit(root) {
  execFileSync("git", ["init", "-q", root]);
  git(root, ["config", "user.name", "Sync Test"]);
  git(root, ["config", "user.email", "sync-test@example.invalid"]);
}

function commitAll(root, message = "fixture") {
  git(root, ["add", "."]);
  git(root, ["commit", "-q", "-m", message]);
  return git(root, ["rev-parse", "HEAD"]);
}

function fixture(prefix) {
  const root = mkdtempSync(join(tmpdir(), prefix));
  initializeGit(root);
  writeFileSync(join(root, "README.md"), "# Fixture\n");
  commitAll(root);
  return root;
}

function run(args, cwd = repositoryRoot) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

function writeSkill(root, name, body = `# ${name}\n`, requirements = []) {
  const skillRoot = join(root, ".agents", "skills", name);
  mkdirSync(skillRoot, { recursive: true });
  writeFileSync(
    join(skillRoot, "SKILL.md"),
    `---\nname: ${name}\ndescription: Test skill ${name}.\n${requirements.length ? `require: ${JSON.stringify(requirements)}\n` : ""}---\n\n${body}`,
  );
}

function indentSkillFrontmatter(root, name) {
  const path = join(root, ".agents", "skills", name, "SKILL.md");
  const text = readFileSync(path, "utf8").replace(/^---\n([\s\S]*?)\n---/, (_match, fields) =>
    `---\n# root mapping may be indented\n${fields.split("\n").map((line) => `  ${line}`).join("\n")}\n---`);
  writeFileSync(path, text);
}

function syntheticSource() {
  const root = mkdtempSync(join(tmpdir(), "sync-agent-assets-source-"));
  initializeGit(root);
  writeFileSync(join(root, "AGENTS.md"), "# Source agents\n");
  writeFileSync(join(root, "CLAUDE.md"), "@AGENTS.md\n");
  writeFileSync(join(root, "CONTRIBUTING.md"), "# Source contributing\n");
  writeFileSync(join(root, "VALIDATION.md"), "# Source validation\n");
  writeSkill(root, "grilling");
  writeFileSync(join(root, ".agents", "skills", "grilling", "notes.md"), "# Grilling notes\n");
  writeSkill(root, "grill-me", undefined, ["grilling"]);
  writeSkill(root, "optional-skill");
  writeSkill(root, "sync-agent-assets");
  const catalog = {
    schemaVersion: 1,
    repository: "fixture/source",
    profiles: {
      manager: ["sync-agent-assets"],
      bootstrap: ["grilling", "grill-me"],
      coreInstructions: [],
    },
    skills: [
      {
        name: "grilling",
        category: "interview",
        selection: "bootstrap",
        dependencies: [],
        safety: "read-only-guidance",
        harnesses: ["pi", "opencode", "claude-code"],
        signals: {},
      },
      {
        name: "grill-me",
        category: "interview-wrapper",
        selection: "bootstrap",
        dependencies: [],
        safety: "read-only-guidance",
        harnesses: ["pi", "opencode", "claude-code"],
        signals: {},
      },
      {
        name: "optional-skill",
        category: "utility",
        selection: "optional",
        dependencies: [],
        safety: "read-only-guidance",
        harnesses: ["pi", "opencode", "claude-code"],
        signals: { askWithoutSignals: true },
      },
      {
        name: "sync-agent-assets",
        category: "asset-manager",
        selection: "manager",
        dependencies: [],
        safety: "project-write-with-confirmation",
        harnesses: ["pi", "opencode", "claude-code"],
        signals: {},
      },
    ],
  };
  const catalogPath = join(root, ".agents", "skills", "sync-agent-assets", "assets");
  mkdirSync(catalogPath, { recursive: true });
  writeFileSync(join(catalogPath, "skill-catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  const commit = commitAll(root, "source fixture");
  return { root, commit };
}

function installSyntheticAssets(source, target, { claudeProjections = true } = {}) {
  mkdirSync(join(target, ".agents", "skills"), { recursive: true });
  for (const name of ["grilling", "grill-me", "sync-agent-assets"]) {
    cpSync(join(source, ".agents", "skills", name), join(target, ".agents", "skills", name), { recursive: true });
  }
  if (claudeProjections) {
    mkdirSync(join(target, ".claude", "skills"), { recursive: true });
    for (const name of ["grilling", "grill-me", "sync-agent-assets"]) {
      symlinkSync(`../../.agents/skills/${name}`, join(target, ".claude", "skills", name), "dir");
    }
  }
  writeFileSync(join(target, "AGENTS.md"), "# Adapted agents\n");
  writeFileSync(join(target, "CLAUDE.md"), "@AGENTS.md\n");
  writeFileSync(join(target, "CONTRIBUTING.md"), "# Adapted contributing\n");
  writeFileSync(join(target, "VALIDATION.md"), "# Adapted validation\n");
}

function selectionFile(root) {
  const path = join(root, "selection.json");
  writeFileSync(
    path,
    `${JSON.stringify({
      selectedSkills: [],
      declinedSkills: [{ name: "optional-skill", reason: "Not applicable." }],
      rootFiles: ["AGENTS.md", "CLAUDE.md", "CONTRIBUTING.md", "VALIDATION.md"],
      adaptations: { "AGENTS.md": "Preserved fixture rules." },
    }, null, 2)}\n`,
  );
  return path;
}

test("review snapshot commands distinguish endpoints and ignore uncommitted source fixes", () => {
  const repository = fixture("skill-review-snapshots-");
  try {
    const base = git(repository, ["rev-parse", "HEAD"]);
    git(repository, ["checkout", "-qb", "left-snapshot"]);
    writeFileSync(join(repository, "left-only.txt"), "left snapshot\n");
    const left = commitAll(repository, "left-only file");
    git(repository, ["checkout", "-q", "--detach", base]);
    writeFileSync(join(repository, "helper.txt"), "committed defect\n");
    const head = commitAll(repository, "reviewed head");
    writeFileSync(join(repository, "helper.txt"), "uncommitted fix\n");
    const mergeBase = git(repository, ["merge-base", left, head]);
    assert.doesNotMatch(git(repository, ["diff", "--name-status", mergeBase, head]), /left-only/);
    assert.match(git(repository, ["diff", "--name-status", left, head]), /D\s+left-only\.txt/);
    assert.equal(git(repository, ["show", head + ":helper.txt"]), "committed defect");
    assert.equal(readFileSync(join(repository, "helper.txt"), "utf8"), "uncommitted fix\n");
    const instructions = readFileSync(join(repositoryRoot, ".agents", "skills", "code-review", "SKILL.md"), "utf8");
    assert.match(instructions, /remaining project\/harness reviewer capacity/);
    assert.match(instructions, /exact endpoint snapshots/);
    assert.match(instructions, /relevant check completed successfully on the reviewed snapshot/);
    assert.match(instructions, /without omitting concrete findings/);
  } finally {
    rmSync(repository, { recursive: true, force: true });
  }
});

test("help documents prerequisites and approval-bound recording", () => {
  const result = run(["--help"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Node\.js 22\.20 or newer/);
  assert.match(result.stdout, /--apply --confirm --plan-id/);
  assert.match(result.stdout, /never edits project assets/i);
});

test("documentation pins the Skills CLI and resolves helper commands from the skill directory", () => {
  const files = [
    join(repositoryRoot, "AGENTS.md"),
    join(repositoryRoot, "README.md"),
    join(repositoryRoot, ".agents", "skills", "sync-agent-assets", "SKILL.md"),
  ];
  const contents = files.map((path) => readFileSync(path, "utf8")).join("\n");
  assert.doesNotMatch(contents, /npx(?: --yes)? skills(?:\s|$)/);
  assert.doesNotMatch(contents, /skills@1\.7\.4 use[^\n]*--agent (?:pi|opencode)/);
  assert.match(contents, /npx skills@1\.7\.4 add/);
  assert.match(contents, /Skills CLI 1\.7\.4 cannot launch Pi or OpenCode/);
  assert.match(contents, /pi "\$SYNC_AGENT_PROMPT/);
  assert.match(contents, /opencode --prompt "\$SYNC_AGENT_PROMPT/);
  assert.match(contents, /skills@1\.7\.4 use dragoscirjan\/ai@sync-agent-assets --agent claude-code/);
  assert.match(contents, /--agent pi[\s\S]*--agent opencode[\s\S]*--agent claude-code/);
  assert.doesNotMatch(contents, /--agent claude-code \\\n\s+--copy/);
  const skill = readFileSync(files[2], "utf8");
  assert.doesNotMatch(skill, /node scripts\/sync-agent-assets\.mjs/);
  assert.match(skill, /node "\$SYNC_AGENT_ASSETS_HELPER"/);
  assert.doesNotMatch(skill, /\/skill:grill-me|follow `grilling` directly/);
  assert.match(skill, /Before the first managed mutation, require an isolated workspace/);
  assert.match(skill, /Show complete proposed contents or precise diffs/);
});

test("Skills CLI generates a temporary prompt with supporting files without launching an agent", { timeout: 120_000 }, () => {
  let tempRoot;
  try {
    const result = spawnSync("npx", [
      "--yes",
      "skills@1.7.4",
      "use",
      repositoryRoot,
      "--skill",
      "sync-agent-assets",
    ], {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      timeout: 120_000,
    });
    assert.equal(result.status, 0, result.stderr);
    assert.doesNotMatch(result.stdout, /Running (?:Pi|OpenCode) is not supported/);
    const supportMatch = result.stdout.match(/Supporting files for this skill were downloaded to:\n([^\n]+)/);
    assert.ok(supportMatch, "generated prompt must identify its supporting-files directory");
    const skillRoot = supportMatch[1].trim();
    tempRoot = dirname(skillRoot);
    assert.match(basename(tempRoot), /^skills-use-/);
    assert.equal(existsSync(join(skillRoot, "scripts", "sync-agent-assets.mjs")), true);
    assert.equal(existsSync(join(skillRoot, "references", "data-model.md")), true);
  } finally {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("Skills CLI launches the Claude Code bootstrap with temporary supporting files", { timeout: 120_000 }, () => {
  const root = mkdtempSync(join(tmpdir(), "sync-agent-assets-claude-use-"));
  try {
    const bin = join(root, "bin");
    const capture = join(root, "capture.json");
    mkdirSync(bin);
    const fakeClaude = join(bin, "claude");
    writeFileSync(fakeClaude, `#!/usr/bin/env node\nconst fs=require("node:fs");\nconst prompt=process.argv[2]??"";\nconst match=prompt.match(/Supporting files for this skill were downloaded to:\\n([^\\n]+)/);\nconst skillRoot=match?.[1]?.trim();\nconst valid=Boolean(skillRoot&&fs.existsSync(skillRoot+"/scripts/sync-agent-assets.mjs")&&fs.existsSync(skillRoot+"/references/data-model.md"));\nfs.writeFileSync(${JSON.stringify(capture)},JSON.stringify({prompt,skillRoot,valid}));\nprocess.exit(valid?0:1);\n`);
    chmodSync(fakeClaude, 0o755);
    const result = spawnSync("npx", [
      "--yes",
      "skills@1.7.4",
      "use",
      repositoryRoot,
      "--skill",
      "sync-agent-assets",
      "--agent",
      "claude-code",
    ], {
      encoding: "utf8",
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      maxBuffer: 20 * 1024 * 1024,
      timeout: 120_000,
    });
    assert.equal(result.status, 0, result.stderr);
    const launched = JSON.parse(readFileSync(capture, "utf8"));
    assert.equal(launched.valid, true);
    assert.match(launched.prompt, /sync-agent-assets/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("preflight verifies required local runtimes", () => {
  const result = run(["preflight"]);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.match(output.node, /^\d+\.\d+\.\d+/);
  assert.match(output.npx, /^\d+\.\d+\.\d+/);
  assert.match(output.git, /^git version /);
  assert.match(output.bun, /^\d+\.\d+\.\d+/);
  assert.equal(output.network, "verified by fetch");
});

test("the catalog covers every repository skill directory", () => {
  for (const name of ["skill-catalog.schema.json", "selection.schema.json", "ai-assets-lock.schema.json"]) {
    assert.doesNotThrow(() => JSON.parse(readFileSync(join(repositoryRoot, ".agents", "skills", "sync-agent-assets", "assets", name), "utf8")));
  }
  const result = run(["catalog", "--source-root", repositoryRoot]);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  const names = new Set(output.skills.map((entry) => entry.name));
  assert.equal(names.has("sync-agent-assets"), true);
  assert.equal(names.has("coding-with-rules"), true);
  assert.deepEqual([...names].filter((name) => name.startsWith("coding-")), ["coding-with-rules"]);
  assert.equal(names.has("instruction-maintenance"), true);
  assert.equal(output.skills.every((entry) => entry.harnesses.includes("claude-code")), true);
  assert.deepEqual(output.skills.filter((entry) => entry.require.length).map((entry) => [entry.name, entry.require]), [["cleanup-workspaces", ["isolated-workspace"]], ["coding-with-rules", ["coding"]], ["grill-me", ["grilling"]]]);
  assert.deepEqual(output.skills.filter((entry) => entry.dependencies.length).map((entry) => [entry.name, entry.dependencies]), [
    ["cleanup-workspaces", ["isolated-workspace"]],
    ["init-gdscript", ["init-project"]],
    ["init-typescript", ["init-project"]],
  ]);
  assert.equal(output.profiles.coreInstructions.includes("coding-with-rules"), true);
  assert.equal(output.profiles.coreInstructions.includes("coding"), false);
  for (const name of ["init-typescript", "init-gdscript"]) {
    const text = readFileSync(join(repositoryRoot, ".agents", "skills", name, "SKILL.md"), "utf8");
    assert.match(text, /Read applicable project instructions and contribution policy before planning/);
    assert.match(text, /satisfy project approval and workspace gates/);
  }
  for (const entry of output.skills.filter((skill) => skill.require.length === 0)) {
    const text = readFileSync(join(repositoryRoot, ".agents", "skills", entry.name, "SKILL.md"), "utf8");
    assert.doesNotMatch(text, /^## Load (?:the dependency|dependencies)/m, entry.name);
    assert.doesNotMatch(text, /(?:load|read|follow) (?:the (?:sibling|matching|advertised) )?`(?:coding(?:-[a-z]+)?|cleanup-workspaces|isolated-workspace|grilling|grill-me|instruction-maintenance|subagent-orchestration)`/i, entry.name);
  }
  assert.equal(readFileSync(join(repositoryRoot, "CLAUDE.md"), "utf8"), "@AGENTS.md\n");
  for (const entry of output.skills) {
    assert.equal(
      readlinkSync(join(repositoryRoot, ".claude", "skills", entry.name)),
      `../../.agents/skills/${entry.name}`,
    );
  }
});

test("coding composition links plain references with language-before-extension routing", () => {
  const root = join(repositoryRoot, ".agents", "skills", "coding-with-rules");
  const instructions = readFileSync(join(root, "SKILL.md"), "utf8");
  const suffixes = ["bash", "c", "cjs", "cpp", "cts", "gdscript", "go", "js", "jsx", "lua", "mjs", "mts", "php", "py", "pyi", "rs", "sh", "swift", "ts", "tsx", "zig"];
  assert.deepEqual(readdirSync(join(root, "references")).sort(), suffixes.map((name) => `${name}.md`));
  const links = [...instructions.matchAll(/\]\(references\/([a-z]+)\.md\)/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(links)].sort(), suffixes);
  for (const suffix of suffixes) {
    const text = readFileSync(join(root, "references", `${suffix}.md`), "utf8");
    assert.doesNotMatch(text, /^---\r?\n/);
    assert.match(text, /^# /);
    assert.equal(existsSync(join(repositoryRoot, ".agents", "skills", `coding-${suffix}`)), false);
    assert.equal(existsSync(join(repositoryRoot, ".claude", "skills", `coding-${suffix}`)), false);
  }
  for (const [extension, expected] of [
    ["mjs", ["js", "mjs"]], ["cjs", ["js", "cjs"]], ["jsx", ["js", "jsx"]],
    ["mts", ["ts", "mts"]], ["cts", ["ts", "cts"]], ["tsx", ["ts", "tsx"]], ["pyi", ["py", "pyi"]],
  ]) {
    const row = instructions.split("\n").find((line) => line.startsWith("|") && line.includes(`\`.${extension}\``));
    assert.ok(row, extension);
    assert.deepEqual([...row.matchAll(/\]\(references\/([a-z]+)\.md\)/g)].map((match) => match[1]), expected);
  }
  assert.match(instructions, /unsupported language/i);
  assert.match(instructions, /mapped reference is missing/i);
  assert.match(instructions, /Bash.*POSIX/);
});

test("coding references contain language rules rather than standalone skill workflows", () => {
  const root = join(repositoryRoot, ".agents", "skills", "coding-with-rules", "references");
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    assert.equal(lstatSync(path).isFile(), true, `${name} must be a regular file, not a symlink`);
    const text = readFileSync(path, "utf8");
    assert.match(text, /^# .+ rules\n/, name);
    assert.doesNotMatch(text, /^---\r?\n|\bthis skill\b|\blanguage skills?\b/im, name);
    assert.doesNotMatch(text, /^## (?:Test and run|Follow project|Confirm the .* contract)|Report every applicable gate/im, name);
    assert.doesNotMatch(text, /\]\([^)]*coding-[^)]*\/SKILL\.md\)/, name);
  }
  for (const [name, rules] of [
    ["bash", [/Bash 4\.0/, /PIPESTATUS/, /sourced/]],
    ["c", [/overflow/, /alias/]],
    ["cpp", [/RAII/, /JSF/]],
    ["go", [/context\.Context/, /goroutine/]],
    ["ts", [/unknown/, /erased/, /@tempel\/tsconfig/]],
    ["tsx", [/React/, /escaping/, /accessibility/]],
    ["pyi", [/runtime/, /declarative/, /stubtest/]],
    ["rs", [/unsafe/, /Send/, /Sync/]],
    ["swift", [/Sendable/, /continuation/]],
    ["zig", [/errdefer/, /allocator/]],
  ]) {
    const text = readFileSync(join(root, `${name}.md`), "utf8");
    for (const rule of rules) assert.match(text, rule, name);
  }
});

for (const indent of [0, 2]) {
  test(`frontmatter requirements preserve order and closure with root indentation ${indent}`, () => {
    const source = syntheticSource();
    const target = fixture("sync-require-target-");
    try {
      const catalogPath = join(source.root, ".agents", "skills", "sync-agent-assets", "assets", "skill-catalog.json");
      const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
      catalog.profiles = { manager: [], bootstrap: [], coreInstructions: [] };
      catalog.skills.find((entry) => entry.name === "grill-me").dependencies = ["optional-skill"];
      writeFileSync(catalogPath, JSON.stringify(catalog));
      writeSkill(source.root, "grill-me", undefined, ["optional-skill", "grilling"]);
      writeSkill(source.root, "optional-skill", undefined, ["grilling"]);
      if (indent) {
        indentSkillFrontmatter(source.root, "grill-me");
        indentSkillFrontmatter(source.root, "optional-skill");
      }
      source.commit = commitAll(source.root, "separate prompt and code dependencies");
      const output = JSON.parse(run(["catalog", "--source-root", source.root]).stdout);
      const entry = output.skills.find((skill) => skill.name === "grill-me");
      assert.deepEqual(entry.require, ["optional-skill", "grilling"]);
      assert.deepEqual(entry.dependencies, ["optional-skill"]);
      assert.deepEqual(entry.requires, []);
      installSyntheticAssets(source.root, target);
      cpSync(join(source.root, ".agents", "skills", "optional-skill"), join(target, ".agents", "skills", "optional-skill"), { recursive: true });
      symlinkSync("../../.agents/skills/optional-skill", join(target, ".claude", "skills", "optional-skill"), "dir");
      const selection = join(target, "requirements-selection.json");
      writeFileSync(selection, JSON.stringify({ selectedSkills: ["grill-me"], rootFiles: ["AGENTS.md", "CLAUDE.md", "CONTRIBUTING.md", "VALIDATION.md"] }));
      const before = git(target, ["status", "--porcelain"]);
      const result = run(["record", "--root", target, "--source-root", source.root, "--source-commit", source.commit, "--selection", selection]);
      assert.equal(result.status, 0, result.stderr);
      const plan = JSON.parse(result.stdout);
      assert.deepEqual(plan.lock.selection.selectedSkills, ["grill-me", "grilling", "optional-skill"]);
      assert.equal(existsSync(join(target, ".agents", "ai-assets.lock.json")), false);
      assert.equal(git(target, ["status", "--porcelain"]), before);
    } finally {
      rmSync(source.root, { recursive: true, force: true });
      rmSync(target, { recursive: true, force: true });
    }
  });
}

test("indented root requirements cannot hide missing targets or cycles", () => {
  const source = syntheticSource();
  try {
    for (const [requirements, error] of [
      [["missing-skill"], /Unknown dependency/],
      [["grill-me"], /cycle/],
    ]) {
      writeSkill(source.root, "grill-me", undefined, requirements);
      indentSkillFrontmatter(source.root, "grill-me");
      const result = run(["catalog", "--source-root", source.root]);
      assert.equal(result.status, 3, result.stderr);
      assert.match(result.stderr, error);
    }
    writeSkill(source.root, "grill-me", undefined, ["grilling"]);
    writeSkill(source.root, "grilling", undefined, ["grill-me"]);
    indentSkillFrontmatter(source.root, "grill-me");
    indentSkillFrontmatter(source.root, "grilling");
    const result = run(["catalog", "--source-root", source.root]);
    assert.equal(result.status, 3, result.stderr);
    assert.match(result.stderr, /cycle/);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
  }
});

test("nested metadata is not a root instruction requirement", () => {
  const source = syntheticSource();
  try {
    const path = join(source.root, ".agents", "skills", "grill-me", "SKILL.md");
    writeFileSync(path, '---\n# unindented comment\n  name: grill-me\n  description: Fixture.\n  metadata:\n    require: "not a project requirement"\n---\nrequire: ["missing-skill"]\n');
    const result = run(["catalog", "--source-root", source.root]);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout).skills.find((entry) => entry.name === "grill-me").require, []);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
  }
});

test("require accepts only the declared inline array contract and ignores body examples", () => {
  const source = syntheticSource();
  const path = join(source.root, ".agents", "skills", "grill-me", "SKILL.md");
  try {
    for (const declaration of [
      'require: []', 'require: true', 'require: "grilling"', 'require: null',
      'require: {}', 'require: [1]', 'require: [""]', 'require: ["../grilling"]',
      'require: ["grilling", "grilling"]', 'require: [grilling]',
      'require:\n  - grilling', 'require: &skills ["grilling"]',
      'require: ["grilling"] # comment', 'require: ["grilling",]',
      'require: ["grilling"]\nrequire: ["grilling"]', '"require": ["grilling"]',
      'require: SECRET_NOT_FOR_ERRORS',
    ]) {
      writeFileSync(path, `---\nname: grill-me\ndescription: Fixture.\n${declaration}\n---\nBody\n`);
      const result = run(["catalog", "--source-root", source.root]);
      assert.equal(result.status, 3, declaration + result.stderr);
      assert.match(result.stderr, /Invalid require/);
      assert.doesNotMatch(result.stderr, /SECRET_NOT_FOR_ERRORS/);
    }
    writeSkill(source.root, "grill-me", 'require: ["missing-skill"]\n');
    let result = run(["catalog", "--source-root", source.root]);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout).skills.find((entry) => entry.name === "grill-me").require, []);
    writeFileSync(path, '\uFEFF---\r\nname: grill-me\r\ndescription: Fixture.\r\nrequire: ["grilling"]\r\n---\r\nBody\r\n');
    result = run(["catalog", "--source-root", source.root]);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout).skills.find((entry) => entry.name === "grill-me").require, ["grilling"]);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
  }
});

test("catalog never follows symbolic links while reading requirement metadata", () => {
  for (const kind of ["file", "directory"]) {
    const source = syntheticSource();
    const outside = mkdtempSync(join(tmpdir(), "sync-require-outside-"));
    try {
      writeFileSync(join(outside, "SKILL.md"), "SECRET_NOT_FOR_ERRORS\n");
      const skill = join(source.root, ".agents", "skills", "grill-me");
      const target = kind === "file" ? join(skill, "SKILL.md") : skill;
      rmSync(target, { recursive: true });
      symlinkSync(kind === "file" ? join(outside, "SKILL.md") : outside, target, kind === "file" ? "file" : "dir");
      const result = run(["catalog", "--source-root", source.root]);
      assert.equal(result.status, 3, result.stderr);
      assert.match(result.stderr, /must not be a symbolic link/);
      assert.doesNotMatch(result.stderr, /SECRET_NOT_FOR_ERRORS/);
    } finally {
      rmSync(source.root, { recursive: true, force: true });
      rmSync(outside, { recursive: true, force: true });
    }
  }
});

test("require rejects missing targets, prompt cycles and mixed code/prompt cycles", () => {
  const source = syntheticSource();
  try {
    writeSkill(source.root, "grill-me", undefined, ["missing-skill"]);
    let result = run(["catalog", "--source-root", source.root]);
    assert.equal(result.status, 3, result.stderr);
    assert.match(result.stderr, /Unknown dependency/);
    writeSkill(source.root, "grill-me", undefined, ["grill-me"]);
    result = run(["catalog", "--source-root", source.root]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /cycle/);
    writeSkill(source.root, "grill-me", undefined, ["grilling"]);
    writeSkill(source.root, "grilling", undefined, ["grill-me"]);
    result = run(["catalog", "--source-root", source.root]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /cycle/);
    writeSkill(source.root, "grilling");
    const path = join(source.root, ".agents", "skills", "sync-agent-assets", "assets", "skill-catalog.json");
    const catalog = JSON.parse(readFileSync(path, "utf8"));
    catalog.skills.find((entry) => entry.name === "grilling").dependencies = ["grill-me"];
    writeFileSync(path, JSON.stringify(catalog));
    result = run(["catalog", "--source-root", source.root]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /cycle/);
    catalog.skills.find((entry) => entry.name === "grilling").dependencies = [];
    catalog.skills.find((entry) => entry.name === "grill-me").require = ["grilling"];
    writeFileSync(path, JSON.stringify(catalog));
    result = run(["catalog", "--source-root", source.root]);
    assert.equal(result.status, 3, result.stderr);
    assert.match(result.stderr, /SKILL.md, not the catalog/);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
  }
});

test("installed partial managers inspect inventory without guessing unavailable requirements", () => {
  const source = syntheticSource();
  const target = fixture("sync-partial-manager-");
  try {
    const installed = join(target, ".agents", "skills", "sync-agent-assets");
    cpSync(join(source.root, ".agents", "skills", "sync-agent-assets"), installed, { recursive: true });
    mkdirSync(join(installed, "scripts"), { recursive: true });
    cpSync(script, join(installed, "scripts", "sync-agent-assets.mjs"));
    const before = git(target, ["status", "--porcelain"]);
    const command = join(installed, "scripts", "sync-agent-assets.mjs");
    const partial = spawnSync(process.execPath, [command, "inspect", "--root", target], { cwd: target, encoding: "utf8" });
    assert.equal(partial.status, 0, partial.stderr);
    const output = JSON.parse(partial.stdout);
    assert.equal(output.mode, "init");
    assert.equal(output.recommendedClosure, null);
    assert.ok(output.unavailableRequirementMetadata.includes("grill-me"));
    assert.equal(output.recommendedSkills.find((entry) => entry.name === "grill-me").require, null);
    assert.deepEqual(output.recommendedSkills.find((entry) => entry.name === "sync-agent-assets").harnesses, ["pi", "opencode", "claude-code"]);
    assert.equal(git(target, ["status", "--porcelain"]), before);
    const full = spawnSync(process.execPath, [command, "inspect", "--root", target, "--source-root", source.root], { cwd: target, encoding: "utf8" });
    assert.equal(full.status, 0, full.stderr);
    assert.deepEqual(JSON.parse(full.stdout).unavailableRequirementMetadata, []);
    assert.ok(JSON.parse(full.stdout).recommendedClosure.includes("grilling"));
    const strict = spawnSync(process.execPath, [command, "catalog"], { cwd: target, encoding: "utf8" });
    assert.equal(strict.status, 3);
    assert.match(strict.stderr, /Missing skill frontmatter/);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("recording rejects selections unsupported by the managed harness bundle", () => {
  const source = syntheticSource();
  const target = fixture("sync-harness-selection-");
  try {
    const path = join(source.root, ".agents", "skills", "sync-agent-assets", "assets", "skill-catalog.json");
    const catalog = JSON.parse(readFileSync(path, "utf8"));
    catalog.skills.find((entry) => entry.name === "optional-skill").harnesses = ["pi"];
    writeFileSync(path, JSON.stringify(catalog));
    source.commit = commitAll(source.root, "single-harness optional skill");
    const selection = selectionFile(target);
    const data = JSON.parse(readFileSync(selection, "utf8"));
    data.selectedSkills = ["optional-skill"];
    data.declinedSkills = [];
    writeFileSync(selection, JSON.stringify(data));
    const result = run(["record", "--root", target, "--source-root", source.root, "--source-commit", source.commit, "--selection", selection]);
    assert.equal(result.status, 3, result.stderr);
    assert.match(result.stderr, /does not support managed harnesses: opencode, claude-code/);
    assert.equal(existsSync(join(target, ".agents", "ai-assets.lock.json")), false);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("inspect detects mode, language skills, wrappers, and ambiguous initializers", () => {
  const root = fixture("sync-agent-assets-inspect-");
  try {
    mkdirSync(join(root, "src"));
    writeFileSync(join(root, "src", "app.tsx"), "export const App = () => null;\n");
    writeFileSync(join(root, "tsconfig.json"), "{}\n");
    commitAll(root, "add typescript");
    const result = run(["inspect", "--root", root]);
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.mode, "init");
    const recommended = new Set(output.recommendedClosure);
    assert.equal(recommended.has("sync-agent-assets"), true);
    assert.equal(recommended.has("grill-me"), true);
    assert.equal(recommended.has("coding"), true);
    assert.equal(recommended.has("coding-with-rules"), true);
    assert.equal(recommended.has("coding-ts"), false);
    assert.equal(recommended.has("coding-tsx"), false);
    const ambiguous = new Set(output.ambiguousSkills.map((entry) => entry.name));
    assert.equal(ambiguous.has("init-typescript"), true);
    assert.equal(ambiguous.has("init-project"), true);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("inspect disables repository-configured Git fsmonitor commands", () => {
  const root = fixture("sync-agent-assets-fsmonitor-");
  const marker = join(tmpdir(), `sync-agent-assets-fsmonitor-${process.pid}-${Date.now()}`);
  try {
    const hook = join(root, ".git", "fsmonitor-test.sh");
    writeFileSync(hook, `#!/bin/sh\ntouch ${JSON.stringify(marker)}\nprintf '\\n'\n`);
    chmodSync(hook, 0o755);
    git(root, ["config", "core.fsmonitor", hook]);
    git(root, ["status", "--porcelain=v1"]);
    assert.equal(existsSync(marker), true, "test fixture must execute the configured fsmonitor command");
    rmSync(marker, { force: true });

    const result = run(["inspect", "--root", root]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(marker), false);
  } finally {
    rmSync(marker, { force: true });
    rmSync(root, { recursive: true, force: true });
  }
});

test("record plans, requires confirmation, writes a portable lock, and detects local edits", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-target-");
  try {
    installSyntheticAssets(source.root, target);
    const selection = selectionFile(target);
    const plan = run([
      "record",
      "--root", target,
      "--source-root", source.root,
      "--source-commit", source.commit,
      "--selection", selection,
    ]);
    assert.equal(plan.status, 0, plan.stderr);
    const planned = JSON.parse(plan.stdout);
    assert.equal(planned.mode, "plan");
    assert.deepEqual(planned.selectedSkills, ["grill-me", "grilling", "sync-agent-assets"]);
    assert.equal(existsSync(join(target, ".agents", "ai-assets.lock.json")), false);

    const unconfirmed = run([
      "record",
      "--root", target,
      "--source-root", source.root,
      "--source-commit", source.commit,
      "--selection", selection,
      "--apply",
    ]);
    assert.equal(unconfirmed.status, 2);

    const applied = run([
      "record",
      "--root", target,
      "--source-root", source.root,
      "--source-commit", source.commit,
      "--selection", selection,
      "--apply",
      "--confirm",
      "--plan-id", planned.planId,
    ]);
    assert.equal(applied.status, 0, applied.stderr);
    const lockText = readFileSync(join(target, ".agents", "ai-assets.lock.json"), "utf8");
    assert.doesNotMatch(lockText, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    const lock = JSON.parse(lockText);
    assert.equal(lock.$schema, "./skills/sync-agent-assets/assets/ai-assets-lock.schema.json");
    assert.equal(lock.source.commit, source.commit);
    assert.equal(lock.selection.adaptations["AGENTS.md"], "Preserved fixture rules.");
    assert.equal(Object.keys(lock.projections).length, 3);
    assert.equal(lock.projections[".claude/skills/grilling"].target, "../../.agents/skills/grilling");

    const detectedUpdate = run(["inspect", "--root", target]);
    assert.equal(detectedUpdate.status, 0, detectedUpdate.stderr);
    assert.equal(JSON.parse(detectedUpdate.stdout).mode, "update");

    const clean = run(["status", "--root", target]);
    assert.equal(clean.status, 0, clean.stderr);
    assert.equal(JSON.parse(clean.stdout).counts.modified, 0);

    writeFileSync(join(target, ".agents", "skills", "grilling", "SKILL.md"), "locally changed\n");
    const modified = run(["status", "--root", target]);
    assert.equal(modified.status, 0, modified.stderr);
    assert.equal(JSON.parse(modified.stdout).counts.modified, 1);

    rmSync(join(target, ".agents", "skills", "grilling", "SKILL.md"));
    const missing = run(["status", "--root", target]);
    assert.equal(missing.status, 0, missing.stderr);
    assert.equal(JSON.parse(missing.stdout).counts.missing, 1);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("approved adaptations survive installer replacement and reconciliation precedes ordinary comparison", { timeout: 120_000 }, () => {
  const source = syntheticSource();
  const target = fixture("sync-approved-adaptation-");
  const backup = mkdtempSync(join(tmpdir(), "sync-approved-backup-"));
  try {
    installSyntheticAssets(source.root, target);
    const selection = selectionFile(target);
    const recordArgs = () => ["record", "--root", target, "--source-root", source.root, "--source-commit", source.commit, "--selection", selection];
    let result = run(recordArgs());
    assert.equal(result.status, 0, result.stderr);
    let plan = JSON.parse(result.stdout);
    assert.equal(run([...recordArgs(), "--apply", "--confirm", "--plan-id", plan.planId]).status, 0);
    const lockPath = join(target, ".agents", "ai-assets.lock.json");
    const oldLock = readFileSync(lockPath, "utf8");
    const relativeSkill = join(".agents", "skills", "grilling", "SKILL.md");
    const sourceSkill = join(source.root, relativeSkill);
    writeFileSync(sourceSkill, readFileSync(sourceSkill, "utf8") + "\nUpstream refresh.\n");
    source.commit = commitAll(source.root, "approved upstream candidate");
    const approved = readFileSync(sourceSkill, "utf8") + "\nApproved local guidance.\n";
    const saved = join(backup, "SKILL.md");
    writeFileSync(saved, approved);
    const installed = join(target, relativeSkill);
    writeFileSync(installed, approved);
    const cli = spawnSync("npx", ["--yes", "skills@1.7.4", "add", source.root,
      "--skill", "grilling", "--skill", "grill-me", "--skill", "sync-agent-assets",
      "--agent", "pi", "--agent", "opencode", "--agent", "claude-code", "--yes",
    ], { cwd: target, encoding: "utf8", timeout: 110_000 });
    assert.equal(cli.status, 0, cli.stderr);
    assert.equal(readFileSync(installed, "utf8"), readFileSync(sourceSkill, "utf8"));
    cpSync(saved, installed);
    assert.equal(readFileSync(installed, "utf8"), approved);
    const compare = () => run(["compare", "--root", target, "--source-root", source.root]);
    result = compare();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).files.find((file) => file.path === relativeSkill).state, "conflict");
    result = run(recordArgs());
    assert.equal(result.status, 0, result.stderr);
    plan = JSON.parse(result.stdout);
    assert.equal(readFileSync(lockPath, "utf8"), oldLock);
    assert.notEqual(plan.lock.files[relativeSkill].sourceSha256, plan.lock.files[relativeSkill].installedSha256);
    assert.equal(run([...recordArgs(), "--apply", "--confirm", "--plan-id", plan.planId]).status, 0);
    result = compare();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).files.find((file) => file.path === relativeSkill).state, "unchanged");
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
    rmSync(backup, { recursive: true, force: true });
  }
});

test("compare distinguishes clean upstream changes, conflicts, and retained removals", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-compare-");
  try {
    installSyntheticAssets(source.root, target);
    writeFileSync(join(target, ".agents", "skills", "grill-me", "SKILL.md"), "approved local adaptation\n");
    const selection = selectionFile(target);
    const plan = JSON.parse(run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
    ]).stdout);
    assert.equal(run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
      "--apply", "--confirm", "--plan-id", plan.planId,
    ]).status, 0);

    writeFileSync(join(source.root, ".agents", "skills", "grilling", "SKILL.md"), "upstream changed\n");
    writeFileSync(join(source.root, ".agents", "skills", "grill-me", "SKILL.md"), "upstream changed too\n");
    rmSync(join(source.root, "VALIDATION.md"));
    commitAll(source.root, "change source");
    const first = run(["compare", "--root", target, "--source-root", source.root]);
    assert.equal(first.status, 0, first.stderr);
    const states = new Map(JSON.parse(first.stdout).files.map((entry) => [entry.path, entry.state]));
    assert.equal(states.get(".agents/skills/grilling/SKILL.md"), "upstream-changed-clean");
    assert.equal(states.get(".agents/skills/grill-me/SKILL.md"), "conflict");
    assert.equal(states.get("VALIDATION.md"), "upstream-removed-retain");

    writeFileSync(join(target, ".agents", "skills", "grilling", "SKILL.md"), "local changed\n");
    const second = run(["compare", "--root", target, "--source-root", source.root]);
    assert.equal(second.status, 0, second.stderr);
    const conflict = JSON.parse(second.stdout).files.find((entry) => entry.path === ".agents/skills/grilling/SKILL.md");
    assert.equal(conflict.state, "conflict");
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("compare and record reject dirty pinned source checkouts", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-dirty-source-");
  try {
    installSyntheticAssets(source.root, target);
    const selection = selectionFile(target);
    const plan = JSON.parse(run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
    ]).stdout);
    assert.equal(run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
      "--apply", "--confirm", "--plan-id", plan.planId,
    ]).status, 0);

    writeFileSync(join(source.root, "dirty.txt"), "not committed\n");
    const compared = run(["compare", "--root", target, "--source-root", source.root]);
    assert.equal(compared.status, 3);
    assert.match(compared.stderr, /source checkout must be clean/);
    const recorded = run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
    ]);
    assert.equal(recorded.status, 3);
    assert.match(recorded.stderr, /source checkout must be clean/);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("record preserves approved files removed from a selected upstream skill", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-retain-");
  try {
    installSyntheticAssets(source.root, target);
    const selection = selectionFile(target);
    const initialPlan = JSON.parse(run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
    ]).stdout);
    assert.equal(run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
      "--apply", "--confirm", "--plan-id", initialPlan.planId,
    ]).status, 0);

    const retainedPath = ".agents/skills/grilling/notes.md";
    rmSync(join(source.root, retainedPath));
    const nextCommit = commitAll(source.root, "remove support file");
    const updateSelection = JSON.parse(readFileSync(selection, "utf8"));
    updateSelection.retainedFiles = [{ path: retainedPath, reason: "Removal is not approved." }];
    writeFileSync(selection, `${JSON.stringify(updateSelection, null, 2)}\n`);

    const updatePlanResult = run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", nextCommit, "--selection", selection,
    ]);
    assert.equal(updatePlanResult.status, 0, updatePlanResult.stderr);
    const updatePlan = JSON.parse(updatePlanResult.stdout);
    assert.equal(updatePlan.lock.files[retainedPath].retained, true);
    assert.equal(updatePlan.lock.files[retainedPath].retentionReason, "Removal is not approved.");
    const applied = run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", nextCommit, "--selection", selection,
      "--apply", "--confirm", "--plan-id", updatePlan.planId,
    ]);
    assert.equal(applied.status, 0, applied.stderr);

    const compared = run(["compare", "--root", target, "--source-root", source.root]);
    assert.equal(compared.status, 0, compared.stderr);
    const retained = JSON.parse(compared.stdout).files.find((entry) => entry.path === retainedPath);
    assert.equal(retained.state, "upstream-removed-retain");
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("old locks remain readable and report missing Claude Code projections", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-old-lock-");
  try {
    installSyntheticAssets(source.root, target);
    const selection = selectionFile(target);
    const plan = JSON.parse(run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
    ]).stdout);
    assert.equal(run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
      "--apply", "--confirm", "--plan-id", plan.planId,
    ]).status, 0);
    const lockPath = join(target, ".agents", "ai-assets.lock.json");
    const lock = JSON.parse(readFileSync(lockPath, "utf8"));
    delete lock.projections;
    writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
    rmSync(join(target, ".claude"), { recursive: true, force: true });

    const status = run(["status", "--root", target]);
    assert.equal(status.status, 0, status.stderr);
    const output = JSON.parse(status.stdout);
    assert.equal(output.projectionCounts.missing, 3);
    assert.equal(output.projections.every((entry) => entry.state === "missing"), true);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("coding migration installs complete references and retains legacy files without remapping", () => {
  const source = syntheticSource();
  const target = fixture("sync-coding-migration-");
  try {
    const catalogPath = join(source.root, ".agents", "skills", "sync-agent-assets", "assets", "skill-catalog.json");
    const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
    const entry = (name, selection) => ({ name, category: "coding", selection, dependencies: [], safety: "project-write-guidance", harnesses: ["pi", "opencode", "claude-code"], signals: {} });
    writeSkill(source.root, "coding");
    writeSkill(source.root, "coding-ts");
    catalog.skills.push(entry("coding", "core"), entry("coding-ts", "detected"));
    catalog.profiles.coreInstructions = ["coding"];
    writeFileSync(catalogPath, JSON.stringify(catalog));
    source.commit = commitAll(source.root, "legacy coding source");
    installSyntheticAssets(source.root, target);
    for (const name of ["coding", "coding-ts"]) {
      cpSync(join(source.root, ".agents", "skills", name), join(target, ".agents", "skills", name), { recursive: true });
      symlinkSync(`../../.agents/skills/${name}`, join(target, ".claude", "skills", name), "dir");
    }
    const selection = selectionFile(target);
    const selected = JSON.parse(readFileSync(selection, "utf8"));
    selected.selectedSkills = ["coding-ts"];
    writeFileSync(selection, JSON.stringify(selected));
    const args = () => ["record", "--root", target, "--source-root", source.root, "--source-commit", source.commit, "--selection", selection];
    let result = run(args());
    assert.equal(result.status, 0, result.stderr);
    let plan = JSON.parse(result.stdout);
    assert.equal(run([...args(), "--apply", "--confirm", "--plan-id", plan.planId]).status, 0);
    const legacyPath = ".agents/skills/coding-ts/SKILL.md";
    const legacyText = readFileSync(join(target, legacyPath), "utf8");
    const lockPath = join(target, ".agents", "ai-assets.lock.json");
    const oldLock = readFileSync(lockPath, "utf8");

    rmSync(join(source.root, ".agents", "skills", "coding-ts"), { recursive: true });
    cpSync(join(repositoryRoot, ".agents", "skills", "coding-with-rules"), join(source.root, ".agents", "skills", "coding-with-rules"), { recursive: true });
    catalog.skills = catalog.skills.filter((skill) => skill.name !== "coding-ts");
    catalog.skills.push(entry("coding-with-rules", "core"));
    catalog.profiles.coreInstructions = ["coding-with-rules"];
    writeFileSync(catalogPath, JSON.stringify(catalog));
    source.commit = commitAll(source.root, "replace language skill with coding composition");
    result = run(["compare", "--root", target, "--source-root", source.root]);
    assert.equal(result.status, 0, result.stderr);
    const compared = JSON.parse(result.stdout);
    assert.ok(compared.removedCatalogSkills.includes("coding-ts"));
    assert.ok(compared.newCatalogSkills.includes("coding-with-rules"));
    assert.equal(compared.files.find((file) => file.path === legacyPath).state, "upstream-removed-retain");
    result = run(args());
    assert.equal(result.status, 3, result.stderr);
    assert.match(result.stderr, /Unknown selected skill: coding-ts/);
    assert.equal(readFileSync(lockPath, "utf8"), oldLock);

    cpSync(join(source.root, ".agents", "skills", "coding-with-rules"), join(target, ".agents", "skills", "coding-with-rules"), { recursive: true });
    symlinkSync("../../.agents/skills/coding-with-rules", join(target, ".claude", "skills", "coding-with-rules"), "dir");
    selected.selectedSkills = ["coding-with-rules"];
    selected.retainedFiles = [{ path: legacyPath, reason: "Legacy removal is not approved." }];
    writeFileSync(selection, JSON.stringify(selected));
    const referencePath = ".agents/skills/coding-with-rules/references/tsx.md";
    rmSync(join(target, referencePath));
    result = run(args());
    assert.equal(result.status, 3, result.stderr);
    assert.match(result.stderr, /differs structurally/);
    cpSync(join(source.root, referencePath), join(target, referencePath));
    result = run(args());
    assert.equal(result.status, 0, result.stderr);
    plan = JSON.parse(result.stdout);
    assert.ok(plan.selectedSkills.includes("coding"));
    assert.ok(plan.selectedSkills.includes("coding-with-rules"));
    assert.equal(plan.selectedSkills.includes("coding-ts"), false);
    for (const name of readdirSync(join(source.root, ".agents", "skills", "coding-with-rules", "references"))) {
      assert.ok(plan.lock.files[`.agents/skills/coding-with-rules/references/${name}`]);
    }
    assert.equal(plan.lock.files[legacyPath].retained, true);
    assert.equal(readFileSync(lockPath, "utf8"), oldLock);
    assert.equal(run([...args(), "--apply", "--confirm", "--plan-id", plan.planId]).status, 0);
    assert.equal(readFileSync(join(target, legacyPath), "utf8"), legacyText);
    assert.equal(readlinkSync(join(target, ".claude", "skills", "coding-ts")), "../../.agents/skills/coding-ts");
    result = run(["status", "--root", target]);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).counts.modified, 0);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("record rejects missing or conflicting Claude Code projections", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-claude-conflict-");
  try {
    installSyntheticAssets(source.root, target, { claudeProjections: false });
    const missing = run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selectionFile(target),
    ]);
    assert.equal(missing.status, 3);
    assert.match(missing.stderr, /Claude Code skill projections/);
    assert.match(missing.stderr, /missing/);

    mkdirSync(join(target, ".claude", "skills", "grilling"), { recursive: true });
    for (const name of ["grill-me", "sync-agent-assets"]) {
      symlinkSync(`../../.agents/skills/${name}`, join(target, ".claude", "skills", name), "dir");
    }
    const conflict = run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selectionFile(target),
    ]);
    assert.equal(conflict.status, 3);
    assert.match(conflict.stderr, /grilling:conflict/);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("Skills CLI installs canonical skills with Claude Code symlink projections", { timeout: 120_000 }, () => {
  const target = fixture("sync-agent-assets-cli-install-");
  try {
    const result = spawnSync("npx", [
      "--yes", "skills@1.7.4", "add", repositoryRoot,
      "--skill", "sync-agent-assets",
      "--skill", "coding",
      "--skill", "coding-with-rules",
      "--agent", "pi",
      "--agent", "opencode",
      "--agent", "claude-code",
      "--yes",
    ], { cwd: target, encoding: "utf8", maxBuffer: 20 * 1024 * 1024, timeout: 120_000 });
    assert.equal(result.status, 0, result.stderr);
    const projection = join(target, ".claude", "skills", "sync-agent-assets");
    assert.equal(readlinkSync(projection), "../../.agents/skills/sync-agent-assets");
    assert.equal(existsSync(join(target, ".agents", "skills", "sync-agent-assets", "scripts", "sync-agent-assets.mjs")), true);
    for (const name of ["coding", "coding-with-rules"]) {
      assert.equal(readlinkSync(join(target, ".claude", "skills", name)), `../../.agents/skills/${name}`);
      assert.equal(existsSync(join(target, ".agents", "skills", name, "SKILL.md")), true);
    }
    const references = join(".agents", "skills", "coding-with-rules", "references");
    for (const name of readdirSync(join(repositoryRoot, references))) {
      assert.equal(readFileSync(join(target, references, name), "utf8"), readFileSync(join(repositoryRoot, references, name), "utf8"));
    }
    assert.equal(existsSync(join(target, "skills-lock.json")), true);
  } finally {
    rmSync(target, { recursive: true, force: true });
  }
});

test("record refuses target skill directories with unmanaged extra files", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-extra-");
  try {
    installSyntheticAssets(source.root, target);
    writeFileSync(join(target, ".agents", "skills", "grilling", "local.txt"), "extra\n");
    const result = run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selectionFile(target),
    ]);
    assert.equal(result.status, 3);
    assert.match(result.stderr, /differs structurally/);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("record apply rejects a symbolic-link lock directory", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-lock-symlink-");
  try {
    installSyntheticAssets(source.root, target);
    const selection = selectionFile(target);
    const plan = JSON.parse(run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
    ]).stdout);
    renameSync(join(target, ".agents"), join(target, ".agents-real"));
    symlinkSync(".agents-real", join(target, ".agents"), "dir");

    const result = run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
      "--apply", "--confirm", "--plan-id", plan.planId,
    ]);
    assert.equal(result.status, 3);
    assert.match(result.stderr, /path component must not be a symbolic link/);
    assert.equal(existsSync(join(target, ".agents-real", "ai-assets.lock.json")), false);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("record rejects symbolic links inside managed skill directories", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-symlink-");
  try {
    installSyntheticAssets(source.root, target);
    symlinkSync("SKILL.md", join(target, ".agents", "skills", "grilling", "linked.md"));
    const result = run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selectionFile(target),
    ]);
    assert.equal(result.status, 3);
    assert.match(result.stderr, /must not contain symbolic links/);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("catalog rejects uncatalogued source skills", () => {
  const source = syntheticSource();
  try {
    writeSkill(source.root, "uncatalogued-skill");
    const result = run(["catalog", "--source-root", source.root]);
    assert.equal(result.status, 3);
    assert.match(result.stderr, /Catalog coverage mismatch/);
    assert.match(result.stderr, /uncatalogued-skill/);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
  }
});

test("record rejects credential-like adaptation data", () => {
  const source = syntheticSource();
  const target = fixture("sync-agent-assets-secret-");
  try {
    installSyntheticAssets(source.root, target);
    const selection = selectionFile(target);
    const data = JSON.parse(readFileSync(selection, "utf8"));
    data.adaptations["AGENTS.md"] = "Use github_pat_1234567890abcdefghijklmnop";
    writeFileSync(selection, `${JSON.stringify(data, null, 2)}\n`);
    const result = run([
      "record", "--root", target, "--source-root", source.root,
      "--source-commit", source.commit, "--selection", selection,
    ]);
    assert.equal(result.status, 3);
    assert.match(result.stderr, /credential material/);
  } finally {
    rmSync(source.root, { recursive: true, force: true });
    rmSync(target, { recursive: true, force: true });
  }
});

test("cleanup refuses unmarked temporary directories", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "sync-agent-assets-unmarked-"));
  const sourceRoot = join(tempRoot, "source");
  mkdirSync(sourceRoot);
  try {
    const result = run(["cleanup", "--source-root", sourceRoot]);
    assert.equal(result.status, 3);
    assert.equal(existsSync(tempRoot), true);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("cleanup removes only helper-created temporary source roots", () => {
  const tempRoot = mkdtempSync(join(tmpdir(), "sync-agent-assets-cleanup-"));
  const sourceRoot = join(tempRoot, "source");
  writeFileSync(join(tempRoot, ".sync-agent-assets-temp.json"), `${JSON.stringify({ schemaVersion: 1, owner: "sync-agent-assets", source: "source" })}\n`);
  mkdirSync(sourceRoot);
  const result = run(["cleanup", "--source-root", sourceRoot]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(existsSync(tempRoot), false);
});
