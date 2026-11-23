---
title: "scaffold"
---

# scaffold

Create source skeletons for an approved feature, validate their structure, and stop before implementing behavior.

**Group:** [Coding](/groups/coding) · **Availability:** Authored here · **Scope:** project

## When to choose it

An approved feature needs reviewable source skeletons before its behavior is implemented.

**Expected result:** Structurally valid source files with explicit fail-fast placeholders and structure checks.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/coding/scaffold --skill scaffold
```

This command selects only `scaffold`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use scaffold for this approved feature. Create the source skeleton and fail-fast placeholders, check its structure, and stop before implementing behavior.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Scaffolding ends before behavioral implementation. Do not silently convert the request into a completed feature or hide placeholder failures behind success-shaped defaults.

## Useful combinations

- [`isolated-workspace`](/skills/isolated-workspace) — A modifying task needs a dedicated branch or bookmark and a choice between the current checkout and a separate workspace.
- [`coding-with-rules`](/skills/coding-with-rules) — Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Implement a planned task](/workflows/implement-a-task)

For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

Install this skill only through an approved category selection or an explicit single-skill request.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/coding/scaffold/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
