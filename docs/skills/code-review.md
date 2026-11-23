---
title: "code-review"
---

# code-review

Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X".

**Group:** [Coding](/groups/coding) · **Availability:** Pinned upstream input; adaptation required · **Scope:** project

## When to choose it

You want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.

**Expected result:** Separate standards and specification findings from two read-only review agents, integrated into one report.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/mattpocock/skills/tree/59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/code-review --skill code-review
```

This command selects only `code-review`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

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

This is pinned upstream input, not a reviewed installed adaptation. Follow the catalogued adaptation instructions and review the output and legal notices before use. A source link or install command does not perform that adaptation.

## Useful combinations

- [`subagent-orchestration`](/skills/subagent-orchestration) — The operator has authorized bounded specialist, independent-review, or parallel work.
- [`coding-with-rules`](/skills/coding-with-rules) — Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Implement a planned task](/workflows/implement-a-task)
- [Debloat a project](/workflows/debloat-a-project)

For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

Install this skill only through an approved category selection or an explicit single-skill request.

[Read the pinned upstream input](https://raw.githubusercontent.com/mattpocock/skills/59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/code-review/SKILL.md). This link uses the immutable upstream revision `59db609eb1e18aaf59b63284d0e52255aff0c63c`; there is no vendored copy here.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
