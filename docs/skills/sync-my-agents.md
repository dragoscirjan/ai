---
title: "sync-my-agents"
---

# sync-my-agents

Review AGENTS.md and referenced instruction documents, then apply only approved changes.

**Group:** [Agentic work](/groups/agentic-work) · **Availability:** Authored here · **Scope:** personal

## When to choose it

You explicitly want to review AGENTS.md and its referenced instruction documents.

**Expected result:** Necessary instruction diffs, applied only after approval and checked against the existing project policy.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. This is a personal installation. Invoke the skill explicitly; it does not register commands or install other skills.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/agentic-work/sync-my-agents --skill sync-my-agents --global
```

This command selects only `sync-my-agents`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use sync-my-agents to review AGENTS.md and its referenced instruction documents. Inspect project evidence, clarify unresolved decisions, and show exact diffs before editing. Do not install skills or impose a template bundle.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Instruction dependencies mean documents, not skill installation prerequisites. Missing required skills stop the affected phase. Do not install skills, tools, or dependencies, register commands, or publish changes.

## Useful combinations



These are optional companions, not extra declared requirements. Choose only what the task needs.



For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/agentic-work/sync-my-agents/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
