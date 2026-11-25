---
title: "grill-me"
---

# grill-me

A relentless interview to sharpen a plan or design.

**Group:** [Productivity](/groups/productivity) · **Availability:** Upstream-derived; maintained here · **Scope:** project

## When to choose it

You want to explicitly start the grilling interview through a small local composition.

**Expected result:** An interview that pressures unresolved decisions until the direction is clearer.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/productivity/grill-me --skill grill-me
```

This command selects only `grill-me`. It does not install the rest of the collection or the optional companions listed on this page.

Required instruction packages: [`grilling`](/skills/grilling#install-this-skill). If any are missing, the agent must stop and ask you to install them before continuing. The command above does not install these requirements.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use grill-me to start an explicit interview about this plan before I commit to it. Work through the uncertain decisions with me.
```

## Requirements and boundaries

**Catalogued instruction requirements:** [`grilling`](/skills/grilling)

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

This entry is explicitly invoked, not automatically model-invoked. It requires the separately installed grilling instructions; the wrapper does not contain the interview itself.

## Useful combinations

- [`initiative`](/skills/initiative) — An idea needs an agreed problem, outcome, scope, constraints, and success measures before solution work.
- [`specify`](/skills/specify) — The direction is agreed but observable behavior, acceptance criteria, constraints, or test boundaries remain unclear.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Plan a project or feature](/workflows/plan-a-project)

For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/productivity/grill-me/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
