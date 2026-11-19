---
title: "document-project"
---

# document-project

Maintain task-based developer documentation during implementation; create or refactor VitePress/MkDocs documentation within approved scope.

**Group:** [Documentation](/groups/documentation) · **Availability:** Authored here · **Scope:** project

## When to choose it

Implementation changes how readers use the project, or existing documentation blocks a real developer task.

**Expected result:** Task-first documentation with prerequisites, executable steps, expected results, and an appropriate maintenance path.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/documentation/document-project --skill document-project
```

This command selects only `document-project`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use document-project to improve this first-use task. Follow existing documentation conventions, show prerequisites and expected results, and propose new tooling separately.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

A documentation request does not implicitly authorize a website, migration, plugin, new toolchain, or deployment. Approve that baseline before creating it.

## Useful combinations

- [`asd-ste100-technical`](/skills/asd-ste100-technical) — Technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.
- [`unslop`](/skills/unslop) — A draft contains generic phrasing, repetitive structure, filler, or claims that do not help the reader act.
- [`archify`](/skills/archify) — You need an explorable standalone HTML diagram for relationships, workflows, states, schemas, or other supported structures.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Implement a planned task](/workflows/implement-a-task)
- [Document a project](/workflows/document-a-project)
- [Debloat a project](/workflows/debloat-a-project)

For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

The catalog records this entry as **recommended**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/documentation/document-project/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
