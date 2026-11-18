---
title: "initiative"
---

# initiative

Turn an idea or research into an agreed brief covering the problem, outcomes, scope, constraints, and success measures.

**Group:** [Productivity](/groups/productivity) · **Availability:** Authored here · **Scope:** project

## When to choose it

An idea needs an agreed problem, outcome, scope, constraints, and success measures before solution work.

**Expected result:** An outcome-level brief that separates the problem from a prematurely selected implementation.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add dragoscirjan/ai --skill initiative
```

This command selects only `initiative`. It does not install the rest of the collection or the optional companions listed on this page.

Required instruction packages: [`grilling`](/skills/grilling#install-this-skill). If missing, install them separately before applying this skill. The command above does not install these requirements.

See [installation choices](/guide/install) for prerequisites and the optional reviewed manager.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use initiative to turn this idea into a brief. Interview me about outcomes and constraints; keep solution choices open until the brief is agreed.
```

## Requirements and boundaries

**Catalogued instruction requirements:** [`grilling`](/skills/grilling)

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

A brief is not a specification, task plan, or implementation authorization. Resolve grilling first and stop when the outcome-level agreement is complete.

## Useful combinations

- [`research`](/skills/research) — A decision depends on facts, alternatives, feasibility, or evidence that you do not yet have.
- [`specify`](/skills/specify) — The direction is agreed but observable behavior, acceptance criteria, constraints, or test boundaries remain unclear.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Research before choosing an approach](/workflows/research-a-decision)
- [Turn an idea into an outcome-level brief](/workflows/shape-an-initiative)

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/productivity/initiative/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
