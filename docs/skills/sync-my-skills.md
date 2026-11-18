---
title: "sync-my-skills"
---

# sync-my-skills

Synchronize project skills and agent instructions through a guided, approved plan.

**Group:** [Agentic work](/groups/agentic-work) · **Availability:** Authored here · **Scope:** personal

## When to choose it

You want to choose project skills and review an optional instruction bundle without replacing custom policy blindly.

**Expected result:** A reviewed selection and exact apply plan, followed by installed-state verification when you approve the writes.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. This is a personal installation. Command registration and project synchronization are separate optional actions.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/agentic-work/sync-my-skills --skill sync-my-skills --global
```

This command selects only `sync-my-skills`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use sync-my-skills to inspect this project. Recommend skills, ask about the remaining entries, and assess instructions separately. Do not apply changes yet.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires Node.js 22.20 or newer, Git, and the pinned yaml dependency installed during approved personal setup. Target writes require an isolated Git worktree.

Inspection is not permission to install, remove old skills, adopt instructions, update manager code, or change personal configuration. The manager is a personal installation; selected project skills are a separate operation.

## Useful combinations

- [`isolated-workspace`](/skills/isolated-workspace) — A repository change needs a separate Git worktree or Jujutsu workspace instead of writes in the primary checkout.
- [`instruction-maintenance`](/skills/instruction-maintenance) — Instruction routing, dependencies, metadata, or policy documents appear missing, stale, conflicting, or unsuitable.

These are optional companions, not extra declared requirements. Choose only what the task needs.



For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/agentic-work/sync-my-skills/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
