import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadCatalog } from "../../.agents/skills/agentic-work/sync-my-skills/scripts/sync-core.mjs";

export const root = fileURLToPath(new URL("../../", import.meta.url));
export const catalogRelativePath =
  ".agents/skills/agentic-work/sync-my-skills/assets/skill-catalog.yaml";
export const catalogPath = join(root, catalogRelativePath);
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
    id: "productivity",
    title: "Productivity",
    summary:
      "Research questions, shape initiatives, specify behavior, plan tasks, and learn from results.",
    skills: [
      "initiative",
      "research",
      "specify",
      "plan-tasks",
      "retro",
      "grill-me",
      "grilling",
      "wait-what",
    ],
  },
  {
    id: "coding",
    title: "Coding",
    summary: "Scaffold, implement, test, diagnose, simplify, and review code.",
    skills: [
      "coding",
      "coding-with-rules",
      "scaffold",
      "code-review",
      "systematic-debugging",
      "tdd",
      "debloat",
    ],
  },
  {
    id: "documentation",
    title: "Documentation",
    summary:
      "Write technical documentation and explanations, or create editable and interactive diagrams.",
    skills: [
      "asd-ste100-technical",
      "caveman",
      "document-project",
      "unslop",
      "excalidraw",
      "archify",
    ],
  },
  {
    id: "agentic-work",
    title: "Agentic work",
    summary: "Manage selected agent skills and write agent-facing instructions.",
    skills: ["writing-for-agents", "sync-my-skills"],
  },
  {
    id: "utility",
    title: "Utility",
    summary: "Initialize projects, isolate changes, and clean approved workspaces.",
    skills: ["init-project", "isolated-workspace", "cleanup-workspaces"],
  },
  {
    id: "unpolished",
    title: "Unpolished",
    summary: "Coordinate bounded agent work and audit instruction changes.",
    skills: ["instruction-maintenance", "subagent-orchestration"],
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
  const entry = catalog().byName.get(name);
  if (!entry || entry.source.type !== "local") throw new Error(`No local instructions: ${name}`);
  return readFileSync(join(root, entry.source.path, "SKILL.md"), "utf8");
}
