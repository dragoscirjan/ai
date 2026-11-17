---
title: "retro"
---

# retro

Review a bounded work period for evidence-backed process improvements, including workflow, instructions, tools, and handoffs.

**Group:** [Productivity](/groups/productivity) · **Availability:** Authored here · **Scope:** project

## When to choose it

A bounded completed work period has enough evidence to review what helped, failed, or should change.

**Expected result:** A small set of evidence-backed process improvements with clear next actions and appropriate ownership.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add dragoscirjan/ai --skill retro
```

This command selects only `retro`. It does not install the rest of the collection or the optional companions listed on this page.

See [installation choices](/guide/install) for prerequisites and the optional reviewed manager.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use retro for this completed issue. Separate evidence from impressions, identify a few useful improvements, and propose any instruction or tool changes rather than applying them.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

A retrospective does not grant permission to rewrite policy, replace tools, or clean workspaces. Route each proposed change through its own approval boundary.

## Useful combinations

- [`instruction-maintenance`](/skills/instruction-maintenance) — Instruction routing, dependencies, metadata, or policy documents appear missing, stale, conflicting, or unsuitable.
- [`wait-what`](/skills/wait-what) — The last answer is hard to understand or omits context needed to follow the current proposal.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Clean only proven, approved workspaces](/workflows/clean-integrated-workspaces)
- [Turn a completed issue into a small improvement](/workflows/learn-from-completed-work)

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/productivity/retro/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
