---
title: "coding-with-rules"
---

# coding-with-rules

Language-aware coding: resolve the base workflow, then select rules for the languages and file extensions being changed.

**Group:** [Coding](/groups/coding) · **Availability:** Authored here · **Scope:** project

## When to choose it

Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.

**Expected result:** The coding workflow with the relevant language references loaded in their declared order.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add dragoscirjan/ai --skill coding-with-rules
```

This command selects only `coding-with-rules`. It does not install the rest of the collection or the optional companions listed on this page.

Required instruction packages: [`coding`](/skills/coding#install-this-skill). If missing, install them separately before applying this skill. The command above does not install these requirements.

See [installation choices](/guide/install) for prerequisites and the optional reviewed manager.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use coding-with-rules for this change. Identify affected languages from runtime and file evidence, resolve coding first, and load only the applicable references.
```

## Requirements and boundaries

**Catalogued instruction requirements:** [`coding`](/skills/coding)

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

Missing or conflicting required references block the affected phase. Do not recreate removed language skills or load every language merely because it exists somewhere in the repository.

## Useful combinations

- [`tdd`](/skills/tdd) — You explicitly want test-first feature or bug work, or integration-test slices through public behavior.
- [`systematic-debugging`](/skills/systematic-debugging) — A bug, regression, failing test, flaky result, or unexpected behavior needs a root cause rather than a guessed patch.
- [`debloat`](/skills/debloat) — A design risks unnecessary machinery or existing code and configuration have complexity that no longer earns its cost.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Initialize only the foundation you need](/workflows/initialize-a-project)
- [Move a change out of the primary checkout](/workflows/protect-a-change)
- [Implement a small approved change](/workflows/implement-a-small-change)
- [Build one behavior slice test-first](/workflows/build-test-first)
- [Find the root cause before proposing a fix](/workflows/diagnose-a-failure)
- [Create a skeleton and stop](/workflows/scaffold-without-implementation)
- [Remove complexity without removing requirements](/workflows/simplify-a-design)
- [Coordinate independent review without writers](/workflows/coordinate-read-only-review)

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/coding/coding-with-rules/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
