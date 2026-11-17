---
title: "instruction-maintenance"
---

# instruction-maintenance

Audit instruction drift, routing, and skill metadata; propose exact changes for human approval before mutation.

**Group:** [Coordination and maintenance](/groups/maintenance) · **Availability:** Authored here · **Scope:** project

## When to choose it

Instruction routing, dependencies, metadata, or policy documents appear missing, stale, conflicting, or unsuitable.

**Expected result:** A read-only audit and exact evidence-backed proposal, followed by only the human-approved instruction changes.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use instruction-maintenance to audit these routes. Give me the exact current and proposed changes, protected rules, and validation plan; wait for approval before editing.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

An audit does not authorize its own proposal. Changed scope or protected rules require renewed approval; never weaken security or owner-authority gates to unblock the work.

## Useful combinations

- [`writing-for-agents`](/skills/writing-for-agents) — The reader is an agent: you are authoring or revising skills, prompts, agent instructions, or their reference documents.
- [`isolated-workspace`](/skills/isolated-workspace) — A repository change needs a separate Git worktree or Jujutsu workspace instead of writes in the primary checkout.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Install a reviewed skill selection](/workflows/install-selected-skills)
- [Write guidance for an agent reader](/workflows/write-agent-facing-guidance)
- [Repair instruction drift through exact approval](/workflows/repair-instruction-routes)
- [Turn a completed issue into a small improvement](/workflows/learn-from-completed-work)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/instruction-maintenance/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
