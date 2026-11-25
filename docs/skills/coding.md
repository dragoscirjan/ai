---
title: "coding"
---

# coding

Design, implement, refactor, review, or test code under project conventions, risk-based security, and behavior-focused checks.

**Group:** [Coding](/groups/coding) · **Availability:** Authored here · **Scope:** project

## When to choose it

You are designing, implementing, refactoring, reviewing, or testing source code under project conventions.

**Expected result:** A small, behavior-preserving or explicitly approved change with risk-appropriate tests and accounted-for quality gates.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/coding/coding --skill coding
```

This command selects only `coding`.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use coding for this approved change. Inspect project conventions, choose the smallest correct design, add behavior-focused checks, and report unrun gates honestly.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Tool installation, baseline changes, unsafe scope expansion, and owner-controlled operations still need approval. This base workflow is language-neutral; follow the target project's language-specific standards.

## Source and harness support

The catalog records this entry as **detected**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/coding/coding/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
