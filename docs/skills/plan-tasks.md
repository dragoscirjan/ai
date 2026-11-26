---
title: "plan-tasks"
---

# plan-tasks

Divide an agreed specification or clear scope into bounded, verifiable tasks with explicit dependencies and completion evidence.

**Group:** [Productivity](/groups/productivity) · **Availability:** Authored here · **Scope:** project

## When to choose it

The scope or specification is clear enough to divide into bounded pieces of work.

**Expected result:** Verifiable tasks with real dependencies, completion evidence, and an explicit execution boundary.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/productivity/plan-tasks --skill plan-tasks
```

This command selects only `plan-tasks`.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use plan-tasks on this approved specification. Make tasks independently verifiable, show genuine dependencies, and do not start executing them.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

A task list does not authorize execution or delegation. Do not manufacture dependencies merely to make the list linear.

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/productivity/plan-tasks/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
