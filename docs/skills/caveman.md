---
title: "caveman"
---

# caveman

Concise communication that preserves complete technical substance.

**Group:** [Documentation](/groups/documentation) · **Availability:** Authored here · **Scope:** project

## When to choose it

You explicitly want terse technical fragments and your project policy permits that style.

**Expected result:** A fragment-style answer that preserves technical substance. The mode stays active until you explicitly disable it.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/documentation/caveman --skill caveman
```

This command selects only `caveman`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use caveman mode for this summary where project policy permits fragments. Preserve commands, evidence, constraints, risks, and uncertainty. Expand when safety or ordered instructions need it.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

This mode drops articles and uses fragments. It is an alternative to ASD and Unslop whole-sentence guidance, not a finishing pass after them. Disable Caveman before returning to a whole-sentence route. Never use style to override project policy or omit safety details.

## Useful combinations

- [`plan-tasks`](/skills/plan-tasks) — The scope or specification is clear enough to divide into bounded pieces of work.
- [`retro`](/skills/retro) — A bounded completed work period has enough evidence to review what helped, failed, or should change.

These are optional companions, not extra declared requirements. Choose only what the task needs.



For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

Install this skill only through an approved category selection or an explicit single-skill request.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/documentation/caveman/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
