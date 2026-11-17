---
title: "document-project"
---

# document-project

Maintain task-based developer documentation during implementation; create or refactor VitePress/MkDocs documentation within approved scope.

**Group:** [Documentation and communication](/groups/writing) · **Availability:** Authored here · **Scope:** project

## When to choose it

Implementation changes how readers use the project, or existing documentation blocks a real developer task.

**Expected result:** Task-first documentation with prerequisites, executable steps, expected results, and an appropriate maintenance path.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use document-project to improve this first-use task. Follow existing documentation conventions, show prerequisites and expected results, and propose new tooling separately.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

A documentation request does not implicitly authorize a website, migration, plugin, new toolchain, or deployment. Approve that baseline before creating it.

## Useful combinations

- [`asd-ste100-technical`](/skills/asd-ste100-technical) — Technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.
- [`unslop`](/skills/unslop) — A draft contains generic phrasing, repetitive structure, filler, or claims that do not help the reader act.
- [`archify`](/skills/archify) — You need an explorable standalone HTML diagram for relationships, workflows, states, schemas, or other supported structures.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Initialize only the foundation you need](/workflows/initialize-a-project)
- [Move a change out of the primary checkout](/workflows/protect-a-change)
- [Implement a small approved change](/workflows/implement-a-small-change)
- [Build one behavior slice test-first](/workflows/build-test-first)
- [Remove complexity without removing requirements](/workflows/simplify-a-design)
- [Keep a developer task usable](/workflows/maintain-task-based-docs)
- [Shorten a technical answer without losing meaning](/workflows/shorten-without-loss)
- [Explain relationships with interactive HTML](/workflows/explain-with-archify)
- [Deliver an editable image diagram](/workflows/draw-with-excalidraw)
- [Turn a completed issue into a small improvement](/workflows/learn-from-completed-work)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **recommended**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/document-project/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
