#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { CATALOG_PATH, HARNESSES, check, loadCatalog } from "./catalog.mjs";
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
  --scope SCOPE      project (default) or personal (explicit global installation)
  --ref REF          Source ref for this repository's skills (default: catalog ref)
  --dry-run          Print commands and destinations without fetching or installing
  --json             JSON output for list or a dry run
  --yes              Confirm the displayed installation without an interactive prompt
  --overwrite        Explicitly permit replacing existing selected skill destinations
  --source-root PATH Validate catalog coverage in a source checkout (list only)
  --help             Show this help

With no selection in an interactive terminal, choose categories and agents from menus.
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
      scope: values.scope,
      ref: values.ref,
      overwrite: values.overwrite,
    },
  };
}
async function select(rl, title, entries) {
  console.log(`\n${title}`);
  entries.forEach((entry, index) =>
    console.log(`  [ ] ${index + 1}. ${entry.title} (${entry.id})`),
  );
  const answer = await rl.question("Choose comma-separated numbers or names: ");
  const selected = split([answer.trim()]).map((value) =>
    /^\d+$/.test(value) ? entries[Number(value) - 1]?.id : value.trim(),
  );
  check(
    selected.length && selected.every((id) => entries.some((entry) => entry.id === id)),
    "Invalid or empty selection; no installation performed",
  );
  return selected;
}
export async function main(argv = process.argv.slice(2)) {
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
  const interactive = !!process.stdin.isTTY && !!process.stdout.isTTY;
  let rl;
  try {
    if (interactive) rl = createInterface({ input: process.stdin, output: process.stdout });
    if (!options.categories.length && !options.skills.length) {
      check(
        rl && !values.json,
        "Choose --category or --skill explicitly outside an interactive terminal",
      );
      options.categories = await select(
        rl,
        "Skill categories",
        Object.entries(catalog.groups).map(([id, group]) => ({ id, title: group.title })),
      );
    }
    if (!options.agents.length) {
      check(rl && !values.json, "Choose --agent explicitly outside an interactive terminal");
      options.agents = await select(
        rl,
        "Target agents",
        HARNESSES.map((id) => ({ id, title: id })),
      );
    }
    const plan = buildPlan(options, catalog);
    if (values.json) console.log(JSON.stringify(plan, null, 2));
    else printPlan(plan);
    if (values["dry-run"]) return;
    check(
      !plan.blocked.length,
      "Resolve every blocked entry before installing; no installation started",
    );
    let confirmed = !!values.yes;
    if (!confirmed) {
      check(rl, "Use --yes only after reviewing a --dry-run outside an interactive terminal");
      confirmed =
        (
          await rl.question(
            "\nRun these commands and apply the displayed filtering/legal-file changes? [y/N] ",
          )
        )
          .trim()
          .toLowerCase() === "y";
    }
    if (!confirmed) {
      console.log("Cancelled; no installation performed.");
      return;
    }
    const completed = await executePlan(plan, { confirmed });
    console.log(
      `\nVerified ${completed.length} skill(s): ${completed.join(", ")}. Project instructions were not changed.`,
    );
  } finally {
    rl?.close();
  }
}
let isEntry = false;
try {
  isEntry = !!process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url);
} catch {
  /* Imported without a filesystem entry point. */
}
if (isEntry)
  main().catch((error) => {
    console.error(`sync-skills: ${error.message}`);
    process.exitCode = 1;
  });
