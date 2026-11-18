---
title: "Coding"
---

# Coding

Scaffold, implement, test, diagnose, simplify, and review code.

Choose by the task you have now. These are the collection's groups, including external recommendations. They are not a mandatory delivery pipeline.

## [`coding`](/skills/coding)

Design, implement, refactor, review, or test code under project conventions, risk-based security, and behavior-focused checks.

**Choose it when:** You are designing, implementing, refactoring, reviewing, or testing source code under project conventions.

## [`coding-with-rules`](/skills/coding-with-rules)

Language-aware coding: resolve the base workflow, then select rules for the languages and file extensions being changed.

**Choose it when:** Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.

## [`scaffold`](/skills/scaffold)

Create source skeletons for an approved feature, validate their structure, and stop before implementing behavior.

**Choose it when:** An approved feature needs reviewable source skeletons before its behavior is implemented.

## [`code-review`](/skills/code-review)

Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X".

**Choose it when:** You want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.

## [`systematic-debugging`](/skills/systematic-debugging)

Diagnose bugs, failing tests, regressions, flaky behavior, and unexpected results through evidence, root-cause tracing, and single-hypothesis experiments before proposing fixes. Use for debugging in any language, including failures across component or environment boundaries.

**Choose it when:** A bug, regression, failing test, flaky result, or unexpected behavior needs a root cause rather than a guessed patch.

## [`tdd`](/skills/tdd)

Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.

**Choose it when:** You explicitly want test-first feature or bug work, or integration-test slices through public behavior.

## [`debloat`](/skills/debloat)

Prevent overengineering during design; simplify existing code, configuration, or dependencies while preserving required behavior, contracts, security, and operational needs.

**Choose it when:** A design risks unnecessary machinery or existing code and configuration have complexity that no longer earns its cost.

## Try a workflow

- [Implement a small approved change](/workflows/implement-a-small-change) — The requested behavior and authority to change it are already clear.
- [Build one behavior slice test-first](/workflows/build-test-first) — The owner explicitly wants test-first development and the behavior is agreed.
- [Find the root cause before proposing a fix](/workflows/diagnose-a-failure) — A test, build, runtime result, or previously working behavior fails unexpectedly.
- [Create a skeleton and stop](/workflows/scaffold-without-implementation) — A feature's source structure needs review before behavioral implementation.
- [Remove complexity without removing requirements](/workflows/simplify-a-design) — Existing machinery or a proposed design is harder than the required behavior needs.
- [Review a fixed diff from two perspectives](/workflows/review-against-standards-and-spec) — A branch or change needs standards and specification review against a clear baseline.
