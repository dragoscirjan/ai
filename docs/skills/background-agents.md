---
title: "background-agents"
---

# background-agents

When background delegation is authorized, keep the main agent available by assigning substantial work to task-scoped workers, tracking progress, and assessing concise results.

**Group:** [Utility](/groups/utility) · **Availability:** Authored here · **Scope:** project

## When to choose it

You authorize background workers for substantial work while keeping the main conversation available.

**Expected result:** Task-scoped workers, a durable task record, supported progress inspection, and concise results assessed by the parent.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/utility/background-agents --skill background-agents
```

This command selects only `background-agents`.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use background-agents for this task. Delegate implementation and verification to general-purpose background workers, keep this conversation available, and show me how to follow their progress.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires asynchronous child-agent execution and completion notification. Monitoring and steering depend on the harness.
- Writable workers require a parent-assigned working directory and exclusive write ownership.

Delegation needs task or project authority and asynchronous runtime support. Installation grants neither. Preserve worker limits, parent-assigned paths, one writer per directory, and final acceptance by the parent. Workers do not manage worktrees or branches. Report unsupported inspection or steering; do not silently switch to foreground execution.

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/utility/background-agents/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
