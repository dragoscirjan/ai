---
title: "tdd"
---

# tdd

Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.

**Group:** [Coding and quality](/groups/coding) · **Availability:** Upstream-derived; maintained here · **Scope:** project

## When to choose it

You explicitly want test-first feature or bug work, or integration-test slices through public behavior.

**Expected result:** One observed failing behavior test and the smallest change that passes it at a user-confirmed seam. Refactoring is a later review-stage handoff, not part of this implementation loop.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use tdd for this agreed behavior. Start with one public-interface integration slice, demonstrate the expected failure, then implement only enough to pass it.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Confirm the public seams with the user before writing tests. Do not write a large speculative test batch or claim an unobserved red phase. Stop the implementation loop at green; refactoring belongs to a later authorized review stage.

## Useful combinations

- [`coding-with-rules`](/skills/coding-with-rules) — Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.
- [`systematic-debugging`](/skills/systematic-debugging) — A bug, regression, failing test, flaky result, or unexpected behavior needs a root cause rather than a guessed patch.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Agree on behavior before task execution](/workflows/specify-observable-behavior)
- [Implement a small approved change](/workflows/implement-a-small-change)
- [Build one behavior slice test-first](/workflows/build-test-first)
- [Find the root cause before proposing a fix](/workflows/diagnose-a-failure)
- [Create a skeleton and stop](/workflows/scaffold-without-implementation)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/tdd/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
