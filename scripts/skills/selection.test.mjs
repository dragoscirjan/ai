import assert from "node:assert/strict";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { loadCatalog } from "./catalog.mjs";
import { buildPlan } from "./install.mjs";
import { main, reportFailure } from "./sync.mjs";

const catalog = loadCatalog();
function target(t) {
  const folder = mkdtempSync(join(tmpdir(), "skill-selection-"));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  return folder;
}
function options(folder, extra = {}) {
  return { target: folder, categories: ["coding"], agents: ["pi"], ...extra };
}
test("selected category members are not expanded back into the whole category", (t) => {
  const folder = target(t);
  const plan = buildPlan(options(folder, { categorySelections: { coding: ["coding"] } }), catalog);
  assert.deepEqual(plan.categories, ["coding"]);
  assert.deepEqual(plan.selected, ["coding"]);
  assert.deepEqual(
    plan.entries.map((entry) => entry.name),
    ["coding"],
  );
  assert.deepEqual(plan.blocked, []);
  assert.equal(existsSync(join(folder, ".agents")), false);
});
test("mandatory prerequisites are restored and identified even if unchecked", (t) => {
  const plan = buildPlan(
    options(target(t), { categorySelections: { coding: ["coding-with-rules"] } }),
    catalog,
  );
  assert.deepEqual(
    plan.entries.map((entry) => entry.name),
    ["coding", "coding-with-rules"],
  );
  assert.deepEqual(plan.prerequisites, ["coding"]);
});
test("empty category selections skip those members but preserve explicit skill flags", (t) => {
  const plan = buildPlan(
    options(target(t), {
      categories: ["coding", "documentation"],
      skills: ["coding"],
      categorySelections: { coding: [], documentation: ["asd-ste100-technical"] },
    }),
    catalog,
  );
  assert.deepEqual(
    new Set(plan.entries.map((entry) => entry.name)),
    new Set(["coding", "asd-ste100-technical"]),
  );
});
for (const [label, categorySelections] of [
  ["wrong category", { coding: ["asd-ste100-technical"] }],
  ["unknown skill", { coding: ["unknown"] }],
  ["duplicate skill", { coding: ["coding", "coding"] }],
  ["non-array", { coding: "coding" }],
  ["undefined selection", { coding: undefined }],
  ["unselected category", { utility: ["isolated-workspace"] }],
  ["null mapping", null],
])
  test(`invalid category selection rejects ${label}`, (t) =>
    assert.throws(() => buildPlan(options(target(t), { categorySelections }), catalog)));
test("selection cannot change a skill's scope", (t) => {
  assert.throws(
    () =>
      buildPlan(
        options(target(t), {
          categories: ["agentic-work"],
          categorySelections: { "agentic-work": ["sync-my-agents"] },
        }),
        catalog,
      ),
    /Invalid skill selection/,
  );
});
test("each selected category gets its own checklist and unchecked skills stay out", async (t) => {
  const folder = target(t),
    prompts = [],
    output = [];
  let installed;
  await main(["--target", folder, "--category", "coding,documentation", "--agent", "pi"], {
    interactive: true,
    output: (line) => output.push(line),
    prompts: {
      checkbox: async (config) => {
        prompts.push(config);
        assert.equal(config.required, false);
        assert.equal(config.shortcuts.all, "a");
        assert.ok(config.choices.every((choice) => choice.checked));
        if (config.message.includes("Coding")) {
          assert.ok(
            config.choices
              .find((choice) => choice.value === "tdd")
              .name.includes("adaptation required"),
          );
          return ["coding-with-rules"];
        }
        assert.match(config.message, /Documentation/);
        return ["asd-ste100-technical"];
      },
      confirm: async () => true,
    },
    install: async (plan) => {
      installed = plan;
      return plan.entries.map((entry) => entry.name);
    },
  });
  assert.equal(prompts.length, 2);
  assert.deepEqual(
    new Set(installed.entries.map((entry) => entry.name)),
    new Set(["coding", "coding-with-rules", "asd-ste100-technical"]),
  );
  assert.deepEqual(installed.blocked, []);
  assert.match(output.join("\n"), /Required skills added: coding/);
  assert.equal(existsSync(join(folder, ".agents")), false);
});
test("clearing all category checklists cancels before agents or confirmation", async (t) => {
  const folder = target(t),
    output = [];
  let calls = 0;
  await main(["--target", folder, "--category", "utility"], {
    interactive: true,
    output: (line) => output.push(line),
    prompts: {
      checkbox: async (config) => {
        calls++;
        assert.match(config.message, /Skills in Utility/);
        return [];
      },
      confirm: () => assert.fail("Nothing to confirm"),
    },
    install: () => assert.fail("Nothing to install"),
  });
  assert.equal(calls, 1);
  assert.match(output.at(-1), /No skills selected; no installation performed/);
  assert.equal(existsSync(join(folder, ".agents")), false);
});
test("personal scope only offers personal skills from the category", async (t) => {
  const folder = target(t);
  await main(["--target", folder, "--category", "agentic-work", "--scope", "personal"], {
    interactive: true,
    output: () => {},
    prompts: {
      checkbox: async (config) => {
        assert.deepEqual(
          config.choices.map((choice) => choice.value),
          ["sync-my-agents"],
        );
        return [];
      },
      confirm: () => assert.fail(),
    },
    install: () => assert.fail(),
  });
});
test("categories without scoped members do not open empty checklists", async (t) => {
  const folder = target(t),
    output = [],
    never = () => assert.fail("No eligible skills");
  await main(["--target", folder, "--category", "utility", "--scope", "personal"], {
    interactive: true,
    output: (line) => output.push(line),
    prompts: { checkbox: never, confirm: never },
    install: never,
  });
  assert.match(output.join("\n"), /no personal-scoped skills; unchanged/);
});
test("cancelling a category's skill checklist remains a clean no-write cancellation", async (t) => {
  const folder = target(t),
    error = Object.assign(new Error("Cancelled prompt"), { name: "ExitPromptError" });
  await assert.rejects(
    main(["--target", folder, "--category", "utility"], {
      interactive: true,
      output: () => {},
      prompts: {
        checkbox: async () => {
          throw error;
        },
      },
      install: () => assert.fail(),
    }),
    (caught) => caught === error,
  );
  assert.equal(
    reportFailure(error, () => {}),
    130,
  );
  assert.equal(existsSync(join(folder, ".agents")), false);
});
for (const interactive of [false, true])
  test(`--yes retains all category members, interactive=${interactive}`, async (t) => {
    const folder = target(t),
      never = () => assert.fail("Explicit --yes must not open a checklist");
    let installed;
    await main(["--target", folder, "--category", "utility", "--agent", "pi", "--yes"], {
      interactive,
      output: () => {},
      prompts: { checkbox: never, confirm: never },
      install: async (plan) => {
        installed = plan;
        return [];
      },
    });
    assert.deepEqual(new Set(installed.selected), new Set(catalog.groups.utility.skills));
  });
test("JSON dry runs retain deterministic category expansion without any prompt", async (t) => {
  const folder = target(t),
    output = [],
    never = () => assert.fail("JSON output must not prompt");
  await main(
    ["--target", folder, "--category", "utility", "--agent", "pi", "--dry-run", "--json"],
    {
      interactive: true,
      output: (line) => output.push(line),
      prompts: { checkbox: never, confirm: never },
      install: never,
    },
  );
  assert.deepEqual(new Set(JSON.parse(output[0]).selected), new Set(catalog.groups.utility.skills));
});
