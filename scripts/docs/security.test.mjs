import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { test } from "node:test";
import { parse } from "yaml";
import { root } from "./data.mjs";

const require = createRequire(import.meta.url);
const vitepressRequire = createRequire(require.resolve("vitepress/package.json"));
const viteRequire = createRequire(vitepressRequire.resolve("vite/package.json"));
const picomatchPath = viteRequire.resolve("picomatch");
const picomatch = viteRequire("picomatch");
const riskyPatterns = ["+(*)", "+(*a)", "*(*)", "*(*a)", "+(*?a)", "+(*a|b)", "+([[]*a)"];

test("installed Vite matcher literalizes repeated wildcard extglobs", () => {
  for (const pattern of riskyPatterns) {
    const literal = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const options of [{}, { maxExtglobRecursion: false }])
      assert.equal(picomatch.makeRe(pattern, options).source, `^(?:${literal})$`, pattern);
  }
  for (const [value, pattern] of [
    ["docs/index.md", "docs/**/*.md"],
    ["abcabc", "+(abc)"],
    ["abba", "+(a|b)"],
    ["***", "+([*])"],
    ["***", "+(\\*)"],
    ["aaa", "+(*(a))"],
  ])
    assert.equal(picomatch.isMatch(value, pattern), true, pattern);
});

test("advisory inputs cannot stall the installed matcher process", () => {
  const result = spawnSync(
    process.execPath,
    [
      "-e",
      `const assert = require('node:assert/strict');
       const picomatch = require(process.argv[1]);
       for (const pattern of JSON.parse(process.argv[2]))
         for (const suffix of ['/', '!'])
           assert.equal(picomatch.isMatch('a'.repeat(48) + suffix, pattern), false);`,
      picomatchPath,
      JSON.stringify(riskyPatterns),
    ],
    { encoding: "utf8", timeout: 3000 },
  );
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr);
});

test("the advisory exception covers only the pinned patched picomatch version", () => {
  const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const lock = parse(readFileSync(join(root, "pnpm-lock.yaml"), "utf8"));
  assert.deepEqual(manifest.pnpm.auditConfig.ignoreGhsas, ["GHSA-fc5q-39xc-vjpf"]);
  assert.deepEqual(
    Object.keys(lock.packages).filter((name) => name.startsWith("picomatch@")),
    ["picomatch@4.0.7"],
  );
  const patch = "patches/picomatch@4.0.7.patch";
  assert.equal(manifest.pnpm.patchedDependencies["picomatch@4.0.7"], patch);
  assert.equal(lock.patchedDependencies["picomatch@4.0.7"].path, patch);
  assert.deepEqual(
    Object.keys(lock.snapshots).filter((name) => name.startsWith("picomatch@")),
    [`picomatch@4.0.7(patch_hash=${lock.patchedDependencies["picomatch@4.0.7"].hash})`],
  );
  assert.equal(readFileSync(join(root, patch), "utf8").includes("hasWildcardStar"), true);
});
