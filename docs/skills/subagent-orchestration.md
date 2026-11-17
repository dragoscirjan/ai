---
title: "subagent-orchestration"
---

# subagent-orchestration

Before delegating, bound child-agent work, assign read/write lanes, integrate results, review, validate, and clean temporary lanes.

**Group:** [Coordination and maintenance](/groups/maintenance) · **Availability:** Authored here · **Scope:** project

## When to choose it

The operator has authorized bounded specialist, independent-review, or parallel work.

**Expected result:** Clear handoffs and ownership, isolated writer lanes when needed, integrated results, and parent-owned validation.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use subagent-orchestration for two authorized read-only reviewers. Give each a bounded question and evidence requirement; keep all writes with the parent.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires a harness with child-agent support; writable parallel lanes also need owner-approved workspace creation and exact-lane cleanup procedures.

Complexity alone is not delegation authority. Read-only agents must remain read-only; concurrent writers need separate owned lanes, and child success does not replace integration checks.

## Useful combinations

- [`code-review`](/skills/code-review) — You want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.
- [`isolated-workspace`](/skills/isolated-workspace) — A repository change needs a separate Git worktree or Jujutsu workspace instead of writes in the primary checkout.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Divide agreed scope into verifiable tasks](/workflows/plan-bounded-tasks)
- [Review a fixed diff from two perspectives](/workflows/review-against-standards-and-spec)
- [Delegate only the work that was authorized](/workflows/delegate-bounded-work)
- [Coordinate independent review without writers](/workflows/coordinate-read-only-review)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/subagent-orchestration/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
