import assert from "node:assert/strict";
import { test } from "node:test";
import { notes } from "./skill-notes.mjs";
import { workflows } from "./workflows.mjs";

test("maintained TDD route ends at green and reserves refactoring for review", () => {
  const recipe = workflows.find((item) => item.id === "build-test-first");
  assert.equal(recipe.steps.at(-1).label, "Make the slice pass");
  assert.equal(
    recipe.steps.some((step) => /refactor/i.test(step.label)),
    false,
  );
  assert.match(recipe.limit, /review-stage handoff/);
  assert.match(notes.tdd.stop, /Confirm the public seams/);
  assert.match(notes.tdd.result, /not part of this implementation loop/);
});
test("whole-sentence shortening never ends with Caveman fragment mode", () => {
  const recipe = workflows.find((item) => item.id === "shorten-without-loss");
  assert.equal(
    recipe.steps.some((step) => step.skill === "caveman"),
    false,
  );
  assert.equal(recipe.steps.at(-1).label, "Check complete sentences");
  assert.match(recipe.limit, /separate fragment-style alternative/);
  assert.match(recipe.limit, /explicitly disable/);
  assert.equal(notes["asd-ste100-technical"].companions.includes("caveman"), false);
  assert.equal(notes.caveman.companions.includes("unslop"), false);
  assert.match(notes.caveman.result, /until you explicitly disable/);
});
test("plain-language re-pitching does not compose a conflicting fragment pass", () => {
  assert.equal(notes["wait-what"].companions.includes("caveman"), false);
  assert.equal(
    workflows.find((item) => item.id === "re-pitch-an-explanation").optional.includes("caveman"),
    false,
  );
});
