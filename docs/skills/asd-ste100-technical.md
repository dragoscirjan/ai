---
title: "asd-ste100-technical"
---

# asd-ste100-technical

Technical writing: use ASD-STE100-inspired plain language for software responses and documentation.

**Group:** [Documentation](/groups/documentation) · **Availability:** Authored here · **Scope:** project

## When to choose it

Technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.

**Expected result:** Direct, usable prose with stable terminology, explicit actors, exact commands, and honest uncertainty.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/documentation/asd-ste100-technical --skill asd-ste100-technical
```

This command selects only `asd-ste100-technical`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use asd-ste100-technical to revise this procedure. Put prerequisites before actions, keep commands exact, and preserve every safety condition and uncertainty.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Plain language is not a license to simplify away technical meaning. This is STE-inspired guidance, not a claim of certification or a fixed approved-word list.

## Useful combinations

- [`document-project`](/skills/document-project) — Implementation changes how readers use the project, or existing documentation blocks a real developer task.
- [`unslop`](/skills/unslop) — A draft contains generic phrasing, repetitive structure, filler, or claims that do not help the reader act.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Document a project](/workflows/document-a-project)

For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

Install this skill only through an approved category selection or an explicit single-skill request.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/documentation/asd-ste100-technical/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
