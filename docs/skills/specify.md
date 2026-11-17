---
title: "specify"
---

# specify

Turn agreed decisions into a compact specification with observable behavior, acceptance criteria, constraints, and test boundaries.

**Group:** [Discovery and planning](/groups/discovery) · **Availability:** Authored here · **Scope:** project

## When to choose it

The direction is agreed but observable behavior, acceptance criteria, constraints, or test boundaries remain unclear.

**Expected result:** A compact specification with decisions and acceptance criteria that can be checked.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use specify for this agreed direction. Resolve ambiguous behavior with me, record acceptance criteria and exclusions, and stop before implementation.
```

## Requirements and boundaries

**Catalogued instruction requirements:** [`grilling`](/skills/grilling)

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Do not invent unresolved decisions or imply approval for implementation. The declared grilling requirement must be available.

## Useful combinations

- [`plan-tasks`](/skills/plan-tasks) — The scope or specification is clear enough to divide into bounded pieces of work.
- [`tdd`](/skills/tdd) — You explicitly want test-first feature or bug work, or integration-test slices through public behavior.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Agree on behavior before task execution](/workflows/specify-observable-behavior)
- [Divide agreed scope into verifiable tasks](/workflows/plan-bounded-tasks)
- [Challenge a plan without implementing it](/workflows/challenge-a-design)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/specify/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
