---
title: "writing-for-agents"
---

# writing-for-agents

Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md.

**Group:** [Agentic work](/groups/agentic-work) · **Availability:** Upstream-derived; maintained here · **Scope:** project

## When to choose it

The reader is an agent: you are authoring or revising skills, prompts, agent instructions, or their reference documents.

**Expected result:** Usable agent-facing instructions with clear triggers, actions, conditional references, and completion boundaries.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/agentic-work/writing-for-agents --skill writing-for-agents
```

This command selects only `writing-for-agents`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use writing-for-agents to review this instruction draft. Keep rules beside the action they constrain and distinguish required instructions from optional handoffs.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Writing mechanics do not authorize policy changes. Existing instruction edits still need the project's audit, exact proposal, approval, and isolated-write process.

## Useful combinations

- [`instruction-maintenance`](/skills/instruction-maintenance) — Instruction routing, dependencies, metadata, or policy documents appear missing, stale, conflicting, or unsuitable.
- [`asd-ste100-technical`](/skills/asd-ste100-technical) — Technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.

These are optional companions, not extra declared requirements. Choose only what the task needs.



For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/agentic-work/writing-for-agents/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
