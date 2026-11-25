import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { PACKAGE_ROOT, loadCatalog } from "./catalog.mjs";
import { main, reportFailure } from "./sync.mjs";

function target(t) {
  const folder = mkdtempSync(join(tmpdir(), "inquirer-sync-"));
  t.after(() => rmSync(folder, { recursive: true, force: true }));
  return folder;
}
test("interactive selection uses required Inquirer checkboxes and defaults confirmation to no", async (t) => {
  const folder = target(t),
    calls = [],
    output = [];
  await main(["--target", folder], {
    interactive: true,
    output: (line) => output.push(line),
    prompts: {
      checkbox: async (config) => {
        calls.push(config);
        assert.equal(config.required, true);
        assert.equal(config.loop, false);
        if (config.message === "Skill categories") {
          assert.deepEqual(
            config.choices.map((choice) => choice.value),
            Object.keys(loadCatalog().groups),
          );
          assert.ok(config.choices.every((choice) => choice.description));
          return ["utility"];
        }
        assert.equal(config.message, "Target agents");
        assert.deepEqual(
          config.choices.map((choice) => choice.value),
          ["pi", "opencode", "claude-code"],
        );
        return ["pi"];
      },
      confirm: async (config) => {
        calls.push(config);
        assert.equal(config.default, false);
        return false;
      },
    },
    install: () => assert.fail("Declining must not install"),
  });
  assert.equal(calls.length, 3);
  assert.match(output.at(-1), /Cancelled; no installation performed/);
  assert.equal(existsSync(join(folder, ".agents")), false);
});
test("only affirmative confirmation permits installation of the selected plan", async (t) => {
  const folder = target(t);
  let installs = 0;
  await main(["--target", folder, "--skill", "coding-with-rules", "--agent", "pi"], {
    interactive: true,
    output: () => {},
    prompts: {
      checkbox: () => assert.fail("Explicit selections must not prompt"),
      confirm: async () => true,
    },
    install: async (plan, options) => {
      installs++;
      assert.equal(options.confirmed, true);
      assert.deepEqual(
        plan.entries.map((entry) => entry.name),
        ["coding", "coding-with-rules"],
      );
      return plan.entries.map((entry) => entry.name);
    },
  });
  assert.equal(installs, 1);
});
test("explicit noninteractive --yes runs need no prompt", async (t) => {
  const folder = target(t);
  let installs = 0;
  const never = () => assert.fail("Noninteractive flags must not open a prompt");
  await main(["--target", folder, "--skill", "coding", "--agent", "pi", "--yes"], {
    interactive: false,
    output: () => {},
    prompts: { checkbox: never, confirm: never },
    install: async () => {
      installs++;
      return ["coding"];
    },
  });
  assert.equal(installs, 1);
});
test("a dry run does not prompt for confirmation or execute installers", async (t) => {
  const folder = target(t),
    output = [],
    never = () => assert.fail("Dry run must not confirm or install");
  await main(["--target", folder, "--skill", "coding", "--agent", "pi", "--dry-run", "--json"], {
    interactive: false,
    output: (line) => output.push(line),
    prompts: { checkbox: never, confirm: never },
    install: never,
  });
  assert.deepEqual(
    JSON.parse(output[0]).entries.map((entry) => entry.name),
    ["coding"],
  );
});
test("noninteractive missing selections still fail before prompting", async (t) => {
  const folder = target(t),
    never = () => assert.fail("Cannot prompt without a terminal");
  await assert.rejects(
    main(["--target", folder, "--yes"], {
      interactive: false,
      prompts: { checkbox: never, confirm: never },
      install: never,
    }),
    /Choose --category or --skill/,
  );
});
for (const name of ["ExitPromptError", "AbortPromptError"])
  test(`${name} exits cleanly without installation`, async (t) => {
    const folder = target(t),
      error = Object.assign(new Error("Internal prompt stack must not be printed"), { name });
    await assert.rejects(
      main(["--target", folder], {
        interactive: true,
        prompts: {
          checkbox: async () => {
            throw error;
          },
        },
        install: () => assert.fail("Cancellation must not install"),
      }),
      (caught) => caught === error,
    );
    const output = [];
    assert.equal(
      reportFailure(error, (line) => output.push(line)),
      130,
    );
    assert.deepEqual(output, ["Cancelled; no installation performed."]);
    assert.equal(existsSync(join(folder, ".agents")), false);
  });
test("ordinary failures are not misreported as user cancellation", () => {
  const output = [];
  assert.equal(
    reportFailure(new Error("Broken source"), (line) => output.push(line)),
    1,
  );
  assert.deepEqual(output, ["sync-skills: Broken source"]);
});
test("the CLI no longer implements a numbered readline menu", () => {
  const source = readFileSync(join(PACKAGE_ROOT, "scripts/skills/sync.mjs"), "utf8");
  assert.doesNotMatch(source, /node:readline|Choose comma-separated numbers|rl\.question/);
  assert.match(source, /from "@inquirer\/prompts"/);
});
