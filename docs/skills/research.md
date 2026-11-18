---
title: "research"
---

# research

Research a question, compare alternatives, or investigate feasibility; report verified evidence, uncertainty, and limits.

**Group:** [Productivity](/groups/productivity) · **Availability:** Authored here · **Scope:** project

## When to choose it

A decision depends on facts, alternatives, feasibility, or evidence that you do not yet have.

**Expected result:** A bounded research answer with sources, uncertainty, limits, and a recommendation when the evidence supports one.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add dragoscirjan/ai --skill research
```

This command selects only `research`. It does not install the rest of the collection or the optional companions listed on this page.

Required instruction packages: [`grilling`](/skills/grilling#install-this-skill). If missing, install them separately before applying this skill. The command above does not install these requirements.

See [installation choices](/guide/install) for prerequisites and the optional reviewed manager.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use research to compare these approaches for our constraints. Clarify the decision first, distinguish verified facts from assumptions, and do not implement anything.
```

## Requirements and boundaries

**Catalogued instruction requirements:** [`grilling`](/skills/grilling)

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Research does not grant installation or implementation authority. Resolve the declared grilling requirement before using this composition.

## Useful combinations

- [`initiative`](/skills/initiative) — An idea needs an agreed problem, outcome, scope, constraints, and success measures before solution work.
- [`wait-what`](/skills/wait-what) — The last answer is hard to understand or omits context needed to follow the current proposal.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Research before choosing an approach](/workflows/research-a-decision)
- [Turn an idea into an outcome-level brief](/workflows/shape-an-initiative)
- [Challenge a plan without implementing it](/workflows/challenge-a-design)

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/productivity/research/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
