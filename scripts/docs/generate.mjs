import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { catalog, catalogRelativePath, groups, root, sourceUrl } from "./data.mjs";
import { notes } from "./skill-notes.mjs";
import { workflowGuides, workflows } from "./workflows.mjs";
import { writeNotices } from "./notices.mjs";

const link = (name) => `[\`${name}\`](/skills/${name})`;
const list = (names) => names.map(link).join(", ");
const title = (text) => `---\ntitle: ${JSON.stringify(text)}\n---\n\n`;
const image = (id, description) =>
  `![${description}](/diagrams/${id}.svg)\n\n[Open interactive diagram](/diagrams/${id}.html){class="vp-raw"} · [Download SVG](/diagrams/${id}.svg) · [Editable candidate](/diagram-sources/${id}.json)\n`;
export function availability(entry) {
  if (entry.kind === "adapted" && entry.source.type !== "local")
    return "Pinned upstream input; adaptation required";
  if (entry.source.type !== "local") return "Upstream-only; approved external setup";
  return entry.kind === "authored" ? "Authored here" : "Upstream-derived; maintained here";
}
export function installCommand(entry) {
  const argv = entry.install?.argv;
  if (
    !Array.isArray(argv) ||
    !argv.every((arg) => typeof arg === "string" && !/[\r\n\0]/.test(arg)) ||
    argv.length < 7 ||
    argv.length > 8 ||
    argv[0] !== "npx" ||
    argv[1] !== "-y" ||
    !/^skills@\d+\.\d+\.\d+$/.test(argv[2]) ||
    argv[3] !== "add" ||
    !argv[4] ||
    argv[4].startsWith("-") ||
    argv[5] !== "--skill" ||
    argv[6] !== entry.name ||
    (argv.length === 8 && argv[7] !== "--global")
  )
    throw new Error(
      `Installation command must select only ${entry.name} with the pinned Skills CLI`,
    );
  return argv
    .map((arg) =>
      /^[a-zA-Z0-9_./:@=+-]+$/.test(arg) ? arg : `'${arg.replaceAll("'", "'\"'\"'")}'`,
    )
    .join(" ");
}
function installation(entry) {
  const scope = entry.install.argv.includes("--global")
    ? "This is a personal installation. Command registration and project synchronization are separate optional actions."
    : "Run this command from the target project after reviewing its instructions and the skill source.";
  const requirements = entry.prerequisites.length
    ? `\n\nRequired instruction packages: ${entry.prerequisites.map((name) => `[\`${name}\`](/skills/${name}#install-this-skill)`).join(", ")}. If any are missing, the agent must stop and ask you to install them before continuing. The command above does not install these requirements.`
    : "";
  return `## Install this skill\n\nYou need Node.js 22.20 or newer, Git, and npm/npx. ${scope}\n\n\`\`\`sh\n${installCommand(entry)}\n\`\`\`\n\nThis command selects only \`${entry.name}\`. It does not install the rest of the collection or the optional companions listed on this page.${requirements}\n\nBefore applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.\n\nSee [installation choices](/guide/install) for prerequisites and direct install examples.`;
}
export function generatedPages() {
  const c = catalog();
  const pages = new Map();
  const referenced = groups.flatMap((group) => group.skills);
  const known = c.skills.map((entry) => entry.name);
  if (
    new Set(referenced).size !== referenced.length ||
    known.some((name) => !referenced.includes(name)) ||
    referenced.some((name) => !c.byName.has(name))
  )
    throw new Error("Presentation groups must cover the catalog exactly once");
  if (Object.keys(notes).length !== known.length || known.some((name) => !notes[name]))
    throw new Error("Reader notes must cover exactly the current catalog");
  for (const entry of c.skills) {
    const note = notes[entry.name];
    const remoteAdaptation = entry.kind === "adapted" && entry.source.type !== "local";
    const adaptation = remoteAdaptation
      ? "\n\nThis is pinned upstream input, not a reviewed installed adaptation. Follow the catalogued adaptation instructions and review the output and legal notices before use. A source link or install command does not perform that adaptation."
      : "";
    const group = groups.find((group) => group.skills.includes(entry.name));
    const requirements = entry.prerequisites.length
      ? list(entry.prerequisites)
      : "None recorded in the catalog.";
    const recipes = workflows.filter(
      (recipe) =>
        recipe.steps.some((step) => step.skill === entry.name) ||
        recipe.optional.includes(entry.name),
    );
    const guides = workflowGuides.filter((guide) =>
      recipes.some((recipe) => guide.recipes.includes(recipe.id)),
    );
    const runtime = entry.runtime?.length
      ? entry.runtime.map((item) => `- ${item}`).join("\n")
      : "No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.";
    pages.set(
      `skills/${entry.name}.md`,
      title(entry.name) +
        `# ${entry.name}\n\n${entry.description}\n\n**Group:** [${group.title}](/groups/${group.id}) · **Availability:** ${availability(entry)} · **Scope:** ${entry.scope}\n\n## When to choose it\n\n${note.when}\n\n**Expected result:** ${note.result}\n\n${installation(entry)}\n\n## Try it\n\nLoad the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.\n\n\`\`\`text\n${note.prompt}\n\`\`\`\n\n## Requirements and boundaries\n\n**Catalogued instruction requirements:** ${requirements}\n\nResolve required instructions in their declared order before applying the skill. The project-specific \`requires\` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.\n\n**Runtime and setup:**\n\n${runtime}\n\n${note.stop}${adaptation}\n\n## Useful combinations\n\n${note.companions.map((name) => `- ${link(name)} — ${notes[name].when}`).join("\n")}\n\nThese are optional companions, not extra declared requirements. Choose only what the task needs.\n\n${guides.map((guide) => `- [${guide.title}](/workflows/${guide.id})`).join("\n")}\n\nFor focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).\n\n## Source and harness support\n\nThe catalog records this entry as **${entry.selection}**, not as automatically selected for every project.\n\n[${remoteAdaptation ? "Read the pinned upstream input" : "Read the authoritative skill instructions"}](${sourceUrl(entry)}). ${entry.source.type === "local" ? "This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry." : `This link uses the immutable upstream revision \`${entry.source.revision}\`; there is no vendored copy here.`}\n\nSupported catalog harnesses: ${entry.harnesses.map((name) => `\`${name}\``).join(", ")}. Runtime availability and actual discovery must still be checked in your chosen harness.\n`,
    );
  }
  for (const group of groups) {
    const recipes = workflows.filter((recipe) => recipe.group === group.id);
    pages.set(
      `groups/${group.id}.md`,
      title(group.title) +
        `# ${group.title}\n\n${group.summary}\n\nChoose by the task you have now. These are the collection's groups, including external recommendations. They are not a mandatory delivery pipeline.\n\n${group.skills.map((name) => `## ${link(name)}\n\n${c.byName.get(name).description}\n\n**Choose it when:** ${notes[name].when}\n`).join("\n")}\n## Related procedures\n\n[Choose an end-to-end workflow](/workflows/) before selecting an individual procedure.\n\n${recipes.map((recipe) => `- [${recipe.title}](/workflows/${recipe.id}) — ${recipe.when}`).join("\n")}\n`,
    );
  }
  for (const recipe of workflows) {
    const guide = workflowGuides.find((item) => item.recipes.includes(recipe.id));
    const parent = guide
      ? `[${guide.title}](/workflows/${guide.id})`
      : "[Supporting tools and additional workflows](/workflows/supporting-tools)";
    const required = [
      ...new Set(recipe.steps.flatMap((step) => c.byName.get(step.skill)?.prerequisites ?? [])),
    ];
    pages.set(
      `workflows/${recipe.id}.md`,
      title(recipe.title) +
        `# ${recipe.title}\n\nThis is a focused procedure. For its place in a larger workflow, see ${parent}.\n\n${recipe.when}\n\n**Finish with:** ${recipe.outcome}\n\n## Read the diagram\n\n${image(recipe.id, `${recipe.title}: suggested skill handoffs with approval stops where applicable.`)}\nArrows show this suggested sequence, not declared \`requires\` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.\n\n## Before you start\n\nUse a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. ${required.length ? `This selection includes the catalogued instruction requirements ${list(required)}. Resolve them before use.` : "No additional instruction requirement is recorded for these selected steps."}\n\n## Steps\n\n${recipe.steps.map((step, index) => `${index + 1}. **${step.label}.** ${link(step.skill)} ${step.kind === "approval" ? "owns this approval boundary; continue only when the applicable approval or existing approved setup is established." : "provides the guidance for this step."}`).join("\n")}\n\n## Where to stop\n\n${recipe.limit}\n\n## Optional branches\n\n${recipe.optional.map((name) => `- Choose ${link(name)} when ${notes[name].when.charAt(0).toLowerCase() + notes[name].when.slice(1)}`).join("\n")}\n\nOptional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.\n`,
    );
  }
  pages.set(
    "skills/index.md",
    title("Find a skill") +
      `# Find a skill\n\nThe catalog contains **${c.skills.length} skills**: ${c.skills.filter((entry) => entry.source.type === "local").length} local entries and ${c.skills.filter((entry) => entry.source.type !== "local").length} remote-source entries. Search by an exact skill name or start with your task.\n\n${image("skill-groups", "The collection's six groups include local and external skills; grouping is not a runtime dependency.")}\n${groups.map((group) => `## [${group.title}](/groups/${group.id})\n\n${group.summary}\n\n${group.skills.map((name) => `- ${link(name)} — ${c.byName.get(name).description}`).join("\n")}\n`).join("\n")}\nThe YAML catalog is the only authored inventory. Grouping and learning prose reference its IDs; generated pages do not define a second installable collection. See the [catalog reference](/reference/catalog).\n`,
  );
  pages.set(
    "workflows/index.md",
    title("Project workflows") +
      `# Project workflows\n\nChoose the result you need. Each guide explains where to start, which skill to use next, what to carry into the next phase, and when to return to earlier work.\n\n| Your goal | Workflow |\n| --- | --- |\n${workflowGuides.map((guide) => `| ${guide.when} | [${guide.title}](/workflows/${guide.id}) |`).join("\n")}\n\n## How the workflows connect\n\n\`\`\`text\nPlanning → agreed task\n    ↓\nImplementation\n\nFailure → debugging → verified fix\nMissing guidance → documentation\nComplexity → debloating\n\`\`\`\n\nDebugging and debloating reuse implementation and review after their investigation. Documentation can be a separate project or part of any behavior-changing task. Return to planning when a finding changes requirements or scope.\n\nYou can start with an existing specification or task. You do not need to repeat research or create documents merely to complete a pipeline. Research can also stop at findings without producing implementation work.\n\n## Read the flows\n\nArrows show suggested handoffs, not automatic execution or instruction dependencies. The guides mark optional branches and explicit stops. A handoff carries the agreed scope, decisions, and verification evidence; it does not grant permission for the next action. See [requirements and handoffs](/reference/relationships) for the dependency rules.\n\n## Supporting tools and other workflows\n\nWorkspace isolation and cleanup protect execution; they are not stages in a product workflow. Interviews, delegation, and diagrams help only when the task needs them. See [supporting tools](/workflows/supporting-tools) for setup, limitations, and focused procedures.\n\nTwo additional workflows can stand alone: [review an existing change](/workflows/review-against-standards-and-spec) and [learn from completed work](/workflows/learn-from-completed-work). Neither automatically changes the project.\n`,
  );
  pages.set(
    "reference/catalog.md",
    title("Catalog reference") +
      `# Catalog reference\n\nThe [YAML catalog](${c.repository}/blob/${c.ref}/${catalogRelativePath}) owns names, sources, selection defaults, runtime notes, installation mechanisms, and legal records. This site adds learning prose and presentation groups; it does not replace that inventory.\n\n## Availability\n\n- **Authored here:** this repository maintains the skill.\n- **Upstream-derived; maintained here:** use the maintained local copy, not an assumed unchanged upstream replacement.\n- **Upstream-only:** the catalog points to an immutable external source. Listing it does not install it.\n- **Pinned upstream input; adaptation required:** the catalog records immutable input and an adaptation recipe. Review the adapted output and legal notices before use.\n\n| Skill | Availability | Selection default |\n| --- | --- | --- |\n${c.skills.map((entry) => `| ${link(entry.name)} | ${availability(entry)} | ${entry.selection} |`).join("\n")}\n\nA recommended default is not approval. A declined skill stays unchanged; policy already active in the target project still applies. Read each profile for runtime setup and its authoritative source.\n\n## What the harness labels mean\n\nThe catalog targets Pi, OpenCode, and Claude Code. That expresses intended compatibility, not proof of live discovery, every harness capability, or model compliance. The manager uses harness-specific adapters; custom configuration roots need separate verification.\n\n## What is not a skill\n\nLanguage and extension documents under \`coding-with-rules/references/\` are conditional references, not separate installable skills. Shared helper code and package dependencies are software dependencies, not instruction \`requires\` edges.\n`,
  );
  const edges = c.skills.flatMap((entry) =>
    entry.prerequisites.map((required) => ({ from: entry.name, to: required })),
  );
  pages.set(
    "reference/relationships.md",
    title("Requirements, companions, and handoffs") +
      `# Requirements, companions, and handoffs\n\nA line between two skill names can mean different things. Treating every useful combination as a prerequisite produces unnecessary installations and unsafe automatic follow-up work.\n\n## Required instruction dependencies\n\n\`A → B\` in this map means: resolve the installed instructions for **B before applying A**. It does not mean execute B after A. The catalog currently records **${edges.length} edges**, checked against the local \`requires\` frontmatter.\n\n${image("required-dependencies", "Six declared instruction dependencies, directed from each requesting skill to its required instructions.")}\n| Requesting skill | Required instructions |\n| --- | --- |\n${edges.map((edge) => `| ${link(edge.from)} | ${link(edge.to)} |`).join("\n")}\n\nThe \`requires\` declaration is a project extension, not a standard Agent Skills field or a native loader guarantee. Resolve recursively in array order, stop on missing requirements or cycles, and obtain approved setup. Direct Skills CLI installation does not automatically install this closure. If a selected skill or required instructions are missing, stop the task and ask the user to install them. Resume only after installation is confirmed and availability is verified.\n\n## Installation prerequisites\n\nThese are things that must exist before installation or use: an approved source, a trusted checkout, a parser dependency, filesystem support, or other documented setup. Do not turn a tool prerequisite into a new skill dependency. Installation still needs applicable approval.\n\n## Runtime and harness requirements\n\nA skill can need Bun, Node.js, a local browser, a rendering CLI, or authorized subagent tools without requiring another skill. The profile's runtime section comes from the catalog; the linked authoritative instructions define the complete contract. A supported harness name does not prove those capabilities are present.\n\n## Optional companions\n\nA companion helps under a stated condition. For example, choose \`tdd\` when the owner wants test-first work, or a diagram skill when the reader needs a visual relationship explanation. Do not install or run every companion automatically.\n\n## Phase handoffs and owner decisions\n\nA workflow arrow suggests a later phase; it is not a new \`requires\` edge or permission to continue. Research can end at findings, planning at a task list, scaffolding at a skeleton, and review at findings. Approval gates remain on the operation they protect. A draft cannot approve itself, and a successful review cannot authorize a merge or release.\n\n[Choose a workflow](/workflows/) or [inspect an individual skill](/skills/).\n`,
  );
  return new Map([...pages].map(([path, text]) => [path, text.trimEnd() + "\n"]));
}

export function generate({ check = false } = {}) {
  const pages = generatedPages();
  for (const [relative, text] of pages) {
    const file = join(root, "docs", relative);
    if (existsSync(file) && lstatSync(file).isSymbolicLink())
      throw new Error(`Refusing generated-page symlink: ${relative}`);
    if (check) {
      if (!existsSync(file) || readFileSync(file, "utf8") !== text)
        throw new Error(`Regenerate documentation: ${relative}`);
    } else {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, text);
    }
  }
  if (!check) {
    const directory = join(root, "docs/public/diagram-sources");
    mkdirSync(directory, { recursive: true });
    for (const id of [
      "skill-groups",
      "required-dependencies",
      ...workflowGuides.map((guide) => guide.id),
      ...workflows.map((recipe) => recipe.id),
    ]) {
      const source = join(root, "docs/diagrams", `${id}.json`);
      if (existsSync(source)) writeFileSync(join(directory, `${id}.json`), readFileSync(source));
    }
    const manifest = join(root, "docs/diagrams/manifest.json");
    if (existsSync(manifest))
      writeFileSync(join(root, "docs/public/diagrams/manifest.json"), readFileSync(manifest));
    writeNotices();
  }
  return pages.size;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.slice(2).some((arg) => arg !== "--check") || process.argv.length > 3)
    throw new Error("Usage: node scripts/docs/generate.mjs [--check]");
  console.log(
    `${generate({ check: process.argv.includes("--check") })} generated documentation pages ${process.argv.includes("--check") ? "checked" : "written"}.`,
  );
}
