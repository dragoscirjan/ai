import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadCatalog } from "../../.agents/skills/sync-my-skills/scripts/sync-core.mjs";

export const root = fileURLToPath(new URL("../../", import.meta.url));
export const catalogPath = join(root, ".agents/skills/sync-my-skills/assets/skill-catalog.yaml");
export function catalog() {
  return loadCatalog(catalogPath, root);
}
export function docsBase(value = process.env.DOCS_BASE ?? "/") {
  if (value !== "/" && !/^\/(?:[a-zA-Z0-9][a-zA-Z0-9_-]*\/)+$/.test(value)) {
    throw new Error(
      "DOCS_BASE must be / or a slash-delimited site path such as /projects/ai-skills/",
    );
  }
  return value;
}
export const groups = [
  {
    id: "setup",
    title: "Setup",
    summary: "Install selected skills, initialize projects, and protect the primary checkout.",
    skills: ["sync-my-skills", "init-project", "isolated-workspace"],
  },
  {
    id: "discovery",
    title: "Discovery and planning",
    summary: "Investigate questions and agree on outcomes, specifications, and tasks.",
    skills: [
      "research",
      "initiative",
      "specify",
      "plan-tasks",
      "grill-me",
      "grilling",
      "wait-what",
    ],
  },
  {
    id: "coding",
    title: "Coding and quality",
    summary: "Implement, test, diagnose, simplify, and review code.",
    skills: [
      "coding",
      "coding-with-rules",
      "scaffold",
      "tdd",
      "debloat",
      "code-review",
      "systematic-debugging",
    ],
  },
  {
    id: "writing",
    title: "Documentation and communication",
    summary: "Explain technical work and write instructions that readers can follow.",
    skills: ["document-project", "asd-ste100-technical", "caveman", "unslop", "writing-for-agents"],
  },
  {
    id: "diagrams",
    title: "Diagrams",
    summary: "Choose editable images or interactive HTML for the reader\u0027s task.",
    skills: ["archify", "excalidraw"],
  },
  {
    id: "maintenance",
    title: "Coordination and maintenance",
    summary: "Coordinate agents, repair instruction routes, and improve the working process.",
    skills: ["subagent-orchestration", "cleanup-workspaces", "instruction-maintenance", "retro"],
  },
];
export function sourceUrl(entry, file = "SKILL.md") {
  const c = catalog();
  const repository = entry.source.repository ?? c.repository;
  const revision = entry.source.revision ?? c.ref;
  // Raw immutable upstream files avoid making instruction access depend on GitHub\u0027s blob UI.
  const prefix =
    entry.source.type === "local"
      ? `${repository}/blob/${revision}`
      : `${repository.replace("https://github.com/", "https://raw.githubusercontent.com/")}/${revision}`;
  return `${prefix}/${entry.source.path}/${file}`;
}
export function localInstructions(name) {
  return readFileSync(join(root, ".agents/skills", name, "SKILL.md"), "utf8");
}
