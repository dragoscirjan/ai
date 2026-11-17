---
title: "cleanup-workspaces"
---

# cleanup-workspaces

Audit integrated Git/Jujutsu workspaces, stale registrations, or authorized temporary lanes; apply only an approved exact cleanup plan.

**Group:** [Coordination and maintenance](/groups/maintenance) · **Availability:** Authored here · **Scope:** project

## When to choose it

You want to audit integrated workspaces, stale registrations, or explicitly authorized temporary lanes.

**Expected result:** An evidence-based cleanup plan, followed only by the exact approved removals and a post-cleanup audit.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use cleanup-workspaces to audit this repository. Show eligible and retained workspaces, exact paths and tips, and the plan ID. Do not remove anything yet.
```

## Requirements and boundaries

**Catalogued instruction requirements:** [`isolated-workspace`](/skills/isolated-workspace)

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires Bun and either Git with worktree support or Jujutsu 0.38 or newer with workspace support.

Resolve isolated-workspace first. Dirty, uncertain, or unproven lanes remain protected; audit permission is not removal permission. Never infer integration from a similar or squash-shaped diff alone.

## Useful combinations

- [`subagent-orchestration`](/skills/subagent-orchestration) — The operator has authorized bounded specialist, independent-review, or parallel work.
- [`retro`](/skills/retro) — A bounded completed work period has enough evidence to review what helped, failed, or should change.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Clean only proven, approved workspaces](/workflows/clean-integrated-workspaces)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/cleanup-workspaces/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
