---
title: "systematic-debugging"
---

# systematic-debugging

Diagnose bugs, failing tests, regressions, flaky behavior, and unexpected results through evidence, root-cause tracing, and single-hypothesis experiments before proposing fixes. Use for debugging in any language, including failures across component or environment boundaries.

**Group:** [Coding](/groups/coding) · **Availability:** Upstream-derived; maintained here · **Scope:** project

## When to choose it

A bug, regression, failing test, flaky result, or unexpected behavior needs a root cause rather than a guessed patch.

**Expected result:** An evidence-backed diagnosis from controlled, single-hypothesis experiments, followed by a separately authorized fix and verification when appropriate.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add dragoscirjan/ai --skill systematic-debugging
```

This command selects only `systematic-debugging`. It does not install the rest of the collection or the optional companions listed on this page.

See [installation choices](/guide/install) for prerequisites and the optional reviewed manager.

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

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/coding/systematic-debugging/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
