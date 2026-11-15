#!/usr/bin/env node
import { readFileSync } from "node:fs";
import {
  SyncError, loadCatalog, inspectProject, prepareSkills, reviewSkill, planSync,
  applySync, projectStatus, planSetup, applySetup,
} from "./sync-core.mjs";

const HELP = `sync-my-skills — approved, skills-only synchronization

Commands:
  catalog [--source-root REPO] [--catalog YAML]
  inspect --root PROJECT [--source-root REPO] [--catalog YAML]
  prepare --root PROJECT [--skills a,b] --stage NEW_DIR [--source-root REPO]
          [--catalog YAML] [--fetch] [--target-requirements TEXT]
  review --stage DIR --name SKILL --note TEXT
  plan --root PROJECT --stage DIR --selection JSON [--catalog YAML]
  apply --root WORKTREE --stage DIR --selection JSON [--catalog YAML]
        --apply --confirm --plan-id ID
  status --root PROJECT
  setup --harnesses pi,opencode,claude-code [--home DIR] [--manager-root DIR]
        [--apply --confirm --plan-id ID]

Plan/inspect never mutate the target. Preparation and review write only their
external stage. Apply requires an isolated Git worktree and a matching plan.
Setup is a separate personal-configuration plan; it does not install packages.
Root instruction documents and Skills CLI-owned skills-lock.json are never written.
`;
const FLAGS = new Set(["apply", "confirm", "fetch", "help"]);
const VALUES = new Set(["root", "stage", "skills", "source-root", "catalog", "selection", "name", "note", "plan-id", "harnesses", "home", "manager-root", "target-requirements"]);
function argumentsFor(argv) {
  const [command, ...args] = argv;
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("--")) throw new SyncError("Use named options", 2);
    const key = args[i].slice(2);
    if (Object.hasOwn(options, key)) throw new SyncError(`Duplicate option: ${key}`, 2);
    if (FLAGS.has(key)) options[key] = true;
    else if (VALUES.has(key) && args[i + 1] !== undefined && !args[i + 1].startsWith("--")) options[key] = args[++i];
    else throw new SyncError(`Unknown option or missing value: ${key}`, 2);
  }
  return { command, options };
}
function need(options, ...keys) {
  for (const key of keys) if (!options[key]) throw new SyncError(`--${key} is required`, 2);
}
function selection(path) {
  try { return JSON.parse(readFileSync(path, "utf8")); }
  catch { throw new SyncError("Cannot read selection JSON", 2); }
}
async function main() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 20)) throw new SyncError("Node.js 22.20 or newer is required", 4);
  if (!process.argv[2] || process.argv.includes("--help")) { console.log(HELP); return; }
  const { command, options: o } = argumentsFor(process.argv.slice(2));
  const common = { root: o.root, stage: o.stage, planId: o["plan-id"], apply: o.apply, confirm: o.confirm };
  let result;
  if (command === "status") { need(o, "root"); result = projectStatus(o.root); }
  else if (command === "review") { need(o, "stage", "name", "note"); result = reviewSkill({ ...common, name: o.name, note: o.note }); }
  else if (command === "setup") {
    need(o, "harnesses");
    const input = { ...common, home: o.home, managerRoot: o["manager-root"], harnesses: o.harnesses.split(",") };
    result = o.apply ? applySetup(input) : planSetup(input);
  } else {
    if (!["catalog", "inspect", "prepare", "plan", "apply"].includes(command)) throw new SyncError("Unknown command; use --help", 2);
    const catalog = loadCatalog(o.catalog, o["source-root"]);
    if (command === "catalog") result = { schemaVersion: 2, catalogHash: catalog.hash, skills: catalog.skills, deprecations: catalog.deprecations ?? {}, instructionTemplates: catalog.instructionTemplates ?? null };
    else if (command === "inspect") { need(o, "root"); result = inspectProject({ ...common, catalog }); }
    else if (command === "prepare") {
      need(o, "root", "stage");
      result = await prepareSkills({ ...common, catalog, names: o.skills ? o.skills.split(",") : [], sourceRoot: o["source-root"], allowFetch: o.fetch, targetRequirements: o["target-requirements"] ?? "" });
    } else {
      need(o, "root", "stage", "selection");
      const input = { ...common, catalog, selection: selection(o.selection) };
      result = command === "apply" ? applySync(input) : planSync(input);
    }
  }
  console.log(JSON.stringify({ skill: "sync-my-skills", command, ...result }, null, 2));
}
main().catch((error) => {
  console.error(error instanceof SyncError ? error.message : `Synchronization failed: ${error.message}`);
  process.exitCode = error instanceof SyncError ? error.exitCode : 6;
});
