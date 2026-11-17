---
title: "plan-tasks"
---

# plan-tasks

Divide an agreed specification or clear scope into bounded, verifiable tasks with explicit dependencies and completion evidence.

**Group:** [Discovery and planning](/groups/discovery) · **Availability:** Authored here · **Scope:** project

## When to choose it

The scope or specification is clear enough to divide into bounded pieces of work.

**Expected result:** Verifiable tasks with real dependencies, completion evidence, and an explicit execution boundary.

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

## Useful combinations

- [`specify`](/skills/specify) — The direction is agreed but observable behavior, acceptance criteria, constraints, or test boundaries remain unclear.
- [`subagent-orchestration`](/skills/subagent-orchestration) — The operator has authorized bounded specialist, independent-review, or parallel work.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Agree on behavior before task execution](/workflows/specify-observable-behavior)
- [Divide agreed scope into verifiable tasks](/workflows/plan-bounded-tasks)
- [Create a skeleton and stop](/workflows/scaffold-without-implementation)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/plan-tasks/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
