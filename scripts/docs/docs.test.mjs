import assert from "node:assert/strict";
import {
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
import { parse } from "yaml";
import { catalog, docsBase, groups, root } from "./data.mjs";
import { checkDocs, checkMarkdownLinks } from "./check.mjs";
import { publicToolEnvironment } from "./environment.mjs";
import { generatedPages } from "./generate.mjs";
import { publicationContext, publicationTarget, publishSite } from "./publish.mjs";
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
  DOCS_PUBLISH: "true",
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
test("catalog groups are an exact partition, not a replacement inventory", () => {
  const names = groups.flatMap((group) => group.skills);
  assert.equal(names.length, new Set(names).size);
  assert.deepEqual(new Set(names), new Set(catalog().skills.map((skill) => skill.name)));
  assert.equal(catalog().skills.filter((skill) => skill.source.type !== "local").length, 4);
});
test("every catalog entry and recipe has one generated page and a meaningful stopping boundary", () => {
  const pages = generatedPages();
  for (const entry of catalog().skills) {
    const page = pages.get(`skills/${entry.name}.md`);
    assert.match(page, /Requirements and boundaries/);
    assert.match(page, /Authoritative|authoritative/);
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
  assert.equal(result.diagrams, 27);
  assert.equal(result.pages, 71);
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
test("publication requires manual main, explicit publish, token, and valid run identity", () => {
  assert.equal(publicationContext(context).branch, "docs-publish/ai-skills/123-2");
  for (const changed of [
    { GITHUB_ACTIONS: "false" },
    { GITHUB_EVENT_NAME: "pull_request" },
    { GITHUB_EVENT_NAME: "push" },
    { GITHUB_REF: "refs/heads/topic" },
    { DOCS_PUBLISH: "false" },
    { GH_TOKEN: "" },
    { GITHUB_RUN_ID: "../bad" },
    { GITHUB_REPOSITORY: "bad; command" },
  ])
    assert.throws(() => publicationContext({ ...context, ...changed }));
  assert.throws(() => publishSite("unused", "unused", {}), /explicit manual/);
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
test("manual publication workflow has immutable actions and no merge or deployment step", () => {
  const text = readFileSync(join(root, ".github/workflows/docs.publish.yml"), "utf8");
  const workflow = parse(text);
  assert.deepEqual(Object.keys(workflow.on), ["workflow_dispatch"]);
  assert.equal(workflow.on.workflow_dispatch.inputs.publish.default, false);
  assert.equal(workflow.permissions.contents, "read");
  assert.match(
    workflow.jobs["publication-pr"].if,
    /workflow_dispatch.*refs\/heads\/main.*inputs.publish/,
  );
  for (const job of Object.values(workflow.jobs))
    for (const step of job.steps) if (step.uses) assert.match(step.uses, /@[a-f0-9]{40}$/);
  assert.doesNotMatch(text, /gh pr merge|deploy-pages|--force/);
  const publisher = readFileSync(join(root, "scripts/docs/publish.mjs"), "utf8");
  assert.doesNotMatch(publisher, /"merge"|"--force"|"--global"/);
  assert.match(publisher, /projects\/ai-skills/);
});
