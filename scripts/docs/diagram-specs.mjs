import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { catalog, catalogPath, catalogRelativePath, groups, root } from "./data.mjs";
import { workflows } from "./workflows.mjs";

export function identity() {
  const revision = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  let url = execFileSync("git", ["remote", "get-url", "origin"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  if (url.startsWith("https://")) {
    const parsed = new URL(url);
    parsed.username = "";
    parsed.password = "";
    if (parsed.search || parsed.hash)
      throw new Error("Repository identity must not carry query or fragment data");
    url = parsed.href;
  }
  if (
    !/^[a-f0-9]{40}$/.test(revision) ||
    (!url.startsWith("https://github.com/") && !url.startsWith("git@github.com:"))
  )
    throw new Error("Review the repository identity before diagram generation");
  return { url, revision, ...(url.startsWith("git@") ? { link_mode: "local-only" } : {}) };
}
function sources(name) {
  const entry = catalog().byName.get(name);
  if (!entry) throw new Error(`Unknown diagram skill: ${name}`);
  if (entry.source.type === "local") {
    const path = `${entry.source.path}/SKILL.md`;
    return [
      {
        path,
        line: 1,
        end_line: readFileSync(join(root, path), "utf8").trimEnd().split("\n").length,
        label: "Authoritative skill instructions",
      },
    ];
  }
  const lines = readFileSync(catalogPath, "utf8").split("\n");
  const start = lines.findIndex((line) => line === `  ${name}:`);
  const next = lines.findIndex((line, index) => index > start && /^ {2}[a-z0-9-]+:$/.test(line));
  return [
    {
      path: catalogRelativePath,
      line: start + 1,
      end_line: next === -1 ? lines.length - 1 : next,
      label: "Pinned source and runtime record",
    },
  ];
}
const meta = (title, id, repository, labels) => ({
  title,
  locale: "en",
  quality_profile: "showcase",
  output: `.docs-artifacts/archify/${id}.html`,
  repository,
  legend: { entries: labels },
});
export function dependencySpec(repository) {
  const positions = {
    "cleanup-workspaces": [40, 40],
    "isolated-workspace": [400, 40],
    "coding-with-rules": [40, 185],
    coding: [400, 185],
    research: [40, 355],
    initiative: [40, 485],
    specify: [40, 615],
    grilling: [400, 485],
    "grill-me": [760, 485],
  };
  const edges = catalog().skills.flatMap((entry) =>
    entry.prerequisites.map((to) => ({ from: entry.name, to })),
  );
  const names = [...new Set(edges.flatMap((edge) => [edge.from, edge.to]))];
  if (names.some((name) => !positions[name]))
    throw new Error("New dependency needs a reviewed diagram placement");
  return {
    schema_version: 1,
    diagram_type: "architecture",
    meta: meta("Required instruction dependencies", "required-dependencies", repository, {
      backend: { label: "Skill instructions" },
    }),
    components: names.map((name) => ({
      id: name,
      type: "backend",
      label: name,
      icon: "none",
      pos: positions[name],
      size: [220, 72],
      sources: sources(name),
    })),
    connections: edges.map((edge, index) => ({
      id: `requires-${index}`,
      ...edge,
      label: "requires",
    })),
    cards: [
      {
        dot: "cyan",
        title: "Read the arrow",
        items: [
          "Requesting skill → required instructions.",
          "These edges come from declared metadata, not a recommended execution order.",
        ],
      },
      {
        dot: "amber",
        title: "Resolve before use",
        items: [
          "The project extension requires an installed dependency; native harness loading is not guaranteed.",
          "Missing requirements stop the affected phase. Installation needs approval.",
        ],
      },
    ],
  };
}
export function groupSpec(repository) {
  const spots = [
    [40, 40],
    [40, 270],
    [40, 500],
    [780, 40],
    [780, 270],
    [780, 500],
  ];
  const nodes = groups.map((group, index) => ({
    id: group.id,
    type: "backend",
    label: group.title,
    sublabel: `${group.skills.length} catalogued skills`,
    icon: "none",
    pos: spots[index],
    size: [240, 90],
    sources: [
      {
        path: catalogRelativePath,
        label: "Catalogued skill names, sources, and purposes",
      },
    ],
  }));
  return {
    schema_version: 1,
    diagram_type: "architecture",
    meta: meta("Choose a skill by the task", "skill-groups", repository, {
      backend: { label: "Collection group" },
      external: { label: "Reader decision" },
    }),
    components: [
      {
        id: "choose",
        type: "external",
        label: "What do you need next?",
        sublabel: "Start with the actual task",
        icon: "person",
        pos: [410, 270],
        size: [230, 90],
        sources: [
          { path: "README.md", line: 1, end_line: 4, label: "Collection purpose and audience" },
        ],
      },
      ...nodes,
    ],
    connections: groups.map((group, index) => ({
      id: `choose-${group.id}`,
      from: "choose",
      to: group.id,
      label: ["clarify", "build", "explain", "configure", "prepare", "coordinate"][index],
    })),
    cards: [
      {
        dot: "cyan",
        title: "Discovery, not execution",
        items: [
          "These presentation groups help readers choose; arrows are navigation choices.",
          "They are not runtime architecture, required dependencies, or a fixed project lifecycle.",
        ],
      },
      {
        dot: "amber",
        title: "Choose less",
        items: [
          "Use the smallest useful combination for the current task.",
          "Instructions, runtime setup, and owner approval remain separate requirements.",
        ],
      },
    ],
  };
}
export function workflowSpec(recipe, repository) {
  const approval = recipe.steps.some((step) => step.kind === "approval");
  const nodes = recipe.steps.map((step, index) => ({
    id: `step-${index}`,
    lane: step.kind === "approval" ? "owner" : "work",
    col: index,
    type: step.kind === "approval" ? "security" : "backend",
    label: step.label,
    sublabel: step.skill,
    icon: step.kind === "approval" ? "decision" : "none",
    sources: sources(step.skill),
  }));
  const edges = recipe.steps.slice(1).map((step, index) => ({
    id: `next-${index}`,
    from: `step-${index}`,
    to: `step-${index + 1}`,
    role: "main",
    ...(recipe.steps[index].kind === "approval"
      ? {
          label: recipe.steps[index].label.includes("missing") ? "setup ready" : "if approved",
          variant: "security",
        }
      : {}),
  }));
  for (const [index, step] of recipe.steps.entries()) {
    if (step.kind !== "approval") continue;
    nodes.push({
      id: `stop-${index}`,
      lane: "stop",
      col: index,
      type: "external",
      label: "Pause this branch",
      sublabel: "No approval, no writes",
      icon: "stop",
      sources: sources(step.skill),
    });
    edges.push({
      id: `decline-${index}`,
      from: `step-${index}`,
      to: `stop-${index}`,
      label: "not approved",
      role: "branch",
      variant: "security",
    });
  }
  return {
    schema_version: 2,
    diagram_type: "workflow",
    meta: meta(recipe.title, recipe.id, repository, {
      backend: { label: "Guided work" },
      security: { label: "Owner decision" },
      external: { label: "Stopped branch" },
    }),
    lanes: [
      { id: "work", label: "Suggested skill handoffs" },
      ...(approval
        ? [
            { id: "owner", label: "Applicable owner approval" },
            { id: "stop", label: "Stop without authorizing writes" },
          ]
        : []),
    ],
    mainPath: recipe.steps.map((step, index) => `step-${index}`),
    nodes,
    edges,
    semanticChecks: {
      allowedRoots: ["step-0"],
      allowedTerminals: [
        `step-${recipe.steps.length - 1}`,
        ...nodes.filter((node) => node.id.startsWith("stop-")).map((node) => node.id),
      ],
    },
    cards: [
      { dot: "cyan", title: "Expected outcome", items: [recipe.outcome] },
      {
        dot: "amber",
        title: "Scope and stopping point",
        items: [
          recipe.limit,
          "Suggested handoffs are not declared instruction dependencies or permission for another phase.",
        ],
      },
    ],
  };
}
export function diagramSpecs(repository = identity()) {
  return new Map([
    ["required-dependencies", dependencySpec(repository)],
    ["skill-groups", groupSpec(repository)],
    ...workflows.map((recipe) => [recipe.id, workflowSpec(recipe, repository)]),
  ]);
}
