#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { checkbox, confirm } from "@inquirer/prompts";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { CATALOG_PATH, HARNESSES, check, loadCatalog, supportsScope } from "./catalog.mjs";
import { buildPlan, executePlan, printPlan } from "./install.mjs";

const HELP = `sync-skills — install catalogued skills without editing project instructions

Usage:
  sync-skills list [--json] [--source-root PATH]
  sync-skills [sync] --category coding --agent pi [options]
  sync-skills [sync] --skill coding-with-rules --agent pi [options]

Options:
  --category NAME    Select a catalog group; repeat or use comma-separated names
  --skill NAME       Select an individual skill; prerequisites are included
  --agent NAME       pi, opencode, or claude-code; repeat or use commas
  --target PATH      Destination project root (default: current directory)
  --skills-dir PATH  Copy verified skill folders here, within --target; no agent directories
  --scope SCOPE      project (default) or personal (explicit global installation)
  --ref REF          Source ref for this repository's skills (default: catalog ref)
  --dry-run          Print commands and destinations without fetching or installing
  --json             JSON output for list or a dry run
  --yes              Confirm the displayed installation without an interactive prompt
  --overwrite        Explicitly permit replacing existing selected skill destinations
  --source-root PATH Validate catalog coverage in a source checkout (list only)
  --help             Show this help

Choose categories, then individual skills in each category, then agents with checkboxes.
Each category's skills start selected. A toggles all, Space toggles one, Enter accepts.
Clear a category to skip it; required prerequisites are included in the preview.
--yes, --json, and noninteractive category runs select all scoped members without a checklist.
Use arrow keys to move and Ctrl+C to cancel.
No files are installed until confirmation. Blocked prerequisites, adaptations, or
conflicts stop execution before any installation. Existing instructions, skipped
skills, legacy manager locks, and personal agent commands are never managed here.
`;
const split = (items = []) => [
  ...new Set(items.flatMap((item) => item.split(",")).filter(Boolean)),
];
function parse(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: true,
    options: {
      category: { type: "string", multiple: true },
      skill: { type: "string", multiple: true },
      agent: { type: "string", multiple: true },
      target: { type: "string" },
      "skills-dir": { type: "string" },
      scope: { type: "string" },
      ref: { type: "string" },
      "source-root": { type: "string" },
      "dry-run": { type: "boolean" },
      json: { type: "boolean" },
      yes: { type: "boolean" },
      overwrite: { type: "boolean" },
      help: { type: "boolean", short: "h" },
    },
  });
  check(
    positionals.length <= 1 && (!positionals.length || ["list", "sync"].includes(positionals[0])),
    "Expected list or sync; use --help",
  );
  return {
    command: positionals[0] ?? "sync",
    values,
    options: {
      categories: split(values.category),
      skills: split(values.skill),
      agents: split(values.agent),
      target: values.target,
      skillsDir: values["skills-dir"],
      scope: values.scope,
      ref: values.ref,
      overwrite: values.overwrite,
    },
  };
}
async function select(message, entries, prompt, { required = true, checked = false } = {}) {
  return prompt({
    message,
    choices: entries.map((entry) => ({
      name: entry.title,
      value: entry.id,
      ...(checked ? { checked: true } : {}),
      ...(entry.summary ? { description: entry.summary } : {}),
    })),
    required,
    shortcuts: { all: "a", invert: "i" },
    pageSize: 12,
    loop: false,
  });
}
export async function main(argv = process.argv.slice(2), runtime = {}) {
  const { command, values, options } = parse(argv);
  if (values.help) {
    console.log(HELP);
    return;
  }
  const catalog = loadCatalog(CATALOG_PATH, command === "list" ? values["source-root"] : undefined);
  if (command === "list") {
    check(
      !options.categories.length &&
        !options.skills.length &&
        !options.agents.length &&
        !values.yes &&
        !values.overwrite &&
        !values["dry-run"] &&
        !values.target &&
        values["skills-dir"] === undefined &&
        !values.scope &&
        !values.ref,
      "Installation options are not accepted by list",
    );
    if (values.json)
      console.log(
        JSON.stringify(
          {
            schemaVersion: catalog.schemaVersion,
            catalogHash: catalog.hash,
            groups: catalog.groups,
            skills: catalog.skills,
            deprecations: catalog.deprecations,
          },
          null,
          2,
        ),
      );
    else
      for (const [id, group] of Object.entries(catalog.groups)) {
        console.log(`${id}: ${group.title}\n  ${group.summary}`);
        for (const name of group.skills) {
          const entry = catalog.byName.get(name);
          console.log(
            `  ${name} [${entry.scope}]${entry.kind === "adapted" && entry.source.type !== "local" ? " — requires semantic adaptation; blocked" : ""}`,
          );
        }
      }
    return;
  }
  check(!values["source-root"], "--source-root is a list-only validation option");
  check(!values.json || values["dry-run"], "Use --json only with list or --dry-run");
  const interactive = runtime.interactive ?? (!!process.stdin.isTTY && !!process.stdout.isTTY);
  const prompts = runtime.prompts ?? { checkbox, confirm };
  const output = runtime.output ?? console.log;
  if (!options.categories.length && !options.skills.length) {
    check(
      interactive && !values.json,
      "Choose --category or --skill explicitly outside an interactive terminal",
    );
    options.categories = await select(
      "Skill categories",
      Object.entries(catalog.groups).map(([id, group]) => ({
        id,
        title: group.title,
        summary: group.summary,
      })),
      prompts.checkbox,
    );
  }
  if (interactive && !values.json && !values.yes && options.categories.length) {
    const scope = options.scope ?? "project";
    check(["project", "personal"].includes(scope), "Scope must be project or personal");
    options.categorySelections = {};
    for (const category of options.categories) {
      check(Object.hasOwn(catalog.groups, category), `Unknown category: ${category}`);
      const group = catalog.groups[category];
      const entries = group.skills
        .map((name) => catalog.byName.get(name))
        .filter((entry) => supportsScope(entry, scope));
      if (!entries.length) {
        output(`${group.title}: no ${scope}-scoped skills; unchanged.`);
        options.categorySelections[category] = [];
        continue;
      }
      options.categorySelections[category] = await select(
        `Skills in ${group.title} (A: all/none)`,
        entries.map((entry) => ({
          id: entry.name,
          title:
            entry.name +
            (entry.kind === "adapted" && entry.source.type !== "local"
              ? " [adaptation required]"
              : ""),
          summary:
            entry.description +
            (entry.prerequisites.length
              ? ` Required skills: ${entry.prerequisites.join(", ")}.`
              : ""),
        })),
        prompts.checkbox,
        { required: false, checked: true },
      );
    }
    if (
      !options.skills.length &&
      !Object.values(options.categorySelections).some((names) => names.length)
    ) {
      output("No skills selected; no installation performed.");
      return;
    }
  }
  if (!options.agents.length) {
    check(interactive && !values.json, "Choose --agent explicitly outside an interactive terminal");
    options.agents = await select(
      "Target agents",
      HARNESSES.map((id) => ({ id, title: id })),
      prompts.checkbox,
    );
  }
  const plan = buildPlan(options, catalog);
  if (values.json) output(JSON.stringify(plan, null, 2));
  else printPlan(plan, output);
  if (values["dry-run"]) return;
  check(
    !plan.blocked.length,
    "Resolve every blocked entry before installing; no installation started",
  );
  let confirmed = !!values.yes;
  if (!confirmed) {
    check(
      interactive,
      "Use --yes only after reviewing a --dry-run outside an interactive terminal",
    );
    confirmed = await prompts.confirm({
      message: "Run these commands and apply the displayed filtering/link/legal-file changes?",
      default: false,
    });
  }
  if (!confirmed) {
    output("Cancelled; no installation performed.");
    return;
  }
  const completed = await (runtime.install ?? executePlan)(plan, { confirmed });
  output(
    `\nVerified ${completed.length} skill(s)${plan.skillsDir ? ` in ${plan.skillsDir}` : ""}: ${completed.join(", ")}. Project instructions were not changed.`,
  );
}
export function reportFailure(error, output = console.error) {
  if (["ExitPromptError", "AbortPromptError"].includes(error.name)) {
    output("Cancelled; no installation performed.");
    return 130;
  }
  output(`sync-skills: ${error.message}`);
  return 1;
}

let isEntry = false;
try {
  isEntry = !!process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
} catch {
  /* Imported without a filesystem entry point. */
}
if (isEntry)
  main().catch((error) => {
    process.exitCode = reportFailure(error);
  });
