import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "yaml";
import { catalog, groups, root } from "./data.mjs";
import { dependencySpec, groupSpec, workflowGuideSpec, workflowSpec } from "./diagram-specs.mjs";
import { generate } from "./generate.mjs";
import { notes } from "./skill-notes.mjs";
import { verifyDiagrams } from "./verify.mjs";
import { workflowGuides, workflows } from "./workflows.mjs";

export function markdownFiles(directory = join(root, "docs")) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if ([".vitepress", "public", "diagrams"].includes(entry.name) || entry.isSymbolicLink())
      return [];
    const path = join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith(".md") ? [path] : [];
  });
}
export function checkMarkdownLinks(files = markdownFiles()) {
  const external = new Set();
  let local = 0;
  for (const file of files) {
    const text = readFileSync(file, "utf8").replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, "");
    const hrefs = [
      ...text.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g),
      ...text.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g),
    ].map((match) => match[1]);
    for (const href of hrefs) {
      if (/^https?:\/\//.test(href)) {
        external.add(href);
        continue;
      }
      if (href.startsWith("#") || href.startsWith("mailto:")) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(href))
        throw new Error("Unsupported documentation link protocol");
      const path = decodeURIComponent(href.split(/[?#]/)[0]);
      const target = path.startsWith("/")
        ? join(root, "docs", path.slice(1))
        : resolve(dirname(file), path);
      const publicTarget = join(root, "docs/public", relative(join(root, "docs"), target));
      const candidates = [target, `${target}.md`, join(target, "index.md"), publicTarget];
      // Downloadable copies are generated for serving; the editable source is authoritative during a source check.
      if (path.startsWith("/diagram-sources/"))
        candidates.push(join(root, "docs/diagrams", path.slice("/diagram-sources/".length)));
      if (path === "/notices/collection-LICENSE.txt") candidates.push(join(root, "LICENSE"));
      if (path === "/notices/site-dependencies.txt")
        candidates.push(join(root, "scripts/docs/notices.mjs"));
      if (!candidates.some((candidate) => candidate && existsSync(candidate)))
        throw new Error(`Broken local link in ${relative(root, file)}: ${href}`);
      local++;
    }
  }
  return { local, external: [...external] };
}
export function checkDocs() {
  const c = catalog();
  generate({ check: true });
  for (const entry of c.skills) {
    assert.ok(notes[entry.name], `Missing reader guidance: ${entry.name}`);
    assert.ok(
      workflows.some(
        (recipe) =>
          recipe.steps.some((step) => step.skill === entry.name) ||
          recipe.optional.includes(entry.name),
      ),
      `Missing workflow coverage: ${entry.name}`,
    );
    if (entry.source.type === "local") {
      const text = readFileSync(join(root, entry.source.path, "SKILL.md"), "utf8");
      const metadata = parse(text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
      assert.deepEqual(
        metadata.requires ?? [],
        entry.prerequisites,
        `Instruction/catalog requirements disagree: ${entry.name}`,
      );
    }
  }
  assert.deepEqual(
    new Set(groups.flatMap((group) => group.skills)),
    new Set(c.skills.map((entry) => entry.name)),
  );
  for (const recipe of workflows)
    for (const name of [...recipe.steps.map((step) => step.skill), ...recipe.optional])
      assert.ok(c.byName.has(name), `Unknown workflow skill: ${name}`);
  const directory = join(root, "docs/diagrams");
  const manifest = verifyDiagrams(
    join(root, "docs/public/diagrams"),
    directory,
    c.byName.get("archify").source.revision,
    join(directory, "manifest.json"),
  );
  const ids = [
    "required-dependencies",
    "skill-groups",
    ...workflowGuides.map((guide) => guide.id),
    ...workflows.map((recipe) => recipe.id),
  ];
  assert.deepEqual(
    new Set(Object.keys(manifest.artifacts)),
    new Set(ids),
    "Diagram coverage changed",
  );
  for (const id of ids) {
    const actual = JSON.parse(readFileSync(join(directory, `${id}.json`), "utf8"));
    const guide = workflowGuides.find((item) => item.id === id);
    const expected = guide
      ? workflowGuideSpec(guide, actual.meta.repository)
      : id === "required-dependencies"
        ? dependencySpec(actual.meta.repository)
        : id === "skill-groups"
          ? groupSpec(actual.meta.repository)
          : workflowSpec(
              workflows.find((recipe) => recipe.id === id),
              actual.meta.repository,
            );
    assert.deepEqual(actual, expected, `Diagram recipe/layout is stale: ${id}`);
  }
  const profiles = readdirSync(join(root, "docs/skills"))
    .filter((file) => file.endsWith(".md") && file !== "index.md")
    .map((file) => file.slice(0, -3));
  assert.deepEqual(
    new Set(profiles),
    new Set(c.skills.map((entry) => entry.name)),
    "Stale or missing skill profiles",
  );
  const links = checkMarkdownLinks();
  return {
    skills: c.skills.length,
    workflows: workflows.length,
    diagrams: ids.length,
    instructionEdges: c.skills.reduce((sum, entry) => sum + entry.prerequisites.length, 0),
    pages: markdownFiles().length,
    localLinks: links.local,
    externalLinks: links.external.length,
  };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length !== 2) throw new Error("Usage: node scripts/docs/check.mjs");
  console.log(JSON.stringify(checkDocs()));
}
