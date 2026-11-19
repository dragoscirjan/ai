---
title: "debloat"
---

# debloat

Prevent overengineering during design; simplify existing code, configuration, or dependencies while preserving required behavior, contracts, security, and operational needs.

**Group:** [Coding](/groups/coding) · **Availability:** Authored here · **Scope:** project

## When to choose it

A design risks unnecessary machinery or existing code and configuration have complexity that no longer earns its cost.

**Expected result:** A justified simpler design or scoped simplification that preserves required behavior, security, contracts, and operational needs.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/coding/debloat --skill debloat
```

This command selects only `debloat`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use debloat on this design. Identify unnecessary mechanisms, explain what must remain, and propose the smallest simplification before editing.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Simplicity is not permission to remove requirements, security controls, compatibility, or useful operational behavior. Keep unrelated cleanup outside the change.

## Useful combinations

- [`coding-with-rules`](/skills/coding-with-rules) — Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.
- [`code-review`](/skills/code-review) — You want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Implement a planned task](/workflows/implement-a-task)
- [Debloat a project](/workflows/debloat-a-project)

For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/coding/debloat/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
