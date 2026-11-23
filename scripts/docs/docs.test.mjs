import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { parse, stringify } from "yaml";
import { catalog, catalogPath, docsBase, groups, root, loadCatalog, parseYaml } from "./data.mjs";
import { checkDocs, checkMarkdownLinks } from "./check.mjs";
import { publicToolEnvironment } from "./environment.mjs";
import { generatedPages } from "./generate.mjs";
import {
  destinationRepository,
  publicationContext,
  publicationTarget,
  publishSite,
} from "./publish.mjs";
import {
  hash,
  passingGates,
  publicText,
  regularFiles,
  verifyDiagrams,
  verifySite,
} from "./verify.mjs";
import { workflows } from "./workflows.mjs";

function temporary(t) {
  const directory = mkdtempSync(join(tmpdir(), "ai-skills-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
}
function put(directory, name, text) {
  const path = join(directory, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  return path;
}
const pass = { validate: "pass", deliver: "pass", check: "pass", "browser-check": "pass" };
function fixture(directory) {
  const candidate = "{}\n";
  const html = "<!doctype html><title>Diagram</title>";
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
  put(
    directory,
    "index.html",
    '<link href="/projects/ai-skills/assets/site.css" rel="stylesheet">',
  );
  put(directory, "diagram-sources/example.json", candidate);
  put(directory, "diagrams/example.html", html);
  put(directory, "diagrams/example.svg", svg);
  const manifest = {
    schemaVersion: 1,
    tool: { revision: "a".repeat(40) },
    artifacts: {
      example: {
        quality: "showcase",
        gates: pass,
        candidateSha256: hash(candidate),
        htmlSha256: hash(html),
        svgSha256: hash(svg),
      },
    },
  };
  put(directory, "diagrams/manifest.json", JSON.stringify(manifest));
  for (const file of [
    "LICENSE",
    "LICENSE-MIT",
    "NOTICE",
    "THIRD_PARTY_NOTICES.md",
    "assets/JetBrainsMono-OFL.txt",
    "explainer/vendor/pele/LICENSE",
  ])
    put(directory, "notices/archify/" + file, "notice\n");
  put(directory, "notices/site-dependencies.txt", "dependency notices\n");
  put(directory, "notices/collection-LICENSE.txt", "collection license\n");
  return manifest;
}
const context = {
  GITHUB_ACTIONS: "true",
  GITHUB_EVENT_NAME: "workflow_dispatch",
  GITHUB_REF: "refs/heads/main",
  GH_TOKEN: "test-only-value",
  GITHUB_REPOSITORY: "example/source",
  GITHUB_RUN_ID: "123",
  GITHUB_RUN_ATTEMPT: "2",
};

test("standalone and hosted bases are accepted without rewriting", () => {
  for (const value of ["/", "/projects/ai-skills/", "/docs_v2/"])
    assert.equal(docsBase(value), value);
});
test("base validation rejects URLs, traversal, encoded separators, empty segments and query state", () => {
  for (const value of [
    "",
    "docs",
    "https://example.test/",
    "//host/",
    "/a//b/",
    "/../",
    "/a/./",
    "/a%2fb/",
    "/a?b/",
    "/a#b/",
    "/a\\b/",
    "/a\n/",
  ])
    assert.throws(() => docsBase(value), /DOCS_BASE/);
});
function catalogFixture(t, change) {
  const directory = temporary(t);
  const data = parse(readFileSync(catalogPath, "utf8"));
  change(data);
  const file = join(directory, "catalog.yaml");
  writeFileSync(file, stringify(data));
  return { directory, file, data };
}

test("catalog parsing rejects duplicate keys, aliases, tags, multiple documents, and unsafe keys", () => {
  for (const text of [
    "a: 1\na: 2",
    "a: &x [1]\nb: *x",
    "a: !unknown text",
    "---\na: 1\n---\nb: 2",
    "__proto__: x",
    "a:\n  constructor: x",
  ]) {
    assert.throws(() => parseYaml(text));
  }
});

test("catalog validation rejects taxonomy drift, unsafe sources, commands, and dependency cycles", (t) => {
  const changes = [
    (c) => {
      c.schemaVersion = 2;
    },
    (c) => {
      c.skills.coding.category = "coding-base";
    },
    (c) => {
      delete c.categories.productivity;
    },
    (c) => {
      c.skills.coding.source.path = "../escape";
    },
    (c) => {
      c.skills.tdd.source.revision = "main";
    },
    (c) => {
      c.skills.tdd.source.repository = "https://user:secret@github.com/mattpocock/skills";
    },
    (c) => {
      c.skills.coding.install.argv = ["npx", "skills@1.7.4", "add", "example/repo"];
    },
    (c) => {
      c.skills.coding.install.argv = ["sh", "-c", "untrusted"];
    },
    (c) => {
      c.skills.coding.prerequisites = ["missing"];
    },
    (c) => {
      c.skills.coding.prerequisites = ["coding-with-rules"];
    },
    (c) => {
      c.skills.coding.legal[0].target = "../escape";
    },
  ];
  for (const change of changes) {
    const f = catalogFixture(t, change);
    assert.throws(() => loadCatalog(f.file));
  }
});

test("catalog coverage rejects uncatalogued source skills, duplicates, and linked categories", (t) => {
  const f = catalogFixture(t, () => {});
  for (const [name, entry] of Object.entries(f.data.skills)) {
    if (entry.source.type !== "local") continue;
    const file = join(f.directory, entry.source.path, "SKILL.md");
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(
      file,
      `---\nname: ${name}\ndescription: Fixture.\n${entry.prerequisites.length ? "requires: " + JSON.stringify(entry.prerequisites) + "\n" : ""}---\n`,
    );
  }
  assert.equal(loadCatalog(f.file, f.directory).skills.length, 28);
  const extra = join(f.directory, ".agents/skills/extra");
  mkdirSync(extra);
  writeFileSync(join(extra, "SKILL.md"), "---\nname: extra\ndescription: Fixture.\n---\n");
  assert.throws(() => loadCatalog(f.file, f.directory), /coverage/);
  rmSync(extra, { recursive: true });
  const duplicate = join(f.directory, ".agents/skills/duplicate/coding");
  mkdirSync(duplicate, { recursive: true });
  writeFileSync(join(duplicate, "SKILL.md"), "---\nname: coding\ndescription: Fixture.\n---\n");
  assert.throws(() => loadCatalog(f.file, f.directory), /Duplicate local skill name/);
  rmSync(dirname(duplicate), { recursive: true });
  symlinkSync(join(f.directory, ".agents/skills/coding"), extra, "dir");
  assert.throws(() => loadCatalog(f.file, f.directory), /Symlink/);
});

test("catalog groups are an exact partition, not a replacement inventory", () => {
  const names = groups.flatMap((group) => group.skills);
  assert.equal(names.length, new Set(names).size);
  assert.deepEqual(new Set(names), new Set(catalog().skills.map((skill) => skill.name)));
  assert.equal(catalog().skills.filter((skill) => skill.source.type !== "local").length, 8);
});
test("every catalog entry and recipe has one generated page and a meaningful stopping boundary", () => {
  const pages = generatedPages();
  for (const entry of catalog().skills) {
    const page = pages.get(`skills/${entry.name}.md`);
    assert.match(page, /Requirements and boundaries/);
    if (entry.kind === "adapted" && entry.source.type !== "local") {
      assert.match(page, /Read the pinned upstream input/);
      assert.match(page, /review the output and legal notices before use/);
    } else assert.match(page, /Authoritative|authoritative/);
  }
  assert.equal(workflows.length, 25);
  for (const recipe of workflows) {
    assert.ok(pages.has(`workflows/${recipe.id}.md`));
    assert.ok(recipe.limit.length > 0);
    assert.ok(recipe.steps.length > 1);
  }
});
test("all checked-in learning pages, six requirements, diagram sources, hashes and local links agree", () => {
  const result = checkDocs();
  assert.equal(result.skills, 28);
  assert.equal(result.instructionEdges, 6);
  assert.equal(result.diagrams, 32);
  assert.equal(result.pages, 77);
});
test("raw legal-download links are checked alongside Markdown links", () => {
  assert.ok(checkMarkdownLinks([join(root, "docs/reference/notices.md")]).local >= 8);
});
test("broken Markdown and raw HTML links fail instead of being ignored", (t) => {
  const directory = temporary(t);
  for (const text of ["[bad](/missing-page)", '<a href="/missing-license" download>bad</a>']) {
    const file = put(directory, "check.md", text);
    assert.throws(() => checkMarkdownLinks([file]), /Broken local link/);
  }
});
test("only the exact four passing native gates count as success", () => {
  assert.equal(passingGates(pass), true);
  for (const value of [
    null,
    {},
    { ...pass, "browser-check": "skipped" },
    { validate: "pass", deliver: "pass", check: "pass", other: "pass" },
    { ...pass, extra: "pass" },
  ])
    assert.equal(passingGates(value), false);
});
test("public artifacts reject local paths and credential-shaped strings", () => {
  publicText(Buffer.from("relative sources and git@github.com:example/repo.git"));
  for (const text of [
    "/home/example/private",
    "C:\\Users\\Example\\private",
    "file:///private",
    "/tmp/private-file",
    "ghp_" + "x".repeat(25),
  ])
    assert.throws(() => publicText(Buffer.from(text)), /Public artifact/);
});
test("a complete regular artifact verifies without runtime downloads or credentials", (t) => {
  const directory = temporary(t);
  fixture(directory);
  assert.equal(verifySite(directory).diagrams, 1);
  assert.equal(readdirSync(directory).includes("node_modules"), false);
});
test("changed native HTML, SVG, and candidate bytes each invalidate their receipt hash", (t) => {
  const directory = temporary(t);
  for (const file of [
    "diagrams/example.html",
    "diagrams/example.svg",
    "diagram-sources/example.json",
  ]) {
    fixture(directory);
    put(directory, file, "changed");
    assert.throws(() => verifySite(directory), /hash mismatch/);
  }
});
test("missing notices, empty manifest and nonpassing gates stop publication verification", (t) => {
  const directory = temporary(t);
  const manifest = fixture(directory);
  rmSync(join(directory, "notices/archify/NOTICE"));
  assert.throws(() => verifySite(directory), /Missing Archify notice/);
  fixture(directory);
  manifest.artifacts = {};
  put(directory, "diagrams/manifest.json", JSON.stringify(manifest));
  assert.throws(() => verifySite(directory), /empty/);
  const invalid = fixture(directory);
  invalid.artifacts.example.gates = { ...pass, check: "fail" };
  put(directory, "diagrams/manifest.json", JSON.stringify(invalid));
  assert.throws(() => verifySite(directory), /gate result/);
});
test("diagram IDs and renderer pins cannot become arbitrary filesystem paths", (t) => {
  const directory = temporary(t);
  const manifest = fixture(directory);
  assert.throws(
    () =>
      verifyDiagrams(
        join(directory, "diagrams"),
        join(directory, "diagram-sources"),
        "b".repeat(40),
      ),
    /provenance/,
  );
  manifest.artifacts["../outside"] = manifest.artifacts.example;
  put(directory, "diagrams/manifest.json", JSON.stringify(manifest));
  assert.throws(() => verifySite(directory), /identity/);
});
test("symlinks and hidden secret files are rejected, but .nojekyll is harmless", (t) => {
  const directory = temporary(t);
  fixture(directory);
  put(directory, ".nojekyll", "");
  assert.ok(regularFiles(directory).includes(".nojekyll"));
  symlinkSync(join(directory, "index.html"), join(directory, "linked.html"));
  assert.throws(() => verifySite(directory), /unsafe entry/);
  rmSync(join(directory, "linked.html"));
  put(directory, ".env", "TEST_ONLY=fixture");
  assert.throws(() => verifySite(directory), /unsafe entry/);
});
test("publication accepts main pushes and dispatches with a token and valid run identity", () => {
  for (const event of ["push", "workflow_dispatch"])
    assert.equal(
      publicationContext({ ...context, GITHUB_EVENT_NAME: event }).branch,
      "docs-publish/ai-skills/123-2",
    );
  for (const changed of [
    { GITHUB_ACTIONS: "false" },
    { GITHUB_EVENT_NAME: "pull_request" },
    { GITHUB_EVENT_NAME: "pull_request_target" },
    { GITHUB_EVENT_NAME: "workflow_run" },
    { GITHUB_EVENT_NAME: "schedule" },
    { GITHUB_REF: "refs/heads/topic" },
    { GITHUB_REF: "refs/tags/main" },
    { GH_TOKEN: "" },
    { GITHUB_RUN_ID: "../bad" },
    { GITHUB_REPOSITORY: "bad; command" },
  ])
    assert.throws(() => publicationContext({ ...context, ...changed }));
  assert.throws(() => publishSite("unused", "unused", {}), /trusted main/);
});
test("destination path stays fixed and rejects symlinked project parents", (t) => {
  const directory = temporary(t);
  assert.equal(publicationTarget(directory), join(directory, "projects/ai-skills"));
  const outside = temporary(t);
  symlinkSync(outside, join(directory, "projects"), "dir");
  assert.throws(() => publicationTarget(directory), /real project directory/);
});
test("publication refuses overlapping artifact and destination before Git or writes", (t) => {
  const directory = temporary(t);
  const artifact = join(directory, "artifact");
  mkdirSync(artifact);
  assert.throws(() => publishSite(artifact, directory, context), /must be disjoint/);
  assert.equal(existsSync(join(directory, "projects")), false);
});
function publicationFixture(
  t,
  { unchanged = false, failCreate = false, invalidList = false } = {},
) {
  const artifact = temporary(t);
  fixture(artifact);
  const checkout = temporary(t);
  put(checkout, "README.md", "Keep this file.\n");
  put(checkout, "projects/other/keep.txt", "Unrelated project.\n");
  if (unchanged) cpSync(artifact, join(checkout, "projects/ai-skills"), { recursive: true });
  else {
    put(checkout, "projects/ai-skills/index.html", "Older site.\n");
    put(checkout, "projects/ai-skills/obsolete.txt", "Remove from generated output.\n");
  }
  const env = {
    PATH: process.env.PATH,
    HOME: temporary(t),
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: "/dev/null",
    ...context,
  };
  const localCommand = (executable, args, cwd = checkout, commandEnv = env) => {
    const result = spawnSync(executable, args, {
      cwd,
      env: commandEnv,
      encoding: "utf8",
      timeout: 10000,
    });
    assert.equal(result.status, 0, result.error?.message || result.stderr);
    return result.stdout.trim();
  };
  const git = (args) => localCommand("git", ["-c", "core.hooksPath=/dev/null", ...args]);
  git(["init", "--initial-branch=main"]);
  git(["config", "user.name", "Publication test"]);
  git(["config", "user.email", "publication@example.invalid"]);
  git(["remote", "add", "origin", `https://github.com/${destinationRepository}.git`]);
  git(["add", "."]);
  git(["commit", "-m", "Initial destination"]);
  const proposal = (number, run) => ({
    number,
    base: "main",
    head: `docs-publish/ai-skills/${run}-1`,
    repository: destinationRepository,
    body: `Documentation artifact from https://github.com/${context.GITHUB_REPOSITORY}/actions/runs/${run}.\n\nReview and merge separately; this publisher does not merge or deploy.`,
  });
  const proposals = [
    proposal(10, 100),
    proposal(11, 101),
    { ...proposal(12, 102), repository: "someone/fork" },
    { ...proposal(13, 103), body: "An owner-authored proposal." },
    { ...proposal(14, 104), head: "feature/other" },
    { ...proposal(15, 105), base: "topic" },
    { ...proposal(16, 106), body: proposal(16, 999).body },
    {
      ...proposal(17, 107),
      body: proposal(17, 107).body.replace(context.GITHUB_REPOSITORY, "unrelated/source"),
    },
  ];
  const calls = [];
  const url = `https://github.com/${destinationRepository}/pull/20`;
  const runCommand = (executable, args, cwd, commandEnv) => {
    calls.push({ executable, args });
    if (executable === "git" && args.includes("push")) return "";
    if (executable === "gh") {
      if (args[0] === "api") {
        assert.ok(args.includes("--paginate"));
        assert.ok(args.includes("--jq"));
        assert.ok(args.at(-1).endsWith("| tojson"));
        assert.equal(
          args[2],
          `repos/${destinationRepository}/pulls?state=open&base=main&per_page=100`,
        );
        return [proposals.slice(0, 1), invalidList ? {} : proposals.slice(1)]
          .map((page) => JSON.stringify(page))
          .join("\n");
      }
      if (args[0] === "pr" && args[1] === "create") {
        if (failCreate) throw new Error("Simulated PR creation failure");
        return url;
      }
      if (args[0] === "pr" && args[1] === "close") return "";
      assert.fail("Unexpected remote command");
    }
    assert.ok(["git", "rsync"].includes(executable));
    return localCommand(executable, args, cwd, commandEnv);
  };
  return { artifact, checkout, env, runCommand, calls, url };
}
test("a changed snapshot creates a replacement PR before closing only managed proposals", (t) => {
  const f = publicationFixture(t);
  assert.equal(publishSite(f.artifact, f.checkout, f.env, f.runCommand), f.url);
  const remote = f.calls.filter((call) => call.executable === "gh");
  assert.deepEqual(
    remote.map((call) => call.args.slice(0, 2)),
    [
      ["api", "--paginate"],
      ["pr", "create"],
      ["pr", "close"],
      ["pr", "close"],
    ],
  );
  assert.deepEqual(
    remote.slice(2).map((call) => call.args[2]),
    ["10", "11"],
  );
  for (const call of remote.slice(2)) assert.ok(call.args.at(-1).includes(f.url));
  assert.equal(readFileSync(join(f.checkout, "README.md"), "utf8"), "Keep this file.\n");
  assert.equal(existsSync(join(f.checkout, "projects/other/keep.txt")), true);
  assert.equal(existsSync(join(f.checkout, "projects/ai-skills/obsolete.txt")), false);
});
test("a snapshot matching destination main closes stale proposals without a new commit or PR", (t) => {
  const f = publicationFixture(t, { unchanged: true });
  assert.match(publishSite(f.artifact, f.checkout, f.env, f.runCommand), /Output unchanged/);
  const remote = f.calls.filter((call) => call.executable === "gh");
  assert.deepEqual(
    remote.slice(1).map((call) => call.args[2]),
    ["10", "11"],
  );
  assert.equal(
    f.calls.some((call) => call.args.includes("commit") || call.args.includes("push")),
    false,
  );
});
test("a failed replacement PR leaves existing publication proposals open", (t) => {
  const f = publicationFixture(t, { failCreate: true });
  assert.throws(
    () => publishSite(f.artifact, f.checkout, f.env, f.runCommand),
    /PR creation failure/,
  );
  assert.equal(
    f.calls.some((call) => call.args[1] === "close"),
    false,
  );
});
test("a malformed PR listing stops before destination output changes", (t) => {
  const f = publicationFixture(t, { invalidList: true });
  assert.throws(
    () => publishSite(f.artifact, f.checkout, f.env, f.runCommand),
    /pull request response/,
  );
  assert.equal(
    f.calls.some((call) => call.executable === "rsync"),
    false,
  );
  assert.equal(
    readFileSync(join(f.checkout, "projects/ai-skills/index.html"), "utf8"),
    "Older site.\n",
  );
});
test("rendering environment excludes credentials and Node preload state", (t) => {
  const directory = temporary(t);
  const env = publicToolEnvironment(directory, {
    PATH: "/test/bin",
    GH_TOKEN: "fixture",
    OPENAI_API_KEY: "fixture",
    NODE_OPTIONS: "--require untrusted",
    LANG: "C.UTF-8",
  });
  assert.equal(env.PATH, "/test/bin");
  for (const key of ["GH_TOKEN", "OPENAI_API_KEY", "NODE_OPTIONS"])
    assert.equal(Object.hasOwn(env, key), false);
  assert.equal(env.HOME, directory);
  assert.ok(existsSync(env.TMPDIR));
});
test("main-push publication workflow has immutable actions and no merge or deployment step", () => {
  const text = readFileSync(join(root, ".github/workflows/docs.publish.yml"), "utf8");
  const workflow = parse(text);
  assert.deepEqual(Object.keys(workflow.on), ["push", "workflow_dispatch"]);
  assert.deepEqual(workflow.on.push.branches, ["main"]);
  assert.equal(workflow.on.workflow_dispatch, null);
  assert.equal(workflow.permissions.contents, "read");
  assert.equal(workflow.concurrency.queue, "max");
  assert.equal(workflow.concurrency["cancel-in-progress"], false);
  assert.match(
    workflow.jobs["publication-pr"].if,
    /^github\.ref == 'refs\/heads\/main' && \(github\.event_name == 'push' \|\| github\.event_name == 'workflow_dispatch'\)$/,
  );
  for (const job of Object.values(workflow.jobs))
    for (const step of job.steps) if (step.uses) assert.match(step.uses, /@[a-f0-9]{40}$/);
  assert.deepEqual(workflow.jobs["publication-pr"].needs, "build");
  assert.match(text, /mise exec -- pnpm audit/);
  assert.doesNotMatch(text, /gh pr merge|deploy-pages|--force|inputs\.publish|DOCS_PUBLISH/);
  const publisher = readFileSync(join(root, "scripts/docs/publish.mjs"), "utf8");
  assert.doesNotMatch(publisher, /"merge"|"--force"|"--global"/);
  assert.match(publisher, /projects\/ai-skills/);
});
