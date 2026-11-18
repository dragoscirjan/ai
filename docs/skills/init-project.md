---
title: "init-project"
---

# init-project

Initialize or adopt project foundations, TypeScript tooling, or Godot GDScript tooling only when explicitly requested.

**Group:** [Utility](/groups/utility) · **Availability:** Authored here · **Scope:** project

## When to choose it

You explicitly want a new project foundation or to adopt the supported TypeScript or Godot GDScript tooling.

**Expected result:** An approved, project-specific foundation and the checks appropriate to that selected baseline.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/coding/init-project --skill init-project
```

This command selects only `init-project`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use init-project to propose the smallest foundation for this project. Show the tools, files, and installation effects before making changes.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires Git, mise, and Bun with Bun.TOML.parse. Initialized targets require an approved Node 24-or-newer/pnpm control plane; GDScript also needs an explicitly selected compatible Godot toolchain. Installation and lockfile updates require approval.

An inspection or coding request does not authorize initialization. Stop for baseline and installation approval; do not turn a documentation-only project into an application.

## Useful combinations

- [`isolated-workspace`](/skills/isolated-workspace) — A repository change needs a separate Git worktree or Jujutsu workspace instead of writes in the primary checkout.
- [`document-project`](/skills/document-project) — Implementation changes how readers use the project, or existing documentation blocks a real developer task.

These are optional companions, not extra declared requirements. Choose only what the task needs.



For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

The catalog records this entry as **initializer**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/coding/init-project/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
