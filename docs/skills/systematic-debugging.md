---
title: "systematic-debugging"
---

# systematic-debugging

Diagnose bugs, failing tests, regressions, flaky behavior, and unexpected results through evidence, root-cause tracing, and single-hypothesis experiments before proposing fixes. Use for debugging in any language, including failures across component or environment boundaries.

**Group:** [Coding and quality](/groups/coding) · **Availability:** Upstream-derived; maintained here · **Scope:** project

## When to choose it

A bug, regression, failing test, flaky result, or unexpected behavior needs a root cause rather than a guessed patch.

**Expected result:** An evidence-backed diagnosis from controlled, single-hypothesis experiments, followed by a separately authorized fix and verification when appropriate.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use systematic-debugging on this failure. Reproduce and trace the root cause, test one hypothesis at a time, and stop before changing production code unless I approve the fix.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Do not stack speculative fixes or treat a symptom disappearing as a proven cause. Preserve meaningful tests and disclose reproduction or environment limits.

## Useful combinations

- [`coding-with-rules`](/skills/coding-with-rules) — Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.
- [`tdd`](/skills/tdd) — You explicitly want test-first feature or bug work, or integration-test slices through public behavior.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Find the root cause before proposing a fix](/workflows/diagnose-a-failure)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/systematic-debugging/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
