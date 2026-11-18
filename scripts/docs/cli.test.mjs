import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { root } from "./data.mjs";

test("render rejects unknown IDs without an asynchronous import cycle or tool setup", () => {
  const result = spawnSync(
    process.execPath,
    ["scripts/docs/archify.mjs", "render", "not-a-known-diagram"],
    { cwd: root, encoding: "utf8", timeout: 10000 },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /known diagram IDs/);
  assert.doesNotMatch(result.stderr, /unsettled top-level await/);
});
