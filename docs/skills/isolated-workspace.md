---
title: "isolated-workspace"
---

# isolated-workspace

Create or reuse an isolated Git worktree or Jujutsu workspace before mutation, using an explicit VCS and branch or bookmark.

**Group:** [Setup](/groups/setup) · **Availability:** Authored here · **Scope:** project

## When to choose it

A repository change needs a separate Git worktree or Jujutsu workspace instead of writes in the primary checkout.

**Expected result:** An explicit VCS, branch or bookmark, base revision, absolute workspace path, and reviewed creation or reuse plan.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use isolated-workspace with Git to plan a change/example branch from main. Show the exact path, base commit, and plan ID before creation.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires Bun and either Git with worktree support or Jujutsu 0.38 or newer with workspace support.

Do not reset, stash, force, remove another workspace, or silently reuse someone else's work. Plan approval covers the named workspace operation, not every later source change.

## Useful combinations

- [`coding-with-rules`](/skills/coding-with-rules) — Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.
- [`cleanup-workspaces`](/skills/cleanup-workspaces) — You want to audit integrated workspaces, stale registrations, or explicitly authorized temporary lanes.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Install a reviewed skill selection](/workflows/install-selected-skills)
- [Initialize only the foundation you need](/workflows/initialize-a-project)
- [Move a change out of the primary checkout](/workflows/protect-a-change)
- [Implement a small approved change](/workflows/implement-a-small-change)
- [Build one behavior slice test-first](/workflows/build-test-first)
- [Create a skeleton and stop](/workflows/scaffold-without-implementation)
- [Remove complexity without removing requirements](/workflows/simplify-a-design)
- [Delegate only the work that was authorized](/workflows/delegate-bounded-work)
- [Repair instruction drift through exact approval](/workflows/repair-instruction-routes)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/isolated-workspace/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
