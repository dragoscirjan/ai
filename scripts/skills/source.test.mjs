import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { downloadSource, fetchBytes } from "./source.mjs";

const revision = "a".repeat(40);
const source = {
  type: "github",
  repository: "https://github.com/owner/repo",
  revision,
  path: "skill",
};
function fixture(t, transform = () => {}) {
  const directory = mkdtempSync(join(tmpdir(), "skill-source-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const content = {
    "skill/SKILL.md": "Skill content.\n",
    "skill/supporting.md": "Supporting file.\n",
    LICENSE: "MIT fixture.\n",
    "skill/agents/openai.yaml": "excluded\n",
  };
  const tree = {
    truncated: false,
    tree: Object.entries(content).map(([path, text]) => ({
      path,
      type: "blob",
      mode: "100644",
      sha: createHash("sha1")
        .update(`blob ${Buffer.byteLength(text)}\0${text}`)
        .digest("hex"),
    })),
  };
  transform(tree, content);
  const fetcher = async (url) =>
    url.includes("api.github.com")
      ? new Response(JSON.stringify(tree))
      : new Response(content[decodeURIComponent(url.split(`${revision}/`)[1])] ?? "not found");
  return {
    directory: join(directory, "output"),
    source,
    legal: [{ path: "LICENSE", target: "LICENSE" }],
    exclude: ["**/agents/openai.yaml"],
    fetcher,
  };
}
test("pinned source acquisition verifies blobs, supporting files, legal files, and exclusions", async (t) => {
  const f = fixture(t),
    record = await downloadSource(f);
  assert.equal(record.revision, revision);
  assert.equal(Object.keys(record.files).length, 3);
  assert.equal(readFileSync(join(f.directory, "LICENSE"), "utf8"), "MIT fixture.\n");
  assert.equal(existsSync(join(f.directory, "agents/openai.yaml")), false);
});
test("an in-folder legal record agrees with the selected source instead of colliding", async (t) => {
  const f = fixture(t, (tree, content) => {
    content["skill/LICENSE"] = content.LICENSE;
    tree.tree.push({
      ...tree.tree.find((entry) => entry.path === "LICENSE"),
      path: "skill/LICENSE",
    });
  });
  f.legal = [{ path: "skill/LICENSE", target: "LICENSE" }];
  await downloadSource(f);
  assert.equal(readFileSync(join(f.directory, "LICENSE"), "utf8"), "MIT fixture.\n");
});
test("different legal source paths still conflict even when their bytes are identical", async (t) => {
  const f = fixture(t, (tree, content) => {
    content["skill/LICENSE"] = content.LICENSE;
    tree.tree.push({
      ...tree.tree.find((entry) => entry.path === "LICENSE"),
      path: "skill/LICENSE",
    });
  });
  await assert.rejects(downloadSource(f), /Conflicting source\/legal target/);
  assert.equal(existsSync(f.directory), false);
});
for (const [label, mutate] of [
  [
    "truncated trees",
    (tree) => {
      tree.truncated = true;
    },
  ],
  [
    "unsafe paths",
    (tree) => {
      tree.tree[0].path = "../escape";
    },
  ],
  [
    "duplicate paths",
    (tree) => {
      tree.tree.push(tree.tree[0]);
    },
  ],
  [
    "symlinks",
    (tree) => {
      tree.tree[0].mode = "120000";
    },
  ],
  [
    "submodules",
    (tree) => {
      tree.tree[0].type = "commit";
      tree.tree[0].mode = "160000";
    },
  ],
  [
    "missing legal files",
    (tree) => {
      tree.tree = tree.tree.filter((entry) => entry.path !== "LICENSE");
    },
  ],
  [
    "missing skill files",
    (tree) => {
      tree.tree = tree.tree.filter((entry) => entry.path !== "skill/SKILL.md");
    },
  ],
  [
    "changed bytes",
    (_tree, content) => {
      content["skill/SKILL.md"] = "tampered";
    },
  ],
])
  test(`source acquisition rejects ${label} before writing files`, async (t) => {
    const f = fixture(t, mutate);
    await assert.rejects(downloadSource(f));
    assert.equal(existsSync(f.directory), false);
  });
test("mutable source refs are not acquired", async (t) => {
  const f = fixture(t);
  f.source = { ...source, revision: "main" };
  await assert.rejects(downloadSource(f), /pinned/);
});
test("HTTP errors and oversized source files fail", async () => {
  await assert.rejects(
    fetchBytes("https://example.invalid", async () => new Response("no", { status: 404 })),
    /required source file/,
  );
  await assert.rejects(
    fetchBytes(
      "https://example.invalid",
      async () => new Response(new Uint8Array(8 * 1024 * 1024 + 1)),
    ),
    /size limit/,
  );
});
