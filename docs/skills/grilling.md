---
title: "grilling"
---

# grilling

Stress-test a plan or decision through an explicit interview.

**Group:** [Productivity](/groups/productivity) · **Availability:** Upstream-only; approved external setup · **Scope:** project

## When to choose it

A plan or design needs a focused interview rather than another polished document built on assumptions.

**Expected result:** Sharper decisions and surfaced gaps from the upstream interview workflow.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/mattpocock/skills/tree/95249b0b49782349740fd9b8c6ce32b4e59e497a/skills/productivity/grilling --skill grilling
```

This command selects only `grilling`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use grilling to pressure-test this design. Ask about unresolved decisions, use repository evidence when available, and do not implement the plan.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

This is an upstream-only entry, not a local vendored skill. Install the catalog-pinned source through an approved setup before relying on it.

## Useful combinations

- [`research`](/skills/research) — A decision depends on facts, alternatives, feasibility, or evidence that you do not yet have.
- [`wait-what`](/skills/wait-what) — The last answer is hard to understand or omits context needed to follow the current proposal.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Plan a project or feature](/workflows/plan-a-project)

For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://raw.githubusercontent.com/mattpocock/skills/95249b0b49782349740fd9b8c6ce32b4e59e497a/skills/productivity/grilling/SKILL.md). This link uses the immutable upstream revision `95249b0b49782349740fd9b8c6ce32b4e59e497a`; there is no vendored copy here.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
