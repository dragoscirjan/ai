---
title: "tdd"
---

# tdd

Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.

**Group:** [Coding](/groups/coding) · **Availability:** Pinned upstream input; adaptation required · **Scope:** project

## When to choose it

You explicitly want test-first feature or bug work, or integration-test slices through public behavior.

**Expected result:** One observed failing behavior test and the smallest change that passes it at a user-confirmed seam. Refactoring is a later review-stage handoff, not part of this implementation loop.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/tdd --skill tdd
```

This command selects only `tdd`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

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

This is pinned upstream input, not a reviewed installed adaptation. Follow the catalogued adaptation instructions and review the output and legal notices before use. A source link or install command does not perform that adaptation.

## Useful combinations

- [`coding-with-rules`](/skills/coding-with-rules) — Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.
- [`systematic-debugging`](/skills/systematic-debugging) — A bug, regression, failing test, flaky result, or unexpected behavior needs a root cause rather than a guessed patch.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Plan a project or feature](/workflows/plan-a-project)
- [Implement a planned task](/workflows/implement-a-task)
- [Debug an application problem](/workflows/debug-a-problem)

For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the pinned upstream input](https://raw.githubusercontent.com/mattpocock/skills/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/tdd/SKILL.md). This link uses the immutable upstream revision `4ae2317ddb22b046e26455e4f9c9b3aaaf62212d`; there is no vendored copy here.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
