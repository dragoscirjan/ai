---
title: "code-review"
---

# code-review

Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X".

**Group:** [Coding and quality](/groups/coding) · **Availability:** Upstream-derived; maintained here · **Scope:** project

## When to choose it

You want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.

**Expected result:** Separate standards and specification findings from two read-only review agents, integrated into one report.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use code-review for the diff since main against this issue. Keep both review agents read-only, report evidence and severity, and do not fix or merge anything.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires Git and a harness that can run two read-only subagents in parallel.

The workflow needs the harness's authorized subagent capability. A review is not permission to fix findings, spawn writers, merge, or release.

## Useful combinations

- [`subagent-orchestration`](/skills/subagent-orchestration) — The operator has authorized bounded specialist, independent-review, or parallel work.
- [`coding-with-rules`](/skills/coding-with-rules) — Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Implement a small approved change](/workflows/implement-a-small-change)
- [Build one behavior slice test-first](/workflows/build-test-first)
- [Remove complexity without removing requirements](/workflows/simplify-a-design)
- [Review a fixed diff from two perspectives](/workflows/review-against-standards-and-spec)
- [Delegate only the work that was authorized](/workflows/delegate-bounded-work)
- [Coordinate independent review without writers](/workflows/coordinate-read-only-review)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/code-review/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
