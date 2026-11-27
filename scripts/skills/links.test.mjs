import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { loadCatalog } from "./catalog.mjs";
import { buildPlan } from "./install.mjs";
import { rebaseSkillLinks, rewriteMarkdown } from "./links.mjs";
const catalog = loadCatalog(),
  ref = "a312adedd630b3cf25d32000d29c77c5b531e769";
function fixture(t, options = {}) {
  const target = mkdtempSync(join(tmpdir(), "markdown-links-"));
  t.after(() => rmSync(target, { recursive: true, force: true }));
  const plan = buildPlan(
    {
      target,
      skills: ["cleanup-workspaces", "background-agents"],
      agents: ["pi"],
      ref,
      ...options,
    },
    catalog,
    { home: target, env: {} },
  );
  const entry =
    plan.entries.find((entry) => entry.name === "cleanup-workspaces") ?? plan.entries[0];
  return { target, plan, entry };
}
const old = "../../utility/background-agents/SKILL.md";
for (const [label, before, after] of [
  [
    "inline link with title",
    `[Delegate](${old}#lanes "Keep title")`,
    '[Delegate](../background-agents/SKILL.md#lanes "Keep title")',
  ],
  ["image", `![Delegate](${old})`, "![Delegate](../background-agents/SKILL.md)"],
  [
    "reference definition",
    `[Delegate][ref]\n\n[ref]: <${old}> 'Keep title'`,
    "[Delegate][ref]\n\n[ref]: <../background-agents/SKILL.md> 'Keep title'",
  ],
  [
    "UTF-16 offsets and CRLF",
    `😃 [Delegate](${old})\r\n`,
    "😃 [Delegate](../background-agents/SKILL.md)\r\n",
  ],
  [
    "encoded filename and suffix",
    `[Asset](${old.replace("SKILL.md", "assets/My%20file%20%281%29.md")}?raw=1#section)`,
    "[Asset](../background-agents/assets/My%20file%20%281%29.md?raw=1#section)",
  ],
  [
    "directory trailing slash",
    `[Files](${old.replace("SKILL.md", "references/")}#rules)`,
    "[Files](../background-agents/references/#rules)",
  ],
  [
    "same-skill links",
    "[Git](references/git.md) [Files](references/) [Local](./README.md)",
    "[Git](references/git.md) [Files](references/) [Local](./README.md)",
  ],
  [
    "already-valid selected sibling",
    "[Helper](../isolated-workspace/SKILL.md)",
    "[Helper](../isolated-workspace/SKILL.md)",
  ],
  [
    "URLs and anchors",
    "[Web](https://example.com/x) [Anchor](#rules) [Root](/docs/x) [Query](?raw=1) [Mail](mailto:a@example.com)",
    "[Web](https://example.com/x) [Anchor](#rules) [Root](/docs/x) [Query](?raw=1) [Mail](mailto:a@example.com)",
  ],
  [
    "code and HTML",
    `\`[Example](${old})\`\n\n\`\`\`md\n[Example](${old})\n\`\`\`\n\n<a href="${old}">HTML unchanged</a>`,
    `\`[Example](${old})\`\n\n\`\`\`md\n[Example](${old})\n\`\`\`\n\n<a href="${old}">HTML unchanged</a>`,
  ],
])
  test(`Markdown URL-only rebasing preserves ${label}`, (t) => {
    const f = fixture(t);
    assert.equal(rewriteMarkdown(before, { ...f, file: "README.md" }).text, after);
  });
test("nested supporting Markdown rebases against its own source and destination directories", (t) => {
  const f = fixture(t);
  assert.equal(
    rewriteMarkdown("[Delegate](../../../utility/background-agents/SKILL.md)", {
      ...f,
      file: "references/lanes.md",
    }).text,
    "[Delegate](../../background-agents/SKILL.md)",
  );
});
test("frontmatter stays byte-for-byte unchanged while body links are rebased", (t) => {
  const f = fixture(t),
    header = `---\nname: cleanup-workspaces\ndescription: '[Example](${old})'\n---\n`;
  assert.equal(
    rewriteMarkdown(header + `[Delegate](${old})`, { ...f, file: "SKILL.md" }).text,
    header + "[Delegate](../background-agents/SKILL.md)",
  );
});
test("unselected skill links use source-ref URLs without adding dependencies", (t) => {
  const f = fixture(t, { skills: ["cleanup-workspaces"] });
  assert.equal(
    rewriteMarkdown(`[Delegate](${old})`, { ...f, file: "README.md" }).text,
    `[Delegate](https://github.com/dragoscirjan/ai/blob/${ref}/.agents/skills/utility/background-agents/SKILL.md)`,
  );
  assert.equal(
    f.plan.entries.some((entry) => entry.name === "background-agents"),
    false,
  );
});
test("source-repository documents do not accidentally link to destination-project policy", (t) => {
  const f = fixture(t);
  assert.equal(
    rewriteMarkdown("[Source](../../../../docs/maintenance/index.md#guide)", {
      ...f,
      file: "README.md",
    }).text,
    `[Source](https://github.com/dragoscirjan/ai/blob/${ref}/docs/maintenance/index.md#guide)`,
  );
});
test("fallback images and image references use raw file URLs", (t) => {
  const f = fixture(t),
    url = `https://raw.githubusercontent.com/dragoscirjan/ai/${ref}/docs/logo.svg`;
  assert.equal(
    rewriteMarkdown(
      "![Logo](../../../../docs/logo.svg)\n\n![Logo][logo]\n\n[logo]: ../../../../docs/logo.svg",
      { ...f, file: "README.md" },
    ).text,
    `![Logo](${url})\n\n![Logo][logo]\n\n[logo]: ${url}`,
  );
});
test("upstream links use the upstream repository and immutable revision", (t) => {
  const f = fixture(t, { skills: ["writing-for-agents"] }),
    revision = f.entry.source.revision;
  assert.equal(
    rewriteMarkdown("[Source](../../../README.md)", { ...f, file: "README.md" }).text,
    `[Source](https://github.com/mattpocock/skills/blob/${revision}/README.md)`,
  );
});
test("custom and personal outputs use their actual destination layouts", (t) => {
  for (const options of [{ skillsDir: "plugin/skills", agents: ["claude-code"] }, {}]) {
    const f = fixture(t, options);
    assert.equal(
      rewriteMarkdown(`[Delegate](${old})`, { ...f, file: "README.md" }).text,
      "[Delegate](../background-agents/SKILL.md)",
    );
  }
  const f = fixture(t, { skills: ["sync-my-agents"], scope: "personal" });
  assert.match(
    rewriteMarkdown("[Guide](../../../../docs/guide/install.md)", { ...f, file: "README.md" }).text,
    new RegExp(`/blob/${ref}/docs/guide/install.md`),
  );
});
test("rebasing preserves required legal bytes and never follows source symlinks", (t) => {
  const f = fixture(t),
    root = join(f.target, "acquired");
  mkdirSync(root);
  const text = `[Delegate](${old})`;
  writeFileSync(join(root, "README.md"), text);
  writeFileSync(join(root, "NOTICE.md"), text);
  const entry = { ...f.entry, legal: [{ target: "NOTICE.md" }] };
  assert.equal(rebaseSkillLinks(root, entry, f.plan), 1);
  assert.equal(readFileSync(join(root, "NOTICE.md"), "utf8"), text);
  assert.equal(
    readFileSync(join(root, "README.md"), "utf8"),
    "[Delegate](../background-agents/SKILL.md)",
  );
  symlinkSync(join(f.target, "private.md"), join(root, "unsafe.md"));
  assert.throws(() => rebaseSkillLinks(root, entry, f.plan), /Symlink/);
});
test("invalid UTF-8 stops instead of altering bytes outside URL spans", (t) => {
  const f = fixture(t),
    root = join(f.target, "invalid");
  mkdirSync(root);
  const path = join(root, "README.md"),
    bytes = Buffer.concat([Buffer.from([0xff]), Buffer.from(`[Delegate](${old})`)]);
  writeFileSync(path, bytes);
  assert.throws(() => rebaseSkillLinks(root, f.entry, f.plan), /encoded data/);
  assert.deepEqual(readFileSync(path), bytes);
});
test("malformed or repository-escaping paths stop rather than inventing targets", (t) => {
  const f = fixture(t);
  assert.throws(
    () => rewriteMarkdown("[Bad](../../../../../outside.md)", { ...f, file: "README.md" }),
    /escapes repository/,
  );
  assert.throws(
    () => rewriteMarkdown("[Bad](%ZZ)", { ...f, file: "README.md" }),
    /Invalid URL encoding/,
  );
});
